import assert from 'node:assert/strict';
import { createFakeClock } from '../../src/chronicles/adapters/clock.js';
import { createMemoryStorage } from '../../src/chronicles/adapters/storageAdapter.js';
import { createInitialGameState } from '../../src/chronicles/domain/state.js';
import { createSaveRepository, SAVE_KEYS } from '../../src/chronicles/save/repository.js';

const storage = createMemoryStorage({ evolved: 'legacy-save-must-survive' });
const clock = createFakeClock(Date.UTC(2026, 8, 15));
const repository = createSaveRepository({ storage, clock });

const state = createInitialGameState();
state.run.resources.energy.amount = 12;
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

console.log('save repository ok');

