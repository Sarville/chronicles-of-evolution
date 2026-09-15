# Хроники Эволюции — TODO

**Last update:** 2026-09-15

> `TODO.md` — короткое представление текущей работы. Канонический статус хранится в `docs/PROJECT_STATE.yaml`.

---

# Current phase

## Documentation design

Формат работы:

**одна design session -> один чат -> пакет связанных документов -> пользовательская проверка -> state/TODO update -> push -> новый чат.**

---

# Last completed design session

## DS-02 — Goals, events and first ending contract

**Status:** done

Accepted documents:
- [x] `docs/gdd/07_GOALS_AND_MILESTONES.md`
- [x] `docs/gdd/08_EVENTS_AND_CHOICES.md`
- [x] `docs/gdd/09_ENDINGS_AND_RESET.md`

Зафиксировано:
- [x] 24 core goals `G001–G024` для Timeline #1;
- [x] canonical timing использует economy v1.0: Sapience ~46, City ~80, Industry ~94, Atomic ~108, Ash ~116, reset ~120 минут;
- [x] обязательные branch/narrative/crisis events имеют stable IDs и triggers;
- [x] World Tension = `100 - Stability`, одна система с двумя представлениями;
- [x] Energy Crisis и A01 pre-atomic specialization разделены как разные решения;
- [x] `Следы до нас`, `ERROR 17`, `Снова.` формируют persistent mystery hooks;
- [x] Timeline #1 всегда сходится в `ENDING_ASH`, но Last Protocol меняет subtype/Chronicle/flags;
- [x] первый reset использует `Фрагменты Архива (AF)` с целевым reward 14–18;
- [x] `Память Архива` — название meta-system, а не параллельная spendable currency;
- [x] Chronicle/meta state сохраняется до очистки run state;
- [x] reset transaction должен быть idempotent;
- [x] ранний интерфейс показывает масштаб неизвестного контента через locked/unknown/corrupted states;
- [x] ручное действие запускает процесс/cycle и естественно переходит в self-replication/automation.

Также обновлена ревизия DS-01:
- [x] `docs/gdd/04_CIVILIZATION_PROGRESSION.md`;
- [x] `docs/gdd/05_BUILDINGS_AND_JOBS.md`;
- [x] `docs/gdd/06_TECH_TREE.md`.

Ревизия уточняет entity roles, stable IDs, Goal/Event mapping и implementation-facing contracts без изменения канонических economy values.

---

# Current design session

## DS-03 — Technical architecture and data contract

**Status:** ready

### Goal

Определить границу между legacy Evolve, новым gameplay/domain contract и presentation layer так, чтобы Codex мог реализовывать Timeline #1 без самостоятельного проектирования доменной модели.

### Inputs
- `docs/technical/01_EXISTING_CODE_AUDIT.md`
- `docs/gdd/02_ECONOMY_FIRST_120_MINUTES.md`
- `docs/gdd/03_EVOLUTION_TREE.md`
- `docs/gdd/04_CIVILIZATION_PROGRESSION.md`
- `docs/gdd/05_BUILDINGS_AND_JOBS.md`
- `docs/gdd/06_TECH_TREE.md`
- `docs/gdd/07_GOALS_AND_MILESTONES.md`
- `docs/gdd/08_EVENTS_AND_CHOICES.md`
- `docs/gdd/09_ENDINGS_AND_RESET.md`
- `docs/DECISIONS.md`

### Deliverables
- [ ] `docs/technical/00_TECHNICAL_OVERVIEW.md`
- [ ] `docs/technical/02_DOMAIN_ADAPTER.md`
- [ ] `docs/technical/03_GAME_STATE.md`
- [ ] `docs/technical/04_SAVE_ARCHITECTURE.md`
- [ ] `docs/technical/07_TESTING_STRATEGY.md`

### Must decide
- [ ] граница legacy engine / новый gameplay contract / presentation;
- [ ] normalized game state;
- [ ] entity schemas и stable IDs;
- [ ] domain-event model;
- [ ] canonical gameplay config location/format recommendation;
- [ ] save wrapper и migration approach;
- [ ] test seams и headless simulation contract;
- [ ] mapping найденных Codex loop/resource/payment/save primitives;
- [ ] что переиспользуется и что не переписывается;
- [ ] debug/time-acceleration инструменты для полного Timeline #1;
- [ ] automated milestone timing checks.

### Review gate
- [ ] Codex может завершить Iteration 0 без design guesses;
- [ ] Codex может начать Iteration 1 Domain adapter/data foundation;
- [ ] game-design values находятся в config/data, не в UI;
- [ ] TODO/TBD из design docs остаются configurable и не получают придуманные значения;
- [ ] save/reset contract поддерживает idempotent first reset;
- [ ] headless simulation может прогнать Timeline #1 с ускорением и проверить pacing windows.

После approval DS-03 implementation можно возобновить параллельно с DS-04/DS-05/DS-06.

---

# Parallel design tracks after DS-03

## DS-04 — Meta progression and balance rules

**Status:** ready

Основные темы:
- [ ] AF/meta economy;
- [ ] Archive Tree;
- [ ] Timeline #2 acceleration;
- [ ] retained traits/hybridization;
- [ ] catch-up/anti-snowball;
- [ ] offline rules;
- [ ] Archive Intervention upgrades/limits при необходимости.

## DS-05 — Timeline #1 full narrative package

**Status:** ready

Основные темы:
- [ ] точный сценарный sequencing 0–120;
- [ ] короткие реплики Архива;
- [ ] milestone copy;
- [ ] Story events;
- [ ] Error 17 / «Снова.» / Last Protocol / Ash;
- [ ] narrative flags;
- [ ] ending/Chronicle copy.

## DS-06 — UX architecture and wireframes

**Status:** ready

Обязательно оформить:
- [ ] mobile-first shell;
- [ ] resource/goal/navigation layout;
- [ ] evolution/tech/building/job screens;
- [ ] event choices;
- [ ] crisis/ending/reset UI;
- [ ] locked / unknown / corrupted states;
- [ ] Archive/collection preview;
- [ ] manual process busy/progress feedback;
- [ ] переход manual -> automation;
- [ ] Archive Intervention UI contract.

---

# Codex / implementation

## Iteration 0 — Repo baseline and code audit

**Status:** partial / paused for DS-03

### Уже сделано
- [x] Static code audit.
- [x] Module/architecture reconnaissance.
- [x] Найдены game loop, resource/payment primitives, save/reset, UI boundaries.
- [x] Проверено отсутствие Yandex/VK platform abstraction.
- [x] Создан `docs/technical/01_EXISTING_CODE_AUDIT.md`.

### Осталось перед закрытием Iteration 0
- [ ] Baseline build confirmation.
- [ ] Baseline bundle size.
- [ ] Baseline startup measurement.
- [ ] Решить/добавить smoke command/script.

### Gate

Не начинать Iteration 1 до approval **DS-03 — Technical architecture and data contract**.

После DS-03 Codex получает чёткий первый implementation slice:

```text
config/data registries
-> domain adapter
-> resources/production
-> evolution/tech nodes
-> buildings/jobs
-> Goal Engine
-> Event Engine
-> Era State Machine
-> crisis/reset
-> headless/debug simulation
```

Финальный production UI в этот момент ещё не является обязательным; допускается developer/debug interface.

---

# Current open decisions

DS-03 должен закрыть или дать recommendation по следующим вопросам:

- [ ] exact UI framework / степень reuse Vue 2;
- [ ] canonical gameplay config format;
- [ ] legacy save compatibility vs clean versioned wrapper;
- [ ] portal SDK abstraction boundary.

Уже закрыто DS-02:
- [x] World Tension vs Stability;
- [x] first-reset spendable currency = Archive Fragments (AF).

---

# Rules for this phase

- [ ] Не начинать gameplay Iteration 1 до DS-03 approval.
- [ ] Не менять economy/tech prerequisites без design decision.
- [ ] Не переносить TBD values в hardcoded constants.
- [ ] Не расширять Timeline #1 глубоким Space/Bioseed.
- [ ] Техническая архитектура должна поддержать DEC-021/DEC-022: discoverability states и process-based manual onboarding.
- [ ] После approval обновлять `PROJECT_STATE.yaml` и этот TODO в одном push cycle.

---

# Start command for next chat

> Продолжаем Хроники Эволюции. Открой GitHub, прочитай `docs/PROJECT_STATE.yaml` и начинай DS-03 — Technical architecture and data contract.
