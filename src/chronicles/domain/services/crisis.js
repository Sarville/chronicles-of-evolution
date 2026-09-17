import { createDomainEvent } from '../domainEvents.js';
import { queueEvent } from './events.js';

export const CRISIS_PHASES = [
  // A first run needs enough room to read, answer and anticipate the next
  // escalation. The 2/5/8/12-minute cadence makes Atomic a real finale,
  // rather than a short post-tech cutscene.
  { id: 'C1', atMs: 120000, eventId: 'EV-CR-01' },
  { id: 'C2', atMs: 300000, eventId: 'EV-CR-02' },
  { id: 'C3', atMs: 480000 },
  { id: 'C4', atMs: 720000, eventId: 'EV-CR-03' },
];

export function createInitialCrisisState() {
  return {
    active: true,
    stability: 100,
    minStability: 100,
    crisisClockMs: 0,
    atomicLoad: 1,
    unresolvedCrises: 0,
    phase: 'C0',
    seenPhases: ['C0'],
  };
}

// The crisis timer belongs to active play only: offline progress never calls
// engine.tick(). Required choices pause the clock, guaranteeing that the first
// Timeline exposes every authored beat before Last Protocol.
export function advanceCrisis(state, ruleset, deltaMs, ports) {
  const crisis = state.run.crisis;
  if (!crisis?.active || state.run.eraId !== 'ATOMIC' || state.run.events?.pendingId) return [];

  crisis.crisisClockMs += deltaMs;
  crisis.stability = Math.max(0, crisis.stability - (deltaMs / 1000) * 0.2);
  crisis.minStability = Math.min(crisis.minStability ?? crisis.stability, crisis.stability);
  const events = [createDomainEvent('crisis_updated', {
    stability: crisis.stability,
    worldTension: 100 - crisis.stability,
    crisisClockMs: crisis.crisisClockMs,
  }, state, ports)];
  const next = CRISIS_PHASES.find((phase) => !crisis.seenPhases.includes(phase.id) && crisis.crisisClockMs >= phase.atMs);
  if (!next) return events;

  crisis.phase = next.id;
  crisis.seenPhases.push(next.id);
  events.push(createDomainEvent('crisis_phase_changed', { phase: next.id }, state, ports));
  if (next.eventId) {
    const queued = queueEvent(state, ruleset, next.eventId, ports);
    if (queued.ok) events.push(...queued.events);
  }
  return events;
}

export function adjustCrisisStability(state, amount) {
  if (!state.run.crisis) return;
  state.run.crisis.stability = Math.max(0, Math.min(100, state.run.crisis.stability + amount));
  state.run.crisis.minStability = Math.min(state.run.crisis.minStability ?? state.run.crisis.stability, state.run.crisis.stability);
}

export function completeEnding(state, endingId, subtype) {
  if (state.run.crisis) {
    state.run.crisis.active = false;
    state.run.crisis.phase = 'ENDED';
  }
  state.run.flags['run.ending.id'] = endingId;
  state.run.flags['run.ending.subtype'] = subtype;
  state.run.ending = { id: endingId, subtype, completedAtMs: state.run.clock.simulationMs };
  state.run.lifecycle = 'ended';
  state.meta.persistentFlags ||= {};
  state.meta.persistentFlags['meta.endings.first_ending'] ||= endingId;
}
