import { createRulesetIndexes, ruleset } from '../config/index.js';
import { createChroniclesEngine } from '../domain/engine.js';
import { queueEvent } from '../domain/services/events.js';
import { createInitialGameState } from '../domain/state.js';

const DEV_TIME_SCALES = Object.freeze([1, 5, 20, 100]);

export function createDebugApi(options = {}) {
  const engine = options.engine || createChroniclesEngine(options);
  const devEnabled = options.dev !== false && options.environment !== 'production';
  const indexes = createRulesetIndexes(engine.ruleset);

  function assertDevEnabled() {
    if (!devEnabled) {
      throw new Error('Debug API is disabled outside development builds');
    }
  }

  return {
    engine,
    timeScales: DEV_TIME_SCALES,
    setTimeScale(scale) {
      assertDevEnabled();
      if (!DEV_TIME_SCALES.includes(scale)) {
        return { ok: false, reason: 'INVALID_TIME_SCALE', allowed: DEV_TIME_SCALES };
      }
      engine.state.settings.devTimeScale = scale;
      options.ports?.clock?.setTimeScale?.(scale);
      return { ok: true, scale };
    },
    grant(resourceId, amount) {
      assertDevEnabled();
      return engine.dispatch({ type: 'ADD_RESOURCE', resourceId, amount });
    },
    jumpToEra(eraId) {
      assertDevEnabled();
      const era = indexes.eras[eraId];
      if (!era) {
        return { ok: false, reason: 'UNKNOWN_ERA', eraId };
      }
      engine.state.run.eraId = era.id;
      engine.state.run.chapterId = era.chapterId;
      for (const resourceId of era.activeResources) {
        if (!engine.state.run.resources[resourceId]) {
          engine.state.run.resources[resourceId] = { amount: 0 };
        }
      }
      engine.state.session.dirty = true;
      return { ok: true, eraId: era.id, chapterId: era.chapterId };
    },
    triggerEvent(eventId, triggerOptions = {}) {
      assertDevEnabled();
      const queued = queueEvent(engine.state, engine.ruleset, eventId, options.ports, {
        force: triggerOptions.force === true || options.forceEvents === true,
      });
      if (!queued.ok) {
        return queued;
      }
      engine.state.session.dirty = true;
      return queued;
    },
    manualDevReset(resetOptions = {}) {
      assertDevEnabled();
      const previousMeta = engine.state.meta;
      const previousSettings = engine.state.settings;
      const nextState = createInitialGameState({
        ruleset: engine.ruleset,
        runId: resetOptions.runId || 'run_dev_reset',
      });
      engine.state.run = nextState.run;
      engine.state.meta = previousMeta;
      engine.state.settings = previousSettings;
      engine.state.session.dirty = true;
      engine.state.session.lastEvents = [];
      return { ok: true, runId: engine.state.run.id };
    },
    dumpState() {
      assertDevEnabled();
      return JSON.parse(JSON.stringify(engine.state));
    },
    buyNode(nodeId) {
      assertDevEnabled();
      return engine.dispatch({ type: 'BUY_NODE', nodeId });
    },
    ruleset,
  };
}
