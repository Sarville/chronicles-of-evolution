import assert from 'node:assert/strict';
import { createFakeClock } from '../../src/chronicles/adapters/clock.js';
import { createMemoryStorage } from '../../src/chronicles/adapters/storageAdapter.js';
import { ruleset } from '../../src/chronicles/config/index.js';
import { createInitialGameState } from '../../src/chronicles/domain/state.js';
import { validateGameState } from '../../src/chronicles/domain/validation.js';
import { createSaveEnvelope, createSaveRepository, SAVE_KEYS } from '../../src/chronicles/save/repository.js';

const storage = createMemoryStorage({ evolved: 'legacy-save-must-survive' });
const clock = createFakeClock(Date.UTC(2026, 8, 15));
const repository = createSaveRepository({ storage, clock });

const state = createInitialGameState();
state.run.resources.energy.amount = 12;
assert.doesNotThrow(() => JSON.parse(JSON.stringify(state)));
const save = repository.save(state);
assert.equal(save.ok, true);
assert.equal(storage.get(SAVE_KEYS.primary) !== null, true);
assert.equal(storage.get(SAVE_KEYS.pending), null);
assert.equal(storage.get('evolved'), 'legacy-save-must-survive');

const loaded = repository.loadOrCreate();
assert.equal(loaded.ok, true);
assert.equal(loaded.state.run.resources.energy.amount, 12);
assert.equal(loaded.sourceKey, SAVE_KEYS.primary);

state.run.resources.energy.amount = 24;
const secondSave = repository.save(state);
assert.equal(secondSave.ok, true);
assert.equal(secondSave.envelope.saveRevision, 2);
assert.equal(storage.get(SAVE_KEYS.backup) !== null, true);
assert.equal(storage.get('evolved'), 'legacy-save-must-survive');

storage.set(SAVE_KEYS.primary, '{bad json');
const fallback = repository.loadOrCreate();
assert.equal(fallback.ok, true);
assert.equal(fallback.sourceKey, SAVE_KEYS.backup);
assert.equal(fallback.state.run.resources.energy.amount, 12);

const pendingStorage = createMemoryStorage({ evolved: 'legacy-save-must-survive' });
const pendingRepository = createSaveRepository({ storage: pendingStorage, clock });
const pendingState = createInitialGameState();
pendingState.run.resources.energy.amount = 33;
const pendingEnvelope = createSaveEnvelope(pendingState, { clock });
pendingStorage.set(SAVE_KEYS.primary, '{bad json');
pendingStorage.set(SAVE_KEYS.pending, JSON.stringify(pendingEnvelope));
const pendingFallback = pendingRepository.loadOrCreate();
assert.equal(pendingFallback.ok, true);
assert.equal(pendingFallback.sourceKey, SAVE_KEYS.pending);
assert.equal(pendingFallback.state.run.resources.energy.amount, 33);
assert.equal(pendingStorage.get('evolved'), 'legacy-save-must-survive');

const missingRun = validateGameState({ meta: {}, settings: {}, session: {} }, ruleset);
assert.equal(missingRun.ok, false);
assert.equal(missingRun.errors.includes('State must contain run, meta and settings'), true);

const missingMeta = validateGameState({ run: createInitialGameState().run, settings: {}, session: {} }, ruleset);
assert.equal(missingMeta.ok, false);
assert.equal(missingMeta.errors.includes('State must contain run, meta and settings'), true);

const invalidResource = createInitialGameState();
invalidResource.run.resources.energy.amount = Number.NaN;
const invalidResourceResult = validateGameState(invalidResource, ruleset);
assert.equal(invalidResourceResult.ok, false);
assert.equal(invalidResourceResult.errors.some((error) => error.includes('invalid amount')), true);

const wrongRulesetVersion = createInitialGameState();
wrongRulesetVersion.run.rulesetVersion = 'wrong-version';
const wrongRulesetVersionResult = validateGameState(wrongRulesetVersion, ruleset);
assert.equal(wrongRulesetVersionResult.ok, false);
assert.equal(
  wrongRulesetVersionResult.errors.some((error) => error.includes('Unsupported ruleset version wrong-version')),
  true
);

console.log('save repository ok');
