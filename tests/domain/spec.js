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
  selectManualProcessView,
  selectNodeCost,
  selectNodeStatus,
  selectPurchaseEta,
  selectProducerOutputView,
  selectProducerPrice,
  selectProductionRates,
  selectResourceAmounts,
  selectVisibleResources,
  timeUntilAffordable,
} from '../../src/chronicles/domain/selectors.js';
import { createInitialGameState } from '../../src/chronicles/domain/state.js';
import { producerMilestoneMultiplier } from '../../src/chronicles/domain/services/production.js';
import { calculateCap } from '../../src/chronicles/domain/services/resources.js';

const clock = createFakeClock(1000);
const rng = createSeededRng(42);
const engine = createChroniclesEngine({ ruleset, ports: { clock, rng } });

assert.equal(engine.state.run.rulesetVersion, 'timeline1-v2-reconciled');
assert.equal(engine.state.run.eraId, 'MOLECULAR');
assert.deepEqual(selectResourceAmounts(engine.state), { rna: 0 });
assert.deepEqual(selectVisibleResources(engine.state, ruleset).map((resource) => resource.id), ['rna']);
assert.equal(engine.state.run.resources.information, undefined);
assert.equal(engine.state.run.resources.energy, undefined);
assert.equal(engine.state.run.goals.currentId, 'G001');
assert.equal(engine.state.run.goals.chapter.activeId, 'G001');
assert.equal(engine.state.run.goals.states.G001.status, 'active');
assert.deepEqual(engine.state.run.events, { queue: [], states: {} });
assert.deepEqual(engine.state.run.modifiers, { active: {} });
assert.equal(calculateCap(engine.state, 'rna', ruleset), Infinity);
assert.equal(selectCurrentGoal(engine.state, ruleset).id, 'G001');
assert.equal(selectManualProcessView(engine.state, ruleset, 'MANUAL_PRIMORDIAL_PULSE').available, true);

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

result = engine.dispatch({ type: 'ADD_RESOURCE', resourceId: 'rna', amount: 200 });
assert.equal(result.ok, true);
assert.equal(result.events[0].type, 'resource_changed');

assert.deepEqual(selectProducerPrice(engine.state, ruleset, 'PROC_PRIMORDIAL_REACTION'), { rna: 5 });
result = engine.dispatch({ type: 'BUY_PRODUCER', producerId: 'PROC_PRIMORDIAL_REACTION' });
assert.equal(result.ok, true);
assert.equal(engine.state.run.producers.PROC_PRIMORDIAL_REACTION.count, 1);
let tick = engine.tick(1000);
assert.equal(tick.ok, true);
assert.equal(tick.rates.rna, 0.22);
assert.equal(engine.state.run.resources.rna.amount > 196, true);

result = engine.dispatch({ type: 'BUY_NODE', nodeId: 'M02' });
assert.equal(result.ok, false);
assert.equal(result.reason, 'PREREQUISITES_NOT_MET');

result = engine.dispatch({ type: 'BUY_NODE', nodeId: 'M01' });
assert.equal(result.ok, true);
assert.equal(result.events.some((event) => event.type === 'node_completed'), true);
assert.equal(result.events.some((event) => event.type === 'goal_completed'), true);
assert.equal(engine.state.run.modifiers.active['M01:auto_production'].type, 'unlock_auto_production');
tick = engine.tick(1000);
assert.equal(tick.rates.rna, 0.22);
assert.equal(selectManualProcessView(engine.state, ruleset, 'MANUAL_PRIMORDIAL_PULSE').cooldownMs, 3500);

result = engine.dispatch({ type: 'BUY_NODE', nodeId: 'M02' });
assert.equal(result.ok, true);
assert.equal(Math.abs(selectProductionRates(engine.state, ruleset).rna - 0.385) < 0.000001, true);
assert.equal(selectManualProcessView(engine.state, ruleset, 'MANUAL_PRIMORDIAL_PULSE').cooldownMs, 90000);
assert.equal(selectNodeStatus(engine.state, ruleset, 'M05'), 'locked');
assert.equal(selectNodeStatus(engine.state, ruleset, 'M04'), 'locked');

result = engine.dispatch({ type: 'BUY_PRODUCER', producerId: 'PROC_RNA_REPLICATION' });
assert.equal(result.ok, true);
result = engine.dispatch({ type: 'ADD_RESOURCE', resourceId: 'rna', amount: 500 });
assert.equal(result.ok, true);
result = engine.dispatch({ type: 'BUY_NODE', nodeId: 'M03' });
assert.equal(result.ok, true);
assert.equal(engine.state.run.resources.dna.amount, 0);
assert.deepEqual(selectVisibleResources(engine.state, ruleset).map((resource) => resource.id), ['rna', 'dna']);
assert.equal(selectNodeStatus(engine.state, ruleset, 'M04'), 'available_unaffordable');
assert.equal(selectNodeStatus(engine.state, ruleset, 'M05'), 'available_unaffordable');

result = engine.dispatch({ type: 'ADD_RESOURCE', resourceId: 'dna', amount: 500 });
assert.equal(result.ok, true);
result = engine.dispatch({ type: 'ADD_RESOURCE', resourceId: 'rna', amount: 500 });
assert.equal(result.ok, true);
result = engine.dispatch({ type: 'BUY_NODE', nodeId: 'M05' });
assert.equal(result.ok, true);
assert.equal(engine.state.run.nodes.completed.M04, undefined);
result = engine.dispatch({ type: 'ADD_RESOURCE', resourceId: 'rna', amount: 1000 });
assert.equal(result.ok, true);
result = engine.dispatch({ type: 'BUY_NODE', nodeId: 'M06' });
assert.equal(result.ok, true);
assert.equal(result.events.some((event) => event.type === 'cell_reached'), true);
assert.equal(engine.state.run.eraId, 'CELLULAR');
assert.equal(engine.state.run.resources.biomass.amount, 0);
assert.deepEqual(selectVisibleResources(engine.state, ruleset).map((resource) => resource.id), ['rna', 'dna', 'biomass']);

engine.state.run.nodes.completed.T08 = { completedAtMs: 0 };
engine.state.run.eraId = 'SETTLEMENT_EARLY';
engine.state.run.flags['run.unlock.building.BLD_FIELD'] = true;
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
branchEngine.dispatch({ type: 'ADD_RESOURCE', resourceId: 'rna', amount: 5000 });
branchEngine.dispatch({ type: 'ADD_RESOURCE', resourceId: 'dna', amount: 1000 });
branchEngine.dispatch({ type: 'ADD_RESOURCE', resourceId: 'biomass', amount: 1000 });
branchEngine.dispatch({ type: 'ADD_RESOURCE', resourceId: 'energy', amount: 1000 });
for (const nodeId of ['M01', 'M02', 'M03', 'M05', 'M06', 'C01']) {
  result = branchEngine.dispatch({ type: 'BUY_NODE', nodeId });
  assert.equal(result.ok, true);
}
assert.equal(branchEngine.state.run.goals.states.G006.status, 'active');
assert.deepEqual(selectNodeCost(branchEngine.state, ruleset, 'C02A'), { biomass: 30 });
result = branchEngine.dispatch({ type: 'BUY_NODE', nodeId: 'C02A' });
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
  'energy',
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

const cultureBranchEngine = createChroniclesEngine({ ruleset });
cultureBranchEngine.state.run.eraId = 'EARLY_CIV';
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
assert.equal(Math.abs(eta.seconds - 10) < 0.000001, true);
assert.equal(formatEta(eta), '≈10с');
etaEngine.dispatch({ type: 'ADD_RESOURCE', resourceId: 'rna', amount: 3 });
assert.equal(selectPurchaseEta(etaEngine.state, ruleset, 'available_affordable', { rna: 2.2 }).status, 'now');
assert.equal(formatEta(selectPurchaseEta(etaEngine.state, ruleset, 'available_affordable', { rna: 2.2 })), 'Сейчас');
eta = selectPurchaseEta(etaEngine.state, ruleset, 'available_unaffordable', { dna: 1 });
assert.equal(eta.status, 'unavailable');
assert.equal(formatEta(eta), 'Недоступно');
assert.equal(formatEta(selectPurchaseEta(etaEngine.state, ruleset, 'locked', { rna: 100 })), 'Недоступно');
assert.equal(selectPurchaseEta(etaEngine.state, ruleset, 'completed', { rna: 100 }), null);
assert.equal(timeUntilAffordable(etaEngine.state, ruleset, { rna: 2.2 }).status, 'now');

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
explicitMilestoneEngine.dispatch({ type: 'ADD_RESOURCE', resourceId: 'rna', amount: 1000 });
for (let index = 0; index < 10; index += 1) {
  result = explicitMilestoneEngine.dispatch({ type: 'BUY_PRODUCER', producerId: 'PROC_PRIMORDIAL_REACTION' });
  assert.equal(result.ok, true);
}
assert.equal(primordialMilestones.length, 1);
assert.equal(selectProductionRates(explicitMilestoneEngine.state, ruleset).rna, 2.53);
const explicitMilestoneOutput = selectProducerOutputView(
  explicitMilestoneEngine.state,
  ruleset,
  'PROC_PRIMORDIAL_REACTION'
);
assert.deepEqual(explicitMilestoneOutput.basePerUnit, { rna: 0.22 });
assert.deepEqual(explicitMilestoneOutput.currentTotal, { rna: 2.53 });
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

assert.doesNotThrow(() => JSON.stringify(engine.state.run));
assert.equal(typeof rng.next(), 'number');
clock.start((deltaMs) => engine.tick(deltaMs));
clock.advance(250);
assert.equal(clock.getNow(), 1250);

console.log('domain flow ok');
