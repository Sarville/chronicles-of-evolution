# Хроники Эволюции — DS-03 Decision Addendum

**Date:** 2026-09-15  
**Status:** accepted  
**Authority:** дополняет `docs/DECISIONS.md` и имеет более поздний приоритет для вопросов, закрытых DS-03.

---

## DEC-023 — Strangler architecture для нового gameplay

**Status:** accepted  
**Date:** 2026-09-15

### Decision

Timeline #1 реализуется в новом isolated domain (`src/chronicles`) поверх anti-corruption adapters. Legacy Evolve не является каноническим state нового gameplay и не переписывается целиком.

### Implementation consequence

- новый gameplay не мутирует legacy `global` напрямую;
- reusable legacy runtime допускается только за ports/adapters;
- DOM/jQuery/Vue-coupled helpers не становятся новым domain API.

---

## DEC-024 — Canonical GameState, commands/events/selectors и ESM config

**Status:** accepted  
**Date:** 2026-09-15

### Decision

`Chronicles GameState` — единственный runtime authority нового Timeline. Presentation посылает commands, domain валидирует и мутирует state, эмитит immutable domain events и отдаёт selectors/view models.

Canonical gameplay config хранится как plain serializable ESM `.js` под `src/chronicles/config` без DOM, arbitrary callbacks/functions и зависимости от legacy `global`.

### Implementation consequence

- prices/rates/availability/World Tension и другие derived values пересчитываются из state + ruleset;
- UI framework не блокирует Iteration 1;
- production UI framework закрывается вместе с DS-06/UI implementation.

---

## DEC-025 — Новый save namespace и migration policy

**Status:** accepted  
**Date:** 2026-09-15

### Decision

Новый save использует versioned namespace:

```text
chronicles_evolution
chronicles_evolution.backup
chronicles_evolution.pending
```

Legacy `localStorage['evolved']` остаётся нетронутым и не конвертируется автоматически в Timeline #1.

Save envelope разделяет `schemaVersion` и `rulesetVersion`.

### Implementation consequence

- arbitrary legacy Evolve progress не получает guessed migration;
- structural migrations versioned и deterministic;
- ruleset migration требует отдельного balance/design решения;
- local writes используют recoverable pending/backup flow.

---

## DEC-026 — Idempotent reset и headless test contract

**Status:** accepted  
**Date:** 2026-09-15

### Decision

Ending/reset формируется как idempotent transaction: immutable Timeline Summary + persistent meta rewards/flags + transaction ID + новый run собираются в единый candidate и коммитятся recoverable save flow.

До расширения gameplay обязательны headless config/domain/save tests и ускоренная simulation. Clock/RNG/storage/platform/localization являются injectable ports.

### Implementation consequence

- retry reset не дублирует AF/Chronicle;
- failed reset write не уничтожает старый run;
- debug time scale: 1×/5×/20×/100×;
- Iteration 1 headless/domain-first.

---

# Resolved / deferred open decisions from base DECISIONS.md

DS-03 закрывает:

- `format gameplay configs` → serializable ESM `.js`;
- `current save vs versioned wrapper` → separate versioned `chronicles_evolution` wrapper;
- `portal SDK abstraction architecture` → `PlatformPort` seam принят, exact Yandex/VK mapping deferred to DS-10.

Остаются открытыми:

- точный production UI framework / степень reuse Vue 2 — DS-06/UI implementation;
- набор визуальных ветвей первого публичного билда;
- альтернативные endings Release 1 за пределами первого `ENDING_ASH` vertical slice;
- точный scope раннего Space/Bioseed;
- явно помеченные TBD/proposal balance values DS-01/DS-02 до balance/meta review.