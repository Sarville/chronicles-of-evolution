# Хроники Эволюции — план дизайн-сессий

**Версия:** reconciliation revision 2.0  
**Статус:** active plan.

---

# 1. Workflow principle

Each major design block must:

1. have explicit inputs;
2. produce a coherent contract;
3. pass user review;
4. update `PROJECT_STATE.yaml` and `TODO.md`;
5. record decisions when canon changes;
6. become authoritative only after review.

Codex must not invent gameplay design to fill documentation gaps.

---

# 2. Historical sessions

## DS-00 — Documentation orchestration

Status: done.

## DS-01 — Civilization gameplay contract

Status: **reconciled**.

Original DS-01 entity separation remains useful; timing/resource/branch assumptions are updated by reconciliation docs.

## DS-02 — Goals, events and first ending

Status: **reconciled**.

Goal Engine semantics, event architecture and Ash/reset contract remain; biological goals and timings were rewritten.

## DS-03 — Technical architecture and data contract

Status: **accepted architecture / reconciled content references**.

Keep:

- isolated domain;
- canonical GameState;
- data-driven config;
- commands/events/selectors;
- save/recovery;
- test seams;
- headless simulation;
- idempotent reset.

## DS-04 — Meta progression and balance rules

Status: **reconciled**.

Archive/meta concepts remain; obsolete Information/Energy-start semantics and old Timeline #2 fixed target are superseded.

---

# 3. RECONCILIATION — Original GDD design reconciliation

**Status:** documentation complete / pending user review.

## Goal

Restore the readable original gameplay progression while preserving useful architecture, narrative and meta systems.

## Inputs

- PRD;
- original `01_FIRST_120_MINUTES.md` concept;
- late economy/tree/goals/civilization docs;
- DS-03 technical contract;
- DS-04 meta/balance;
- accepted Iteration 3 implementation baseline.

## Outputs

- `docs/DECISIONS_RECONCILIATION.md`;
- reconciled `gdd/01..11` contracts;
- reconciled production plan;
- reconciled technical references;
- updated `PROJECT_STATE.yaml`;
- updated `TODO.md`.

## Main accepted direction

```text
RNA → replication → DNA → membrane → Cell
→ metabolism / primary trait
→ Multicellularity + AP
→ Nervous System → Cognition → Sapience
→ Tribe → Settlement → City → Industry → Modern → Atomic → Crisis
```

Preserve:

- Goal Engine;
- data-driven architecture;
- save/recovery;
- simulation/telemetry;
- Archive/meta;
- Ash;
- Error 17;
- idempotent reset.

## Gate

User approves corrected 0–120 canon.

No gameplay code changes before this gate.

---

# 4. REWORK implementation checkpoint

This is not a design session but blocks further content design that depends on playable semantics.

After reconciliation approval:

1. Codex performs biological 0–10 code rework;
2. 0–10 balance simulation;
3. manual playtest;
4. user approves corrected playable.

Only then continue Iteration 4 and dependent narrative/UX detail.

---

# 5. DS-05 — Timeline #1 full narrative package

**Status:** blocked by reconciliation review/playable gate.

## Create

- `scenario/01_TIMELINE_01_SCRIPT.md`;
- `scenario/04_STORY_EVENTS.md`;
- `scenario/05_NARRATIVE_FLAGS.md`;
- `scenario/06_ENDINGS_COPY.md`;
- `scenario/07_COPY_GUIDE.md`.

## Reconciled requirements

Narrative sequencing must use:

- RNA/DNA/Cell language;
- Absorption/Symbiosis/Shell first branch;
- AP/body adaptation phase;
- Cognition meter;
- Sapience ~38–40 target;
- Population~5 civilization start;
- Modern bridge before Atomic.

Keep Error 17 / Again / Ash / Archive thread.

---

# 6. DS-06 — UX architecture and wireframes

**Status:** blocked by reconciliation review/playable gate.

Must include:

- mobile-first shell;
- contextual resource visibility;
- Goal card;
- Evolution/AP UI;
- Cognition meter;
- small-group Tribe transition;
- phase-aware jobs;
- Industry Power reveal;
- Modern bridge;
- World Tension crisis UI;
- Archive/reset UI.

No Energy/Information molecular top bar.

---

# 7. DS-07 — Art direction

Blocked until DS-05 + DS-06.

Reconciled visual states must visibly distinguish:

- molecular RNA;
- first cell;
- primary trait branch;
- multicellular organism;
- nervous/cognitive organism;
- tiny sapient group;
- Tribe;
- Settlement;
- City;
- Industry;
- Modern;
- Atomic;
- Ash.

---

# 8. DS-08 — Art production manifest

Blocked until DS-07.

Create stable asset IDs, formats, layer rules and generation prompts.

---

# 9. DS-09 — Audio

Blocked until DS-05 + DS-07.

Audio arc must follow reconciled eras and preserve crisis/ending emotional progression.

---

# 10. DS-10 — Analytics/platform readiness

Blocked until gameplay/UX contracts stabilize.

Must include telemetry for:

- RNA/DNA timings;
- AP earned/spent;
- Cognition sources;
- Population/job bottlenecks;
- Power/Modern pacing;
- crisis/Archive;
- rewarded systems outside baseline.

---

# 11. DS-11 — Cross-document consistency / design freeze v2

Final freeze occurs only after:

- reconciled docs accepted;
- biological code rework accepted;
- 0–40 biological simulation passes;
- civilization rebalance passes;
- crisis regression passes;
- narrative/UX/art/audio/platform docs are consistent.

Checks:

- no canonical references to visible molecular Information;
- no Chemical Gradient/Catalytic Fold/Energy Pocket canonical content;
- M01–M06 semantics consistent;
- Sapience timing/condition consistent;
- AP/Cognition consistently represented;
- Power timing consistent;
- Modern phase present;
- Archive/meta effects use restored vocabulary;
- no orphan IDs/events/assets.

Result:

**First Timeline Design Baseline v2.0 — Reconciled.**

---

# 12. Current order

```text
Reconciliation review
→ Biological code rework 0–10
→ rebalance/manual playtest
→ corrected Iteration 4
→ DS-05 / DS-06
→ art/audio/platform tracks
→ DS-11 freeze v2
```

Do not resume the old DS-05/Iteration-4 order from pre-reconciliation documents.