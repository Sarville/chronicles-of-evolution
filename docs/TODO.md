# Хроники Эволюции — TODO

**Last update:** 2026-09-18

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
- [x] resolve first full-run finding: A03 is unreachable in the competent seed-7 profile because Materials/Knowledge/Power storage caps land below the atomic program costs. Stale as of 2026-09-18: verified against the current baseline (`after_A03`/`after_A04` snapshots both present, `A04` completes at 176.8m competent) — superseded by the T1-4/T1-5 storage-gate work committed after this finding was logged.

### T1-1 — Organism foundation (2026-09-17)

- [x] run-local Adaptation Points: no passive rate, non-negative atomic spend and save normalization.
- [x] G007 grants the first AP; G008 requires one selected optional body adaptation.
- [x] B02A–D optional adaptations and C07 Multicellularity / G009 transition are in the ruleset.
- [x] add Nervous System, Cognition, behavior choice and Sapience transition package.
- [x] add 18–40 and 38–120 headless windows, then tune the route as one balance pass.
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
- [x] manual playtest finding (2026-09-18), fixed: adding `multicellularityAtMs`
  (`C07`) and `tribeAtMs` (`T05`) windows to the full-timeline headless test
  (the 18–40m/38–120m ranges the audit above hadn't covered) found `C07`
  resolving at ~19–21m across all profiles against the canonical 24–28m window
  (`docs/gdd/02_ECONOMY_FIRST_120_MINUTES.md` §7) — post-`C06` production was
  already strong enough that `C07`'s 250 biomass/140 atp/210 dna and one
  `B02A`-D pick barely added a minute. Repriced `C07` to 930 biomass/520
  atp/720 dna, landing all three profiles at 24.1–27.6m. Ruleset bumped to
  `timeline1-v12-multicellularity-cost-fix` with a migration entry. This
  pushes every later checkpoint out ~6–7m; updated headless baseline:
  optimized 186.8m / competent 188.8m / slow 188.9m, and
  `tests/simulation/spec.js` windows moved to match (see
  `balance.full_t1_simulation` in PROJECT_STATE.yaml for exact anchors).
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
chapters) — they are not the current execution order.

**(2026-09-18) Act 3 detailed GDD done:** `docs/gdd/15_ACT_THREE_SYSTEMS.md`
resolves `ACT-006`/`ACT-012`'s "detailed Act 3 GDD" item — system-by-system
map (`races`/`prestige`/`universes`/`arpa`) and the finite 39-item Act 3
content-collection achievement list for `14_GLOBAL_ARCHIVE_AND_
ACHIEVEMENTS.md` §4.5. See `DECISIONS_ACT_STRUCTURE.md` `ACT-013`. Docs-only.

**Next session:** one item left before code, plus one unrelated cleanup:

1. Turn `docs/DECISIONS_ACT_STRUCTURE.md` §ACT-006/§ACT-012 "still open"
   items (per-chapter minute budget, `P1–P3` naming, `T2`/`T4` swap
   mechanics) into a concrete `T1`-chapter implementation plan, then start
   coding `Мор`/`Катаклизм`/`Раскол`/`Авария` + `t5_synthesis`
   (`docs/production/TIMELINE_01_REBUILD_PLAN.md` Package B/C/D) — this is
   the shortest path to a playable Act 1. All GDD/scenario writing needed
   before this is now complete (Act 1, Act 2, Act 3 all have canonical docs).

Separately, unrelated to this doc track: this working tree also has
uncommitted gameplay-code changes (`src/chronicles/config/*`,
`src/chronicles/domain/*`, `tests/*`, `evolve/chronicles.js`) predating this
session's docs work — see the manual-playtest status note below. Review and
commit/discard that separately; it was intentionally left untouched by the
2026-09-17/18 docs commits.

**(2026-09-17) GDD/scenario rework for the five-chapter structure is done.**
New: `docs/gdd/13_ACT_ONE_CHAPTERS.md` (canonical `T1–T5` chapter map: era
cutoffs, starting conditions, new collapse endings `ENDING_BLIGHT/
CATACLYSM/FRACTURE/OVERLOAD`, the `t5_synthesis` procedural echo deck).
Updated: `docs/gdd/07/08/09/12` (goals/events/endings/roadmap), light
reframing notes on `01/02/04`; `docs/scenario/00/01/04/05/06/07` rewritten
for the five chapters, including full copy for all four new collapse
endings and the `T5` echo-of-`T1–T4` event deck (the "season `T5`'s random
events with the story" request); `docs/production/TIMELINE_01_REBUILD_PLAN.md`
also reworked into a five-chapter package table. Still open, not done this
pass: the exact per-chapter numeric balance (`ACT-006`).

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

# Act-structure documentation rework (2026-09-17)

**Status:** DONE — docs rewritten to match `docs/DECISIONS_ACT_STRUCTURE.md`.

- [x] `docs/gdd/12_LONG_TERM_PROGRESSION_AND_RESET_ROADMAP.md` §3–6 rewritten
  around `T1–T5` as five short chapters of Act 1, `P1–P3` as Act 2.
- [x] `docs/production/TIMELINE_01_REBUILD_PLAN.md` reworked to a five-chapter
  build plan; work packages now map to `T1–T5` collapse content instead of
  one 0–180 min run.
- [x] `docs/gdd/07_GOALS_AND_MILESTONES.md` restructured per chapter; new
  goal IDs `G025–G039` proposed for `Мор`/`Катаклизм`/`Раскол`/`Авария`
  starting conditions and collapses. Numeric targets provisional.
- [x] `docs/gdd/01_FIRST_120_MINUTES.md` restructured into per-chapter
  economy/pacing sections.
- [x] `docs/scenario/01_TIMELINE_01_SCRIPT.md` rewritten as a five-chapter
  script; `T1` content unchanged, `T2–T4` are new collapse narratives,
  `T5` reframed as "Синтез" reusing existing Modern→Atomic→Ash content.
- [x] `docs/scenario/04_STORY_EVENTS.md` — new event contracts for
  `T1–T4` collapses (`EV-NAR-04..08`, `EV-CR-T1..T4`, `EV-CIV-08`) plus
  the requested `T5`-only procedural event deck (`t5_synthesis`, §T5-DECK)
  that echoes each prior chapter's specific collapse.
- [x] `docs/scenario/05_NARRATIVE_FLAGS.md` — new `run.chapterN.*`/
  `meta.act1.*`/`meta.endings.chapterN_subtype` namespaces; reset
  behavior generalized to four intra-Act-1 chapter resets + one Act reset.
- [x] `docs/scenario/06_ENDINGS_COPY.md` — four new endings
  (`ENDING_BLIGHT`/`ENDING_CATACLYSM`/`ENDING_FRACTURE`/`ENDING_OVERLOAD`)
  with full subtype copy, alongside `ENDING_ASH` (unchanged, now `T5`-only).
- [x] `docs/scenario/00_NARRATIVE_BIBLE.md` — reconciled product Acts 1–3
  with narrative Acts I–X (§0); redistributed reveals across `T1`/`T3`/`T4`/`T5`.
- [x] `docs/scenario/07_COPY_GUIDE.md` — Archive voice-by-era re-keyed to
  chapters; new terminology for chapters/collapse endings/species skin.

**Not done, deliberately out of scope for this pass** (docs-only rework,
no code changes):

- [ ] implement `Мор`/`Катаклизм`/`Раскол`/`Авария` in `config/goals.js`,
  `config/events.js`, `config/eras.js` (new `G025–G039`, new events, new
  `endings` entries) — see `docs/production/TIMELINE_01_REBUILD_PLAN.md`
  Package B/C.
- [ ] implement `t5_synthesis` deck in `config/events.js` — Package D;
  requires `meta.endings.chapterN_subtype` to exist first (depends on the
  item above).
- [ ] species skin swap presentation (art/UI), not just the flag.
- [ ] balance pass for `T2–T4` numeric targets (currently provisional).

---

# T1 retrofit: Мор collapse (2026-09-18)

**Status:** DONE — first package of `docs/production/TIMELINE_01_REBUILD_PLAN.md`
§7 execution order (`Мор` for `T1`, before `T2–T4`/`T5` reframe).

- [x] `G025`/`G026` added to `config/goals.js`: `G025` "Заметьте первых
  больных" (narrative gate, no reward, active once `T05` Tribe completes),
  `G026` "Переживите Мор" (completes on `run.ending.id = ENDING_BLIGHT`,
  same pattern as `G024`/Ash). `G015.sequence.nextGoalId` repointed from
  `G016` to `G025` — the old Settlement+ continuation (`G016–G024`) is no
  longer the auto-advance target after Tribe; that content is preserved
  unchanged in config for reuse by `T2–T5`, not deleted.
- [x] `EV-NAR-04`/`EV-CR-T1` added to `config/events.js` per
  `docs/scenario/04_STORY_EVENTS.md` §`T1` — anomaly gate then mandatory
  3-choice ending event, reusing the existing generic event/goal contract
  (no bespoke crisis engine, per `docs/gdd/13_ACT_ONE_CHAPTERS.md` §2).
- [x] `ENDING_BLIGHT` added to `config/endings.js`.
- [x] generalized the previously Ash-only ending machinery so any ending can
  complete/reset: `completeAshEnding` → `completeEnding(state, endingId,
  subtype)` in `domain/services/crisis.js`; `complete_ending` effects now
  carry an explicit `endingId` (validated against `ruleset.endings`);
  `archiveReset` in `domain/commands.js` now looks up a per-ending
  `ENDING_RESET_PROFILES` entry (reward + Chronicle summary) instead of
  hardcoding `ENDING_ASH`. `ENDING_ASH`'s own reward formula/range (14–18 AF)
  is untouched — `tests/domain/spec.js`'s full Ash route (unaffected, it
  starts mid-route at `CITY` era and never touches `G015`) still passes
  unchanged. `ENDING_BLIGHT` gets a flat 3 AF ("малый AF-пакет" per
  `docs/gdd/12_LONG_TERM_PROGRESSION_AND_RESET_ROADMAP.md` — provisional,
  no exact number was specified there).
- [x] consequence accepted, not worked around: since `G015`'s auto-advance
  now points at the collapse instead of `G016`, and `Мор` sets
  `run.lifecycle = 'ended'` (freezing further `BUY_NODE`/etc., the same
  generic freeze `ENDING_ASH` already used), the full single-continuous-run
  headless simulation (`runFullTimelineSimulation`) now genuinely stops at
  Tribe with `ENDING_BLIGHT` instead of continuing to Settlement/City/
  Industry/Modern/Atomic/`ENDING_ASH`. This is the intended Act 1 redesign
  behavior, not a regression — that later content isn't discarded, it's
  reused by later chapters. Updated `tests/simulation/spec.js`'s
  full-timeline assertions accordingly (drops Settlement→Ash windows, keeps
  Multicellularity/Sapience/Tribe).
- [x] Ruleset bumped to `timeline1-v13-t1-blight-collapse` with a migration
  entry. `npm test`, `npm run test:sim`, `npm run smoke`, `npm run build` all
  pass.

### Model correction (2026-09-18, discussed with user before going further)

`ACT-002`'s "each chapter gets a targeted starting condition, doesn't repeat
the biological stage" is **not** what the user actually wants and needs
revisiting in `DECISIONS_ACT_STRUCTURE.md` before `T2` is built. Corrected
model:

- Every attempt (`T1`-`T5`) replays from RNA again, no per-chapter "start
  grant"/skip-ahead state factory.
- Each attempt's total budget grows (`T1` ~20min, `T2` ~25, `T3` ~30, `T4`
  ~35, `T5` ~40) — the already-seen portion is compressed by AF-bought
  perks ("Archive Recall", documented in `docs/gdd/10_META_PROGRESSION.md`
  §4 — cost ×0.75 / production ×1.25 on "familiar" progression — **not
  implemented in code at all yet**), freeing time for genuinely new content
  before the next, later collapse point.
- Visual/species differentiation per attempt happens at an existing
  branch-choice moment (e.g. `T2`'s reskin is presented as the Archive
  fixing the `C02A`/B/C primary-trait pick), not via a new starting screen.
- Not started: retuning `T1` to actually hit ~20min (currently ~63min to
  Tribe — a real gap, see the C07 fix note above for how big these passes
  get), and designing/implementing the Archive Recall perk system with real
  numbers. Both block `T2`.

- [x] Мор timer/decay mechanic (2026-09-18, replaces the instant-ending
  version above): `EV-NAR-04`'s resolution now starts a hidden ~2min
  countdown (`domain/services/crisis.js` `CHAPTER_TIMERS.chapter1_blight`,
  `advanceChapterTimers` wired into `engine.js` `tick()`) instead of just
  setting a flag. Population decays gently (×0.995/s) for the first ~105s,
  then collapses to exactly 0 over the final 15s (proportional
  remaining-time falloff, not asymptotic — never lingers visible above
  zero). `EV-CR-T1` (the mandatory choice) now fires only when the timer
  fully expires — not early, even if population already hit 0 — so the
  player keeps agency (can still build Shelter etc.) during the window even
  though nothing actually stops the collapse, only its subtype/epitaph.
  Added a new `start_chapter_timer` event effect (validated in
  `validation.js`) for `T2`-`T4` to reuse with their own timer/decay target
  once designed. Ruleset bumped to `timeline1-v14-blight-timer`. Full test
  suite + sim + smoke + build pass; manually verified the decay curve and
  the timer-gated (not population-gated) trigger via direct engine ticks.
- [x] `T1` pacing retune (2026-09-18): Tribe was landing at ~62-65m against
  the ~20min chapter target (`docs/gdd/13_ACT_ONE_CHAPTERS.md` §3). Applied
  a uniform ×3.5 rate rebalance instead of a node-by-node redesign, on the
  theory that the relative proportions between phases were already
  carefully validated by every prior balance pass (C07 fix, B02x/N02x fix,
  etc.) and only the absolute timescale needed changing: `config/
  producers.js` (RNA/DNA/Biomass/ATP output/input), `config/jobs.js`
  (Tribe-era `food`/`materials`/`knowledge` job output only — other eras
  untouched, not yet part of any timed chapter), `domain/services/
  population.js` `GROWTH_PER_SECOND` (0.02→0.07). Costs, growth-per-unit
  curves, milestone thresholds and population targets are all untouched —
  everything just gets *reached* faster. Measured (optimized/competent/
  slow): Multicellularity 7.15/8.33/8.00m, Sapience 13.30/14.00/14.17m,
  Tribe 17.10/17.83/18.08m; full `T1` including the ~2min Мор timer lands
  at 19.87m for competent — right at the ~20min target on the first
  measured factor, no further iteration needed. Every dependent test
  assertion across `tests/config/spec.js`, `tests/domain/spec.js`,
  `tests/ui/spec.js` and `tests/simulation/spec.js` (rate snapshots,
  producer-purchase payback, the 0-18min biological windows, the
  full-timeline Multicellularity/Sapience/Tribe windows) was recomputed
  from actual runtime values, not estimated. `npm test`, `npm run
  test:sim`, `npm run smoke`, `npm run build` all pass. This is now the
  baseline later chapters/passes build on, per the user's request.
- [ ] not done (later packages per `TIMELINE_01_REBUILD_PLAN.md` §7, and now
  blocked on the model correction above, plus the 2026-09-18 recap-goal
  follow-up — see `docs/gdd/07_GOALS_AND_MILESTONES.md` §5–8 and memory
  `act1_recap_goal_granularity`): Archive Recall perk system (design done,
  see next section — still no code, blocks all of the below), `T2` own
  coarser recap goal chain (RNA→Tribe) + skin swap #1 at `C02A/B/C` +
  `Катаклизм`, `T3` own even-coarser recap (RNA→Settlement) + policy-lite +
  `Раскол`, `T4` own recap (RNA→City) + skin swap #2 at `C02A/B/C` +
  `Авария`, `T5` own recap (RNA→Industry/Modern) + reframe + `t5_synthesis`
  deck, Act 1 closeout regression. Also still open: manual playtest of the
  whole `T1` route (biology through the Мор timer) at the new pacing.

---

# Archive Recall perk system + AF removal from Act 1-2 (2026-09-18)

**Status:** design accepted with the user, discussed and refined over
several turns (perk mechanics, Cognition/Writing worked example, why a
flat node-skip was rejected for Writing) — see
`docs/gdd/10_META_PROGRESSION.md` §1-5 for the full written spec, plus the
sync pass across `docs/gdd/{09_ENDINGS_AND_RESET,12_LONG_TERM_
PROGRESSION_AND_RESET_ROADMAP,13_ACT_ONE_CHAPTERS,14_GLOBAL_ARCHIVE_AND_
ACHIEVEMENTS,15_ACT_THREE_SYSTEMS}.md`, `docs/DECISIONS_ACT_STRUCTURE.md`
`ACT-002` "Currency", `docs/scenario/05_NARRATIVE_FLAGS.md`,
`docs/production/TIMELINE_01_REBUILD_PLAN.md`,
`docs/ux/00_TIMELINE_PRESENTATION_MAP.md`, `docs/gdd/{01_FIRST_120_MINUTES,
02_ECONOMY_FIRST_120_MINUTES}.md`, `docs/GLOSSARY.md`.

**2026-09-18, later:** `T1`'s own perk triad is implemented end to end
(backend + a minimal ending-screen UI) — see the checklist below for what's
done vs. still open. `T2-T5` still don't exist as their own chapters, so
their perk tables, the defense-perk grant, and `T5`'s stacking/scaling
mechanic remain unimplemented.

**2026-09-18, later still:** `T2` "Одиночки" is now fully implemented as
its own chapter — recap chain, new live content, Катаклизм collapse,
defense perk, and style-perk triad. See the checklist below.

Design summary (see `10_META_PROGRESSION.md` §4 for the authoritative
version, this is just the code-facing shape):

- Each `T1-T4` ending grants a cosmetic defense perk (auto, no numeric
  effect) + a choice of 1 of 3 not-yet-unlocked style perks for that
  chapter (auto/investment/efficiency axes, §4.2 has the full table and
  numbers). `T5`'s ending grants a choice of 1 of 3 permanent endgame perks
  instead (§4.4), no defense perk.
- All unlocked perks are **permanent and stack** — need a per-chapter,
  per-slot unlock-flag store in meta save state (something like
  `meta.archiveRecall.<chapterId>.<slot>.unlocked`), not a single numeric
  multiplier field.
- Perks apply wherever their target range/milestone recurs across Act 1
  *and* Act 2, not just their own chapter — the effect-application layer
  needs to key off content (range/milestone), not off "current chapter."
- `T5`'s 3 endgame perks stack independently of the `T1-T4` pattern, and
  once all 3 are unlocked, further `T5` completions increase their
  numeric magnitude instead of granting anything new (soft cap per
  `10_META_PROGRESSION.md` §7 — exact curve not designed yet).
- Archive-mode (§4.6): a parallel replay entry point for Act 1, freely
  switchable with the main Act 3+ run, granting zero currency (there is
  none) — only perk progress, applied live to whatever run is currently
  active.
- **AF removed entirely from Act 1-2.** `ENDING_BLIGHT` currently grants a
  flat 3 AF (`domain/commands.js` `ENDING_RESET_PROFILES`, added in the
  "T1 retrofit: Мор collapse" work above) — this reward must be replaced
  with the perk-choice grant instead of AF. `ENDING_ASH`'s existing 14-18
  AF formula must also be replaced the same way once `T5` exists as its
  own chapter (currently `ENDING_ASH` is still reached via the old
  single-run route in `tests/domain/spec.js`, unaffected by `T1`'s Мор
  retrofit — that full-Ash route needs the same AF-removal treatment when
  it's reframed as `T5`, not before).

Concrete code TODO:

- [x] Design the actual save-state schema for per-chapter perk-slot
  unlocks. Landed simpler than the `<chapterId>.<slot>.unlocked` sketch
  above: `meta.archiveRecall.chapters[chapterKey] = { styleChoice, perkId }`
  (`domain/state.js`, `save/resetTransaction.js`
  `applyPreparedResetTransaction`) — one style-perk slot per chapter is all
  `T1-T4` ever need (defense perks are cosmetic, no state), and `T5`'s
  3-perk stacking will need its own shape when that chapter exists (not
  this one). `docs/technical/03_GAME_STATE.md` / `04_SAVE_ARCHITECTURE.md`
  still describe the old AF-only shape and still need their own pass —
  left alone again this round.
- [x] Remove/replace the AF grant in `ENDING_RESET_PROFILES`
  (`domain/commands.js`) for `ENDING_BLIGHT` — now
  `archiveRecallChapterKey: 'T1'`, resolved through the new
  `domain/services/archiveRecall.js` (`grantArchiveRecallPerkChoice`,
  `applyArchiveRecallPerks`). `ARCHIVE_RESET` now takes a
  `perkChoiceId` (`'auto' | 'invest' | 'efficiency'`) and rejects with
  `INVALID_ARCHIVE_RECALL_PERK_CHOICE` if it's missing/unknown.
  `ENDING_ASH` still grants AF unchanged — deferred until it's reframed as
  `T5`, per the note above.
- [x] Decided: `state.js`'s `archiveFragments` field stays (zeroed, the
  generic AF reward/transaction plumbing in `save/resetTransaction.js` is
  reused as-is for `ENDING_ASH` and later Act 3), sitting alongside the
  new `archiveRecall: { chapters: {} }` field.
- [x] Implemented `T1`'s style-perk choice wiring end to end: perk catalog
  in `config/archiveRecall.js` (`ARCHIVE_RECALL_CHAPTERS.T1.stylePerks`
  — `auto`/`invest`/`efficiency`), two new modifier types
  (`manual_cooldown_multiplier` consumed in
  `domain/services/manualProcesses.js` `manualProcessCooldownMs`;
  `node_cost_multiplier` consumed in `domain/selectors.js`
  `selectNodeCost`), effects re-applied to a fresh run's
  `run.modifiers.active` via `applyArchiveRecallPerks` right after
  `applyPreparedResetTransaction` carries `meta` forward. Minimal ending
  screen in `ui/app.js` `renderEnding()` shows the 3 choices for
  `ENDING_BLIGHT` instead of the old single "Сохранить в Архив" button.
  T1 has **no defense perk** (first attempt, nothing to defend against
  yet, per the design) — nothing to build there.
- [x] `T2` "Одиночки" implemented as its own chapter (2026-09-18):
  - New `run.actOneAttempt` field (`domain/state.js`, defaults `'T1'`,
    advanced `T1`→`T2` in `save/resetTransaction.js` off
    `transaction.reward.archiveRecallPerk.chapterKey` via
    `NEXT_ACT_ONE_ATTEMPT`). Every existing Act 1 main-chain goal
    (`G001`-`G026`) tagged `chapterAttempt: 'T1'`; a new
    `chapterAttemptVisible` gate in `domain/services/goals.js` hides any
    goal whose `chapterAttempt` doesn't match the run's `actOneAttempt` —
    without this, T1's dormant goals (e.g. `G015`/`G025`/`G026`) could
    hijack `currentId` mid-`T2`-run purely from array-iteration order, since
    both chapters replay the exact same node/economy data.
  - `T2`'s own goal chain: `G040`-`G042` (recap RNA→Tribe in 3 coarse steps,
    vs `T1`'s 15) + `G027`/`G028` (new live content: Agriculture/Settlement,
    reusing `T08`/`T09`'s conditions) + `G029`/`G030` (rising + Катаклизм
    ending), all `chapterAttempt: 'T2'` (`config/goals.js`). One short
    Archive flavor line (`EV-NAR-T2-RECALL`) at the recap/new-content seam.
  - New events `EV-NAR-T2` (rising anomaly) / `EV-CR-T2` (mandatory 3-choice
    ending: `rebuild`/`relocate`/`fortify`) mirroring `EV-NAR-04`/`EV-CR-T1`
    exactly (`config/events.js`); new `ENDING_CATACLYSM`
    (`config/endings.js`); new `chapter2_cataclysm` chapter timer, same
    120s/15s-cliff/population-decay shape as `chapter1_blight`
    (`domain/services/crisis.js`).
  - `T2`'s defense perk (cosmetic, "Карантинный протокол") + style triad
    (auto: per-population storage cap growth; invest: storage cap
    multiplier; efficiency: Settlement-era building cost ×0.75) in
    `config/archiveRecall.js`. Three new modifier types:
    `resource_capacity_per_population` / `resource_capacity_multiplier`
    (`domain/services/resources.js` `calculateCap`) and
    `building_cost_multiplier` (`domain/selectors.js`
    `selectBuildingPrice` — also refactored `domain/commands.js`
    `buyBuilding` to call `selectBuildingPrice` instead of recomputing cost
    inline, so the modifier can't be bypassed at actual payment time).
    `grantArchiveRecallPerkChoice`/`applyArchiveRecallPerks`
    (`domain/services/archiveRecall.js`) extended to also auto-grant and
    re-apply a chapter's `defensePerk` alongside the chosen style perk.
  - Fixed a latent `evaluateGoals` bug found while testing this: the
    trailing sequence-advance step could call `activateGoal` on a
    `nextGoal` that a *same-pass* completion loop had already archived,
    clobbering its status back to `'active'`. Real risk for any
    Recall-compressed chain where several goals' conditions become true in
    one evaluation pass (exactly what compression is for) — now it walks
    forward past any already-terminal goal instead of reactivating it.
  - Regression test in `tests/domain/spec.js` drives a synthetic `T2` run
    through the full recap→new-content→collapse→perk-choice→reset cycle
    and checks `T1`'s goals stay untouched throughout.
  - Explicitly **not built** (pure polish, zero mechanical effect,
    deferred): skin swap #1 (cosmetic relabel of the existing `C02A/B/C`
    branch choice — no UI hook exists to attach flavor labels to a branch
    pick) and the `MS11`/`MS12` milestone banners (the `MS01-MS15` banner
    system itself barely exists in code — only one `MS_PROTOCELL` stub).
- [x] `T3` "Крепость" implemented as its own chapter (2026-09-18):
  - `T3`'s own goal chain: `G050`/`G051` (recap RNA→Settlement in 2 coarse
    steps — even coarser than `T2`'s 3, despite covering more ground, per
    the doc's "крупнее recap `T2`" instruction) + `G031`/`G032` (new live
    content: Writing, then City — reuses the exact conditions `T1`'s old
    dead `G018`/`G019` used) + `G033`/`G034` (rising + Раскол ending), all
    `chapterAttempt: 'T3'` (`config/goals.js`).
  - Retargeted the existing-but-dead `EV-CIV-04` (governance flavor choice)
    from its old trigger `goalId: 'G019'` (unreachable — `T1` never reaches
    City anymore) to `G032` instead of writing a duplicate — `T3` is the
    first chapter that actually plays City content live, and this is
    exactly the doc's "`G032B` governance входит в условие" note.
  - New events `EV-NAR-T3` (rising) / `EV-CR-T3` (mandatory 3-choice
    ending: `centralize`/`secede`/`mediate`) + `EV-NAR-T3-RECALL` (recap
    seam flavor), new `ENDING_FRACTURE`, new `chapter3_fracture` timer
    (same shape as `T1`/`T2`'s).
  - `T3`'s defense perk (cosmetic, "Сейсмоусиленные опоры") + style triad:
    - **auto** "Самоорганизация" — a genuinely new behavior, not just a
      modifier: `unlock_auto_workforce` (`domain/services/modifiers.js`)
      backs `applyAutoWorkforce` (`domain/services/population.js`, called
      every tick from `domain/engine.js`), which auto-fills idle
      population into the era's jobs and reassigns a job whose output
      resource is already at cap to whichever job currently has the
      fewest workers.
    - **invest** "Ускоренное строительство" — reuses `T2`'s
      `building_cost_multiplier` modifier with `eraId: 'CITY'` (no new
      code needed).
    - **efficiency** "Единство раньше" — the doc describes an early
      Stability/policy threshold, but no Stability system runs before
      Atomic; reinterpreted as extending the chapter timer's gentle-decay
      phase before its cliff (new `chapter_timer_duration_multiplier`
      modifier, `domain/services/crisis.js` `chapterTimerTotalMs`).
  - Regression tests in `tests/domain/spec.js`: the full synthetic
    run (recap→new content→both queued events→collapse→perk
    choice→reset), the auto-workforce idle-fill/cap-reassign behavior, and
    the duration-multiplier's effect on the timer.
  - Explicitly **not built** (pure polish, zero mechanical effect, same
    reasons as `T2`): skin swap (`T3` doesn't get one per the doc anyway —
    only `T2`/`T4` do) and the `MS13`/`MS14` milestone banners.
- [x] `T4` "Большой мозг" implemented as its own chapter (2026-09-18):
  - `T4`'s own goal chain: `G060`/`G061` (recap RNA->City in 2 coarse steps)
    + `G035`-`G037` (new live content: Mechanization, Industry, Modern --
    reuses the exact conditions `T1`'s old dead `G020`-`G022` used) +
    `G038`/`G039` (rising + Авария ending), all `chapterAttempt: 'T4'`.
  - **Did not** retarget the dead-since-redesign `EV-CIV-06` (energy path,
    trigger `goalId: 'G021'`) to `T4`'s own goal the way `EV-CIV-04` was
    retargeted for `T3` -- caught in testing that `G021` is still exercised
    by the pre-existing `tests/domain/spec.js` `fullRouteEngine` test (the
    old single-run-to-Ash route, which stands in for the future `T5`, not
    dead). `T4` got its own fresh `EV-CIV-07` (automation-risk, the doc's
    "`G037` automation-risk входит в условие" note) instead of reusing it.
  - New `EV-NAR-T4`/`EV-CR-T4` events (mandatory 3-choice ending:
    `shutdown`/`patch`/`delegate`) + `EV-NAR-T4-RECALL` seam flavor, new
    `ENDING_OVERLOAD`, new `chapter4_overload` timer (same shape as
    `T1`-`T3`'s).
  - `T4`'s defense perk (cosmetic, "Единый протокол согласия") + style
    triad:
    - **auto** "Фоновые процессы" -- new `building_output_floor` modifier
      (`domain/services/production.js`): a building starved of its input
      (power) still outputs a guaranteed floor, without actually paying
      for that floor's input.
    - **invest** "Форсированное производство" -- new
      `building_output_multiplier` modifier, same file.
    - **efficiency** "Быстрое обучение" -- finally implements the
      `10_META_PROGRESSION.md` sec.4.3 worked example: new `grant_cognition`
      effect (`domain/services/modifiers.js`, mirrors the existing
      event-effect of the same name) auto-credits Cognition's `B04`+`N05`
      (45/100 via `run.cognition.eventBonus`); Writing reuses `T1`'s
      existing `node_cost_multiplier` on both `T09` and `T10` (x0.55) --
      no new code needed there.
  - **Found and fixed a real bug** while testing the `invest`/`auto`
    perks: `building_cost_multiplier` (`T2`/`T3`) and the two new
    building modifiers were gated on the *building's* own (often
    multi-era) `eraIds` list rather than the run's current era, so a
    building spanning two perk-tagged eras (`BLD_FACTORY`: `CITY..ATOMIC`)
    silently double-multiplied. Regated all three on `state.run.eraId`
    instead (`domain/selectors.js` `selectBuildingPrice`,
    `domain/services/production.js`).
  - Regression tests in `tests/domain/spec.js`: the full synthetic run,
    plus targeted checks for the output floor and output multiplier.
  - Explicitly **not built** (pure polish, zero mechanical effect, same
    reasons as `T2`): skin swap #2 and the `MS15` milestone banner.
- [x] `T5` "Синтез" implemented as its own chapter (2026-09-18) — last of
  Act 1, `T1`-`T5` all now exist in code:
  - `T5`'s own goal chain: `G070`/`G071` (recap RNA→Modern, 2 coarse steps —
    same step count as `T4`'s recap but reaching further, per "крупнее"
    scaling by endpoint, not step count) + `G023`/`G024` (Atomic entry/Ash,
    retagged `chapterAttempt` from the now-dead `'T1'` to `'T5'` — the only
    genuinely-reusable-as-is content per the doc). `EV-NAR-02` "ERROR 17"
    retargeted from dead `G022` to `G071`, same dead-event-retarget pattern
    as `T3`'s `EV-CIV-04`.
  - New `EV-NAR-08` "Синтез" narrative seam at the recap/new-content
    boundary, doubling as the intro to the `t5_synthesis` echo deck (docs
    sec.7.2) — 4 minor/major card pairs (`EV-T5-ECHO-{BLIGHT,CATACLYSM,
    FRACTURE,OVERLOAD}-{MINOR,MAJOR}`), reusing the existing generic
    weighted-deck engine (`early_biology`'s mechanism, new cards only).
    Gated on `meta.endings.chapterN_subtype` (via a new `meta_flag_set`
    precondition type — existence check, not exact-value, since each
    chapter has several possible subtypes) and, for majors, on their paired
    minor already resolved this run (new `event_resolved` precondition
    type). Both added to `domain/services/events.js` `conditionsMet`.
  - `T5`'s ending (`ENDING_ASH`, now fully `T5`-owned) grants a choice among
    3 permanent, simultaneously-stacking endgame perks instead of `T1-T4`'s
    one-slot-per-chapter pattern — new `ARCHIVE_RECALL_ENDGAME`
    (`config/archiveRecall.js`) + `meta.archiveRecall.endgame` (per-perk
    integer levels) + `grantArchiveRecallEndgamePerk`/
    `applyArchiveRecallEndgamePerks` (`domain/services/archiveRecall.js`).
    Производство = `global_production_multiplier`; Познание =
    `resource_production_multiplier` on `knowledge` (not `grant_cognition`
    — by endgame the Cognition gate is long passed, a permanent Knowledge-
    rate bonus is what actually keeps compounding); Экспансия/Стабильность =
    `resource_capacity_multiplier` ×3 + one new modifier type,
    `crisis_stability_decay_multiplier` (consulted in `crisis.js`
    `advanceCrisis`). Once all 3 are unlocked, `ARCHIVE_RESET` needs no
    `perkChoiceId` and instead scales every level by +1 (capped at 5,
    `ponytail:`-marked — the real curve is the item below).
  - `ENDING_ASH`'s old flat 14-18 AF reward removed entirely
    (`ENDING_RESET_PROFILES.ENDING_ASH` now `{ endgamePerk: true }`); AF is
    now fully gone from Act 1-2 across all five endings.
    `NEXT_ACT_ONE_ATTEMPT` gained `T4: 'T5'`; `T5`'s own reset loops back to
    `'T5'` (Act 2/3 don't exist yet, so repeat-`T5` scaling is what
    currently stands in for further progression).
  - Found that when two events share a trigger (here `EV-NAR-08`/
    `EV-NAR-02` both on `goal_completed G071`, same shape as `T4`'s
    `EV-CIV-07`/`EV-NAR-T4` on `G037`), which one wins `pendingId` is
    decided by **array order in `config/events.js`**, not by `priority` —
    had to reorder `EV-NAR-08` before `EV-NAR-02` in the file for the
    intended narrative sequencing despite already having the higher
    `priority` value.
  - Regression test in `tests/domain/spec.js` replaces the old
    default-`T1`-attempt "fullRouteEngine" placeholder with a real
    `actOneAttempt: 'T5'` version: recap-goal archival, the `EV-NAR-08`/
    `EV-NAR-02` ordering, one deterministic echo minor→major draw, the
    unchanged crisis/Last-Protocol/Ash sequence, missing-choice rejection,
    first-perk unlock, and the all-3-unlocked scale-up path.
- [ ] Implement Archive-mode as an entry point (available after first Act
  1 completion) — no currency grant, only perk progress, live-applies to
  the concurrently active Act 3+ run. Still not started for any of
  `T1-T5`: nothing currently re-offers a chapter's other 2 locked style
  perks, or `T5`'s remaining locked endgame perks, outside the main
  linear `T1→T2→T3→T4→T5` progression.
- [ ] Balance pass on every number in this design (45% Cognition split,
  ×0.55 Writing, all the ×1.25/×0.75/-90%/-45% values in the `T1-T4`
  table, `T5`'s endgame perk magnitudes and scaling curve — currently a
  flat +1/level cap-5 placeholder, not the real sec.4.4 curve) — same
  "provisional until playtest" status as every other number in
  `10_META_PROGRESSION.md`.
- [ ] Act 1 closeout regression: a full fresh-state `T1→T5` playthrough
  (manual or scripted) now that every chapter exists in code, to catch
  pacing/perk-stacking issues a single-chapter regression test can't see.

---

# Act 2/Act 3 narrative + global Archive extension (2026-09-17)

**Status:** DONE — docs written per `docs/DECISIONS_ACT_STRUCTURE.md`
`ACT-008`…`ACT-012`. Docs-only, no code changes.

- [x] `ACT-008`…`ACT-012` appended to `docs/DECISIONS_ACT_STRUCTURE.md`.
- [x] new `docs/gdd/14_GLOBAL_ARCHIVE_AND_ACHIEVEMENTS.md` — Archive
  Completion %, per-act weighting, achievement categories, Archive Log
  screen contract, grand-finale gate.
- [x] new `docs/scenario/02_ACT2_ACT3_SCRIPT.md` — unified `P1–P3` script
  (Archive as observer, not editor), unified collapse reveal scene, Act 3
  system-entry reveal lines, first-Act-3-reset finale (full path recap +
  future hints), grand finale at 100% Archive (`АРХИВ ПОМНИТ ВСЁ`).
- [x] `docs/scenario/00_NARRATIVE_BIBLE.md` §0/§5/§32/§33 — old placeholder
  Acts VI–X collapsed into one Act VI ("Правда и бесконечность") mapped to
  the two new gates instead of five vague reveal-drip acts.
- [x] `docs/scenario/06_ENDINGS_COPY.md` — cross-reference note after the
  Act 2 (`P1`) teaser pointing at the new script file.
- [x] `docs/scenario/05_NARRATIVE_FLAGS.md` §5C/§5D + reset-behavior
  entries for `P` reset and Act 3 universe/challenge reset.

**Not done, deliberately out of scope for this pass:**

- [ ] Act 2/Act 3 gameplay config (goals/events/eras) — nothing here was
  implemented in code; this is narrative/mechanic spec only.
- [ ] finite Act 3 system/achievement list (`14_...ACHIEVEMENTS.md` §4.5) —
  depends on Act 3 GDD, not yet written (`ACT-006` still open).
- [ ] per-act Archive Completion weighting (`14_...ACHIEVEMENTS.md` §3) and
  Act 2 observer-line trigger conditions (`02_...SCRIPT.md` §1.1) —
  provisional, need playtest/telemetry like every other numeric target.

---

# Immediate order

**Superseded** by the Act 1 chapter structure — see "T1 retrofit: Мор
collapse" above for current status and next step. Kept as history:

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

Current immediate order (2026-09-18, updated after `T5`): Archive Recall
perk system and `T1`-`T5` are all implemented — see "Archive Recall perk
system + AF removal from Act 1-2" above for the full checklist. Next:
Act 1 closeout regression (full fresh-state `T1→T5` playthrough) →
balance pass on every provisional number → Archive-mode entry point →
Act 2 (`P1-P3`) implementation.
