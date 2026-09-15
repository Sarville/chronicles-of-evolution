# Хроники Эволюции — Civilization Progression

**Документ:** `04_CIVILIZATION_PROGRESSION.md`  
**DS:** DS-01 — Civilization gameplay contract  
**Статус:** ACCEPTED  
**Версия:** 1.0  
**Scope:** Timeline #1, переход `Sapience` → `Atomic Age`, примерно 46–108 минут.

> Принято в DS-01. Является каноническим gameplay-contract для указанной области до следующего version bump.

---

# 1. Назначение

Документ определяет каноническую последовательность цивилизационной части первого Timeline:

**Разум → Племя → Земледелие → Поселение → Город → Индустрия → Атомный век.**

Он связывает:
- числовую экономику;
- культурно-технологическое дерево;
- population/jobs;
- buildings/infrastructure;
- визуальные состояния мира;
- будущие goals/events/UX hooks.

Финальный кризис после `Atomic Age` относится к DS-02 и здесь описывается только как точка передачи управления следующему блоку.

---

# 2. Источники и приоритет

Используются:

1. `docs/gdd/02_ECONOMY_FIRST_120_MINUTES.md` — source of truth для цен, rates и target timings;
2. `docs/gdd/03_EVOLUTION_TREE.md` — source of truth для node IDs, типов узлов и prerequisite graph;
3. `docs/gdd/01_FIRST_120_MINUTES.md` — концепция pacing, визуальных milestones и presentation;
4. `docs/PRD.md` — product-level intent;
5. `docs/DECISIONS.md` — принятые решения проекта.

При конфликте раннего GDD и экономики/дерева используются экономика и дерево.

---

# 3. Канонические фазы 46–108 минут

| Phase ID | Фаза | Target | Основной переход | Ресурсы |
|---|---|---:|---|---|
| `era.sapience_transition` | Разум → цивилизация | ~46:00 | biological stock → стартовый пакет | F / M / K / Population |
| `era.tribe` | Племя | 46–62 | `T08 Agriculture` | F / M / K / Population |
| `era.settlement` | Поселение | 62–80 | `S08 City` | F / M / K / Population |
| `era.city` | Город | 80–94 | `I05 Industry` | F / M / K / PWR / Population |
| `era.industry` | Индустрия | 94–108 | `A06 Atomic Age` | F / M / K / PWR / Population |
| `era.atomic` | Атомный век | ~108 | передача в crisis contract | M / K / PWR / Stability |

Целевые коридоры:
- Agriculture: **59:30–64:30**;
- City: **76:30–83:30**;
- Industry: **90:30–97:30**;
- Atomic Age: **104:00–111:30**.

---

# 4. Переход Sapience → Civilization

## 4.1. Условие входа

Вход в цивилизационную часть происходит при завершении узла:

`N06 / evolution.sapience`

Целевой момент первого Timeline: около **46:00**.

## 4.2. Конвертация биологического результата

Каноническая формула:

```text
start_population = 18 + floor(log10(total_biomass_earned + 1) × 3)
start_food       = 120 + floor(B_stock × 0.05)
start_materials  = 70 + floor(E_stock × 0.003)
start_knowledge  = 15 + floor(I_stock × 0.02)
```

Ограничения Timeline #1:
- Population: **18–24**;
- бонус Food: максимум **+120**;
- бонус Materials: максимум **+100**;
- бонус Knowledge: максимум **+35**.

Биологические ресурсы после перехода перестают быть активными валютами текущего UI, но история эволюции остаётся доступной как run history / Evolution data.

---

# 5. Общая модель цивилизационной progression

Цивилизационная часть строится вокруг трёх взаимосвязанных контуров.

## 5.1. Population loop

Population:
- занимает jobs;
- потребляет Food;
- растёт только при достаточном Food surplus;
- ограничивается population cap;
- является prerequisite крупных переходов.

Базовое потребление:

```text
food_consumption = population × 0.105 F/s
```

Рост при Food surplus ≥20%:

```text
birth_rate/sec =
population × 0.0010 × fertility_mult × era_fertility_mult
```

`era_fertility_mult`:
- Tribe: **1.00**;
- Settlement: **0.75**;
- City: **0.45**;
- Industry: **0.45**;
- Crisis: **0.00**.

Food deficit в Timeline #1 не создаёт hard fail:
- population growth останавливается;
- player получает bottleneck/recovery hook;
- дальнейший штраф детализируется в DS-02/UX.

## 5.2. Production loop

В каждой фазе Population распределяется между несколькими ролями.

Роли должны заставлять игрока выбирать между:
- поддержанием Food;
- Materials/infrastructure;
- Knowledge/progression;
- Power после City.

Knowledge является целевым soft bottleneck почти всей цивилизационной части.

## 5.3. Breakthrough loop

Progression не определяется только количеством ресурсов.

Каждый major transition требует:
- core tech chain;
- population threshold;
- достаточного production;
- иногда branch choice.

Крупные convergence nodes:
- `T08 Agriculture`;
- `S08 City`;
- `I05 Industry`;
- `A06 Atomic Age`.

---

# 6. Фаза Tribe — 46–62 минут

**Phase ID:** `era.tribe`  
**Visual state:** `V3_TRIBE`

## 6.1. Fantasy

Игрок впервые управляет не организмом, а группой разумных существ:
- добывает пищу;
- распределяет труд;
- увеличивает population;
- создаёт первые устойчивые социальные практики.

## 6.2. Канонические jobs

- `job.tribe.forager`
- `job.tribe.gatherer`
- `job.tribe.thinker`
- `job.tribe.caregiver`

Подробные rates — в `05_BUILDINGS_AND_JOBS.md`.

## 6.3. Первый культурный branch

Сразу после входа в цивилизацию доступен один из трёх branch nodes:

| Spec ID | Canonical ID | Выбор | Роль |
|---|---|---|---|
| T01A | `tech.tribe.hunting_tradition` | Охотничья традиция | ускоряет Food через Forager |
| T01B | `tech.tribe.gathering_network` | Собирательная сеть | сбалансированный F/M |
| T01C | `tech.tribe.knowledge_ritual` | Ритуал знания | ускоряет K |

В Timeline #1 это специализация текущей цивилизации, а не moral alignment.

## 6.4. Core progression

```text
T01* cultural branch
    ↓
T02 Fire
    ↓
T03 Cooperative Hunt
    ↓
T05 Tribe
    ↓
T07 Seed Selection
    ↓
T08 Agriculture
```

Optional:
- `T04 Division of Roles`;
- `T06A Craft`;
- `T06B Oral Tradition`.

## 6.5. Ключевые thresholds

- ~51:00: Fire + Cooperative Hunt;
- ~56:00: `T05 Tribe`, Population ≥32;
- ~62:00: `T08 Agriculture`, Population ≥42.

## 6.6. Выход

`T08 Agriculture`:
- завершает Tribe phase;
- открывает Farmer;
- открывает Field;
- переводит мир в `era.settlement`;
- запускает визуальный переход к постоянному поселению.

---

# 7. Фаза Settlement — 62–80 минут

**Phase ID:** `era.settlement`  
**Visual state:** `V4_SETTLEMENT`

## 7.1. Fantasy

Общество перестаёт жить только текущим днём:
- появляется земледелие;
- постоянное жильё;
- мастерские;
- накопление;
- formal Knowledge;
- инфраструктурная специализация.

## 7.2. Канонические jobs

- `job.settlement.farmer`
- `job.settlement.builder`
- `job.settlement.scholar`
- `job.settlement.artisan`

## 7.3. Специализация поселения

После Agriculture выбирается один branch:

| Spec ID | Canonical ID | Выбор | Роль |
|---|---|---|---|
| S01A | `tech.settlement.irrigation` | Ирригация | Food/Farmer |
| S01B | `tech.settlement.stonework` | Каменная кладка | cheaper infrastructure |
| S01C | `tech.settlement.exchange` | Обмен | F/M + Market synergy |

## 7.4. Core progression

```text
S01* settlement branch
    ↓
S02 Permanent Settlement
    ↓
S04 Writing
    ↓
S06 Division of Labor
    ↓
S07 Urban Planning
    ↓
S08 City
```

Optional:
- `S03 Storage`;
- `S05A Law`;
- `S05B Counting`.

## 7.5. Ключевые thresholds

- ~68:00: `S02 Permanent Settlement`, Population ≥58;
- ~74:00: `S04 Writing`, Population ≥78;
- ~80:00: `S08 City`, Population ≥105.

## 7.6. Выход

`S08 City`:
- завершает Settlement phase;
- открывает ресурс `Power`;
- переводит visual state в `V5_CITY`;
- открывает городскую специализацию.

---

# 8. Фаза City — 80–94 минут

**Phase ID:** `era.city`  
**Visual state:** `V5_CITY`, затем подготовка `V6_INDUSTRIAL`

## 8.1. Fantasy

Экономика становится инфраструктурной:
- сельское хозяйство механизируется;
- Materials перестают быть только ручным ремеслом;
- появляются специализированные производственные объекты;
- Power становится новым ограничителем;
- формальная наука ускоряет progression.

## 8.2. Канонические jobs

- `job.city.industrial_farmer`
- `job.city.miner`
- `job.city.engineer`
- `job.city.researcher`

## 8.3. Городская специализация

| Spec ID | Canonical ID | Выбор | Роль |
|---|---|---|---|
| I01A | `tech.city.production_city` | Производственный город | Materials |
| I01B | `tech.city.academic_city` | Академический город | Knowledge |
| I01C | `tech.city.energy_city` | Энергетический город | Power |

Эта специализация уже влияет на будущий профиль Великого фильтра через экономическую траекторию, но narrative последствия описываются в DS-02.

## 8.4. Core progression

```text
I01* city specialization
    ↓
I02 Mechanization
    ↓
I03 Steam Network
    ↓
I05 Industry
```

Optional:
- `I04A Standardization`;
- `I04B Mass Education`.

## 8.5. Ключевые thresholds

- ~87:00: `I02 Mechanization`, Population ≈135;
- ~94:00: `I05 Industry`, Population ≥170.

## 8.6. Выход

`I05 Industry`:
- переводит phase в `era.industry`;
- открывает industrial jobs;
- переводит диораму к `V6_INDUSTRIAL`.

---

# 9. Фаза Industry — 94–108 минут

**Phase ID:** `era.industry`  
**Visual state:** `V6_INDUSTRIAL`, затем `V7_ATOMIC`

## 9.1. Fantasy

Общество входит в фазу быстрого масштабирования:
- массовое производство;
- энергосеть;
- исследовательские институты;
- химическая индустрия;
- технологическая зависимость от Knowledge + Power.

## 9.2. Канонические jobs

- `job.industry.mechanized_farmer`
- `job.industry.industrial_worker`
- `job.industry.power_engineer`
- `job.industry.scientist`

## 9.3. Предатомная специализация

| Spec ID | Canonical ID | Выбор | Роль |
|---|---|---|---|
| A01A | `tech.industry.electrification` | Электрификация | Power |
| A01B | `tech.industry.science_institutes` | Научные институты | Knowledge |
| A01C | `tech.industry.mass_logistics` | Массовая логистика | Materials |

## 9.4. Core progression

```text
A01* pre-atomic specialization
    ↓
A02 Electrical Grid
    ↓
A03 Scientific Method
    ↓
A05 Atomic Theory
    ↓
A06 Atomic Age
```

Optional:
- `A04 Engines and Logistics`.

## 9.5. Ключевые thresholds

- ~101:00: Electrical Grid + research infrastructure, Population ≈215;
- ~108:00: `A06 Atomic Age`, Population ≥260.

## 9.6. Выход

При `A06 Atomic Age`:
- создаётся `Stability = 100`;
- начинается crisis clock;
- активируется `V7_ATOMIC`;
- управление progression передаётся DS-02 contract Великого фильтра.

---

# 10. Канонический graph 46–108

```text
Sapience
  ↓
[T01A Hunting | T01B Gathering | T01C Knowledge]
  ↓
Fire
  ↓
Cooperative Hunt
  ↓
Tribe
  ↓
Seed Selection
  ↓
AGRICULTURE
  ↓
[S01A Irrigation | S01B Stonework | S01C Exchange]
  ↓
Permanent Settlement
  ↓
Writing
  ↓
Division of Labor
  ↓
Urban Planning
  ↓
CITY
  ↓
[I01A Production | I01B Academic | I01C Energy]
  ↓
Mechanization
  ↓
Steam Network
  ↓
INDUSTRY
  ↓
[A01A Electrification | A01B Science | A01C Logistics]
  ↓
Electrical Grid
  ↓
Scientific Method
  ↓
Atomic Theory
  ↓
ATOMIC AGE
```

Optional nodes не должны блокировать core route.

---

# 11. Design role branch choices

Branch choice первого Timeline должен:
- давать преимущество примерно в диапазоне, уже заданном деревом;
- менять оптимальное распределение jobs;
- не делать одну ветвь обязательной;
- не уводить completion первого run за допустимый timing corridor;
- давать visual tag для будущего art/UX layer;
- сохраняться в Chronicle/run summary.

Branch не должен:
- вводить новый отдельный ресурс;
- скрытно менять ending в Timeline #1;
- закрывать core tech;
- создавать hard fail.

---

# 12. Что считается каноническим gameplay v1

В первый Timeline входят как реальные gameplay systems:
- Food / Materials / Knowledge / Power;
- Population;
- jobs;
- population cap;
- Food consumption/growth;
- buildings/infrastructure из economy specification;
- культурные/городские/индустриальные branches из Evolution Tree;
- Power с момента City;
- convergence progression до Atomic Age.

---

# 13. DS-01 canonicalization: концепты раннего GDD

Следующие элементы раннего GDD сохраняются как идеи, но **не являются обязательными отдельными gameplay entities v1**, потому что у них нет согласованной числовой модели в economy/evolution tree.

## 13.1. Merchant

Ранний GDD перечисляет `Merchant` как job.

В v1:
- отдельного `Merchant` job нет;
- trade-lite представлен эффектом `Market` и веткой `Exchange`;
- полноценный trade job/system deferred.

## 13.2. Wood / Stone / Metal

Ранний GDD предлагает secondary production resources.

В v1:
- глобальной активной валютой остаётся `Materials`;
- Wood/Stone/Metal могут использоваться как presentation/codex labels;
- отдельные балансовые валюты не вводятся в Timeline #1 без нового decision/rebalance.

## 13.3. Energy

Ранний GDD использует industrial `Energy`.

Каноническое runtime/resource имя v1:
- `Power (PWR)`.

## 13.4. Power Plant / Motor

Ранний GDD описывает generic Power Plant и Motor.

В v1 механическую роль выполняют:
- `Steam Plant`;
- `Grid Station`;
- `Steam Network`;
- `Electrical Grid`;
- `Mechanization`.

Generic названия могут использоваться только в пользовательском objective copy, если DS-02/UX сочтут это полезным.

## 13.5. Radio / Computing precursor / Connect regions

Эти элементы есть в раннем GDD Modern Era, но отсутствуют в числовой progression.

В v1:
- они не являются обязательными tech prerequisites до Atomic Age;
- могут стать story/presentation hooks в DS-02/DS-05;
- добавление их как реальных tech nodes требует отдельного balance update.

## 13.6. Research Reactor / Atomic Lab

Ранний GDD показывает физические объекты перед Nuclear Technology.

Текущая экономика определяет `Atomic Theory → Atomic Age`, а reactor upgrades находятся уже в crisis phase.

Поэтому до DS-02:
- `Reactor Project` остаётся unlock hook от `A05 Atomic Theory`;
- отдельные pre-crisis Reactor/Atomic Lab buildings не входят в canonical building list DS-01.

---

# 14. Визуальные hooks для следующих сессий

| Phase | Visual state | Обязательные hooks |
|---|---|---|
| Tribe | V3 | костёр, временные укрытия, небольшая группа |
| Settlement | V4 | поля, постоянные дома, мастерские, дороги |
| City | V5 | плотная застройка, школа/рынок, инфраструктура |
| Industry | V6 | фабрики, железная дорога, дым, энергосеть |
| Atomic | V7 | grid lighting, research landmark, атомный motif |

Branch visual variation проектируется в DS-07, но DS-01 требует сохранять `branch visual tag` в состоянии.

---

# 15. Acceptance criteria DS-01 для progression

Документ считается согласованным, если:

- [ ] все обязательные переходы 46–108 имеют node ID;
- [ ] каждый transition имеет population threshold и экономическую цену;
- [ ] нет обязательных `Merchant/Radio/Computing` без числовой модели;
- [ ] Power используется последовательно вместо industrial Energy;
- [ ] каждый phase имеет канонический набор jobs;
- [ ] каждый phase имеет канонический building/infrastructure set;
- [ ] optional node нельзя случайно сделать prerequisite core route;
- [ ] все branch choices имеют путь к следующему convergence node;
- [ ] gameplay заканчивается на `A06 Atomic Age`, после чего начинается DS-02 crisis contract.
