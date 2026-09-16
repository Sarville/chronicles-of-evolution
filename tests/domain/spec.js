import assert from 'node:assert/strict';
import { ruleset } from '../../src/chronicles/config/index.js';
import { createFakeClock } from '../../src/chronicles/adapters/clock.js';
import { createSeededRng } from '../../src/chronicles/adapters/rng.js';
import { createChroniclesEngine } from '../../src/chronicles/domain/engine.js';
import {
  selectCurrentGoal,
  selectManualProcessView,
  selectNodeCost,
  selectNodeStatus,
  selectProducerPrice,
  selectProductionRates,
  selectResourceAmounts,
  selectVisibleResources,
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
assert.deepEqual(selectNodeCost(branchEngine.state, ruleset, 'C02A'), { biomass: 30 });
result = branchEngine.dispatch({ type: 'BUY_NODE', nodeId: 'C02A' });
assert.equal(result.ok, true);
assert.equal(branchEngine.state.run.nodes.selectedBranchByGroup.cell_identity_1, 'C02A');
assert.equal(selectNodeStatus(branchEngine.state, ruleset, 'C02B'), 'locked');

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

assert.equal(producerMilestoneMultiplier(9), 1);
assert.equal(producerMilestoneMultiplier(10), 2);
assert.equal(producerMilestoneMultiplier(25), 4);
assert.equal(producerMilestoneMultiplier(50), 10);

const customRuleset = {
  ...ruleset,
  version: 'custom-minimal-v1',
  resources: [{ id: 'rna', labelKey: 'resource.rna', initialAmount: 5, visibleFromEra: 'MOLECULAR' }],
  producers: [],
  nodes: [],
  buildings: [],
  jobs: [],
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
