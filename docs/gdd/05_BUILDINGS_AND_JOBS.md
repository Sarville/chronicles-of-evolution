# Хроники Эволюции — здания и профессии Timeline #1

**Версия:** reconciliation revision 2.0  
**Статус:** canonical entity catalogue / numbers provisional  
**Область:** civilization ~38–108 min.

> Entity separation from DS-01 remains accepted. Numeric values from the old `Sapience 46 / Population 18–24` model are provisional until the new balance simulation.

---

# 1. Entity rules

`Building` and `Job` remain different entity types.

Building may:

- increase capacity;
- produce resources;
- enhance jobs;
- unlock a system;
- contribute to diorama thresholds.

Job:

- consumes one Population assignment;
- produces one or more outputs;
- belongs to the active phase job set.

Invariant:

```text
sum(job assignments) <= Population
```

---

# 2. Phase-aware jobs

Keep the useful replacement model, but start simpler.

## Tribe, ~38–50

Player-facing initial jobs:

- `JOB_TRIBE_FORAGER` — Food;
- `JOB_TRIBE_GATHERER` — Materials;
- `JOB_TRIBE_THINKER` — Knowledge.

`JOB_TRIBE_CAREGIVER` is optional/later Tribe unlock if fertility control is needed by balance; it is not mandatory at civilization start.

## Settlement, ~50–65

- `JOB_SETTLEMENT_FARMER`;
- `JOB_SETTLEMENT_BUILDER`;
- `JOB_SETTLEMENT_SCHOLAR`;
- `JOB_SETTLEMENT_ARTISAN`.

## City / early Industry, ~65–95

Semantic roles:

- Farmer;
- Worker/Miner;
- Engineer/Artisan;
- Researcher.

Stable implementation IDs may retain existing DS-01 names.

## Industry / Modern / Atomic, ~80–108

- industrial food role;
- Industrial Worker;
- Power Engineer;
- Scientist.

Exact transition boundaries follow current era state rather than wall-clock time.

---

# 3. Job lineage

Recommended remap lineage:

```text
Forager → Farmer → Industrial Farmer
Gatherer → Builder → Worker/Miner → Industrial Worker
Thinker → Scholar → Researcher → Scientist
Artisan → Engineer / Industrial Worker
Caregiver → utility/unassigned when phase has no direct equivalent
```

On transition:

- no Population disappears;
- unavailable old jobs stop producing;
- safe remap may occur;
- remainder becomes unassigned;
- UI explains the update briefly.

---

# 4. Tribe structures

Canonical small-set structures:

- `BLD_HEARTH` / Campfire — knowledge/social landmark;
- `BLD_SHELTER` — Population cap;
- `BLD_FOOD_STORE` or equivalent storage role;
- `BLD_TOOL_BENCH` — Materials efficiency;
- optional `BLD_HUNTING_GROUND` / `BLD_STORY_CIRCLE` / `BLD_CLAN_CAMP` as later Tribe upgrades.

The reconciled first Tribe should not open six equally important structures at once.

Unique landmark structures remain `max_count = 1` where appropriate.

---

# 5. Settlement buildings

Keep:

- `BLD_FIELD`;
- `BLD_HOUSE`;
- `BLD_WORKSHOP`;
- `BLD_GRANARY`;
- `BLD_SCHOOL`;
- `BLD_MARKET`.

Roles:

- Field → Food/Farmer efficiency;
- House → Population cap;
- Workshop → Materials/Artisan/Builder;
- Granary → storage/Food resilience;
- School → Knowledge;
- Market → trade-lite / F-M efficiency.

Exact old costs/growth/multipliers are **provisional carry-over**, not frozen values.

Merchant does not need to return as a permanent standalone job in Timeline #1; trade-lite can be represented by Market/profile effects. If later playtest shows the City layer lacks identity, Merchant may be reconsidered as an explicit job by design decision.

---

# 6. City / Industry infrastructure

Useful accepted catalogue:

- `BLD_MINE`;
- `BLD_FOUNDRY`;
- `BLD_STEAM_PLANT`;
- `BLD_RAIL_HUB`;
- `BLD_LABORATORY`;
- `BLD_STEELWORKS`;
- `BLD_GRID_STATION`;
- `BLD_RESEARCH_INSTITUTE`;
- `BLD_CHEMICAL_COMPLEX`.

Power-producing infrastructure becomes economically important in the Industry/electrification phase.

City may show proto-industrial landmarks before Power becomes a top-level resource.

---

# 7. Modern / Atomic tangible projects

Restore tangible late-game meaning without creating a city-builder inventory explosion.

Required visual/gameplay concepts before Atomic Age:

- mature electrical grid;
- research institution/laboratory;
- communications/global connection milestone;
- reactor or atomic research project.

A dedicated `Atomic Lab` and `Research Reactor` may be implemented as:

- unique buildings/projects; or
- one composite reactor/lab project.

Decision criterion: clarity and implementation cost, not historical uniformity with the old tech tree.

---

# 8. Cost growth

For repeatable infrastructure only:

```text
cost(n) = base_cost × growth^(n-1)
```

Do not assume every building is repeatable.

Do not apply producer count milestones `10/25/50` to unique structures.

The old global growth factors remain useful starting references but must be regression-tested after new Population/pacing values.

---

# 9. Production formulas

Job output:

```text
assigned_population × base_output × job_mult × building_mult × tech_mult × event_mult
```

Building producer:

```text
count × base_output × local_mult × era_mult × event_mult
```

Modifier groups remain inspectable/data-driven.

No hidden multiplier may exist only to force the player toward an old milestone time.

---

# 10. Population model

Canonical start after Sapience:

```text
Population ≈ 5
```

Population growth is intentionally game-accelerated, but exact rates are retuned.

Hard rules:

- Food deficit does not delete Population as immediate punishment;
- deficit stops/slows growth and activates a recovery hint;
- population caps come from shelters/houses/era milestones;
- jobs remain the main civilization production control.

---

# 11. Data model

Keep stable declarative schema:

```js
{
  id,
  era,
  unique,
  baseCost,
  growth,
  outputs,
  modifiers,
  populationCap,
  unlocks,
  visualFamily
}
```

Jobs:

```js
{
  id,
  era,
  outputs,
  unlockCondition,
  semanticLineage
}
```

Player-facing names are localization, not IDs.

---

# 12. Balance status

Until full reconciliation simulation:

**Canonical:**

- entity meanings;
- phase job replacement;
- aggregate resources;
- building/job separation;
- Population assignment model;
- useful DS-01 catalogue.

**Provisional:**

- all exact job outputs;
- building costs;
- growth factors;
- stacking formulas;
- Population thresholds;
- fertility rates;
- Power output requirements.

Codex must not treat old DS-01 numbers as immutable canon during the Rework Iteration.

---

# 13. Implemented T1 catalogue boundary

The runtime catalogue now carries the canonical tangible chain:

```text
Hearth / Shelter / Tool Bench
→ Field / House / Workshop
→ School / Market
→ Factory / Steam Plant / Rail Hub
→ Grid / Laboratory
→ Reactor/Lab
```

`Field`, `House` and `Workshop` are required by the permanent-settlement
breakthrough; `School` and `Market` by City; `Factory` and `Steam Plant` by
Industry; `Grid`, `Laboratory` and `Rail Hub` by Modern; `Reactor/Lab` by
Atomic. This is a gameplay requirement, not merely a visual asset list.
