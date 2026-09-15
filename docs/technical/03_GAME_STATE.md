# Хроники Эволюции — Canonical Game State

**Документ:** DS-03 / reconciliation revision 2.0  
**Статус:** accepted state architecture / reconciled content examples.

---

# 1. Top-level model

Keep:

```js
{
  run,
  meta,
  settings,
  session
}
```

`session` remains transient.

Save envelope/versioning is defined by `04_SAVE_ARCHITECTURE.md`.

---

# 2. Run state

Recommended shape:

```json
{
  "id": "run_001",
  "timelineId": 1,
  "rulesetVersion": "timeline1-v2-reconciled",
  "lifecycle": "active",
  "clock": {
    "simulationMs": 0,
    "activeMs": 0
  },
  "chapterId": "CH01",
  "eraId": "MOLECULAR",
  "resources": {},
  "processes": {},
  "producers": {},
  "nodes": {},
  "meters": {},
  "adaptation": {},
  "population": null,
  "buildings": {},
  "goals": {},
  "events": {},
  "flags": {},
  "pathScores": {},
  "modifiers": {},
  "manualProcesses": {},
  "crisis": null,
  "stats": {}
}
```

`processes` may be used for non-repeatable/upgradeable biological production such as early replication. `producers` remains available for true repeatable entities.

---

# 3. Lifecycle

Keep:

```text
active
ending_pending
ending_shown
archive_summary
reset_pending
closed
```

Reset/ending invariants are unchanged.

---

# 4. Biological resources

Canonical player-facing resource IDs in reconciled ruleset:

```text
rna
dna
biomass
energy
```

Activation:

- `rna` from start;
- `dna` after DNA Synthesis;
- `biomass` after Cell;
- `energy` after Metabolism.

`information` is not a player-facing spendable resource in `timeline1-v2-reconciled`.

Example:

```json
{
  "resources": {
    "rna": { "amount": 42.5 },
    "dna": { "amount": 8 }
  }
}
```

Derived rates/prices are not persisted.

---

# 5. Adaptation Points

AP are run-local discrete progression state.

Recommended shape:

```json
{
  "adaptation": {
    "points": 2,
    "earnedTotal": 4,
    "spentTotal": 2,
    "selectedOptionalNodes": ["B02A", "B02B"]
  }
}
```

Rules:

- no passive rate;
- cannot be negative;
- spend only through validated node purchase/reward flow;
- reset with run;
- retained Archive adaptation can activate without AP cost where meta contract says so.

AP may also be represented as a special non-production resource internally, but public selectors must preserve the semantic distinction from grind currencies.

---

# 6. Cognition meter

Cognition is a meter/system state, not generic resource.

Recommended state:

```json
{
  "meters": {
    "cognition": {
      "value": 72,
      "max": 100
    }
  }
}
```

Contributions are derived from completed nodes/events/modifiers where possible.

Persist `value` only if progression can be incremented by irreversible event rewards not fully reconstructable from other state. Otherwise derive from canonical sources.

Sapience condition:

```text
cognition >= 100
+ required core nodes
```

---

# 7. Early processes/producers

The following old player-facing producer examples are removed from current ruleset:

```text
GEN_CHEMICAL_GRADIENT
GEN_CATALYTIC_FOLD
GEN_ENERGY_POCKET
```

Early biology may use generic process IDs such as:

```text
PROC_PRIMORDIAL_REACTION
PROC_RNA_REPLICATION
PROC_DNA_SYNTHESIS
```

Exact registry naming is implementation detail, but IDs must be stable within the reconciled ruleset and not use player-facing localized names as identity.

---

# 8. Nodes

Completion registry remains:

```json
{
  "nodes": {
    "completed": {
      "M01": { "completedAtMs": 45000 },
      "M02": { "completedAtMs": 145000 }
    },
    "selectedBranchByGroup": {
      "primary_biology_1": "C02B",
      "behavior_1": "N02B"
    }
  }
}
```

Reconciled M semantics:

```text
M01 Stable RNA
M02 Self Replication
M03 DNA Synthesis
M04 Error Correction
M05 Membrane
M06 Cell
```

Do not save copied costs/effects.

---

# 9. Branch state

Primary first-run biological branch group:

```text
primary_biology_1 = Absorption / Symbiosis / Shell
```

Timeline #1 selects one.

No generic `secondaryChoiceCostMult = 2.5` state is needed for this group.

Future Archive hybridization should be represented explicitly in meta/loadout state rather than by pretending all siblings were always buyable.

---

# 10. Population and jobs

Before Sapience:

```text
population = null
```

After transition, initial current Population is approximately 5 according to ruleset config.

State shape remains:

```json
{
  "population": {
    "current": 12,
    "peak": 12,
    "assignments": {
      "JOB_TRIBE_FORAGER": 5,
      "JOB_TRIBE_GATHERER": 3,
      "JOB_TRIBE_THINKER": 2
    }
  }
}
```

Invariant:

```text
sum(assignments) <= current
```

Cap remains derived unless an explicit override is required.

---

# 11. Buildings

Keep count-based uniform state:

```json
{
  "buildings": {
    "BLD_SHELTER": { "count": 2 },
    "BLD_FIELD": { "count": 3 },
    "BLD_WORKSHOP": { "count": 1 }
  }
}
```

Config determines unique/stackable/growth/effects.

---

# 12. Goals

Goal state model remains accepted.

Early current goal IDs G001–G005 retain stable goal identity family but their semantics are reconciled:

```text
G001 Stable RNA
G002 Self Replication
G003 DNA
G004 Membrane
G005 Cell
```

Goal state never stores copied title/cost if it can be resolved from pinned ruleset/localization.

---

# 13. Events and flags

Run flags update to restored biology.

Examples:

```json
{
  "flags": {
    "run.bio.primary_trait": "symbiosis",
    "run.bio.behavior": "social",
    "run.anomaly.error17_seen": true
  }
}
```

Do not use old `run.bio.metabolism = photosynthesis|chemosynthesis|absorption` as the canonical first branch identity.

Photosynthesis/Chemosynthesis may have separate optional flags.

Persistent anomaly/Archive flags remain unchanged in `meta`.

---

# 14. Crisis

Keep dedicated crisis state:

```json
{
  "crisis": {
    "active": true,
    "stability": 63,
    "clockMs": 180000,
    "atomicLoad": 1,
    "unresolvedCrises": 1,
    "ashPending": false
  }
}
```

World Tension is derived:

```text
100 - stability
```

---

# 15. Meta state

Keep:

- AF;
- Archive nodes;
- persistent discovery;
- Chronicle;
- ending history;
- narrative flags;
- applied reset transaction IDs;
- retained trait loadout/hybridization state.

AR01/AR02 effects are ruleset/config semantics and should not be copied into save as old Energy/Information assumptions.

---

# 16. Ruleset migration

Reconciliation requires explicit ruleset handling.

Recommended new ruleset:

```text
timeline1-v2-reconciled
```

An active old pre-release `timeline1-v1` run must not silently reinterpret:

- energy as RNA;
- information as DNA;
- old M nodes as new semantics.

Allowed during pre-release:

- explicit restart preserving meta/settings;
- deterministic content migration if a trustworthy mapping is implemented;
- dev reset.

Never guess semantic state from resource amounts.

---

# 17. Serialization principles

Still persist only what cannot be safely reconstructed.

Do not persist:

- `/s` rates;
- affordability;
- current calculated prices;
- UI strings;
- selector output;
- World Tension if Stability exists;
- Cognition breakdown if derivable.

State remains JSON-compatible and DOM/framework-independent.