# Хроники Эволюции — пошаговый план реализации для Codex

**Версия:** reconciliation revision 2.1  
**Scope:** Timeline #1 0–120, first Ash/reset, Timeline #2 teaser.  
**Principle:** preserve accepted architecture; rework content before extending it.

---

# 1. Hard workflow rules

Before any implementation step Codex must read:

1. `docs/PROJECT_STATE.yaml`;
2. `docs/DECISIONS_RECONCILIATION.md`;
3. inputs explicitly listed for the current iteration;
4. `docs/TODO.md`.

Codex must not:

- restore superseded Energy/Information molecular content from old commits;
- invent new gameplay concepts to fill gaps;
- start Iteration 4 while reconciliation rework is incomplete;
- change canonical design without documentation update.

---

# 2. Historical iterations

## Iteration 0 — Repo baseline and code audit

Status: done.

## Iteration 1 — Domain adapter and data foundation

Status: done.

## Iteration 2 — Save v1 and dev tools

Status: done.

## Iteration 3 — Goal Engine + tutorial shell

**Technical status:** done / gate passed.

Accepted implementation baseline:

`32c0d72f56f48a21e3c22c8e3eb9ef3975e967fb`

Keep:

- isolated domain;
- data-driven config/validation;
- canonical GameState;
- commands/events/selectors;
- Goal Engine;
- optional goals;
- CTA/highlight/hint foundation;
- save/autosave/recovery;
- dev speed/tools;
- telemetry;
- headless simulation;
- UI technical shell.

Superseded content:

```text
Energy / Information molecular economy
Chemical Gradient
Catalytic Fold
Energy Pocket
Stable Bond old semantics
old M01–M06 effects/costs
old 0–10 balance
```

Iteration 3 is not a technical failure.

---

# 3. NEXT — Biological gameplay reconciliation 0–10

**Status:** READY.

This is the next Codex implementation task.

## Goal

Replace superseded early content while preserving Iteration 3 architecture.

Corrected playable path:

```text
Stable RNA
→ Self Replication
→ DNA Synthesis
→ Error Correction [optional]
→ Membrane
→ Cell
```

## Required inputs

- `docs/PROJECT_STATE.yaml`;
- `docs/TODO.md`;
- `docs/DECISIONS_RECONCILIATION.md`;
- `docs/gdd/01_FIRST_120_MINUTES.md`;
- `docs/gdd/02_ECONOMY_FIRST_120_MINUTES.md`;
- `docs/gdd/03_EVOLUTION_TREE.md`;
- `docs/gdd/07_GOALS_AND_MILESTONES.md`;
- `docs/gdd/11_BALANCE_RULES.md`;
- `docs/technical/00_TECHNICAL_OVERVIEW.md`;
- `docs/technical/03_GAME_STATE.md`;
- `docs/technical/04_SAVE_ARCHITECTURE.md`;
- `docs/technical/07_TESTING_STRATEGY.md`.

## Data/config tasks

- create/activate `timeline1-v2-reconciled`;
- switch early player-facing resources to RNA/DNA;
- remove player-facing Information from current ruleset;
- remove Chemical Gradient / Catalytic Fold / Energy Pocket from current player-facing config;
- remap M01–M06 semantics;
- keep M04 optional;
- add explicit pre-release migration/restart handling where needed;
- remove stale config/goal/selectors refs.

## Goal content

```text
G001 Stable RNA
G002 Self Replication
G003 DNA
G004 Membrane
G005 Cell
```

Goal Engine remains generic.

## UI/runtime

- primordial process action;
- passive RNA reveal;
- replication feedback;
- DNA reveal;
- membrane/cell transition;
- no Information counter;
- no old molecular generator cards;
- preserve save/recovery/dev tools.

## Tests

Update/add:

- config validation;
- resource unlock order;
- M01→M06 reachability;
- M04 skippability;
- save/load mid-slice;
- ruleset migration/restart handling;
- Goal Engine progression;
- UI smoke;
- production build dev-tool hiding.

## Simulation profiles

Required:

- competent;
- optimized;
- slower/non-optimal;
- M04 optional.

## Initial timing acceptance

```text
first meaningful action <20 sec
passive/self-sustaining RNA <60 sec
Self Replication ~2–3 min
DNA visible ~4–6 min
Cell ~9–11 min
manual contribution <=5% after ~3 min
```

## Gate

- automated tests pass;
- simulation profiles acceptable;
- manual 0–10 playtest completed;
- user approves corrected playable.

Only then Iteration 4 becomes ready.

---

# 4. Iteration 4 — Cell → first adaptation, ~10–18

**Status:** BLOCKED by Biological Rework.

Scope after unblock:

- Biomass;
- Metabolism;
- Energy as metabolic resource;
- Protein Synthesis / Ribosome;
- Organelles;
- primary branch Absorption / Symbiosis / Shell;
- optional Photosynthesis;
- optional Chemosynthesis;
- Cell Coordination.

No sibling `×2.5` rule.

---

# 5. Iteration 5 — Multicellularity / AP, ~18–28

- Multicellularity;
- AP milestone/side-objective rewards;
- Mobility;
- Sensory Cells;
- Digestion;
- Structural Tissue;
- tissue specialization.

Core path costs 0 AP.

Target Multicellularity ~24–28 min.

---

# 6. Iteration 6 — Nervous System / Cognition / Sapience, ~28–40

- nervous tissue/system;
- behavior strategy;
- Cognition 0–100;
- sensory/neural/social/tool contributors;
- Danger / Other micro-events;
- condition-driven Sapience;
- civilization transition around Population 5.

Target Sapience ~38–40 min.

---

# 7. Iteration 7 — Tribe, ~38–50

- Food / Materials / Knowledge / Population;
- Population start ~5;
- Forager/Hunter;
- Gatherer;
- Thinker;
- simple camp structures;
- job assignment;
- recoverable Food deficit;
- distribution event.

---

# 8. Iteration 8 — Settlement, ~50–65

- Agriculture;
- Fields;
- Houses;
- Workshop;
- Storage;
- Settlement jobs;
- Permanent Settlement;
- Traces Before Us.

Settlement specialization optional/profile by default.

---

# 9. Iteration 9 — City, ~65–80

- Writing;
- School;
- Market/trade-lite;
- organized labor/research;
- government-lite;
- City milestone.

Power is not yet main top-level resource.

---

# 10. Iteration 10 — Industry, ~80–95

- Mechanization;
- Steam;
- factories/rail/logistics;
- electrification;
- Power unlock;
- automation;
- Industry milestone;
- Energy Crisis.

---

# 11. Iteration 11 — Modern → Atomic, ~95–108

Modern:

- mature grid;
- research institutions;
- communications/global connection;
- modern logistics/automation;
- Error 17.

Atomic:

- Scientific Method;
- Atomic Theory;
- reactor/lab project;
- Atomic Age;
- `Снова.`;
- Stability/World Tension.

---

# 12. Iteration 12 — Crisis / Ash / Archive

Keep accepted contract:

- crisis phases;
- bloc conflict;
- false warning;
- crisis responses;
- Last Protocol;
- unavoidable first Ash;
- Archive Summary;
- AF;
- idempotent reset;
- Timeline #2 teaser.

---

# 13. Meta implementation

Only after Timeline #1 v2 stabilizes:

- Archive Recall tuned to RNA/DNA/Cognition path;
- AR01/AR02 reconciled effects;
- AR05 retained optional adaptation;
- AR06 secondary primary trait permission;
- AR09 dual-trait numerical activation;
- Timeline #2 timing tuned from corrected first-run p50.

---

# 14. Current command for Codex

```text
START only the Biological gameplay reconciliation 0–10 task.
STOP after its tests, simulation, rebalance and handoff for manual playtest.
DO NOT start Iteration 4 automatically.
```