# Хроники Эволюции — дерево технологий цивилизации Timeline #1

**Версия:** DS-01 revision 1.1  
**Область:** от первого культурного выбора после Разума до Атомного века и границы crisis layer.  
**Назначение:** каноническая спецификация `T/S/I/A` technology nodes, prerequisites, semantic roles, unlocks и integration с Goals/Events.  
**Связанные документы:** `04_CIVILIZATION_PROGRESSION.md`, `05_BUILDINGS_AND_JOBS.md`, `07_GOALS_AND_MILESTONES.md`, `08_EVENTS_AND_CHOICES.md`, `09_ENDINGS_AND_RESET.md`.

> Все node IDs, цены и числовые эффекты берутся из evolution tree/economy v1.0. Эта ревизия не переоценивает баланс; она нормализует semantic roles и integration contract.

---

# 1. Типы узлов

В одном registry допускаются разные semantic roles:

- `branch` — взаимоисключающая специализация;
- `core_tech` — обязательная технология;
- `upgrade` — необязательный экономический/QoL узел;
- `breakthrough` — convergence node, после которого может смениться era state.

Runtime type mapping:

```text
BRANCH      -> branch
CORE        -> core_tech
OPTIONAL    -> upgrade
CONVERGENCE -> breakthrough | convergence_tech
```

`City`, `Industry`, `Atomic Age` сохраняют исторические node IDs, но не трактуются UI как обычные технологии: это breakthrough nodes, после которых State Machine меняет era state.

---

# 2. Полная карта

```text
N06 SAPIENCE
    ↓
[T01A Hunting Tradition]
[T01B Gathering Network]
[T01C Knowledge Ritual]
    ↓
T02 Fire
    ↓
T03 Cooperative Hunt
    ├─ T04 Role Division [optional]
    ↓
T05 Tribe
    ├─ T06A Craft [optional]
    ├─ T06B Oral Tradition [optional]
    ↓
T07 Seed Selection
    ↓
T08 Agriculture
    ↓
[S01A Irrigation]
[S01B Masonry]
[S01C Exchange]
    ↓
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
S08 City
    ↓
[I01A Production City]
[I01B Academic City]
[I01C Energy City]
    ↓
I02 Mechanization
    ↓
I03 Steam Network
    ├─ I04A Standardization [optional]
    ├─ I04B Mass Education [optional]
    ↓
I05 Industry
    ↓
[A01A Electrification]
[A01B Research Institutes]
[A01C Mass Logistics]
    ↓
A02 Electrical Grid
    ├─ A04 Engines & Logistics [optional]
    ↓
A03 Scientific Method
    ↓
A05 Atomic Theory
    ↓
A06 Atomic Age
    ↓
CRISIS LAYER X*
```

`EV-CIV-06 Energy Crisis` находится между I05 и A01*, но **не является technology branch**.

---

# 3. Branch groups

```text
culture_1      = [T01A, T01B, T01C]
settlement_1   = [S01A, S01B, S01C]
city_1         = [I01A, I01B, I01C]
preatomic_1    = [A01A, A01B, A01C]
```

Timeline #1: первый выбранный node закрывает siblings текущей group.

Не переносить biological `×2.5 secondary choice` rule на civilization branch автоматически: для civ nodes такого source-defined правила нет.

---

# 4. Era V — Tribe technologies

## T01A — Hunting Tradition

```text
Type: BRANCH
Cost: 250 F + 120 M + 35 K
Effect: Forager ×1.35
Event: EV-CIV-01
```

## T01B — Gathering Network

```text
Type: BRANCH
Cost: 220 F + 100 M + 40 K
Effect: Food/Materials +15%
Event: EV-CIV-01
```

## T01C — Knowledge Ritual

```text
Type: BRANCH
Cost: 230 F + 110 M + 45 K
Effect: Knowledge +25%; weaker early Food
Event: EV-CIV-01
```

Recommended first-run highlight: `T01C`, но выбор не forced.

## T02 — Fire

```text
Type: CORE
Cost: 420 F + 240 M + 60 K
Requires: T01*
Effect: Food ×1.20
Goal: G014
```

Fire — technology; Hearth — Building. Покупка T02 не должна автоматически менять building count.

## T03 — Cooperative Hunt

```text
Type: CORE
Cost: 610 F + 330 M + 95 K
Requires: T02
Effect: Forager ×1.25
Goal: G014
```

## T04 — Role Division

```text
Type: OPTIONAL
Cost: 720 F + 390 M + 120 K
Requires: T03
Effect: job switch cooldown = 0; presets +1
```

Base cooldown source не определяет. Не придумывать скрытое значение; если punitive cooldown не вводится, T04 можно трактовать как QoL/preset unlock.

## T05 — Tribe

```text
Type: CORE / breakthrough
Cost: 900 F + 520 M + 145 K
Requires: T03 + Population 32
Effect: pop cap +25; job presets
Goal: G015
Transition: EARLY_CIV -> TRIBE
```

После completion: milestone Tribe, `EV-CIV-02`, unlock T06*/T07.

## T06A — Craft

```text
Type: OPTIONAL
Cost: 900 F + 700 M + 180 K
Requires: T05
Effect: Materials ×1.20
```

## T06B — Oral Tradition

```text
Type: OPTIONAL
Cost: 850 F + 580 M + 220 K
Requires: T05
Effect: Knowledge ×1.25
```

## T07 — Seed Selection

```text
Type: CORE
Cost: 1,150 F + 620 M + 210 K
Requires: T05
Effect: enables T08 Agriculture
```

## T08 — Agriculture

```text
Type: CONVERGENCE / breakthrough
Cost: 1,650 F + 900 M + 300 K
Requires: T07 + Population 42
Effect: unlock Farmer + Field
Goal: G016
Transition: TRIBE -> SETTLEMENT_EARLY
Event on complete: EV-CIV-03
```

---

# 5. Era VI — Settlement technologies

## S01A — Irrigation

```text
Type: BRANCH
Cost: 1,900 F + 1,100 M + 380 K
Effect: Farmer ×1.25
```

## S01B — Masonry

```text
Type: BRANCH
Cost: 1,500 F + 1,450 M + 400 K
Effect: buildings base cost −10%
```

## S01C — Exchange

```text
Type: BRANCH
Cost: 1,600 F + 1,250 M + 460 K
Effect: F/M ×1.12; Market −20% cost
```

Group event: `EV-CIV-03`. Branch resolution blocks S02. Recommended first-run highlight: S01C.

## S02 — Permanent Settlement

```text
Type: CORE / breakthrough
Cost: 2,800 F + 1,700 M + 520 K
Requires: S01* + Population 58
Effect: pop cap +40; birth ×1.10
Goal: G017
Transition: SETTLEMENT_EARLY -> SETTLEMENT
```

После completion: milestone `МЫ ОСТАЛИСЬ`, `EV-NAR-01`.

## S03 — Storage

```text
Type: OPTIONAL
Cost: 2,200 F + 2,000 M + 540 K
Requires: S02
Effect: Food ×1.20; consumption −3%
```

Player-facing name может быть `Хранилища и керамика`; runtime key остаётся S03.

## S04 — Writing

```text
Type: CORE
Cost: 3,700 F + 2,400 M + 920 K
Requires: S02 + Population 78
Effect: Knowledge ×1.50
Goal: G018
Product unlock: Chronicle visibility
```

## S05A — Law

```text
Type: OPTIONAL
Cost: 3,900 F + 2,500 M + 1,000 K
Requires: S04
Effect: event loss −20%; growth stability tag
```

`growth stability` не имеет точной формулы в текущем balance source; хранить effect/tag, не придумывать процент fertility.

## S05B — Accounting

```text
Type: OPTIONAL
Cost: 3,600 F + 2,700 M + 1,050 K
Requires: S04
Effect: building growth −0.01
```

Применять только к buildings, у которых growth factor определён.

## S06 — Division of Labor

```text
Type: CORE
Cost: 4,000 F + 3,100 M + 1,100 K
Requires: S04
Effect: all jobs ×1.18
```

## S07 — Urban Planning

```text
Type: CORE
Cost: 4,800 F + 3,600 M + 1,350 K
Requires: S06
Effect: infrastructure growth −0.01
```

## S08 — City

```text
Type: CONVERGENCE / breakthrough
Cost: 5,500 F + 4,000 M + 1,600 K
Requires: S07 + Population 105
Goal: G019
Transition: SETTLEMENT -> CITY
Unlock: Power + city job/building set
Events: EV-CIV-04 -> EV-CIV-05
```

---

# 6. Era VII — City / Industry technologies

## I01A — Production City

```text
Type: BRANCH
Cost: 5,500 M + 1,900 K + 600 PWR
Effect: Materials ×1.25
```

## I01B — Academic City

```text
Type: BRANCH
Cost: 4,800 M + 2,500 K + 650 PWR
Effect: Knowledge ×1.30
```

## I01C — Energy City

```text
Type: BRANCH
Cost: 5,200 M + 2,000 K + 900 PWR
Effect: Power ×1.30
```

Group event: `EV-CIV-05`. Recommended first-run highlight: I01B.

## I02 — Mechanization

```text
Type: CORE
Cost: 8,500 M + 2,800 K + 1,100 PWR
Requires: I01*
Effect: Materials/Food ×1.35
Goal: G020
```

## I03 — Steam Network

```text
Type: CORE
Cost: 9,500 M + 3,200 K + 1,800 PWR
Requires: I02
Effect: Power ×1.50
```

## I04A — Standardization

```text
Type: OPTIONAL
Cost: 11,000 M + 3,900 K + 2,100 PWR
Requires: I03
Effect: building growth −0.01
```

## I04B — Mass Education

```text
Type: OPTIONAL
Cost: 12,500 M + 4,500 K + 2,400 PWR
Requires: I03
Effect: Knowledge ×1.40
```

## I05 — Industry

```text
Type: CONVERGENCE / breakthrough
Cost: 14,000 M + 5,200 K + 3,200 PWR
Requires: I03 + Population 170
Goal: G021
Transition: CITY -> INDUSTRY
Unlock: industry jobs/buildings
Event: EV-CIV-06 Energy Crisis
```

`EV-CIV-06` — narrative energy-path choice. Он не заменяет A01 technological branch.

---

# 7. Era VIII — Preatomic technologies

## A01A — Electrification

```text
Type: BRANCH
Cost: 18,000 M + 7,500 K + 5,500 PWR
Effect: Power ×1.28
```

## A01B — Research Institutes

```text
Type: BRANCH
Cost: 17,000 M + 8,500 K + 5,000 PWR
Effect: Knowledge ×1.30
```

## A01C — Mass Logistics

```text
Type: BRANCH
Cost: 19,000 M + 7,000 K + 5,000 PWR
Effect: Materials ×1.25
```

Group event: `EV-CIV-07`. Recommended first-run highlight: A01B.

## A02 — Electrical Grid

```text
Type: CORE
Cost: 23,000 M + 9,500 K + 7,500 PWR
Requires: A01*
Effect: Power ×1.45
Goal integration: G022
```

## A03 — Scientific Method

```text
Type: CORE
Cost: 25,000 M + 11,000 K + 8,000 PWR
Requires: A02
Effect: Knowledge ×1.50
```

## A04 — Engines & Logistics

```text
Type: OPTIONAL
Cost: 28,000 M + 12,500 K + 9,500 PWR
Requires: A02
Effect: Materials ×1.35
```

A04 может покупаться параллельно научному пути и не является prerequisite A05.

## A05 — Atomic Theory

```text
Type: CORE
Cost: 31,000 M + 14,500 K + 11,500 PWR
Requires: A03
Effect: unlock Reactor Project / A06
```

## A06 — Atomic Age

```text
Type: CONVERGENCE / breakthrough
Cost: 36,000 M + 17,500 K + 15,000 PWR
Requires: A05 + Population 260
Goal: G023
Transition: INDUSTRY -> ATOMIC
```

On completion:

```text
stability = 100
crisis_clock = 0
production_event_mult = 1.35
```

Также: MS07, `EV-NAR-03 «Снова»`, открытие crisis layer X*.

---

# 8. Crisis-layer boundary

X-nodes не являются продолжением обычной civilization tech economy, а принадлежат crisis response layer.

| ID | Name | Effect | Archive tag |
|---|---|---|---|
| X01A | Reactor Prototype | PWR ×1.65, drain ↑ | atomic_mastery |
| X02A | Distributed Grid | PWR ×1.35, drain −0.02/s | grid_resilience |
| X01B | Global Science Network | K ×1.35 | shared_science |
| X02B | Risk Forecasting | reveals drain causes | foresight |
| X01C | Strategic Atom | M/K ×1.15, drain ↑ | deterrence |
| X02C | Central Coordination | Stability +18 once | coordination |
| X99 | Ash | Timeline #1 ending | — |

Полные crisis правила — `09_ENDINGS_AND_RESET.md`.

---

# 9. Goal mapping

| Goal | Node(s) |
|---|---|
| G014 | T02 + T03 |
| G015 | T05 |
| G016 | T08 |
| G017 | S02 |
| G018 | S04 |
| G019 | S08 |
| G020 | I02 |
| G021 | I05 |
| G022 | A01* + A02 + research condition |
| G023 | A06 |
| G024 | crisis chain / X99 |

Core progression UI использует Goal Engine; дерево не должно само определять tutorial sequencing.

---

# 10. Event mapping

| Event | Nodes |
|---|---|
| EV-CIV-01 Cultural Tradition | T01A/B/C |
| EV-CIV-03 Settlement Specialization | S01A/B/C |
| EV-CIV-05 City Specialization | I01A/B/C |
| EV-CIV-06 Energy Crisis | narrative modifier, no direct node replacement |
| EV-CIV-07 Preatomic Specialization | A01A/B/C |
| EV-NAR-02 Error 17 | after G022, no node |
| EV-NAR-03 Again | A06 milestone |

Government-lite `EV-CIV-04` не является tech node.

---

# 11. Prerequisite rules

Node может требовать:

```text
requires_nodes
requires_any_group
population_min
resource_cost
resolved_event
current_era
```

Проверка affordability не равна unlock:

```text
visible_locked
visible_unmet
available_unaffordable
affordable
completed
abandoned_branch
```

---

# 12. Branch lock rules

После покупки branch node:

```text
selected_group[group_id] = node_id
siblings -> abandoned_branch
```

`abandoned_branch` не означает удаление данных. Узел должен оставаться видимым в history/Chronicle.

Будущая meta-progression может разрешить hybridization; Timeline #1 — нет.

---

# 13. Optional-node invariant

Ни один OPTIONAL node не должен становиться скрытым prerequisite core path.

Core path должен проходиться без:

- T04;
- T06A/B;
- S03;
- S05A/B;
- I04A/B;
- A04.

Если telemetry показывает, что optional node фактически обязателен из-за экономики, это balance issue, а не повод пометить его CORE без design decision.

---

# 14. Effects contract

Node effects описываются data-driven operations:

```json
{"stat":"knowledge_mult","op":"mul","value":1.30}
{"stat":"building_growth","op":"add","value":-0.01}
{"unlock":"resource","id":"power"}
{"unlock":"job_set","id":"city_v1"}
```

UI не реализует математику effect самостоятельно.

---

# 15. Semantic unlock contract

Каждый node может содержать отдельно:

```text
effects
unlocks
transition
presentation
chronicle_tags
```

Пример:

```json
{
  "id": "S08",
  "type": "convergence",
  "semantic_role": "breakthrough",
  "requires": ["S07"],
  "population_min": 105,
  "cost": {"food":5500,"materials":4000,"knowledge":1600},
  "unlocks": ["resource:power", "job_set:city_v1", "building_set:city_v1"],
  "transition": "CITY",
  "goal": "G019",
  "events_on_complete": ["EV-CIV-04"]
}
```

---

# 16. Tech UI mobile

На mobile показывать только текущую phase + ближайшую будущую phase.

- core path — центральный ствол;
- branch nodes — 2–3 карточки в боковом выборе;
- optional — компактные side nodes;
- completed era — схлопывается;
- future era — silhouette/`???`, если детали ещё не должны быть раскрыты.

Не показывать всё дерево от Tribe до Atomic одним экраном по умолчанию.

---

# 17. Reward preview

Карточка node должна показывать gameplay effect до покупки.

Пример:

> **Механизация**  
> Materials и Food ×1.35  
> Открывает путь к паровой сети.

Breakthrough additionally показывает системный payoff:

> **Город**  
> Открывает Power, новые профессии и промышленную инфраструктуру.

---

# 18. Known / locked / unknown states

В соответствии с DEC-021 дерево поддерживает:

```text
known_open
known_locked
unknown_corrupted
discovered
```

Future content можно показывать силуэтом/`???`, но без ложных collection totals и без сюжетных спойлеров.

---

# 19. Data validation

На загрузке config проверять:

- unique node IDs;
- no missing prerequisites;
- no cycles в core prerequisite graph;
- ровно один group ID для branch node;
- all effect stat keys known;
- all Goal/Event references valid;
- breakthrough transition target существует;
- OPTIONAL node не required core path, если это не explicit decision.

Validation errors должны ломать dev build громко, а не оставлять недостижимую технологию молча.

---

# 20. Save state

Run save хранит:

```text
completed_nodes
selected_branch_by_group
visible/discovered node states if needed
```

Derived из config:

```text
current effects
available nodes
prices
transition candidates
```

После reset обычные completed civilization nodes не переносятся как active nodes; Chronicle/discovery/meta state хранится отдельно.

---

# 21. Debug tools

Нужны команды:

```text
unlock_node(id)
complete_node_free(id)
select_branch(group,id)
reset_branch(group)
show_prerequisite_trace(id)
show_effect_breakdown(id)
validate_tree()
```

Branch reset — только dev tool Timeline #1.

---

# 22. Automated tests

Минимум:

1. core route N06→A06 достижим;
2. каждый branch group имеет 3 members;
3. покупка sibling после branch selection блокируется;
4. optional nodes можно пропустить;
5. T08 unlock Farmer/Field;
6. S08 unlock Power и City transition;
7. I05 unlock Industry transition;
8. A06 creates Atomic/Stability state;
9. event/goal references существуют;
10. config prices совпадают с economy/evolution source.

Дополнительно simulation должна проверять milestone windows первого run.

---

# 23. Analytics

```text
tech_node_viewed
tech_node_affordable
tech_node_bought
tech_branch_selected
tech_optional_bought
era_breakthrough_bought
tech_tree_opened
```

Для branch analytics:

```text
group_id
node_id
timeline
elapsed_sec
current_goal
resource_snapshot
path_profile
```

---

# 24. Acceptance criteria

- все `T/S/I/A` IDs evolution tree представлены без изменения цен/эффектов;
- semantic roles разделены;
- Branch groups однозначны;
- `City`, `Industry`, `Atomic Age` реализуются как breakthrough + State Machine transition;
- Energy Crisis не подменяет A01 group;
- government-lite не становится скрытым tech node;
- optional nodes не блокируют core path;
- Goal/Event refs валидны;
- tech UI может показать effect/reward до покупки;
- future branches поддерживают unknown/corrupted states;
- конфигурация валидируется автоматически;
- code/UI не содержит отдельную копию tech costs/effects.

---

# 25. Open issues

Следующие вопросы остаются для следующих пакетов/technical DS-03:

1. canonical config format: JSON/TS/legacy adapter;
2. legacy Evolve tech mapping к новым IDs;
3. save migration strategy;
4. exact UI graph layout;
5. localization keys;
6. meta-hybridization civilization branches Timeline #2+;
7. post-Atomic/space tech tree.
