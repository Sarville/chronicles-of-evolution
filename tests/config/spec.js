import assert from 'node:assert/strict';
import { ruleset } from '../../src/chronicles/config/index.js';
import { validateRuleset } from '../../src/chronicles/domain/validation.js';

const result = validateRuleset(ruleset);
assert.deepEqual(result.errors, []);
assert.equal(result.ok, true);
assert.equal(JSON.parse(JSON.stringify(ruleset)).version, 'timeline1-v1');

console.log('config validation ok');

