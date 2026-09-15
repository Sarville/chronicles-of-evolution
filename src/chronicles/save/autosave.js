export function createAutosaveController({ repository, engine, intervalMs = 5000, clock } = {}) {
  if (!repository) {
    throw new Error('AutosaveController requires a save repository');
  }
  if (!engine) {
    throw new Error('AutosaveController requires an engine');
  }

  let elapsedMs = 0;
  let lastResult = null;

  function autosave(reason = 'manual') {
    if (!engine.state.settings.autosave || !engine.state.session.dirty) {
      return { ok: true, skipped: true, reason };
    }

    lastResult = repository.save(engine.state, { clock, autosaveReason: reason });
    if (!lastResult.ok) {
      engine.state.session.saveError = { reason: lastResult.reason, atMs: engine.state.run.clock.simulationMs };
    } else {
      delete engine.state.session.saveError;
    }
    return lastResult;
  }

  return {
    tick(deltaMs) {
      elapsedMs += deltaMs;
      if (elapsedMs < intervalMs) {
        return { ok: true, skipped: true, reason: 'interval' };
      }
      elapsedMs = 0;
      return autosave('interval');
    },
    flush(reason = 'flush') {
      elapsedMs = 0;
      return autosave(reason);
    },
    getLastResult() {
      return lastResult;
    },
  };
}
