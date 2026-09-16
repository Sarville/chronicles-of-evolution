// Every event is data-only. `deck` events are sampled by the persisted event
// RNG; authored events are queued by their explicit trigger.
export const events = [
  {
    id: 'EV-RNA-01', type: 'milestone', deck: 'authored',
    trigger: { type: 'goal_completed', goalId: 'G001' }, phaseWindow: { eraIds: ['MOLECULAR'] }, priority: 60,
    telemetryKey: 'event_rna_stable', title: 'РНК стабилизирована',
    body: 'Структура удерживается достаточно долго, чтобы изменения начали иметь значение.',
    chronicleSummary: 'В первичном океане появилась устойчивая РНК.',
    choices: [{ id: 'continue', label: 'Продолжить', effects: [] }],
  },
  {
    id: 'EV-RNA-RESONANCE', type: 'flavor', deck: 'early_biology',
    trigger: { type: 'deck', deck: 'early_biology' },
    phaseWindow: { eraIds: ['MOLECULAR'], minActiveMs: 60000, maxActiveMs: 420000 },
    preconditions: [{ type: 'node_completed', nodeId: 'M01' }], weight: 3, cooldownMs: 0, priority: 10,
    telemetryKey: 'event_rna_resonance', title: 'Устойчивый цикл',
    body: 'Несколько удачных реакций повторяются чаще остальных.',
    chronicleSummary: 'Ранние реакции дали небольшой устойчивый избыток РНК.',
    choices: [
      { id: 'stabilize', label: 'Закрепить цикл', effects: [{ type: 'grant_resource', resourceId: 'rna', amount: 12 }] },
      { id: 'observe', label: 'Наблюдать', effects: [{ type: 'set_flag', flag: 'run.bio.rna_cycle_observed', value: true }] },
    ],
  },
  {
    id: 'EV-DNA-01', type: 'narrative', deck: 'authored',
    trigger: { type: 'goal_completed', goalId: 'G003' }, phaseWindow: { eraIds: ['MOLECULAR'] }, priority: 55,
    telemetryKey: 'event_dna_revealed', title: 'Носитель наследственности',
    body: 'Обнаружен более устойчивый носитель наследственности.',
    chronicleSummary: 'Изменения получили возможность переживать поколения.',
    choices: [{ id: 'continue', label: 'Продолжить', effects: [] }],
  },
  {
    id: 'EV-DNA-TRACE', type: 'flavor', deck: 'early_biology',
    trigger: { type: 'deck', deck: 'early_biology' },
    phaseWindow: { eraIds: ['MOLECULAR'], minActiveMs: 240000, maxActiveMs: 600000 },
    preconditions: [{ type: 'node_completed', nodeId: 'M03' }], weight: 2, cooldownMs: 0, priority: 10,
    telemetryKey: 'event_dna_trace', title: 'Точная копия', body: 'Одна из последовательностей сохраняется почти без искажений.',
    chronicleSummary: 'Устойчивое копирование ДНК дало небольшой запас наследственного материала.',
    choices: [{ id: 'retain', label: 'Сохранить', effects: [{ type: 'grant_resource', resourceId: 'dna', amount: 5 }] }],
  },
  {
    id: 'EV-CELL-01', type: 'milestone', deck: 'authored',
    trigger: { type: 'goal_completed', goalId: 'G005' }, phaseWindow: { eraIds: ['CELLULAR'] }, priority: 70,
    telemetryKey: 'event_cell_reached', title: 'ЖИЗНЬ', body: 'Теперь система поддерживает собственные процессы.',
    chronicleSummary: 'Мир перестал быть только химией: появилась первая клетка.',
    choices: [{ id: 'continue', label: 'Подтвердить', effects: [{ type: 'set_flag', flag: 'milestone.cell_event_seen', value: true }] }],
  },
  {
    id: 'EV-BIO-01', type: 'branch', deck: 'authored',
    trigger: { type: 'node_completed', nodeId: 'C01' }, phaseWindow: { eraIds: ['CELLULAR'] }, priority: 80,
    blocks: { branchGroup: 'cell_identity_1' }, telemetryKey: 'event_primary_trait', title: 'Первый путь',
    body: 'Среда не предлагает правильного решения. Только разные способы выжить.',
    chronicleSummary: 'Первичный эволюционный путь вида был закреплён.',
    choices: [
      { id: 'absorption', label: 'Поглощение', purchaseNodeId: 'C02A' },
      { id: 'symbiosis', label: 'Симбиоз', purchaseNodeId: 'C02B' },
      { id: 'shell', label: 'Панцирь', purchaseNodeId: 'C02C' },
    ],
  },
];
