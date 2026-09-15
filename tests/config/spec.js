import assert from 'node:assert/strict';
import { ruleset } from '../../src/chronicles/config/index.js';
import { validateRuleset } from '../../src/chronicles/domain/validation.js';

const result = validateRuleset(ruleset);
assert.deepEqual(result.errors, []);
assert.equal(result.ok, true);
assert.equal(JSON.parse(JSON.stringify(ruleset)).version, 'timeline1-v1');
assert.equal(ruleset.allowedEffectTypes.includes('manual_gain_multiplier'), true);
assert.equal(ruleset.allowedEffectTypes.includes('job_output_multiplier'), false);
assert.equal(ruleset.effectSupport.manual_gain_multiplier.status, 'supported');
assert.equal(ruleset.effectSupport.unlock_auto_production.status, 'supported');

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
invalidBranchRuleRuleset.branchCostRules.metabolism_1.allowAdditionalBranches = 'true';
const invalidBranchRule = validateRuleset(invalidBranchRuleRuleset);
assert.equal(invalidBranchRule.ok, false);
assert.equal(
  invalidBranchRule.errors.includes('metabolism_1 has non-boolean allowAdditionalBranches'),
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
