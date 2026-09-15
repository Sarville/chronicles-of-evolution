# Хроники Эволюции — Technical Overview

**Документ:** DS-03 / reconciliation revision 2.0  
**Статус:** accepted architecture  
**Gameplay content authority:** `DECISIONS_RECONCILIATION.md` + reconciled GDD.

---

# 1. Architecture remains unchanged

Reconciliation changes **content/config semantics**, not the accepted technical architecture.

Keep Strangler / anti-corruption model:

```text
Gameplay config
      ↓
Chronicles Domain ←→ Presentation
      ↓
Ports / Adapters
      ↓
Save / legacy runtime / localization / platform
```

Hard rule:

```text
UI → command → domain validation/mutation → domain events → selectors → UI
```

No new UI direct mutation of gameplay state.

---

# 2. Source of truth after reconciliation

Design/content priority:

1. `docs/DECISIONS_RECONCILIATION.md`;
2. `docs/gdd/01_FIRST_120_MINUTES.md`;
3. `docs/gdd/03_EVOLUTION_TREE.md`;
4. `docs/gdd/02_ECONOMY_FIRST_120_MINUTES.md` for tuning values inside approved gameplay;
5. DS-01/DS-02 detail docs;
6. DS-04 meta/balance guardrails.

Runtime authority remains:

```text
Chronicles GameState
```

Legacy `global` is not canonical new-game state.

---

# 3. Accepted reusable architecture

Keep:

- `src/chronicles/config` declarative registries;
- runtime validators;
- `domain/state`;
- commands;
- immutable domain events;
- selectors/view models;
- Resource/Cost/Production services;
- evolution/goals/events/era services;
- ports for clock/RNG/storage/localization/platform;
- versioned save/recovery;
- dev/debug/simulation utilities.

Reconciliation must not introduce gameplay-specific state mutations into UI just to make the new RNA flow quicker to implement.

---

# 4. Canonical content families after reconciliation

## Biological resources

Player-facing Timeline #1 may include:

```text
rna
dna
biomass
energy   // only after metabolism
adaptation_points // discrete run-local reward state
```

`information` is no longer a player-facing spendable resource in the reconciled ruleset.

## Civilization resources

```text
food
materials
knowledge
power
```

Population and Stability remain dedicated state systems, not generic spendable resources.

Cognition is a meter/system state, not generic resource wallet.

---

# 5. Reconciled early node semantics

The `M*` family may be retained to minimize implementation churn:

```text
M01 Stable RNA
M02 Self Replication
M03 DNA Synthesis
M04 Error Correction [OPTIONAL]
M05 Membrane
M06 Cell [CONVERGENCE]
```

Old M01–M06 costs/effects from the E/I ruleset are superseded.

Stable IDs are persistence contracts **after production release**. During this pre-release reconciliation, aliases/migrations may be used where semantic identity survives.

---

# 6. Removed current-ruleset content

Do not expose in `timeline1-v2-reconciled`:

```text
GEN_CHEMICAL_GRADIENT
GEN_CATALYTIC_FOLD
GEN_ENERGY_POCKET
player-facing information wallet
old Stable Bond semantics
```

Historical config/code can remain in git history or explicit old ruleset support if needed, but must not leak into selectors/UI for the reconciled run.

---

# 7. Config rules

Canonical config remains plain serializable ESM data.

Allowed declarative concepts include:

```text
resources
processes/producers
nodes
buildings
jobs
goals
events
eras
milestones
endings
effects
meters/conditions
```

Reconciliation adds explicit support needs for:

- AP costs/rewards;
- Cognition contributions;
- condition-driven convergence;
- process unlocks that are not generic repeatable generators.

Example Sapience concept:

```js
{
  id: 'N07',
  semanticRole: 'convergence',
  conditions: [
    { type: 'meter_at_least', id: 'cognition', value: 100 }
  ],
  transition: 'SAPIENCE'
}
```

No arbitrary callbacks in config.

---

# 8. Commands

Existing command boundary remains valid.

Likely reconciled commands can reuse:

```text
START_MANUAL_PROCESS
BUY_NODE
BUY_PRODUCER / START_OR_UPGRADE_PROCESS
BUY_BUILDING
ASSIGN_JOB
SELECT_EVENT_CHOICE
TICK
...
```

If RNA replication is better represented as a process rather than repeatable producer, prefer a generic process command/schema extension over hard-coded UI behavior.

---

# 9. Domain events

Keep generic event families:

```text
resource_changed
process_started / producer_bought
node_bought
branch_selected
goal_started/completed/stalled
era_changed
milestone_reached
story_event_started
story_choice_made
ending_triggered
reset_completed
```

Additional useful content-neutral facts:

```text
meter_changed
adaptation_points_changed
adaptation_unlocked
```

Names should remain generic enough for future systems.

---

# 10. State-derived values

Do not persist values that can be derived from state+ruleset:

- current production rate;
- effective prices;
- branch modifier totals;
- Cognition rate breakdown;
- current World Tension if derived from Stability;
- availability/affordability selectors.

Persist irreversible choices/progress only.

---

# 11. Save architecture

DS-03 Save v1 remains accepted:

- separate `chronicles_evolution` namespace;
- schemaVersion separate from rulesetVersion;
- primary/pending/backup recovery;
- explicit migration;
- idempotent reset.

Recommended reconciled ruleset:

```text
timeline1-v2-reconciled
```

Do not silently load an obsolete E/I run into new semantics without explicit ruleset migration/restart policy.

---

# 12. Legacy reuse

Previous DS-03 decisions remain:

- runtime clock concept/worker may be reused through adapter;
- pure resource/payment formulas extracted/reimplemented;
- legacy DOM/Vue/jQuery not domain API;
- legacy power grid not automatically the canonical new Power model;
- localization/compression can be reused through ports;
- no automatic arbitrary Evolve-save migration.

---

# 13. Iteration 3 status

Technical foundation is accepted.

Accepted baseline:

`32c0d72f56f48a21e3c22c8e3eb9ef3975e967fb`

Interpretation:

- architecture: keep;
- Goal Engine: keep;
- save/recovery: keep;
- dev tools/simulation: keep;
- 0–10 content config: replace;
- 0–10 balance: replace.

---

# 14. Next technical task

After documentation approval, the next implementation step is **not old Iteration 4**.

It is:

```text
Biological gameplay reconciliation implementation 0–10
```

Goal:

- migrate content/config to RNA→DNA→Cell;
- keep architecture;
- update tests/simulation;
- rebalance/playtest;
- then unlock corrected post-Cell content.