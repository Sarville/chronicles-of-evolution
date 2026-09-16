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
only after the unified 0–120 simulation and playtest pass.

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
- [ ] prepare 3-4 persistent desktop layout shell concepts
- [ ] prepare 3-4 persistent mobile layout shell concepts
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

# Timeline #1 — полная пересборка 0–120 минут

**Status:** READY. Product roadmap and implementation order approved on
2026-09-16. Authority: `docs/gdd/12_LONG_TERM_PROGRESSION_AND_RESET_ROADMAP.md`
and `docs/production/TIMELINE_01_REBUILD_PLAN.md`.

- [ ] `T1-0` — Foundation + Event Engine: audit `0–18`; config-driven
  minor/major deck; seeded RNG/deck state; cooldowns; atomic `RESOLVE_EVENT`;
  save/migration contract; RNA/DNA/Cell event set; Chronicle/unlock extension
  points; deterministic tests and event-aware simulations.
- [ ] `T1-1` — Organism 18–28: AP, Multicellularity, adaptations and target
  timing validation.
- [ ] `T1-2` — Cognition 28–40: Nervous System, Cognition `0..100`, Sapience
  convergence, biological profiles and simulations.
- [ ] `T1-3` — First civilization 38–65: Population~5 start, Tribe,
  Settlement, phase-aware jobs/buildings, Food/Morale/Knowledge, recovery
  from deficits and event expansion.
- [ ] `T1-4` — City and Industry 65–95: contextual resources/crafting,
  compact market and Power, city/industry simulation profiles.
- [ ] `T1-5` — Modern and Atomic 95–108: Modern bridge, World Tension,
  Error 17, `Again`, late event deck.
- [ ] `T1-6` — Great Filter/reset 108–120: Last Protocol, inevitable first
  Ash, AF, Archive, idempotent reset and T2 teaser.
- [ ] `T1-7` — Full-run closeout: p25/p50/p75 rebalance, fresh-state mobile
  and desktop playtests, save/recovery, telemetry, UI/smoke/build gate.

Guardrails:

- [ ] no `T2` runtime before `T1-7` passes full-run regression and manual
  playtest;
- [ ] keep accepted `0–10` numbers unless an explicit balance decision records
  a change;
- [ ] do not create late-game placeholder screens instead of a real epoch GDD.

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
