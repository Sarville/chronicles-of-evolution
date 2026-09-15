# Хроники Эволюции — Domain Adapter

**Документ:** DS-03 / 02_DOMAIN_ADAPTER  
**Версия:** 1.0  
**Статус:** accepted

---

# 1. Назначение

`Domain Adapter` — anti-corruption layer между новым gameplay «Хроники Эволюции» и исходным Evolve.

Его задача — позволить переиспользовать полезный runtime без передачи legacy coupling в новые systems.

Adapter не является местом для game design.

---

# 2. Главный контракт

```text
Presentation
    │ commands
    v
ChroniclesDomain
    │ ports
    v
Adapters
    │
    ├── Legacy runtime
    ├── Local storage / codec
    ├── Localization
    └── Platform
```

Запрещено:

```text
new UI -> global.*
new UI -> modRes()
new UI -> payCosts()
new UI -> $('#...')
new domain -> Vue/jQuery
config -> legacy global
```

---

# 3. Ownership matrix

| State / behavior | Authority | Legacy role |
|---|---|---|
| run lifecycle | Chronicles Domain | none |
| era/chapter | Chronicles Domain | optional projection only |
| new resources | Chronicles Domain | no independent copy |
| producers/buildings/jobs | Chronicles Domain | no independent copy |
| nodes/branches | Chronicles Domain | no independent copy |
| goals/events | Chronicles Domain | none |
| flags/path scores | Chronicles Domain | none |
| Stability/crisis | Chronicles Domain | none |
| Chronicle/meta | Chronicles Domain | none |
| render state | selectors/presentation | legacy can render old surfaces |
| timing cadence | RuntimeClockPort | worker may be reused |
| localization strings | LocalizationPort | `loc()` may be reused |
| persistence | SaveRepository | LZString/localStorage may be reused |
| platform SDK | PlatformPort | none today |

Hard rule: одна gameplay concept не должна иметь две independently mutable authoritative copies.

---

# 4. Почему нельзя напрямую использовать legacy resource API

Legacy `modRes()`:

- читает/пишет `global.resource`;
- использует `tmp_vars`;
- содержит special rules;
- обновляет `delta`;
- зависит от legacy storage conventions.

Legacy `payCosts()`:

- знает `global.prestige`, `portal`, `race`, `civic`;
- напрямую уменьшает resources;
- содержит special cases, которых нет в Timeline #1.

Legacy `loadResource()`:

- инициализирует state;
- знает settings;
- создаёт DOM/Vue template.

Поэтому DS-03 не делает эти функции публичными dependencies нового domain.

---

# 5. Reuse strategy

## 5.1. Runtime clock

Port:

```js
clock.start(onTick)
clock.stop()
clock.setTimeScale(scale) // dev only
```

Adapter может использовать текущий Worker.

Domain получает:

```js
engine.tick(deltaMs)
```

а не `fastLoop()/midLoop()/longLoop()`.

На transitional build legacy loops и Chronicles tick могут работать рядом, но не должны мутировать одни и те же canonical entities.

---

## 5.2. ResourceService

Pure contract:

```js
addResource(state, resourceId, amount)
canAfford(state, cost)
payCost(state, cost)
calculateCap(state, resourceId, ruleset)
```

### Atomic payment

```text
validate all components
→ if any insufficient: no mutation
→ subtract all
→ emit resource_changed per changed resource
```

No special `Prestige/Species/Supply` branches in Timeline #1 unless a later config explicitly introduces them.

### Clamp

```text
0 <= amount <= cap
```

If cap is infinite, config represents that explicitly; no magic `-1` leaks into public domain schema.

---

## 5.3. ProductionService

Pure input:

```text
GameState
Ruleset
deltaMs
```

Pure result:

```text
next resource amounts
rate breakdown
domain events if threshold crossed
```

Canonical formula follows economy:

```text
production/sec =
  count
  × base_output
  × local_mult
  × era_mult
  × event_mult
```

Modifier ordering is deterministic and inspectable.

---

# 6. Adapter ports

## RuntimeClockPort

```ts
start(onTick)
stop()
setPaused(paused)
getNow()
```

`getNow()` is injectable for tests.

## StoragePort

```ts
get(key)
set(key, value)
remove(key)
```

Browser implementation uses `localStorage`.

## CompressionPort

```ts
encode(jsonString)
decode(payload)
```

Default implementation may use LZString.

## LocalizationPort

```ts
text(key, params?)
```

Initial adapter may delegate to `loc()`.

## PlatformPort

```ts
ready()
getLocale()
getPlayerId()
loadCloudSave()
saveCloudSave(payload)
showRewarded(context)
showInterstitial(context)
track(event)
```

Default browser implementation is safe no-op/local behavior.

## RandomPort

```ts
next()
range(min, max)
```

Production adapter may reuse seeded algorithm. Tests use deterministic sequence.

---

# 7. Commands boundary

Presentation never requests low-level mutations.

Good:

```js
dispatch({
  type: 'BUY_BUILDING',
  buildingId: 'BLD_STEAM_PLANT'
})
```

Bad:

```js
gameState.resources.materials.amount -= 2200
global.resource.Materials.amount -= 2200
```

Command handler:

1. resolve config entity;
2. validate lifecycle/era/unlock;
3. calculate effective price;
4. atomic payment;
5. apply entity mutation;
6. recalculate/evaluate dependent systems;
7. emit facts;
8. return command result.

---

# 8. Command result

```json
{
  "ok": true,
  "events": [
    {
      "type": "building_bought",
      "payload": {
        "buildingId": "BLD_STEAM_PLANT",
        "newCount": 1
      }
    }
  ]
}
```

Rejected:

```json
{
  "ok": false,
  "reason": "INSUFFICIENT_RESOURCES",
  "details": {
    "resourceId": "materials",
    "missing": 180
  }
}
```

Reason codes — stable machine-readable values. UI localizes them separately.

---

# 9. State transition service

Era transitions выполняются только:

```text
EraService.tryTransition(transitionId)
```

Пример:

```text
TR_SET_CITY
from SETTLEMENT
to CITY
requires S08 + G019 + population >= 105
```

Transition transaction:

1. validate current state;
2. apply era ID;
3. switch job/building availability;
4. execute explicit unlocks;
5. remap job assignments according to configured policy;
6. queue milestone/events;
7. emit `era_changed`.

UI не делает `era = CITY` после анимации.

---

# 10. Job remap contract

При смене phase:

- Population не теряется;
- old job assignments не остаются активными producers;
- mapping объявляется data-driven;
- unmapped remainder становится `unassigned`;
- historical assignment может попасть в Timeline summary, но не нужен для current production.

Recommended mapping from DS-01:

```text
Forager -> Farmer -> Industrial Farmer
Gatherer -> Builder -> Miner / Industrial Worker
Thinker -> Scholar -> Researcher -> Scientist
Caregiver -> unassigned / utility
Artisan -> Engineer / Industrial Worker
```

Exact split при one-to-many mapping должен быть deterministic.

Default proposal:

```text
mapped worker count идёт в первый primary replacement;
если target отсутствует/locked -> unassigned.
```

DS-06 может изменить UX presentation, но не invariant сохранения Population.

---

# 11. Branch selection

```text
selectBranch(groupId, nodeId)
```

Atomically:

1. validate group;
2. validate node belongs group;
3. ensure no selected sibling;
4. pay cost if branch is paid;
5. mark node complete;
6. set `selectedBranchByGroup[groupId]`;
7. mark sibling runtime status `abandoned_branch` as derived state;
8. apply effects/flags;
9. emit `branch_selected`.

Будущая hybridization должна добавляться отдельной policy; Timeline #1 её не разрешает.

---

# 12. Goal integration

Goal Engine подписан на domain facts, но completion проверяет state condition.

Пример:

```text
node_bought(S08)
→ evaluate G019
→ population >= 105?
→ yes
→ goal_completed(G019)
→ EraService evaluates TR_SET_CITY
```

Это защищает от ошибочного completion только по одному event.

Stall detector работает по simulation/active time and progress snapshots, не по render frames.

---

# 13. Event Engine

Runtime states:

```text
hidden
armed
queued
shown
choice_pending
resolved
archived
deferred
expired
persistent_open
```

Priority:

```text
ending/crisis
> blocking branch
> milestone
> required narrative
> anomaly
> side
```

Event Engine гарантирует максимум один `choice_pending` blocking event.

Soft events могут не ставить simulation на pause.

---

# 14. Manual process adapter

Manual action — обычная domain process entity.

Adapter не должен создавать click handler, который напрямую начисляет resource.

```text
click/tap
→ START_MANUAL_PROCESS
→ domain process running
→ ticks
→ process completed
→ batch resource result
```

UI может показывать progress через selector.

---

# 15. Legacy coexistence modes

## Mode A — legacy page + new headless domain

Нужен для Iteration 1/2.

- old UI continues to boot;
- new domain lives isolated;
- debug tools drive new state;
- no player-facing integration required.

## Mode B — new shell + selected legacy adapters

После DS-06.

- new UI reads selectors;
- old Evolve UI can be hidden gradually;
- worker/localization/codec can remain.

## Mode C — legacy simulation disabled for new route

Когда vertical slice fully uses Chronicles domain.

- old content remains in repository;
- build may still contain it until optimization pass;
- no requirement to delete it for Release 1.

---

# 16. Legacy save boundary

`localStorage['evolved']`:

- remains owned by legacy Evolve;
- is never silently overwritten by new save repository;
- is never deleted by Chronicles reset;
- is not automatically converted to Timeline #1 progress.

New save namespace is separate.

Optional developer-only migration tooling may inspect legacy state, but no production gameplay promise is made.

---

# 17. Failure isolation

Adapter errors must not corrupt canonical state.

Pattern:

```text
prepare next state
→ adapter side effect
→ verify
→ commit state/reference
```

For persistence, use write-ahead pending key (see Save Architecture).

For platform/analytics:

- failure never rolls back gameplay;
- ads unavailable cannot block baseline progression;
- analytics errors are swallowed/logged safely.

---

# 18. Integration seams Codex must expose

Minimum callable API:

```js
createChroniclesEngine({ ruleset, clock, storage, rng, platform, locale })
engine.getState()
engine.dispatch(command)
engine.tick(deltaMs)
engine.subscribe(listener)
engine.select(selector, args?)
engine.save()
engine.load()
engine.resetTransaction()
```

Debug build additionally:

```js
engine.dev.*
```

---

# 19. Contract tests

Adapter layer must test:

- one tick maps to exact simulation delta;
- paused state does not advance active simulation;
- timeScale changes delta only;
- storage failure does not mutate saved revision;
- localization failure returns fallback key safely;
- platform failure does not block domain command;
- RNG fixture yields reproducible event sequence;
- no adapter imports from presentation modules;
- domain can run with all adapters replaced by in-memory fakes.

---

# 20. Acceptance criteria

Domain Adapter считается принятым, если:

- headless domain runs without DOM;
- no new domain module imports jQuery/Vue/Buefy;
- new UI can work without knowing `global`;
- resource/payment semantics have pure testable implementation;
- worker can be swapped for fake clock;
- save can be swapped for in-memory storage;
- localization/platform are ports;
- original `evolved` save is untouched;
- new gameplay has only one authoritative state.