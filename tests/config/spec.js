import assert from 'node:assert/strict';
import { ruleset } from '../../src/chronicles/config/index.js';
import { validateRuleset } from '../../src/chronicles/domain/validation.js';

const result = validateRuleset(ruleset);
assert.deepEqual(result.errors, []);
assert.equal(result.ok, true);
assert.equal(JSON.parse(JSON.stringify(ruleset)).version, 'timeline1-v13-t1-blight-collapse');
assert.equal(ruleset.events.some((event) => event.id === 'EV-BIO-01' && event.trigger.nodeId === 'C01'), true);
assert.equal(ruleset.events.some((event) => event.id === 'EV-RNA-RESONANCE' && event.deck === 'early_biology'), true);
assert.equal(ruleset.allowedEffectTypes.includes('manual_gain_multiplier'), true);
assert.equal(ruleset.allowedEffectTypes.includes('job_output_multiplier'), true);
assert.equal(ruleset.effectSupport.manual_gain_multiplier.status, 'supported');
assert.equal(ruleset.effectSupport.unlock_auto_production.status, 'supported');
assert.equal(ruleset.resources.some((resource) => resource.id === 'rna'), true);
assert.equal(ruleset.resources.some((resource) => resource.id === 'dna'), true);
assert.equal(ruleset.resources.some((resource) => resource.id === 'atp'), true);
assert.equal(ruleset.resources.some((resource) => resource.id === 'energy'), false);
assert.equal(ruleset.resources.some((resource) => resource.id === 'information'), false);
assert.equal(ruleset.resources.every((resource) => Number.isFinite(resource.baseCap) && resource.baseCap > 0), true);
assert.equal(ruleset.allowedEffectTypes.includes('resource_capacity'), true);
assert.equal(ruleset.buildings.some((building) => building.id === 'BLD_MEMBRANE_STORE'), true);
assert.equal(ruleset.nodes.every((node) => !(node.effects || []).some((effect) => effect.type === 'resource_capacity')), true);
assert.deepEqual(ruleset.buildings.find((building) => building.id === 'BLD_MEMBRANE_STORE').effects, [
  { type: 'resource_capacity', resourceId: 'rna', value: 250 },
]);
assert.deepEqual(ruleset.buildings.find((building) => building.id === 'BLD_GENETIC_STORE').effects, [
  { type: 'resource_capacity', resourceId: 'dna', value: 150 },
]);
assert.deepEqual(ruleset.buildings.find((building) => building.id === 'BLD_BIOMASS_STORE').effects, [
  { type: 'resource_capacity', resourceId: 'biomass', value: 160 },
]);
assert.deepEqual(ruleset.buildings.find((building) => building.id === 'BLD_ATP_STORE').effects, [
  { type: 'resource_capacity', resourceId: 'atp', value: 120 },
]);
assert.equal(ruleset.nodes.find((node) => node.id === 'M02').cost.rna > ruleset.resources.find((resource) => resource.id === 'rna').baseCap, true);
assert.equal(ruleset.nodes.find((node) => node.id === 'M06').cost.dna > ruleset.resources.find((resource) => resource.id === 'dna').baseCap, true);
assert.equal(ruleset.nodes.find((node) => node.id === 'C03').cost.biomass > ruleset.resources.find((resource) => resource.id === 'biomass').baseCap, true);
assert.equal(ruleset.nodes.find((node) => node.id === 'C03').cost.atp > ruleset.resources.find((resource) => resource.id === 'atp').baseCap, true);
assert.equal(ruleset.nodes.find((node) => node.id === 'T02').cost.food > ruleset.resources.find((resource) => resource.id === 'food').baseCap, true);
assert.equal(ruleset.nodes.find((node) => node.id === 'T02').cost.materials > ruleset.resources.find((resource) => resource.id === 'materials').baseCap, true);
assert.equal(ruleset.nodes.find((node) => node.id === 'T05').cost.knowledge > ruleset.resources.find((resource) => resource.id === 'knowledge').baseCap, true);
assert.equal(ruleset.buildings.find((building) => building.id === 'BLD_FOOD_STORE').requiresAnyBranchGroup, 'culture_1');
assert.equal(ruleset.buildings.find((building) => building.id === 'BLD_MATERIALS_STORE').requiresAnyBranchGroup, 'culture_1');
assert.deepEqual(ruleset.buildings.find((building) => building.id === 'BLD_KNOWLEDGE_ARCHIVE').requiresNodes, ['T02']);
assert.equal(ruleset.producers.some((producer) => producer.id === 'GEN_CHEMICAL_GRADIENT'), false);
assert.equal(ruleset.producers.some((producer) => producer.id === 'GEN_CATALYTIC_FOLD'), false);
assert.equal(ruleset.producers.some((producer) => producer.id === 'GEN_ENERGY_POCKET'), false);
assert.deepEqual(ruleset.producers.find((producer) => producer.id === 'PROC_DNA_SYNTHESIS').input, { rna: 0.52 });
assert.deepEqual(ruleset.producers.find((producer) => producer.id === 'PROC_RESPIRATION').input, { biomass: 0.3 });
for (const producer of ruleset.producers.filter((candidate) => candidate.id.startsWith('PROC_'))) {
  assert.equal(producer.milestones.length, 1);
  assert.equal(Number.isInteger(producer.milestones[0].count) && producer.milestones[0].count > 0, true);
  assert.equal(producer.milestones[0].multiplier, 1.15);
  assert.equal(Boolean(producer.milestones[0].label), true);
  assert.equal(Boolean(producer.milestones[0].description), true);
}
// Frozen 0-10 producer milestones: not to be reopened by later balance passes.
for (const producerId of ['PROC_PRIMORDIAL_REACTION', 'PROC_RNA_REPLICATION', 'PROC_DNA_SYNTHESIS']) {
  assert.equal(ruleset.producers.find((candidate) => candidate.id === producerId).milestones[0].count, 10);
}
assert.equal(ruleset.nodes.find((node) => node.id === 'M04').type, 'OPTIONAL');
assert.deepEqual(ruleset.nodes.find((node) => node.id === 'M05').requiresNodes, ['M03']);
assert.equal(ruleset.goals.find((goal) => goal.id === 'G002').highlight.targetId, 'PROC_RNA_REPLICATION');
assert.equal(ruleset.nodes.find((node) => node.id === 'B02A').adaptationPointCost, 1);
assert.equal(ruleset.nodes.find((node) => node.id === 'C07').transition, 'MULTICELLULAR');
assert.equal(ruleset.goals.find((goal) => goal.id === 'G007').rewards[0].type, 'grant_adaptation_points');

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

const brokenReferenceRuleset = clone(ruleset);
brokenReferenceRuleset.nodes[0].requiresNodes = ['MISSING_NODE'];
const brokenReference = validateRuleset(brokenReferenceRuleset);
assert.equal(brokenReference.ok, false);
assert.equal(brokenReference.errors.some((error) => error.includes('requires unknown node MISSING_NODE')), true);

const invalidCapRuleset = clone(ruleset);
invalidCapRuleset.resources[0].baseCap = -1;
const invalidCap = validateRuleset(invalidCapRuleset);
assert.equal(invalidCap.ok, false);
assert.equal(invalidCap.errors.some((error) => error.includes('invalid baseCap')), true);

const invalidBranchRuleRuleset = clone(ruleset);
invalidBranchRuleRuleset.branchCostRules.cell_identity_1.allowAdditionalBranches = 'true';
const invalidBranchRule = validateRuleset(invalidBranchRuleRuleset);
assert.equal(invalidBranchRule.ok, false);
assert.equal(
  invalidBranchRule.errors.includes('cell_identity_1 has non-boolean allowAdditionalBranches'),
  true
);

const invalidGoalConditionRuleset = clone(ruleset);
invalidGoalConditionRuleset.goals[0].conditions = [{ type: 'node_completed', nodeId: 'MISSING_NODE' }];
const invalidGoalCondition = validateRuleset(invalidGoalConditionRuleset);
assert.equal(invalidGoalCondition.ok, false);
assert.equal(
  invalidGoalCondition.errors.some((error) => error.includes('condition references unknown node MISSING_NODE')),
  true
);

console.log('config validation ok');
