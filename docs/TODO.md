# Хроники Эволюции — TODO

**Last update:** 2026-09-15

---

# Current phase

## Documentation + Pre-implementation

Главная задача текущей фазы:

1. привести документацию к единой структуре;
2. устранить ключевые противоречия;
3. провести code audit исходного Evolve;
4. подготовить gameplay contract;
5. начать реализацию первого Timeline небольшими playable slices.

---

# Current implementation iteration

## Iteration 0 — Existing Code Audit

**Status:** not started

### Goal

Понять, какие части исходного Evolve можно переиспользовать, а какие должны быть изолированы новым domain/presentation layer.

### Codex TODO

- [ ] Найти основной game loop.
- [ ] Найти систему ресурсов и production.
- [ ] Найти систему buildings/upgrades.
- [ ] Найти tech/evolution data.
- [ ] Найти population/jobs.
- [ ] Найти reset/prestige logic.
- [ ] Найти save/load.
- [ ] Найти offline progression.
- [ ] Найти analytics/platform-related integrations, если есть.
- [ ] Определить зависимость gameplay logic от legacy DOM.
- [ ] Определить участки, которые можно использовать без изменений.
- [ ] Определить участки, требующие adapter.
- [ ] Определить участки, которые разумнее заменить.
- [ ] Составить карту ключевых модулей.
- [ ] Подготовить `docs/technical/01_EXISTING_CODE_AUDIT.md`.

### Definition of Done

- [ ] Есть карта architecture/modules.
- [ ] Определён game state ownership.
- [ ] Определён основной tick/update loop.
- [ ] Понятно, где происходят production calculations.
- [ ] Понятно, где хранится save.
- [ ] Понятно, как устроен reset.
- [ ] Есть список reusable subsystems.
- [ ] Есть список legacy risks.
- [ ] Нет крупных изменений production code в рамках audit.

---

# Documentation status

## Foundation

- [x] PRD.
- [x] GDD первых 120 минут.
- [x] Экономика первых 120 минут.
- [x] Дерево эволюции.
- [x] Narrative Bible / план сценария.
- [x] План структуры документации.
- [x] План реализации по итерациям.
- [x] `README.md`.
- [x] `DECISIONS.md`.
- [x] `GLOSSARY.md`.
- [x] `TODO.md`.

---

# GDD — next documents

Приоритет генерации:

- [ ] `gdd/04_CIVILIZATION_PROGRESSION.md`
- [ ] `gdd/05_BUILDINGS_AND_JOBS.md`
- [ ] `gdd/06_TECH_TREE.md`
- [ ] `gdd/07_GOALS_AND_MILESTONES.md`
- [ ] `gdd/08_EVENTS_AND_CHOICES.md`
- [ ] `gdd/09_ENDINGS_AND_RESET.md`
- [ ] `gdd/10_META_PROGRESSION.md`
- [ ] `gdd/11_BALANCE_RULES.md`

---

# Scenario — next documents

- [ ] `scenario/01_TIMELINE_01_SCRIPT.md`
- [ ] `scenario/04_STORY_EVENTS.md`
- [ ] `scenario/05_NARRATIVE_FLAGS.md`
- [ ] `scenario/06_ENDINGS_COPY.md`
- [ ] `scenario/07_COPY_GUIDE.md`

Timeline #2 подробно писать только после стабилизации первого Timeline, кроме teaser/reset сцены.

---

# UX — next documents

- [ ] `ux/00_UX_PRINCIPLES.md`
- [ ] `ux/01_SCREEN_MAP.md`
- [ ] `ux/02_MOBILE_WIREFRAMES.md`
- [ ] `ux/03_DESKTOP_WIREFRAMES.md`
- [ ] `ux/04_COMPONENT_STATES.md`
- [ ] `ux/05_TUTORIAL_AND_HINTS.md`

### UX priority

Mobile-first.

Сначала:

1. gameplay screen;
2. goal card;
3. resources;
4. building/upgrade bottom sheet;
5. evolution tree;
6. event choice;
7. era transition;
8. ending/reset.

---

# Art — next documents

- [ ] `art/00_ART_DIRECTION.md`
- [ ] `art/01_LOCATIONS_AND_DIORAMAS.md`
- [ ] `art/02_ERA_TRANSITIONS.md`
- [ ] `art/03_BUILDINGS_AND_PROPS.md`
- [ ] `art/04_ASSET_MANIFEST.md`
- [ ] `art/05_GENERATION_PROMPTS.md`

### Required first-Timeline visual states

- [ ] V0 Primordial.
- [ ] V1 Cellular.
- [ ] V2 Creature.
- [ ] V3 Tribe.
- [ ] V4 Settlement.
- [ ] V5 City.
- [ ] V6 Industrial.
- [ ] V7 Atomic.
- [ ] V8 Ash.

---

# Audio — next documents

- [ ] `audio/00_AUDIO_DIRECTION.md`
- [ ] `audio/01_MUSIC_CUES.md`
- [ ] `audio/02_AMBIENCE.md`
- [ ] `audio/03_SFX_LIBRARY.md`
- [ ] `audio/04_STINGERS.md`
- [ ] `audio/05_GENERATION_PROMPTS.md`

### Minimum first-Timeline audio

- [ ] primordial ambience;
- [ ] cellular ambience;
- [ ] creature/nature ambience;
- [ ] tribe music;
- [ ] settlement music;
- [ ] city music;
- [ ] industrial music;
- [ ] atomic tension layer;
- [ ] crisis music;
- [ ] Ash aftermath;
- [ ] milestone stingers;
- [ ] unlock SFX;
- [ ] build/upgrade SFX;
- [ ] UI feedback SFX.

---

# Technical documentation

After Iteration 0:

- [ ] `technical/00_TECHNICAL_OVERVIEW.md`
- [ ] `technical/02_DOMAIN_ADAPTER.md`
- [ ] `technical/03_GAME_STATE.md`
- [ ] `technical/04_SAVE_ARCHITECTURE.md`
- [ ] `technical/05_ANALYTICS_SCHEMA.md`
- [ ] `technical/06_PLATFORM_INTEGRATION.md`
- [ ] `technical/07_TESTING_STRATEGY.md`

---

# Implementation roadmap status

Использовать:

`docs/production/IMPLEMENTATION_ITERATION_PLAN.md`

Высокоуровнево:

- [ ] Iteration 0 — Existing Code Audit.
- [ ] Iteration 1 — Domain Adapter foundation.
- [ ] Iteration 2 — Normalized Game State.
- [ ] Iteration 3 — New gameplay shell.
- [ ] Iteration 4 — 0–10 min playable.
- [ ] Iteration 5 — 10–26 min playable.
- [ ] Iteration 6 — 26–46 min playable.
- [ ] Iteration 7 — Sapience transition.
- [ ] Iteration 8 — Tribe.
- [ ] Iteration 9 — Settlement.
- [ ] Iteration 10 — City.
- [ ] Iteration 11 — Industry.
- [ ] Iteration 12 — Atomic Age.
- [ ] Iteration 13 — Crisis.
- [ ] Iteration 14 — Ash ending.
- [ ] Iteration 15 — Reset / Archive.
- [ ] Iteration 16 — Timeline #2 teaser.
- [ ] Iteration 17 — Art integration.
- [ ] Iteration 18 — Audio integration.
- [ ] Iteration 19 — Offline progression.
- [ ] Iteration 20 — Analytics.
- [ ] Iteration 21 — Yandex/VK platform integration.
- [ ] Iteration 22 — Balance simulator.
- [ ] Iteration 23 — QA / release candidate.

Порядок может корректироваться после code audit, но изменения фиксируются в `DECISIONS.md`.

---

# Product blockers

## Critical

- [ ] Провести code audit до решения о framework/масштабе refactor.
- [ ] Формализовать Buildings & Jobs.
- [ ] Формализовать Tech Tree.
- [ ] Формализовать Goals/Milestones.
- [ ] Формализовать Events/Narrative Flags до кризиса.
- [ ] Формализовать ending/reset contract.

## Non-critical for Iteration 0

- альтернативные endings;
- глубокий Space;
- Bioseed;
- late-game species;
- challenge modes;
- universes;
- daily systems.

---

# Open questions

- [ ] Какой UI framework используется/будет использоваться после code audit?
- [ ] Какой формат configs выбрать: JS/TS objects, JSON или другой?
- [ ] Насколько legacy save совместим с новой domain model?
- [ ] Нужна ли полная миграция старых save или достаточно нового clean save?
- [ ] Как абстрагировать Yandex/VK SDK?
- [ ] Какой набор branch visuals войдёт в первый публичный build?
- [ ] Нужен ли отдельный visible World Tension или достаточно Stability + risk explanations?
- [ ] Как именно пользовательское название Archive currency будет отображаться в UI?

---

# Rules for Codex

Перед любой implementation iteration:

- [ ] прочитать `README.md`;
- [ ] прочитать `DECISIONS.md`;
- [ ] прочитать `GLOSSARY.md`;
- [ ] прочитать этот `TODO.md`;
- [ ] прочитать текущую iteration в implementation plan;
- [ ] прочитать входные design docs.

Во время работы:

- [ ] не придумывать missing gameplay rules самостоятельно;
- [ ] не делать большой unrelated refactor;
- [ ] не менять баланс без требования;
- [ ] не переходить к следующей iteration автоматически;
- [ ] сохранять data-driven подход;
- [ ] писать/обновлять тесты.

После работы:

- [ ] проверить Definition of Done;
- [ ] обновить TODO;
- [ ] перечислить изменённые файлы;
- [ ] перечислить риски;
- [ ] перечислить unresolved questions;
- [ ] зафиксировать новые архитектурные решения в `DECISIONS.md`.

---

# Next action

## Для документации

Сформировать следующий gameplay-contract пакет:

1. `04_CIVILIZATION_PROGRESSION.md`
2. `05_BUILDINGS_AND_JOBS.md`
3. `06_TECH_TREE.md`
4. `07_GOALS_AND_MILESTONES.md`
5. `08_EVENTS_AND_CHOICES.md`
6. `09_ENDINGS_AND_RESET.md`

## Для Codex

Параллельно выполнить:

**Iteration 0 — Existing Code Audit**

Без изменения gameplay и без крупного refactor.
