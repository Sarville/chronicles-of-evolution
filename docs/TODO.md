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

**Status:** ready after user approval

Не начинать без отдельного подтверждения.

Основной scope:

- [ ] current goal state;
- [ ] goal prerequisites;
- [ ] completion conditions;
- [ ] reward application;
- [ ] sequential chains;
- [ ] optional goals;
- [ ] hint timeout;
- [ ] CTA/highlight target;
- [ ] chapter goal slot;
- [ ] destiny goal slot;
- [ ] basic objective UI shell;
- [ ] goal analytics.

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

1. **Codex:** остановиться после Iteration 2 micro-fix gate; Iteration 3 запускать только по отдельному подтверждению.
2. **ChatGPT/user:** DS-05 — Timeline #1 full narrative package.
