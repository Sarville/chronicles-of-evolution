# Хроники Эволюции — план дизайн-сессий

**Версия:** DS-05.5 revision 3.1  
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

Implementation reference:

`79e7b93ea5bde181ff77ad8c6d281449cc5be1d8`

A DS-05 consistency pass subsequently corrected the G006/G007 mapping and removed premature G008/G009/AP content so the implementation matches the canonical narrative/gameplay contract. Exact 10–18 balance remains provisional until manual playtest.

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

---

# 6. DS-05.5 — Timeline Presentation Contract

**Status:** READY FOR USER REVIEW.

Purpose:

Create the missing bridge between gameplay/narrative and future UX/art before detailed wireframes or art direction.

Created:

- `docs/ux/00_TIMELINE_PRESENTATION_MAP.md`;
- `docs/art/00_VISUAL_STATE_MAP.md`.

## Presentation contract

The Timeline is mapped as semantic presentation beats `PB00–PB30`.

For every major beat the contract specifies:

- gameplay/narrative trigger;
- active UX surface;
- world visual state;
- creature state;
- UI reveal/collapse;
- camera/scale intent;
- transition intent;
- audio intent placeholder where useful.

## World states

```text
V0 Primordial
→ V1 Cellular
→ V2 Creature
→ V3 Sapient Tribe
→ V4 Settlement
→ V5 City
→ V6 Industrial
→ V7 Modern
→ V8 Atomic
→ V9 Ash
```

## Creature continuity

```text
C0 Proto-chemistry
→ C1 Protocell
→ C2 Cell
→ C2A/B/C Primary Trait
→ C3 Early Multicellular
→ C4 Multicellular Organism
→ C5 Adapted Organism
→ C6 Cognitive Organism
→ C7 Sapient Species
```

## Hard rules

- AP UI appears only from G008; no premature AP in Iteration 4 presentation;
- Cognition appears only after Nervous System;
- Power appears only in Industry;
- Modern is a distinct world state between Industrial and Atomic;
- Sapience explicitly changes visual scale from one organism to a small sapient group;
- primary biological trait remains recognizable through creature evolution;
- Energy Crisis choice produces a persistent visible world modifier;
- ERROR 17 is an in-UI anomaly, not a standalone cinematic;
- World Tension appears with Atomic/crisis, not earlier;
- Ash must derive from the player's own V8 world rather than use generic apocalypse art;
- Atomic crisis → Ash is the deliberate hard visual rupture of Timeline #1.

## Gate

Pending explicit user review/approval together with DS-05.

Once accepted, DS-06 and DS-07 must inherit PB/V/C semantics and may refine layout/appearance without silently changing their meaning.

---

# 7. DS-06 — UX architecture and wireframes

**Status:** UNLOCKED, recommended after DS-05/05.5 review.

Primary new input:

`docs/ux/00_TIMELINE_PRESENTATION_MAP.md`

Must include:

- `00_UX_PRINCIPLES.md`;
- `01_SCREEN_MAP.md`;
- `02_MOBILE_WIREFRAMES.md`;
- `03_DESKTOP_WIREFRAMES.md`;
- `04_COMPONENT_STATES.md`;
- `05_TUTORIAL_AND_HINTS.md`;
- mobile-first shell;
- contextual resources;
- Goal card;
- Evolution/AP UI;
- Cognition meter;
- small-group Sapience/Tribe transition;
- phase-aware jobs;
- Industry Power reveal;
- Modern bridge;
- World Tension;
- Archive/reset UI.

No Energy/Information molecular top bar.

DS-06 may change layout/interaction form, but not reorder or reinterpret PB00–PB30 without an explicit design decision.

---

# 8. DS-07 — Art direction

**Status:** blocked by DS-05 + DS-06.

Primary new input:

`docs/art/00_VISUAL_STATE_MAP.md`

Must create:

- `00_ART_DIRECTION.md`;
- `01_LOCATIONS_AND_DIORAMAS.md`;
- `02_ERA_TRANSITIONS.md`;
- `03_CREATURE_EVOLUTION.md`;
- branch/adaptation visual grammar;
- camera/composition rules;
- civilization visual development;
- crisis degradation layers;
- Ash composition.

DS-07 must preserve:

- V0–V9 readability;
- C0–C7 continuity;
- distinct Modern state;
- inherited primary biological trait;
- scale progression molecule → cell → organism → group → settlement → city → world.

---

# 9. DS-08 — Art production manifest

**Status:** blocked by DS-07.

Create stable asset IDs, formats, layer rules and generation prompts.

Every production asset must reference its consumer and relevant PB/V/C state.

---

# 10. DS-09 — Audio

**Status:** blocked by DS-05 + DS-07.

Audio arc follows reconciled eras and presentation beats, especially:

- boot/primordial minimalism;
- Life/Multicellularity/Sapience milestones;
- Industry/Modern scale growth;
- Atomic anomaly;
- crisis compression;
- flash → silence → Ash;
- Archive Memory.

---

# 11. DS-10 — Analytics/platform readiness

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

# 12. DS-11 — Cross-document consistency / design freeze v2

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
- Modern exists in gameplay, presentation and art;
- PB/V/C mappings have no orphan references;
- Archive uses restored vocabulary;
- no orphan IDs/events/assets.

Result:

**First Timeline Design Baseline v2.0 — Reconciled.**

---

# 13. Current order

```text
Iteration 4 complete
→ DS-05 narrative package ready
→ DS-05.5 presentation contract ready
→ user review
→ DS-06 UX architecture
→ DS-07 art direction
→ DS-08 assets / DS-09 audio
→ DS-10 analytics/platform
→ balance/regression
→ DS-11 freeze v2
```
