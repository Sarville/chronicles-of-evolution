import { ruleset as defaultRuleset } from '../config/index.js';

export const CANONICAL_PATH_SCORE_IDS = [
  'nature',
  'industry',
  'freedom',
  'control',
  'cooperation',
  'dominance',
  'biology',
  'machines',
  'preservation',
  'expansion',
];

function createInitialPathScores() {
  return Object.fromEntries(CANONICAL_PATH_SCORE_IDS.map((pathId) => [pathId, 0]));
}

export function createInitialGameState(options = {}) {
  const sourceRuleset = options.ruleset || defaultRuleset;
  const runId = options.runId || 'run_001';
  const resources = {};
  for (const resource of sourceRuleset.resources) {
    if (resource.visibleFromEra === 'MOLECULAR') {
      resources[resource.id] = { amount: resource.initialAmount };
    }
  }

  return {
    run: {
      id: runId,
      timelineId: 1,
      rulesetVersion: sourceRuleset.version,
      lifecycle: 'active',
      clock: { simulationMs: 0, activeMs: 0 },
      // Which T1-T5 Act 1 replay attempt this run represents (docs/gdd/
      // 13_ACT_ONE_CHAPTERS.md) -- gates which chapter's own goal chain is
      // visible, see services/goals.js chapterAttemptVisible.
      actOneAttempt: options.actOneAttempt || 'T1',
      chapterId: 'CH01',
      eraId: 'MOLECULAR',
      resources,
      producers: {},
      nodes: { completed: {}, selectedBranchByGroup: {} },
      population: null,
      economy: { deficits: {} },
      adaptation: { points: 0, earnedTotal: 0, spentTotal: 0, selectedOptionalNodes: [] },
      cognition: { eventBonus: 0 },
      buildings: {},
      goals: {
        currentId: null,
        chapter: { activeId: null },
        side: { activeIds: [] },
        states: {},
      },
      events: { rngState: options.eventSeed ?? 1, queue: [], pendingId: null, states: {}, history: [], lastDeckDrawAtMs: {} },
      flags: {},
      discovery: { seenEntities: [], corruptedSeen: [] },
      pathScores: createInitialPathScores(),
      modifiers: { active: {} },
      manualProcesses: {},
      crisis: null,
      stats: { totalEarned: {} },
    },
    meta: {
      archiveFragments: 0,
      archiveRecall: { chapters: {}, endgame: {} },
      chronicle: [],
      unlocks: {},
      persistentFlags: {},
      seenEntities: {},
    },
    settings: {
      locale: 'ru',
      autosave: true,
      testMode: false,
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
