import assert from 'node:assert/strict';
import { ruleset } from '../../src/chronicles/config/index.js';
import { validateRuleset } from '../../src/chronicles/domain/validation.js';

const result = validateRuleset(ruleset);
assert.deepEqual(result.errors, []);
assert.equal(result.ok, true);
assert.equal(JSON.parse(JSON.stringify(ruleset)).version, 'timeline1-v2-reconciled');
assert.equal(ruleset.allowedEffectTypes.includes('manual_gain_multiplier'), true);
assert.equal(ruleset.allowedEffectTypes.includes('job_output_multiplier'), false);
assert.equal(ruleset.effectSupport.manual_gain_multiplier.status, 'supported');
assert.equal(ruleset.effectSupport.unlock_auto_production.status, 'supported');
assert.equal(ruleset.resources.some((resource) => resource.id === 'rna'), true);
assert.equal(ruleset.resources.some((resource) => resource.id === 'dna'), true);
assert.equal(ruleset.resources.some((resource) => resource.id === 'information'), false);
assert.equal(ruleset.producers.some((producer) => producer.id === 'GEN_CHEMICAL_GRADIENT'), false);
assert.equal(ruleset.producers.some((producer) => producer.id === 'GEN_CATALYTIC_FOLD'), false);
assert.equal(ruleset.producers.some((producer) => producer.id === 'GEN_ENERGY_POCKET'), false);
for (const producer of ruleset.producers.filter((candidate) => candidate.id.startsWith('PROC_'))) {
  assert.deepEqual(
    producer.milestones.map((milestone) => milestone.count),
    [10]
  );
  assert.equal(producer.milestones[0].multiplier, 1.15);
  assert.equal(Boolean(producer.milestones[0].label), true);
  assert.equal(Boolean(producer.milestones[0].description), true);
}
assert.equal(ruleset.nodes.find((node) => node.id === 'M04').type, 'OPTIONAL');
assert.deepEqual(ruleset.nodes.find((node) => node.id === 'M05').requiresNodes, ['M03']);
assert.equal(ruleset.goals.find((goal) => goal.id === 'G002').highlight.targetId, 'PROC_RNA_REPLICATION');

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
