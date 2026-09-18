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
};
