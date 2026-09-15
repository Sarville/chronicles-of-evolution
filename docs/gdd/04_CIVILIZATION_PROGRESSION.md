# Хроники Эволюции — цивилизационная progression Timeline #1

**Версия:** DS-01 revision 1.1  
**Область:** от `N06 Разум` (~46:00) до `A06 Атомный век` (~108:00).  
**Назначение:** канонический progression-каркас цивилизационной части первого Timeline.  
**Связанные документы:** `07_GOALS_AND_MILESTONES.md`, `08_EVENTS_AND_CHOICES.md`, `09_ENDINGS_AND_RESET.md`, `05_BUILDINGS_AND_JOBS.md`, `06_TECH_TREE.md`.

> Этот документ не меняет утверждённый balance v1.0. Он разделяет ранее смешанные сущности — технологии, здания, профессии, milestones и upgrades — и описывает, как они образуют один игровой flow.

---

# 1. Источники и приоритет

Для DS-03 используются следующие правила при расхождениях:

1. **Экономика первых 120 минут v1.0** — источник истины для цен, rates, population thresholds, growth factors и целевых таймингов.
2. **Evolution tree v1.0** — источник истины для node IDs, prerequisite graph, branch groups и числовых эффектов ветвей.
3. **DS-02 Goals/Events/Ending** — источник истины для Goal IDs, порядка narrative events, flags и перехода к кризису.
4. GDD/сценарный план — источник presentation, визуальных состояний, UX-смысла эпох и narrative framing.

Если параметр отсутствует во всех этих источниках, DS-03 не выдаёт его за существующее решение. Новые решения явно помечаются как **DS-03 proposal**.

---

# 2. Нормализация сущностей

В реализации используются пять разных типов сущностей.

## 2.1. Technology Node

Покупаемый узел дерева знаний/культуры.

Примеры:

- `T02 Fire`;
- `T08 Agriculture`;
- `S04 Writing`;
- `I02 Mechanization`;
- `A05 Atomic Theory`.

Technology Node:

- имеет цену;
- имеет prerequisites;
- покупается один раз в Timeline;
- открывает system/building/job/modifier;
- может быть CORE / BRANCH / OPTIONAL / CONVERGENCE.

## 2.2. Building

Повторяемый инфраструктурный объект.

Примеры:

- Shelter;
- Field;
- Workshop;
- Steam Plant;
- Research Institute.

Building:

- имеет `count`;
- покупается много раз, если в конфигурации не указано иначе;
- цена растёт по growth factor;
- производит ресурс либо усиливает jobs/system;
- может иметь представление в диораме.

## 2.3. Job

Назначение единицы Population.

Примеры:

- Forager;
- Farmer;
- Scholar;
- Engineer;
- Scientist.

Job не покупается как здание. Его capacity определяется Population и, при необходимости, unlocked system/building.

## 2.4. Upgrade

Одноразовое числовое усиление уже открытой системы, которое не является переходом эпохи.

Примеры из текущего дерева:

- `T06A Craft`;
- `T06B Oral Tradition`;
- `S03 Storage`;
- `S05A Law`;
- `S05B Accounting`;
- `I04A Standardization`;
- `I04B Mass Education`;
- `A04 Engines & Logistics`.

Технически они могут храниться в том же data registry, что и Technology Nodes, но `semantic_role = upgrade`.

## 2.5. Milestone / Era State

Не покупаемая сущность мира.

Примеры:

- `TRIBE`;
- `SETTLEMENT`;
- `CITY`;
- `INDUSTRY`;
- `ATOMIC`.

Milestone включается после выполнения convergence-node + Goal conditions и меняет:

- диораму;
- доступную resource panel;
- job set;
- navigation/UI;
- набор доступных building/tech categories;
- narrative queue.

---

# 3. Почему convergence-node и era state не одно и то же

Существующие документы называют `T05 Tribe`, `S08 City`, `I05 Industry`, `A06 Atomic Age` узлами дерева. DS-03 сохраняет эти node IDs, но трактует их как **покупаемые breakthrough/convergence nodes**, после покупки которых State Machine подтверждает переход в соответствующее состояние мира.

Пример:

```text
player buys S08 City
    ↓
validate population >= 105
    ↓
complete G019
    ↓
set era_state = CITY
    ↓
unlock Power + city jobs + city infrastructure
    ↓
play City milestone
    ↓
queue EV-CIV-04 and EV-CIV-05
```

Это предотвращает ситуацию, когда UI должен одновременно считать `City` технологией, зданием и эпохой.

---

# 4. Каноническая шкала 46–108 минут

| Окно | Era state | Goal | Breakthrough | Population target | Главный новый слой |
|---|---|---|---|---:|---|
| 46–56 | `EARLY_CIV` → `TRIBE` | G014–G015 | T02/T03 → T05 | 24 → 32 | jobs, Food/M/Knowledge |
| 56–62 | `TRIBE` | G016 | T07 → T08 | 42 | Agriculture / Farmer / Field |
| 62–68 | `SETTLEMENT_EARLY` | G017 | S01* → S02 | 58 | permanent infrastructure |
| 68–80 | `SETTLEMENT` | G018–G019 | S04 → S06 → S07 → S08 | 78 → 105 | Writing, specialization, City |
| 80–94 | `CITY` | G020–G021 | I01* → I02 → I03 → I05 | 135 → 170 | Power, mechanization |
| 94–101 | `INDUSTRY` | G022 | A01* → A02 | ~215 | modern grid + research |
| 101–108 | `INDUSTRY_LATE` | G023 | A03 → A05 → A06 | 260 | atomic theory → Atomic Age |
| 108+ | `ATOMIC` | G024 | crisis nodes X* | 260+ | Stability / World Tension |

Тайминги — targets, а не hard timers. Economy v1.0 допускает коридор до нескольких минут.

---

# 5. State Machine цивилизации

```text
BIOLOGICAL
  └─ N06 Sapience
      ↓
EARLY_CIV
  └─ T05 Tribe
      ↓
TRIBE
  └─ T08 Agriculture
      ↓
SETTLEMENT_EARLY
  └─ S02 Permanent Settlement
      ↓
SETTLEMENT
  └─ S08 City
      ↓
CITY
  └─ I05 Industry
      ↓
INDUSTRY
  └─ A06 Atomic Age
      ↓
ATOMIC
  └─ crisis / X99 Ash
      ↓
ARCHIVE_SUMMARY
```

## 5.1. Hard rule

Переход состояния происходит только через state transition service. Нельзя привязывать смену UI напрямую к наличию технологии в inventory.

Причина: позднее Archive/meta modifiers могут позволять начинать Timeline с уже известными технологиями, не перескакивая автоматически эпохи.

---

# 6. Переход N06 Sapience → EARLY_CIV

## Trigger

Покупка `N06 Разум`, completion `G013`.

## Старые ресурсы

Energy / Biomass / Information перестают быть активными spendable currencies текущей фазы.

## Стартовый пакет

Используется утверждённая формула:

```text
start_population = 18 + floor(log10(total_biomass_earned + 1) × 3)
start_food       = 120 + floor(B_stock × 0.05)
start_materials  = 70 + floor(E_stock × 0.003)
start_knowledge  = 15 + floor(I_stock × 0.02)
```

Caps:

- Population: 18–24;
- Food bonus: +120 max;
- Materials bonus: +100 max;
- Knowledge bonus: +35 max.

## UI transition

Main resources:

- Food;
- Materials;
- Knowledge;
- Population.

Biological resources уходят в history/evolution view и больше не должны конкурировать за top-bar.

## Unlocks

- Forager;
- Gatherer;
- Thinker;
- Caregiver;
- ранние tribal buildings;
- `EV-CIV-01 Первая культурная традиция`.

---

# 7. EARLY_CIV — 46–56 минут

## 7.1. Главная задача фазы

Научить игрока управлять Population как производственным ресурсом.

Игрок должен понять:

```text
Population → job allocation → resource rates → technology/building affordability
```

## 7.2. Core progression

```text
EV-CIV-01 T01A/B/C
        ↓
T02 Fire
        ↓
T03 Cooperative Hunt
        ↓
[T04 Role Division optional]
        ↓
T05 Tribe + pop 32
```

Связано с:

- G014 — Fire + Cooperative Hunt;
- G015 — Tribe.

## 7.3. Buildings

Доступный pool:

- Hearth;
- Shelter;
- Tool Bench;
- Hunting Ground;
- Story Circle;
- Clan Camp.

Точные параметры — `05_BUILDINGS_AND_JOBS.md`.

## 7.4. Jobs

- Forager;
- Gatherer;
- Thinker;
- Caregiver.

## 7.5. Resource pressure

Главный bottleneck: Knowledge при необходимости поддерживать Food surplus.

Food deficit не hard-fail:

- birth rate → 0;
- current Population не исчезает автоматически;
- Goal Engine предлагает перераспределить jobs.

## 7.6. Milestone T05

После T05:

- `era_state = TRIBE`;
- pop cap +25;
- job presets unlock;
- `EV-CIV-02 Как делить добычу`;
- milestone presentation `ПЛЕМЯ`.

---

# 8. TRIBE — 56–62 минут

## Core progression

```text
T05 Tribe
  ├─ T06A Craft [optional]
  ├─ T06B Oral Tradition [optional]
  └─ T07 Seed Selection
        ↓
     T08 Agriculture + pop 42
```

## G016

`T08 Agriculture` — convergence node G016.

После покупки:

- unlock Farmer;
- unlock Field;
- обновляется job economy;
- запускается `EV-CIV-03 Специализация поселения`;
- `era_state = SETTLEMENT_EARLY`.

## Semantic rule

`Agriculture` — Technology Node. `Field` — Building. `Farmer` — Job. `Settlement` — Era State.

Эти четыре сущности нельзя хранить как один generic unlock.

---

# 9. SETTLEMENT_EARLY — 62–68 минут

## Blocking branch

`EV-CIV-03` выбирает один `S01*`:

- Irrigation;
- Masonry;
- Exchange.

Выбор блокирует `S02` до resolution.

## G017

Переход к постоянному поселению:

```text
S01* selected
+ Population >= 58
+ afford S02
→ buy S02 Permanent Settlement
→ complete G017
```

После G017:

- `era_state = SETTLEMENT`;
- pop cap +40;
- birth ×1.10;
- диорама меняется с temporary camp на permanent houses/fields/roads;
- milestone `МЫ ОСТАЛИСЬ`;
- ставится в очередь `EV-NAR-01 Следы до нас`.

---

# 10. SETTLEMENT — 68–80 минут

## 10.1. Jobs

- Farmer;
- Builder;
- Scholar;
- Artisan.

Ранние tribal jobs заменяются/апгрейдятся presentation-wise. История назначения может сохраняться, но UI должен показывать актуальные профессии эпохи.

## 10.2. Buildings

- Field;
- House;
- Workshop;
- Granary;
- School;
- Market.

## 10.3. Core tech flow

```text
S02 Permanent Settlement
  ├─ S03 Storage [optional]
  ↓
S04 Writing
  ├─ S05A Law [optional]
  ├─ S05B Accounting [optional]
  ↓
S06 Division of Labor
  ↓
S07 Urban Planning
  ↓
S08 City + pop 105
```

## 10.4. G018 — Writing

При `S04`:

- Knowledge ×1.50;
- Chronicle становится видимым разделом;
- locked future Chronicle cards `???` показывают глубину будущего контента.

## 10.5. Recommended jobs перед City

Source-defined target:

- 42% Farmer;
- 30% Builder/Artisan;
- 23% Scholar;
- 5% Care/utility.

Это hint preset, а не обязательное условие.

## 10.6. G019 — City

Requirements:

- `S07` complete;
- Population >= 105;
- цена S08 оплачена.

После completion:

- `era_state = CITY`;
- unlock Power;
- V5 City diorama;
- jobs переходят в городской набор;
- milestone City;
- queue `EV-CIV-04 Кто принимает решения?`;
- после него — blocking `EV-CIV-05 Городская специализация`.

---

# 11. CITY — 80–94 минут

## 11.1. Новый ресурс

`Power (PWR)` появляется впервые.

Food остаётся активным, но становится supporting resource; основной выбор игрока смещается к Materials / Knowledge / Power.

## 11.2. Jobs

- Industrial Farmer;
- Miner;
- Engineer;
- Researcher.

## 11.3. Infrastructure

- Mine;
- Foundry;
- Steam Plant;
- Rail Hub;
- Laboratory.

## 11.4. Blocking specialization

После government-lite event игрок выбирает:

- I01A Production City;
- I01B Academic City;
- I01C Energy City.

Это технологическая специализация и реальный multiplier, в отличие от government-lite profile choice.

## 11.5. G020 — Mechanization

```text
I01* selected
→ I02 Mechanization
→ G020 complete
```

Target ~87:00, Population ~135.

## 11.6. G021 — Industry

Core path:

```text
I02 Mechanization
→ I03 Steam Network
→ [I04A/B optional]
→ I05 Industry + pop 170
```

После `I05`:

- `era_state = INDUSTRY`;
- industrial jobs;
- V6 Industrial diorama;
- factories/smoke/rail overlays;
- milestone `ЭПОХА МАШИН`;
- queue `EV-CIV-06 Энергетический кризис`.

---

# 12. INDUSTRY — 94–108 минут

Эта эпоха содержит два разных выбора, которые нельзя объединять.

## 12.1. Narrative energy path — EV-CIV-06

- fossil;
- clean;
- early atomic.

Это society/path decision с visual/crisis flags.

GDD задаёт +40/+20/+30% эффекты, но balance v1.0 не содержит их отдельной постоянной строки. DS-02 рекомендует временный chapter modifier до Atomic Age и обязательный simulation test.

**DS-03 hard rule:** эти проценты должны жить в отдельном `chapter_modifiers` config и не должны быть зашиты в Technology Nodes A01*.

## 12.2. Tech specialization — EV-CIV-07 / A01*

Отдельно игрок выбирает:

- A01A Electrification;
- A01B Research Institutes;
- A01C Mass Logistics.

Это реальные branch nodes evolution tree.

## 12.3. Jobs

- Mechanized Farmer;
- Industrial Worker;
- Power Engineer;
- Scientist.

## 12.4. Infrastructure

- Steelworks;
- Grid Station;
- Research Institute;
- Chemical Complex.

## 12.5. G022 — Modern grid + science base

Checklist:

- `A01*` selected;
- stable Power surplus;
- `A02 Electrical Grid` purchased;
- минимум одна активная research infrastructure line.

После G022:

- Power ×1.45;
- open A03/A05 path;
- `EV-NAR-02 Ошибка 17`.

## 12.6. Late industrial path

```text
A02 Electrical Grid
  ├─ A04 Engines & Logistics [optional]
  ↓
A03 Scientific Method
  ↓
A05 Atomic Theory
  ↓
A06 Atomic Age + pop 260
```

`A04` требует A02 и может покупаться параллельно с научной веткой, но не является prerequisite для A05.

---

# 13. ATOMIC transition — G023

## Requirements

- `A05 Atomic Theory`;
- Population >= 260;
- оплатить A06.

## On transition

```text
set era_state = ATOMIC
set stability = 100
set crisis_clock = 0
apply global production x1.35
freeze first-run offline crisis progression
```

Presentation:

- milestone `МЫ РАСКОЛОЛИ МАТЕРИЮ`;
- Archive: `Снова.` → correction;
- V7 Atomic;
- Destiny Goal → `Переживите Великий фильтр`.

Дальнейшие X-nodes и ending описаны в DS-02/09 и не дублируются как обычная цивилизационная progression.

---

# 14. Unlock matrix по эпохам

| Entity | Early Civ | Tribe | Settlement | City | Industry | Atomic |
|---|:---:|:---:|:---:|:---:|:---:|:---:|
| Food | ✓ | ✓ | ✓ | ✓ | ✓ supporting | hidden/supporting in crisis |
| Materials | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Knowledge | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Power | — | — | — | ✓ | ✓ | ✓ |
| Population | ✓ | ✓ | ✓ | ✓ | ✓ | frozen/limited growth |
| Stability | — | — | — | — | — | ✓ |
| Basic jobs | ✓ | ✓ | replaced | replaced | replaced | industrial set |
| Buildings | tribal | tribal | settlement | city | industrial | crisis/atomic |
| Chronicle | teaser | teaser | visible after Writing | ✓ | ✓ | ✓ |
| World Tension | — | — | — | hidden profile only | hidden profile only | visible |

---

# 15. Progression gates

Каждый breakthrough должен использовать минимум два типа gate, чтобы игрок не мог решать всё накоплением одного ресурса.

Допустимые gates:

- prerequisite node;
- resource price;
- Population threshold;
- resolved branch event;
- building/system requirement;
- narrative event resolution;
- Goal completion.

## Пример City

```text
requires_nodes: [S07]
requires_population: 105
requires_resources: F/M/K cost
requires_event: settlement branch already resolved through S01*
```

## Пример G022

Это composite gate, а не только A02 purchase:

```text
requires_branch: A01*
requires_node: A02
requires_power_surplus: true
requires_research_line: >= 1
```

---

# 16. Population architecture

Population — производственная ёмкость, а не spendable currency.

## 16.1. Consumption

```text
food_consumption = population × 0.105 F/s
```

## 16.2. Growth

```text
birth_rate/sec = population × 0.0010 × fertility_mult × era_fertility_mult
```

Era multipliers:

- Tribe: 1.00;
- Settlement: 0.75;
- City: 0.45;
- Industry: 0.45;
- Crisis: 0.00.

## 16.3. Food surplus gate

- surplus >=20% → full growth;
- 0–20% → linear 0..1 multiplier;
- negative → growth 0.

## 16.4. Hard rule

В Timeline #1 нет demographic hard fail из-за временного Food deficit.

---

# 17. Jobs replacement policy

Источник задаёт разные наборы профессий по эпохам, но не определяет миграцию старых профессий. DS-03 вводит implementation proposal:

```text
on era transition:
    old jobs remain in save history
    assigned population is remapped to closest new role when possible
    remainder becomes unassigned
    player sees one short "jobs updated" explanation
```

Рекомендуемый mapping:

| Old | New |
|---|---|
| Forager | Farmer / Industrial Farmer |
| Gatherer | Builder → Miner / Industrial Worker |
| Thinker | Scholar → Researcher → Scientist |
| Caregiver | utility/unassigned; не исчезает как concept |
| Artisan | Engineer / Industrial Worker depending current need |

Это **DS-03 proposal**, потому что исходники не задают migration policy.

Auto-remap не должен менять historical flags и не должен покупать buildings.

---

# 18. Resource visibility

## 18.1. 46–80

Top bar:

- Food;
- Materials;
- Knowledge;
- Population.

## 18.2. 80–108

Power добавляется. На mobile нельзя постоянно показывать пять равноправных counters.

**DS-03 proposal:** Population показывается как compact `current/cap` рядом с jobs icon, а top resource row остаётся F / M / K / PWR.

## 18.3. 108+

Stability/World Tension получает отдельную crisis bar и не занимает место обычной валюты.

---

# 19. Diorama state transitions

| Era | State | Обязательные visual layers |
|---|---|---|
| Early Civ | V3a Camp | костёр, 3–5 жителей, temporary shelters |
| Tribe | V3 Tribe | больше шатров, storage, activity loops |
| Settlement | V4 Settlement | permanent houses, fields, roads, workshop smoke |
| City | V5 City | market/street density, school/workshop clusters, first power infrastructure |
| Industry | V6 Industrial | factories, rail, smoke, dense skyline |
| Atomic | V7 Atomic | grid, research complex/reactor landmark, modern skyline |

Buildings не обязаны визуализироваться 1:1. Diorama использует thresholds/landmarks.

---

# 20. Visual thresholds для building counts

Исходники не задают точные count thresholds визуального роста. DS-03 proposal:

Для repeatable building семей использовать presentation tiers:

```text
0       → absent
1–2     → landmark / first instance
3–5     → small cluster
6–9     → mature cluster
10+     → dense/advanced variant
```

Это presentation only. Gameplay count остаётся точным.

---

# 21. Goal integration

| Goal | Progression object | Era transition? |
|---|---|---|
| G014 | T02 + T03 | no |
| G015 | T05 | → TRIBE |
| G016 | T08 | → SETTLEMENT_EARLY |
| G017 | S02 | → SETTLEMENT |
| G018 | S04 | no |
| G019 | S08 | → CITY |
| G020 | I02 | no |
| G021 | I05 | → INDUSTRY |
| G022 | A01* + A02 + research condition | no |
| G023 | A06 | → ATOMIC |
| G024 | crisis chain | → ARCHIVE_SUMMARY |

---

# 22. Event integration

| Event | Progression location | Blocks? |
|---|---|---|
| EV-CIV-01 Cultural Tradition | immediately after Sapience | T02 path |
| EV-CIV-02 Distribution | after T05 | no economy node |
| EV-CIV-03 Settlement Specialization | after T08 | S02 |
| EV-NAR-01 Traces Before Us | after S02 | only narrative queue |
| EV-CIV-04 Governance | after S08 | precedes city branch |
| EV-CIV-05 City Specialization | after governance | I02 |
| EV-CIV-06 Energy Crisis | after I05 | narrative path, no A01 replacement |
| EV-CIV-07 Preatomic Specialization | Industry | A02 |
| EV-NAR-02 Error 17 | after G022 | no |
| EV-NAR-03 Again | A06 | crisis begins |

---

# 23. Bottleneck expectations

Source balance establishes Knowledge as main soft bottleneck through most civilization phases.

Expected priority:

| Era | Primary | Secondary |
|---|---|---|
| Early Civ | Knowledge | Food surplus |
| Tribe | Knowledge | Materials |
| Settlement | Knowledge | Materials/building budget |
| City | Knowledge | Power |
| Industry | Knowledge | Power/Materials |

Если telemetry показывает Food главным bottleneck после City более половины времени, balance расходится с design target.

---

# 24. Optional nodes policy

Optional node не должен становиться скрытым обязательным prerequisite через UI или balance.

Timeline #1 может рекомендовать некоторые optional nodes, но core path обязан быть проходим без них.

Optional nodes:

- T04 Role Division;
- T06A Craft;
- T06B Oral Tradition;
- S03 Storage;
- S05A Law;
- S05B Accounting;
- I04A Standardization;
- I04B Mass Education;
- A04 Engines & Logistics.

---

# 25. Branch policy

В Timeline #1 branch group выбирается один раз.

Groups:

```text
culture_1: T01A/B/C
settlement_1: S01A/B/C
city_1: I01A/B/C
preatomic_1: A01A/B/C
```

В отличие от раннего biological tree, civilization branch sources не задают secondary-choice multiplier. Поэтому DS-03 не разрешает покупать вторую civ branch в Timeline #1 без будущей meta-spec.

---

# 26. Data model — Era State

```json
{
  "id": "CITY",
  "index": 3,
  "entry_node": "S08",
  "entry_goal": "G019",
  "resources_visible": ["food", "materials", "knowledge", "power"],
  "jobs_set": "city_v1",
  "building_set": "city_v1",
  "diorama_state": "V5_CITY",
  "events_on_enter": ["EV-CIV-04", "EV-CIV-05"]
}
```

---

# 27. Data model — Transition Rule

```json
{
  "id": "TR_SET_CITY",
  "from": "SETTLEMENT",
  "to": "CITY",
  "requires": {
    "node": "S08",
    "population_min": 105,
    "goal_complete": "G019"
  },
  "actions": [
    "unlock_resource:power",
    "switch_jobs:city_v1",
    "switch_buildings:city_v1",
    "set_diorama:V5_CITY",
    "queue_event:EV-CIV-04"
  ]
}
```

---

# 28. Save requirements

Civilization run state сохраняет отдельно:

```text
era_state
population
population_cap
job_allocations
building_counts
purchased_nodes
selected_branches
resource_stock
resource_rates
chapter_modifiers
run.civ.* flags
```

Не выводить era state заново только из purchased nodes при загрузке save; использовать versioned state + migration validation.

---

# 29. Analytics

Минимально:

```text
era_entered
population_threshold_reached
job_set_changed
building_first_built
building_count_milestone
tech_node_bought
branch_selected
resource_rate_changed
power_unlocked
civilization_bottleneck_detected
```

Для каждого era transition:

- real elapsed time;
- active elapsed time;
- Population;
- resources stock/rates;
- selected branch profile;
- building counts;
- job distribution.

---

# 30. Acceptance criteria DS-03 / Progression

Документ считается реализованным корректно, если:

- Technology / Building / Job / Upgrade / Milestone разделены в коде и UI;
- node IDs T/S/I/A сохраняют совместимость с evolution tree;
- G014–G023 имеют однозначные progression dependencies;
- переходы Tribe/Settlement/City/Industry/Atomic выполняются через State Machine;
- Power появляется только на City transition;
- Stability появляется только на Atomic transition;
- narrative EV-CIV-06 не подменяет A01 tech branch;
- опциональные узлы не требуются для core completion;
- Economy v1.0 цены и rates не изменены DS-03 без отдельной маркировки;
- будущий Timeline #2 сможет переиспользовать те же registries без hardcoded UI progression.

---

# 31. Open issues после DS-03

Не определяются этим документом и требуют следующих пакетов:

1. полноценная government system после Timeline #1;
2. точные numeric modifiers narrative choices, если они станут экономическими;
3. detailed storage caps;
4. building upgrade visual variants;
5. full automation rules Timeline #2+;
6. post-Atomic/space civilization progression;
7. exact diorama asset mapping.
