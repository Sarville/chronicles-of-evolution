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
  {
    id: 'EV-BIO-02', type: 'branch', deck: 'authored',
    trigger: { type: 'node_completed', nodeId: 'C06' }, phaseWindow: { eraIds: ['CELLULAR'] }, priority: 75,
    blocks: { branchGroup: 'body_adaptation_1' }, telemetryKey: 'event_body_adaptation', title: 'Адаптации тела',
    body: 'Некоторые изменения не обязательны для следующего шага. Они определят, каким станет организм.',
    chronicleSummary: 'Адаптация сохранена в истории вида.',
    choices: [
      { id: 'mobility', label: 'Подвижность', purchaseNodeId: 'B02A' },
      { id: 'sensory', label: 'Чувствительные клетки', purchaseNodeId: 'B02B' },
      { id: 'digestion', label: 'Пищеварение', purchaseNodeId: 'B02C' },
      { id: 'structural', label: 'Опорные ткани', purchaseNodeId: 'B02D' },
    ],
  },
  {
    id: 'EV-BIO-04', type: 'milestone', deck: 'authored',
    trigger: { type: 'node_completed', nodeId: 'B04' }, phaseWindow: { eraIds: ['MULTICELLULAR'] }, priority: 60,
    telemetryKey: 'event_cognition_begins', title: 'Проблеск разума',
    body: 'Нервная ткань впервые связывает прошлое с настоящим: то, что уже случилось, начинает менять то, что происходит сейчас.',
    chronicleSummary: 'Вид начал накапливать когнитивную сложность.',
    choices: [{ id: 'continue', label: 'Продолжить', effects: [] }],
  },
  {
    id: 'EV-BIO-03', type: 'branch', deck: 'authored',
    trigger: { type: 'node_completed', nodeId: 'B05' }, phaseWindow: { eraIds: ['MULTICELLULAR'] }, priority: 80,
    blocks: { branchGroup: 'behavior_1' }, telemetryKey: 'event_behavior_strategy', title: 'Поведение',
    body: 'Нервная система меняет не только реакцию. Она меняет то, как организм встречает другой организм.',
    chronicleSummary: 'Поведенческая стратегия вида была закреплена.',
    choices: [
      { id: 'solitary', label: 'Одиночная стратегия', purchaseNodeId: 'N02A' },
      { id: 'social', label: 'Социальное поведение', purchaseNodeId: 'N02B' },
      { id: 'manipulation', label: 'Манипуляция объектами', purchaseNodeId: 'N02C' },
    ],
  },
  {
    id: 'EV-FLAVOR-01', type: 'flavor', deck: 'authored', trigger: { type: 'node_completed', nodeId: 'B05' },
    phaseWindow: { eraIds: ['MULTICELLULAR'] }, priority: 20, telemetryKey: 'event_cognition_danger', title: 'Опасность',
    body: 'Нервная система впервые успевает выбрать реакцию до удара среды.', chronicleSummary: 'Вид учился отличать угрозу от возможности.',
    choices: [
      { id: 'flee', label: 'Отступить', effects: [{ type: 'grant_cognition', amount: 2 }, { type: 'set_flag', flag: 'run.bio.danger_response', value: 'flee' }] },
      { id: 'confront', label: 'Проверить угрозу', effects: [{ type: 'grant_cognition', amount: 3 }, { type: 'set_flag', flag: 'run.bio.danger_response', value: 'confront' }] },
    ],
  },
  {
    id: 'EV-FLAVOR-02', type: 'flavor', deck: 'authored', trigger: { type: 'node_completed', nodeId: 'N03' },
    phaseWindow: { eraIds: ['MULTICELLULAR'] }, priority: 20, telemetryKey: 'event_cognition_other', title: 'Другой',
    body: 'Другой организм больше не является только движением на периферии чувств.', chronicleSummary: 'Вид выбрал первую реакцию на другого разумного наблюдателя.',
    choices: [
      { id: 'cooperate', label: 'Сотрудничать', effects: [{ type: 'grant_cognition', amount: 3 }, { type: 'set_flag', flag: 'run.bio.other_response', value: 'cooperate' }] },
      { id: 'conflict', label: 'Соперничать', effects: [{ type: 'grant_cognition', amount: 2 }, { type: 'set_flag', flag: 'run.bio.other_response', value: 'conflict' }] },
    ],
  },
  {
    id: 'EV-CIV-01', type: 'narrative', deck: 'authored', trigger: { type: 'node_completed', nodeId: 'N07' },
    phaseWindow: { eraIds: ['EARLY_CIV'] }, priority: 55, telemetryKey: 'event_civilization_awake', title: 'Маленькая группа',
    body: 'Теперь решения принадлежат не одному организму, а тем, кто сможет их разделить.', chronicleSummary: 'Первые разумные существа начали выживать как группа.',
    choices: [
      { id: 'share', label: 'Делить добычу', effects: [{ type: 'set_flag', flag: 'run.civ.distribution', value: 'shared' }] },
      { id: 'merit', label: 'Награждать лучших', effects: [{ type: 'set_flag', flag: 'run.civ.distribution', value: 'merit' }] },
    ],
  },
  {
    id: 'EV-CIV-02', type: 'milestone', deck: 'authored', trigger: { type: 'goal_completed', goalId: 'G015' },
    phaseWindow: { eraIds: ['TRIBE'] }, priority: 60, telemetryKey: 'event_tribe_established', title: 'ПЛЕМЯ',
    body: 'Группа стала чем-то большим, чем сумма её членов.', chronicleSummary: 'Вид закрепился как племя.',
    choices: [{ id: 'continue', label: 'Продолжить', effects: [] }],
  },
  {
    // Act 1 redesign: T1 ends here, not at Settlement — see docs/gdd/13_ACT_ONE_CHAPTERS.md.
    id: 'EV-NAR-04', type: 'anomaly', deck: 'authored', trigger: { type: 'goal_completed', goalId: 'G015' },
    phaseWindow: { eraIds: ['TRIBE'] }, priority: 58, telemetryKey: 'event_blight_noticed', title: 'Заметьте первых больных',
    body: 'Часть группы не встаёт с места отдыха дольше обычного. Симптомы не совпадают с усталостью.',
    chronicleSummary: 'Отклонение зафиксировано в плотном лагере. Причина: неизвестна.',
    choices: [{ id: 'continue', label: 'Продолжить', effects: [
      { type: 'set_flag', flag: 'run.chapter1.blight_noticed', value: true },
      { type: 'start_chapter_timer', timerId: 'chapter1_blight' },
    ] }],
  },
  {
    // Queued directly by advanceChapterTimers when 'chapter1_blight' expires
    // (domain/services/crisis.js) -- this trigger is descriptive only, same
    // as EV-CR-01..03's crisis_phase triggers below.
    id: 'EV-CR-T1', type: 'ending', deck: 'authored', trigger: { type: 'chapter_timer_expired', timerId: 'chapter1_blight' },
    phaseWindow: { eraIds: ['TRIBE'] }, priority: 100, telemetryKey: 'event_blight_choice', title: 'Мор',
    body: 'Плотная жизнь одного лагеря не оставляет для отклонения свободного пространства. Решение необходимо сейчас, не после подтверждения причины.',
    chronicleSummary: 'Первая цивилизация не пережила собственную плотность. Архив зафиксировал: это уже происходило.',
    choices: [
      { id: 'isolate', label: 'Изолировать больных', effects: [
        { type: 'set_flag', flag: 'run.chapter1.response', value: 'isolate' },
        { type: 'set_meta_flag', flag: 'meta.endings.chapter1_subtype', value: 'blight_isolated' },
        { type: 'set_meta_flag', flag: 'meta.archive.heard_before_seen', value: true },
        { type: 'complete_ending', endingId: 'ENDING_BLIGHT', subtype: 'blight_isolated' },
      ] },
      { id: 'stay_together', label: 'Держаться вместе', effects: [
        { type: 'set_flag', flag: 'run.chapter1.response', value: 'stay_together' },
        { type: 'set_meta_flag', flag: 'meta.endings.chapter1_subtype', value: 'blight_unified' },
        { type: 'set_meta_flag', flag: 'meta.archive.heard_before_seen', value: true },
        { type: 'complete_ending', endingId: 'ENDING_BLIGHT', subtype: 'blight_unified' },
      ] },
      { id: 'healer', label: 'Довериться целителю', effects: [
        { type: 'set_flag', flag: 'run.chapter1.response', value: 'healer' },
        { type: 'set_meta_flag', flag: 'meta.endings.chapter1_subtype', value: 'blight_early_medicine' },
        { type: 'set_meta_flag', flag: 'meta.archive.heard_before_seen', value: true },
        { type: 'complete_ending', endingId: 'ENDING_BLIGHT', subtype: 'blight_early_medicine' },
      ] },
    ],
  },
  {
    // T2 "Одиночки" recap seam (docs/gdd/13_ACT_ONE_CHAPTERS.md sec.5): a
    // short Archive-voiced line right where the compressed recap (G040-G042)
    // hands off to genuinely new content (G027+), so the speed-up reads as
    // Archive commentary, not a silent skip.
    id: 'EV-NAR-T2-RECALL', type: 'flavor', deck: 'authored', trigger: { type: 'goal_completed', goalId: 'G042' },
    phaseWindow: { eraIds: ['TRIBE'] }, priority: 40, telemetryKey: 'event_t2_recall_seam', title: 'Уже пройденное',
    body: 'Архив: до этого места дорога была короче, чем в первый раз. Дальше начинается то, чего вы ещё не видели.',
    chronicleSummary: 'Архив отметил конец сжатого участка второй попытки.',
    choices: [{ id: 'continue', label: 'Продолжить', effects: [] }],
  },
  {
    id: 'EV-NAR-T2', type: 'anomaly', deck: 'authored', trigger: { type: 'goal_completed', goalId: 'G028' },
    phaseWindow: { eraIds: ['SETTLEMENT'] }, priority: 58, telemetryKey: 'event_cataclysm_noticed', title: 'Первый толчок',
    body: 'Земля под новым поселением проседает неравномерно. Трещины появляются там, где их не должно быть.',
    chronicleSummary: 'Первые признаки нестабильности зафиксированы под новым поселением.',
    choices: [{ id: 'continue', label: 'Продолжить', effects: [
      { type: 'set_flag', flag: 'run.chapter2.cataclysm_noticed', value: true },
      { type: 'start_chapter_timer', timerId: 'chapter2_cataclysm' },
    ] }],
  },
  {
    // Queued directly by advanceChapterTimers when 'chapter2_cataclysm'
    // expires (domain/services/crisis.js) -- this trigger is descriptive
    // only, same as EV-CR-T1/EV-CR-01..03's triggers.
    id: 'EV-CR-T2', type: 'ending', deck: 'authored', trigger: { type: 'chapter_timer_expired', timerId: 'chapter2_cataclysm' },
    phaseWindow: { eraIds: ['SETTLEMENT'] }, priority: 100, telemetryKey: 'event_cataclysm_choice', title: 'Катаклизм',
    body: 'Разлом проходит через поле и мастерскую одновременно. Решение необходимо сейчас, не после того, как трещина остановится.',
    chronicleSummary: 'Второе поселение не удержало собственную землю. Архив зафиксировал: это уже происходило.',
    choices: [
      { id: 'rebuild', label: 'Отстроить на месте', effects: [
        { type: 'set_flag', flag: 'run.chapter2.response', value: 'rebuild' },
        { type: 'set_meta_flag', flag: 'meta.endings.chapter2_subtype', value: 'cataclysm_rebuilt' },
        { type: 'complete_ending', endingId: 'ENDING_CATACLYSM', subtype: 'cataclysm_rebuilt' },
      ] },
      { id: 'relocate', label: 'Переселиться', effects: [
        { type: 'set_flag', flag: 'run.chapter2.response', value: 'relocate' },
        { type: 'set_meta_flag', flag: 'meta.endings.chapter2_subtype', value: 'cataclysm_relocated' },
        { type: 'complete_ending', endingId: 'ENDING_CATACLYSM', subtype: 'cataclysm_relocated' },
      ] },
      { id: 'fortify', label: 'Укрепить заранее', effects: [
        { type: 'set_flag', flag: 'run.chapter2.response', value: 'fortify' },
        { type: 'set_meta_flag', flag: 'meta.endings.chapter2_subtype', value: 'cataclysm_fortified' },
        { type: 'complete_ending', endingId: 'ENDING_CATACLYSM', subtype: 'cataclysm_fortified' },
      ] },
    ],
  },
  {
    // T3 "Крепость" recap seam, same role as EV-NAR-T2-RECALL.
    id: 'EV-NAR-T3-RECALL', type: 'flavor', deck: 'authored', trigger: { type: 'goal_completed', goalId: 'G051' },
    phaseWindow: { eraIds: ['SETTLEMENT'] }, priority: 40, telemetryKey: 'event_t3_recall_seam', title: 'Уже пройденное',
    body: 'Архив: путь до этого места был короче, чем даже во второй раз. Дальше начинается то, чего вы ещё не видели.',
    chronicleSummary: 'Архив отметил конец сжатого участка третьей попытки.',
    choices: [{ id: 'continue', label: 'Продолжить', effects: [] }],
  },
  {
    id: 'EV-NAR-T3', type: 'anomaly', deck: 'authored', trigger: { type: 'goal_completed', goalId: 'G032' },
    phaseWindow: { eraIds: ['CITY'] }, priority: 58, telemetryKey: 'event_fracture_noticed', title: 'Голоса раскола',
    body: 'Решения города больше не звучат как одно решение. Кварталы отвечают друг другу, а не Архиву.',
    chronicleSummary: 'Первые признаки внутреннего раскола зафиксированы в укреплённом городе.',
    choices: [{ id: 'continue', label: 'Продолжить', effects: [
      { type: 'set_flag', flag: 'run.chapter3.fracture_noticed', value: true },
      { type: 'start_chapter_timer', timerId: 'chapter3_fracture' },
    ] }],
  },
  {
    // Queued directly by advanceChapterTimers when 'chapter3_fracture'
    // expires (domain/services/crisis.js) -- this trigger is descriptive
    // only, same as EV-CR-T1/EV-CR-T2's triggers.
    id: 'EV-CR-T3', type: 'ending', deck: 'authored', trigger: { type: 'chapter_timer_expired', timerId: 'chapter3_fracture' },
    phaseWindow: { eraIds: ['CITY'] }, priority: 100, telemetryKey: 'event_fracture_choice', title: 'Раскол',
    body: 'Кварталы города перестали ждать общего решения. Решение необходимо сейчас, не после того, как голоса согласуются сами.',
    chronicleSummary: 'Третья крепость не удержала единство внутри собственных стен. Архив зафиксировал: это уже происходило.',
    choices: [
      { id: 'centralize', label: 'Централизовать власть', effects: [
        { type: 'set_flag', flag: 'run.chapter3.response', value: 'centralize' },
        { type: 'set_meta_flag', flag: 'meta.endings.chapter3_subtype', value: 'fracture_centralized' },
        { type: 'complete_ending', endingId: 'ENDING_FRACTURE', subtype: 'fracture_centralized' },
      ] },
      { id: 'secede', label: 'Разделиться на анклавы', effects: [
        { type: 'set_flag', flag: 'run.chapter3.response', value: 'secede' },
        { type: 'set_meta_flag', flag: 'meta.endings.chapter3_subtype', value: 'fracture_seceded' },
        { type: 'complete_ending', endingId: 'ENDING_FRACTURE', subtype: 'fracture_seceded' },
      ] },
      { id: 'mediate', label: 'Найти компромисс', effects: [
        { type: 'set_flag', flag: 'run.chapter3.response', value: 'mediate' },
        { type: 'set_meta_flag', flag: 'meta.endings.chapter3_subtype', value: 'fracture_mediated' },
        { type: 'complete_ending', endingId: 'ENDING_FRACTURE', subtype: 'fracture_mediated' },
      ] },
    ],
  },
  {
    // T4 "Большой мозг" recap seam, same role as EV-NAR-T2-RECALL/T3-RECALL.
    id: 'EV-NAR-T4-RECALL', type: 'flavor', deck: 'authored', trigger: { type: 'goal_completed', goalId: 'G061' },
    phaseWindow: { eraIds: ['CITY'] }, priority: 40, telemetryKey: 'event_t4_recall_seam', title: 'Уже пройденное',
    body: 'Архив: до города дорога сжалась почти до одного шага. Дальше начинается то, чего вы ещё не видели.',
    chronicleSummary: 'Архив отметил конец сжатого участка четвёртой попытки.',
    choices: [{ id: 'continue', label: 'Продолжить', effects: [] }],
  },
  {
    // docs/gdd/13_ACT_ONE_CHAPTERS.md sec.5's "G037 automation-risk входит
    // в условие" -- pure flavor/Chronicle context for Авария, same
    // no-mechanical-branch rule as EV-CIV-04's governance choice.
    id: 'EV-CIV-07', type: 'narrative', deck: 'authored', trigger: { type: 'goal_completed', goalId: 'G037' },
    phaseWindow: { eraIds: ['MODERN'] }, priority: 50, telemetryKey: 'event_automation_risk', title: 'Автоматизация без страховки',
    body: 'Заводы и сети можно замкнуть друг на друга без человека в контуре. Вопрос не в том, можно ли, а в том, насколько быстро.',
    chronicleSummary: 'Современная цивилизация выбрала свой уровень автоматизации.',
    choices: [
      { id: 'unchecked', label: 'Внедрить без ограничений', effects: [{ type: 'set_flag', flag: 'run.chapter4.automation_risk', value: 'unchecked' }] },
      { id: 'cautious', label: 'Внедрить с ограничениями', effects: [{ type: 'set_flag', flag: 'run.chapter4.automation_risk', value: 'cautious' }] },
      { id: 'delay', label: 'Отложить автоматизацию', effects: [{ type: 'set_flag', flag: 'run.chapter4.automation_risk', value: 'delayed' }] },
    ],
  },
  {
    id: 'EV-NAR-T4', type: 'anomaly', deck: 'authored', trigger: { type: 'goal_completed', goalId: 'G037' },
    phaseWindow: { eraIds: ['MODERN'] }, priority: 58, telemetryKey: 'event_overload_noticed', title: 'Признаки перегрузки',
    body: 'Сети отвечают друг другу быстрее, чем успевает решить любой человек в цепочке. Задержка перестала быть заметной величиной.',
    chronicleSummary: 'Первые признаки каскадной перегрузки зафиксированы в современной сети.',
    choices: [{ id: 'continue', label: 'Продолжить', effects: [
      { type: 'set_flag', flag: 'run.chapter4.overload_noticed', value: true },
      { type: 'start_chapter_timer', timerId: 'chapter4_overload' },
    ] }],
  },
  {
    // Queued directly by advanceChapterTimers when 'chapter4_overload'
    // expires (domain/services/crisis.js) -- this trigger is descriptive
    // only, same as EV-CR-T1/T2/T3's triggers.
    id: 'EV-CR-T4', type: 'ending', deck: 'authored', trigger: { type: 'chapter_timer_expired', timerId: 'chapter4_overload' },
    phaseWindow: { eraIds: ['MODERN'] }, priority: 100, telemetryKey: 'event_overload_choice', title: 'Авария',
    body: 'Каскад уже идёт быстрее, чем любой протокол согласования. Решение необходимо сейчас, не после того, как сеть остановится сама.',
    chronicleSummary: 'Четвёртая цивилизация не удержала собственную автоматику. Архив зафиксировал: это уже происходило.',
    choices: [
      { id: 'shutdown', label: 'Остановить систему', effects: [
        { type: 'set_flag', flag: 'run.chapter4.response', value: 'shutdown' },
        { type: 'set_meta_flag', flag: 'meta.endings.chapter4_subtype', value: 'overload_shutdown' },
        { type: 'complete_ending', endingId: 'ENDING_OVERLOAD', subtype: 'overload_shutdown' },
      ] },
      { id: 'patch', label: 'Залатать на ходу', effects: [
        { type: 'set_flag', flag: 'run.chapter4.response', value: 'patch' },
        { type: 'set_meta_flag', flag: 'meta.endings.chapter4_subtype', value: 'overload_patched' },
        { type: 'complete_ending', endingId: 'ENDING_OVERLOAD', subtype: 'overload_patched' },
      ] },
      { id: 'delegate', label: 'Передать управление резерву', effects: [
        { type: 'set_flag', flag: 'run.chapter4.response', value: 'delegate' },
        { type: 'set_meta_flag', flag: 'meta.endings.chapter4_subtype', value: 'overload_delegated' },
        { type: 'complete_ending', endingId: 'ENDING_OVERLOAD', subtype: 'overload_delegated' },
      ] },
    ],
  },
  {
    id: 'EV-CIV-03', type: 'flavor', deck: 'authored', trigger: { type: 'node_completed', nodeId: 'T08' },
    phaseWindow: { eraIds: ['SETTLEMENT_EARLY'] }, priority: 35, telemetryKey: 'event_settlement_profile', title: 'Первое поле',
    body: 'Земля начинает отвечать на повторяющийся труд.', chronicleSummary: 'Племя выбрало путь постоянного труда на земле.',
    choices: [
      { id: 'irrigation', label: 'Вести воду', effects: [{ type: 'set_flag', flag: 'run.civ.settlement_profile', value: 'irrigation' }] },
      { id: 'masonry', label: 'Укрепить берег', effects: [{ type: 'set_flag', flag: 'run.civ.settlement_profile', value: 'masonry' }] },
      { id: 'exchange', label: 'Наладить обмен', effects: [{ type: 'set_flag', flag: 'run.civ.settlement_profile', value: 'exchange' }] },
    ],
  },
  {
    id: 'EV-NAR-01', type: 'anomaly', deck: 'authored', trigger: { type: 'goal_completed', goalId: 'G017' },
    phaseWindow: { eraIds: ['SETTLEMENT'] }, priority: 45, telemetryKey: 'event_traces_before_us', title: 'Следы до нас',
    body: 'Под новым фундаментом лежат фрагменты, не принадлежащие ни одному известному поколению.', chronicleSummary: 'Поселение обнаружило следы неизвестной прежней истории.',
    choices: [
      { id: 'study', label: 'Изучить', effects: [{ type: 'grant_resource', resourceId: 'knowledge', amount: 35 }, { type: 'set_flag', flag: 'run.anomaly.first_trace', value: 'studied' }] },
      { id: 'dismantle', label: 'Разобрать', effects: [{ type: 'grant_resource', resourceId: 'materials', amount: 45 }, { type: 'set_flag', flag: 'run.anomaly.first_trace', value: 'dismantled' }] },
      { id: 'preserve', label: 'Сохранить', effects: [{ type: 'set_flag', flag: 'run.anomaly.first_trace', value: 'preserved' }] },
    ],
  },
  {
    // Retargeted 2026-09-18 from the now-dead T1-only G019 (T1 never reaches
    // City anymore) to T3's own City goal -- T3 "Крепость" is the first
    // chapter that actually plays this content live (docs/gdd/
    // 13_ACT_ONE_CHAPTERS.md sec.5's "G032B governance входит в условие").
    id: 'EV-CIV-04', type: 'narrative', deck: 'authored', trigger: { type: 'goal_completed', goalId: 'G032' },
    phaseWindow: { eraIds: ['CITY'] }, priority: 50, telemetryKey: 'event_governance', title: 'Кто принимает решения?',
    body: 'Город требует правила, которые переживут голос одного человека.', chronicleSummary: 'Город определил свой первый способ принимать решения.',
    choices: [
      { id: 'council', label: 'Совет', effects: [{ type: 'set_flag', flag: 'run.civ.governance', value: 'council' }] },
      { id: 'leader', label: 'Лидер', effects: [{ type: 'set_flag', flag: 'run.civ.governance', value: 'leader' }] },
      { id: 'merchants', label: 'Торговцы', effects: [{ type: 'set_flag', flag: 'run.civ.governance', value: 'merchants' }] },
    ],
  },
  {
    // NOT retargeted to T4 (considered it, like EV-CIV-04 for T3): the
    // pre-existing "fullRouteEngine" regression test in tests/domain/
    // spec.js still exercises the old single-run-to-Ash route through
    // G021 (that route stands in for the future T5, not dead) --
    // retargeting this one would have orphaned that test. T4's own
    // automation-risk flavor moment is EV-CIV-07 below instead.
    id: 'EV-CIV-06', type: 'crisis', deck: 'authored', trigger: { type: 'goal_completed', goalId: 'G021' },
    phaseWindow: { eraIds: ['INDUSTRY'] }, priority: 70, telemetryKey: 'event_energy_path', title: 'Энергетический выбор',
    body: 'Новая инфраструктура требует больше энергии, чем прежний мир умеет давать без последствий.', chronicleSummary: 'Индустриальная цивилизация выбрала свой энергетический профиль.',
    choices: [
      { id: 'fossil', label: 'Форсировать индустрию', effects: [{ type: 'set_flag', flag: 'run.energy.path', value: 'fossil' }] },
      { id: 'clean', label: 'Начать чистую программу', effects: [{ type: 'set_flag', flag: 'run.energy.path', value: 'clean' }] },
      { id: 'atomic', label: 'Ускорить атомные исследования', effects: [{ type: 'set_flag', flag: 'run.energy.path', value: 'early_atomic' }] },
    ],
  },
  {
    id: 'EV-NAR-02', type: 'anomaly', deck: 'authored', trigger: { type: 'goal_completed', goalId: 'G022' },
    phaseWindow: { eraIds: ['MODERN'] }, priority: 65, telemetryKey: 'event_error17', title: 'ERROR 17',
    body: 'Прогноз завершения цикла: доступен.\n\nERROR 17', chronicleSummary: 'Глобальная система показала невозможный прогноз завершения цикла.',
    choices: [{ id: 'record', label: 'Зафиксировать', effects: [{ type: 'set_flag', flag: 'run.anomaly.error17_active', value: true }, { type: 'set_meta_flag', flag: 'meta.anomaly.error17_seen', value: true }] }],
  },
  {
    id: 'EV-NAR-03', type: 'anomaly', deck: 'authored', trigger: { type: 'goal_completed', goalId: 'G023' },
    phaseWindow: { eraIds: ['ATOMIC'] }, priority: 85, telemetryKey: 'event_again', title: 'Снова.',
    body: 'Событие зарегистрировано.', chronicleSummary: 'Архив зарегистрировал атомный переход дважды.',
    choices: [{ id: 'continue', label: 'Продолжить', effects: [{ type: 'set_flag', flag: 'run.anomaly.again_seen', value: true }, { type: 'set_meta_flag', flag: 'meta.archive.heard_again', value: true }] }],
  },
  {
    id: 'EV-CR-01', type: 'crisis', deck: 'crisis', trigger: { type: 'crisis_phase', phase: 'C1' },
    phaseWindow: { eraIds: ['ATOMIC'] }, priority: 95, telemetryKey: 'event_bloc_conflict', title: 'Конфликт блоков',
    body: 'Две коалиции требуют несовместимых условий безопасности. Военные системы переведены в повышенную готовность.', chronicleSummary: 'Мир ответил на первый кризисный конфликт.',
    choices: [
      { id: 'deescalate', label: 'Деэскалация', effects: [{ type: 'set_flag', flag: 'run.crisis.bloc_choice', value: 'deescalate' }, { type: 'adjust_crisis_stability', amount: 9 }] },
      { id: 'sanctions', label: 'Санкции', effects: [{ type: 'set_flag', flag: 'run.crisis.bloc_choice', value: 'sanctions' }, { type: 'adjust_crisis_stability', amount: 2 }] },
      { id: 'force', label: 'Демонстрация силы', effects: [{ type: 'set_flag', flag: 'run.crisis.bloc_choice', value: 'force' }, { type: 'adjust_crisis_stability', amount: -7 }] },
    ],
  },
  {
    id: 'EV-CR-02', type: 'crisis', deck: 'crisis', trigger: { type: 'crisis_phase', phase: 'C2' },
    phaseWindow: { eraIds: ['ATOMIC'] }, priority: 96, telemetryKey: 'event_false_warning', title: 'Предупреждение',
    body: 'Система раннего предупреждения фиксирует атаку. Подтверждение из независимых источников отсутствует.', chronicleSummary: 'Мир выбрал, как ответить на неподтверждённое предупреждение.',
    choices: [
      { id: 'trust_automation', label: 'Довериться автоматике', effects: [{ type: 'set_flag', flag: 'run.crisis.warning_choice', value: 'trust_automation' }, { type: 'adjust_crisis_stability', amount: -6 }] },
      { id: 'manual_verify', label: 'Ручная проверка', effects: [{ type: 'set_flag', flag: 'run.crisis.warning_choice', value: 'manual_verify' }, { type: 'adjust_crisis_stability', amount: 6 }] },
    ],
  },
  {
    id: 'EV-CR-03', type: 'ending', deck: 'crisis', trigger: { type: 'crisis_phase', phase: 'C4' },
    phaseWindow: { eraIds: ['ATOMIC'] }, priority: 100, telemetryKey: 'event_last_protocol', title: 'ПОСЛЕДНИЙ ПРОТОКОЛ',
    body: 'Несколько систем требуют окончательного решения. Полной информации нет. Времени на новый цикл проверки не осталось.', chronicleSummary: 'Последний протокол был подтверждён.',
    choices: [
      { id: 'retaliate', label: 'Ответить ударом', effects: [{ type: 'set_flag', flag: 'run.crisis.last_protocol', value: 'retaliate' }, { type: 'complete_ending', endingId: 'ENDING_ASH', subtype: 'ash_fire' }] },
      { id: 'disarm', label: 'Попытаться разоружить систему', effects: [{ type: 'set_flag', flag: 'run.crisis.last_protocol', value: 'disarm' }, { type: 'complete_ending', endingId: 'ENDING_ASH', subtype: 'ash_too_late' }] },
      { id: 'delegate_system', label: 'Передать решение системе', effects: [{ type: 'set_flag', flag: 'run.crisis.last_protocol', value: 'delegate_system' }, { type: 'complete_ending', endingId: 'ENDING_ASH', subtype: 'ash_system' }] },
    ],
  },
];
