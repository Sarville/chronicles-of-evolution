# Хроники Эволюции — Narrative Flags Contract

**Документ:** DS-05  
**Статус:** ready for review  
**Назначение:** единый контракт narrative state для Timeline #1 и перехода в Archive/meta.  
**Technical authority:** DS-03 architecture сохраняет приоритет по структуре GameState/save/migration.

---

# 1. Principles

Narrative flags должны:

1. фиксировать только значимые факты истории;
2. не дублировать числовое состояние ресурсов;
3. разделять run-local и persistent state;
4. быть стабильными для Chronicle/reset/migrations;
5. не кодировать сюжетные выводы, которые игрок ещё не знает;
6. не использовать устаревшие early-game понятия Energy/Information как molecular branch identity.

Флаг — факт, а не скрытая оценка игрока.

Плохо:

```text
run.player_is_good = true
run.civ.bad_government = true
```

Хорошо:

```text
run.civ.governance = "council"
run.crisis.warning_choice = "manual_verify"
```

---

# 2. Namespace ownership

Canonical namespaces:

```text
run.bio.*
run.civ.*
run.energy.*
run.crisis.*
run.anomaly.*
chronicle.timeline_*
meta.archive.*
meta.anomaly.*
meta.endings.*
```

## `run.*`

Сбрасывается при переходе к новой Timeline, кроме данных, скопированных в immutable Timeline Summary.

## `chronicle.*`

Хранит открытые записи и ссылки на конкретные timelines. Persistent.

## `meta.*`

Persistent knowledge/progression Архива. Не сбрасывается обычным run reset.

---

# 3. Biological run flags

## Primary trait

```text
run.bio.primary_trait = "absorption" | "symbiosis" | "shell"
```

Compatibility booleans допустимы для selectors/content filters:

```text
run.bio.absorption = boolean
run.bio.symbiosis = boolean
run.bio.shell = boolean
```

Rule: exactly one primary trait in Timeline #1.

Do not use:

```text
run.bio.primary_trait = "photosynthesis"
run.bio.primary_trait = "chemosynthesis"
```

---

## Optional metabolism

```text
run.bio.metabolism.photosynthesis = boolean
run.bio.metabolism.chemosynthesis = boolean
```

These may coexist with any primary trait if gameplay allows.

---

## Adaptations

Preferred representation:

```text
run.bio.adaptations = [
  "mobility",
  "sensory_cells",
  "digestion",
  "structural_tissue"
]
```

If implementation uses map/set semantics:

```text
run.bio.adaptations.mobility = true
```

Narrative layer should treat this as a set, not as exclusive branch.

AP stock itself is gameplay state, not narrative flag.

---

## Behavior

```text
run.bio.behavior = "solitary" | "social" | "tool_use"
```

---

## Cognition encounters

```text
run.bio.encounters.danger = "flee" | "confront"
run.bio.encounters.other = "cooperate" | "conflict"
```

These are flavor/profile facts. They must not independently gate Sapience.

---

## Biological milestones

If milestone completion is not already represented by Goal Engine/history, optional convenience flags may be derived rather than persisted:

```text
run.bio.cell_reached
run.bio.multicellular_reached
run.bio.sapience_reached
```

Preferred source of truth remains milestone/goal state.

Do not persist duplicate flags unless a selector/save migration requires them.

---

# 4. Civilization run flags

## Cultural tradition

Only if event exists in current build:

```text
run.civ.cultural_tradition = "hunting" | "gathering" | "knowledge"
```

Optional/profile only by default.

---

## Distribution

```text
run.civ.distribution = "shared" | "merit_weighted"
```

---

## Settlement focus

Optional:

```text
run.civ.settlement_focus = "irrigation" | "masonry" | "exchange"
```

---

## Governance

```text
run.civ.governance = "council" | "leader" | "merchants"
```

---

## City focus

Optional:

```text
run.civ.city_focus = "production" | "science" | "energy"
```

---

## Modern focus

Optional:

```text
run.civ.modern_focus = "electrification" | "research" | "logistics"
```

These choices are profile/history state. Exact modifiers belong to gameplay config.

---

# 5. Energy strategy

Major Industry choice:

```text
run.energy.strategy = "fossil" | "clean" | "early_atomic"
```

Derived tags may exist if needed by gameplay:

```text
run.energy.tags.pollution
run.energy.tags.clean_transition
run.energy.tags.atomic_acceleration
```

But tags should be generated from explicit config/effects, not inferred by narrative code.

---

# 6. Anomaly flags

## Traces Before Us

Run choice:

```text
run.anomaly.trace_choice = "study" | "dismantle" | "preserve"
```

Persistent discovery:

```text
meta.anomaly.first_trace_found = true
```

Choice-specific persistent facts:

```text
meta.anomaly.first_trace_studied = true
meta.anomaly.first_trace_lost = true
meta.anomaly.first_trace_preserved = true
```

Only one of the choice-specific first-run flags should be written for Timeline #1.

Narrative meaning is intentionally unresolved.

---

## ERROR 17

```text
run.anomaly.error17_active = true
meta.anomaly.error17_seen = true
meta.archive.prediction_leak_seen = true
```

`run.anomaly.error17_active` may disappear after reset.

Persistent flags remain.

Do not add:

```text
meta.archive.knows_filter_truth = true
```

Timeline #1 does not establish that knowledge.

---

## Again

```text
run.anomaly.again_seen = true
meta.archive.heard_again = true
```

This records that the player saw the line, not what it means.

---

# 7. Crisis flags

## Entry

If useful for recovery/idempotency:

```text
run.crisis.started = true
run.crisis.phase = "C0" | "C1" | "C2" | "C3" | "C4"
```

Phase/state machine authority remains technical/gameplay code.

---

## Bloc conflict

```text
run.crisis.bloc_choice = "deescalate" | "sanctions" | "force"
```

---

## False warning

```text
run.crisis.warning_choice = "trust_automation" | "manual_verify"
```

---

## Last Protocol

```text
run.crisis.last_protocol = "retaliate" | "disarm" | "delegate_system"
```

Ending subtype mapping:

```text
retaliate       -> ash_fire
disarm          -> ash_too_late
delegate_system -> ash_system
```

Preferred implementation: derive subtype through ending resolver rather than trusting a mutable UI field.

If pending state is required transactionally:

```text
meta.endings.pending_subtype = "ash_fire" | "ash_too_late" | "ash_system"
```

It must be cleared/finalized by the reset transaction.

---

# 8. Ending flags

Canonical first ending:

```text
ending_id = "ENDING_ASH"
```

Persistent history should record at least:

```text
meta.endings.ash_seen = true
meta.endings.first_ending = "ENDING_ASH"
meta.endings.timeline_1_subtype = "ash_fire" | "ash_too_late" | "ash_system"
```

If ending history is an array/list, prefer immutable summary references over many standalone booleans.

Example conceptual structure:

```text
meta.endings.history[] = {
  timeline_id,
  ending_id,
  subtype,
  timestamp_or_run_index,
  summary_id
}
```

Do not write Archive rewards twice if the ending flow is retried after crash/recovery.

---

# 9. Archive/reset flags

After immutable Timeline #1 Summary is committed:

```text
meta.archive.timeline_1_saved = true
meta.archive.memory_unlocked = true
meta.archive.first_reset_complete = true
```

Narrative teaser state:

```text
meta.archive.we_can_change_result_seen = true
```

Optional if UI needs explicit teaser acknowledgement:

```text
meta.archive.timeline_2_teaser_seen = true
```

These flags must only be written after or within the idempotent reset transaction according to DS-03.

---

# 10. Chronicle flags / entries

Prefer entry IDs over one boolean per sentence.

Canonical required Timeline #1 entry IDs:

```text
CHRON_RNA_STABLE
CHRON_SELF_REPLICATION
CHRON_FIRST_CELL
CHRON_PRIMARY_TRAIT
CHRON_MULTICELLULAR
CHRON_BEHAVIOR
CHRON_SAPIENCE
CHRON_TRIBE
CHRON_DISTRIBUTION
CHRON_SETTLEMENT
CHRON_FIRST_TRACE
CHRON_WRITING
CHRON_GOVERNANCE
CHRON_MACHINE_AGE
CHRON_ENERGY_STRATEGY
CHRON_ERROR_17
CHRON_ATOMIC_AGE
CHRON_BLOC_CONFLICT
CHRON_FALSE_WARNING
CHRON_LAST_PROTOCOL
CHRON_ASH
CHRON_ARCHIVE_REMEMBERS
```

Suggested persistent representation:

```text
chronicle.timeline_1.entries = [entry_id...]
```

Choice-dependent entries reference stored run summary data rather than hardcoding prose into flags.

---

# 11. Timeline Summary snapshot

At reset, immutable summary should capture narrative-relevant state before run flags reset.

Minimum narrative payload:

```text
timeline_id
ending_id
ending_subtype
bio.primary_trait
bio.optional_metabolism[]
bio.adaptations[]
bio.behavior
bio.encounters
civ.cultural_tradition?
civ.distribution
civ.settlement_focus?
civ.governance
civ.city_focus?
civ.modern_focus?
energy.strategy
anomaly.trace_choice
anomaly.error17_seen
anomaly.again_seen
crisis.bloc_choice
crisis.warning_choice
crisis.last_protocol
chronicle_entry_ids[]
```

Gameplay/stat fields such as duration, peak Population, Stability and rewards live alongside this payload per GDD/DS-03.

---

# 12. Reset behavior

## Must reset

```text
run.bio.*
run.civ.*
run.energy.*
run.crisis.*
run.anomaly.*
```

except any state explicitly reconstructed by Archive meta features for Timeline #2.

## Must persist

```text
chronicle.*
meta.archive.*
meta.anomaly.*
meta.endings.*
```

plus Archive progression/currencies defined by DS-04.

---

# 13. Idempotency rules

The following writes are idempotency-sensitive:

- creation of Timeline Summary;
- ending history append;
- Chronicle finalization;
- Archive Fragments reward;
- `first_reset_complete`;
- Timeline #2 candidate creation.

They must be tied to the stable reset transaction ID from DS-03.

Narrative UI may replay safely after crash, but permanent reward/history writes may not duplicate.

---

# 14. Migration / deprecated state

Deprecated player-facing biological identities include concepts from the superseded E/I design.

Do not preserve as canonical narrative branch:

```text
Information resource
Chemical Gradient
Catalytic Fold
Energy Pocket
primary metabolism = photosynthesis/chemosynthesis/absorption
```

Migration may read old values to recover or restart pre-release saves, but new Timeline Summary / Chronicle output must use reconciled vocabulary.

If an old save cannot be mapped unambiguously, follow the accepted pre-release migration/restart policy rather than inventing narrative history.

---

# 15. Selector guidance

Narrative content should be queried through selectors such as conceptual:

```text
getPrimaryTrait(state)
getBioAdaptations(state)
getBehaviorProfile(state)
getCivilizationProfile(state)
getEnergyStrategy(state)
getCrisisChoices(state)
getNarrativeAnomalies(state)
getTimelineSummary(state, timelineId)
```

Avoid UI components reaching directly into many nested flags if canonical selectors already exist or can be added within DS-03 architecture.

---

# 16. Telemetry boundary

Narrative flags are not analytics events.

Telemetry may emit when flags change, e.g.:

```text
narrative_choice_resolved
anomaly_seen
ending_reached
archive_summary_saved
```

But telemetry loss must not change narrative/save state.

---

# 17. Validation invariants

Config/state validation should enforce where practical:

- exactly one Timeline #1 `run.bio.primary_trait` after EV-BIO-01;
- `photosynthesis`/`chemosynthesis` never replace primary trait;
- Sapience does not require a specific encounter choice;
- `ENDING_ASH` always has one valid subtype;
- subtype matches Last Protocol mapping;
- `meta.archive.timeline_1_saved` implies Timeline #1 Summary exists;
- Archive reward transaction cannot apply twice;
- persistent anomaly flags survive reset;
- no deprecated molecular narrative ID appears in new Chronicle output.

---

# 18. DS-05 flag freeze

This document freezes **semantic names and persistence intent**, not physical storage shape.

DS-03 may implement equivalent normalized structures if:

1. semantic values are preserved;
2. reset/persistence behavior matches this contract;
3. Chronicle and ending reconstruction remain deterministic;
4. migrations are explicit;
5. no gameplay modifier is silently encoded in narrative state.
