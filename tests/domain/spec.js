import assert from 'node:assert/strict';
import { ruleset } from '../../src/chronicles/config/index.js';
import { createFakeClock } from '../../src/chronicles/adapters/clock.js';
import { createSeededRng } from '../../src/chronicles/adapters/rng.js';
import { createChroniclesEngine } from '../../src/chronicles/domain/engine.js';
import {
  selectNodeCost,
  selectNodeStatus,
  selectProducerPrice,
  selectProductionRates,
  selectResourceAmounts,
} from '../../src/chronicles/domain/selectors.js';
import { createInitialGameState } from '../../src/chronicles/domain/state.js';
import { producerMilestoneMultiplier } from '../../src/chronicles/domain/services/production.js';
import { calculateCap } from '../../src/chronicles/domain/services/resources.js';

const clock = createFakeClock(1000);
const rng = createSeededRng(42);
const engine = createChroniclesEngine({ ruleset, ports: { clock, rng } });

assert.equal(engine.state.run.eraId, 'MOLECULAR');
assert.deepEqual(selectResourceAmounts(engine.state), { energy: 0, information: 0 });
assert.deepEqual(engine.state.run.goals, { currentId: null, states: {}, side: { activeIds: [] } });
assert.deepEqual(engine.state.run.events, { queue: [], states: {} });
assert.deepEqual(engine.state.run.modifiers, { active: {} });
assert.deepEqual(engine.state.run.pathScores, {
  nature: 0,
  industry: 0,
  freedom: 0,
  control: 0,
  cooperation: 0,
  dominance: 0,
  biology: 0,
  machines: 0,
  preservation: 0,
  expansion: 0,
});
assert.equal(calculateCap(engine.state, 'energy', ruleset), Infinity);

let result = engine.dispatch({ type: 'ADD_RESOURCE', resourceId: 'energy', amount: 100 });
assert.equal(result.ok, true);
assert.equal(result.events[0].type, 'resource_changed');
assert.equal(engine.state.run.resources.energy.amount, 100);

assert.deepEqual(selectProducerPrice(engine.state, ruleset, 'GEN_CHEMICAL_GRADIENT'), { energy: 10 });
result = engine.dispatch({ type: 'BUY_PRODUCER', producerId: 'GEN_CHEMICAL_GRADIENT' });
assert.equal(result.ok, true);
assert.equal(result.events.some((event) => event.type === 'producer_bought'), true);
assert.equal(engine.state.run.producers.GEN_CHEMICAL_GRADIENT.count, 1);
assert.equal(engine.state.run.resources.energy.amount, 90);
assert.deepEqual(selectProducerPrice(engine.state, ruleset, 'GEN_CHEMICAL_GRADIENT'), { energy: 12 });
let tick = engine.tick(1000);
assert.equal(tick.ok, true);
assert.deepEqual(tick.rates, {});
assert.equal(engine.state.run.resources.energy.amount, 90);

const beforeFailedPayment = engine.state.run.resources.energy.amount;
result = engine.dispatch({ type: 'BUY_NODE', nodeId: 'M02' });
assert.equal(result.ok, false);
assert.equal(result.reason, 'PREREQUISITES_NOT_MET');
assert.equal(engine.state.run.resources.energy.amount, beforeFailedPayment);

result = engine.dispatch({ type: 'ADD_RESOURCE', resourceId: 'information', amount: 10 });
assert.equal(result.ok, true);
result = engine.dispatch({ type: 'BUY_NODE', nodeId: 'M01' });
assert.equal(result.ok, true);
assert.equal(result.events.some((event) => event.type === 'node_completed'), true);
assert.equal(result.events.some((event) => event.type === 'goal_completed'), true);
assert.equal(engine.state.run.modifiers.active['M01:auto_production'].type, 'unlock_auto_production');
tick = engine.tick(1000);
assert.equal(tick.rates.energy, 0.4);
assert.equal(engine.state.run.resources.energy.amount, 78.4);
result = engine.dispatch({ type: 'BUY_PRODUCER', producerId: 'GEN_CATALYTIC_FOLD' });
assert.equal(result.ok, true);

const beforeAtomicFailure = {
  energy: engine.state.run.resources.energy.amount,
  information: engine.state.run.resources.information.amount,
};
result = engine.dispatch({ type: 'BUY_NODE', nodeId: 'M02' });
assert.equal(result.ok, true);
assert.equal(engine.state.run.resources.energy.amount, beforeAtomicFailure.energy - 40);
assert.equal(engine.state.run.resources.information.amount, beforeAtomicFailure.information - 3);
assert.equal(Math.abs(selectProductionRates(engine.state, ruleset).information - 0.088) < 0.000001, true);

engine.state.run.nodes.completed.T08 = { completedAtMs: 0 };
engine.state.run.eraId = 'SETTLEMENT_EARLY';
engine.state.run.flags['run.unlock.building.BLD_FIELD'] = true;
engine.dispatch({ type: 'ADD_RESOURCE', resourceId: 'food', amount: 180 });
engine.dispatch({ type: 'ADD_RESOURCE', resourceId: 'materials', amount: 260 });
result = engine.dispatch({ type: 'BUY_BUILDING', buildingId: 'BLD_FIELD' });
assert.equal(result.ok, true);
assert.equal(result.events.some((event) => event.type === 'building_bought'), true);
assert.equal(engine.state.run.buildings.BLD_FIELD.count, 1);

tick = engine.tick(1000);
assert.equal(tick.ok, true);
assert.equal(tick.events.some((event) => event.type === 'tick'), true);

const activeTickEnergy = engine.state.run.resources.energy.amount;
engine.state.run.lifecycle = 'ending_pending';
tick = engine.tick(1000);
assert.equal(tick.frozen, true);
assert.equal(engine.state.run.resources.energy.amount, activeTickEnergy);
engine.state.run.lifecycle = 'archive_summary';
tick = engine.tick(1000);
assert.equal(tick.frozen, true);
assert.equal(engine.state.run.resources.energy.amount, activeTickEnergy);
const closedSnapshot = JSON.stringify(engine.state.run);
engine.state.run.lifecycle = 'closed';
tick = engine.tick(1000);
assert.equal(tick.frozen, true);
assert.equal(JSON.stringify(engine.state.run), JSON.stringify({ ...JSON.parse(closedSnapshot), lifecycle: 'closed' }));

assert.doesNotThrow(() => JSON.stringify(engine.state.run));
assert.equal(typeof rng.next(), 'number');
clock.start((deltaMs) => engine.tick(deltaMs));
clock.advance(250);
assert.equal(clock.getNow(), 1250);

const branchEngine = createChroniclesEngine({ ruleset });
branchEngine.dispatch({ type: 'ADD_RESOURCE', resourceId: 'energy', amount: 3000 });
branchEngine.dispatch({ type: 'ADD_RESOURCE', resourceId: 'information', amount: 1000 });
for (const nodeId of ['M01', 'M02', 'M03', 'M05', 'M06']) {
  result = branchEngine.dispatch({ type: 'BUY_NODE', nodeId });
  assert.equal(result.ok, true);
}
assert.deepEqual(selectNodeCost(branchEngine.state, ruleset, 'C01B'), { energy: 150, information: 45 });
result = branchEngine.dispatch({ type: 'BUY_NODE', nodeId: 'C01B' });
assert.equal(result.ok, true);
assert.equal(branchEngine.state.run.nodes.selectedBranchByGroup.metabolism_1, 'C01B');
assert.equal(selectNodeStatus(branchEngine.state, ruleset, 'C01A'), 'available_affordable');
assert.deepEqual(selectNodeCost(branchEngine.state, ruleset, 'C01A'), { energy: 450, information: 138 });
const secondBranchBefore = {
  energy: branchEngine.state.run.resources.energy.amount,
  information: branchEngine.state.run.resources.information.amount,
};
branchEngine.state.run.resources.information.amount = 100;
result = branchEngine.dispatch({ type: 'BUY_NODE', nodeId: 'C01A' });
assert.equal(result.ok, false);
assert.equal(result.reason, 'INSUFFICIENT_RESOURCES');
assert.equal(branchEngine.state.run.resources.energy.amount, secondBranchBefore.energy);
assert.equal(branchEngine.state.run.resources.information.amount, 100);
branchEngine.state.run.resources.information.amount = secondBranchBefore.information;
result = branchEngine.dispatch({ type: 'BUY_NODE', nodeId: 'C01A' });
assert.equal(result.ok, true);
assert.equal(Boolean(branchEngine.state.run.nodes.completed.C01A), true);
assert.equal(Boolean(branchEngine.state.run.nodes.completed.C01B), true);
assert.equal(branchEngine.state.run.nodes.selectedBranchByGroup.metabolism_1, 'C01B');
assert.equal(selectProducerPrice(branchEngine.state, ruleset, 'GEN_ENERGY_POCKET').energy, 33);

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

assert.equal(producerMilestoneMultiplier(9), 1);
assert.equal(producerMilestoneMultiplier(10), 2);
assert.equal(producerMilestoneMultiplier(25), 4);
assert.equal(producerMilestoneMultiplier(50), 10);

const customRuleset = {
  ...ruleset,
  version: 'custom-minimal-v1',
  resources: [
    { id: 'energy', labelKey: 'resource.energy', initialAmount: 5, visibleFromEra: 'MOLECULAR' },
    { id: 'information', labelKey: 'resource.information', initialAmount: 7, visibleFromEra: 'MOLECULAR' },
  ],
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
assert.deepEqual(selectResourceAmounts(customEngine.state), { energy: 5, information: 7 });
assert.equal(createInitialGameState({ ruleset: customRuleset }).run.rulesetVersion, 'custom-minimal-v1');

console.log('domain flow ok');
