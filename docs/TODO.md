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
- [x] balance/simulation for 10–18: `npm run test:sim` extended with C0x timings across all profiles plus a new Symbiosis (C02B) branch-variant profile; all profiles land inside 10–18 min on first pass
- [ ] manual 10–18 playtest — not yet run; closed by direct user confirmation ahead of this step, so treat exact 10–18 numbers as provisional until it happens

### DS-05 consistency fix (2026-09-16, same day)

Checking DS-05 against the implementation found that `goals.js` had wired `C01/C03/C05/C06` to `G006-G009` purely by node order, colliding with the canonical goal contract in `docs/gdd/07_GOALS_AND_MILESTONES.md` (G008 = Adaptation Points, G009 = Multicellularity/MS02 — neither exists yet) and with `docs/scenario/01_TIMELINE_01_SCRIPT.md`'s scene beats. Corrected in the same session:

- [x] `G006` = composite condition (`C01` completed AND a branch selected) — matches the script's branch-choice-then-`G006 completed` beat
- [x] `G007` = `C06` completion (folds Protein Synthesis + Organelles + Cell Coordination into one "cellular systems" goal, per canon) — `C03`/`C05` no longer carry their own `goalId`
- [x] removed the old `G008`/`G009` (wrongly Organelles / Cell Coordination) and the premature 1 AP grant + `ap` resource + `MS_CELL_COORDINATION` milestone that rode on them — AP stays Iteration 5 scope (canon: first AP grant is part of `G008`, ~20–24 min)
- [x] added `run.bio.primary_trait` / `run.bio.absorption|symbiosis|shell` / `run.bio.metabolism.photosynthesis|chemosynthesis` flags on the relevant node purchases, per `docs/scenario/05_NARRATIVE_FLAGS.md`
- [x] added two small engine primitives to support the above: `branch_selected` goal condition, `set_flag` node effect
- [x] all automated gates re-run and green

Later full biological validation still includes:

- [ ] full AP reward/cost table
- [ ] full Multicellularity / body adaptation pass
- [ ] Nervous System / Cognition 0–100 end-to-end pass
- [ ] biological 0–40 simulation
- [ ] exact optional Photosynthesis/Chemosynthesis tuning if still provisional

---

# CURRENT — DS-05: Timeline #1 full narrative package

**Status:** READY FOR USER REVIEW.

Created:

- [x] `docs/scenario/01_TIMELINE_01_SCRIPT.md`
- [x] `docs/scenario/04_STORY_EVENTS.md`
- [x] `docs/scenario/05_NARRATIVE_FLAGS.md`
- [x] `docs/scenario/06_ENDINGS_COPY.md`
- [x] `docs/scenario/07_COPY_GUIDE.md`

DS-05 checks:

- [x] use reconciled RNA → DNA → Cell gameplay language
- [x] do not add a new economy or gameplay gate
- [x] keep text short and gameplay-readable
- [x] preserve Error 17 / `Снова.` / Ash / Archive thread
- [x] make Archive voice evolve gradually from neutral system to ambiguous participant
- [x] keep Timeline #1 mystery unresolved
- [x] align mandatory scenes with G001–G024/event contracts
- [x] define Chronicle copy separately from blocking UI copy
- [x] preserve first Ash as unavoidable
- [x] preserve all three Last Protocol subtypes
- [x] end with `АРХИВ ПОМНИТ` / Timeline #2 teaser
- [ ] user review DS-05
- [ ] mark DS-05 accepted in `PROJECT_STATE.yaml`

---

# DS-06 — UX architecture and wireframes

**Status:** UNLOCKED; recommended next after DS-05 review.

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

# Following design sessions

- [ ] DS-07 — Art direction, locations and era transitions
- [ ] DS-08 — asset manifest and generation prompts
- [ ] DS-09 — audio design and generation package
- [ ] DS-10 — analytics/platform readiness
- [ ] DS-11 — final cross-document consistency / design freeze v2

Dependencies:

```text
DS-05 + DS-06
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
DS-05 package ready
→ user review / approval
→ DS-06 UX architecture
→ art/audio/platform tracks
→ balance/regression
→ DS-11 freeze v2
```
