// Archive Recall: per-chapter, player-chosen, permanently stacking perks.
// See docs/gdd/10_META_PROGRESSION.md §4. Each T1-T4 chapter offers the same
// three axes (авто/пассив, вложение/постройка, эффективность) -- different
// mechanisms for the same order of acceleration on that chapter's own new
// content. No currency is granted anywhere in Act 1-2 (§1).
export const ARCHIVE_RECALL_CHAPTERS = {
  T1: {
    endingId: 'ENDING_BLIGHT',
    // First attempt: nothing to defend against yet, so no defense perk here
    // (docs/gdd/10_META_PROGRESSION.md §4.2 table, T1 row).
    stylePerks: {
      auto: {
        id: 'T1_AUTO_MOLECULAR_RESONANCE',
        label: 'Резонанс молекул',
        description: 'Пассивное производство RNA/DNA ×1.5.',
        effects: [
          { type: 'resource_production_multiplier', resourceId: 'rna', value: 1.5 },
          { type: 'resource_production_multiplier', resourceId: 'dna', value: 1.5 },
        ],
      },
      invest: {
        id: 'T1_INVEST_ZERO_LATENCY',
        label: 'Нулевая задержка',
        description: 'Кулдаун ручного клика -90%.',
        effects: [{ type: 'manual_cooldown_multiplier', value: 0.1 }],
      },
      efficiency: {
        id: 'T1_EFFICIENCY_CHEAP_ONTOGENY',
        label: 'Дешёвый онтогенез',
        description: 'Цена первого биологического прорыва (Клетка) ×0.75.',
        effects: [{ type: 'node_cost_multiplier', nodeId: 'M06', value: 0.75 }],
      },
    },
  },
  T2: {
    endingId: 'ENDING_CATACLYSM',
    // Cosmetic only -- the same Мор can't refire, this is flavor/UI, no
    // mechanical effect (docs/gdd/10_META_PROGRESSION.md sec.4.2 table).
    defensePerk: {
      id: 'T2_DEFENSE_QUARANTINE_PROTOCOL',
      label: 'Карантинный протокол',
      description: 'Косметика: следующая попытка помнит, как выглядел Мор.',
      effects: [],
    },
    stylePerks: {
      auto: {
        id: 'T2_AUTO_SELF_SERVICING_STORAGE',
        label: 'Самообслуживающиеся хранилища',
        description: 'Кап Food/Materials/Knowledge растёт сам вместе с населением (+12 за каждого жителя).',
        effects: [
          { type: 'resource_capacity_per_population', resourceId: 'food', value: 12 },
          { type: 'resource_capacity_per_population', resourceId: 'materials', value: 12 },
          { type: 'resource_capacity_per_population', resourceId: 'knowledge', value: 12 },
        ],
      },
      invest: {
        id: 'T2_INVEST_LARGE_CONTAINERS',
        label: 'Крупная тара',
        description: 'Кап склада за постройку Food/Materials/Knowledge ×1.3.',
        effects: [
          { type: 'resource_capacity_multiplier', resourceId: 'food', value: 1.3 },
          { type: 'resource_capacity_multiplier', resourceId: 'materials', value: 1.3 },
          { type: 'resource_capacity_multiplier', resourceId: 'knowledge', value: 1.3 },
        ],
      },
      efficiency: {
        id: 'T2_EFFICIENCY_CHEAP_CONSTRUCTION',
        label: 'Дешёвая застройка',
        description: 'Цена построек Settlement-эпохи ×0.75.',
        effects: [{ type: 'building_cost_multiplier', eraId: 'SETTLEMENT', value: 0.75 }],
      },
    },
  },
  T3: {
    endingId: 'ENDING_FRACTURE',
    // Cosmetic only -- the same Катаклизм can't refire, this is flavor/UI,
    // no mechanical effect (docs/gdd/10_META_PROGRESSION.md sec.4.2 table).
    defensePerk: {
      id: 'T3_DEFENSE_SEISMIC_FOOTINGS',
      label: 'Сейсмоусиленные опоры',
      description: 'Косметика: следующая попытка помнит, как выглядел Катаклизм.',
      effects: [],
    },
    stylePerks: {
      auto: {
        id: 'T3_AUTO_SELF_ORGANIZATION',
        label: 'Самоорганизация',
        description: 'Простаивающие рабочие сами занимают текущие профессии; рабочий, чей ресурс упёрся в кап хранилища, сам переходит на другую работу.',
        effects: [{ type: 'unlock_auto_workforce' }],
      },
      invest: {
        id: 'T3_INVEST_ACCELERATED_CONSTRUCTION',
        label: 'Ускоренное строительство',
        description: 'Цена построек City-эпохи ×0.75.',
        effects: [{ type: 'building_cost_multiplier', eraId: 'CITY', value: 0.75 }],
      },
      efficiency: {
        // Docs describe this as an early Stability/policy threshold, but no
        // Stability system runs before Atomic -- reinterpreted as the
        // chapter's own collapse timer running longer before its cliff, see
        // domain/services/crisis.js chapterTimerTotalMs.
        id: 'T3_EFFICIENCY_UNITY_SOONER',
        label: 'Единство раньше',
        description: 'Раскол наступает позже: общий запас времени до коллапса ×1.3.',
        effects: [{ type: 'chapter_timer_duration_multiplier', timerId: 'chapter3_fracture', value: 1.3 }],
      },
    },
  },
  T4: {
    endingId: 'ENDING_OVERLOAD',
    // Cosmetic only -- the same Раскол can't refire, this is flavor/UI, no
    // mechanical effect (docs/gdd/10_META_PROGRESSION.md sec.4.2 table).
    defensePerk: {
      id: 'T4_DEFENSE_UNIFIED_CONSENT_PROTOCOL',
      label: 'Единый протокол согласия',
      description: 'Косметика: следующая попытка помнит, как выглядел Раскол.',
      effects: [],
    },
    stylePerks: {
      auto: {
        id: 'T4_AUTO_BACKGROUND_PROCESSES',
        label: 'Фоновые процессы',
        description: 'Постройки Industry/Modern сохраняют не менее ~25% выпуска даже при нехватке входных ресурсов.',
        effects: [
          { type: 'building_output_floor', eraId: 'INDUSTRY', value: 0.25 },
          { type: 'building_output_floor', eraId: 'MODERN', value: 0.25 },
        ],
      },
      invest: {
        id: 'T4_INVEST_FORCED_PRODUCTION',
        label: 'Форсированное производство',
        description: 'Выпуск построек Industry/Modern ×1.25.',
        effects: [
          { type: 'building_output_multiplier', eraId: 'INDUSTRY', value: 1.25 },
          { type: 'building_output_multiplier', eraId: 'MODERN', value: 1.25 },
        ],
      },
      efficiency: {
        // docs/gdd/10_META_PROGRESSION.md sec.4.3 worked example: Cognition
        // (G011_COGNITION_TRACK's 4 weighted contributors, B04=20/B05=25/
        // N03=30/N05=25) auto-credits B04+N05 (45 of 100) via eventBonus,
        // leaving B05+N03 (55, the majority) live. Writing (T09->T10, two
        // sequential cost gates) gets the same ~45% relief but as a
        // proportional multiplier on both, not a node skip -- a flat skip
        // doesn't compound with the rest of the stacked perk set.
        id: 'T4_EFFICIENCY_FAST_LEARNING',
        label: 'Быстрое обучение',
        description: 'Cognition: 45 из 100 засчитано сразу. Письменность: цена основания и закрепления поселения (T09/T10) ×0.55.',
        effects: [
          { type: 'grant_cognition', amount: 45 },
          { type: 'node_cost_multiplier', nodeId: 'T09', value: 0.55 },
          { type: 'node_cost_multiplier', nodeId: 'T10', value: 0.55 },
        ],
      },
    },
  },
};

// T5's ending is structurally different from T1-T4 (docs/gdd/
// 10_META_PROGRESSION.md sec.4.4/sec.4.6, [[archive-recall-perk-design]]):
// no defense perk (the first Ash is mandatory, nothing to protect against),
// and its 3 perks stack simultaneously instead of one-slot-per-chapter --
// each is picked once (unlocking it at level 1), then every further T5
// completion after all 3 exist scales every level by +1 instead of granting
// anything new. See domain/services/archiveRecall.js
// grantArchiveRecallEndgamePerk/applyArchiveRecallEndgamePerks for the level
// -> modifier-value math; this table only names the 3 axes and their
// per-level magnitude.
export const ARCHIVE_RECALL_ENDGAME = {
  endingId: 'ENDING_ASH',
  perLevel: {
    production: 0.05,
    stability: 0.08,
    cognition: 0.06,
  },
  perks: {
    production: {
      id: 'T5_ENDGAME_PRODUCTION',
      label: 'Производство',
      description: 'Постоянный бонус к базовому производству (+5% за уровень).',
    },
    stability: {
      id: 'T5_ENDGAME_STABILITY',
      label: 'Экспансия / Стабильность',
      description: 'Постоянный бонус к капам основных ресурсов и запасу Stability в кризисе (+8% за уровень).',
    },
    cognition: {
      id: 'T5_ENDGAME_COGNITION',
      label: 'Познание',
      description: 'Постоянный бонус к скорости накопления Knowledge (+6% за уровень).',
    },
  },
};
