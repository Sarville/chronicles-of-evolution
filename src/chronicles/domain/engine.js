import { ruleset as defaultRuleset } from '../config/index.js';
import { dispatchCommand } from './commands.js';
import { createInitialGameState } from './state.js';
import { applyProduction } from './services/production.js';

export function createChroniclesEngine(options = {}) {
  const ruleset = options.ruleset || defaultRuleset;
  const ports = options.ports || {};
  const state = options.state || createInitialGameState({ ...options, ruleset });

  return {
    state,
    ruleset,
    dispatch(command) {
      return dispatchCommand(state, ruleset, command, ports);
    },
    tick(deltaMs) {
      const tickResult = dispatchCommand(state, ruleset, { type: 'TICK', deltaMs }, ports);
      const productionResult = applyProduction(state, ruleset, deltaMs, ports);
      const events = [...tickResult.events, ...productionResult.events];
      state.session.lastEvents = events;
      return { ok: tickResult.ok, frozen: tickResult.frozen || false, rates: productionResult.rates, events };
    },
  };
}
