# Хроники Эволюции — Narrative Flags Contract

**Документ:** DS-05, act-structure revision 3.0
**Статус:** ready for review
**Назначение:** единый контракт narrative state для всех пяти глав Act 1
(`T1–T5`) и перехода в Archive/meta/Act 2.
**Technical authority:** DS-03 architecture сохраняет приоритет по структуре GameState/save/migration.

**Что изменилось относительно предыдущей revision:** раньше был один
run→reset переход (конец единого Timeline #1). Теперь внутри Act 1
происходит **четыре промежуточных chapter-reset** (`T1→T2`, `T2→T3`,
`T3→T4`, `T4→T5`) плюс один финальный Act-reset (`T5→Act 2`). См. §3.1
(namespace) и §12 (reset behavior) для точной механики.

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
run.chapter
run.chapterN.*      (N = 1..4, chapter-scoped collapse state)
run.bio.*
run.civ.*
run.energy.*
run.crisis.*
run.anomaly.*
chronicle.timeline_*
meta.act1.*
meta.archive.*
meta.anomaly.*
meta.endings.*
```

## `run.*`

Сбрасывается при переходе к новой главе (`T1→T2→T3→T4→T5`), кроме данных,
скопированных в immutable Chapter Summary перед сбросом (см. §11, §12).
`run.chapterN.*` — новый под-namespace 2026-09-17: хранит флаги, специфичные
для сюжета одной конкретной главы (`blight_noticed`, `tremor_noticed` и
т.д.), сбрасывается вместе с остальным `run.*` при переходе в следующую
главу — его persistent-эквивалент фиксируется как `meta.endings.chapterN_subtype`
до сброса.

## `chronicle.*`

Хранит открытые записи и ссылки на конкретные главы/timelines. Persistent.

## `meta.*`

Persistent knowledge/progression Архива через все главы Act 1 и дальше.
Не сбрасывается chapter reset. `meta.act1.*` — новый под-namespace,
специфичный для внутриактовой прогрессии (species skin budget, номер
текущей главы для recovery).

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

# 5A. Act 1 chapter flags (2026-09-17)

## Current chapter

```text
run.chapter = "T1" | "T2" | "T3" | "T4" | "T5"
```

Written on chapter start; used for recovery (resume mid-chapter after
crash) and for T5-DECK preconditions.

## Species skin budget

```text
meta.act1.species_skin = 0 | 1 | 2
```

`0` = original lineage (`T1`, `T3`, `T5`), `1` = skin #1 (`T2`, `T3` —
persists until the next swap), `2` = skin #2 (`T4`, then explicitly reset
to `0` on `T5` entry per `EV-NAR-08`). Cosmetic only — does not gate
biological trait content, which remains reserved for Act 3.

## `T1` collapse flags

```text
run.chapter1.blight_noticed = boolean
run.chapter1.response = "isolate" | "stay_together" | "healer"
```

## `T2` collapse flags

```text
run.chapter2.tremor_noticed = boolean
run.chapter2.response = "converge" | "shelter_separately" | "old_experience"
```

## `T3` collapse flags

```text
run.chapter3.fracture_noticed = boolean
run.chapter3.response = "suppress" | "split" | "vote"
```

## `T4` collapse flags

```text
run.chapter4.automation_pace = "cautious" | "aggressive" | "delegated"
run.chapter4.overload_noticed = boolean
run.chapter4.response = "manual_stop" | "reroute" | "trust_automation"
```

## Reveal flags (persist across chapters)

```text
meta.archive.heard_before_seen = true       # after T1 (Мор)
meta.archive.knows_more_seen = true         # after T3 (Раскол)
meta.archive.filter_probability_glimpsed = true  # after T4 (Авария)
```

These are the redistributed reveals from the old single-arc bible
(`docs/scenario/00_NARRATIVE_BIBLE.md` §0, §5) — each now lands at the
end of a specific chapter instead of being held back for hours.

---

# 5B. `T5`-only synthesis deck flags

```text
meta.endings.chapter1_subtype = "blight_isolated" | "blight_unified" | "blight_early_medicine"
meta.endings.chapter2_subtype = "cataclysm_converge" | "cataclysm_scattered" | "cataclysm_unprepared"
meta.endings.chapter3_subtype = "fracture_suppressed" | "fracture_split" | "fracture_deliberated"
meta.endings.chapter4_subtype = "overload_manual" | "overload_rerouted" | "overload_automated"
```

These four flags are the **only** state the `t5_synthesis` deck
(`docs/scenario/04_STORY_EVENTS.md` §T5-DECK) is allowed to read.
Written as `meta.*` (persistent) at the moment each chapter's ending
resolves, *before* that chapter's `run.*` state resets — same
idempotency treatment as `meta.endings.timeline_1_subtype` had in the
old single-arc contract (§8 below). If a flag is absent (e.g. migrated
save missing chapter history), the corresponding deck events are simply
not eligible — no placeholder text is generated.

---

# 5C. Act 2 (`P1–P3`) flags (2026-09-17, `ACT-008`)

```text
run.p.active_id = "P1" | "P2" | "P3"
run.p.cause = "diplomacy_stagnation" | "military_conflict" | "scholar_starvation"
meta.act2.completed.P1 = true|false
meta.act2.completed.P2 = true|false
meta.act2.completed.P3 = true|false
meta.act2.unified_reveal_seen = true|false
```

`meta.act2.unified_reveal_seen` gates the full reveal scene
(`docs/scenario/02_ACT2_ACT3_SCRIPT.md` §2.2) vs. the compact repeat card
(§2.3) — written once, on the **first** `P` completion across the account,
never rewritten by later `P` runs. `meta.act2.completed.*` are independent
per-`P` booleans consumed by the achievement list
(`docs/gdd/14_GLOBAL_ARCHIVE_AND_ACHIEVEMENTS.md` §4.4) — only one needs to
be true for Act 3 to unlock (`ACT-003` "one `P` is mandatory").

---

# 5D. Act 3 flags (2026-09-17, `ACT-009`/`ACT-010`)

```text
meta.act3.entered = true|false
meta.act3.system_seen.<system_id> = true|false   (one per system, §3 in 02_ACT2_ACT3_SCRIPT.md)
meta.act3.first_reset_finale_seen = true|false
meta.archive.grand_finale_seen = true|false
meta.archive.completion_pct = 0..100             (derived, not directly writable — see below)
```

`meta.archive.completion_pct` is a **derived** value, recomputed from the
full achievement flag set defined in
`docs/gdd/14_GLOBAL_ARCHIVE_AND_ACHIEVEMENTS.md` §2–§4 — it is never
written directly by narrative code, only read to trigger `ACT-010`'s grand
finale the moment it crosses 100. `meta.archive.grand_finale_seen` is the
persistent guard against replaying that scene; it is set once and is not
recomputed if content is added later and the denominator changes (see that
doc §4.5 for why the percentage can move without this flag resetting).

`<system_id>` values are not enumerated here — they are owned by the future
Act 3 gameplay config (`docs/DECISIONS_ACT_STRUCTURE.md` `ACT-006`, still
open) and this contract only fixes the flag shape
(`meta.act3.system_seen.<system_id>`), not the finite list.

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

Canonical Act 1 endings, one per chapter, none reused across chapters:

```text
ending_id = "ENDING_BLIGHT"      # T1
ending_id = "ENDING_CATACLYSM"   # T2
ending_id = "ENDING_FRACTURE"    # T3
ending_id = "ENDING_OVERLOAD"    # T4
ending_id = "ENDING_ASH"         # T5, the only mandatory-crisis ending
```

Persistent history should record at least:

```text
meta.endings.blight_seen = true
meta.endings.cataclysm_seen = true
meta.endings.fracture_seen = true
meta.endings.overload_seen = true
meta.endings.ash_seen = true
meta.endings.act1_complete = true   # all five chapters resolved
meta.endings.timeline_1_subtype = "ash_fire" | "ash_too_late" | "ash_system"
```

`meta.endings.chapterN_subtype` (§5B) are the per-chapter equivalents of
`timeline_1_subtype` and follow the same idempotency rules.

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

Act 1 now has **five reset points** instead of one: `T1→T2`, `T2→T3`,
`T3→T4`, `T4→T5` (chapter resets) and `T5→Act 2` (Act reset). Chapter
resets and the Act reset use the same underlying transaction mechanism;
they differ only in scope.

## Chapter reset (`T1→T2`, `T2→T3`, `T3→T4`, `T4→T5`)

### Must reset

```text
run.bio.*
run.civ.*
run.energy.*
run.crisis.*
run.anomaly.*
run.chapterN.*     (the chapter that just ended)
```

except any state explicitly reconstructed by the next chapter's starting
condition (dispersed start, defense kit, Cognition bias — see
`docs/gdd/07_GOALS_AND_MILESTONES.md` §5–7).

### Must persist

```text
chronicle.*
meta.archive.*
meta.anomaly.*
meta.endings.*       (including the chapterN_subtype just written)
meta.act1.species_skin
run.chapter           (overwritten to the new chapter id, not cleared)
```

## Act reset (`T5→Act 2`)

Same as chapter reset, plus: full `meta.endings.act1_complete = true`,
persistent AF/Chronicle carryover into `P1` starting capital (per
`docs/gdd/12_LONG_TERM_PROGRESSION_AND_RESET_ROADMAP.md` §5), and
`meta.act1.species_skin` resets to `0` for the transition into Act 2
(no skin budget carries into `P1–P3`).

plus Archive progression/currencies defined by DS-04.

## `P` reset (`P1/P2/P3` completion → Act 3 or repeat `P` menu)

`run.p.*` resets fully. `meta.act2.completed.<id>` and
`meta.act2.unified_reveal_seen` are `meta.*` and survive — same
idempotency treatment as `meta.endings.*` (§13 below). No skin/species
state to reset (`P` does not use the `T2`/`T4` swap system).

## Act 3 universe/challenge reset

Resets whatever Act 3's own currencies/run-local state are (owned by the
future Act 3 GDD, not this contract). `meta.act3.*` and
`meta.archive.*` flags are `meta.*` and always survive — in particular
`meta.act3.first_reset_finale_seen` must be set **before** the first such
reset clears run-local state, same ordering rule as chapter/`t5_synthesis`
flags above, so the finale scene (`02_ACT2_ACT3_SCRIPT.md` §4) can read a
consistent snapshot of the run that is about to be cleared.

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
