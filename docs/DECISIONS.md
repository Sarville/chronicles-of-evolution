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

# Open decisions

Следующие вопросы пока требуют отдельного решения:

- точный framework нового UI после code audit;
- формат gameplay configs;
- использовать ли текущий save format или вводить новый versioned wrapper;
- точная архитектура portal SDK abstraction;
- набор визуальных ветвей для первого публичного билда;
- какие альтернативные endings войдут в Release 1 помимо «Пепла»;
- точный scope раннего Space/Bioseed в Release 1.
