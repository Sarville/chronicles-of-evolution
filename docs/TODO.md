# Хроники Эволюции — TODO

**Last update:** 2026-09-16

`PROJECT_STATE.yaml` is the canonical status source. This file is the human-readable work queue.

---

# Design reconciliation

## Documentation

- [x] Design reconciliation audit
- [x] Restore original biological gameplay language in canonical GDD
- [x] Reconcile 0–120 progression
- [x] Restore Adaptation Points
- [x] Restore Cognition 0–100 / condition-driven Sapience
- [x] Restore first branch: Absorption / Symbiosis / Shell
- [x] Preserve Photosynthesis / Chemosynthesis as optional metabolism adaptations
- [x] Reconcile civilization timing and Power unlock
- [x] Restore Modern bridge
- [x] Reconcile Archive/meta rules with new biology
- [x] Reconcile balance guardrails
- [x] Update production/technical references
- [x] Update PROJECT_STATE
- [x] Approve corrected 0–120 gameplay canon
- [x] Prepare Codex rework handoff: `docs/production/RECONCILIATION_CODEX_HANDOFF.md`

Documentation reconciliation is accepted and pushed.

---

# Implementation status

## Iteration 0 — Repo baseline / audit

- [x] done

## Iteration 1 — Domain adapter and data foundation

- [x] done

## Iteration 2 — Save v1 and dev tools

- [x] done

## Iteration 3 — Goal Engine + tutorial shell

**Technical status:** passed.

Keep:

- [x] isolated Chronicles domain
- [x] data-driven config/validation
- [x] canonical GameState
- [x] commands/events/selectors
- [x] Goal Engine
- [x] optional goals
- [x] CTA/highlight/hint foundation
- [x] save/autosave/recovery
- [x] dev speed/tools
- [x] telemetry hooks
- [x] headless simulation
- [x] UI technical prototype
- [x] build/tests/smoke gates

Accepted implementation baseline:

`32c0d72f56f48a21e3c22c8e3eb9ef3975e967fb`

### Superseded Iteration 3 content

Historical only:

- [x] Energy / Information molecular economy
- [x] Chemical Gradient
- [x] Catalytic Fold
- [x] Energy Pocket
- [x] Stable Bond old semantics
- [x] old M01–M06 effects/costs
- [x] old 0–10 timing simulation

Iteration 3 technical foundation remains successful.

---

# DONE — Biological gameplay reconciliation implementation

**Status:** DONE. Biological 0–10 frozen baseline accepted after live playtest.

Use:

`docs/production/RECONCILIATION_CODEX_HANDOFF.md`

Completed Codex tasks:

- [x] create/activate ruleset `timeline1-v2-reconciled`
- [x] migrate early resource config to RNA / DNA / Biomass hooks
- [x] remove Information from player-facing spendable resources
- [x] replace Chemical Gradient / Catalytic Fold / Energy Pocket content
- [x] change M01–M06 semantics to Stable RNA / Self Replication / DNA Synthesis / Error Correction / Membrane / Cell
- [x] update G001–G005 content
- [x] preserve Goal Engine architecture
- [x] preserve save/recovery architecture
- [x] add explicit pre-release migration/restart handling for obsolete early content
- [x] update config validation tests
- [x] update domain tests
- [x] update UI smoke tests
- [x] update headless simulation
- [x] rebalance 0–10 from scratch
- [x] competent / optimized / slower simulation profiles pass
- [x] optional M04 route remains skippable
- [x] first meaningful action <20 sec
- [x] passive/self-sustaining RNA <60 sec
- [x] Self Replication ~2–3 min
- [x] DNA visible ~4–6 min
- [x] Cell ~9–11 min
- [x] manual contribution <=5% after ~3 min
- [x] manual playtest 0–10
- [x] user approves corrected playable 0–10
- [x] generic manual resource framework
- [x] DNA manual action
- [x] integer resource display
- [x] ETA UI

### Findings from 0–10 playtest

- [x] Document repeatable process milestone bonuses with scenario justification, threshold labels and UI wording for the current 0–10 slice.
- [x] Add generic manual-resource framework note: manual actions may grant/convert resources, passive production remains primary, future reward multipliers are not baseline ads progression.
- [ ] Before expanding biological economy beyond Cell, define any new repeatable-process milestones per producer; no implicit global `10/25/50` thresholds.

---

# Iteration 4 — corrected content after Cell

**Status:** READY. Not started.

Expected scope after unblock:

- [ ] Metabolism
- [ ] Biomass/Energy cellular economy
- [ ] first primary branch: Absorption / Symbiosis / Shell
- [ ] optional Photosynthesis / Chemosynthesis adaptations
- [ ] Protein Synthesis / Ribosome
- [ ] Organelles
- [ ] corrected Cell → Multicellularity progression
- [ ] first AP rewards/hooks
- [ ] balance/simulation for 10–18

---

# Following biological work

## Multicellularity / Adaptation Points

- [ ] full AP reward table
- [ ] Mobility
- [ ] Sensory Cells
- [ ] Digestion
- [ ] Structural Tissue
- [ ] Multicellularity target ~24–28 min

## Nervous System / Cognition

- [ ] Nervous System
- [ ] Behavior choice
- [ ] Cognition 0–100
- [ ] Danger / Other micro-events
- [ ] Sapience condition transition
- [ ] biological 0–40 end-to-end simulation
- [ ] target Sapience ~38–40 min

---

# Civilization rebalance after biology

- [ ] set civilization starting package around Population 5
- [ ] retune Population growth/thresholds
- [ ] retune Tribe 38–50
- [ ] retune Settlement 50–65
- [ ] validate City ~78–80
- [ ] validate Power unlock in Industry
- [ ] validate Industry ~93–95
- [ ] implement/validate Modern bridge ~95–104
- [ ] validate Atomic ~107–108

---

# Crisis / Archive regression

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

# Design sessions after playable rework

- [ ] DS-05 — Timeline #1 full narrative package
- [ ] DS-06 — UX architecture and wireframes
- [ ] DS-07 — Art direction
- [ ] DS-08 — Asset manifest/prompts
- [ ] DS-09 — Audio
- [ ] DS-10 — Analytics/platform readiness
- [ ] DS-11 — final cross-document consistency / design freeze v2

---

# Immediate order

```text
Biological 0–10 frozen baseline
→ start Iteration 4 when requested
→ corrected content expansion after Cell
```

Iteration 4 is ready, but not started in the 0–10 freeze cleanup commit.
