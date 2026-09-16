import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createMemoryStorage } from '../../src/chronicles/adapters/storageAdapter.js';
import { ruleset, createRulesetIndexes } from '../../src/chronicles/config/index.js';
import { createChroniclesEngine } from '../../src/chronicles/domain/engine.js';
import { formatEta, formatResourceAmount, selectProducerOutputView } from '../../src/chronicles/domain/selectors.js';
import { createPlayableRuntime, createPresentationSnapshot, routeCtaFocus } from '../../src/chronicles/ui/runtime.js';
import { createSaveRepository, SAVE_KEYS } from '../../src/chronicles/save/repository.js';

const indexes = createRulesetIndexes(ruleset);
const storage = createMemoryStorage({ evolved: 'legacy-save-must-survive', [SAVE_KEYS.primary]: '{bad json' });
const repository = createSaveRepository({ storage });
const runtime = createPlayableRuntime({ repository, ruleset, dev: false });
assert.equal(runtime.mode, 'recovery_required');
assert.equal(runtime.engine, undefined);
assert.equal(runtime.autosave, undefined);
assert.equal(storage.get(SAVE_KEYS.primary), '{bad json');
assert.equal(storage.get('evolved'), 'legacy-save-must-survive');

const fresh = runtime.startFreshAfterCorruption();
assert.equal(fresh.ok, true);
assert.equal(fresh.runtime.mode, 'playable');
assert.equal(fresh.runtime.engine.state.run.goals.currentId, 'G001');
assert.equal(storage.get('evolved'), 'legacy-save-must-survive');

const prodSnapshot = createPresentationSnapshot(fresh.runtime, { dev: false });
assert.equal(prodSnapshot.mode, 'playable');
assert.equal(prodSnapshot.currentGoalId, 'G001');
assert.equal(prodSnapshot.resourceCount, 1);
assert.equal(prodSnapshot.hasManualAction, true);
assert.equal(prodSnapshot.hasDevControls, false);

const devRuntime = createPlayableRuntime({ repository: createSaveRepository({ storage: createMemoryStorage() }), ruleset, dev: true });
const devSnapshot = createPresentationSnapshot(devRuntime, { dev: true });
assert.equal(devSnapshot.hasDevControls, true);

const nodeRoute = routeCtaFocus({ targetId: 'M01' }, indexes);
assert.deepEqual(nodeRoute, { activeView: 'evolution', focusedEntityId: 'M01' });
const producerRoute = routeCtaFocus({ targetId: 'PROC_PRIMORDIAL_REACTION' }, indexes);
assert.deepEqual(producerRoute, { activeView: 'world', focusedEntityId: 'PROC_PRIMORDIAL_REACTION' });
const manualRoute = routeCtaFocus({ targetId: 'MANUAL_PRIMORDIAL_PULSE' }, indexes);
assert.deepEqual(manualRoute, { activeView: 'world', focusedEntityId: 'MANUAL_PRIMORDIAL_PULSE' });

const milestoneEngine = createChroniclesEngine({ ruleset });
milestoneEngine.dispatch({ type: 'ADD_RESOURCE', resourceId: 'rna', amount: 1000 });
for (let index = 0; index < 10; index += 1) {
  const buy = milestoneEngine.dispatch({ type: 'BUY_PRODUCER', producerId: 'PROC_PRIMORDIAL_REACTION' });
  assert.equal(buy.ok, true);
}
const outputView = selectProducerOutputView(milestoneEngine.state, ruleset, 'PROC_PRIMORDIAL_REACTION');
assert.equal(outputView.reachedMilestone.label, 'Reaction network');
assert.equal(outputView.reachedMilestone.multiplier, 1.15);
assert.deepEqual(outputView.basePerUnit, { rna: 0.22 });
assert.deepEqual(outputView.currentTotal, { rna: 2.53 });
assert.equal(formatResourceAmount(8.99), '8');
assert.equal(formatEta({ status: 'now', seconds: 0 }), 'Сейчас');
assert.equal(formatEta({ status: 'waiting', seconds: 63 }), '≈1м 3с');
assert.equal(formatEta({ status: 'unavailable' }), 'Недоступно');

const appSource = readFileSync(`${process.cwd()}/src/chronicles/ui/app.js`, 'utf8');
assert.equal(appSource.includes('Current total'), true);
assert.equal(appSource.includes('(+'), true);
assert.equal(appSource.includes('ETA'), true);
assert.equal(appSource.includes('data-action="manual" data-id="${process.id}"'), true);

console.log('ui runtime ok');
