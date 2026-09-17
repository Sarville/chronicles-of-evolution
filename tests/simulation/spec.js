import assert from 'node:assert/strict';
import { ruleset } from '../../src/chronicles/config/index.js';
import { createChroniclesEngine } from '../../src/chronicles/domain/engine.js';
import { estimateProducerPurchasePayback, runFullTimelineSimulation, runHeadlessSimulation, simulationProfiles } from '../../src/chronicles/dev/simulation.js';

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
// Frozen 0-10 rates, measured right at Cell (M06) completion, before any Cell-era (C0x) modifiers apply.
between(competent.snapshots.after_M06.rates.rna, 9, 11, 'RNA/s at Cell');
between(competent.snapshots.after_M06.rates.dna, 1.2, 1.5, 'DNA/s at Cell');
assert.equal(competent.manual.economicsAtThreeMinutes.contributionRatio < 0.05, true);
assert.equal(competent.manual.economicsAtThreeMinutes.cooldownMs, 90000);
assert.equal(competent.manual.economicsAtThreeMinutes.resourceId, 'rna');

// Cell -> Cell Coordination: competent routes finish the 0-18 minute block;
// deliberately slow profiles may use the documented 20-minute outer corridor.
assert.equal(competent.state.run.nodes.completed.C01 !== undefined, true);
assert.equal(competent.state.run.nodes.completed.C02A !== undefined, true);
assert.equal(competent.state.run.nodes.completed.C03 !== undefined, true);
assert.equal(competent.state.run.nodes.completed.C05 !== undefined, true);
assert.equal(competent.state.run.nodes.completed.C06 !== undefined, true);
assert.equal(competent.state.run.nodes.selectedBranchByGroup.cell_identity_1, 'C02A');
assert.equal(competent.state.run.resources.ap, undefined);
assert.equal(competent.state.run.flags['run.bio.primary_trait'], 'absorption');
assert.equal(competent.state.run.goals.states.G006.status, 'archived');
assert.equal(competent.state.run.goals.states.G007.status, 'archived');
const competentStoragePurchases = competent.log
  .filter((entry) => entry.action === 'building')
  .map((entry) => entry.buildingId);
assert.deepEqual(competentStoragePurchases, [
  'BLD_MEMBRANE_STORE',
  'BLD_MEMBRANE_STORE',
  'BLD_MEMBRANE_STORE',
  'BLD_MEMBRANE_STORE',
  'BLD_GENETIC_STORE',
  'BLD_BIOMASS_STORE',
  'BLD_ATP_STORE',
]);
between(competent.timings.metabolismAtMs, 550000, 800000, 'C01 Metabolism');
between(competent.timings.branchAtMs, 600000, 850000, 'branch choice');
between(competent.timings.proteinSynthesisAtMs, 700000, 950000, 'C03 Protein Synthesis');
between(competent.timings.organellesAtMs, 750000, 1000000, 'C05 Organelles');
between(competent.timings.cellCoordinationAtMs, 800000, 1080000, 'C06 Cell Coordination');

const competentSymbiosis = runHeadlessSimulation({ seed: 7, profile: 'competent_symbiosis', branch: 'C02B' });
assert.equal(competentSymbiosis.ok, true);
assert.equal(competentSymbiosis.state.run.nodes.selectedBranchByGroup.cell_identity_1, 'C02B');
assert.equal(competentSymbiosis.state.run.nodes.completed.C02A, undefined);
between(competentSymbiosis.timings.cellCoordinationAtMs, 800000, 1080000, 'C06 Cell Coordination (Symbiosis)');

assert.equal(simulationProfiles.baseline_optimized.decisionIntervalMs, 1000);
assert.equal(simulationProfiles.baseline_competent.decisionIntervalMs, 5000);
assert.equal(simulationProfiles.baseline_slow.decisionIntervalMs, 9000);
assert.equal(simulationProfiles.optimized.decisionIntervalMs, 2500);
assert.equal(simulationProfiles.slow.decisionIntervalMs, 5000);
assert.notEqual(simulationProfiles.baseline_optimized.phaseProducerTargets, simulationProfiles.optimized.phaseProducerTargets);
assert.notEqual(simulationProfiles.baseline_competent.phaseProducerTargets, simulationProfiles.competent.phaseProducerTargets);
assert.notEqual(simulationProfiles.baseline_slow.phaseProducerTargets, simulationProfiles.slow.phaseProducerTargets);
assert.notDeepEqual(simulationProfiles.baseline_slow.phaseProducerTargets, simulationProfiles.slow.phaseProducerTargets);

const baselineOptimized = runHeadlessSimulation({ seed: 7, profile: 'baseline_optimized' });
const baselineCompetent = runHeadlessSimulation({ seed: 7, profile: 'baseline_competent' });
const baselineSlow = runHeadlessSimulation({ seed: 7, profile: 'baseline_slow' });
assert.equal(baselineOptimized.ok, true);
assert.equal(baselineCompetent.ok, true);
assert.equal(baselineSlow.ok, true);
assert.equal(baselineSlow.timings.cellAtMs <= 690000, true);
assert.equal(baselineSlow.timings.cellCoordinationAtMs <= 1200000, true);

const optimized = runHeadlessSimulation({ seed: 7, profile: 'optimized' });
assert.equal(optimized.ok, true);
between(optimized.timings.cellAtMs, 480000, 660000, 'optimized scripted M06');

const slow = runHeadlessSimulation({ seed: 7, profile: 'slow' });
assert.equal(slow.ok, true);
assert.equal(slow.timings.cellAtMs <= 690000, true);
assert.equal(slow.timings.cellCoordinationAtMs <= 1200000, true);

const withM04 = runHeadlessSimulation({ seed: 7, profile: 'competent', includeOptionalM04: true });
assert.equal(withM04.ok, true);
assert.equal(withM04.state.run.nodes.completed.M04 !== undefined, true);
assert.equal(withM04.timings.cellAtMs <= competent.timings.cellAtMs + 60000, true);
assert.equal(withM04.finalRates.dna > competent.finalRates.dna, true);

const milestoneSeeker = runHeadlessSimulation({ seed: 7, profile: 'milestone_seeker' });
assert.equal(milestoneSeeker.ok, true);
assert.equal(milestoneSeeker.producerCounts.PROC_PRIMORDIAL_REACTION, 10);
assert.equal(milestoneSeeker.producerCounts.PROC_RNA_REPLICATION >= 5, true);
assert.equal(milestoneSeeker.timings.cellAtMs >= 480000, true);
assert.equal(milestoneSeeker.timings.cellAtMs <= 660000, true);
assert.equal(milestoneSeeker.timings.cellCoordinationAtMs >= 750000, true);
assert.equal(milestoneSeeker.timings.cellCoordinationAtMs <= 930000, true);

const manualAssisted = runHeadlessSimulation({ seed: 7, profile: 'manual_assisted' });
assert.equal(manualAssisted.ok, true);
assert.equal(simulationProfiles.manual_assisted.manualProcessIds.includes('MANUAL_DNA_SYNTHESIS'), true);
assert.equal(manualAssisted.manual.byProcess.MANUAL_DNA_SYNTHESIS.uses > 0, true);
assert.equal(manualAssisted.manual.byProcess.MANUAL_DNA_SYNTHESIS.reward.dna > 0, true);
assert.equal(manualAssisted.timings.cellAtMs >= competent.timings.cellAtMs - 90000, true);
assert.equal(manualAssisted.timings.cellAtMs <= competent.timings.cellAtMs + 30000, true);
assert.equal(manualAssisted.manual.economicsAtThreeMinutes.contributionRatio < 0.05, true);

const paybackEngine = createChroniclesEngine({ ruleset });
paybackEngine.state.run.resources.rna.capOverride = 1000;
paybackEngine.dispatch({ type: 'ADD_RESOURCE', resourceId: 'rna', amount: 500 });
for (let index = 0; index < 9; index += 1) {
  const buy = paybackEngine.dispatch({ type: 'BUY_PRODUCER', producerId: 'PROC_PRIMORDIAL_REACTION' });
  assert.equal(buy.ok, true);
}
const tenthPrimordial = estimateProducerPurchasePayback(paybackEngine.state, ruleset, 'PROC_PRIMORDIAL_REACTION');
between(tenthPrimordial.cost.rna, 73, 75, '10th Primordial Reaction cost');
between(tenthPrimordial.outputDelta.rna, 0.54, 0.56, '10th Primordial Reaction RNA/s gain');
between(tenthPrimordial.paybackSecondsByResource.rna, 130, 138, '10th Primordial Reaction payback seconds');

// The full-run runner owns jobs, buildings, all era transitions, authored
// events, crisis and Archive reset. Until balance is accepted it may report a
// deterministic stall instead of hiding it behind a successful early slice.
const fullTimeline = runFullTimelineSimulation({ seed: 7, profile: 'competent' });
assert.equal(fullTimeline.fullTimeline, true);
if (fullTimeline.ok) {
  assert.equal(fullTimeline.ending.id, 'ENDING_ASH');
  assert.equal(fullTimeline.archiveReset.ok, true);
  between(fullTimeline.timings.sapienceAtMs, 36 * 60000, 41 * 60000, 'full T1 Sapience');
  between(fullTimeline.timings.settlementAtMs, 78 * 60000, 86 * 60000, 'full T1 Settlement');
  between(fullTimeline.timings.cityAtMs, 104 * 60000, 112 * 60000, 'full T1 City');
  between(fullTimeline.timings.industryAtMs, 120 * 60000, 128 * 60000, 'full T1 Industry');
  between(fullTimeline.timings.modernAtMs, 132 * 60000, 140 * 60000, 'full T1 Modern');
  between(fullTimeline.timings.atomicAtMs, 165 * 60000, 172 * 60000, 'full T1 Atomic');
  between(fullTimeline.timings.ashAtMs, 177 * 60000, 183 * 60000, 'full T1 Ash');
} else {
  assert.equal(fullTimeline.state.run.nodes.completed.N07 !== undefined, true);
  assert.equal(fullTimeline.state.run.nodes.completed.T18 !== undefined, true);
  assert.equal(typeof fullTimeline.stall?.nodeId, 'string');
  assert.equal(Array.isArray(fullTimeline.stall?.resources), true);
}

console.log('headless simulation ok');
