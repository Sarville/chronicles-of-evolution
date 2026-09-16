import assert from 'node:assert/strict';
import { createFakeClock } from '../../src/chronicles/adapters/clock.js';
import { createMemoryStorage } from '../../src/chronicles/adapters/storageAdapter.js';
import { ruleset } from '../../src/chronicles/config/index.js';
import { createInitialGameState } from '../../src/chronicles/domain/state.js';
import { validateGameState } from '../../src/chronicles/domain/validation.js';
import { createDebugApi } from '../../src/chronicles/dev/debugApi.js';
import { createChroniclesEngine } from '../../src/chronicles/domain/engine.js';
import { createAutosaveController } from '../../src/chronicles/save/autosave.js';
import { CURRENT_SCHEMA_VERSION, migrateEnvelope } from '../../src/chronicles/save/migrations.js';
import { createSaveEnvelope, createSaveRepository, SAVE_KEYS } from '../../src/chronicles/save/repository.js';
import {
  applyPreparedResetTransaction,
  createResetTransaction,
  prepareResetTransaction,
} from '../../src/chronicles/save/resetTransaction.js';

const storage = createMemoryStorage({ evolved: 'legacy-save-must-survive' });
const clock = createFakeClock(Date.UTC(2026, 8, 15));
const repository = createSaveRepository({ storage, clock });

const state = createInitialGameState();
state.run.resources.rna.amount = 12;
assert.doesNotThrow(() => JSON.parse(JSON.stringify(state)));
const save = repository.save(state);
assert.equal(save.ok, true);
assert.equal(storage.get(SAVE_KEYS.primary) !== null, true);
assert.equal(storage.get(SAVE_KEYS.pending), null);
assert.equal(storage.get('evolved'), 'legacy-save-must-survive');

const loaded = repository.loadOrCreate();
assert.equal(loaded.ok, true);
assert.equal(loaded.state.run.resources.rna.amount, 12);
assert.equal(loaded.sourceKey, SAVE_KEYS.primary);
assert.equal(loaded.envelope.schemaVersion, CURRENT_SCHEMA_VERSION);
assert.equal(loaded.envelope.rulesetVersion, 'timeline1-v7-storage-gates');
assert.equal(loaded.envelope.transactions.pendingReset, null);
assert.equal(loaded.state.meta.archiveFragments, 0);
assert.equal(loaded.state.settings.autosave, true);

state.run.resources.rna.amount = 24;
const secondSave = repository.save(state);
assert.equal(secondSave.ok, true);
assert.equal(secondSave.envelope.saveRevision, 2);
assert.equal(storage.get(SAVE_KEYS.backup) !== null, true);
assert.equal(storage.get('evolved'), 'legacy-save-must-survive');

storage.set(SAVE_KEYS.primary, '{bad json');
const fallback = repository.loadOrCreate();
assert.equal(fallback.ok, true);
assert.equal(fallback.sourceKey, SAVE_KEYS.backup);
assert.equal(fallback.state.run.resources.rna.amount, 12);

const pendingStorage = createMemoryStorage({ evolved: 'legacy-save-must-survive' });
const pendingRepository = createSaveRepository({ storage: pendingStorage, clock });
const pendingState = createInitialGameState();
pendingState.run.resources.rna.amount = 33;
const pendingEnvelope = createSaveEnvelope(pendingState, { clock });
pendingStorage.set(SAVE_KEYS.primary, '{bad json');
pendingStorage.set(SAVE_KEYS.pending, JSON.stringify(pendingEnvelope));
const pendingFallback = pendingRepository.loadOrCreate();
assert.equal(pendingFallback.ok, true);
assert.equal(pendingFallback.sourceKey, SAVE_KEYS.pending);
assert.equal(pendingFallback.state.run.resources.rna.amount, 33);
assert.equal(pendingStorage.get('evolved'), 'legacy-save-must-survive');
pendingStorage.set(SAVE_KEYS.primary, 'null');
pendingStorage.remove(SAVE_KEYS.pending);
const nullPrimaryFallback = pendingRepository.loadOrCreate();
assert.equal(nullPrimaryFallback.ok, false);
assert.equal(nullPrimaryFallback.reason, 'RECOVERY_REQUIRED');
assert.deepEqual(nullPrimaryFallback.damagedSlots.map((slot) => slot.key), [SAVE_KEYS.primary]);
const explicitFreshAfterCorruption = pendingRepository.startFreshAfterCorruption();
assert.equal(explicitFreshAfterCorruption.ok, true);
assert.equal(explicitFreshAfterCorruption.created, true);
assert.equal(pendingStorage.get('evolved'), 'legacy-save-must-survive');

const legacyRulesetStorage = createMemoryStorage({ evolved: 'legacy-save-must-survive' });
const legacyRulesetRepository = createSaveRepository({ storage: legacyRulesetStorage, clock });
const oldRulesetState = createInitialGameState();
oldRulesetState.meta.archiveFragments = 9;
oldRulesetState.meta.persistentFlags.keepMeta = true;
oldRulesetState.settings.locale = 'en';
const oldRulesetEnvelope = createSaveEnvelope(oldRulesetState, { clock, saveRevision: 4 });
oldRulesetEnvelope.rulesetVersion = 'timeline1-v1';
oldRulesetEnvelope.run.rulesetVersion = 'timeline1-v1';
oldRulesetEnvelope.run.resources = { energy: { amount: 999 }, information: { amount: 111 } };
legacyRulesetStorage.set(SAVE_KEYS.primary, JSON.stringify(oldRulesetEnvelope));
const oldRulesetRestart = legacyRulesetRepository.loadOrCreate();
assert.equal(oldRulesetRestart.ok, true);
assert.equal(oldRulesetRestart.oldRulesetRestarted, true);
assert.equal(oldRulesetRestart.previousRulesetVersion, 'timeline1-v1');
assert.deepEqual(oldRulesetRestart.state.run.resources, { rna: { amount: 0 } });
assert.equal(oldRulesetRestart.state.meta.archiveFragments, 9);
assert.equal(oldRulesetRestart.state.meta.persistentFlags.keepMeta, true);
assert.equal(oldRulesetRestart.state.settings.locale, 'en');
assert.equal(legacyRulesetStorage.get('evolved'), 'legacy-save-must-survive');

const legacyV1 = createSaveEnvelope(createInitialGameState(), { clock });
delete legacyV1.transactions;
delete legacyV1.settings.autosave;
const migrated = migrateEnvelope(legacyV1);
assert.equal(migrated.transactions.pendingReset, null);
assert.equal(migrated.settings.autosave, true);
assert.equal(migrated.schemaVersion, CURRENT_SCHEMA_VERSION);
assert.equal(migrated.run.events.rngState, 1);
assert.deepEqual(migrated.meta.unlocks, {});

const v2EventMigration = createSaveEnvelope(createInitialGameState(), { clock });
v2EventMigration.schemaVersion = 1;
v2EventMigration.rulesetVersion = 'timeline1-v2-reconciled';
v2EventMigration.run.rulesetVersion = 'timeline1-v2-reconciled';
delete v2EventMigration.run.events;
const migratedV2 = migrateEnvelope(v2EventMigration);
assert.equal(migratedV2.rulesetVersion, 'timeline1-v7-storage-gates');
assert.equal(migratedV2.run.migrationNotice.includes('storage gates restored'), true);

const v3CapacityMigration = createSaveEnvelope(createInitialGameState(), { clock });
v3CapacityMigration.rulesetVersion = 'timeline1-v3-full';
v3CapacityMigration.run.rulesetVersion = 'timeline1-v3-full';
v3CapacityMigration.run.nodes.completed.M02 = { completedAtMs: 0 };
v3CapacityMigration.run.modifiers.active = {};
const migratedV3 = migrateEnvelope(v3CapacityMigration);
assert.equal(migratedV3.rulesetVersion, 'timeline1-v7-storage-gates');
assert.equal(migratedV3.run.modifiers.active['M02:capacity:rna'], undefined);

const v4AtpMigration = createSaveEnvelope(createInitialGameState(), { clock });
v4AtpMigration.rulesetVersion = 'timeline1-v4-caps';
v4AtpMigration.run.rulesetVersion = 'timeline1-v4-caps';
v4AtpMigration.run.resources.energy = { amount: 37 };
v4AtpMigration.run.stats.totalEarned.energy = 91;
v4AtpMigration.run.buildings.BLD_ENERGY_STORE = { count: 2 };
v4AtpMigration.run.modifiers.active['C01:capacity:energy'] = {
  type: 'resource_capacity', resourceId: 'energy', value: 120,
};
const migratedV4 = migrateEnvelope(v4AtpMigration);
assert.equal(migratedV4.rulesetVersion, 'timeline1-v7-storage-gates');
assert.deepEqual(migratedV4.run.resources.atp, { amount: 37 });
assert.equal(migratedV4.run.resources.energy, undefined);
assert.equal(migratedV4.run.stats.totalEarned.atp, 91);
assert.deepEqual(migratedV4.run.buildings.BLD_ATP_STORE, { count: 2 });
assert.equal(migratedV4.run.modifiers.active['C01:capacity:atp'], undefined);
assert.equal(migratedV4.run.modifiers.active['BLD_ATP_STORE:1:capacity:atp'].resourceId, 'atp');

const v5CellBalanceMigration = createSaveEnvelope(createInitialGameState(), { clock });
v5CellBalanceMigration.rulesetVersion = 'timeline1-v5-atp';
v5CellBalanceMigration.run.rulesetVersion = 'timeline1-v5-atp';
v5CellBalanceMigration.run.nodes.completed.C05 = { completedAtMs: 0 };
v5CellBalanceMigration.run.modifiers.active = {};
const migratedV5 = migrateEnvelope(v5CellBalanceMigration);
assert.equal(migratedV5.rulesetVersion, 'timeline1-v7-storage-gates');
assert.equal(migratedV5.run.modifiers.active['C05:capacity:biomass'], undefined);

const v6StorageGateMigration = createSaveEnvelope(createInitialGameState(), { clock });
v6StorageGateMigration.rulesetVersion = 'timeline1-v6-cell-balance';
v6StorageGateMigration.run.rulesetVersion = 'timeline1-v6-cell-balance';
v6StorageGateMigration.run.nodes.completed.M02 = { completedAtMs: 0 };
v6StorageGateMigration.run.buildings.BLD_MEMBRANE_STORE = { count: 2 };
v6StorageGateMigration.run.resources.rna = { amount: 900 };
v6StorageGateMigration.run.modifiers.active['M02:capacity:rna'] = {
  type: 'resource_capacity', resourceId: 'rna', value: 300,
};
const migratedV6 = migrateEnvelope(v6StorageGateMigration);
assert.equal(migratedV6.rulesetVersion, 'timeline1-v7-storage-gates');
assert.equal(migratedV6.run.modifiers.active['M02:capacity:rna'], undefined);
assert.equal(migratedV6.run.modifiers.active['BLD_MEMBRANE_STORE:2:capacity:rna'].value, 250);
assert.equal(migratedV6.run.resources.rna.amount, 600);

const missingRun = validateGameState({ meta: {}, settings: {}, session: {} }, ruleset);
assert.equal(missingRun.ok, false);
assert.equal(missingRun.errors.includes('State must contain run, meta and settings'), true);

const missingMeta = validateGameState({ run: createInitialGameState().run, settings: {}, session: {} }, ruleset);
assert.equal(missingMeta.ok, false);
assert.equal(missingMeta.errors.includes('State must contain run, meta and settings'), true);

const invalidResource = createInitialGameState();
invalidResource.run.resources.rna.amount = Number.NaN;
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
autosaveDebug.grant('rna', 5);
const autosaveResult = autosave.tick(1);
assert.equal(autosaveResult.ok, true);
assert.equal(autosaveDebug.engine.state.session.dirty, false);
assert.equal(autosaveRepository.loadOrCreate().state.run.resources.rna.amount, 5);

autosaveDebug.grant('rna', 3);
assert.equal(autosave.flush('visibility').ok, true);
assert.equal(autosaveRepository.loadOrCreate().state.run.resources.rna.amount, 8);

const midSliceStorage = createMemoryStorage({ evolved: 'legacy-save-must-survive' });
const midSliceRepository = createSaveRepository({ storage: midSliceStorage, clock });
const midSliceEngine = createChroniclesEngine({ ruleset, ports: { clock } });
midSliceEngine.state.run.resources.rna.capOverride = 2000;
midSliceEngine.dispatch({ type: 'ADD_RESOURCE', resourceId: 'rna', amount: 1200 });
midSliceEngine.dispatch({ type: 'BUY_PRODUCER', producerId: 'PROC_PRIMORDIAL_REACTION' });
midSliceEngine.dispatch({ type: 'BUY_NODE', nodeId: 'M01' });
midSliceEngine.dispatch({ type: 'BUY_NODE', nodeId: 'M02' });
midSliceEngine.dispatch({ type: 'BUY_PRODUCER', producerId: 'PROC_RNA_REPLICATION' });
midSliceEngine.dispatch({ type: 'BUY_NODE', nodeId: 'M03' });
midSliceEngine.state.run.resources.dna.capOverride = 2000;
midSliceEngine.dispatch({ type: 'ADD_RESOURCE', resourceId: 'dna', amount: 140 });
assert.equal(midSliceRepository.save(midSliceEngine.state).ok, true);
const midSliceLoaded = midSliceRepository.loadOrCreate();
assert.equal(midSliceLoaded.ok, true);
assert.equal(midSliceLoaded.state.run.goals.currentId, 'G004');
assert.equal(midSliceLoaded.state.run.goals.states.G003.status, 'archived');
assert.equal(midSliceLoaded.state.run.goals.side.activeIds.includes('G003_M04_OPTIONAL'), true);
assert.equal(midSliceLoaded.state.run.producers.PROC_PRIMORDIAL_REACTION.count, 1);
assert.equal(midSliceLoaded.state.run.nodes.completed.M03.completedAtMs >= 0, true);
assert.equal(midSliceLoaded.state.run.resources.dna.amount, 140);
assert.equal(midSliceLoaded.state.run.modifiers.active['M01:auto_production'].type, 'unlock_auto_production');
assert.equal(midSliceStorage.get('evolved'), 'legacy-save-must-survive');

const pendingEventStorage = createMemoryStorage();
const pendingEventRepository = createSaveRepository({ storage: pendingEventStorage, clock });
const pendingEventState = createInitialGameState();
pendingEventState.run.events.states['EV-RNA-01'] = { status: 'pending', queuedAtMs: 1200 };
pendingEventState.run.events.pendingId = 'EV-RNA-01';
pendingEventState.run.events.rngState = 123456;
assert.equal(pendingEventRepository.save(pendingEventState).ok, true);
const loadedPendingEvent = pendingEventRepository.loadOrCreate();
assert.equal(loadedPendingEvent.state.run.events.pendingId, 'EV-RNA-01');
assert.equal(loadedPendingEvent.state.run.events.rngState, 123456);

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

const preparedResetSource = createInitialGameState({ runId: 'run_fixture_reset' });
preparedResetSource.run.resources.rna.amount = 777;
preparedResetSource.run.flags.runOnlyFlag = true;
preparedResetSource.meta.archiveFragments = 2;
preparedResetSource.meta.persistentFlags.keepMe = true;
preparedResetSource.settings.locale = 'en';
const preparedTransaction = prepareResetTransaction(preparedResetSource, {
  id: 'reset_tx_fixture',
  reward: { archiveFragments: 5 },
  chronicleRecord: { endingId: 'ENDING_ASH', summaryId: 'fixture_summary' },
});
const generatedTransaction = createResetTransaction(preparedResetSource);
assert.equal(generatedTransaction.status, 'prepared');
assert.equal(generatedTransaction.id, 'timeline_001_ending_ENDING_ASH');
assert.equal(preparedTransaction.id, 'reset_tx_fixture');
assert.equal(preparedTransaction.status, 'prepared');
assert.deepEqual(preparedTransaction.source, {
  runId: 'run_fixture_reset',
  timelineId: 1,
  endingId: 'ENDING_ASH',
});
const firstApply = applyPreparedResetTransaction(preparedResetSource, preparedTransaction, { nextRunId: 'run_after_fixture' });
assert.equal(firstApply.ok, true);
assert.equal(firstApply.alreadyApplied, false);
assert.equal(firstApply.state.run.id, 'run_after_fixture');
assert.equal(firstApply.state.run.resources.rna.amount, 0);
assert.equal(firstApply.state.run.flags.runOnlyFlag, undefined);
assert.equal(firstApply.state.meta.archiveFragments, 7);
assert.equal(firstApply.state.meta.persistentFlags.keepMe, true);
assert.equal(firstApply.state.settings.locale, 'en');
assert.equal(firstApply.state.meta.chronicle.length, 1);
assert.equal(firstApply.state.meta.chronicle[0].transactionId, 'reset_tx_fixture');
assert.deepEqual(firstApply.state.meta.appliedTransactions, ['reset_tx_fixture']);
const retryApply = applyPreparedResetTransaction(firstApply.state, preparedTransaction, { nextRunId: 'run_after_retry' });
assert.equal(retryApply.ok, true);
assert.equal(retryApply.alreadyApplied, true);
assert.equal(retryApply.state.meta.archiveFragments, 7);
assert.equal(retryApply.state.meta.chronicle.length, 1);
assert.equal(retryApply.state.run.id, 'run_after_retry');
assert.equal(retryApply.state.run.resources.rna.amount, 0);

console.log('save flow ok');
