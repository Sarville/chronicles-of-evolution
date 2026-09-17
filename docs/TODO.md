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
- [x] DS-05 — Timeline #1 full narrative package accepted
- [x] DS-05.5 — Timeline Presentation Contract accepted

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

The accepted 0–18 slice is now a baseline inside the full `T1` rebuild below.
Its manual 10–18 playtest remains useful, but its final numbers are approved
only after the unified 0–180 simulation and playtest pass.

### T1 full route implementation (2026-09-17)

- [x] Food: tribe/settlement/city/industry jobs → Population maintenance → Food storage cap → recoverable growth pause.
- [x] Materials and Knowledge: phase-aware jobs/buildings → atomic node/building costs → dedicated storage caps; no invented passive drain.
- [x] Power: industrial plants → stored reserve → powered-building consumption/automatic curtailment → recovery event.
- [x] save migration to `timeline1-v8-civilization-chains`; domain/config/save regression coverage.
- [x] connect Sapience-to-Tribe, Settlement, City, Industry, Modern and Atomic to one save-safe goal graph.
- [x] implement phase-aware job remapping, tangible building gates, Modern bridge and Reactor/Lab requirement.
- [x] implement active-play crisis phases, Last Protocol subtypes, Ash and Archive-reset handoff.
- [x] run 0–180 simulation profiles and establish the first costs/rates/threshold baseline; manual playtest remains.
- [x] extend headless runner through Sapience, jobs/buildings, all eras, crisis and Archive reset; it now reports structured balance stalls.
- [ ] resolve first full-run finding: A03 is unreachable in the competent seed-7 profile because Materials/Knowledge/Power storage caps land below the atomic program costs.

### T1-1 — Organism foundation (2026-09-17)

- [x] run-local Adaptation Points: no passive rate, non-negative atomic spend and save normalization.
- [x] G007 grants the first AP; G008 requires one selected optional body adaptation.
- [x] B02A–D optional adaptations and C07 Multicellularity / G009 transition are in the ruleset.
- [x] add Nervous System, Cognition, behavior choice and Sapience transition package.
- [ ] add 18–40 and 38–120 headless profiles, then tune the route as one balance pass.
- [x] manual playtest finding (2026-09-17), fixed: `EV-BIO-02` now fires on `C06`
  completion as its own branch-style modal (same presentation as `EV-BIO-01`/C02),
  `G008` points its cta/highlight at the event, and `B02A`–`D` got a
  `body_adaptation_1` branch group so the tech tree can't silently resolve the
  choice outside the modal; `allowAdditionalBranches: true` keeps the pick
  non-exclusive once resolved. Full 0–180 simulation timings unchanged
  (optimized 177.3m / competent 179.8m / slow 179.4m).
- [x] manual playtest finding (2026-09-17), fixed: cost-monotonicity audit across
  the whole node chain found `B02A`–`D` (45–85 biomass/25–40 atp) costing far
  less than their gate `C06` (170/100/160), and `N02A`–`C` (90/45) costing far
  less than their gate `B05` (460/270/380) — old numbers never rescaled when
  the trunk got more expensive in later balance passes. Repriced both groups
  to sit at or above their gate (`B02A`-D now 175–225 biomass/105–135
  atp/175 dna on `B02D`; `N02A`-C now 480 biomass/285 atp, uniform like the
  `C02A`-C branch). Ruleset bumped to `timeline1-v11-branch-cost-fix` with a
  migration entry. This pushes every later checkpoint out ~3–4m; updated
  headless baseline: optimized 181.7m / competent 183.4m / slow 183.9m, and
  `tests/simulation/spec.js` windows moved to match (see
  `balance.full_t1_simulation` in PROJECT_STATE.yaml for exact anchors).
- [x] manual playtest finding (2026-09-17), GDD gap fixed: Cognition starts
  accumulating at B04 (contributes 20/100 alone), but no goal/UI surfaced it
  before G013 became current at B05 — first sighting showed an already
  half-full counter with no buildup, which read as broken. `docs/gdd/07_...`
  only said "contributors begin appearing" (G011) / "unlock Cognition 0–100"
  (G012) without a concrete player-visible tracker. Also: Cognition is not
  optional side content, it's a *progressive* goal (derived multi-source
  counter spanning several chapter goals) and must read as global, on par
  with the current chapter goal, not folded into the collapsed side-goals
  list — added a new `slot: 'progressive'` goal kind
  (`isParallelGoal`/`selectProgressiveGoals`, its own panel in `app.js`)
  distinct from `side`. `G011_COGNITION_TRACK` uses it, revealed on `B04`,
  introduced by new event `EV-BIO-04` (so the counter's appearance is never a
  surprise), archives at Cognition 100. Goal taxonomy (standard / progressive
  / super-global) documented in `docs/gdd/07_GOALS_AND_MILESTONES.md` §2.
- [ ] World Tension / Crisis Stability (Atomic era, C1–C4) is the next
  progressive goal in the route and has the same gap Cognition had — zero
  player-visible representation anywhere, not even the diorama — plus it
  already feeds 0–3 bonus Archive Fragments into the meta-run via
  `minStability`. Needs an introducing event at crisis start and a
  progressive-goal slot; deferred until the Archive/meta-progression
  (super-global goal) design pass.

---

# DS-05 — Timeline #1 full narrative package

**Status:** ACCEPTED on 2026-09-16.

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
- [x] user review DS-05
- [x] mark DS-05 accepted

---

# DS-05.5 — Timeline Presentation Contract

**Status:** ACCEPTED on 2026-09-16.

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
- [x] user review DS-05.5
- [x] mark DS-05.5 accepted

---

# DS-06 — UX architecture and wireframes

**Status:** ACCEPTED on 2026-09-16.

Must inherit `PB00–PB30` and may refine layout without changing their narrative/gameplay meaning.

- [x] `00_UX_PRINCIPLES.md`
- [x] `01_SCREEN_MAP.md`
- [x] `02_MOBILE_WIREFRAMES.md`
- [x] `03_DESKTOP_WIREFRAMES.md`
- [x] `04_COMPONENT_STATES.md`
- [x] `05_TUTORIAL_AND_HINTS.md`
- [x] mobile-first shell
- [x] contextual resource presentation
- [x] Goal card
- [x] Evolution/AP UI
- [x] Cognition meter
- [x] small-group Sapience → Tribe transition
- [x] jobs/buildings phase architecture
- [x] Industry Power reveal
- [x] Modern bridge
- [x] World Tension
- [x] Archive/reset UI
- [x] user review DS-06
- [x] mark DS-06 accepted

---

# DS-07 — Арт-направление

**Статус:** ACCEPTED on 2026-09-16.

Должен наследовать `V0–V9` и `C0–C7`.

План:

- [x] `00_ART_DIRECTION.md`
- [x] `01_LOCATIONS_AND_DIORAMAS.md`
- [x] `02_ERA_TRANSITIONS.md`
- [x] `03_CREATURE_EVOLUTION.md`
- [x] визуальная грамматика веток/адаптаций
- [x] правила камеры и композиции
- [x] слои деградации кризиса
- [x] композиция Ash
- [x] user review DS-07
- [x] mark DS-07 accepted

---

# DS-08 — манифест ассетов и промпты генерации

**Статус:** GLOBAL LAYOUT APPROVAL.

План:

- [x] `docs/art/04_BUILDINGS_AND_PROPS.md`
- [x] `docs/art/05_ASSET_MANIFEST.md`
- [x] `docs/art/06_GENERATION_PROMPTS.md`
- [x] `docs/art/07_CONCEPT_SCREEN_AND_ASSET_PIPELINE.md`
- [x] stable asset ID rules
- [x] consumer + PB/V/C references
- [x] building/prop ergonomics for C7 species
- [x] primary trait production variants
- [x] Energy Crisis variant matrix
- [x] Ash-from-V8 production rule
- [x] epoch/block checklists before generation
- [x] one-time desktop/mobile layout approval
- [x] 4 diorama direction variants per block
- [x] animation reference handoff template
- [x] prepare 3-4 persistent desktop layout shell concepts
- [x] prepare 3-4 persistent mobile layout shell concepts
- [ ] prepare global UI component sheet
- [ ] user chooses global layout shell
- [ ] start `B00_ORIGIN_CELL` with 4 diorama direction variants
- [ ] user review DS-08
- [ ] mark DS-08 accepted

---

# Следующие дизайн-сессии

- [ ] DS-08 — манифест ассетов и промпты генерации — GLOBAL LAYOUT APPROVAL
- [ ] DS-09 — аудиодизайн и пакет генерации
- [ ] DS-10 — аналитика, платформы и готовность к продакшену
- [ ] DS-11 — финальная междокументная сверка / design freeze v2

Dependencies:

```text
DS-05 + DS-05.5 accepted
→ DS-06 accepted
→ DS-07
→ DS-08

DS-05 accepted + DS-07
→ DS-09

stable gameplay + UX
→ DS-10

all tracks + balance/regression
→ DS-11
```

---

# Timeline #1 — полная пересборка 0–180 минут

**(2026-09-17) SUPERSEDED DIRECTION — see `docs/DECISIONS_ACT_STRUCTURE.md`
before continuing any work below.** The single 105–180-minute Timeline #1 is
being replaced by a three-act structure: `T1–T5` become five short, causally
linked chapters totaling ~3–4h (not five separate long Timelines), `P1–P3`
become short pre-built lopsided-civilization runs, and the original Evolve's
full mechanic set (races, multi-currency prestige, universes) opens after
that as Act 3. The items below (`T1-0`…`T1-7`, their gates, and the
`docs/gdd/12_LONG_TERM_PROGRESSION_AND_RESET_ROADMAP.md` / `docs/production/
TIMELINE_01_REBUILD_PLAN.md` authority they cite) reflect the pre-redesign
plan and are kept as history + reusable implementation baseline (see
`ACT-005` in the new decision doc for how `T1-0…T1-6` map onto the new
chapters) — they are not the current execution order. Next session: turn
`docs/DECISIONS_ACT_STRUCTURE.md` §ACT-006 open questions into a concrete
`T1` chapter implementation plan before writing gameplay code.

**Status (pre-redesign, kept for history):** MANUAL PLAYTEST 0–180. Full code
route and headless baseline are ready; release closeout awaits fresh-state
manual verification.
2026-09-16. Authority: `docs/gdd/12_LONG_TERM_PROGRESSION_AND_RESET_ROADMAP.md`
and `docs/production/TIMELINE_01_REBUILD_PLAN.md`.

- [x] `T1-0` — Foundation + Event Engine: config-driven early deck, seeded
  RNG/deck state, atomic `RESOLVE_EVENT`, save v2 migration, RNA/DNA/Cell
  event set, Chronicle/unlock extension points, deterministic and event-aware
  simulations are implemented. RNA/DNA/Cell caps now require repeatable
  storage purchases; only storage buildings expand capacity. Remaining:
  formal `0–18` config/goal audit and manual playtest.
- [x] `T1-1` — Organism 18–28: AP, Multicellularity and adaptations are implemented.
- [x] `T1-2` — Cognition 28–40: Nervous System, Cognition `0..100` and Sapience are implemented.
- [x] `T1-3` — First civilization 38–84: Population start, Tribe, Settlement,
  jobs, Food loop and recovery behaviour are implemented.
- [ ] (2026-09-17) Docs desync: `docs/production/TIMELINE_01_REBUILD_PLAN.md:72`
  still lists `T1-3` deliverable as "Food/Morale/Knowledge loop", but Morale
  was never implemented, has no row in the mechanics-fate table
  (`docs/gdd/12_LONG_TERM_PROGRESSION_AND_RESET_ROADMAP.md` §6) and isn't
  mentioned in any other GDD. Either drop "Morale" from the plan line as
  stale, or make an explicit balance decision to add it and give it a row/era
  in the roadmap table.
- [x] `T1-4` — City and Industry 84–128: city infrastructure, Power and contextual resources are implemented.
- [x] `T1-5` — Modern and Atomic programme 128–168: Modern bridge, World Tension,
  Error 17, `Again` and late event deck are implemented.
- [x] `T1-6` — Great Filter/reset 168–180: Last Protocol, inevitable first
  Ash, AF, Archive, idempotent reset and T2 teaser.
- [-] `T1-7` — Full-run closeout: manual fresh-state mobile and desktop
  playtests for 0–180, then p25/p50/p75 rebalance, save/recovery, telemetry and release gate.

Guardrails:

- [ ] no `T2` runtime before `T1-7` passes manual 0–180 playtest, full-run regression and
  playtest;
- [ ] keep accepted `0–10` numbers unless an explicit balance decision records
  a change;
- [ ] do not create late-game placeholder screens instead of a real epoch GDD.
- [ ] manual playtest rule (2026-09-17): every key branch point must be presented as
  its own explicit event/modal with a dedicated goal — never only inside a general
  discoveries/unlock list.

---

# Immediate order

```text
T1-0 Event Engine + 0–18 audit
→ T1-1 Organism
→ T1-2 Cognition
→ T1-3 First civilization
→ T1-4 City and Industry
→ T1-5 Modern and Atomic
→ T1-6 Great Filter/reset
→ T1-7 full-run closeout
→ T2 Memory design and implementation
```
