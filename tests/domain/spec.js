import assert from 'node:assert/strict';
import { ruleset } from '../../src/chronicles/config/index.js';
import { createFakeClock } from '../../src/chronicles/adapters/clock.js';
import { createSeededRng } from '../../src/chronicles/adapters/rng.js';
import { createChroniclesEngine } from '../../src/chronicles/domain/engine.js';
import {
  formatDuration,
  formatEta,
  formatEtaDuration,
  formatResourceAmount,
  selectCurrentGoal,
  selectBuildingStatus,
  selectEvolutionRevealLevel,
  selectManualProcessView,
  selectNodeCost,
  selectNodeStatus,
  selectPurchaseEta,
  selectProducerOutputView,
  selectProducerPrice,
  selectProductionRates,
  selectPopulation,
  selectCognition,
  selectResourceAmounts,
  selectVisibleResources,
  selectSideGoals,
  selectProgressiveGoals,
  timeUntilAffordable,
} from '../../src/chronicles/domain/selectors.js';
import { createInitialGameState } from '../../src/chronicles/domain/state.js';
import { producerMilestoneMultiplier } from '../../src/chronicles/domain/services/production.js';
import { calculateCap } from '../../src/chronicles/domain/services/resources.js';

const clock = createFakeClock(1000);
const rng = createSeededRng(42);
const engine = createChroniclesEngine({ ruleset, ports: { clock, rng } });

assert.equal(engine.state.run.rulesetVersion, 'timeline1-v14-blight-timer');
assert.equal(engine.state.run.eraId, 'MOLECULAR');
assert.deepEqual(selectResourceAmounts(engine.state), { rna: 0 });
assert.deepEqual(selectVisibleResources(engine.state, ruleset).map((resource) => resource.id), ['rna']);
assert.equal(engine.state.run.resources.information, undefined);
assert.equal(engine.state.run.resources.atp, undefined);
assert.equal(engine.state.run.goals.currentId, 'G001');
assert.equal(engine.state.run.goals.chapter.activeId, 'G001');
assert.equal(engine.state.run.goals.states.G001.status, 'active');
assert.deepEqual(engine.state.run.events, { rngState: 1, queue: [], pendingId: null, states: {}, history: [], lastDeckDrawAtMs: {} });
assert.deepEqual(engine.state.run.modifiers, { active: {} });
assert.equal(calculateCap(engine.state, 'rna', ruleset), 100);
assert.equal(selectCurrentGoal(engine.state, ruleset).id, 'G001');
assert.equal(selectManualProcessView(engine.state, ruleset, 'MANUAL_PRIMORDIAL_PULSE').available, true);

const conversionEngine = createChroniclesEngine({ ruleset });
conversionEngine.state.run.modifiers.active.test = { type: 'unlock_auto_production' };
conversionEngine.state.run.resources.rna.amount = 10;
conversionEngine.state.run.producers.PROC_DNA_SYNTHESIS = { count: 1 };
let conversionTick = conversionEngine.tick(1000);
assert.equal(Math.abs(conversionTick.rates.rna + 1.82) < 0.000001, true);
assert.equal(Math.abs(conversionTick.rates.dna - 0.91) < 0.000001, true);
assert.equal(Math.abs(conversionEngine.state.run.resources.rna.amount - 8.18) < 0.000001, true);
assert.equal(Math.abs(conversionEngine.state.run.resources.dna.amount - 0.91) < 0.000001, true);
conversionEngine.state.run.resources.rna.amount = 0;
conversionTick = conversionEngine.tick(1000);
assert.equal(conversionTick.rates.dna, 0);
assert.equal(conversionEngine.state.run.resources.dna.amount, 0.91);

// A resource that is both produced and consumed within the same tick (RNA
// feeds DNA Synthesis, Biomass feeds Respiration) must still land exactly on
// its cap once net production is positive, instead of permanently sitting
// one consumption-step below it.
const capSaturationEngine = createChroniclesEngine({ ruleset });
capSaturationEngine.state.run.modifiers.active.test = { type: 'unlock_auto_production' };
capSaturationEngine.state.run.resources.rna.capOverride = 10;
capSaturationEngine.state.run.resources.rna.amount = 9;
capSaturationEngine.state.run.producers.PROC_PRIMORDIAL_REACTION = { count: 20 };
capSaturationEngine.state.run.producers.PROC_DNA_SYNTHESIS = { count: 1 };
capSaturationEngine.tick(1000);
assert.equal(capSaturationEngine.state.run.resources.rna.amount, 10);
assert.equal(selectEvolutionRevealLevel(engine.state, ruleset, 'M01'), 0);
assert.equal(selectEvolutionRevealLevel(engine.state, ruleset, 'M02'), 1);
assert.equal(selectEvolutionRevealLevel(engine.state, ruleset, 'M03'), 2);

let result = engine.dispatch({ type: 'USE_MANUAL_PROCESS', processId: 'MANUAL_PRIMORDIAL_PULSE' });
assert.equal(result.ok, true);
assert.equal(result.events.some((event) => event.type === 'manual_process_used'), true);
assert.equal(engine.state.run.resources.rna.amount, 1);
assert.equal(engine.state.run.manualProcesses.MANUAL_PRIMORDIAL_PULSE.uses, 1);
result = engine.dispatch({ type: 'USE_MANUAL_PROCESS', processId: 'MANUAL_PRIMORDIAL_PULSE' });
assert.equal(result.ok, false);
assert.equal(result.reason, 'MANUAL_PROCESS_UNAVAILABLE');
engine.tick(2000);
assert.equal(selectManualProcessView(engine.state, ruleset, 'MANUAL_PRIMORDIAL_PULSE').available, true);

// The broad flow below verifies the rest of the economy; cap gates have a
// focused scenario later in this file.
engine.state.run.resources.rna.capOverride = 10000;
result = engine.dispatch({ type: 'ADD_RESOURCE', resourceId: 'rna', amount: 200 });
assert.equal(result.ok, true);
assert.equal(result.events[0].type, 'resource_changed');
assert.equal(engine.state.run.resources.rna.amount, 201);

assert.deepEqual(selectProducerPrice(engine.state, ruleset, 'PROC_PRIMORDIAL_REACTION'), { rna: 5 });
result = engine.dispatch({ type: 'BUY_PRODUCER', producerId: 'PROC_PRIMORDIAL_REACTION' });
assert.equal(result.ok, true);
assert.equal(engine.state.run.producers.PROC_PRIMORDIAL_REACTION.count, 1);
let tick = engine.tick(1000);
assert.equal(tick.ok, true);
assert.equal(tick.rates.rna, 0.77);
assert.equal(Math.abs(engine.state.run.resources.rna.amount - 196.77) < 0.000001, true);

result = engine.dispatch({ type: 'BUY_NODE', nodeId: 'M02' });
assert.equal(result.ok, false);
assert.equal(result.reason, 'PREREQUISITES_NOT_MET');

result = engine.dispatch({ type: 'BUY_NODE', nodeId: 'M01' });
assert.equal(result.ok, true);
assert.equal(result.events.some((event) => event.type === 'node_completed'), true);
assert.equal(result.events.some((event) => event.type === 'goal_completed'), true);
assert.equal(engine.state.run.modifiers.active['M01:auto_production'].type, 'unlock_auto_production');
tick = engine.tick(1000);
assert.equal(tick.rates.rna, 0.77);
assert.equal(selectManualProcessView(engine.state, ruleset, 'MANUAL_PRIMORDIAL_PULSE').cooldownMs, 3500);

result = engine.dispatch({ type: 'BUY_NODE', nodeId: 'M02' });
assert.equal(result.ok, true);
assert.equal(calculateCap(engine.state, 'rna', ruleset), 10000);
assert.equal(selectEvolutionRevealLevel(engine.state, ruleset, 'M03'), 0);
assert.equal(selectEvolutionRevealLevel(engine.state, ruleset, 'M04'), 1);
assert.equal(selectEvolutionRevealLevel(engine.state, ruleset, 'M05'), 1);
assert.equal(selectEvolutionRevealLevel(engine.state, ruleset, 'M06'), 2);
assert.equal(Math.abs(selectProductionRates(engine.state, ruleset).rna - 1.3475) < 0.000001, true);
assert.equal(selectManualProcessView(engine.state, ruleset, 'MANUAL_PRIMORDIAL_PULSE').cooldownMs, 90000);
assert.equal(selectNodeStatus(engine.state, ruleset, 'M05'), 'locked');
assert.equal(selectNodeStatus(engine.state, ruleset, 'M04'), 'locked');

engine.dispatch({ type: 'ADD_RESOURCE', resourceId: 'rna', amount: 34 });
result = engine.dispatch({ type: 'BUY_PRODUCER', producerId: 'PROC_RNA_REPLICATION' });
assert.equal(result.ok, true);
result = engine.dispatch({ type: 'ADD_RESOURCE', resourceId: 'rna', amount: 500 });
assert.equal(result.ok, true);
result = engine.dispatch({ type: 'BUY_NODE', nodeId: 'M03' });
assert.equal(result.ok, true);
assert.equal(calculateCap(engine.state, 'dna', ruleset), 100);
assert.equal(engine.state.run.resources.dna.amount, 0);
assert.deepEqual(selectVisibleResources(engine.state, ruleset).map((resource) => resource.id), ['rna', 'dna']);
assert.equal(selectNodeStatus(engine.state, ruleset, 'M04'), 'available_unaffordable');
assert.equal(selectNodeStatus(engine.state, ruleset, 'M05'), 'available_unaffordable');

engine.state.run.resources.dna.capOverride = 10000;
result = engine.dispatch({ type: 'ADD_RESOURCE', resourceId: 'dna', amount: 500 });
assert.equal(result.ok, true);
result = engine.dispatch({ type: 'ADD_RESOURCE', resourceId: 'rna', amount: 500 });
assert.equal(result.ok, true);
result = engine.dispatch({ type: 'BUY_NODE', nodeId: 'M05' });
assert.equal(result.ok, true);
assert.equal(engine.state.run.nodes.completed.M04, undefined);
assert.equal(selectBuildingStatus(engine.state, ruleset, 'BLD_MEMBRANE_STORE'), 'available_affordable');
result = engine.dispatch({ type: 'ADD_RESOURCE', resourceId: 'rna', amount: 1000 });
assert.equal(result.ok, true);
result = engine.dispatch({ type: 'BUY_NODE', nodeId: 'M06' });
assert.equal(result.ok, true);
assert.equal(result.events.some((event) => event.type === 'cell_reached'), true);
assert.equal(engine.state.run.eraId, 'CELLULAR');
assert.equal(engine.state.run.resources.biomass.amount, 0);
assert.deepEqual(selectVisibleResources(engine.state, ruleset).map((resource) => resource.id), ['rna', 'dna', 'biomass']);

const storageBuildingEngine = createChroniclesEngine({ ruleset });
storageBuildingEngine.state.run.nodes.completed.M01 = { completedAtMs: 0 };
storageBuildingEngine.state.run.resources.rna.amount = 100;
assert.equal(storageBuildingEngine.dispatch({ type: 'BUY_BUILDING', buildingId: 'BLD_MEMBRANE_STORE' }).ok, true);
assert.equal(storageBuildingEngine.state.run.buildings.BLD_MEMBRANE_STORE.count, 1);
assert.equal(calculateCap(storageBuildingEngine.state, 'rna', ruleset), 350);

// A discovery cannot bypass a cap; the appropriate storage structure is the
// only way forward. Later resources follow the same invariant.
const storageGateEngine = createChroniclesEngine({ ruleset });
storageGateEngine.dispatch({ type: 'ADD_RESOURCE', resourceId: 'rna', amount: 9 });
assert.equal(storageGateEngine.dispatch({ type: 'BUY_NODE', nodeId: 'M01' }).ok, true);
storageGateEngine.dispatch({ type: 'ADD_RESOURCE', resourceId: 'rna', amount: 1000 });
assert.equal(calculateCap(storageGateEngine.state, 'rna', ruleset), 100);
assert.equal(selectNodeStatus(storageGateEngine.state, ruleset, 'M02'), 'available_unaffordable');
assert.equal(storageGateEngine.dispatch({ type: 'BUY_BUILDING', buildingId: 'BLD_MEMBRANE_STORE' }).ok, true);
assert.equal(calculateCap(storageGateEngine.state, 'rna', ruleset), 350);
storageGateEngine.state.run.nodes.completed.M03 = { completedAtMs: 0 };
storageGateEngine.state.run.resources.dna = { amount: 100 };
assert.equal(storageGateEngine.dispatch({ type: 'BUY_BUILDING', buildingId: 'BLD_GENETIC_STORE' }).ok, true);
assert.equal(calculateCap(storageGateEngine.state, 'dna', ruleset), 250);
storageGateEngine.state.run.nodes.completed.M06 = { completedAtMs: 0 };
storageGateEngine.state.run.eraId = 'CELLULAR';
storageGateEngine.state.run.resources.dna.amount = 100;
assert.equal(storageGateEngine.dispatch({ type: 'BUY_BUILDING', buildingId: 'BLD_BIOMASS_STORE' }).ok, true);
assert.equal(calculateCap(storageGateEngine.state, 'biomass', ruleset), 240);
storageGateEngine.state.run.nodes.completed.C01 = { completedAtMs: 0 };
storageGateEngine.state.run.resources.biomass = { amount: 80 };
assert.equal(storageGateEngine.dispatch({ type: 'BUY_BUILDING', buildingId: 'BLD_ATP_STORE' }).ok, true);
assert.equal(calculateCap(storageGateEngine.state, 'atp', ruleset), 160);

engine.state.run.nodes.completed.T08 = { completedAtMs: 0 };
engine.state.run.eraId = 'SETTLEMENT_EARLY';
engine.state.run.flags['run.unlock.building.BLD_FIELD'] = true;
engine.state.run.resources.food = { amount: 0, capOverride: 1000 };
engine.state.run.resources.materials = { amount: 0, capOverride: 1000 };
engine.dispatch({ type: 'ADD_RESOURCE', resourceId: 'food', amount: 180 });
engine.dispatch({ type: 'ADD_RESOURCE', resourceId: 'materials', amount: 260 });
result = engine.dispatch({ type: 'BUY_BUILDING', buildingId: 'BLD_FIELD' });
assert.equal(result.ok, true);
assert.equal(result.events.some((event) => event.type === 'building_bought'), true);

const activeTickRna = engine.state.run.resources.rna.amount;
engine.state.run.lifecycle = 'ending_pending';
tick = engine.tick(1000);
assert.equal(tick.frozen, true);
assert.equal(engine.state.run.resources.rna.amount, activeTickRna);
engine.state.run.lifecycle = 'archive_summary';
tick = engine.tick(1000);
assert.equal(tick.frozen, true);
assert.equal(engine.state.run.resources.rna.amount, activeTickRna);
const closedSnapshot = JSON.stringify(engine.state.run);
engine.state.run.lifecycle = 'closed';
tick = engine.tick(1000);
assert.equal(tick.frozen, true);
assert.equal(JSON.stringify(engine.state.run), JSON.stringify({ ...JSON.parse(closedSnapshot), lifecycle: 'closed' }));

const branchEngine = createChroniclesEngine({ ruleset });
for (const resourceId of ['rna', 'dna', 'biomass', 'atp']) {
  branchEngine.state.run.resources[resourceId] = { amount: 0, capOverride: 10000 };
}
branchEngine.dispatch({ type: 'ADD_RESOURCE', resourceId: 'rna', amount: 5000 });
branchEngine.dispatch({ type: 'ADD_RESOURCE', resourceId: 'dna', amount: 1000 });
branchEngine.dispatch({ type: 'ADD_RESOURCE', resourceId: 'biomass', amount: 1000 });
branchEngine.dispatch({ type: 'ADD_RESOURCE', resourceId: 'atp', amount: 1000 });
for (const nodeId of ['M01', 'M02', 'M03', 'M05', 'M06', 'C01']) {
  result = branchEngine.dispatch({ type: 'BUY_NODE', nodeId });
  assert.equal(result.ok, true);
  const pendingId = branchEngine.state.run.events.pendingId;
  if (pendingId && pendingId !== 'EV-BIO-01') {
    assert.equal(branchEngine.dispatch({ type: 'RESOLVE_EVENT', eventId: pendingId, choiceId: 'continue' }).ok, true);
  }
}
assert.equal(branchEngine.state.run.goals.states.G006.status, 'active');
assert.deepEqual(selectNodeCost(branchEngine.state, ruleset, 'C02A'), { biomass: 30, atp: 15 });
result = branchEngine.dispatch({ type: 'BUY_NODE', nodeId: 'C02A' });
assert.equal(result.reason, 'BLOCKED_BY_EVENT');
result = branchEngine.dispatch({ type: 'RESOLVE_EVENT', eventId: 'EV-BIO-01', choiceId: 'absorption' });
assert.equal(result.ok, true);
assert.equal(branchEngine.state.run.nodes.selectedBranchByGroup.cell_identity_1, 'C02A');
assert.equal(selectNodeStatus(branchEngine.state, ruleset, 'C02B'), 'locked');
assert.equal(branchEngine.state.run.flags['run.bio.primary_trait'], 'absorption');
assert.equal(branchEngine.state.run.flags['run.bio.absorption'], true);
assert.equal(branchEngine.state.run.goals.states.G006.status, 'archived');
assert.equal(branchEngine.state.run.goals.states.G007.status, 'active');
assert.deepEqual(selectVisibleResources(branchEngine.state, ruleset).map((resource) => resource.id), [
  'rna',
  'dna',
  'biomass',
  'atp',
]);

assert.equal(selectNodeStatus(branchEngine.state, ruleset, 'C03'), 'available_affordable');
result = branchEngine.dispatch({ type: 'BUY_NODE', nodeId: 'C03' });
assert.equal(result.ok, true);
assert.equal(branchEngine.state.run.goals.states.G007.status, 'active');

result = branchEngine.dispatch({ type: 'BUY_NODE', nodeId: 'C04A' });
assert.equal(result.ok, true);
assert.equal(branchEngine.state.run.flags['run.bio.metabolism.photosynthesis'], true);
result = branchEngine.dispatch({ type: 'BUY_NODE', nodeId: 'C04B' });
assert.equal(result.ok, true);
assert.equal(branchEngine.state.run.flags['run.bio.metabolism.chemosynthesis'], true);
result = branchEngine.dispatch({ type: 'BUY_NODE', nodeId: 'C04C' });
assert.equal(result.ok, true);
assert.equal(branchEngine.state.run.nodes.completed.C05, undefined);

result = branchEngine.dispatch({ type: 'BUY_NODE', nodeId: 'C05' });
assert.equal(result.ok, true);
assert.equal(branchEngine.state.run.goals.states.G007.status, 'active');
assert.equal(branchEngine.state.run.resources.ap, undefined);
result = branchEngine.dispatch({ type: 'BUY_NODE', nodeId: 'C06' });
assert.equal(result.ok, true);
assert.equal(branchEngine.state.run.resources.ap, undefined);
assert.equal(branchEngine.state.run.goals.states.G007.status, 'archived');
assert.equal(branchEngine.state.run.adaptation.points, 2);
assert.equal(branchEngine.state.run.events.pendingId, 'EV-BIO-02');
assert.equal(selectNodeStatus(branchEngine.state, ruleset, 'B02A'), 'locked');
assert.equal(selectNodeStatus(branchEngine.state, ruleset, 'B02D'), 'locked');
result = branchEngine.dispatch({ type: 'BUY_NODE', nodeId: 'B02A' });
assert.equal(result.reason, 'BLOCKED_BY_EVENT');
result = branchEngine.dispatch({ type: 'RESOLVE_EVENT', eventId: 'EV-BIO-02', choiceId: 'mobility' });
assert.equal(result.ok, true);
assert.equal(branchEngine.state.run.adaptation.points, 1);
assert.deepEqual(branchEngine.state.run.adaptation.selectedOptionalNodes, ['B02A']);
assert.equal(branchEngine.state.run.goals.states.G008.status, 'archived');
result = branchEngine.dispatch({ type: 'BUY_NODE', nodeId: 'B02B' });
assert.equal(result.ok, true);
assert.deepEqual(branchEngine.state.run.adaptation.selectedOptionalNodes, ['B02A', 'B02B']);

const adaptationGateEngine = createChroniclesEngine({ ruleset });
adaptationGateEngine.state.run.eraId = 'MULTICELLULAR';
adaptationGateEngine.state.run.nodes.completed.C06 = { completedAtMs: 0 };
adaptationGateEngine.state.run.resources = { biomass: { amount: 100 }, atp: { amount: 100 }, dna: { amount: 100 } };
assert.equal(selectNodeStatus(adaptationGateEngine.state, ruleset, 'B02A'), 'available_unaffordable');

// Cognition is a "progressive" goal: it starts accumulating at B04 (alone
// worth 20/100) and must surface as its own global-goal slot from that first
// contributor, introduced by EV-BIO-04, not folded into optional side goals.
const cognitionTrackEngine = createChroniclesEngine({ ruleset });
for (const r of ['rna', 'dna', 'biomass', 'atp']) cognitionTrackEngine.state.run.resources[r] = { amount: 0, capOverride: 1e7 };
for (const r of ['rna', 'dna', 'biomass', 'atp']) cognitionTrackEngine.dispatch({ type: 'ADD_RESOURCE', resourceId: r, amount: 1e6 });
for (const nodeId of ['M01', 'M02', 'M03', 'M05', 'M06', 'C01']) {
  cognitionTrackEngine.dispatch({ type: 'BUY_NODE', nodeId });
  const pid = cognitionTrackEngine.state.run.events.pendingId;
  if (pid) cognitionTrackEngine.dispatch({ type: 'RESOLVE_EVENT', eventId: pid, choiceId: 'continue' });
}
cognitionTrackEngine.dispatch({ type: 'RESOLVE_EVENT', eventId: 'EV-BIO-01', choiceId: 'absorption' });
for (const nodeId of ['C03', 'C05', 'C06']) cognitionTrackEngine.dispatch({ type: 'BUY_NODE', nodeId });
cognitionTrackEngine.dispatch({ type: 'RESOLVE_EVENT', eventId: 'EV-BIO-02', choiceId: 'mobility' });
for (const nodeId of ['C07', 'B03']) cognitionTrackEngine.dispatch({ type: 'BUY_NODE', nodeId });
cognitionTrackEngine.dispatch({ type: 'BUY_NODE', nodeId: 'B04' });
assert.equal(cognitionTrackEngine.state.run.events.pendingId, 'EV-BIO-04');
assert.deepEqual(selectProgressiveGoals(cognitionTrackEngine.state, ruleset).map((goal) => goal.id), ['G011_COGNITION_TRACK']);
assert.equal(selectSideGoals(cognitionTrackEngine.state, ruleset).some((goal) => goal.id === 'G011_COGNITION_TRACK'), false);
result = cognitionTrackEngine.dispatch({ type: 'RESOLVE_EVENT', eventId: 'EV-BIO-04', choiceId: 'continue' });
assert.equal(result.ok, true);

// Cognition is derived from neural progress. Sapience has no spendable price:
// it becomes available only at 100 and performs the civilization-start transaction.
const sapienceEngine = createChroniclesEngine({ ruleset });
sapienceEngine.state.run.eraId = 'MULTICELLULAR';
sapienceEngine.state.run.resources = {
  biomass: { amount: 1000, capOverride: 10000 }, atp: { amount: 1000, capOverride: 10000 }, dna: { amount: 1000, capOverride: 10000 },
};
for (const nodeId of ['C07', 'B03', 'B04', 'B05', 'N03', 'N05']) {
  sapienceEngine.state.run.nodes.completed[nodeId] = { completedAtMs: 0 };
}
assert.deepEqual(selectCognition(sapienceEngine.state, ruleset), { value: 100, max: 100 });
result = sapienceEngine.dispatch({ type: 'BUY_NODE', nodeId: 'N07' });
assert.equal(result.ok, true);
assert.equal(sapienceEngine.state.run.eraId, 'EARLY_CIV');
assert.equal(sapienceEngine.state.run.population.current, 5);
assert.equal(sapienceEngine.state.run.resources.food.amount, 120);
assert.equal(sapienceEngine.state.run.resources.materials.amount, 45);
assert.equal(sapienceEngine.state.run.resources.knowledge.amount, 12);

const cultureBranchEngine = createChroniclesEngine({ ruleset });
cultureBranchEngine.state.run.eraId = 'EARLY_CIV';
for (const resourceId of ['food', 'materials', 'knowledge']) {
  cultureBranchEngine.state.run.resources[resourceId] = { amount: 0, capOverride: 10000 };
}
cultureBranchEngine.dispatch({ type: 'ADD_RESOURCE', resourceId: 'food', amount: 1000 });
cultureBranchEngine.dispatch({ type: 'ADD_RESOURCE', resourceId: 'materials', amount: 1000 });
cultureBranchEngine.dispatch({ type: 'ADD_RESOURCE', resourceId: 'knowledge', amount: 1000 });
result = cultureBranchEngine.dispatch({ type: 'BUY_NODE', nodeId: 'T01A' });
assert.equal(result.ok, true);
assert.equal(cultureBranchEngine.state.run.nodes.selectedBranchByGroup.culture_1, 'T01A');
assert.equal(selectNodeStatus(cultureBranchEngine.state, ruleset, 'T01B'), 'locked');
assert.equal(selectNodeStatus(cultureBranchEngine.state, ruleset, 'T01C'), 'locked');

const manualRewardEngine = createChroniclesEngine({ ruleset });
assert.deepEqual(selectManualProcessView(manualRewardEngine.state, ruleset, 'MANUAL_PRIMORDIAL_PULSE').reward, { rna: 1 });
manualRewardEngine.dispatch({ type: 'ADD_RESOURCE', resourceId: 'rna', amount: 9 });
result = manualRewardEngine.dispatch({ type: 'BUY_NODE', nodeId: 'M01' });
assert.equal(result.ok, true);
assert.deepEqual(selectManualProcessView(manualRewardEngine.state, ruleset, 'MANUAL_PRIMORDIAL_PULSE').reward, { rna: 2 });
manualRewardEngine.tick(3500);
result = manualRewardEngine.dispatch({ type: 'USE_MANUAL_PROCESS', processId: 'MANUAL_PRIMORDIAL_PULSE' });
assert.equal(result.ok, true);
assert.deepEqual(result.events.find((event) => event.type === 'manual_process_used').payload.reward, { rna: 2 });

const manualDnaEngine = createChroniclesEngine({ ruleset });
manualDnaEngine.state.run.resources.rna.capOverride = 1000;
assert.equal(selectManualProcessView(manualDnaEngine.state, ruleset, 'MANUAL_DNA_SYNTHESIS').available, false);
result = manualDnaEngine.dispatch({ type: 'USE_MANUAL_PROCESS', processId: 'MANUAL_DNA_SYNTHESIS' });
assert.equal(result.ok, false);
assert.equal(result.reason, 'MANUAL_PROCESS_UNAVAILABLE');
manualDnaEngine.dispatch({ type: 'ADD_RESOURCE', resourceId: 'rna', amount: 9 });
assert.equal(manualDnaEngine.dispatch({ type: 'BUY_NODE', nodeId: 'M01' }).ok, true);
manualDnaEngine.dispatch({ type: 'ADD_RESOURCE', resourceId: 'rna', amount: 130 });
assert.equal(manualDnaEngine.dispatch({ type: 'BUY_NODE', nodeId: 'M02' }).ok, true);
manualDnaEngine.dispatch({ type: 'ADD_RESOURCE', resourceId: 'rna', amount: 350 });
assert.equal(manualDnaEngine.dispatch({ type: 'BUY_NODE', nodeId: 'M03' }).ok, true);
assert.equal(selectManualProcessView(manualDnaEngine.state, ruleset, 'MANUAL_DNA_SYNTHESIS').available, true);
assert.deepEqual(selectManualProcessView(manualDnaEngine.state, ruleset, 'MANUAL_DNA_SYNTHESIS').inputCost, { rna: 18 });
assert.deepEqual(selectManualProcessView(manualDnaEngine.state, ruleset, 'MANUAL_DNA_SYNTHESIS').reward, { dna: 3 });
result = manualDnaEngine.dispatch({ type: 'USE_MANUAL_PROCESS', processId: 'MANUAL_DNA_SYNTHESIS' });
assert.equal(result.ok, false);
assert.equal(result.reason, 'INSUFFICIENT_RESOURCES');
manualDnaEngine.dispatch({ type: 'ADD_RESOURCE', resourceId: 'rna', amount: 18 });
result = manualDnaEngine.dispatch({
  type: 'USE_MANUAL_PROCESS',
  processId: 'MANUAL_DNA_SYNTHESIS',
  rewardMultiplier: 2,
});
assert.equal(result.ok, true);
assert.equal(manualDnaEngine.state.run.resources.rna.amount, 0);
assert.equal(manualDnaEngine.state.run.resources.dna.amount, 6);
assert.equal(manualDnaEngine.state.run.manualProcesses.MANUAL_DNA_SYNTHESIS.availableAtMs, 45000);

assert.equal(formatResourceAmount(8.9), '8');
assert.equal(formatResourceAmount(-0.2), '0');
assert.equal(formatDuration(1), '1с');
assert.equal(formatDuration(45), '45с');
assert.equal(formatDuration(63), '1м 3с');
assert.equal(formatDuration(3599), '59м 59с');
assert.equal(formatDuration(3660), '1ч 1м');
assert.equal(formatDuration(101040), '1д 4ч 4м');
assert.equal(formatEtaDuration(45.01), '46с');
assert.equal(formatEtaDuration(59.01), '1м');
assert.equal(formatEtaDuration(60.01), '1м 1с');
assert.equal(formatEtaDuration(3599.1), '1ч 0м');
assert.equal(formatEtaDuration(3600.1), '1ч 1м');
assert.equal(formatEtaDuration(86400.1), '1д 0ч 1м');

const etaEngine = createChroniclesEngine({ ruleset });
etaEngine.state.run.producers.PROC_PRIMORDIAL_REACTION = { count: 1 };
let eta = selectPurchaseEta(etaEngine.state, ruleset, 'available_unaffordable', { rna: 2.2 });
assert.equal(eta.status, 'waiting');
assert.equal(Math.abs(eta.seconds - 2.857142857142857) < 0.000001, true);
assert.equal(formatEta(eta), '≈3с');
etaEngine.dispatch({ type: 'ADD_RESOURCE', resourceId: 'rna', amount: 3 });
assert.equal(selectPurchaseEta(etaEngine.state, ruleset, 'available_affordable', { rna: 2.2 }).status, 'now');
assert.equal(formatEta(selectPurchaseEta(etaEngine.state, ruleset, 'available_affordable', { rna: 2.2 })), 'Сейчас');
eta = selectPurchaseEta(etaEngine.state, ruleset, 'available_unaffordable', { dna: 1 });
assert.equal(eta.status, 'unavailable');
assert.equal(formatEta(eta), 'Недоступно');
assert.equal(formatEta(selectPurchaseEta(etaEngine.state, ruleset, 'locked', { rna: 100 })), 'Недоступно');
assert.equal(selectPurchaseEta(etaEngine.state, ruleset, 'completed', { rna: 100 }), null);
assert.equal(timeUntilAffordable(etaEngine.state, ruleset, { rna: 2.2 }).status, 'now');
const rnaCap = calculateCap(etaEngine.state, 'rna', ruleset);
const capEta = timeUntilAffordable(etaEngine.state, ruleset, { rna: rnaCap + 1000 });
assert.equal(capEta.status, 'unavailable');

const stalledEngine = createChroniclesEngine({ ruleset });
let initialStartedEvents = stalledEngine.state.session.lastEvents.filter((event) => event.type === 'goal_started');
assert.equal(initialStartedEvents.length, 1);
assert.equal(initialStartedEvents[0].payload.goalId, 'G001');
tick = stalledEngine.tick(20000);
assert.equal(stalledEngine.state.run.goals.states.G001.status, 'stalled');
assert.equal(tick.events.filter((event) => event.type === 'goal_hint_shown').length, 1);
assert.equal(tick.events.filter((event) => event.type === 'goal_started').length, 0);
result = stalledEngine.dispatch({ type: 'ADD_RESOURCE', resourceId: 'rna', amount: 9 });
assert.equal(result.events.filter((event) => event.type === 'goal_started').length, 0);
result = stalledEngine.dispatch({ type: 'BUY_NODE', nodeId: 'M01' });
assert.equal(result.ok, true);
assert.equal(result.events.filter((event) => event.type === 'goal_completed' && event.payload.goalId === 'G001').length, 1);
const rewardAppliedAtMs = stalledEngine.state.run.goals.states.G001.rewardAppliedAtMs;
tick = stalledEngine.tick(1000);
assert.equal(stalledEngine.state.run.goals.states.G001.rewardAppliedAtMs, rewardAppliedAtMs);
assert.equal(tick.events.filter((event) => event.type === 'goal_completed' && event.payload.goalId === 'G001').length, 0);

const primordialMilestones = ruleset.producers.find((producer) => producer.id === 'PROC_PRIMORDIAL_REACTION').milestones;
assert.equal(producerMilestoneMultiplier(9, primordialMilestones), 1);
assert.equal(producerMilestoneMultiplier(10, primordialMilestones), 1.15);
assert.equal(producerMilestoneMultiplier(11, primordialMilestones), 1.15);
assert.equal(producerMilestoneMultiplier(24, primordialMilestones), 1.15);
assert.equal(producerMilestoneMultiplier(25, primordialMilestones), 1.15);
assert.equal(producerMilestoneMultiplier(49, primordialMilestones), 1.15);
assert.equal(producerMilestoneMultiplier(50, primordialMilestones), 1.15);
for (let count = 1; count <= 100; count += 1) {
  assert.equal(producerMilestoneMultiplier(count), 1);
}

const explicitMilestoneEngine = createChroniclesEngine({ ruleset });
explicitMilestoneEngine.state.run.resources.rna.capOverride = 1000;
explicitMilestoneEngine.dispatch({ type: 'ADD_RESOURCE', resourceId: 'rna', amount: 1000 });
for (let index = 0; index < 10; index += 1) {
  result = explicitMilestoneEngine.dispatch({ type: 'BUY_PRODUCER', producerId: 'PROC_PRIMORDIAL_REACTION' });
  assert.equal(result.ok, true);
}
assert.equal(primordialMilestones.length, 1);
assert.equal(selectProductionRates(explicitMilestoneEngine.state, ruleset).rna, 8.854999999999999);
const explicitMilestoneOutput = selectProducerOutputView(
  explicitMilestoneEngine.state,
  ruleset,
  'PROC_PRIMORDIAL_REACTION'
);
assert.deepEqual(explicitMilestoneOutput.basePerUnit, { rna: 0.77 });
assert.deepEqual(explicitMilestoneOutput.currentTotal, { rna: 8.854999999999999 });
assert.equal(explicitMilestoneOutput.reachedMilestone.label, 'Reaction network');
assert.equal(explicitMilestoneOutput.milestoneMultiplier, 1.15);

const customRuleset = {
  ...ruleset,
  version: 'custom-minimal-v1',
  resources: [{ id: 'rna', labelKey: 'resource.rna', initialAmount: 5, visibleFromEra: 'MOLECULAR' }],
  producers: [],
  nodes: [],
  buildings: [],
  jobs: [],
  manualProcesses: [],
  goals: [],
  events: [],
  milestones: [],
  endings: [],
  branchGroups: {},
  branchCostRules: {},
};
const customEngine = createChroniclesEngine({ ruleset: customRuleset });
assert.equal(customEngine.state.run.rulesetVersion, 'custom-minimal-v1');
assert.deepEqual(selectResourceAmounts(customEngine.state), { rna: 5 });
assert.equal(createInitialGameState({ ruleset: customRuleset }).run.rulesetVersion, 'custom-minimal-v1');

// Civilization resources retain distinct original semantics: jobs are their
// source, Food pays Population maintenance, and Materials/Knowledge remain
// spendable stocks rather than invented maintenance drains.
const civilizationEngine = createChroniclesEngine({ ruleset });
civilizationEngine.state.run.eraId = 'EARLY_CIV';
civilizationEngine.state.run.resources = {
  food: { amount: 0, capOverride: 10000 },
  materials: { amount: 0, capOverride: 10000 },
  knowledge: { amount: 0, capOverride: 10000 },
};
civilizationEngine.state.run.population = {
  current: 5,
  peak: 5,
  baseCap: 8,
  assignments: {},
  foodStatus: 'healthy',
};
assert.equal(civilizationEngine.dispatch({ type: 'ASSIGN_JOB', jobId: 'JOB_TRIBE_FORAGER', amount: 2 }).ok, true);
assert.equal(civilizationEngine.dispatch({ type: 'ASSIGN_JOB', jobId: 'JOB_TRIBE_GATHERER', amount: 2 }).ok, true);
assert.equal(civilizationEngine.dispatch({ type: 'ASSIGN_JOB', jobId: 'JOB_TRIBE_THINKER', amount: 1 }).ok, true);
assert.deepEqual(selectPopulation(civilizationEngine.state), {
  current: 5,
  peak: 5,
  baseCap: 8,
  assignments: { JOB_TRIBE_FORAGER: 2, JOB_TRIBE_GATHERER: 2, JOB_TRIBE_THINKER: 1 },
  foodStatus: 'healthy',
  cap: 8,
  assigned: 5,
  unassigned: 0,
});
tick = civilizationEngine.tick(1000);
assert.equal(Math.abs(tick.rates.food - 5.6) < 0.000001, true);
assert.equal(Math.abs(tick.rates.materials - 3.36) < 0.000001, true);
assert.equal(Math.abs(tick.rates.knowledge - 0.7) < 0.000001, true);
assert.equal(civilizationEngine.state.run.population.current > 5, true);
assert.equal(civilizationEngine.dispatch({ type: 'ASSIGN_JOB', jobId: 'JOB_TRIBE_FORAGER', amount: 0 }).ok, true);
civilizationEngine.state.run.resources.food.amount = 0;
tick = civilizationEngine.tick(1000);
assert.equal(civilizationEngine.state.run.population.foodStatus, 'deficit');
assert.equal(tick.events.some((event) => event.type === 'food_deficit_started'), true);
const populationAtDeficit = civilizationEngine.state.run.population.current;
assert.equal(civilizationEngine.dispatch({ type: 'ASSIGN_JOB', jobId: 'JOB_TRIBE_FORAGER', amount: 2 }).ok, true);
tick = civilizationEngine.tick(1000);
assert.equal(civilizationEngine.state.run.population.foodStatus, 'healthy');
assert.equal(tick.events.some((event) => event.type === 'food_deficit_recovered'), true);
assert.equal(civilizationEngine.state.run.population.current > populationAtDeficit, true);
assert.equal(
  civilizationEngine.dispatch({ type: 'ASSIGN_JOB', jobId: 'JOB_TRIBE_GATHERER', amount: 8 }).reason,
  'POPULATION_ASSIGNMENT_EXCEEDED'
);

// Power is generated and stored as an industrial resource. A powered building
// is curtailed while the reserve is empty and automatically recovers once a
// plant has filled it; it never consumes Population or creates a second fuel currency.
const powerEngine = createChroniclesEngine({ ruleset });
powerEngine.state.run.eraId = 'INDUSTRY';
powerEngine.state.run.resources = {
  materials: { amount: 10, capOverride: 10000 },
  knowledge: { amount: 0, capOverride: 10000 },
  power: { amount: 0, capOverride: 10000 },
};
powerEngine.state.run.buildings = {
  BLD_STEAM_PLANT: { count: 1 },
  BLD_FOUNDRY: { count: 1 },
};
powerEngine.state.run.nodes.completed.T14 = { completedAtMs: 0 };
tick = powerEngine.tick(1000);
assert.equal(tick.events.some((event) => event.type === 'power_deficit_started'), true);
assert.equal(powerEngine.state.run.economy.deficits.power, true);
tick = powerEngine.tick(1000);
assert.equal(tick.events.some((event) => event.type === 'power_deficit_recovered'), true);
assert.equal(powerEngine.state.run.economy.deficits.power, false);
assert.equal(powerEngine.state.run.resources.materials.amount > 10, true);

// T1-0 event contract: a pending branch is resolved atomically through the
// same node purchase path, and cannot be bypassed from the evolution grid.
const eventEngine = createChroniclesEngine({ ruleset, eventSeed: 77 });
eventEngine.state.run.eraId = 'CELLULAR';
eventEngine.state.run.nodes.completed.M06 = { completedAtMs: 0 };
eventEngine.dispatch({ type: 'ADD_RESOURCE', resourceId: 'biomass', amount: 100 });
result = eventEngine.dispatch({ type: 'BUY_NODE', nodeId: 'C01' });
assert.equal(result.ok, true);
assert.equal(eventEngine.state.run.events.pendingId, 'EV-CELL-01');
assert.equal(eventEngine.dispatch({ type: 'RESOLVE_EVENT', eventId: 'EV-CELL-01', choiceId: 'continue' }).ok, true);
assert.equal(eventEngine.state.run.events.pendingId, 'EV-BIO-01');
eventEngine.dispatch({ type: 'ADD_RESOURCE', resourceId: 'atp', amount: 15 });
result = eventEngine.dispatch({ type: 'BUY_NODE', nodeId: 'C02A' });
assert.equal(result.ok, false);
assert.equal(result.reason, 'BLOCKED_BY_EVENT');
result = eventEngine.dispatch({ type: 'RESOLVE_EVENT', eventId: 'EV-BIO-01', choiceId: 'absorption' });
assert.equal(result.ok, true);
assert.equal(eventEngine.state.run.events.pendingId, null);
assert.equal(eventEngine.state.run.events.states['EV-BIO-01'].status, 'resolved');
assert.equal(eventEngine.state.run.nodes.completed.C02A !== undefined, true);
assert.equal(eventEngine.state.run.flags['run.bio.primary_trait'], 'absorption');
assert.equal(eventEngine.state.meta.chronicle.some((record) => record.eventId === 'EV-BIO-01'), true);

const deckState = createInitialGameState({ ruleset, eventSeed: 11 });
deckState.run.nodes.completed.M01 = { completedAtMs: 0 };
deckState.run.goals.states.G001 = { status: 'archived' };
const deckA = createChroniclesEngine({ ruleset, state: deckState });
deckA.tick(60000);
assert.equal(deckA.state.run.events.pendingId, 'EV-RNA-RESONANCE');
const deckBState = JSON.parse(JSON.stringify(createInitialGameState({ ruleset, eventSeed: 11 })));
const deckB = createChroniclesEngine({ ruleset, state: deckBState });
deckB.state.run.nodes.completed.M01 = { completedAtMs: 0 };
deckB.state.run.goals.states.G001 = { status: 'archived' };
deckB.tick(60000);
assert.equal(deckB.state.run.events.pendingId, deckA.state.run.events.pendingId);
assert.equal(deckB.state.run.events.rngState, deckA.state.run.events.rngState);

// Full T1 route: phase transitions remap jobs, Atomic starts the bounded
// authored crisis sequence, and every Last Protocol variant still reaches Ash.
const fullRouteEngine = createChroniclesEngine({ ruleset });
fullRouteEngine.state.run.eraId = 'CITY';
fullRouteEngine.state.run.resources = {
  food: { amount: 10000, capOverride: 100000 }, materials: { amount: 10000, capOverride: 100000 },
  knowledge: { amount: 10000, capOverride: 100000 }, power: { amount: 10000, capOverride: 100000 },
};
fullRouteEngine.state.run.population = {
  current: 100, peak: 100, baseCap: 120, assignments: { JOB_CITY_WORKER: 3 }, foodStatus: 'healthy',
};
for (const nodeId of ['T12', 'T13', 'T14']) fullRouteEngine.state.run.nodes.completed[nodeId] = { completedAtMs: 0 };
fullRouteEngine.state.run.buildings = { BLD_FACTORY: { count: 1 }, BLD_STEAM_PLANT: { count: 1 } };
result = fullRouteEngine.dispatch({ type: 'BUY_NODE', nodeId: 'T15' });
assert.equal(result.ok, true);
assert.equal(fullRouteEngine.state.run.eraId, 'INDUSTRY');
assert.deepEqual(fullRouteEngine.state.run.population.assignments, { JOB_INDUSTRY_WORKER: 3 });
assert.equal(fullRouteEngine.dispatch({ type: 'RESOLVE_EVENT', eventId: 'EV-CIV-06', choiceId: 'clean' }).ok, true);

fullRouteEngine.state.run.eraId = 'PRE_ATOMIC';
for (const resource of Object.values(fullRouteEngine.state.run.resources)) resource.amount = 20000;
for (const nodeId of ['A01', 'A02', 'A03']) fullRouteEngine.state.run.nodes.completed[nodeId] = { completedAtMs: 0 };
fullRouteEngine.state.run.buildings.BLD_REACTOR_LAB = { count: 1 };
result = fullRouteEngine.dispatch({ type: 'BUY_NODE', nodeId: 'A04' });
assert.equal(result.ok, true);
assert.equal(fullRouteEngine.state.run.eraId, 'ATOMIC');
assert.equal(fullRouteEngine.state.run.crisis.stability, 100);
assert.equal(fullRouteEngine.state.run.events.pendingId, 'EV-NAR-03');
assert.equal(fullRouteEngine.dispatch({ type: 'RESOLVE_EVENT', eventId: 'EV-NAR-03', choiceId: 'continue' }).ok, true);
fullRouteEngine.tick(120000);
assert.equal(fullRouteEngine.state.run.events.pendingId, 'EV-CR-01');
assert.equal(fullRouteEngine.dispatch({ type: 'RESOLVE_EVENT', eventId: 'EV-CR-01', choiceId: 'deescalate' }).ok, true);
fullRouteEngine.tick(180000);
assert.equal(fullRouteEngine.state.run.events.pendingId, 'EV-CR-02');
assert.equal(fullRouteEngine.dispatch({ type: 'RESOLVE_EVENT', eventId: 'EV-CR-02', choiceId: 'manual_verify' }).ok, true);
fullRouteEngine.tick(180000);
assert.equal(fullRouteEngine.state.run.crisis.phase, 'C3');
fullRouteEngine.tick(240000);
assert.equal(fullRouteEngine.state.run.events.pendingId, 'EV-CR-03');
assert.equal(fullRouteEngine.dispatch({ type: 'RESOLVE_EVENT', eventId: 'EV-CR-03', choiceId: 'disarm' }).ok, true);
assert.equal(fullRouteEngine.state.run.lifecycle, 'ended');
assert.equal(fullRouteEngine.state.run.ending.subtype, 'ash_too_late');
result = fullRouteEngine.dispatch({ type: 'ARCHIVE_RESET' });
assert.equal(result.ok, true);
assert.equal(fullRouteEngine.state.run.lifecycle, 'active');
assert.equal(fullRouteEngine.state.meta.archiveFragments >= 14 && fullRouteEngine.state.meta.archiveFragments <= 18, true);
assert.equal(fullRouteEngine.state.meta.chronicle.some((record) => record.kind === 'ending'), true);

assert.doesNotThrow(() => JSON.stringify(engine.state.run));
assert.equal(typeof rng.next(), 'number');
clock.start((deltaMs) => engine.tick(deltaMs));
clock.advance(250);
assert.equal(clock.getNow(), 1250);

// T2 "Одиночки" (docs/gdd/13_ACT_ONE_CHAPTERS.md): its own recap chain
// (G040-G042) plus new live content (G027/G028) and collapse (G029/G030,
// ENDING_CATACLYSM) only activate for a run tagged actOneAttempt: 'T2' --
// T1's own goals (G001-G026) must stay silent even though this run marches
// through the exact same nodes.
const t2Engine = createChroniclesEngine({ ruleset, actOneAttempt: 'T2' });
assert.equal(t2Engine.state.run.actOneAttempt, 'T2');
t2Engine.state.run.eraId = 'SETTLEMENT';
for (const nodeId of ['M06', 'N07', 'T05', 'T08', 'T09']) {
  t2Engine.state.run.nodes.completed[nodeId] = { completedAtMs: 0 };
}
t2Engine.state.run.population = { current: 14, peak: 14, baseCap: 20, assignments: {}, foodStatus: 'healthy' };
t2Engine.state.run.buildings = { BLD_FIELD: { count: 1 }, BLD_HOUSE: { count: 1 }, BLD_WORKSHOP: { count: 1 } };
result = t2Engine.dispatch({ type: 'ADD_RESOURCE', resourceId: 'food', amount: 0 });
assert.equal(result.ok, true);
for (const goalId of ['G040', 'G041', 'G042', 'G027', 'G028']) {
  assert.equal(t2Engine.state.run.goals.states[goalId]?.status, 'archived');
}
for (const goalId of ['G001', 'G015', 'G025', 'G026']) {
  assert.equal(t2Engine.state.run.goals.states[goalId], undefined);
}
assert.equal(t2Engine.state.run.events.pendingId, 'EV-NAR-T2');
assert.equal(t2Engine.dispatch({ type: 'RESOLVE_EVENT', eventId: 'EV-NAR-T2', choiceId: 'continue' }).ok, true);
assert.equal(t2Engine.state.run.chapterTimers.chapter2_cataclysm.active, true);
t2Engine.tick(120000);
assert.equal(t2Engine.state.run.events.pendingId, 'EV-CR-T2');
assert.equal(t2Engine.dispatch({ type: 'RESOLVE_EVENT', eventId: 'EV-CR-T2', choiceId: 'relocate' }).ok, true);
assert.equal(t2Engine.state.run.lifecycle, 'ended');
assert.equal(t2Engine.state.run.ending.id, 'ENDING_CATACLYSM');
assert.equal(t2Engine.state.run.ending.subtype, 'cataclysm_relocated');

const missingChoice = t2Engine.dispatch({ type: 'ARCHIVE_RESET' });
assert.equal(missingChoice.ok, false);
assert.equal(missingChoice.reason, 'INVALID_ARCHIVE_RECALL_PERK_CHOICE');

const t2Reset = t2Engine.dispatch({ type: 'ARCHIVE_RESET', perkChoiceId: 'invest' });
assert.equal(t2Reset.ok, true);
assert.equal(t2Engine.state.run.lifecycle, 'active');
assert.equal(t2Engine.state.meta.archiveRecall.chapters.T2.styleChoice, 'invest');
assert.equal(t2Engine.state.meta.archiveRecall.chapters.T2.defensePerkId, 'T2_DEFENSE_QUARANTINE_PROTOCOL');
// T3 now exists as its own chapter, so T2's reset advances into it.
assert.equal(t2Engine.state.run.actOneAttempt, 'T3');
assert.equal(t2Engine.state.run.modifiers.active['T2_INVEST_LARGE_CONTAINERS:capacity_multiplier:food'].value, 1.3);
assert.equal(calculateCap(t2Engine.state, 'food', ruleset), 390);

// T3 "Крепость": recap now covers RNA->Settlement in 2 coarse steps
// (G050/G051, even coarser than T2's 3 despite covering more ground), then
// new City content (G031/G032, including the retargeted governance flavor
// event EV-CIV-04) and its own collapse (G033/G034, ENDING_FRACTURE).
const t3Engine = createChroniclesEngine({ ruleset, actOneAttempt: 'T3' });
assert.equal(t3Engine.state.run.actOneAttempt, 'T3');
t3Engine.state.run.eraId = 'CITY';
for (const nodeId of ['T05', 'T09', 'T10', 'T11', 'T12']) {
  t3Engine.state.run.nodes.completed[nodeId] = { completedAtMs: 0 };
}
t3Engine.state.run.population = { current: 28, peak: 28, baseCap: 35, assignments: {}, foodStatus: 'healthy' };
t3Engine.state.run.buildings = {
  BLD_FIELD: { count: 1 }, BLD_HOUSE: { count: 1 }, BLD_WORKSHOP: { count: 1 },
  BLD_SCHOOL: { count: 1 }, BLD_MARKET: { count: 1 },
};
result = t3Engine.dispatch({ type: 'ADD_RESOURCE', resourceId: 'food', amount: 0 });
assert.equal(result.ok, true);
for (const goalId of ['G050', 'G051', 'G031', 'G032']) {
  assert.equal(t3Engine.state.run.goals.states[goalId]?.status, 'archived');
}
for (const goalId of ['G040', 'G041', 'G042', 'G027', 'G028', 'G029', 'G030']) {
  assert.equal(t3Engine.state.run.goals.states[goalId], undefined);
}
// Both EV-NAR-T3 (rising, priority 58) and the retargeted EV-CIV-04
// (governance, priority 50) queue off the same G032 completion.
assert.equal(t3Engine.state.run.events.pendingId, 'EV-NAR-T3');
assert.deepEqual(t3Engine.state.run.events.queue, ['EV-CIV-04']);
assert.equal(t3Engine.dispatch({ type: 'RESOLVE_EVENT', eventId: 'EV-NAR-T3', choiceId: 'continue' }).ok, true);
assert.equal(t3Engine.state.run.chapterTimers.chapter3_fracture.active, true);
assert.equal(t3Engine.dispatch({ type: 'RESOLVE_EVENT', eventId: 'EV-CIV-04', choiceId: 'council' }).ok, true);
assert.equal(t3Engine.state.run.flags['run.civ.governance'], 'council');
t3Engine.tick(120000);
assert.equal(t3Engine.state.run.events.pendingId, 'EV-CR-T3');
assert.equal(t3Engine.dispatch({ type: 'RESOLVE_EVENT', eventId: 'EV-CR-T3', choiceId: 'mediate' }).ok, true);
assert.equal(t3Engine.state.run.lifecycle, 'ended');
assert.equal(t3Engine.state.run.ending.id, 'ENDING_FRACTURE');
assert.equal(t3Engine.state.run.ending.subtype, 'fracture_mediated');

const t3MissingChoice = t3Engine.dispatch({ type: 'ARCHIVE_RESET' });
assert.equal(t3MissingChoice.ok, false);
assert.equal(t3MissingChoice.reason, 'INVALID_ARCHIVE_RECALL_PERK_CHOICE');

const t3Reset = t3Engine.dispatch({ type: 'ARCHIVE_RESET', perkChoiceId: 'auto' });
assert.equal(t3Reset.ok, true);
assert.equal(t3Engine.state.meta.archiveRecall.chapters.T3.styleChoice, 'auto');
assert.equal(t3Engine.state.meta.archiveRecall.chapters.T3.defensePerkId, 'T3_DEFENSE_SEISMIC_FOOTINGS');
// T4 doesn't exist as its own chapter yet -- falls back to T1 by default.
assert.equal(t3Engine.state.run.actOneAttempt, 'T1');

// "Самоорганизация" (auto perk): idle population auto-fills era jobs, and a
// job stuck at its output resource's cap auto-reassigns elsewhere.
t3Engine.state.run.eraId = 'CITY';
t3Engine.state.run.population = { current: 5, peak: 5, baseCap: 10, assignments: { JOB_CITY_WORKER: 5 }, foodStatus: 'healthy' };
t3Engine.state.run.resources.materials = { amount: 300, capOverride: 300 };
t3Engine.state.run.resources.food = { amount: 1000, capOverride: 100000 };
t3Engine.tick(1000);
assert.deepEqual(t3Engine.state.run.population.assignments, { JOB_CITY_WORKER: 0, JOB_CITY_FARMER: 5 });

// "Единство раньше" (efficiency perk): chapter3_fracture's total duration
// stretches ×1.3 while the final cliff stays the same absolute length.
const t3EffEngine = createChroniclesEngine({ ruleset, actOneAttempt: 'T3' });
t3EffEngine.dispatch({ type: 'ADD_RESOURCE', resourceId: 'rna', amount: 0 });
t3EffEngine.state.meta.archiveRecall = { chapters: { T3: { styleChoice: 'efficiency', perkId: 'T3_EFFICIENCY_UNITY_SOONER', defensePerkId: null } } };
t3EffEngine.state.run.modifiers.active['T3_EFFICIENCY_UNITY_SOONER:chapter_timer_duration:chapter3_fracture'] = {
  type: 'chapter_timer_duration_multiplier', timerId: 'chapter3_fracture', value: 1.3,
};
t3EffEngine.state.run.eraId = 'CITY';
t3EffEngine.state.run.population = { current: 20, peak: 20, baseCap: 30, assignments: {}, foodStatus: 'healthy' };
t3EffEngine.state.run.chapterTimers = { chapter3_fracture: { active: true, elapsedMs: 0 } };
t3EffEngine.tick(120000);
assert.equal(t3EffEngine.state.run.chapterTimers.chapter3_fracture.active, true);
assert.equal(t3EffEngine.state.run.events.pendingId, null);
t3EffEngine.tick(36000);
assert.equal(t3EffEngine.state.run.chapterTimers.chapter3_fracture.active, false);
assert.equal(t3EffEngine.state.run.events.pendingId, 'EV-CR-T3');

console.log('domain flow ok');
