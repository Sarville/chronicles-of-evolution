import { ruleset as defaultRuleset } from '../config/index.js';
import { createChroniclesEngine } from '../domain/engine.js';
import { createDebugApi } from '../dev/debugApi.js';
import { createAutosaveController } from '../save/autosave.js';

export function createPlayableRuntime({ repository, ruleset = defaultRuleset, dev = false, loadResult = null, ports = {} }) {
  const loaded = loadResult || repository.loadOrCreate();
  if (!loaded.ok) {
    return {
      mode: loaded.reason === 'RECOVERY_REQUIRED' ? 'recovery_required' : 'load_failed',
      loaded,
      diagnostics: loaded.damagedSlots || [],
      startFreshAfterCorruption() {
        const fresh = repository.startFreshAfterCorruption();
        if (!fresh.ok) {
          return { ok: false, loaded: fresh };
        }
        return { ok: true, runtime: createPlayableRuntime({ repository, ruleset, dev, loadResult: fresh, ports }) };
      },
    };
  }

  const engine = createChroniclesEngine({ ruleset, state: loaded.state, ports });
  const autosave = createAutosaveController({ repository, engine, intervalMs: 5000 });
  const debugApi = dev ? createDebugApi({ dev: true, engine, ports }) : null;
  return {
    mode: 'playable',
    loaded,
    engine,
    autosave,
    debugApi,
    ruleset,
    dev,
  };
}

export function routeCtaFocus(cta, indexes) {
  const targetId = cta?.targetId || null;
  if (!targetId) {
    return { activeView: 'world', focusedEntityId: null };
  }
  if (indexes.nodes[targetId]) {
    return { activeView: 'evolution', focusedEntityId: targetId };
  }
  if (indexes.producers[targetId] || indexes.manualProcesses[targetId]) {
    return { activeView: 'world', focusedEntityId: targetId };
  }
  return { activeView: 'world', focusedEntityId: targetId };
}

export function createPresentationSnapshot(runtime, { activeView = 'world', focusedEntityId = null, dev = false } = {}) {
  if (runtime.mode !== 'playable') {
    return {
      mode: runtime.mode,
      resourceCount: 0,
      currentGoalId: null,
      hasManualAction: false,
      activeView,
      focusedEntityId,
      hasDevControls: false,
    };
  }
  return {
    mode: 'playable',
    resourceCount: Object.keys(runtime.engine.state.run.resources).length,
    currentGoalId: runtime.engine.state.run.goals.currentId,
    hasManualAction: Boolean(runtime.ruleset.manualProcesses.find((process) => process.id === 'MANUAL_PRIMORDIAL_PULSE')),
    activeView,
    focusedEntityId,
    hasDevControls: dev === true,
  };
}
