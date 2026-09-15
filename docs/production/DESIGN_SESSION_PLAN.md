# Хроники Эволюции — план дизайн-сессий

**Версия:** reconciliation revision 2.1  
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

- **DS-00 — Documentation orchestration:** done.
- **DS-01 — Civilization gameplay contract:** reconciled.
- **DS-02 — Goals, events and first ending:** reconciled.
- **DS-03 — Technical architecture/data contract:** accepted architecture; content references reconciled.
- **DS-04 — Meta progression/balance:** reconciled.

DS-03 architecture remains authoritative for domain/save/testing boundaries.

---

# 3. RECONCILIATION — Original GDD design reconciliation

**Status:** ACCEPTED / documentation complete.

## Goal

Restore original readable gameplay progression while preserving useful architecture, narrative and meta systems.

## Accepted progression

```text
RNA → replication → DNA → membrane → Cell
→ metabolism / Absorption-Symbiosis-Shell
→ Multicellularity + AP
→ Nervous System → Cognition → Sapience
→ Tribe → Settlement → City → Industry → Modern → Atomic → Crisis → Ash → Archive
```

## Accepted retained systems

- Goal Engine;
- data-driven config;
- normalized GameState;
- save/recovery/autosave;
- dev simulation/time scale;
- telemetry;
- branch/optional infrastructure;
- Stability/World Tension;
- Error 17;
- `Снова.`;
- Ash;
- Archive/meta;
- idempotent reset;
- Timeline #2.

## Outputs

- `docs/DECISIONS_RECONCILIATION.md`;
- reconciled `gdd/01..11`;
- reconciled production/technical references;
- updated Glossary/README/PROJECT_STATE/TODO.

## Gate

Passed by user approval on 2026-09-16.

---

# 4. Current implementation checkpoint — Biological Rework

**Status:** READY.

This is the next work block before any new content expansion.

Required sequence:

1. prepare Codex handoff;
2. rework playable 0–10 to RNA→DNA→Cell;
3. rebalance headlessly;
4. manual playtest;
5. user approves corrected playable;
6. unlock Iteration 4.

Iteration 4 remains blocked until this checkpoint passes.

---

# 5. DS-05 — Timeline #1 full narrative package

**Status:** wait for corrected playable 0–10.

Create:

- `scenario/01_TIMELINE_01_SCRIPT.md`;
- `scenario/04_STORY_EVENTS.md`;
- `scenario/05_NARRATIVE_FLAGS.md`;
- `scenario/06_ENDINGS_COPY.md`;
- `scenario/07_COPY_GUIDE.md`.

Must use reconciled gameplay language and timings.

Keep Error 17 / Again / Ash / Archive thread.

---

# 6. DS-06 — UX architecture and wireframes

**Status:** wait for corrected playable 0–10.

Must include:

- mobile-first shell;
- contextual resources;
- Goal card;
- Evolution/AP UI;
- Cognition meter;
- small-group Tribe transition;
- phase-aware jobs;
- Industry Power reveal;
- Modern bridge;
- World Tension;
- Archive/reset UI.

No Energy/Information molecular top bar.

---

# 7. DS-07 — Art direction

Blocked until DS-05 + DS-06.

Visual states must distinguish:

- RNA/molecular;
- Cell;
- primary biological trait;
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

Audio arc follows reconciled eras and crisis/ending progression.

---

# 10. DS-10 — Analytics/platform readiness

Blocked until gameplay/UX contracts stabilize.

Telemetry must include:

- RNA/DNA timings;
- AP earned/spent;
- Cognition sources;
- Population/job bottlenecks;
- Power/Modern pacing;
- crisis/Archive;
- optional rewarded systems outside baseline.

---

# 11. DS-11 — Cross-document consistency / design freeze v2

Final freeze only after:

- biological rework accepted;
- 0–40 simulation passes;
- civilization rebalance passes;
- crisis regression passes;
- narrative/UX/art/audio/platform docs align.

Checks include:

- no canonical visible molecular Information;
- no canonical Chemical Gradient/Catalytic Fold/Energy Pocket;
- M01–M06 semantics consistent;
- AP/Cognition consistent;
- Power timing consistent;
- Modern exists;
- Archive uses restored vocabulary;
- no orphan IDs/events/assets.

Result:

**First Timeline Design Baseline v2.0 — Reconciled.**

---

# 12. Current order

```text
Prepare Codex biological rework handoff
→ rework 0–10
→ rebalance/manual playtest
→ corrected Iteration 4
→ DS-05 / DS-06
→ art/audio/platform tracks
→ DS-11 freeze v2
```