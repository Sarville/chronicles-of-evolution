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

**Status:** DONE — confirmed by user on 2026-09-16.

GitHub did not expose a newer implementation SHA when DS-05 was opened. Do not invent one; add the actual reference when it becomes available.

Scope represented by Iteration 4:

- [x] Metabolism / post-Cell progression
- [x] Biomass/Energy cellular layer
- [x] first primary branch: Absorption / Symbiosis / Shell
- [x] post-Cell content expansion
- [x] Iteration 4 accepted as complete for unlocking design work

Still requires later full biological validation where applicable:

- [ ] full AP reward/cost table
- [ ] full Multicellularity / body adaptation pass
- [ ] Nervous System / Cognition 0–100 end-to-end pass
- [ ] biological 0–40 simulation
- [ ] exact optional Photosynthesis/Chemosynthesis tuning if still provisional

---

# CURRENT — DS-05: Timeline #1 full narrative package

**Status:** IN PROGRESS.

Create and reconcile:

- [ ] `docs/scenario/01_TIMELINE_01_SCRIPT.md`
- [ ] `docs/scenario/04_STORY_EVENTS.md`
- [ ] `docs/scenario/05_NARRATIVE_FLAGS.md`
- [ ] `docs/scenario/06_ENDINGS_COPY.md`
- [ ] `docs/scenario/07_COPY_GUIDE.md`

DS-05 rules:

- [ ] use reconciled RNA → DNA → Cell gameplay language
- [ ] do not add a new economy or gameplay gate
- [ ] keep text short and gameplay-readable
- [ ] preserve Error 17 / `Снова.` / Ash / Archive thread
- [ ] make Archive voice evolve gradually from neutral system to ambiguous participant
- [ ] keep Timeline #1 mystery unresolved
- [ ] align every mandatory scene with G001–G024/event contracts
- [ ] define Chronicle copy separately from blocking UI copy
- [ ] preserve first Ash as unavoidable
- [ ] preserve all three Last Protocol subtypes
- [ ] end with `АРХИВ ПОМНИТ` / Timeline #2 teaser
- [ ] user review DS-05
- [ ] mark DS-05 accepted in `PROJECT_STATE.yaml`

---

# DS-06 — UX architecture and wireframes

**Status:** UNLOCKED; start after or alongside DS-05 review.

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
Iteration 4 complete
→ DS-05 narrative package
→ user review
→ DS-06 UX architecture
→ art/audio/platform tracks
→ balance/regression
→ DS-11 freeze v2
```
