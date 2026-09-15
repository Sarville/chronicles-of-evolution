# Хроники Эволюции — события, выборы и narrative flags первых 120 минут

**Документ:** DS-02 / 08_EVENTS_AND_CHOICES  
**Версия:** 1.0  
**Область:** Timeline #1  
**Статус:** implementation specification

---

# 1. Назначение

Документ описывает обязательные события и выборы первого прохождения:

- когда событие запускается;
- блокирует ли оно core progression;
- какие варианты видит игрок;
- какой немедленный gameplay effect уже определён исходными документами;
- какие narrative/path flags записываются;
- что показывается в Chronicle;
- какие последствия остаются только hook для будущих timelines.

События не должны превращать incremental-игру в визуальную новеллу. Большинство решений укладывается в одну карточку с 2–3 вариантами.

---

# 2. Источники и правила детализации

Используются:

- сценарный план — основной источник narrative events и формулировок;
- GDD первых 2 часов — основной источник sequencing первого run;
- evolution tree — источник branch IDs и экономических effects;
- экономика первых 120 минут — источник timing и кризисной модели.

## 2.1. Где исходники не задают точные числа

Исходные документы задают не все численные последствия сюжетных выборов. Чтобы не подменять утверждённую экономику новой, DS-02 вводит два класса параметров:

### A. Source-defined gameplay effects

Используются буквально там, где эффект уже задан деревом/экономикой/GDD.

Пример:

- `C01B Хемосинтез` — дешёвая инфраструктура/offline identity;
- `Council` — Knowledge/Cooperation bias;
- `Fossil industry` — быстрый Energy + Pollution;
- `Emergency Coordination` — Stability +18 один раз.

### B. DS-02 path scores

Это **новая implementation convention**, которой нет в исходниках в числовом виде.

Она нужна, чтобы системно записывать решения без изменения экономики Timeline #1.

```text
nature       [-10..+10]
industry     [-10..+10]
freedom      [-10..+10]
control      [-10..+10]
cooperation  [-10..+10]
dominance    [-10..+10]
biology      [-10..+10]
machines     [-10..+10]
preservation [-10..+10]
expansion    [-10..+10]
```

В Timeline #1 эти score:

- влияют на Chronicle summary;
- выбирают несколько визуальных variants;
- меняют crisis flavor/epitaph;
- **не должны ломать 120-минутную экономику**.

Числа ниже для path score — DS-02 implementation defaults и должны храниться в config.

---

# 3. Типы событий

## 3.1. `branch`

Выбор node дерева развития. Может блокировать следующий core goal.

## 3.2. `narrative`

Сюжетный выбор. Обычно экономика продолжает тикать.

## 3.3. `milestone`

Короткое событие без выбора.

## 3.4. `crisis`

Решение в финальном состоянии. Может изменять Stability, score и ending subtype.

## 3.5. `anomaly`

Mystery hook Архива. Может открыть persistent story quest.

---

# 4. Event state machine

```text
hidden
→ armed
→ queued
→ shown
→ choice_pending
→ resolved
→ archived
```

Дополнительно:

- `deferred` — событие разрешено, но UI занят milestone/другим blocking event;
- `expired` — только для необязательных side-events;
- `persistent_open` — story quest, который невозможно завершить в текущем timeline.

## 4.1. Priority

Если одновременно срабатывают несколько событий:

```text
ending/crisis
> blocking branch
> milestone
> required narrative
> anomaly
> side event
```

Нельзя показывать две modal-choice карточки одновременно.

---

# 5. Flag namespaces

## 5.1. Run flags

Сбрасываются после reset, но копируются в Chronicle record текущей Timeline.

```text
run.bio.*
run.civ.*
run.energy.*
run.crisis.*
run.anomaly.*
```

## 5.2. Chronicle flags

Сохраняются как историческая запись.

```text
chronicle.timeline_001.*
```

## 5.3. Meta narrative flags

Сохраняются между timelines и используются для долгого сюжета.

```text
meta.archive.*
meta.anomaly.*
meta.endings.*
```

Timeline #1 должен создавать минимум следующие persistent flags:

```text
meta.archive.first_life_created
meta.archive.first_sapience
meta.archive.first_atomic_age
meta.archive.heard_again
meta.endings.ash_seen
meta.archive.first_reset
```

Дополнительные anomaly flags зависят от выбора игрока.

---

# 6. Сводная последовательность событий

| ID | Окно | Тип | Trigger |
|---|---:|---|---|
| EV-BIO-01 | ~10 мин | branch | G005 complete |
| EV-BIO-02 | ~26 мин | branch | G009 complete |
| EV-BIO-03 | ~41 мин | branch | G012 complete |
| EV-CIV-01 | ~46 мин | branch | G013 complete |
| EV-CIV-02 | ~56 мин | narrative | G015 complete |
| EV-CIV-03 | ~62 мин | branch | G016 complete |
| EV-NAR-01 | ~68–74 мин | anomaly | G017 complete |
| EV-CIV-04 | ~80 мин | narrative | G019 complete |
| EV-CIV-05 | ~80–87 мин | branch | EV-CIV-04 resolved |
| EV-CIV-06 | ~94 мин | narrative/branch | G021 complete |
| EV-CIV-07 | ~94–101 мин | branch | industrial prerequisites |
| EV-NAR-02 | ~101 мин | anomaly | G022 complete |
| EV-NAR-03 | ~108 мин | milestone/anomaly | G023 complete |
| EV-CR-01 | ~110–113 мин | crisis | crisis phase 1 |
| EV-CR-02 | ~113–116 мин | crisis | crisis phase 2 |
| EV-CR-03 | ending | crisis | Ash trigger armed |

---

# 7. EV-BIO-01 — Метаболический путь

**Тип:** blocking branch  
**Trigger:** после G005 `Протоклетка`  
**Blocks:** G006  
**Tree group:** `C01A / C01B / C01C`

## Context

Жизнь научилась удерживать внутреннюю среду. Теперь ей нужен устойчивый способ получать энергию.

## Choice A — Фотосинтез

**Node:** `C01A`

Source-defined identity:

- passive Energy ×1.45;
- Biomass ×1.10;
- спокойный устойчивый idle-путь.

### Preview

> **Фотосинтез**  
> Стабильный пассивный поток энергии. Медленнее burst-развитие, выше устойчивость.

### Flags

```text
run.bio.metabolism = "photosynthesis"
run.bio.photosynthesis = true
```

### DS-02 path score

```text
nature +2
preservation +1
```

## Choice B — Хемосинтез

**Node:** `C01B`

Source-defined identity:

- Energy generator cost −12%;
- стабильный offline income;
- tutorial-recommended path в evolution tree.

### Flags

```text
run.bio.metabolism = "chemosynthesis"
run.bio.chemosynthesis = true
```

### DS-02 path score

```text
biology +1
preservation +1
```

## Choice C — Поглощение

**Node:** `C01C`

Source-defined identity:

- Biomass ×1.35;
- Energy сильнее зависит от Biomass;
- быстрый активный рост, выше риск starvation/event penalties.

### Flags

```text
run.bio.metabolism = "absorption"
run.bio.absorption = true
```

### DS-02 path score

```text
dominance +2
expansion +1
```

## Chronicle

Записывается как первая страница эволюционного профиля.

---

# 8. EV-BIO-02 — Архитектура организма

**Тип:** blocking branch  
**Trigger:** G009 `Многоклеточность`  
**Blocks:** G010  
**Tree group:** `B01A/B/C`

## Choice A — Панцирь / защита

Source-defined effect:

- event loss −35%;
- Biomass +10%.

Flags:

```text
run.bio.body = "protection"
```

DS-02 scores:

```text
preservation +2
```

Visual direction:

- плотная оболочка;
- более тяжёлая форма;
- defensive silhouette.

## Choice B — Подвижность

Source-defined effect:

- Energy ×1.20;
- mobility events.

Flags:

```text
run.bio.body = "mobility"
```

DS-02 scores:

```text
expansion +2
```

Visual direction:

- выраженные конечности/жгутики/двигательные структуры.

## Choice C — Чувствительность

Source-defined effect:

- Information ×1.28.

Flags:

```text
run.bio.body = "sensitivity"
```

DS-02 scores:

```text
cooperation +1
preservation +1
```

Visual direction:

- сенсорные органы;
- более «наблюдающий» силуэт.

---

# 9. EV-BIO-03 — Поведенческая стратегия

**Тип:** blocking branch  
**Trigger:** после G012 `Нервная сеть`  
**Blocks:** путь к G013  
**Tree group:** `N01A/B/C`

## Choice A — Одиночная специализация

Source-defined effect:

- индивидуальные systems ×1.18.

Flags:

```text
run.bio.behavior = "solitary"
```

DS-02 scores:

```text
dominance +1
freedom +1
```

## Choice B — Социальная координация

Source-defined effect:

- global production ×1.12;
- усиливает будущий population growth.

Flags:

```text
run.bio.behavior = "social"
```

DS-02 scores:

```text
cooperation +2
```

Tutorial highlight: **да**, как рекомендованный first-run route из evolution tree.

## Choice C — Манипуляция объектами

Source-defined effect:

- Information ×1.15;
- civilization Materials start +20%.

Flags:

```text
run.bio.behavior = "tool_use"
```

DS-02 scores:

```text
industry +1
expansion +1
```

---

# 10. Micro-events поведения

Сценарный план/GDD упоминают события `Опасность` и `Другой`, но не задают полную таблицу последствий.

DS-02 не делает их обязательными экономическими событиями. Они реализуются как короткие flavor micro-events между G012 и G013.

## EV-FLAVOR-01 — Опасность

Варианты:

- убежать;
- напасть.

Effects: только path score + небольшая Chronicle строка.

Default DS-02:

```text
run: dominance +1
flee: preservation +1
```

## EV-FLAVOR-02 — Другой

Варианты:

- сотрудничество;
- конфликт.

Default DS-02:

```text
cooperate: cooperation +1
conflict: dominance +1
```

### Rule

Если игрок быстро проходит этап, эти flavor events можно показать не оба. Ни один не блокирует Sapience.

---

# 11. EV-CIV-01 — Первая культурная традиция

**Тип:** blocking branch  
**Trigger:** после MS03 `Разум пробудился`  
**Tree group:** `T01A/B/C`  
**Blocks:** полноценный путь к G014

## A — Охотничья традиция

Source-defined effect:

- Forager ×1.35;
- быстрее первые минуты цивилизации.

Flags:

```text
run.civ.tradition = "hunting"
```

DS-02 scores:

```text
dominance +1
expansion +1
```

## B — Собирательная сеть

Source-defined effect:

- Food/Materials +15%.

Flags:

```text
run.civ.tradition = "gathering_network"
```

DS-02 scores:

```text
cooperation +1
preservation +1
```

## C — Ритуал знания

Source-defined effect:

- Knowledge +25%;
- слабее ранний Food.

Flags:

```text
run.civ.tradition = "knowledge_ritual"
```

DS-02 scores:

```text
cooperation +1
preservation +1
```

Tutorial highlight: **да**, соответствует recommended first-run route дерева.

---

# 12. EV-CIV-02 — Как делить добычу

**Тип:** narrative choice  
**Trigger:** после G015 `Племя`  
**Source:** GDD — первое цивилизационное решение

## Context

Племя стало достаточно большим, чтобы распределение ресурсов превратилось из личного действия в правило общества.

## A — Делить добычу

Source-defined direction:

- Cooperation;
- population stability.

### Preview

> **Делить добычу**  
> Более устойчивое племя. Усиливает кооперативный путь.

### Flags

```text
run.civ.distribution = "share"
```

### DS-02 scores

```text
cooperation +2
freedom +1
```

## B — Лучшие получают больше

Source-defined direction:

- production;
- control score.

### Preview

> **Лучшие получают больше**  
> Сильнее производство. Общество становится более иерархичным.

### Flags

```text
run.civ.distribution = "merit_elite"
```

### DS-02 scores

```text
control +2
dominance +1
```

## Numeric economy effect

Исходные документы не задают точные проценты для этого narrative choice. DS-02 **не добавляет новый постоянный multiplier**. Экономический эффект в Timeline #1 выражается через path/visual/crisis profile, чтобы не конфликтовать с утверждённым балансом.

---

# 13. EV-CIV-03 — Специализация поселения

**Тип:** blocking branch  
**Trigger:** после G016 `Agriculture`  
**Tree group:** `S01A/B/C`  
**Blocks:** S02 / G017

## A — Ирригация

Source-defined:

- Farmer ×1.25.

Flags:

```text
run.civ.settlement_specialization = "irrigation"
```

Scores:

```text
nature +1
preservation +1
```

## B — Каменная кладка

Source-defined:

- building base cost −10%.

Flags:

```text
run.civ.settlement_specialization = "masonry"
```

Scores:

```text
industry +1
control +1
```

## C — Обмен

Source-defined:

- F/M ×1.12;
- Market дешевле 20%.

Flags:

```text
run.civ.settlement_specialization = "exchange"
```

Scores:

```text
cooperation +1
expansion +1
```

Tutorial highlight: **Exchange**, согласно recommended first-run path дерева.

---

# 14. EV-NAR-01 — Следы до нас

**Тип:** anomaly narrative event  
**Trigger:** после G017 `Постоянное поселение`, до G018  
**Blocking:** кратко блокирует только narrative queue; экономика может продолжать тикать  
**Source:** GDD + scenario plan

## Context

Во время строительства найден искусственный предмет, который не соответствует возрасту мира.

## A — Исследовать

Source-defined:

- +Knowledge;
- Archive anomaly flag.

### Flags

```text
run.anomaly.traces_choice = "study"
run.anomaly.traces_detected = true
meta.anomaly.first_trace_seen = true
meta.anomaly.first_trace_studied = true
```

### Reward

Исходник не задаёт точную величину Knowledge. Чтобы не вмешиваться в balance v1.0, значение должно быть небольшим configurable burst и не должно сокращать путь к Writing более чем примерно на одну типичную покупку production.

### Chronicle

> Объект не соответствовал возрасту слоя. Цивилизация решила сохранить данные исследования.

## B — Разобрать

Source-defined:

- +Materials;
- artifact lost.

Flags:

```text
run.anomaly.traces_choice = "dismantle"
run.anomaly.artifact_destroyed = true
meta.anomaly.first_trace_seen = true
```

Future consequence:

- secret chain в этой Timeline закрыта;
- Chronicle фиксирует потерю.

## C — Сохранить

Source-defined:

- открывает будущий secret quest.

Flags:

```text
run.anomaly.traces_choice = "preserve"
run.anomaly.artifact_preserved = true
meta.anomaly.first_trace_seen = true
meta.anomaly.artifact_preserved_any_timeline = true
```

Scores:

```text
preservation +2
```

### UI hook

После выбора появляется маленькая locked Chronicle thread с названием `До нас` и статусом `Продолжение недоступно в этой Timeline`.

---

# 15. EV-CIV-04 — Кто принимает решения?

**Тип:** narrative choice  
**Trigger:** после G019 `City`  
**Source:** GDD government-lite

Это не полная government system. В Timeline #1 событие задаёт общественный профиль.

## A — Совет

Source-defined direction:

- Knowledge;
- Cooperation.

Flags:

```text
run.civ.governance = "council"
```

Scores:

```text
cooperation +2
freedom +1
```

## B — Вождь

Source-defined direction:

- Production;
- Control.

Flags:

```text
run.civ.governance = "leader"
```

Scores:

```text
control +2
dominance +1
```

## C — Купцы

Source-defined direction:

- Trade;
- Materials.

Flags:

```text
run.civ.governance = "merchants"
```

Scores:

```text
expansion +2
freedom +1
```

## Economy rule

Точные multipliers для government-lite отсутствуют в утверждённой balance table. В Timeline #1 это profile choice без нового скрытого постоянного экономического бонуса. Будущая полноценная government system может использовать этот flag.

---

# 16. EV-CIV-05 — Городская специализация

**Тип:** blocking branch  
**Trigger:** после EV-CIV-04  
**Tree group:** `I01A/B/C`

## A — Производственный город

Source-defined:

- Materials ×1.25.

Flag:

```text
run.civ.city_specialization = "production"
```

Scores:

```text
industry +2
```

## B — Академический город

Source-defined:

- Knowledge ×1.30.

Flag:

```text
run.civ.city_specialization = "science"
```

Scores:

```text
cooperation +1
preservation +1
```

Tutorial highlight: да.

## C — Энергетический город

Source-defined:

- Power ×1.30.

Flag:

```text
run.civ.city_specialization = "energy"
```

Scores:

```text
industry +1
expansion +1
```

---

# 17. EV-CIV-06 — Энергетический кризис

**Тип:** major narrative choice  
**Trigger:** после G021 `Industry`  
**Source:** GDD + scenario plan

## Context

Рост города опережает доступную энергетическую инфраструктуру.

Выбор должен менять skyline и profile цивилизации.

## A — Ископаемая индустрия

Source-defined:

- +40% Energy immediately;
- Industry score;
- Pollution.

### Flags

```text
run.energy.path = "fossil"
run.energy.pollution = true
```

### Scores

```text
industry +3
nature -2
expansion +1
```

### Visual

- больше дыма;
- трубы;
- более тёмная атмосфера.

### Crisis contribution

Сценарные документы указывают Pollution как фактор World Tension. Точный numeric contribution не задан. В Timeline #1 использовать configurable `risk_tag: pollution`, а не жёстко зашитое число в event UI.

## B — Программа чистой энергии

Source-defined:

- +20% Energy;
- Nature score;
- clean-tech quest.

Flags:

```text
run.energy.path = "clean"
run.energy.clean_program = true
```

Scores:

```text
nature +3
preservation +2
```

Visual:

- меньше дыма;
- светлая/зелёная инфраструктура.

## C — Атомные исследования

Source-defined:

- +30% Knowledge;
- быстрее будущий Atomic;
- Filter Risk.

Flags:

```text
run.energy.path = "early_atomic"
run.energy.early_atomic = true
run.crisis.atomic_risk_bias = true
```

Scores:

```text
industry +2
machines +1
```

Visual:

- research complex / experimental energy landmark.

## Balance note

GDD задаёт эффекты как +20/+30/+40%, но economy v1.0 не содержит отдельной строки этих modifiers. Поэтому при реализации их нужно либо:

1. формально включить в balance config и пересчитать milestone corridor; либо
2. трактовать как временный chapter modifier.

DS-02 рекомендует вариант 2 для vertical slice: modifier действует до Atomic Age и должен быть включён в simulation tests. Нельзя добавить его в код без повторной sanity-check симуляции 94–108 минут.

---

# 18. EV-CIV-07 — Предатомная специализация

**Тип:** blocking tech branch  
**Окно:** после Industry, до G022/G023  
**Tree group:** `A01A/B/C`

Это технологическая специализация, отдельная от сюжетного Energy Crisis.

## A — Электрификация

Source-defined:

- Power ×1.28.

Flag:

```text
run.civ.preatomic_specialization = "electrification"
```

## B — Научные институты

Source-defined:

- Knowledge ×1.30.

Flag:

```text
run.civ.preatomic_specialization = "institutes"
```

Tutorial highlight: да.

## C — Массовая логистика

Source-defined:

- Materials ×1.25.

Flag:

```text
run.civ.preatomic_specialization = "logistics"
```

### Important

EV-CIV-06 и EV-CIV-07 — разные сущности. UI не должен показывать их одной трёхкнопочной карточкой.

---

# 19. EV-NAR-02 — Ошибка 17

**Тип:** anomaly / persistent story quest  
**Trigger:** G022 complete, до Atomic Age  
**Source:** GDD + scenario

## Sequence

1. Archive line:

> Прогноз завершения цикла: доступен.

2. Immediately:

> ERROR 17

3. Через несколько секунд строка исчезает.

4. Открывается story quest:

> **Ошибка 17**  
> Найдите источник повреждённых данных.

## Rule

Quest **невозможно полностью завершить в Timeline #1**.

## Flags

```text
run.anomaly.error17_seen = true
meta.anomaly.error17_seen = true
meta.archive.prediction_leak_seen = true
```

## UI

Quest находится в Story slot и не занимает обычный side quest slot.

После ending она не помечается failed. Chronicle говорит:

> Источник ошибки не найден до завершения Timeline.

---

# 20. EV-NAR-03 — «Снова»

**Тип:** milestone anomaly  
**Trigger:** G023 / Atomic Age  
**Source:** GDD + scenario

## Sequence

1. `MS07 МЫ РАСКОЛОЛИ МАТЕРИЮ`.
2. Archive:

> «Снова.»

3. Пауза примерно 1.5 секунды.
4. Коррекция:

> «Событие зарегистрировано.»

## Flags

```text
run.anomaly.archive_said_again = true
meta.archive.heard_again = true
```

## Rule

Не объяснять фразу в Timeline #1.

Chronicle сохраняет её как системную аномалию.

---

# 21. World Tension vs Stability

GDD/сценарий описывают UI `НАПРЯЖЕНИЕ МИРА 0–100`, а economy v1.0 использует `Stability 100→0`.

DS-02 фиксирует одно implementation state:

```text
stability: 0..100
world_tension = 100 - stability
```

## UI

Игроку показываем:

> **НАПРЯЖЕНИЕ МИРА**

0 = спокойно, 100 = критично.

В коде и balance formula используется Stability.

Это позволяет сохранить и narrative language, и экономическую формулу без двух независимых шкал.

---

# 22. Crisis factors

Источники называют факторы:

- control;
- dominance;
- pollution;
- atomic choice;
- shortages.

В economy v1.0 формула:

```text
stability_drain/sec = 0.08 + atomic_load × 0.025 + unresolved_crises × 0.045
```

DS-02 mapping:

- ранние path scores не меняют базовую формулу напрямую в Timeline #1;
- они выбирают flavor/initial crisis tags;
- `pollution`, `early_atomic`, risky atomic upgrades могут увеличивать `atomic_load` или `unresolved_crises` только через конфиг кризиса;
- shortage создаёт временный unresolved crisis, если сохранится дольше заданного threshold.

Точный mapping score→drain отсутствует в исходных документах и должен быть настроен в отдельном crisis balance pass. Нельзя скрыто выводить drain непосредственно из всех path scores в v1.0.

---

# 23. EV-CR-01 — Конфликт двух блоков

**Тип:** crisis choice  
**Trigger:** после старта crisis phase, ориентир 1:50–1:55 по раннему GDD; в актуальной шкале — после Atomic Age внутри 108–116 минут  
**Source:** GDD

## Context

Два глобальных блока входят в опасную фазу конфликта.

## A — Уступить

Source meaning: diplomacy/de-escalation.

Flags:

```text
run.crisis.block_conflict = "concede"
```

DS-02 scores:

```text
cooperation +1
```

Crisis result:

- не добавлять escalation tag;
- Chronicle: попытка снизить напряжение.

## B — Санкции

Flags:

```text
run.crisis.block_conflict = "sanctions"
```

DS-02:

```text
control +1
```

Crisis result:

- `unresolved_crises` может остаться активным;
- точная numeric duration — config.

## C — Силовая демонстрация

Flags:

```text
run.crisis.block_conflict = "force"
run.crisis.escalation = true
```

Scores:

```text
dominance +2
control +1
```

Crisis result:

- escalation tag;
- более жёсткий ending epitaph/visual variant;
- первый ending всё равно остаётся «Пеплом».

---

# 24. EV-CR-02 — Ложная тревога

**Тип:** crisis choice  
**Trigger:** после EV-CR-01, до final protocol  
**Source:** GDD

## Context

Автоматическая система раннего предупреждения фиксирует атаку. Подтверждение неполное.

## A — Доверять системе

Flags:

```text
run.crisis.false_alarm = "trust_system"
run.crisis.automation_trust = true
```

Scores:

```text
machines +1
control +1
```

Consequence:

- повышает escalation flavor;
- усиливает synthetic-route teaser.

## B — Ручная проверка

Flags:

```text
run.crisis.false_alarm = "manual_verify"
```

Scores:

```text
preservation +1
```

Consequence:

- crisis откладывается/смягчается в пределах допустимого clamp;
- может увеличить crisis reward/Chronicle evaluation.

## Source limitation

GDD не задаёт третьего варианта и точного Stability effect. DS-02 не добавляет третий выбор.

---

# 25. Atomic crisis nodes

Во время кризиса игрок может покупать узлы X01/X02 из дерева.

## X01A Reactor Prototype

Flags:

```text
run.crisis.reactor_prototype = true
chronicle.tags += atomic_mastery
```

Effect:

- PWR ×1.65;
- Stability drain ↑ через atomic_load.

## X02A Distributed Grid

Flag:

```text
run.crisis.distributed_grid = true
chronicle.tags += grid_resilience
```

Effect:

- PWR ×1.35;
- drain −0.02/s по evolution tree.

## X01B Global Science Network

```text
chronicle.tags += shared_science
```

K ×1.35.

## X02B Risk Forecasting

```text
chronicle.tags += foresight
```

Показывает причины Stability drain.

## X01C Strategic Atom

```text
chronicle.tags += deterrence
```

M/K ×1.15; drain ↑.

## X02C Central Coordination

```text
chronicle.tags += coordination
```

Stability +18 один раз.

Эти choices не отменяют Ash в Timeline #1.

---

# 26. EV-CR-03 — Последний протокол

**Тип:** final crisis choice  
**Trigger:** `time_since_atomic >= 435 sec` ИЛИ Stability приближается к ending threshold, но до фактической белой вспышки  
**Source:** GDD

Это последняя player agency перед convergent ending.

## A — Ответный удар

Ending subtype:

```text
ash_fire
```

Flags:

```text
run.crisis.last_protocol = "retaliate"
run.crisis.ending_subtype = "fire"
```

Chronicle title variant:

> Пепел — Огонь

Scores:

```text
dominance +2
```

## B — Попытка отключить оружие

Ending subtype:

```text
ash_too_late
```

Flags:

```text
run.crisis.last_protocol = "disarm"
run.crisis.ending_subtype = "too_late"
```

Chronicle title variant:

> Пепел — Слишком поздно

Scores:

```text
preservation +2
cooperation +1
```

## C — Передать контроль системе

Ending subtype:

```text
ash_system
```

Flags:

```text
run.crisis.last_protocol = "delegate_system"
run.crisis.ending_subtype = "system"
meta.archive.synthetic_route_teased = true
```

Chronicle title variant:

> Пепел — Последний оператор

Scores:

```text
machines +2
control +1
```

Teaser:

- synthetic route;
- будущая machine-life ветвь.

## Hard rule

Все три выбора Timeline #1 сходятся в ending `ПЕПЕЛ`.

Игрок должен понимать, что выбор не был «фальшивым»: он меняет Chronicle, flags, reward evaluation и будущие hooks, но первый tutorial ending остаётся общим.

---

# 27. Choice preview rules

Игрок видит основные последствия **до нажатия**.

Пример:

```text
Фотосинтез
+ стабильный пассивный Energy
+ Biomass
```

Можно скрывать только:

- долгосрочный story flag;
- secret quest;
- late-game route;
- точную crisis implication.

Нельзя скрывать:

- явный экономический штраф;
- потерю уникального объекта;
- необратимость branch выбора текущей Timeline.

Для необратимых выборов:

> Выбор действует до конца текущей Timeline.

---

# 28. Modal vs non-modal

## Blocking modal

Использовать только для:

- EV-BIO-01/02/03;
- EV-CIV-01/03/05/07;
- EV-CR-03.

## Soft modal / card

- EV-CIV-02;
- EV-NAR-01;
- EV-CIV-04;
- EV-CIV-06;
- EV-CR-01/02.

Экономика может тикать под soft modal, если это не ломает последовательность.

## Toast/system line

- EV-NAR-02;
- EV-NAR-03.

---

# 29. Chronicle event records

Каждое major event создаёт record:

```json
{
  "event_id": "EV-NAR-01",
  "timeline": 1,
  "choice": "preserve",
  "elapsed_sec": 4140,
  "era": "settlement",
  "path_snapshot": {
    "cooperation": 3,
    "dominance": 1,
    "nature": 2,
    "industry": 0
  },
  "tags": ["anomaly", "artifact_preserved"]
}
```

Chronicle UI не обязан показывать numeric path scores.

---

# 30. Dominant path calculation

DS-02 implementation proposal:

После ending вычисляется profile по наиболее выраженным осям.

Примеры из scenario plan:

- `Хранители` — Nature + Cooperation;
- `Технократы` — Industry + Control;
- `Торговая сеть` — Cooperation + Expansion;
- `Империя` — Dominance + Control;
- `Синтетический путь` — Machines + tech flags;
- `Вознесение` — future path, в Timeline #1 только teaser.

## Rule Timeline #1

Profile — descriptive label, **не отдельный ending**.

Если scores близки, использовать `Смешанный путь` или наиболее выраженную историческую пару. Не придумывать преимущество из одного случайного клика.

---

# 31. Visual consequences

Исходный сценарий требует, чтобы выборы были видны в диораме.

Минимум Timeline #1:

- metabolism/body choice меняет creature art;
- Nature/Industry bias меняет зелень/дым;
- EV-CIV-06 меняет industrial skyline;
- pollution tag меняет атмосферу;
- crisis escalation меняет интенсивность сирен/военных элементов;
- final protocol влияет на финальный cinematic variant.

Полная threshold-система визуальных осей должна быть вынесена в art/diorama specification.

---

# 32. Event data model

```json
{
  "id": "EV-CIV-06",
  "type": "narrative_choice",
  "trigger": {
    "goal_completed": "G021"
  },
  "blocking": false,
  "choices": [
    {
      "id": "fossil",
      "title": "Ископаемая индустрия",
      "preview": ["Energy +40%", "Pollution"],
      "set_flags": {
        "run.energy.path": "fossil",
        "run.energy.pollution": true
      },
      "path_delta": {
        "industry": 3,
        "nature": -2
      },
      "effects": [
        {"effect_id": "energy_crisis_fossil"}
      ]
    }
  ],
  "chronicle": true,
  "telemetry": true
}
```

Экономические эффекты должны ссылаться на отдельные effect IDs в balance config, а не содержать произвольную математику внутри UI event object.

---

# 33. Analytics

События:

```text
event_armed
event_shown
event_choice_selected
event_resolved
story_quest_opened
story_quest_persisted
path_profile_updated
```

Параметры:

```text
event_id
choice_id
timeline
elapsed_sec
chapter
current_goal
path_scores_before
path_scores_after
stability
resource_snapshot
```

Для EV-CIV-06, EV-NAR-01, EV-CR-01/02/03 отдельно анализировать:

- choice distribution;
- completion/abandon after choice;
- relation to ending subtype;
- relation to reset acceptance.

---

# 34. Acceptance criteria DS-02 / Events

Документ считается реализованным, если:

- все обязательные branch choices имеют trigger и block target;
- ни одно событие не изменяет тайминг экономики неучтённым hidden multiplier;
- `Следы до нас`, `Ошибка 17` и «Снова» создают persistent mystery chain;
- government-lite не притворяется полноценной government system;
- Energy Crisis и pre-atomic specialization реализованы как два разных решения;
- World Tension является UI-представлением `100 - Stability`, а не второй независимой шкалой;
- первый run всегда может завершиться без чтения lore;
- три final protocol choices дают разные flags/subtypes, но сходятся в «Пепел»;
- все major choices попадают в Chronicle;
- path scores хранятся в config/data и не зашиваются в presentation layer;
- будущие последствия, отсутствующие в исходных документах, не выдаются игроку как уже реализованный контент.

---

# 35. Связанные документы

- `07_GOALS_AND_MILESTONES.md` — последовательность целей и milestone triggers;
- `09_ENDINGS_AND_RESET.md` — crisis sequencing, ending presentation, rewards, reset;
- `03_EVOLUTION_TREE.md` — branch effects;
- `02_ECONOMY_FIRST_120_MINUTES.md` — production/Stability balance.
