# Хроники Эволюции — TODO

**Last update:** 2026-09-15

> `TODO.md` — короткое представление текущей работы. Канонический статус хранится в `docs/PROJECT_STATE.yaml`.

---

# Last completed design session

## DS-03 — Technical architecture and data contract

**Status:** done / accepted

Приняты документы:

- [x] `docs/technical/00_TECHNICAL_OVERVIEW.md`
- [x] `docs/technical/02_DOMAIN_ADAPTER.md`
- [x] `docs/technical/03_GAME_STATE.md`
- [x] `docs/technical/04_SAVE_ARCHITECTURE.md`
- [x] `docs/technical/07_TESTING_STRATEGY.md`

Зафиксировано:

- [x] Strangler / anti-corruption architecture вместо полного rewrite Evolve;
- [x] новый `Chronicles GameState` — единственный authority для нового Timeline gameplay;
- [x] config — serializable ESM под `src/chronicles/config`;
- [x] UI работает через commands/selectors и не мутирует gameplay state напрямую;
- [x] legacy `global`, jQuery, Vue/Buefy и DOM helpers не являются API нового domain;
- [x] отдельный versioned save namespace `chronicles_evolution`;
- [x] старый `evolved` не перезаписывается и не мигрируется автоматически;
- [x] `run/meta/settings` разделены; rates/prices/World Tension derived;
- [x] reset — recoverable + idempotent transaction;
- [x] clock/RNG/storage/platform/localization доступны через ports;
- [x] Iteration 1 headless-first;
- [x] обязательны config/domain/save/headless simulation tests;
- [x] 1×/5×/20×/100× debug acceleration входит в dev contract;
- [x] production UI framework отложен до DS-06;
- [x] Yandex/VK SDK details отложены до DS-10.

---

# Codex / implementation — можно возобновлять

## Iteration 0 — Repo baseline and code audit

**Status:** active

Уже сделано:

- [x] static code audit;
- [x] architecture/module map;
- [x] найдены game loop, resources/payment, save/reset и UI boundaries;
- [x] подтверждено отсутствие platform abstraction.

Осталось:

- [ ] baseline build confirmation;
- [ ] baseline bundle size;
- [ ] baseline startup measurement;
- [ ] smoke command/script decision.

После этого без дополнительного design gate перейти в Iteration 1.

## Iteration 1 — Domain adapter and data foundation

**Status:** ready after Iteration 0

Primary inputs (актуальный handoff: `docs/production/DS03_CODEX_HANDOFF.md`):

- `docs/technical/00_TECHNICAL_OVERVIEW.md`
- `docs/technical/02_DOMAIN_ADAPTER.md`
- `docs/technical/03_GAME_STATE.md`
- `docs/technical/04_SAVE_ARCHITECTURE.md`
- `docs/technical/07_TESTING_STRATEGY.md`
- economy/evolution/DS-01/DS-02 implementation specs.

Первый implementation slice:

```text
src/chronicles structure
-> serializable config registries
-> validators
-> canonical GameState
-> commands/domain events/selectors
-> Resource/Cost/Production services
-> clock/storage/RNG/localization/platform ports
-> save repository skeleton
-> zero/low-dependency tests
-> headless simulation shell
```

Не делать в Iteration 1:

- [ ] full UI rewrite;
- [ ] Yandex/VK SDK;
- [ ] cloud save;
- [ ] mass refactor legacy files;
- [ ] guessed values для TBD balance;
- [ ] глубокий Space/Bioseed scope.

---

# Current design session

## DS-04 — Meta progression and balance rules

**Status:** ready

Нужно создать:

- [ ] `docs/gdd/10_META_PROGRESSION.md`
- [ ] `docs/gdd/11_BALANCE_RULES.md`

Основные темы:

- [ ] Archive Fragments/meta economy;
- [ ] Archive Tree;
- [ ] Timeline #2 acceleration;
- [ ] retained traits/hybridization;
- [ ] catch-up/anti-snowball;
- [ ] offline rules;
- [ ] first-reset spend/use pacing;
- [ ] правила изменения balance config и telemetry tuning;
- [ ] при необходимости meta-upgrades Archive Intervention без зависимости baseline от рекламы.

DS-05 narrative и DS-06 UX также можно вести параллельно, но основной следующий design block — DS-04.

---

# Open decisions

- [ ] production UI framework / степень reuse Vue 2 — DS-06;
- [ ] Yandex/VK SDK mapping, cloud save conflicts, rewarded flow — DS-10;
- [ ] все `TBD`/proposal balance values из DS-01/DS-02 остаются configurable до отдельного решения/testing.

---

# Правило следующего шага

Codex сейчас можно запускать. Его первая задача — **не Iteration 1 сразу**, а закрыть четыре оставшихся baseline-пункта Iteration 0; после их успешной проверки он переходит в Iteration 1 по DS-03 без самостоятельного проектирования архитектуры.