import { ruleset } from '../config/index.js';
import { createChroniclesEngine } from '../domain/engine.js';

export function createDebugApi(options = {}) {
  const engine = createChroniclesEngine(options);
  return {
    engine,
    grant(resourceId, amount) {
      return engine.dispatch({ type: 'ADD_RESOURCE', resourceId, amount });
    },
    buyNode(nodeId) {
      return engine.dispatch({ type: 'BUY_NODE', nodeId });
    },
    ruleset,
  };
}

