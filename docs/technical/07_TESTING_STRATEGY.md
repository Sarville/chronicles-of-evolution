# Хроники Эволюции — Testing Strategy

**Документ:** DS-03 / 07_TESTING_STRATEGY  
**Версия:** 1.0  
**Статус:** accepted

---

# 1. Цель

Тестовая стратегия должна сделать возможным безопасное развитие большого legacy-проекта без переписывания всего Evolve.

Главный принцип:

> Новый gameplay сначала должен быть проверяем headless, и только потом зависеть от production UI.

---

# 2. Текущий baseline

В репозитории нет полноценного test suite.

`package.json` содержит esbuild/build scripts, но не содержит test framework.

Поэтому DS-03 не требует немедленного тяжёлого toolchain migration.

---

# 3. Initial test runner recommendation

Для Iteration 0/1 использовать минимальный zero-dependency harness:

```text
Node ESM scripts
+ node:assert / assert/strict equivalent supported by baseline Node
+ deterministic fakes
```

Пример scripts после Codex implementation:

```json
{
  "test:config": "node tests/config/run.mjs",
  "test:domain": "node tests/domain/run.mjs",
  "test:save": "node tests/save/run.mjs",
  "test:sim": "node tests/simulation/timeline1.mjs",
  "test": "npm run test:config && npm run test:domain && npm run test:save"
}
```

Если baseline Node/version делает это неудобным, Codex может выбрать другой **малый** runner, но не должен обновлять весь frontend stack ради тестов.

Browser E2E framework выбирается позднее, когда DS-06 даст production UI.

---

# 4. Test pyramid

## L0 — Config validation

Самые дешёвые проверки, запускаются всегда.

- unique IDs;
- references exist;
- graph no cycles;
- branch groups valid;
- effects whitelisted;
- prices/rates finite and non-negative;
- optional node invariant;
- transition targets valid;
- Goal/Event mappings valid.

## L1 — Pure unit

- costs;
- resource clamps;
- payment atomicity;
- production;
- modifiers;
- branch locking;
- job allocation;
- crisis drain;
- AF formula.

## L2 — Domain integration

- command → state → domain events;
- node purchase → goal → era transition;
- event choice → flags/path;
- crisis → Last Protocol → ending;
- reset summary/meta/new run.

## L3 — Adapter contract

- fake clock;
- real worker adapter sanity;
- in-memory storage vs browser storage;
- locale fallback;
- platform no-op behavior.

## L4 — Save/migration

- serialization;
- recovery;
- version migrations;
- interrupted reset;
- stale writer.

## L5 — Headless simulation

Full 0–120 Timeline progression at accelerated virtual time.

## L6 — Browser smoke/E2E

After DS-06/UI implementation.

---

# 5. Test seams

Every non-deterministic external dependency is injectable:

```text
clock
rng
storage
platform
locale
analytics
```

Domain test uses:

```text
FakeClock
SeededRng
MemoryStorage
NoopPlatform
TestLocale
CaptureAnalytics
```

No unit test requires browser DOM.

---

# 6. Determinism

Legacy code uses both seeded and unseeded random.

New Timeline domain must not call `Math.random()` directly.

All random choice:

```text
RandomPort
```

Simulation records seed.

Same:

```text
ruleset + initial state + command script + RNG seed
```

must produce same persisted gameplay state.

Presentation timings/animation do not need deterministic replay.

---

# 7. Time model tests

Test `tick(deltaMs)` independently from real worker.

Cases:

- `tick(250)` ×4 equals `tick(1000)` within defined numeric tolerance;
- timeScale 5x changes simulation delta, not production formulas;
- paused active gameplay does not advance active time;
- normal offline catch-up follows policy;
- crisis first-run offline does not advance crisis clock/drain.

Floating-point comparisons use explicit tolerance.

---

# 8. Resource/payment tests

Minimum:

1. add resource below cap;
2. cap clamp;
3. no negative stock;
4. multi-resource payment success;
5. one insufficient component => no component charged;
6. current price growth exact;
7. producer count milestones 10/25/50;
8. modifier group order;
9. temporary modifier expiry.

Golden numeric values should come from config/source, not duplicate arbitrary constants across tests.

---

# 9. Evolution/tech tests

Minimum:

- core route M01→N06 reachable;
- core route N06→A06 reachable;
- branch groups have expected members;
- sibling selection blocked according to rules;
- optional nodes skippable;
- missing prerequisite blocks purchase;
- affordability not equal unlock;
- S08 triggers City only after full transition requirements;
- I05 triggers Industry;
- A06 initializes Atomic/Stability;
- no UI call required.

---

# 10. Buildings/jobs tests

Jobs:

- assignment sum ≤ Population;
- negative workers impossible;
- unassigned allowed;
- dual output correct;
- era remap loses no Population;
- unavailable old job produces nothing after replacement.

Buildings:

- unique max 1;
- stackable growth;
- atomic payment;
- flat producer scales count;
- support building applies correct modifier;
- producer milestone only where tagged;
- cap building affects derived Population cap.

TBD stacking formula tests are added only after design value accepted.

---

# 11. Goal tests

For all G001–G024:

- unique ID;
- prerequisite refs;
- valid completion condition;
- target time exists as telemetry only;
- no hard completion from target time;
- blocking event cannot be skipped;
- completion emits exactly once;
- archived goal never re-awards.

Stall:

- threshold by phase;
- 5pp progress resets stall clock;
- relevant purchase resets/updates progress;
- hint identifies one primary bottleneck.

---

# 12. Event tests

- priority ordering;
- one blocking choice at a time;
- soft event does not freeze unless configured;
- exact branch/event mapping;
- chosen flags written;
- path score clamped;
- Chronicle major event record created once;
- persistent_open Error 17 survives ending/reset as designed;
- Energy Crisis and A01 specialization remain separate.

---

# 13. Crisis tests

Required DS-02 cases:

## Normal

- Atomic near target in simulation scenario;
- EV-CR-01/02;
- Last Protocol;
- Ash;
- reward.

## Fast stability collapse

- Stability <=15 before 435 sec;
- `ashPending=true`;
- no early cinematic;
- Last Protocol still shown at clamp.

## High stability

- Ash cannot be prevented past 480 sec Timeline #1.

## Offline

- clock/drain freeze.

## Last Protocol

Every variant:

```text
ENDING_ASH
+ correct subtype
+ flags
+ Chronicle
```

World Tension always equals:

```text
100 - Stability
```

---

# 14. Reset/save tests

Highest priority regression set:

- Timeline Summary immutable;
- AF formula target;
- successful reset writes Chronicle + meta;
- failed commit keeps old run;
- retry does not duplicate AF;
- retry does not duplicate Chronicle;
- run-only state absent from Timeline #2;
- persistent flags retained;
- settings retained;
- original `evolved` untouched.

---

# 15. Config-source consistency tests

To reduce specification drift, create explicit golden manifest for high-value canon:

```text
milestone target windows
node costs
building base costs/growth
job base outputs
crisis constants
AF formula
```

Tests compare loaded config against the checked-in expected manifest/version.

When design intentionally changes, manifest changes in same commit with decision/revision.

This is not a second gameplay config; it is a compact regression snapshot.

---

# 16. Headless simulation

Required API:

```js
simulateTimeline({
  ruleset,
  seed,
  policy,
  timeScale,
  maxSimulationMs
})
```

Output:

```json
{
  "milestones": {
    "M02": 119,
    "M06": 603,
    "C09": 1562,
    "N06": 2768,
    "T05": 3375,
    "T08": 3724,
    "S08": 4815,
    "I05": 5650,
    "A06": 6492,
    "ENDING_ASH": 6975
  },
  "ending": "ENDING_ASH",
  "resetAvailableAtSec": 7180,
  "errors": []
}
```

Numbers above are illustrative output format, not canonical target replacements.

---

# 17. Simulation policy

A simulation needs a player policy.

Create at least:

## `baseline_active`

- buys core progression when affordable;
- maintains survival resource surplus;
- uses recommended first-run branches;
- builds recommended producers/jobs;
- skips optional nodes unless required by defined policy;
- responds to events immediately;
- does not use ads/Archive Intervention.

## `slow_reasonable`

- delayed purchases;
- non-optimal but valid allocations.

## `branch_matrix`

Runs representative alternatives to check no branch creates dead end.

Policy is test tooling, not gameplay AI.

---

# 18. Milestone timing gates

Canonical targets:

```text
Self Replication ~ 2m
Proto-cell ~ 10m
Multicellularity ~ 26m
Sapience ~ 46m
Tribe ~ 56m
Agriculture ~ 62m
City ~ 80m
Industry ~ 94m
Atomic ~ 108m
Ash ~ 116m
Reset ~ 120m
```

Simulation checks configurable acceptance windows.

Recommended initial CI windows:

```text
early core goals: target ±15%
major era milestones: target ±10%
Ash/reset: DS-02 clamp + product window
```

Exact windows may be tightened after first simulation/playtest.

A failing timing test is a signal for balance review, not permission for Codex to silently alter costs.

---

# 19. Branch matrix tests

At minimum one full viable run for:

- each metabolism branch;
- each body branch;
- each behavior branch;
- each civilization branch group representative;
- each Energy Crisis path;
- each Last Protocol.

Full Cartesian product is unnecessary for every commit.

Nightly/manual deeper matrix can sample combinations by seeded simulation.

---

# 20. Fuzz/property-style checks without new framework

Small deterministic loops can generate valid random commands and assert invariants:

```text
no NaN
no negative resource
no negative building count
no over-assigned population
no two selected siblings
stability 0..100
path scores -10..10
save always JSON serializable
```

Keep bounded seeds/count to avoid slow test suite.

---

# 21. Legacy regression harness

Before modifying legacy integration, keep fixtures:

- fresh legacy save;
- representative mid-game save if available;
- corrupted save sample;
- new Chronicles save.

Smoke:

- legacy page still boots while coexistence required;
- Chronicles engine initializes;
- one domain tick works;
- new save write does not modify legacy `evolved`.

No need to prove all original Evolve late-game content in every commit.

---

# 22. Build/smoke gate

Iteration DoD:

```text
npm build/debug build passes
domain tests pass
save tests pass
config validation passes
headless smoke passes
no blocker console error in target page
```

Iteration 0 still must record:

- baseline build;
- bundle size;
- startup measurement;
- smoke script/command.

DS-03 does not fabricate those measurements.

---

# 23. Debug tools as test surface

Dev API must be scriptable, not only clickable UI:

```text
setTimeScale
grantResource
setPopulation
unlockNode
setEra
triggerEvent
setStability
simulate
dumpState
validateConfig
```

Debug UI calls this API; tests can call same methods where appropriate.

---

# 24. Test data policy

Tests never depend on localized labels.

Use IDs only.

Fixtures declare:

```text
schemaVersion
rulesetVersion
```

When schema changes, migrate fixture or keep explicit old fixture for migration test.

---

# 25. Failure diagnostics

On failure, report:

```text
seed
rulesetVersion
simulationTime
command
last domain events
relevant state slice
modifier breakdown
prerequisite trace
```

Do not dump megabytes of full state by default.

---

# 26. CI recommendation

If/when GitHub Actions is added:

```text
install
config validation
domain tests
save tests
headless simulation smoke
build
```

Full 120-minute simulation uses virtual time and must finish quickly in CPU time.

Browser matrix can be separate once UI is stable.

---

# 27. Acceptance criteria

Testing Strategy accepted if:

- new domain tests run without browser;
- RNG/clock/storage are injectable;
- config validation catches broken refs;
- save/reset failure cases automated;
- headless Timeline can complete;
- milestone windows are assertable;
- branch dead ends detectable;
- no test requires ads;
- Codex cannot “fix” a red balance test by changing canonical values without doc/config revision.