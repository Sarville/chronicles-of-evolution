import assert from 'node:assert/strict';
import { runHeadlessSimulation } from '../../src/chronicles/dev/simulation.js';

const result = runHeadlessSimulation({ seed: 7 });
assert.equal(result.ok, true);
assert.equal(result.state.run.producers.GEN_CHEMICAL_GRADIENT.count, 14);
assert.equal(result.state.run.producers.GEN_CATALYTIC_FOLD.count, 10);
assert.equal(result.state.run.producers.GEN_ENERGY_POCKET.count, 8);
assert.equal(result.state.run.nodes.completed.M01 !== undefined, true);
assert.equal(result.state.run.nodes.completed.M02 !== undefined, true);
assert.equal(result.state.run.nodes.completed.M06 !== undefined, true);
assert.equal(result.state.run.nodes.completed.M04, undefined);
assert.equal(result.state.run.goals.states.G005.status, 'archived');
assert.equal(result.timings.automaticIncomeAtMs < 60000, true);
assert.equal(result.timings.selfReplicationAtMs < 180000, true);
assert.equal(result.timings.protoCellAtMs <= 600000, true);

console.log('headless simulation ok');
