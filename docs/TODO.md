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

**Status:** ready / may run in parallel

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

DS-04 можно использовать как дополнительный contract для meta config/schema, но Iteration 1 не обязана реализовывать полный meta UX/rewarded flow.

Не делать сейчас:

- [ ] full UI rewrite;
- [ ] Yandex/VK SDK;
- [ ] cloud save;
- [ ] mass legacy refactor;
- [ ] глубокий Space/Bioseed scope.

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

1. **Codex:** Iteration 1 по `DS03_CODEX_HANDOFF.md`.
2. **ChatGPT/user:** DS-05 — Timeline #1 full narrative package.
