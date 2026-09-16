import { ruleset as defaultRuleset } from '../config/index.js';
import { dispatchCommand } from './commands.js';
import { createInitialGameState } from './state.js';
import { evaluateGoals } from './services/goals.js';
import { queueEventsForGoal } from './services/events.js';
import { queueDueDeckEvents } from './services/events.js';
import { applyProduction } from './services/production.js';

function evaluateGoalsWithQueuedEvents(state, ruleset, ports) {
  const goalEvents = evaluateGoals(state, ruleset, ports);
  const queuedEvents = goalEvents.flatMap((event) => {
    if (event.type === 'goal_completed') {
      return queueEventsForGoal(state, ruleset, event.payload.goalId, ports);
    }
    return [];
  });
  return [...goalEvents, ...queuedEvents];
}

export function createChroniclesEngine(options = {}) {
  const ruleset = options.ruleset || defaultRuleset;
  const ports = options.ports || {};
  const state = options.state || createInitialGameState({ ...options, ruleset });
  const initialGoalEvents = evaluateGoalsWithQueuedEvents(state, ruleset, ports);
  state.session.lastEvents = initialGoalEvents;

  return {
    state,
    ruleset,
    dispatch(command) {
      return dispatchCommand(state, ruleset, command, ports);
    },
    tick(deltaMs) {
      const tickResult = dispatchCommand(state, ruleset, { type: 'TICK', deltaMs }, ports);
      const productionResult = applyProduction(state, ruleset, deltaMs, ports);
      const goalEvents = evaluateGoalsWithQueuedEvents(state, ruleset, ports);
      const deckEvents = queueDueDeckEvents(state, ruleset, ports);
      const events = [...tickResult.events, ...productionResult.events, ...goalEvents, ...deckEvents];
      state.session.lastEvents = events;
      return { ok: tickResult.ok, frozen: tickResult.frozen || false, rates: productionResult.rates, events };
    },
  };
}
