# Хроники Эволюции — Decisions

Этот файл фиксирует решения, которые имеют приоритет над более ранними или общими формулировками в других документах.

Каждое новое решение добавляется отдельной записью.

---

## Формат записи

```text
## DEC-XXX — Название

Status: accepted / proposed / superseded
Date: YYYY-MM-DD

Decision:
...

Reason:
...

Affected documents:
...

Implementation consequence:
...
```

---

## DEC-001 — Название проекта

**Status:** accepted  
**Date:** 2026-09-15

### Decision

Основное название проекта во всей новой документации:

**Хроники Эволюции**

Старое рабочее название может упоминаться только при описании исходного проекта Evolve или истории миграции.

### Implementation consequence

- UI copy и новые документы используют «Хроники Эволюции».
- Имена внутренних legacy-модулей не требуется массово переименовывать без причины.
- Ребрендинг исходного кода выполняется отдельно от domain refactor.

---

## DEC-002 — Первый релизуемый вертикальный срез

**Status:** accepted  
**Date:** 2026-09-15

### Decision

Первый обязательный playable slice покрывает Timeline #1:

**возникновение жизни → разум → цивилизация → индустрия → атом → кризис → Пепел → первый reset → teaser Timeline #2.**

Целевое время первого полного прохождения — примерно 120 минут.

### Reason

Это минимальный объём, который показывает основную продуктовую формулу: progression, meaningful choice, визуальную эволюцию, ending и prestige/reset.

---

## DEC-003 — Числовой source of truth

**Status:** accepted  
**Date:** 2026-09-15

### Decision

Для production values, breakthrough prices, production rates, milestone timings и crisis timing главным источником является:

`docs/gdd/02_ECONOMY_FIRST_120_MINUTES.md`

Если ранний GDD содержит другие числа или времена, он трактуется как концептуальный документ, а экономика — как актуальная tuning specification.

### Consequence

Codex не должен брать цены и тайминги из ранних разделов GDD, если соответствующее значение уже определено в economy document.

---

## DEC-004 — Канонические milestone times Timeline #1

**Status:** accepted  
**Date:** 2026-09-15

### Decision

Для реализации и telemetry используются следующие целевые точки:

| Milestone | Target |
|---|---:|
| Self Replication | 02:00 |
| Proto-cell | 10:00 |
| Multicellularity | 26:00 |
| Sapience | 46:00 |
| Tribe | 56:00 |
| Agriculture | 62:00 |
| City | 80:00 |
| Industry | 94:00 |
| Atomic Age | 108:00 |
| Ash | ~116:00 |
| Reset | ~120:00 |

Это target windows, а не жёсткие таймеры, кроме сюжетных clamps кризиса.

---

## DEC-005 — Ресурсная модель ранней биологии

**Status:** accepted  
**Date:** 2026-09-15

### Decision

Для текущей implementation specification основными числовыми ресурсами биологической части являются:

- `Energy`;
- `Information`;
- `Biomass`.

RNA/DNA остаются частью тематики, текста, технологий и визуального языка, но не обязаны существовать как отдельные глобальные runtime currencies в первом вертикальном срезе.

### Reason

Числовая экономика и дерево эволюции уже согласованы вокруг Energy / Information / Biomass.

### Consequence

Если позднее решено вернуть RNA/DNA как отдельные currencies, это оформляется новым decision record и отдельным rebalance pass.

---

## DEC-006 — Resource visibility

**Status:** accepted  
**Date:** 2026-09-15

### Decision

Игрок не должен видеть все существующие ресурсы одновременно.

Целевые наборы:

- molecular: Energy / Information;
- cellular: Energy / Information / Biomass;
- civilization: Food / Materials / Knowledge / Population;
- industry: Food / Materials / Knowledge / Power / Population;
- crisis: Materials / Knowledge / Power / Stability.

UI показывает главным образом контекстные ресурсы текущей эры.

---

## DEC-007 — Первый ending неизбежен

**Status:** accepted  
**Date:** 2026-09-15

### Decision

В Timeline #1 ending **«Пепел»** сюжетно неизбежен.

Игрок может влиять на:

- путь к кризису;
- Stability;
- варианты финального события;
- Chronicle;
- награду;
- narrative flags.

Но идеальная экономика не должна позволять отменить первый ending.

### Reason

Первый ending является обучением prestige/reset и главным сюжетным reveal.

---

## DEC-008 — Reset не является поражением

**Status:** accepted  
**Date:** 2026-09-15

### Decision

Reset представляется как завершённая история цивилизации и перенос Памяти Архива.

Перед подтверждением reset игроку явно показывается:

### Сохраняется
- Archive progression;
- Chronicle;
- achievements;
- открытые записи и flags;
- предусмотренные permanent rewards.

### Сбрасывается
- ресурсы run;
- population;
- buildings;
- обычные technologies текущего Timeline.

---

## DEC-009 — Data-driven gameplay

**Status:** accepted  
**Date:** 2026-09-15

### Decision

Следующие сущности должны быть data-driven настолько, насколько это позволяет существующая архитектура:

- evolution nodes;
- technologies;
- buildings;
- jobs;
- goals;
- quests;
- events;
- costs;
- effects;
- narrative flags;
- endings.

UI не должен быть источником gameplay state.

---

## DEC-010 — Не переписывать engine без доказанной необходимости

**Status:** accepted  
**Date:** 2026-09-15

### Decision

Существующую логику Evolve нужно переиспользовать, если она соответствует новой модели или может быть адаптирована через domain/presentation adapter.

Полный rewrite допустим только для подсистемы, если code audit показывает, что адаптация:

- сложнее;
- рискованнее;
- хуже тестируется;
- сильнее связывает новый UI с legacy DOM.

---

## DEC-011 — Новый UI поверх normalized state

**Status:** accepted  
**Date:** 2026-09-15

### Decision

Между legacy logic и новым интерфейсом должен существовать слой нормализованного состояния.

Он должен предоставлять UI:

- current resources;
- production;
- milestone;
- goals;
- evolution state;
- civilization state;
- story flags;
- visual state;
- crisis state;
- meta state.

Новый UI не должен напрямую зависеть от большого количества legacy DOM selectors или внутренних side effects.

---

## DEC-012 — Mobile-first

**Status:** accepted  
**Date:** 2026-09-15

### Decision

Основной UX проектируется mobile-first.

Главные interactions не требуют hover.

Основные touch targets — не менее 44 px.

Диорама остаётся главным визуальным элементом экрана.

---

## DEC-013 — Итерационная реализация

**Status:** accepted  
**Date:** 2026-09-15

### Decision

Codex реализует проект последовательными playable slices.

Запрещён подход:

> «сначала реализовать все системы, потом собрать игру».

Каждая крупная итерация должна заканчиваться работающим участком progression и проверяемым Definition of Done.

---

## DEC-014 — Dev time acceleration

**Status:** accepted  
**Date:** 2026-09-15

### Decision

Для разработки и QA обязательно предусмотреть debug time scale.

Минимальные режимы:

- 1×;
- 5×;
- 20×;
- 100×.

Debug acceleration не попадает в production UI.

---

## DEC-015 — Реклама не участвует в базовом балансе

**Status:** accepted  
**Date:** 2026-09-15

### Decision

Первый Timeline должен укладываться в целевой balance window без rewarded/interstitial ads.

Rewarded может ускорять прогресс, но не должен быть необходим для прохождения.

---

## DEC-016 — Арт как layered diorama

**Status:** accepted  
**Date:** 2026-09-15

### Decision

Главный мир не реализуется как полноценный city builder.

Визуальный state собирается слоями:

- background;
- terrain;
- settlement;
- landmarks;
- production overlays;
- moving props;
- environment;
- VFX.

Это позволяет менять эпоху и ветвление без симуляции тысяч индивидуальных объектов.

---

## DEC-017 — Контент создаётся отдельно от имплементации

**Status:** accepted  
**Date:** 2026-09-15

### Decision

Сценарные тексты, арт-спецификации, asset manifests, generation prompts и audio specs создаются в документации до или параллельно implementation.

Codex занимается интеграцией и программной частью, а не самостоятельно формирует канонический контент проекта.

---

## DEC-018 — Каноническая цивилизационная модель Timeline #1

**Status:** accepted  
**Date:** 2026-09-15

### Decision

Для gameplay v1 в диапазоне примерно 46–108 минут каноническая модель использует:

- Food / Materials / Knowledge / Population;
- Power после City;
- фазовые jobs из DS-01;
- buildings/infrastructure из economy specification;
- культурные и технологические branches T01–A06.

Следующие ранние GDD-концепты не являются отдельными обязательными gameplay entities v1 без нового balance decision:

- Merchant как отдельный job;
- Wood / Stone / Metal как отдельные global currencies;
- industrial Energy как отдельный ресурс вместо Power;
- Radio и Computing precursor как обязательные tech prerequisites;
- отдельная Global Civilization economy era;
- отдельные pre-crisis Atomic Lab / Research Reactor buildings.

Trade-lite представлен Market + Exchange. Ранние generic названия Power Plant / Motor маппятся на текущие Steam Plant / Grid Station / Mechanization / Electrical Grid.

### Affected documents

- `docs/gdd/04_CIVILIZATION_PROGRESSION.md`
- `docs/gdd/05_BUILDINGS_AND_JOBS.md`
- `docs/gdd/06_TECH_TREE.md`

### Implementation consequence

Codex не должен создавать перечисленные deferred entities как обязательные runtime systems без обновления GDD и balance model.

---

## DEC-019 — Профессии сменяются по фазам, а не накапливаются

**Status:** accepted  
**Date:** 2026-09-15

### Decision

Каждая цивилизационная фаза имеет один активный displayed job set:

- Tribe;
- Settlement;
- City;
- Industry.

После перехода в следующую фазу устаревшие job labels не продолжают существовать как параллельные способы производить тот же ресурс. Точный алгоритм переноса назначенной Population определяется в DS-03/DS-06.

### Reason

Это сохраняет читаемый People/Jobs UI и не создаёт параллельные production paths, которых нет в балансе.

### Implementation consequence

Data model должна поддерживать phase-aware job availability и безопасную migration/reassignment логику.

---

## DEC-020 — Tribe structures unique, поздняя infrastructure stackable

**Status:** accepted  
**Date:** 2026-09-15

### Decision

В Timeline #1:

- Hearth, Shelter, Tool Bench, Hunting Ground, Story Circle и Clan Camp — unique phase structures;
- Settlement / City / Industry infrastructure с заданным growth factor — stackable;
- production count milestones 10/25/50 не применяются автоматически к unique Tribe structures.

### Reason

В economy specification tribal structures имеют фиксированную цену без growth, тогда как поздние buildings явно имеют Base cost + Growth.

### Implementation consequence

Building schema должна различать unique structures и stackable infrastructure.

---

## DEC-021 — Ранний интерфейс должен показывать масштаб неизвестного контента

**Status:** accepted  
**Date:** 2026-09-15

### Decision

Уже в первые минуты игрок должен понимать, что текущая стадия — малая часть большого Архива. Игра заранее показывает существование будущих ветвей, Chronicle/Timeline records, anomalies, outcomes, achievements и других областей, но скрывает содержание и сюжетные спойлеры.

Locked content подаётся через язык Архива (`???`, повреждённые/неизвестные записи, silhouettes, fogged branches, incomplete collections), а не только через однообразные серые замки.

Фиксированные collection totals нельзя показывать для контента, который ещё не существует или не гарантирован release scope.

### Reason

Первый Timeline должен продавать не только следующий upgrade, но и долгосрочное чувство исследования, коллекционирования историй и открытия неизвестных слоёв игры.

### Affected documents

- `docs/production/DS-02_PRODUCT_INPUTS.md`
- DS-02 goals/reveal hooks;
- DS-05 narrative package;
- DS-06 UX/locked states.

### Implementation consequence

Domain/presentation state должен уметь различать как минимум known/open, known/locked, unknown/corrupted и discovered content states там, где это требуется UX contract.

---

## DEC-022 — Ручной input запускает процесс, а не даёт +1 ресурс

**Status:** accepted  
**Date:** 2026-09-15

### Decision

В ранней игре ручной клик сохраняется для ощущения причастности, но означает запуск timed process/cycle: реакции, каталитического процесса, клеточного деления или аналогичного действия. Один клик не должен линейно выдавать `+1 ресурс`, а постоянный spam clicking не является оптимальной стратегией.

С progression ручная зависимость должна естественно исчезать:

**manual process → self-replication / semi-auto → automation.**

После автоматизации активное вмешательство может вернуться как редкая способность `Archive Intervention`: временный boost выбранного ресурса. Позднее эта способность может быть связана с rewarded ad, но baseline pacing обязан оставаться полностью проходимым без рекламы.

### Reason

Это сохраняет tactile involvement и зрелищность раннего зарождения жизни, не превращая игру в clicker grind и не создавая autoclicker abuse.

### Affected documents

- `docs/production/DS-02_PRODUCT_INPUTS.md`;
- DS-02 onboarding/goals;
- DS-04 возможные meta-upgrades;
- DS-06 UX states;
- DS-10 rewarded/platform/analytics contract.

### Implementation consequence

Early manual actions требуют duration/busy/progress state и пакетного результата. DS-06 обязан определить interaction/feedback, DS-10 — rewarded flow, charges/cooldowns/fallback/analytics и monetization limits Archive Intervention.

---

## DEC-023 — Release 1 ведёт к Bioseed, а Timeline #1 является первой главой

**Status:** accepted
**Date:** 2026-09-16

### Decision

Release 1 сохраняет глубину основных семейств механик оригинального Evolve и
ведёт к первому Bioseed ориентировочно за 8–12 часов активной игры. Первый
Timeline `T1 Origin` — законченная глава RNA → Ash на 105–120 минут, но не
весь scope продукта.

Механики возвращаются по утверждённым reset-эпохам: `T2 Memory`, `T3
Divergence`, `T4 Sky`, `T5 Exodus`, затем `P1+ Worlds` и `U1+ Beyond`.
Крупные семейства не считаются вырезанными, если для них назначена эпоха;
сокращаются только opaque legacy formulas, дублирующие микросистемы и
постоянный ручной micromanagement.

### Reason

PRD прямо требует сохранить evolution, jobs, buildings, tech, species,
prestige, space, Bioseed, challenges и late routes. Ранние GDD скрывали
поздние системы без календаря их возвращения, из-за чего вертикальный срез
выглядел как сокращение продукта.

### Implementation consequence

`docs/gdd/12_LONG_TERM_PROGRESSION_AND_RESET_ROADMAP.md` — канонический
порядок возвращения механик. Перед runtime-работой каждой поздней эпохи нужен
её подробный GDD; нельзя создавать поздние UI/runtime stubs только потому,
что эпоха уже обозначена на roadmap.

---

## DEC-024 — Полная пересборка Timeline #1 начинается с Event Engine

**Status:** accepted
**Date:** 2026-09-16

### Decision

Следующая gameplay-программа — `timeline1-v3-full`: единый T1 от RNA до Ash,
а не набор независимых post-Cell итераций. Принятый `0–18` biological slice
сохраняется как baseline, но проходит общий audit и rebalance вместе с полным
run.

Первый пакет `T1-0` создаёт config-driven Event Engine. Minor/major
procedural deck работает в T1 одновременно с authored milestones, branch и
crisis events; seed, deck state, cooldowns и outcomes сохраняются в save.

### Reason

Случайные события, в том числе DNA/RNA rewards, были частью core loop
оригинального Evolve и должны влиять на первый опыт. Реализация контента без
общего event contract привела бы к нескольким несовместимым event paths и
непроверяемым сейвам.

### Implementation consequence

Рабочий порядок и gates зафиксированы в
`docs/production/TIMELINE_01_REBUILD_PLAN.md`. Ruleset получает отдельный
идентификатор `timeline1-v3-full`; version ruleset и schema version не
смешиваются. `T2` runtime не начинается до `T1-7` full-run regression.

---

# Open decisions

Следующие вопросы пока требуют отдельного решения:

- точный framework нового UI после code audit;
- формат gameplay configs;
- использовать ли текущий save format или вводить новый versioned wrapper;
- точная архитектура portal SDK abstraction;
- набор визуальных ветвей для первого публичного билда;
- точные numerical gates для `Guardians`, `Orbit` и `Exodus`;
- точный scope expedition economy и planet generation для `T4–T5`.
