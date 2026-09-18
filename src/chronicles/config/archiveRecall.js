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
};
