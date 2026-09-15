import assert from 'node:assert/strict';
import { runHeadlessSimulation } from '../../src/chronicles/dev/simulation.js';

function between(value, min, max, label) {
  assert.equal(value >= min && value <= max, true, `${label}: expected ${value} between ${min} and ${max}`);
}

const competent = runHeadlessSimulation({ seed: 7, profile: 'competent' });
assert.equal(competent.ok, true);
assert.equal(competent.state.run.nodes.completed.M01 !== undefined, true);
assert.equal(competent.state.run.nodes.completed.M02 !== undefined, true);
assert.equal(competent.state.run.nodes.completed.M03 !== undefined, true);
assert.equal(competent.state.run.nodes.completed.M05 !== undefined, true);
assert.equal(competent.state.run.nodes.completed.M06 !== undefined, true);
assert.equal(competent.state.run.nodes.completed.M04, undefined);
assert.equal(competent.state.run.goals.states.G005.status, 'archived');
between(competent.timings.automaticIncomeAtMs, 0, 60000, 'automatic income');
between(competent.timings.stableBondAtMs, 35000, 60000, 'M01');
between(competent.timings.selfReplicationAtMs, 170000, 230000, 'M02');
between(competent.timings.catalyticRnaAtMs, 240000, 300000, 'M03');
between(competent.timings.lipidShellAtMs, 390000, 500000, 'M05');
between(competent.timings.protoCellAtMs, 540000, 660000, 'M06');
between(competent.producerCounts.GEN_CHEMICAL_GRADIENT, 12, 14, 'Chemical Gradient count');
between(competent.producerCounts.GEN_CATALYTIC_FOLD, 8, 10, 'Catalytic Fold count');
between(competent.producerCounts.GEN_ENERGY_POCKET, 6, 8, 'Energy Pocket count');
between(competent.finalRates.energy, 12, 16, 'final Energy/s');
between(competent.finalRates.information, 1.3, 1.8, 'final Information/s');
assert.equal(competent.manual.energyAfterThreeMinutes, 0);

const optimized = runHeadlessSimulation({ seed: 7, profile: 'optimized' });
assert.equal(optimized.ok, true);
between(optimized.timings.protoCellAtMs, 450000, 660000, 'optimized M06');

const slow = runHeadlessSimulation({ seed: 7, profile: 'slow' });
assert.equal(slow.ok, true);
between(slow.timings.protoCellAtMs, 540000, 780000, 'slow M06');

const withM04 = runHeadlessSimulation({ seed: 7, profile: 'competent', includeOptionalM04: true });
assert.equal(withM04.ok, true);
assert.equal(withM04.state.run.nodes.completed.M04 !== undefined, true);
assert.equal(withM04.timings.protoCellAtMs <= competent.timings.protoCellAtMs + 60000, true);
assert.equal(withM04.finalRates.information > competent.finalRates.information, true);

console.log('headless simulation ok');
