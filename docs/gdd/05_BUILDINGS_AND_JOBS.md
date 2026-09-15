# Хроники Эволюции — здания и профессии Timeline #1

**Версия:** DS-01 revision 1.1  
**Область:** цивилизационная часть первого Timeline, ~46:00–108:00.  
**Назначение:** implementation-spec каталога Buildings и Jobs, их production-роли, unlocks, UI и data model.  
**Связанные документы:** `04_CIVILIZATION_PROGRESSION.md`, `06_TECH_TREE.md`, `07_GOALS_AND_MILESTONES.md`, `08_EVENTS_AND_CHOICES.md`, `09_ENDINGS_AND_RESET.md`, economy v1.0.

> Числа, присутствующие в economy/evolution v1.0, перенесены без изменения. Параметры, которых в исходниках нет, не маскируются как готовый баланс: они помечаются `TBD` либо `DS-03 proposal`.

---

# 1. Основные правила

## 1.1. Building и Job — разные сущности

`Building` — инфраструктура, которую игрок строит за ресурсы.  
`Job` — роль Population, назначаемая игроком.

Здание может:
- производить ресурс самостоятельно;
- усиливать конкретную профессию;
- увеличивать population cap;
- давать глобальный modifier;
- открывать system.

Профессия:
- использует 1 Population на 1 assigned worker;
- производит ресурс каждую секунду;
- может иметь несколько outputs;
- может усиливаться buildings/tech/events.

## 1.2. Базовая формула стоимости repeatable building

```text
cost(n) = round_3sig(base_cost × growth^(n-1))
```

Если building имеет несколько валют, growth применяется ко всем cost components.

## 1.3. Production building

```text
building_output/sec = count × base_output × local_mult × era_mult × event_mult
```

## 1.4. Job output

```text
job_output/sec = assigned_population × base_output × job_mult × building_mult × tech_mult × event_mult
```

## 1.5. Population invariant

```text
sum(all job assignments) <= population
```

Unassigned population разрешён и не является ошибкой.

---

# 2. Stable ID convention

DS-03 вводит stable IDs для implementation, не меняя player-facing names.

## Jobs

```text
JOB_TRIBE_FORAGER
JOB_TRIBE_GATHERER
JOB_TRIBE_THINKER
JOB_TRIBE_CAREGIVER

JOB_SETTLEMENT_FARMER
JOB_SETTLEMENT_BUILDER
JOB_SETTLEMENT_SCHOLAR
JOB_SETTLEMENT_ARTISAN

JOB_CITY_FARMER
JOB_CITY_MINER
JOB_CITY_ENGINEER
JOB_CITY_RESEARCHER

JOB_INDUSTRY_FARMER
JOB_INDUSTRY_WORKER
JOB_INDUSTRY_POWER_ENGINEER
JOB_INDUSTRY_SCIENTIST
```

## Buildings

```text
BLD_HEARTH
BLD_SHELTER
BLD_TOOL_BENCH
BLD_HUNTING_GROUND
BLD_STORY_CIRCLE
BLD_CLAN_CAMP

BLD_FIELD
BLD_HOUSE
BLD_WORKSHOP
BLD_GRANARY
BLD_SCHOOL
BLD_MARKET

BLD_MINE
BLD_FOUNDRY
BLD_STEAM_PLANT
BLD_RAIL_HUB
BLD_LABORATORY

BLD_STEELWORKS
BLD_GRID_STATION
BLD_RESEARCH_INSTITUTE
BLD_CHEMICAL_COMPLEX
```

Player-facing localization хранится отдельно от ID.

---

# 3. Набор jobs по эпохам

Jobs не накапливаются бесконечно в одном списке. При переходе эпохи предыдущий набор заменяется новым набором ролей.

| Era | Job set |
|---|---|
| EARLY_CIV / TRIBE | Forager, Gatherer, Thinker, Caregiver |
| SETTLEMENT | Farmer, Builder, Scholar, Artisan |
| CITY | Industrial Farmer, Miner, Engineer, Researcher |
| INDUSTRY / ATOMIC | Mechanized Farmer, Industrial Worker, Power Engineer, Scientist |

Это уменьшает UI clutter и показывает развитие специализации общества.

---

# 4. Tribal Jobs — 46–62 минут

## 4.1. Forager

**ID:** `JOB_TRIBE_FORAGER`

```text
Food: +0.65 F/s per pop
```

Роль:
- основной Food producer;
- поддерживает ≥20% surplus для роста Population.

Усиления:
- T01A Hunting Tradition: ×1.35;
- T02 Fire: global Food ×1.20;
- T03 Cooperative Hunt: ×1.25;
- Hunting Ground: ×1.30.

## 4.2. Gatherer

**ID:** `JOB_TRIBE_GATHERER`

```text
Materials: +0.30 M/s per pop
```

Усиления:
- Tool Bench: ×1.35;
- T01B Gathering Network: общий F/M +15%;
- T06A Craft: Materials ×1.20.

## 4.3. Thinker

**ID:** `JOB_TRIBE_THINKER`

```text
Knowledge: +0.085 K/s per pop
```

Усиления:
- Story Circle: ×1.50;
- Hearth: Knowledge ×1.10;
- T01C Ritual of Knowledge: Knowledge +25%;
- T06B Oral Tradition: Knowledge ×1.25.

Knowledge intentionally является soft bottleneck.

## 4.4. Caregiver

**ID:** `JOB_TRIBE_CAREGIVER`

```text
+12% birth-rate per assigned pop
max +60%
```

Не производит отдельный ресурс.

Implementation:

```text
caregiver_mult = 1 + min(assigned, 5) × 0.12
```

Необходимо проверить stacking с `fertility_mult` — source задаёт смысл, но не полную final formula. До отдельного balance-pass считать multiplicative fertility modifier.

---

# 5. Tribal Buildings

В source для tribal buildings нет growth factors. DS-03 запрещает молча применять `1.17` как будто это утверждённое число.

До balance-pass:

```text
repeatable: configurable
cost_growth: TBD
```

Для уникальных structures (`Hearth`, `Clan Camp`) рекомендуется `max_count = 1` как DS-03 proposal, но это требует acceptance.

## 5.1. Hearth

**ID:** `BLD_HEARTH`

```text
Cost: 80 F + 35 M
Effect:
  population cap +10
  Knowledge ×1.10
```

Visual:
- центральный костёр;
- smoke/light landmark.

## 5.2. Shelter

**ID:** `BLD_SHELTER`

```text
Cost: 55 M
Effect: population cap +8
```

Visual threshold:
- 1–2 shelters;
- 3+ camp cluster.

## 5.3. Tool Bench

**ID:** `BLD_TOOL_BENCH`

```text
Cost: 140 M + 35 K
Effect: Gatherer ×1.35
```

## 5.4. Hunting Ground

**ID:** `BLD_HUNTING_GROUND`

```text
Cost: 180 F + 80 M
Effect: Forager ×1.30
```

## 5.5. Story Circle

**ID:** `BLD_STORY_CIRCLE`

```text
Cost: 220 F + 75 M + 55 K
Effect: Thinker ×1.50
```

## 5.6. Clan Camp

**ID:** `BLD_CLAN_CAMP`

```text
Cost: 520 F + 330 M + 100 K
Effect:
  population cap +30
  birth ×1.15
```

---

# 6. Settlement Jobs — 62–80 минут

## 6.1. Farmer

**ID:** `JOB_SETTLEMENT_FARMER`

```text
Food: +1.55 F/s per pop
```

Field modifier:

```text
Farmer ×1.10 per Field
```

Source wording предполагает stacking за поле. Чтобы exponential multiplication не взорвала balance, implementation не должна угадывать формулу.

**Open issue:** additive `+10% per field` vs multiplicative `×1.10^count`.

Рекомендация DS-03:

```text
field_mult = 1 + 0.10 × field_count
```

как безопасная proposal до telemetry pass.

## 6.2. Builder

**ID:** `JOB_SETTLEMENT_BUILDER`

```text
Materials: +0.72 M/s per pop
```

Workshop:
- Builder ×1.18.

## 6.3. Scholar

**ID:** `JOB_SETTLEMENT_SCHOLAR`

```text
Knowledge: +0.235 K/s per pop
```

School:
- Scholar ×1.25.

Writing:
- global Knowledge ×1.50.

## 6.4. Artisan

**ID:** `JOB_SETTLEMENT_ARTISAN`

```text
Materials: +0.42 M/s
Knowledge: +0.055 K/s
per pop
```

Workshop:
- Artisan ×1.18.

Artisan — hybrid role: полезен при одновременном M/K pressure, но менее эффективен каждого специализированного worker.

---

# 7. Settlement Buildings

## 7.1. Field

**ID:** `BLD_FIELD`

```text
Base cost: 260 M + 180 F
Growth: 1.18
Effect: Farmer +10% per field
```

Unlock:
- T08 Agriculture.

Visual:
- cultivated plots;
- irrigation overlay для S01A.

## 7.2. House

**ID:** `BLD_HOUSE`

```text
Base cost: 220 M
Growth: 1.17
Effect: population cap +14
```

## 7.3. Workshop

**ID:** `BLD_WORKSHOP`

```text
Base cost: 520 M + 160 K
Growth: 1.20
Effect: Builder / Artisan ×1.18
```

Open issue:
- повторное stacking exact formula.

DS-03 proposal:

```text
workshop_mult = 1 + 0.18 × count
```

до отдельной simulation validation.

## 7.4. Granary

**ID:** `BLD_GRANARY`

```text
Base cost: 650 M + 350 F
Growth: 1.20
Effect:
  Food ×1.15
  consumption −3%
```

Stacking exact formula source не задаёт.

Proposal:

```text
food_mult = 1 + 0.15 × count
consumption_mult = max(0.75, 1 - 0.03 × count)
```

Cap 25% reduction — DS-03 proposal, не утверждённое economy value.

## 7.5. School

**ID:** `BLD_SCHOOL`

```text
Base cost: 900 M + 420 K
Growth: 1.20
Effect: Scholar ×1.25
```

Proposal stacking:

```text
scholar_mult = 1 + 0.25 × count
```

## 7.6. Market

**ID:** `BLD_MARKET`

```text
Base cost: 1,250 M + 600 F + 250 K
Growth: 1.22
Effect: F/M ×1.12
```

Market не открывает полноценный Merchant job в Timeline #1 — такой job есть в раннем GDD, но отсутствует в более позднем economy v1.0. Поэтому DS-03 его не вводит.

---

# 8. City Jobs — 80–94 минут

## 8.1. Industrial Farmer

**ID:** `JOB_CITY_FARMER`

```text
Food: +2.60 F/s per pop
```

## 8.2. Miner

**ID:** `JOB_CITY_MINER`

```text
Materials: +1.35 M/s per pop
```

Mine:
- Miner ×1.16.

## 8.3. Engineer

**ID:** `JOB_CITY_ENGINEER`

```text
Materials: +0.75 M/s
Power: +0.26 PWR/s
per pop
```

Engineering role нужен для dual-resource balancing после появления Power.

## 8.4. Researcher

**ID:** `JOB_CITY_RESEARCHER`

```text
Knowledge: +0.62 K/s per pop
```

Laboratory добавляет отдельный flat Knowledge output.

---

# 9. City Buildings

## 9.1. Mine

**ID:** `BLD_MINE`

```text
Base cost: 1,100 M
Growth: 1.19
Effect: Miner ×1.16
```

Proposal stacking:

```text
miner_mult = 1 + 0.16 × count
```

## 9.2. Foundry

**ID:** `BLD_FOUNDRY`

```text
Base cost: 1,800 M + 500 K
Growth: 1.20
Output: +10 M/s
```

Flat production building.

## 9.3. Steam Plant

**ID:** `BLD_STEAM_PLANT`

```text
Base cost: 2,200 M + 650 K
Growth: 1.20
Output: +7.5 PWR/s
```

First dedicated Power building.

## 9.4. Rail Hub

**ID:** `BLD_RAIL_HUB`

```text
Base cost: 2,800 M + 900 K
Growth: 1.22
Effect: Materials/Food ×1.12
```

Visual:
- railway/transport overlay;
- движущийся поезд как ambient prop.

## 9.5. Laboratory

**ID:** `BLD_LABORATORY`

```text
Base cost: 3,200 M + 1,100 K
Growth: 1.22
Output: +4.0 K/s
```

---

# 10. Industry Jobs — 94–108+

## 10.1. Mechanized Farmer

**ID:** `JOB_INDUSTRY_FARMER`

```text
Food: +4.0 F/s per pop
```

Food уже не основной bottleneck.

## 10.2. Industrial Worker

**ID:** `JOB_INDUSTRY_WORKER`

```text
Materials: +2.45 M/s per pop
```

## 10.3. Power Engineer

**ID:** `JOB_INDUSTRY_POWER_ENGINEER`

```text
Power: +0.95 PWR/s per pop
```

## 10.4. Scientist

**ID:** `JOB_INDUSTRY_SCIENTIST`

```text
Knowledge: +1.15 K/s per pop
```

Scientific Method и research infrastructure формируют основной путь к A05/A06.

---

# 11. Industry Buildings

## 11.1. Steelworks

**ID:** `BLD_STEELWORKS`

```text
Base cost: 4,600 M + 900 PWR
Growth: 1.20
Output: +30 M/s
```

## 11.2. Grid Station

**ID:** `BLD_GRID_STATION`

```text
Base cost: 5,200 M + 1,300 K
Growth: 1.20
Output: +24 PWR/s
```

## 11.3. Research Institute

**ID:** `BLD_RESEARCH_INSTITUTE`

```text
Base cost: 6,500 M + 2,200 K + 1,200 PWR
Growth: 1.22
Output: +18 K/s
```

## 11.4. Chemical Complex

**ID:** `BLD_CHEMICAL_COMPLEX`

```text
Base cost: 8,000 M + 2,600 K + 1,500 PWR
Growth: 1.22
Effect:
  Materials ×1.08
  Knowledge ×1.05
```

Exact multi-copy stacking TBD.

---

# 12. Atomic/Crisis Infrastructure

Economy v1.0 задаёт atomic upgrades, но не определяет отдельные repeatable atomic buildings. Ранний GDD упоминает Research Reactor / Atomic Lab.

DS-03 не создаёт им новые gameplay costs без источника.

## Presentation-only / milestone landmarks

Допускаются visual landmarks:

```text
LANDMARK_RESEARCH_REACTOR
LANDMARK_ATOMIC_LAB
```

Они появляются при:

- A05 Atomic Theory;
- A06 Atomic Age;

но до отдельного balance spec не являются purchasable Buildings.

Atomic production идёт через X-nodes/upgrades из DS-02/09.

---

# 13. Buildings vs Technologies mapping

| Technology / Node | Что открывает/усиливает |
|---|---|
| T02 Fire | Food modifier; Hearth theme already available/onboarding |
| T04 Role Division | job presets +1; switch cooldown=0 |
| T07 Seed Selection | путь к Agriculture |
| T08 Agriculture | Farmer + Field |
| S01A Irrigation | Farmer ×1.25 |
| S01B Masonry | building base cost −10% |
| S01C Exchange | F/M ×1.12; Market −20% |
| S02 Permanent Settlement | settlement state; cap +40 |
| S03 Storage | Food ×1.20; consumption −3% |
| S04 Writing | Knowledge ×1.50 |
| S06 Division of Labor | jobs ×1.18 |
| S07 Urban Planning | infrastructure growth −0.01 |
| S08 City | Power + city job/building set |
| I01A Production City | Materials ×1.25 |
| I01B Academic City | Knowledge ×1.30 |
| I01C Energy City | Power ×1.30 |
| I02 Mechanization | M/F ×1.35 |
| I03 Steam Network | Power ×1.50 |
| I04A Standardization | building growth −0.01 |
| I04B Mass Education | K ×1.40 |
| I05 Industry | industry job/building set |
| A01A Electrification | PWR ×1.28 |
| A01B Scientific Institutes | K ×1.30 |
| A01C Mass Logistics | M ×1.25 |
| A02 Electrical Grid | PWR ×1.45 |
| A03 Scientific Method | K ×1.50 |
| A04 Engines & Logistics | M ×1.35 |
| A05 Atomic Theory | reactor project / Atomic unlock |
| A06 Atomic Age | Stability/crisis layer |

---

# 14. Population cap sources

Known source-defined cap modifiers:

| Source | Cap |
|---|---:|
| Hearth | +10 |
| Shelter | +8 |
| Clan Camp | +30 |
| T05 Tribe | +25 |
| S02 Permanent Settlement | +40 |
| House | +14 |

Initial cap before these buildings source explicitly не задаёт.

**TBD:** starting civilization population cap.

Implementation должна хранить:

```text
population
population_cap
```

и не выводить cap из UI state.

---

# 15. Job assignment UI contract

Минимальные действия:

```text
+1 worker
-1 worker
Max / Fill
Auto Assign
Preset
```

Primary display для job:

```text
Farmer
32 assigned
+49.6 Food/s
```

В expanded details:

- base output;
- building modifiers;
- tech modifiers;
- final output.

Не показывать игроку длинную multiplier formula по умолчанию.

---

# 16. Job switching

Ранний GDD допускает auto assignment, evolution tree T04 говорит:

```text
job switch cooldown = 0
```

Но base cooldown до T04 нигде не задан.

Поэтому:

```text
base_job_switch_cooldown = TBD
```

DS-03 recommendation: для vertical slice вообще не использовать punitive cooldown, а трактовать T04 как unlock instant presets/reallocation QoL. Если вводится cooldown, нужен отдельный UX/balance review.

---

# 17. Auto Assign

Auto Assign должен быть deterministic и data-driven.

Необходимые inputs:

```text
current_goal
resource_rates
resource_stock
population
population_cap
job_outputs
minimum_food_surplus
current_era
```

## Priority proposal

1. обеспечить Food balance +20%;
2. устранить отрицательный Power после unlock;
3. определить bottleneck текущего Goal;
4. оставшуюся Population направить в bottleneck;
5. небольшой reserve — Knowledge, если bottleneck неоднозначен.

Pseudocode:

```text
assign_food_until(target_surplus = 20%)
if power_unlocked:
    assign_power_until(rate >= 0)
assign_to(goal_primary_bottleneck)
assign_remaining_to(knowledge)
```

Точные веса — DS-03 proposal и требуют simulation tests.

---

# 18. Presets

UI presets после T04:

- Growth;
- Balanced;
- Research;
- Production.

Это не новые modifiers. Они только меняют allocation.

Пример conceptual weights:

```text
Balanced: maintain surplus + distribute by current need
Research: maintain survival floor, maximize K
Production: maintain survival floor, maximize M/PWR
Growth: maximize Food surplus + Caregiver within cap
```

Точные проценты не фиксируются до auto-assignment test.

---

# 19. Modifier groups

Чтобы избежать double counting, каждый modifier получает category.

```text
job_base
building_job_bonus
building_global_bonus
tech_job_bonus
tech_global_bonus
branch_bonus
chapter_modifier
event_modifier
crisis_modifier
```

Внутри конкретного modifier source правила определяются data field `stack_mode`.

```json
{
  "id": "FIELD_FARMER_BONUS",
  "group": "building_job_bonus",
  "stack_mode": "additive_per_count",
  "value": 0.10
}
```

Source-defined modifier не должен hardcode-иться внутри job class.

---

# 20. Growth factor modifiers

Некоторые tech уменьшают growth:

- S07 Urban Planning: infra growth −0.01;
- I04A Standardization: building growth −0.01;

Применение:

```text
effective_growth = max(min_growth, base_growth + sum(growth_delta))
```

`min_growth` source не задаёт.

Для первого Timeline modifiers малы; no clamp needed practically, но data layer должен поддерживать clamp позднее.

---

# 21. Building purchase flow

```text
1. check unlock
2. calculate current effective cost
3. check resources
4. pay atomically
5. increment count
6. recalc affected modifiers/rates
7. emit building_bought
8. evaluate count milestone
9. refresh goal progress
10. refresh diorama tier if threshold crossed
```

Payment должен быть atomic: multi-resource building нельзя частично оплатить.

---

# 22. Count milestones

Economy задаёт global producer milestones:

```text
10 copies → ×2.0 output
25 copies → ещё ×2.0
50 copies → ещё ×2.5
```

Неясно, относятся ли они ко всем цивилизационным buildings или только generators.

**DS-03 interpretation:** применять только к buildings с `producer = true`, а не к House/Shelter/cap buildings и не к pure multiplier support buildings, пока отдельный config не говорит иначе.

```json
{
  "producer_milestones": true
}
```

---

# 23. Diorama mapping

## Tribal

| Building | Visual role |
|---|---|
| Hearth | central landmark/fire |
| Shelter | settlement density |
| Tool Bench | small crafting prop |
| Hunting Ground | outskirts activity |
| Story Circle | social/fire secondary cluster |
| Clan Camp | camp-size milestone |

## Settlement

| Building | Visual role |
|---|---|
| Field | farmland layer |
| House | settlement density |
| Workshop | smoke/craft cluster |
| Granary | storage landmark |
| School | civic landmark |
| Market | crowd/commercial cluster |

## City

| Building | Visual role |
|---|---|
| Mine | outskirts/terrain prop |
| Foundry | industrial cluster |
| Steam Plant | smoke/energy landmark |
| Rail Hub | rail + moving train |
| Laboratory | civic/science landmark |

## Industry

| Building | Visual role |
|---|---|
| Steelworks | heavy industry skyline |
| Grid Station | power lines/lights |
| Research Institute | science landmark |
| Chemical Complex | pipes/tanks cluster |

Gameplay count не равен количеству нарисованных объектов.

---

# 24. Branch visual variants

Buildings могут получать cosmetic skin flags от path variables без изменения gameplay entity ID.

Пример:

```text
nature high → cleaner roofs/greenery
industry high → pipes/smoke/dense geometry
control high → monumental planning
cooperation high → open/common spaces
```

Один `BLD_RESEARCH_INSTITUTE` остаётся тем же gameplay building.

---

# 25. Building data object

```json
{
  "id": "BLD_STEAM_PLANT",
  "era": "CITY",
  "name_key": "building.steam_plant.name",
  "description_key": "building.steam_plant.desc",
  "requires_nodes": ["I03"],
  "cost": {
    "materials": 2200,
    "knowledge": 650
  },
  "growth": 1.20,
  "max_count": null,
  "effects": [
    {
      "stat": "power_flat_per_sec",
      "op": "add_per_count",
      "value": 7.5
    }
  ],
  "producer": true,
  "producer_milestones": true,
  "diorama_family": "energy_city"
}
```

---

# 26. Job data object

```json
{
  "id": "JOB_CITY_ENGINEER",
  "era": "CITY",
  "name_key": "job.engineer.name",
  "outputs": {
    "materials": 0.75,
    "power": 0.26
  },
  "population_cost": 1,
  "enabled": true,
  "tags": ["production", "power"],
  "replacement_for": ["JOB_SETTLEMENT_ARTISAN"]
}
```

---

# 27. Runtime derived state

Не сохранять в save всё, что можно безопасно пересчитать.

Saved:

```text
building counts
job assignments
population
population cap if affected by events/meta
```

Derived:

```text
base job rates
building modifiers
technology modifiers
final resource rates
building current price
```

Однако migration/versioning должна гарантировать, что новый config не тихо изменит старый save без policy.

---

# 28. Debug tools required

Для реализации DS-03 нужны debug controls:

- set Population;
- add/remove worker;
- buy building free;
- unlock node;
- set era;
- show modifier breakdown;
- show resource rate breakdown;
- simulate +60 sec / +10 min;
- run auto-assignment;
- reset job allocation.

Это существенно ускорит balance validation.

---

# 29. Automated tests

## Jobs

- sum assigned ≤ Population;
- dual-output job правильно производит оба ресурса;
- negative assignment невозможен;
- переход эпохи не теряет Population.

## Buildings

- multi-resource payment atomic;
- cost growth корректен;
- growth reduction tech корректно меняет следующую цену;
- output flat building масштабируется count;
- pop cap обновляется;
- 10/25/50 milestones только для tagged producers.

## Modifiers

- branch + tech + building применяются в правильном порядке;
- chapter modifier удаляется на expiry;
- optional node не required скрыто.

---

# 30. Balance telemetry

Логировать:

```text
job_allocation_changed
job_auto_assign_used
job_preset_used
building_bought
building_first_built
building_count_milestone
population_cap_changed
resource_rate_breakdown_sample
```

На milestone:

- counts всех buildings;
- job allocation %;
- resource rates;
- stock;
- Population/cap.

---

# 31. Acceptance criteria

- каждый job 46–108 минут имеет stable ID и source-defined base output;
- каждый building из economy v1.0 имеет stable ID;
- building и job не объединены в одну generic сущность;
- exact source prices/growth/rates сохранены;
- неизвестные stacking formulas не выдаются за утверждённый баланс;
- auto assignment не создаёт новые ресурсы/bonuses;
- Power production доступна после City;
- industrial jobs заменяют city jobs на Industry;
- Atomic landmarks не становятся новыми purchasable buildings без balance spec;
- UI может получить rate breakdown без знания формул конкретного building.

---

# 32. Открытые balance/TBD

Следующие параметры требуют отдельного решения/testing:

1. growth factor tribal buildings;
2. repeatable vs unique у Hearth / Clan Camp и некоторых tribal structures;
3. additive vs multiplicative stacking Fields/Workshops/Schools/Mines;
4. cap на Granary consumption reduction;
5. base job-switch cooldown;
6. exact auto-assign weights;
7. starting civilization population cap;
8. распространяются ли producer milestones 10/25/50 на все flat-output civ buildings;
9. atomic buildings как gameplay entities vs visual landmarks;
10. exact visual count thresholds.

До решения эти значения должны оставаться data-config/TBD, а не hidden constants.
