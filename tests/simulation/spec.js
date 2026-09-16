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
between(competent.timings.stableRnaAtMs, 20000, 60000, 'M01');
between(competent.timings.selfReplicationAtMs, 120000, 180000, 'M02');
between(competent.timings.dnaSynthesisAtMs, 240000, 360000, 'M03');
between(competent.timings.membraneAtMs, 390000, 520000, 'M05');
between(competent.timings.cellAtMs, 540000, 660000, 'M06');
between(competent.producerCounts.PROC_PRIMORDIAL_REACTION, 6, 8, 'Primordial Reaction count');
between(competent.producerCounts.PROC_RNA_REPLICATION, 4, 6, 'RNA Replication count');
between(competent.producerCounts.PROC_DNA_SYNTHESIS, 4, 6, 'DNA Synthesis count');
between(competent.finalRates.rna, 9, 11, 'final RNA/s');
between(competent.finalRates.dna, 1.2, 1.5, 'final DNA/s');
assert.equal(competent.manual.economicsAtThreeMinutes.contributionRatio < 0.05, true);
assert.equal(competent.manual.economicsAtThreeMinutes.cooldownMs, 90000);
assert.equal(competent.manual.economicsAtThreeMinutes.resourceId, 'rna');

const optimized = runHeadlessSimulation({ seed: 7, profile: 'optimized' });
assert.equal(optimized.ok, true);
between(optimized.timings.cellAtMs, 480000, 660000, 'optimized scripted M06');

const slow = runHeadlessSimulation({ seed: 7, profile: 'slow' });
assert.equal(slow.ok, true);
assert.equal(slow.timings.cellAtMs <= 690000, true);

const withM04 = runHeadlessSimulation({ seed: 7, profile: 'competent', includeOptionalM04: true });
assert.equal(withM04.ok, true);
assert.equal(withM04.state.run.nodes.completed.M04 !== undefined, true);
assert.equal(withM04.timings.cellAtMs <= competent.timings.cellAtMs + 60000, true);
assert.equal(withM04.finalRates.dna > competent.finalRates.dna, true);

console.log('headless simulation ok');
