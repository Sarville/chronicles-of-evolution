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
// 2026-09-18 T1-pacing rebalance (docs/TODO.md "T1 pacing retune"): producer
// output/input rates ×3.5 so T1 compresses onto its ~20min chapter budget;
// windows below are re-measured, not scaled by formula, since discrete
// purchase-threshold timing doesn't scale perfectly linearly.
between(competent.timings.automaticIncomeAtMs, 0, 60000, 'automatic income');
between(competent.timings.stableRnaAtMs, 10000, 35000, 'M01');
between(competent.timings.selfReplicationAtMs, 45000, 80000, 'M02');
between(competent.timings.dnaSynthesisAtMs, 70000, 130000, 'M03');
between(competent.timings.membraneAtMs, 110000, 190000, 'M05');
between(competent.timings.cellAtMs, 150000, 230000, 'M06');
between(competent.producerCounts.PROC_PRIMORDIAL_REACTION, 6, 8, 'Primordial Reaction count');
between(competent.producerCounts.PROC_RNA_REPLICATION, 4, 6, 'RNA Replication count');
between(competent.producerCounts.PROC_DNA_SYNTHESIS, 4, 6, 'DNA Synthesis count');
// Rates measured right at Cell (M06) completion, before any Cell-era (C0x)
// modifiers apply (×3.5 T1-pacing rebalance vs. the old 9-11/1.2-1.5 window).
between(competent.snapshots.after_M06.rates.rna, 32, 38, 'RNA/s at Cell');
between(competent.snapshots.after_M06.rates.dna, 4.2, 5.3, 'DNA/s at Cell');
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
between(competent.timings.metabolismAtMs, 170000, 250000, 'C01 Metabolism');
between(competent.timings.branchAtMs, 195000, 270000, 'branch choice');
between(competent.timings.proteinSynthesisAtMs, 225000, 310000, 'C03 Protein Synthesis');
between(competent.timings.organellesAtMs, 250000, 340000, 'C05 Organelles');
between(competent.timings.cellCoordinationAtMs, 270000, 370000, 'C06 Cell Coordination');

const competentSymbiosis = runHeadlessSimulation({ seed: 7, profile: 'competent_symbiosis', branch: 'C02B' });
assert.equal(competentSymbiosis.ok, true);
assert.equal(competentSymbiosis.state.run.nodes.selectedBranchByGroup.cell_identity_1, 'C02B');
assert.equal(competentSymbiosis.state.run.nodes.completed.C02A, undefined);
between(competentSymbiosis.timings.cellCoordinationAtMs, 270000, 370000, 'C06 Cell Coordination (Symbiosis)');

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
assert.equal(baselineSlow.timings.cellAtMs <= 280000, true);
assert.equal(baselineSlow.timings.cellCoordinationAtMs <= 430000, true);

const optimized = runHeadlessSimulation({ seed: 7, profile: 'optimized' });
assert.equal(optimized.ok, true);
between(optimized.timings.cellAtMs, 140000, 210000, 'optimized scripted M06');

const slow = runHeadlessSimulation({ seed: 7, profile: 'slow' });
assert.equal(slow.ok, true);
assert.equal(slow.timings.cellAtMs <= 260000, true);
assert.equal(slow.timings.cellCoordinationAtMs <= 400000, true);

const withM04 = runHeadlessSimulation({ seed: 7, profile: 'competent', includeOptionalM04: true });
assert.equal(withM04.ok, true);
assert.equal(withM04.state.run.nodes.completed.M04 !== undefined, true);
assert.equal(withM04.timings.cellAtMs <= competent.timings.cellAtMs + 60000, true);
assert.equal(withM04.finalRates.dna > competent.finalRates.dna, true);

const milestoneSeeker = runHeadlessSimulation({ seed: 7, profile: 'milestone_seeker' });
assert.equal(milestoneSeeker.ok, true);
assert.equal(milestoneSeeker.producerCounts.PROC_PRIMORDIAL_REACTION, 10);
assert.equal(milestoneSeeker.producerCounts.PROC_RNA_REPLICATION >= 5, true);
assert.equal(milestoneSeeker.timings.cellAtMs >= 150000, true);
assert.equal(milestoneSeeker.timings.cellAtMs <= 200000, true);
assert.equal(milestoneSeeker.timings.cellCoordinationAtMs >= 250000, true);
assert.equal(milestoneSeeker.timings.cellCoordinationAtMs <= 310000, true);

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
between(tenthPrimordial.outputDelta.rna, 1.85, 2.0, '10th Primordial Reaction RNA/s gain');
between(tenthPrimordial.paybackSecondsByResource.rna, 35, 42, '10th Primordial Reaction payback seconds');

// Act 1 redesign (2026-09-18, docs/gdd/13_ACT_ONE_CHAPTERS.md): the T1
// chapter now ends at Tribe with the mandatory Мор collapse (ENDING_BLIGHT),
// not by continuing into Settlement/City/.../Ash — that content is reused
// later by chapters T2-T5, not replayed inside this same run. The full-run
// runner still owns jobs, buildings, era transitions, authored events and
// Archive reset up to that point. Until balance is accepted it may report a
// deterministic stall instead of hiding it behind a successful early slice.
const fullTimeline = runFullTimelineSimulation({ seed: 7, profile: 'competent' });
assert.equal(fullTimeline.fullTimeline, true);
if (fullTimeline.ok) {
  assert.equal(fullTimeline.ending.id, 'ENDING_BLIGHT');
  assert.equal(fullTimeline.archiveReset.ok, true);
  // 2026-09-18 T1-pacing rebalance (docs/TODO.md "T1 pacing retune"): T1 was
  // landing Tribe at ~62-65m against a ~20min chapter target
  // (docs/gdd/13_ACT_ONE_CHAPTERS.md §3). Applied a ×3.5 rate rebalance
  // (config/producers.js, config/jobs.js Tribe-era outputs,
  // domain/services/population.js GROWTH_PER_SECOND) -- costs/thresholds
  // untouched, so every previously-tuned relative proportion between phases
  // is preserved, just reached faster. Measured across optimized/competent/
  // slow: Multicellularity 7.15-8.33m, Sapience 13.30-14.17m, Tribe
  // 17.10-18.08m; EV-CR-T1 (end of the Мор timer) lands at 19.87m for
  // competent -- right at the ~20min target.
  between(fullTimeline.timings.multicellularityAtMs, 6.5 * 60000, 9 * 60000, 'full T1 Multicellularity');
  between(fullTimeline.timings.sapienceAtMs, 12.5 * 60000, 15 * 60000, 'full T1 Sapience');
  between(fullTimeline.timings.tribeAtMs, 16.5 * 60000, 19 * 60000, 'full T1 Tribe');
} else {
  assert.equal(fullTimeline.state.run.nodes.completed.N07 !== undefined, true);
  assert.equal(typeof fullTimeline.stall?.nodeId, 'string');
  assert.equal(Array.isArray(fullTimeline.stall?.resources), true);
}

console.log('headless simulation ok');
