# Хроники Эволюции — TODO

**Last update:** 2026-09-15

> `TODO.md` — короткое представление текущей работы. Канонический статус хранится в `docs/PROJECT_STATE.yaml`.

---

# Last completed design session

## DS-04 — Meta progression and balance rules

**Status:** done / accepted

Приняты документы:

- [x] `docs/gdd/10_META_PROGRESSION.md`
- [x] `docs/gdd/11_BALANCE_RULES.md`
- [x] `docs/DECISIONS_DS04.md`

Зафиксировано:

- [x] first reset typical reward: 14–18 AF;
- [x] Archive Recall автоматически включается после первого reset;
- [x] familiar pre-Sapience CORE: cost ×0.75, production ×1.25;
- [x] Timeline #2 Sapience p50 target: 20–28 мин;
- [x] no-spend target: 24–28 мин; typical Tier 1: 20–25 мин;
- [x] familiar CORE cost floor: 70%;
- [x] pre-Sapience meta production cap: ×1.60;
- [x] AR05 = retained OPTIONAL slot;
- [x] AR06 = second cellular branch without ×2.5, но без dual numeric stacking;
- [x] AR09 = one secondary biological trait at 65%;
- [x] offline: T1 50%, AR04 60%, future hard cap 75%;
- [x] Archive Intervention envelope: ×1.50, 120 sec base, <=180 sec, <=3 charges, no stacking;
- [x] ads не входят в baseline balance и не увеличивают AF.

---

# Codex / implementation

## Iteration 0 — Repo baseline and code audit

**Status:** done

- [x] static code audit;
- [x] architecture/module map;
- [x] baseline build confirmed;
- [x] `npm run smoke` added;
- [x] `docs/technical/01_EXISTING_CODE_AUDIT.md` created.

## Iteration 1 — Domain adapter and data foundation

**Status:** done / gate passed

Primary handoff:

`docs/production/DS03_CODEX_HANDOFF.md`

Основной scope:

```text
src/chronicles structure
-> serializable config registries
-> validators
-> canonical GameState
-> commands/domain events/selectors
-> Resource/Cost/Production services
-> clock/storage/RNG/localization/platform ports
-> save repository skeleton
-> tests
-> headless simulation shell
```

Реализовано в Iteration 1:

- [x] isolated `src/chronicles/` structure;
- [x] serializable config registries and runtime validators;
- [x] canonical initial `GameState`;
- [x] commands, immutable domain events and selectors;
- [x] pure Resource / Cost / Production services;
- [x] clock / RNG / storage / localization / platform ports;
- [x] save repository skeleton with `chronicles_evolution` namespace;
- [x] config/domain/save/simulation headless tests;
- [x] minimal real entity flow using canonical early producer/node and `BLD_FIELD`;
- [x] `npm test`, `npm run test:sim`, `npm run smoke`, `npm run build`.

DS-04 можно использовать как дополнительный contract для meta config/schema, но Iteration 1 не реализует полный meta UX/rewarded flow.

Не делать сейчас:

- [ ] full UI rewrite;
- [ ] Yandex/VK SDK;
- [ ] cloud save;
- [ ] mass legacy refactor;
- [ ] глубокий Space/Bioseed scope.

---

## Iteration 2 — Save v1 and dev tools

**Status:** done / gate passed

Реализовано в Iteration 2:

- [x] versioned save envelope v1;
- [x] run/meta/settings/narrative flags save normalization;
- [x] autosave controller for dirty periodic/flush saves;
- [x] corrupt-save fallback through primary/pending/backup recovery;
- [x] migration/normalization interface;
- [x] reset transaction save coverage preserving meta state;
- [x] dev-only time scale: 1x / 5x / 20x / 100x;
- [x] dev resource grant;
- [x] dev jump-to-era;
- [x] dev trigger-event;
- [x] dev dump-state;
- [x] save/load equality, autosave, migration noop, invalid save recovery, reset/meta and dev tools tests;
- [x] `npm test`, `npm run test:sim`, `npm run smoke`, `npm run build`.

Correction pass:

- [x] `manualDevReset()` preserves meta/settings and creates a clean dev-only run;
- [x] `triggerEvent()` uses canonical `events.queue = [eventId]` and `events.states[eventId]`;
- [x] reset transaction foundation supports prepared canonical transaction IDs and idempotent application;
- [x] corrupt-all recovery returns explicit `RECOVERY_REQUIRED` instead of silently creating a new run;
- [x] Iteration 3 not started.

Micro-fix:

- [x] reset transaction ID is canonical and stable: `timeline_001_ending_ENDING_ASH`;
- [x] `createdAtSimulationMs` is informational, not part of idempotency identity;
- [x] `meta.appliedTransactions` is canonical array-of-IDs;
- [x] regression test covers retry with different simulation timestamps.

---

# Next implementation

## Iteration 3 — Goal engine + tutorial shell

**Status:** done / gate passed

Выполнено как расширенная Iteration 3: goal engine + tutorial shell + early playable 0–10 min slice до Proto-cell.

Основной scope:

- [x] current goal state;
- [x] goal prerequisites;
- [x] completion conditions;
- [x] reward application foundation;
- [x] sequential chains;
- [x] optional goals;
- [x] hint timeout foundation;
- [x] CTA/highlight target;
- [x] chapter goal slot;
- [x] side/optional goal slot;
- [x] basic objective UI shell;
- [x] goal analytics/domain events foundation.

Early playable slice:

- [x] `chronicles.html` technical prototype entry point;
- [x] Energy / Information molecular resources;
- [x] manual primordial process before M01;
- [x] Chemical Gradient / Catalytic Fold / Energy Pocket generators;
- [x] M01 / M02 / M03 / M05 / M06 playable;
- [x] M04 optional and non-blocking;
- [x] save/load and autosave connected to playable runtime;
- [x] development-only speed/grant/reset/dump panel;
- [x] production build hides dev tools;
- [x] `npm test`, `npm run test:sim`, `npm run smoke`, `npm run build`.

Known tuning note:

- [x] 0–10 min balance pass completed. Competent simulation now reaches Proto-cell at ~09:20 without changing canonical node costs.
- [x] Final balance correction moved Self Replication into range (~02:25 competent) and reduced post-M02 optimal manual contribution to ~4.44% of automatic Energy income.

Correction pass:

- [x] recovery mode does not auto-create temporary gameplay/autosave;
- [x] explicit Start fresh required after corrupt save recovery;
- [x] manual primordial process remains available after M01;
- [x] M01 doubles manual reward;
- [x] stalled lifecycle persists without duplicate `goal_started` / hints / rewards;
- [x] objective CTA routes and focuses target entity;
- [x] lightweight `npm run test:ui` added.

## Iteration 4 — First content expansion after Proto-cell

**Status:** ready / not started

Не начинать без отдельного подтверждения. Следующий шаг — content expansion после M06, а не часть выполненной Iteration 3.

---

# Next design session

## DS-05 — Timeline #1 full narrative package

**Status:** ready

Нужно создать:

- [ ] `docs/scenario/01_TIMELINE_01_SCRIPT.md`
- [ ] `docs/scenario/04_STORY_EVENTS.md`
- [ ] `docs/scenario/05_NARRATIVE_FLAGS.md`
- [ ] `docs/scenario/06_ENDINGS_COPY.md`
- [ ] `docs/scenario/07_COPY_GUIDE.md`

Основные задачи:

- [ ] полный narrative sequencing 0–120;
- [ ] тексты Архива и milestones;
- [ ] Error 17 / «Снова.» / anomaly thread;
- [ ] crisis event chain;
- [ ] Last Protocol / Ash / Archive Summary;
- [ ] Timeline #2 teaser;
- [ ] narrative flags и последствия;
- [ ] meaning unknown/corrupted Archive records.

DS-06 UX также ready и может идти после/параллельно, но следующий основной design block — DS-05.

---

# Open decisions

- [ ] production UI framework / степень reuse Vue 2 — DS-06;
- [ ] Yandex/VK SDK mapping, cloud save conflicts, rewarded flow — DS-10;
- [ ] remaining TBD/proposal balance values остаются configurable до telemetry/testing.

---

# Следующий шаг

Параллельно:

1. **Codex:** остановиться после Iteration 3 correction pass; Iteration 4 запускать только по отдельному подтверждению.
2. **ChatGPT/user:** DS-05 — Timeline #1 full narrative package.
