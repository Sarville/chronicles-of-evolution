import { RULESET_VERSION, ruleset } from '../config/index.js';

export function createInitialGameState(options = {}) {
  const runId = options.runId || 'run_001';
  const resources = {};
  for (const resource of ruleset.resources) {
    if (resource.visibleFromEra === 'MOLECULAR') {
      resources[resource.id] = { amount: resource.initialAmount };
    }
  }

  return {
    run: {
      id: runId,
      timelineId: 1,
      rulesetVersion: RULESET_VERSION,
      lifecycle: 'active',
      clock: { simulationMs: 0, activeMs: 0 },
      chapterId: 'CH01',
      eraId: 'MOLECULAR',
      resources,
      producers: {},
      nodes: { completed: {}, selectedBranchByGroup: {} },
      population: null,
      buildings: {},
      goals: {},
      events: {},
      flags: {},
      pathScores: {},
      modifiers: {},
      manualProcesses: {},
      crisis: null,
      stats: { totalEarned: {} },
    },
    meta: {
      archiveFragments: 0,
      chronicle: [],
      persistentFlags: {},
      seenEntities: {},
    },
    settings: {
      locale: 'ru',
      autosave: true,
    },
    session: {
      dirty: false,
      lastEvents: [],
    },
  };
}

export function toPersistedGameState(state) {
  return {
    run: state.run,
    meta: state.meta,
    settings: state.settings,
  };
}

