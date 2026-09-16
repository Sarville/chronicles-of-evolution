# Хроники Эволюции — TODO

**Last update:** 2026-09-16

`PROJECT_STATE.yaml` is the canonical status source. This file is the human-readable work queue.

---

# Completed baseline

- [x] DS-00 — documentation orchestration
- [x] DS-01 — civilization gameplay contract
- [x] DS-02 — goals, events and first ending contract
- [x] DS-03 — technical architecture/data contract
- [x] DS-04 — meta progression and balance rules
- [x] original GDD reconciliation
- [x] biological 0–10 reconciliation implementation
- [x] biological 0–10 rebalance and live playtest
- [x] freeze RNA/DNA/Cell baseline

Accepted technical baseline commit:

`32c0d72f56f48a21e3c22c8e3eb9ef3975e967fb`

Accepted biological 0–10 freeze reference:

`e0b2f5e8eb9e5433eb6c3b934fa048c7203537b1`

---

# Iteration 4 — corrected content after Cell

**Status:** DONE — confirmed by user on 2026-09-16. Implementation commit `79e7b93ea5bde181ff77ad8c6d281449cc5be1d8`.

Scope implemented:

- [x] Metabolism (C01)
- [x] Biomass/Energy cellular economy (PROC_BIOMASS_UPTAKE, PROC_RESPIRATION; fixed dangling `energy.visibleFromEra`)
- [x] first primary branch: Absorption / Symbiosis / Shell (C02A/B/C)
- [x] optional Photosynthesis / Chemosynthesis / Efficient Digestion adaptations (C04A/B/C)
- [x] Protein Synthesis / Ribosome (C03)
- [x] Organelles (C05)
- [x] Cell Coordination (C06) — trunk stops here; Multicellularity itself is Iteration 5
- [x] balance/simulation for 10–18 across profiles incl. Symbiosis branch variant
- [ ] manual 10–18 playtest — exact 10–18 numbers remain provisional until run

### DS-05 consistency fix (2026-09-16)

- [x] `G006` = composite condition (`C01` completed AND primary branch selected)
- [x] `G007` = `C06` completion; Protein Synthesis + Organelles + Cell Coordination folded into canonical cellular-systems goal
- [x] removed premature `G008/G009`, AP grant/resource and `MS_CELL_COORDINATION`
- [x] AP remains Iteration 5 / G008 scope (~20–24 min)
- [x] branch/metabolic flags aligned with `docs/scenario/05_NARRATIVE_FLAGS.md`
- [x] automated gates green after fix

Later full biological validation:

- [ ] full AP reward/cost table
- [ ] full Multicellularity / body adaptation pass
- [ ] Nervous System / Cognition 0–100 end-to-end pass
- [ ] biological 0–40 simulation
- [ ] exact optional Photosynthesis/Chemosynthesis tuning if still provisional

---

# DS-05 — Timeline #1 full narrative package

**Status:** READY FOR USER REVIEW.

Created:

- [x] `docs/scenario/01_TIMELINE_01_SCRIPT.md`
- [x] `docs/scenario/04_STORY_EVENTS.md`
- [x] `docs/scenario/05_NARRATIVE_FLAGS.md`
- [x] `docs/scenario/06_ENDINGS_COPY.md`
- [x] `docs/scenario/07_COPY_GUIDE.md`

Checks:

- [x] RNA → DNA → Cell language
- [x] no new economy/gameplay gate
- [x] Error 17 / `Снова.` / Ash / Archive thread preserved
- [x] Archive voice arc defined
- [x] mandatory scenes aligned with G001–G024/event contracts
- [x] all Last Protocol subtypes preserved
- [x] Timeline #2 teaser ends on `АРХИВ ПОМНИТ`
- [ ] user review DS-05
- [ ] mark DS-05 accepted

---

# CURRENT — DS-05.5: Timeline Presentation Contract

**Status:** READY FOR USER REVIEW.

Created:

- [x] `docs/ux/00_TIMELINE_PRESENTATION_MAP.md`
- [x] `docs/art/00_VISUAL_STATE_MAP.md`

Presentation contract:

- [x] PB00–PB30 bind triggers/goals/events to presentation surfaces
- [x] define semantic UX surfaces: Boot / World / Evolution / Event / Milestone / Chronicle / Crisis / Ending / Archive / Meta
- [x] define world visual states V0–V9
- [x] define creature continuity C0–C7 + C2A/B/C primary-trait variants
- [x] explicitly keep AP hidden until G008
- [x] explicitly reveal Cognition only after Nervous System
- [x] explicitly reveal Power only in Industry
- [x] separate Modern from Industrial and Atomic
- [x] define Sapience as camera/scale transition from individual organism to small group
- [x] define Energy Crisis as persistent visual modifier of the world
- [x] define ERROR 17 as in-UI anomaly, not separate cinematic
- [x] define Atomic → crisis → Last Protocol → flash → Ash sequence
- [x] require Ash to derive from the player's own world rather than generic apocalypse art
- [x] define DS-06 layout responsibilities vs DS-07 visual responsibilities
- [x] update `docs/ux/README.md`
- [x] update `docs/art/README.md` and restore mandatory Modern visual state
- [ ] user review DS-05.5
- [ ] mark DS-05.5 accepted

---

# DS-06 — UX architecture and wireframes

**Status:** UNLOCKED; start after presentation review to avoid rework.

Must inherit `PB00–PB30` and may refine layout without changing their narrative/gameplay meaning.

- [ ] `00_UX_PRINCIPLES.md`
- [ ] `01_SCREEN_MAP.md`
- [ ] `02_MOBILE_WIREFRAMES.md`
- [ ] `03_DESKTOP_WIREFRAMES.md`
- [ ] `04_COMPONENT_STATES.md`
- [ ] `05_TUTORIAL_AND_HINTS.md`
- [ ] mobile-first shell
- [ ] contextual resource presentation
- [ ] Goal card
- [ ] Evolution/AP UI
- [ ] Cognition meter
- [ ] small-group Sapience → Tribe transition
- [ ] jobs/buildings phase architecture
- [ ] Industry Power reveal
- [ ] Modern bridge
- [ ] World Tension
- [ ] Archive/reset UI

---

# DS-07 — Art direction

**Status:** blocked by DS-05 + DS-06.

Must inherit `V0–V9` and `C0–C7`.

Planned:

- [ ] `00_ART_DIRECTION.md`
- [ ] `01_LOCATIONS_AND_DIORAMAS.md`
- [ ] `02_ERA_TRANSITIONS.md`
- [ ] `03_CREATURE_EVOLUTION.md`
- [ ] branch/adaptation visual grammar
- [ ] camera/composition rules
- [ ] crisis degradation layers
- [ ] Ash composition

---

# Following design sessions

- [ ] DS-08 — asset manifest and generation prompts
- [ ] DS-09 — audio design and generation package
- [ ] DS-10 — analytics/platform readiness
- [ ] DS-11 — final cross-document consistency / design freeze v2

Dependencies:

```text
DS-05 + DS-05.5 review
→ DS-06
→ DS-07
→ DS-08

DS-05 + DS-07
→ DS-09

stable gameplay + UX
→ DS-10

all tracks + balance/regression
→ DS-11
```

---

# Later implementation / balance work

## Biology 0–40

- [ ] validate AP economy
- [ ] validate Multicellularity target ~24–28 min
- [ ] validate Nervous System
- [ ] validate Cognition sources
- [ ] validate Sapience ~38–40 min

## Civilization 40–108

- [ ] set civilization starting package around Population 5
- [ ] retune Population growth/thresholds
- [ ] validate Tribe 38–50
- [ ] validate Settlement 50–65
- [ ] validate City ~78–80
- [ ] validate Power unlock in Industry
- [ ] validate Industry ~93–95
- [ ] validate Modern ~95–104
- [ ] validate Atomic ~107–108

## Crisis / Archive

- [ ] regression Stability / World Tension
- [ ] regression Error 17
- [ ] regression `Снова.`
- [ ] regression Last Protocol
- [ ] regression inevitable first Ash
- [ ] revalidate AF formula against new node/population counts
- [ ] keep first reset ~14–18 AF
- [ ] regression idempotent reset
- [ ] retune Timeline #2 acceleration after Timeline #1 simulation

---

# Immediate order

```text
DS-05 narrative package ready
+ DS-05.5 presentation contract ready
→ user review / approval
→ DS-06 UX architecture
→ DS-07 art direction
→ art/audio/platform tracks
→ balance/regression
→ DS-11 freeze v2
```
