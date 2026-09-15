import { ruleset } from '../config/index.js';
import { createFakeClock } from '../adapters/clock.js';
import { createSeededRng } from '../adapters/rng.js';
import { createChroniclesEngine } from '../domain/engine.js';

export function runHeadlessSimulation(options = {}) {
  const clock = options.clock || createFakeClock(0);
  const rng = options.rng || createSeededRng(options.seed || 1);
  const engine = createChroniclesEngine({ ruleset, ports: { clock, rng } });

  const log = [];
  function dispatch(command) {
    const result = engine.dispatch(command);
    log.push({ command, result });
    return result;
  }

  dispatch({ type: 'ADD_RESOURCE', resourceId: 'energy', amount: 100 });
  dispatch({ type: 'BUY_PRODUCER', producerId: 'GEN_CHEMICAL_GRADIENT' });
  engine.tick(1000);
  dispatch({ type: 'ADD_RESOURCE', resourceId: 'energy', amount: 100 });
  dispatch({ type: 'ADD_RESOURCE', resourceId: 'information', amount: 10 });
  dispatch({ type: 'BUY_NODE', nodeId: 'M01' });
  dispatch({ type: 'BUY_NODE', nodeId: 'M02' });

  return {
    ok: log.every((entry) => entry.result.ok),
    state: engine.state,
    log,
  };
}

