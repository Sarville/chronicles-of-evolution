# Хроники Эволюции — план дизайн-сессий

**Версия:** DS-05 revision 3.0  
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
- **RECONCILIATION — Original GDD reconciliation:** accepted.

DS-03 architecture remains authoritative for domain/save/testing boundaries.

---

# 3. Reconciled gameplay baseline

Accepted progression:

```text
RNA → replication → DNA → membrane → Cell
→ metabolism / Absorption-Symbiosis-Shell
→ Multicellularity + AP
→ Nervous System → Cognition → Sapience
→ Tribe → Settlement → City → Industry → Modern → Atomic → Crisis → Ash → Archive
```

Accepted retained systems:

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

---

# 4. Implementation checkpoint

## Biological 0–10 reconciliation

**Status:** DONE / frozen baseline accepted.

Completed:

1. RNA→DNA→Cell playable rework;
2. headless rebalance;
3. manual playtest;
4. user approval;
5. 0–10 freeze.

## Iteration 4 — corrected content after Cell

**Status:** DONE — user confirmed 2026-09-16.

The repository did not expose a newer implementation SHA when DS-05 was opened, so the state keeps the completion commit as `pending_remote_reference` rather than inventing one.

Iteration 4 completion unlocks DS-05 and DS-06.

---

# 5. DS-05 — Timeline #1 full narrative package

**Status:** READY FOR USER REVIEW.

Created:

- `docs/scenario/01_TIMELINE_01_SCRIPT.md`;
- `docs/scenario/04_STORY_EVENTS.md`;
- `docs/scenario/05_NARRATIVE_FLAGS.md`;
- `docs/scenario/06_ENDINGS_COPY.md`;
- `docs/scenario/07_COPY_GUIDE.md`.

## DS-05 contract

The package:

- follows reconciled gameplay language and timings;
- does not change economy or gameplay gates;
- defines the full 0–120 narrative flow;
- makes Archive voice evolve from neutral system to ambiguous participant;
- preserves `Следы до нас`;
- preserves Error 17 → `Снова.` → Ash → Archive thread;
- preserves unavoidable first Ash;
- defines all three Last Protocol subtypes;
- defines implementation-ready narrative flags;
- ends on `АРХИВ ПОМНИТ` and the first `Мы можем изменить результат.`;
- leaves the core Archive/Filter mystery unresolved.

## Gate

Pending explicit user review/approval.

After approval:

- mark DS-05 accepted in `PROJECT_STATE.yaml`;
- mark DS-05 done in `TODO.md`;
- narrative package becomes authoritative for Timeline #1 implementation copy.

---

# 6. DS-06 — UX architecture and wireframes

**Status:** UNLOCKED.

May start after DS-05 review; can technically run in parallel, but sequential review reduces rework.

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

**Status:** blocked by DS-05 + DS-06.

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

**Status:** blocked by DS-07.

Create stable asset IDs, formats, layer rules and generation prompts.

---

# 9. DS-09 — Audio

**Status:** blocked by DS-05 + DS-07.

Audio arc follows reconciled eras and crisis/ending progression.

---

# 10. DS-10 — Analytics/platform readiness

**Status:** blocked until gameplay/UX contracts stabilize.

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

- biological 0–40 simulation passes;
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
Iteration 4 complete
→ DS-05 user review
→ DS-06 UX architecture
→ DS-07 art direction
→ DS-08 assets / DS-09 audio
→ DS-10 analytics/platform
→ balance/regression
→ DS-11 freeze v2
```
