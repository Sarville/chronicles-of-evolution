import assert from 'node:assert/strict';
import { runHeadlessSimulation } from '../../src/chronicles/dev/simulation.js';

const result = runHeadlessSimulation({ seed: 7 });
assert.equal(result.ok, true);
assert.equal(result.state.run.producers.GEN_CHEMICAL_GRADIENT.count, 1);
assert.equal(result.state.run.nodes.completed.M01 !== undefined, true);
assert.equal(result.state.run.nodes.completed.M02 !== undefined, true);

console.log('headless simulation ok');

