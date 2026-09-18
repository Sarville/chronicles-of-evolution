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

// T1-T4 chapter collapses (Мор, Катаклизм, Раскол, Авария): a short, hidden
// countdown starts on the chapter's anomaly event and always runs to
// completion once started — nothing the player does in that window changes
// the outcome, only its subtype/epitaph (docs/gdd/13_ACT_ONE_CHAPTERS.md §2).
// The player keeps agency (can still build, buy, etc.) so the collapse reads
// as a real event, not a scripted cutscene.
// ponytail: only 'population' decay is implemented (reused as-is for T2's
// Катаклизм and T3's Раскол); T4 may need a different decay target once
// designed.
export const CHAPTER_TIMERS = {
  chapter1_blight: { totalMs: 120000, cliffMs: 15000, decays: 'population', endingEventId: 'EV-CR-T1' },
  chapter2_cataclysm: { totalMs: 120000, cliffMs: 15000, decays: 'population', endingEventId: 'EV-CR-T2' },
  chapter3_fracture: { totalMs: 120000, cliffMs: 15000, decays: 'population', endingEventId: 'EV-CR-T3' },
};

export function startChapterTimer(state, timerId) {
  state.run.chapterTimers ||= {};
  state.run.chapterTimers[timerId] = { active: true, elapsedMs: 0 };
}

// T3 "Единство раньше" perk (docs/gdd/10_META_PROGRESSION.md sec.4.2)
// describes a policy/Stability threshold that doesn't exist for T1-T4 (no
// Stability system runs before Atomic) -- reinterpreted mechanically as
// extending the chapter timer's gentle-decay phase (totalMs), while the
// final visible cliff (cliffMs) stays the same absolute length so the
// collapse itself still reads the same way, just arrives later.
function chapterTimerTotalMs(state, timerId, config) {
  const multiplier = Object.values(state.run.modifiers.active).reduce((value, modifier) => {
    return modifier.type === 'chapter_timer_duration_multiplier' && modifier.timerId === timerId ? value * modifier.value : value;
  }, 1);
  return config.totalMs * multiplier;
}

export function advanceChapterTimers(state, ruleset, deltaMs, ports) {
  const timers = state.run.chapterTimers;
  if (!timers || state.run.events?.pendingId) return [];
  const events = [];
  for (const [timerId, timer] of Object.entries(timers)) {
    if (!timer.active) continue;
    const config = CHAPTER_TIMERS[timerId];
    const totalMs = chapterTimerTotalMs(state, timerId, config);
    const remainingBefore = Math.max(0, totalMs - timer.elapsedMs);
    timer.elapsedMs = Math.min(totalMs, timer.elapsedMs + deltaMs);
    const remainingAfter = Math.max(0, totalMs - timer.elapsedMs);

    if (config.decays === 'population' && state.run.population) {
      const population = state.run.population;
      if (remainingBefore <= config.cliffMs) {
        // Final cliff: collapse to exactly 0 by the time the timer ends,
        // instead of asymptotically approaching it, so it never lingers
        // visible above zero.
        population.current = remainingBefore > 0 ? population.current * (remainingAfter / remainingBefore) : 0;
      } else {
        // Gentle attrition before the cliff -- noticeable, not alarming.
        population.current *= 0.995 ** (deltaMs / 1000);
      }
      population.current = Math.max(0, population.current);
    }

    if (remainingAfter <= 0) {
      timer.active = false;
      const queued = queueEvent(state, ruleset, config.endingEventId, ports);
      if (queued.ok) events.push(...queued.events);
    }
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
