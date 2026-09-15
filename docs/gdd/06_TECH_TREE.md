# Хроники Эволюции — Civilization Tech Tree

**Документ:** `06_TECH_TREE.md`  
**DS:** DS-01 — Civilization gameplay contract  
**Статус:** ACCEPTED  
**Версия:** 1.0  
**Scope:** Timeline #1, cultural/civilization tech nodes после Sapience и до Atomic Age.

> Spec IDs `Txx/Sxx/Ixx/Axx` сохраняются из текущего Evolution Tree. Canonical IDs добавлены для будущей data-driven реализации, но implementation schema окончательно определяется в DS-03.

---

# 1. Назначение

Документ выделяет цивилизационную часть общего evolution tree в самостоятельный tech contract.

Он определяет:
- стабильные IDs;
- тип node;
- стоимость;
- prerequisite;
- gameplay effect;
- branch groups;
- convergence points;
- explicit unlocks.

Не описывает:
- финальные тексты событий;
- crisis nodes X01/X02;
- Archive meta tree;
- UI layout дерева.

---

# 2. Типы nodes

- `CORE` — обязательный ствол;
- `BRANCH` — специализация фазы;
- `OPTIONAL` — полезный, но необязательный узел;
- `CONVERGENCE` — крупный переход в новую фазу.

Rule:
- OPTIONAL node не может быть скрытым prerequisite core route;
- любой BRANCH в одной exclusive group должен приводить к одному и тому же следующему core node.

---

# 3. Exclusive groups

| Group ID | Nodes | Rule |
|---|---|---|
| `branch.tribe.culture` | T01A/B/C | выбрать 1 в Timeline #1 |
| `branch.settlement.specialization` | S01A/B/C | выбрать 1 |
| `branch.city.specialization` | I01A/B/C | выбрать 1 |
| `branch.industry.pre_atomic` | A01A/B/C | выбрать 1 |

Поздние Archive upgrades могут менять exclusivity, но это DS-04.

---

# 4. Tribe tech tree

## 4.1. Branch

| Spec | Canonical ID | Name | Type | Cost | Effect |
|---|---|---|---|---:|---|
| T01A | `tech.tribe.hunting_tradition` | Охотничья традиция | BRANCH | 250 F + 120 M + 35 K | Forager ×1.35 |
| T01B | `tech.tribe.gathering_network` | Собирательная сеть | BRANCH | 220 F + 100 M + 40 K | Food/Materials +15% |
| T01C | `tech.tribe.knowledge_ritual` | Ритуал знания | BRANCH | 230 F + 110 M + 45 K | Knowledge +25%; weaker early Food profile |

## 4.2. Core + optional

| Spec | Canonical ID | Name | Type | Cost | Requires | Effect |
|---|---|---|---|---:|---|---|
| T02 | `tech.tribe.fire` | Огонь | CORE | 420 F + 240 M + 60 K | T01* | Food ×1.20 |
| T03 | `tech.tribe.cooperative_hunt` | Совместная добыча | CORE | 610 F + 330 M + 95 K | T02 | Forager ×1.25 |
| T04 | `tech.tribe.division_of_roles` | Разделение ролей | OPTIONAL | 720 F + 390 M + 120 K | T03 | job switch cooldown = 0; presets +1 |
| T05 | `tech.tribe.tribe` | Племя | CORE | 900 F + 520 M + 145 K | T03 + pop32 | cap +25 |
| T06A | `tech.tribe.craft` | Ремесло | OPTIONAL | 900 F + 700 M + 180 K | T05 | Materials ×1.20 |
| T06B | `tech.tribe.oral_tradition` | Устная традиция | OPTIONAL | 850 F + 580 M + 220 K | T05 | Knowledge ×1.25 |
| T07 | `tech.tribe.seed_selection` | Отбор семян | CORE | 1,150 F + 620 M + 210 K | T05 | unlock Agriculture |
| T08 | `tech.tribe.agriculture` | Земледелие | CONVERGENCE | 1,650 F + 900 M + 300 K | T07 + pop42 | Farmer, Field, Settlement phase |

---

# 5. Settlement tech tree

## 5.1. Branch

| Spec | Canonical ID | Name | Type | Cost | Effect |
|---|---|---|---|---:|---|
| S01A | `tech.settlement.irrigation` | Ирригация | BRANCH | 1,900 F + 1,100 M + 380 K | Farmer ×1.25 |
| S01B | `tech.settlement.stonework` | Каменная кладка | BRANCH | 1,500 F + 1,450 M + 400 K | building base cost −10% |
| S01C | `tech.settlement.exchange` | Обмен | BRANCH | 1,600 F + 1,250 M + 460 K | F/M ×1.12; Market −20% cost |

## 5.2. Core + optional

| Spec | Canonical ID | Name | Type | Cost | Requires | Effect |
|---|---|---|---|---:|---|---|
| S02 | `tech.settlement.permanent_settlement` | Постоянное поселение | CORE | 2,800 F + 1,700 M + 520 K | S01* + pop58 | cap +40 |
| S03 | `tech.settlement.storage` | Хранилища | OPTIONAL | 2,200 F + 2,000 M + 540 K | S02 | Food ×1.20; consumption −3% |
| S04 | `tech.settlement.writing` | Письменность | CORE | 3,700 F + 2,400 M + 920 K | S02 + pop78 | Knowledge ×1.50 |
| S05A | `tech.settlement.law` | Закон | OPTIONAL | 3,900 F + 2,500 M + 1,000 K | S04 | event loss −20%; growth stability hook |
| S05B | `tech.settlement.counting` | Счёт | OPTIONAL | 3,600 F + 2,700 M + 1,050 K | S04 | building growth −0.01 |
| S06 | `tech.settlement.division_of_labor` | Разделение труда | CORE | 4,000 F + 3,100 M + 1,100 K | S04 | all jobs ×1.18 |
| S07 | `tech.settlement.urban_planning` | Городское планирование | CORE | 4,800 F + 3,600 M + 1,350 K | S06 | infrastructure growth −0.01 |
| S08 | `tech.settlement.city` | Город | CONVERGENCE | 5,500 F + 4,000 M + 1,600 K | S07 + pop105 | unlock Power, City phase |

---

# 6. City tech tree

## 6.1. Branch

| Spec | Canonical ID | Name | Type | Cost | Effect |
|---|---|---|---|---:|---|
| I01A | `tech.city.production_city` | Производственный город | BRANCH | 5,500 M + 1,900 K + 600 PWR | Materials ×1.25 |
| I01B | `tech.city.academic_city` | Академический город | BRANCH | 4,800 M + 2,500 K + 650 PWR | Knowledge ×1.30 |
| I01C | `tech.city.energy_city` | Энергетический город | BRANCH | 5,200 M + 2,000 K + 900 PWR | Power ×1.30 |

## 6.2. Core + optional

| Spec | Canonical ID | Name | Type | Cost | Requires | Effect |
|---|---|---|---|---:|---|---|
| I02 | `tech.city.mechanization` | Механизация | CORE | 8,500 M + 2,800 K + 1,100 PWR | I01* | M/F ×1.35 |
| I03 | `tech.city.steam_network` | Паровая сеть | CORE | 9,500 M + 3,200 K + 1,800 PWR | I02 | PWR ×1.50 |
| I04A | `tech.city.standardization` | Стандартизация | OPTIONAL | 11,000 M + 3,900 K + 2,100 PWR | I03 | building growth −0.01 |
| I04B | `tech.city.mass_education` | Массовое образование | OPTIONAL | 12,500 M + 4,500 K + 2,400 PWR | I03 | Knowledge ×1.40 |
| I05 | `tech.city.industry` | Индустрия | CONVERGENCE | 14,000 M + 5,200 K + 3,200 PWR | I03 + pop170 | industrial jobs, Industry phase |

---

# 7. Industry / pre-atomic tech tree

## 7.1. Branch

| Spec | Canonical ID | Name | Type | Cost | Effect |
|---|---|---|---|---:|---|
| A01A | `tech.industry.electrification` | Электрификация | BRANCH | 18,000 M + 7,500 K + 5,500 PWR | Power ×1.28 |
| A01B | `tech.industry.science_institutes` | Научные институты | BRANCH | 17,000 M + 8,500 K + 5,000 PWR | Knowledge ×1.30 |
| A01C | `tech.industry.mass_logistics` | Массовая логистика | BRANCH | 19,000 M + 7,000 K + 5,000 PWR | Materials ×1.25 |

## 7.2. Core + optional

| Spec | Canonical ID | Name | Type | Cost | Requires | Effect |
|---|---|---|---|---:|---|---|
| A02 | `tech.industry.electrical_grid` | Электросеть | CORE | 23,000 M + 9,500 K + 7,500 PWR | A01* | PWR ×1.45 |
| A03 | `tech.industry.scientific_method` | Научный метод | CORE | 25,000 M + 11,000 K + 8,000 PWR | A02 | Knowledge ×1.50 |
| A04 | `tech.industry.engines_logistics` | Двигатели и логистика | OPTIONAL | 28,000 M + 12,500 K + 9,500 PWR | A02 | Materials ×1.35 |
| A05 | `tech.industry.atomic_theory` | Атомная теория | CORE | 31,000 M + 14,500 K + 11,500 PWR | A03 | Reactor Project hook |
| A06 | `tech.industry.atomic_age` | Атомный век | CONVERGENCE | 36,000 M + 17,500 K + 15,000 PWR | A05 + pop260 | Stability=100; crisis clock; Atomic phase |

---

# 8. Full prerequisite graph

```text
Sapience
  ↓
T01A / T01B / T01C
  ↓
T02 Fire
  ↓
T03 Cooperative Hunt
  ├─ T04 Division of Roles [optional]
  ↓
T05 Tribe
  ├─ T06A Craft [optional]
  ├─ T06B Oral Tradition [optional]
  ↓
T07 Seed Selection
  ↓
T08 Agriculture
  ↓
S01A / S01B / S01C
  ↓
S02 Permanent Settlement
  ├─ S03 Storage [optional]
  ↓
S04 Writing
  ├─ S05A Law [optional]
  ├─ S05B Counting [optional]
  ↓
S06 Division of Labor
  ↓
S07 Urban Planning
  ↓
S08 City
  ↓
I01A / I01B / I01C
  ↓
I02 Mechanization
  ↓
I03 Steam Network
  ├─ I04A Standardization [optional]
  ├─ I04B Mass Education [optional]
  ↓
I05 Industry
  ↓
A01A / A01B / A01C
  ↓
A02 Electrical Grid
  ├─ A04 Engines & Logistics [optional]
  ↓
A03 Scientific Method
  ↓
A05 Atomic Theory
  ↓
A06 Atomic Age
```

Note: `A04` requires A02 and is optional; `A03` also requires A02. Они могут покупаться в любом порядке после A02.

---

# 9. Phase unlock mapping

| Node | Unlock |
|---|---|
| N06 Sapience | civilization resources + Tribe phase |
| T08 Agriculture | Settlement phase; Farmer; Field |
| S08 City | Power; City phase |
| I05 Industry | Industry phase; industrial job set |
| A05 Atomic Theory | Reactor Project hook |
| A06 Atomic Age | Stability; crisis clock; DS-02 handoff |

---

# 10. Recommended first-run highlight path

Tutorial/highlight может рекомендовать, но не force:

```text
T01C Knowledge Ritual
→ T02 Fire
→ T03 Cooperative Hunt
→ T05 Tribe
→ T07 Seed Selection
→ T08 Agriculture
→ S01C Exchange
→ S02 Permanent Settlement
→ S04 Writing
→ S06 Division of Labor
→ S07 Urban Planning
→ S08 City
→ I01B Academic City
→ I02 Mechanization
→ I03 Steam Network
→ I05 Industry
→ A01B Science Institutes
→ A02 Electrical Grid
→ A03 Scientific Method
→ A05 Atomic Theory
→ A06 Atomic Age
```

Это продолжает рекомендованный path текущего Evolution Tree и поддерживает Knowledge-oriented onboarding.

---

# 11. No-dead-end invariants

Для каждого BRANCH:
- next core node требует `group any-of`, а не конкретный branch;
- выбранная ветвь не может закрыть обязательный resource source;
- стоимость core breakthrough одинакова независимо от branch;
- first-run timing всех branch combinations должен оставаться в accepted corridor;
- OPTIONAL не является prerequisite CONVERGENCE, кроме явно указанного core node.

---

# 12. Связь с buildings/jobs

Tech tree не должен скрытно задавать building prerequisites, которых нет в источниках.

Явные unlocks:
- Agriculture → Farmer + Field;
- City → Power;
- Industry → industrial jobs;
- Atomic Theory → Reactor Project hook.

Остальные buildings открываются с phase availability и могут раскрываться UX/goal sequencing без изменения механического prerequisite graph.

---

# 13. DS-01 canonicalization: tech concepts из раннего GDD

## Government-lite

`Совет / Вождь / Купцы` — event choice, не tech branch этого дерева.

Переносится в DS-02.

## Energy crisis choice

`Fossil / Renewable / Atomic research` — event/value choice из раннего GDD.

Не смешивается с `A01A/B/C`, пока DS-02 не определит точные последствия и mapping.

## Radio / Computing precursor

Не входят в core tech graph v1:
- нет числовой цены;
- нет prerequisite в economy/evolution tree;
- могут использоваться как narrative/visual modernization hooks.

## Global civilization

Не является отдельной economy era между Industry и Atomic Age в текущем v1 balance.

Может быть chapter/story milestone без нового resource model.

---

# 14. Handoff to DS-02

DS-02 получает от этого документа:
- `A06 Atomic Age` как точку начала crisis;
- выбранные branch IDs;
- optional tech history;
- Population;
- активные economic modifiers;
- `Reactor Project` hook.

DS-02 не должен менять prerequisite/cost core tree без возврата DS-01 в review.

---

# 15. Acceptance criteria DS-01 для tech tree

- [ ] все nodes T01–A06 имеют stable canonical IDs;
- [ ] все source costs сохранены;
- [ ] prerequisite graph не содержит тупиков;
- [ ] четыре branch groups явно определены;
- [ ] optional nodes не блокируют progression;
- [ ] Agriculture / City / Industry / Atomic Age являются convergence nodes;
- [ ] Merchant, Radio и Computing не являются скрытыми обязательными dependencies;
- [ ] crisis nodes X01/X02 не смешаны с pre-108 tech;
- [ ] DS-02 имеет однозначную точку входа — `A06 Atomic Age`.
