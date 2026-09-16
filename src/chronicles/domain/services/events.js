import { createRulesetIndexes } from '../../config/index.js';
import { createDomainEvent } from '../domainEvents.js';
import { addResource } from './resources.js';

const EVENT_RNG_MULTIPLIER = 1664525;
const EVENT_RNG_INCREMENT = 1013904223;

function ensureEventState(state) {
  const events = (state.run.events ||= {});
  events.queue ||= [];
  events.states ||= {};
  events.history ||= [];
  events.pendingId ||= null;
  events.rngState = Number.isInteger(events.rngState) ? events.rngState >>> 0 : 1;
  events.lastDeckDrawAtMs ||= {};
  return events;
}

function nextRandom(events) {
  events.rngState = (EVENT_RNG_MULTIPLIER * events.rngState + EVENT_RNG_INCREMENT) >>> 0;
  return events.rngState / 0x100000000;
}

function conditionsMet(state, conditions = []) {
  return conditions.every((condition) => {
    if (condition.type === 'node_completed') return Boolean(state.run.nodes.completed[condition.nodeId]);
    if (condition.type === 'goal_completed') return state.run.goals.states[condition.goalId]?.status === 'archived';
    if (condition.type === 'flag_set') return state.run.flags[condition.flag] === condition.value;
    if (condition.type === 'era_reached') return state.run.eraId === condition.eraId;
    return false;
  });
}

function phaseOpen(state, event) {
  const window = event.phaseWindow || {};
  if (window.eraIds && !window.eraIds.includes(state.run.eraId)) return false;
  if (window.minActiveMs != null && state.run.clock.activeMs < window.minActiveMs) return false;
  if (window.maxActiveMs != null && state.run.clock.activeMs > window.maxActiveMs) return false;
  return true;
}

function activateNext(state, ports) {
  const runtime = ensureEventState(state);
  if (runtime.pendingId || runtime.queue.length === 0) return [];
  const eventId = runtime.queue.shift();
  runtime.pendingId = eventId;
  runtime.states[eventId].status = 'pending';
  return [createDomainEvent('event_pending', { eventId }, state, ports)];
}

export function isEventEligible(state, event) {
  const runtime = ensureEventState(state);
  const tracked = runtime.states[event.id];
  if (tracked?.status && !event.repeatable) return false;
  if (!phaseOpen(state, event) || !conditionsMet(state, event.preconditions)) return false;
  if (event.cooldownMs && tracked?.resolvedAtMs + event.cooldownMs > state.run.clock.simulationMs) return false;
  return true;
}

export function queueEvent(state, ruleset, eventId, ports, options = {}) {
  const eventConfig = ruleset.events.find((event) => event.id === eventId);
  if (!eventConfig) return { ok: false, reason: 'UNKNOWN_EVENT', eventId, events: [] };
  const runtime = ensureEventState(state);
  if (runtime.states[eventId]?.status && !options.force && !eventConfig.repeatable) {
    return { ok: false, reason: 'EVENT_ALREADY_TRACKED', eventId, events: [] };
  }
  runtime.states[eventId] = { status: 'queued', queuedAtMs: state.run.clock.simulationMs };
  runtime.queue.push(eventId);
  runtime.queue.sort((a, b) => (ruleset.events.find((event) => event.id === b).priority || 0) - (ruleset.events.find((event) => event.id === a).priority || 0));
  return { ok: true, eventId, events: [createDomainEvent('event_queued', { eventId }, state, ports), ...activateNext(state, ports)] };
}

export function queueEventsForTrigger(state, ruleset, trigger, ports) {
  const events = [];
  for (const event of ruleset.events) {
    if (event.trigger?.type !== trigger.type) continue;
    if (trigger.goalId && event.trigger.goalId !== trigger.goalId) continue;
    if (trigger.nodeId && event.trigger.nodeId !== trigger.nodeId) continue;
    if (!isEventEligible(state, event)) continue;
    const queued = queueEvent(state, ruleset, event.id, ports);
    if (queued.ok) events.push(...queued.events);
  }
  return events;
}

export function queueEventsForGoal(state, ruleset, goalId, ports) {
  return queueEventsForTrigger(state, ruleset, { type: 'goal_completed', goalId }, ports);
}

export function queueEventsForNode(state, ruleset, nodeId, ports) {
  return queueEventsForTrigger(state, ruleset, { type: 'node_completed', nodeId }, ports);
}

export function queueDueDeckEvents(state, ruleset, ports) {
  const runtime = ensureEventState(state);
  const decks = [...new Set(ruleset.events.filter((event) => event.trigger?.type === 'deck').map((event) => event.deck))];
  const events = [];
  for (const deckId of decks) {
    if (runtime.pendingId || runtime.queue.length) break;
    if (state.run.clock.activeMs - (runtime.lastDeckDrawAtMs[deckId] || 0) < 60000) continue;
    const eligible = ruleset.events.filter((event) => event.deck === deckId && event.trigger?.type === 'deck' && isEventEligible(state, event));
    if (!eligible.length) continue;
    const totalWeight = eligible.reduce((total, event) => total + (event.weight || 1), 0);
    let threshold = nextRandom(runtime) * totalWeight;
    const chosen = eligible.find((event) => ((threshold -= event.weight || 1) < 0)) || eligible.at(-1);
    runtime.lastDeckDrawAtMs[deckId] = state.run.clock.simulationMs;
    events.push(...queueEvent(state, ruleset, chosen.id, ports).events);
  }
  return events;
}

export function eventBlocksNode(state, ruleset, node) {
  const runtime = ensureEventState(state);
  const indexes = createRulesetIndexes(ruleset).events;
  const blockingId = [runtime.pendingId, ...runtime.queue].find((eventId) => {
    const branchGroup = indexes[eventId]?.blocks?.branchGroup;
    return Boolean(branchGroup && branchGroup === node.branchGroup);
  });
  return Boolean(blockingId);
}

export function resolveEvent(state, ruleset, eventId, choiceId, ports, options = {}) {
  const runtime = ensureEventState(state);
  if (runtime.pendingId !== eventId) return { ok: false, reason: 'EVENT_NOT_PENDING', events: [] };
  const event = createRulesetIndexes(ruleset).events[eventId];
  const choice = event?.choices?.find((candidate) => candidate.id === choiceId);
  if (!choice) return { ok: false, reason: 'UNKNOWN_EVENT_CHOICE', events: [] };
  const applied = choice.purchaseNodeId && options.applyPurchaseNode
    ? options.applyPurchaseNode(choice.purchaseNodeId)
    : { ok: true, events: [] };
  if (!applied.ok) return applied;
  const effectEvents = [];
  for (const effect of choice.effects || []) {
    if (effect.type === 'grant_resource') effectEvents.push(...addResource(state, effect.resourceId, effect.amount, ruleset, ports));
    if (effect.type === 'set_flag') state.run.flags[effect.flag] = effect.value;
    if (effect.type === 'unlock_meta') state.meta.unlocks[effect.unlockId] = true;
  }
  runtime.states[eventId] = { ...runtime.states[eventId], status: 'resolved', choiceId, resolvedAtMs: state.run.clock.simulationMs };
  runtime.history.push({ eventId, choiceId, resolvedAtMs: state.run.clock.simulationMs });
  runtime.pendingId = null;
  const recordId = `${state.run.id}:${eventId}`;
  if (!state.meta.chronicle.some((record) => record.id === recordId)) {
    state.meta.chronicle.push({ id: recordId, kind: 'event', eventId, choiceId, summary: event.chronicleSummary, occurredAtMs: state.run.clock.simulationMs });
  }
  ports.platform?.track?.(event.telemetryKey || 'event_resolved', { eventId, choiceId });
  return {
    ok: true, eventId, choiceId,
    events: [...(applied.events || []), ...effectEvents, createDomainEvent('event_resolved', { eventId, choiceId, telemetryKey: event.telemetryKey }, state, ports), ...activateNext(state, ports)],
  };
}
