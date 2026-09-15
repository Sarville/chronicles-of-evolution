import { createDomainEvent } from '../domainEvents.js';

export function queueEvent(state, ruleset, eventId, ports, options = {}) {
  const eventConfig = ruleset.events.find((event) => event.id === eventId);
  if (!eventConfig) {
    return { ok: false, reason: 'UNKNOWN_EVENT', eventId, events: [] };
  }
  if (state.run.events.states[eventId]?.status && !options.force) {
    return { ok: false, reason: 'EVENT_ALREADY_TRACKED', eventId, events: [] };
  }

  state.run.events.states[eventId] = { status: 'queued', queuedAtMs: state.run.clock.simulationMs };
  state.run.events.queue.push(eventId);
  return { ok: true, eventId, events: [createDomainEvent('event_queued', { eventId }, state, ports)] };
}

export function queueEventsForGoal(state, ruleset, goalId, ports) {
  const events = [];
  for (const eventConfig of ruleset.events) {
    if (eventConfig.trigger?.type !== 'goal_completed' || eventConfig.trigger.goalId !== goalId) {
      continue;
    }
    const queued = queueEvent(state, ruleset, eventConfig.id, ports);
    if (!queued.ok) {
      continue;
    }
    events.push(...queued.events);
  }
  return events;
}
