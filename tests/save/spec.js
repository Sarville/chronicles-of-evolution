import assert from 'node:assert/strict';
import { createFakeClock } from '../../src/chronicles/adapters/clock.js';
import { createMemoryStorage } from '../../src/chronicles/adapters/storageAdapter.js';
import { ruleset } from '../../src/chronicles/config/index.js';
import { createInitialGameState } from '../../src/chronicles/domain/state.js';
import { validateGameState } from '../../src/chronicles/domain/validation.js';
import { createDebugApi } from '../../src/chronicles/dev/debugApi.js';
import { createAutosaveController } from '../../src/chronicles/save/autosave.js';
import { CURRENT_SCHEMA_VERSION, migrateEnvelope } from '../../src/chronicles/save/migrations.js';
import { createSaveEnvelope, createSaveRepository, SAVE_KEYS } from '../../src/chronicles/save/repository.js';
import { createResetTransaction } from '../../src/chronicles/save/resetTransaction.js';

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
assert.equal(loaded.envelope.schemaVersion, CURRENT_SCHEMA_VERSION);
assert.equal(loaded.envelope.transactions.pendingReset, null);
assert.equal(loaded.state.meta.archiveFragments, 0);
assert.equal(loaded.state.settings.autosave, true);

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
pendingStorage.set(SAVE_KEYS.primary, 'null');
pendingStorage.remove(SAVE_KEYS.pending);
const nullPrimaryFallback = pendingRepository.loadOrCreate();
assert.equal(nullPrimaryFallback.ok, true);
assert.equal(nullPrimaryFallback.created, true);

const newerBackupStorage = createMemoryStorage({ evolved: 'legacy-save-must-survive' });
const newerBackupRepository = createSaveRepository({ storage: newerBackupStorage, clock });
const olderPending = createSaveEnvelope(createInitialGameState(), { clock, saveRevision: 2 });
const newerBackupState = createInitialGameState();
newerBackupState.run.resources.energy.amount = 44;
const newerBackup = createSaveEnvelope(newerBackupState, { clock, saveRevision: 3 });
newerBackupStorage.set(SAVE_KEYS.primary, '{bad json');
newerBackupStorage.set(SAVE_KEYS.pending, JSON.stringify(olderPending));
newerBackupStorage.set(SAVE_KEYS.backup, JSON.stringify(newerBackup));
const newerBackupFallback = newerBackupRepository.loadOrCreate();
assert.equal(newerBackupFallback.ok, true);
assert.equal(newerBackupFallback.sourceKey, SAVE_KEYS.backup);
assert.equal(newerBackupFallback.state.run.resources.energy.amount, 44);

const legacyV1 = createSaveEnvelope(createInitialGameState(), { clock });
delete legacyV1.transactions;
delete legacyV1.settings.autosave;
const migrated = migrateEnvelope(legacyV1);
assert.equal(migrated.transactions.pendingReset, null);
assert.equal(migrated.settings.autosave, true);

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

const autosaveStorage = createMemoryStorage();
const autosaveClock = createFakeClock(Date.UTC(2026, 8, 15));
const autosaveRepository = createSaveRepository({ storage: autosaveStorage, clock: autosaveClock });
const autosaveDebug = createDebugApi({ ports: { clock: autosaveClock } });
const autosave = createAutosaveController({
  repository: autosaveRepository,
  engine: autosaveDebug.engine,
  intervalMs: 1000,
  clock: autosaveClock,
});
assert.equal(autosave.tick(999).skipped, true);
autosaveDebug.grant('energy', 5);
const autosaveResult = autosave.tick(1);
assert.equal(autosaveResult.ok, true);
assert.equal(autosaveDebug.engine.state.session.dirty, false);
assert.equal(autosaveRepository.loadOrCreate().state.run.resources.energy.amount, 5);

autosaveDebug.grant('energy', 3);
assert.equal(autosave.flush('visibility').ok, true);
assert.equal(autosaveRepository.loadOrCreate().state.run.resources.energy.amount, 8);

const resetStorage = createMemoryStorage();
const resetRepository = createSaveRepository({ storage: resetStorage, clock });
const resetState = createInitialGameState({ runId: 'run_before_reset' });
resetState.meta.archiveFragments = 17;
resetState.meta.persistentFlags.firstResetCompleted = true;
const pendingReset = createResetTransaction(resetState, 'tx_001');
const resetSave = resetRepository.save(resetState, { transactions: { pendingReset } });
assert.equal(resetSave.ok, true);
const nextRunState = createInitialGameState({ runId: 'run_after_reset' });
nextRunState.meta = resetState.meta;
const resetCompleteSave = resetRepository.save(nextRunState, { transactions: { pendingReset: null } });
assert.equal(resetCompleteSave.ok, true);
const afterResetLoad = resetRepository.loadOrCreate();
assert.equal(afterResetLoad.state.run.id, 'run_after_reset');
assert.equal(afterResetLoad.state.meta.archiveFragments, 17);
assert.equal(afterResetLoad.state.meta.persistentFlags.firstResetCompleted, true);

const devClock = createFakeClock(0);
const devApi = createDebugApi({ ports: { clock: devClock } });
assert.equal(devApi.setTimeScale(20).ok, true);
assert.equal(devApi.engine.state.settings.devTimeScale, 20);
assert.equal(devApi.setTimeScale(7).ok, false);
assert.equal(devApi.jumpToEra('CITY').ok, true);
assert.equal(devApi.engine.state.run.eraId, 'CITY');
assert.equal(devApi.engine.state.run.resources.power.amount, 0);
assert.equal(devApi.triggerEvent('EV-BIO-01').ok, true);
assert.equal(devApi.engine.state.run.events.queue[0].id, 'EV-BIO-01');
const dumped = devApi.dumpState();
dumped.run.resources.energy.amount = 999;
assert.notEqual(devApi.engine.state.run.resources.energy.amount, 999);
assert.throws(() => createDebugApi({ environment: 'production' }).grant('energy', 1), /disabled/);

console.log('save repository ok');
