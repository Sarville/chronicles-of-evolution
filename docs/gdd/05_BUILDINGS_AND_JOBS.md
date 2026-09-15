# Хроники Эволюции — Buildings & Jobs

**Документ:** `05_BUILDINGS_AND_JOBS.md`  
**DS:** DS-01 — Civilization gameplay contract  
**Статус:** ACCEPTED  
**Версия:** 1.0  
**Scope:** Timeline #1, примерно 46–108 минут.

> Численные rates и цены повторяют `02_ECONOMY_FIRST_120_MINUTES.md`. Если позднее баланс меняется, economy document остаётся числовым source of truth до синхронного version bump этого файла.

---

# 1. Назначение

Документ определяет:
- канонические jobs;
- производительность на 1 Population;
- канонические buildings/infrastructure;
- stackability;
- era availability;
- visual hooks;
- какие ранние GDD-сущности deferred.

Технологические prerequisites описаны в `06_TECH_TREE.md`.

---

# 2. Population rules

Population:
- не тратится как валюта;
- распределяется по jobs;
- каждый занятый житель может иметь только один основной job;
- свободная Population допустима;
- Food consumption считается для всего населения.

Базовое потребление:

```text
food_consumption = population × 0.105 F/s
```

Рост:

```text
birth_rate/sec =
population × 0.0010 × fertility_mult × era_fertility_mult
```

при Food surplus ≥20%.

При Food deficit:
- growth = 0;
- hard death spiral в Timeline #1 не используется;
- recovery/hint rules детализируются в DS-02/DS-06.

---

# 3. Job sets по фазам

## 3.1. Tribe jobs

| Canonical ID | UI name | Output / 1 pop | Gameplay role |
|---|---|---:|---|
| `job.tribe.forager` | Forager / Добытчик пищи | +0.65 F/s | поддержка Food |
| `job.tribe.gatherer` | Gatherer / Сборщик | +0.30 M/s | ранние Materials |
| `job.tribe.thinker` | Thinker / Мыслитель | +0.085 K/s | ранний Knowledge |
| `job.tribe.caregiver` | Caregiver / Хранитель | +12% birth-rate, max +60% | ускорение Population |

### Modifiers

- Hunting Tradition: Forager ×1.35.
- Cooperative Hunt: Forager ×1.25.
- Tool Bench: Gatherer ×1.35.
- Story Circle: Thinker ×1.50.

---

## 3.2. Settlement jobs

| Canonical ID | UI name | Output / 1 pop |
|---|---|---:|
| `job.settlement.farmer` | Farmer / Земледелец | +1.55 F/s |
| `job.settlement.builder` | Builder / Строитель | +0.72 M/s |
| `job.settlement.scholar` | Scholar / Учёный | +0.235 K/s |
| `job.settlement.artisan` | Artisan / Ремесленник | +0.42 M/s +0.055 K/s |

### Modifiers

- Field: Farmer ×1.10 per Field.
- Workshop: Builder/Artisan ×1.18 per Workshop.
- School: Scholar ×1.25 per School.
- Irrigation branch: Farmer ×1.25.
- Division of Labor: all jobs ×1.18.

### Reference allocation before City

- 42% Farmer;
- 30% Builder/Artisan;
- 23% Scholar;
- 5% care/utility/free allocation.

Это reference distribution для balance validation, не обязательная стратегия.

---

## 3.3. City jobs

| Canonical ID | UI name | Output / 1 pop |
|---|---|---:|
| `job.city.industrial_farmer` | Industrial Farmer | +2.60 F/s |
| `job.city.miner` | Miner | +1.35 M/s |
| `job.city.engineer` | Engineer | +0.75 M/s +0.26 PWR/s |
| `job.city.researcher` | Researcher | +0.62 K/s |

### Modifiers

- Mine: Miner ×1.16 per Mine.
- Mechanization: M/F ×1.35.
- Steam Network: PWR ×1.50.
- Mass Education: K ×1.40.
- city branch modifies M/K/PWR depending choice.

---

## 3.4. Industry jobs

| Canonical ID | UI name | Output / 1 pop |
|---|---|---:|
| `job.industry.mechanized_farmer` | Mechanized Farmer | +4.0 F/s |
| `job.industry.industrial_worker` | Industrial Worker | +2.45 M/s |
| `job.industry.power_engineer` | Power Engineer | +0.95 PWR/s |
| `job.industry.scientist` | Scientist | +1.15 K/s |

### Modifiers

- Electrical Grid: PWR ×1.45.
- Scientific Method: K ×1.50.
- Combustion & Logistics: M ×1.35.
- pre-atomic branch modifies M/K/PWR.

---

# 4. Job lifecycle rule — DS-01 canonicalization

Экономика задаёт разные job sets для разных фаз, но не описывает точную миграцию назначений.

Для design contract v1 принимается:

1. каждая фаза имеет свой **active displayed job set**;
2. новый set становится доступен при переходе phase;
3. старые job labels не должны оставаться отдельными параллельными способами добывать тот же ресурс;
4. точный алгоритм migration текущих worker assignments определяется в DS-03/DS-06;
5. баланс v1 не должен зависеть от возможности одновременно использовать старую и новую версию одной профессии.

Это предотвращает UI с 12 почти одинаковыми jobs.

---

# 5. Tribe structures — 46–62

В economy spec для этих объектов нет growth factor. Поэтому в DS-01 они трактуются как **unique phase structures**, а не бесконечно покупаемые generators.

| Canonical ID | Name | Cost | Effect | Type |
|---|---|---:|---|---|
| `building.tribe.hearth` | Hearth / Очаг | 80 F + 35 M | pop cap +10; K ×1.10 | unique |
| `building.tribe.shelter` | Shelter / Укрытие | 55 M | pop cap +8 | unique |
| `building.tribe.tool_bench` | Tool Bench | 140 M + 35 K | Gatherer ×1.35 | unique |
| `building.tribe.hunting_ground` | Hunting Ground | 180 F + 80 M | Forager ×1.30 | unique |
| `building.tribe.story_circle` | Story Circle | 220 F + 75 M + 55 K | Thinker ×1.50 | unique |
| `building.tribe.clan_camp` | Clan Camp | 520 F + 330 M + 100 K | pop cap +30; birth ×1.15 | unique |

## Visual hooks

- Hearth → главный костёр;
- Shelter → первые укрытия;
- Tool Bench → рабочая зона;
- Hunting Ground → периферийная hunting/foraging zone;
- Story Circle → символы/место собрания;
- Clan Camp → визуальный рост лагеря.

---

# 6. Settlement buildings — 62–80

Settlement buildings являются stackable infrastructure и используют указанный growth.

```text
cost(n) = base_cost × growth^(n-1)
```

| Canonical ID | Name | Base cost | Growth | Effect |
|---|---|---:|---:|---|
| `building.settlement.field` | Field | 260 M + 180 F | 1.18 | Farmer ×1.10 per Field |
| `building.settlement.house` | House | 220 M | 1.17 | pop cap +14 |
| `building.settlement.workshop` | Workshop | 520 M + 160 K | 1.20 | Builder/Artisan ×1.18 |
| `building.settlement.granary` | Granary | 650 M + 350 F | 1.20 | Food ×1.15; consumption −3% |
| `building.settlement.school` | School | 900 M + 420 K | 1.20 | Scholar ×1.25 |
| `building.settlement.market` | Market | 1,250 M + 600 F + 250 K | 1.22 | F/M ×1.12 |

## Visual hooks

- Field → cultivated terrain layer;
- House → settlement density;
- Workshop → smoke/work props;
- Granary → storage landmark;
- School → knowledge landmark;
- Market → social/commercial center.

---

# 7. City infrastructure — 80–94

| Canonical ID | Name | Base cost | Growth | Effect |
|---|---|---:|---:|---|
| `building.city.mine` | Mine | 1,100 M | 1.19 | Miner ×1.16 |
| `building.city.foundry` | Foundry | 1,800 M + 500 K | 1.20 | +10 M/s |
| `building.city.steam_plant` | Steam Plant | 2,200 M + 650 K | 1.20 | +7.5 PWR/s |
| `building.city.rail_hub` | Rail Hub | 2,800 M + 900 K | 1.22 | M/F ×1.12 |
| `building.city.laboratory` | Laboratory | 3,200 M + 1,100 K | 1.22 | +4.0 K/s |

## Visual hooks

- Mine → extraction zone;
- Foundry → first heavy-industry skyline;
- Steam Plant → visible power landmark/smoke;
- Rail Hub → moving train hook;
- Laboratory → science landmark.

---

# 8. Industry infrastructure — 94–108

| Canonical ID | Name | Base cost | Growth | Effect |
|---|---|---:|---:|---|
| `building.industry.steelworks` | Steelworks | 4,600 M + 900 PWR | 1.20 | +30 M/s |
| `building.industry.grid_station` | Grid Station | 5,200 M + 1,300 K | 1.20 | +24 PWR/s |
| `building.industry.research_institute` | Research Institute | 6,500 M + 2,200 K + 1,200 PWR | 1.22 | +18 K/s |
| `building.industry.chemical_complex` | Chemical Complex | 8,000 M + 2,600 K + 1,500 PWR | 1.22 | M ×1.08; K ×1.05 |

## Visual hooks

- Steelworks → dense factory landmark;
- Grid Station → pylons/cables/electric lighting;
- Research Institute → modern scientific complex;
- Chemical Complex → pipes/tanks/industrial overlay.

---

# 9. Building availability

Чтобы не вводить неподтверждённые tech prerequisites, DS-01 использует правило:

- structure/infrastructure set открывается **phase-level unlock**;
- отдельный tech prerequisite применяется только если он уже явно указан в source tree/economy;
- более точные reveal conditions могут быть добавлены в `07_GOALS_AND_MILESTONES.md`, но не должны менять экономическую доступность без update DS-01.

Явные связи:
- `T08 Agriculture` → Farmer + Field;
- `S08 City` → Power;
- `I05 Industry` → industrial jobs;
- `A05 Atomic Theory` → Reactor Project hook.

---

# 10. Stackability rules

## Unique

Tribe structures:
- Hearth;
- Shelter;
- Tool Bench;
- Hunting Ground;
- Story Circle;
- Clan Camp.

Причина: source economy задаёт фиксированную цену без growth и использует их как ранние unlock structures.

## Stackable

Settlement, City и Industry infrastructure:
- используют Base cost + Growth;
- count хранится в run state;
- визуально не обязаны отображаться как точное количество индивидуальных объектов;
- диорама может переходить между density thresholds.

---

# 11. Production object milestones

Общий economy rule для покупаемых производящих объектов:

- 10 copies → output этого типа ×2.0;
- 25 copies → ещё ×2.0;
- 50 copies → ещё ×2.5.

DS-01 не расширяет это правило на unique Tribe structures.

Для конкретной реализации того, какие infrastructure IDs получают milestone multiplier, требуется DS-03 mapping к legacy engine; gameplay balance source остаётся economy spec.

---

# 12. Capacity and starvation constraints

## Population cap

Cap увеличивают:
- Tribe: Hearth, Shelter, Clan Camp, T05 Tribe;
- Settlement: House, S02 Permanent Settlement;
- поздние дополнительные cap sources в DS-01 не вводятся.

## Food

Food после City становится supporting resource, но не исчезает:
- population продолжает потреблять Food;
- фермерские jobs остаются;
- starvation hard fail отсутствует в Timeline #1.

---

# 13. Deferred / non-canonical jobs

## Merchant

Ранний GDD содержит `Merchant`, но economy spec не задаёт:
- output;
- cost;
- trade currency;
- market conversion formula.

Поэтому `Merchant` **не входит в active job set Timeline #1 v1**.

Trade-lite реализуется через:
- `building.settlement.market`;
- `tech.settlement.exchange`.

Если полноценный Merchant понадобится позже, требуется отдельный balance entry.

---

# 14. Deferred / aliases из раннего GDD

| Early GDD concept | v1 mapping |
|---|---|
| Campfire | Hearth |
| Food Store / Storehouse | Granary после Agriculture |
| Farm | Field |
| Worker | Builder/Artisan → позднее Industrial Worker |
| Power Plant | Steam Plant / Grid Station |
| Energy | Power |
| Atomic Lab | пока не отдельный DS-01 building |
| Research Reactor | Reactor Project/crisis-layer hook |

---

# 15. Visual density contract

Точное количество купленных buildings не обязано соответствовать количеству нарисованных объектов.

Art layer получает агрегированные значения:
- phase;
- infrastructure counts;
- dominant branch;
- production intensity;
- population density.

Пример:

```text
Field count 1–2  -> sparse fields
Field count 3–5  -> developed farmland
Field count 6+   -> dense agricultural belt
```

Точные thresholds проектируются в DS-07, не являются balance rules.

---

# 16. Acceptance criteria DS-01 для buildings/jobs

- [ ] каждый phase 46–108 имеет один канонический job set;
- [ ] каждый job имеет stable ID и числовой output;
- [ ] каждый economy building имеет stable ID;
- [ ] fixed-price tribal structures не трактуются как бесконечные generators;
- [ ] stackable infrastructure сохраняет source growth factor;
- [ ] Merchant не требуется для достижения Atomic Age;
- [ ] Food остаётся поддерживающим ресурсом после City;
- [ ] переход job sets не создаёт дублирующих production paths;
- [ ] visual hooks существуют для будущего art manifest.
