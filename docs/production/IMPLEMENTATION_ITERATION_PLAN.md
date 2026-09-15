# Хроники Эволюции — пошаговый план реализации для Codex

**Версия:** reconciliation revision 2.0  
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
- start Iteration 4 while reconciliation rework is blocked;
- change canonical design without documentation update.

---

# 2. Definition of Done

Every implementation iteration must:

- build successfully;
- pass relevant tests;
- have a playable/testable path;
- keep state/config separated from presentation;
- preserve save/recovery invariants;
- use stable IDs/explicit migrations;
- update simulation where balance changes;
- update TODO/known issues;
- stop at its review gate.

---

# 3. Historical iterations

## Iteration 0 — Repo baseline and code audit

**Status:** done.

## Iteration 1 — Domain adapter and data foundation

**Status:** done.

Accepted technical output:

- isolated `src/chronicles` domain;
- data-driven registries/validation;
- commands/events/selectors;
- resource/cost/production services;
- ports/adapters;
- headless test foundation.

## Iteration 2 — Save v1 and dev tools

**Status:** done.

Accepted:

- versioned save;
- primary/pending/backup recovery;
- autosave;
- dev speed 1x/5x/20x/100x;
- resource/event/state tools;
- idempotent reset foundation.

## Iteration 3 — Goal Engine + tutorial shell

**Technical status:** done / gate passed.

Accepted:

- generic Goal Engine;
- optional goals;
- lifecycle/prerequisites/conditions/rewards;
- CTA/highlights/hints;
- objective UI shell;
- telemetry hooks;
- playable runtime integration;
- save/load/autosave integration;
- simulation/UI tests.

Accepted implementation baseline:

`32c0d72f56f48a21e3c22c8e3eb9ef3975e967fb`

### Important reconciliation status

Iteration 3 **architecture is accepted**.

Its molecular content is superseded:

```text
Energy / Information
Chemical Gradient
Catalytic Fold
Energy Pocket
Stable Bond old semantics
old M01–M06 effects/costs
```

Do not classify Iteration 3 as technically failed.

---

# 4. Mandatory Rework Iteration — Biological gameplay reconciliation 0–10

**Status:** blocked until user approves reconciled docs.

This iteration happens **before Iteration 4**.

## Goal

Replace only the superseded early content while preserving Iteration 3 architecture.

Corrected playable path:

```text
Stable RNA
→ Self Replication
→ DNA Synthesis
→ Membrane
→ Cell
```

## Inputs

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

- create/activate ruleset `timeline1-v2-reconciled`;
- replace early resource IDs/config with RNA/DNA and later Biomass hooks;
- remove player-facing Information from current ruleset;
- remove Chemical Gradient / Catalytic Fold / Energy Pocket from current player-facing producer config;
- update M01–M06 content semantics;
- keep M04 Error Correction optional;
- add explicit aliases/migration where pre-release saves require it;
- validate no stale goal/config reference points to removed content.

## Goal Engine content

Update G001–G005:

```text
G001 Stable RNA
G002 Self Replication
G003 DNA
G004 Membrane
G005 Cell
```

Keep Goal Engine code generic. No `if G001` special cases in UI/domain unless genuinely system-level.

## Runtime/UI

- top resources show current restored resources;
- first action starts primordial process;
- passive RNA unlock visible;
- replication visual feedback;
- DNA reveal;
- membrane/cell visual milestone;
- no Information counter;
- no old molecular generator cards.

## Tests

Update/add:

- config validation;
- resource unlock order;
- M01→M06 reachability;
- optional M04 skippability;
- save/load mid-slice;
- recovery regression;
- Goal Engine progression;
- telemetry event names/payloads where content changed;
- production build dev-tool hiding;
- UI smoke.

## Simulation profiles

Required:

- competent;
- optimized;
- slower/non-optimal;
- M04 optional route.

## Initial timing acceptance

```text
first meaningful action <20 sec
first passive/self-sustaining RNA <60 sec
Self Replication ~2–3 min
DNA visible ~4–6 min
Cell ~9–11 min
manual share <=5% after ~3 min
```

Exact values are tuned during the iteration; do not preserve old E/I node costs for nostalgia.

## Gate

1. automated tests pass;
2. headless timings acceptable;
3. manual playtest 0–10 completed;
4. user approves corrected playable;
5. only then Iteration 4 may start.

---

# 5. Iteration 4 — Cell → first adaptation, ~10–18

**Status:** blocked by Rework Iteration.

## Gameplay

- Biomass;
- Metabolism;
- Energy as metabolic resource;
- Protein Synthesis / Ribosome;
- Organelles;
- first primary branch:
  - Absorption;
  - Symbiosis;
  - Shell;
- optional Photosynthesis;
- optional Chemosynthesis;
- Cell Coordination toward multicellularity.

## Branch rules

- one primary trait in Timeline #1;
- no sibling `×2.5` purchase;
- branch must change profile/visuals and local economy;
- all branches must stay inside pacing tolerance.

## Acceptance

- first branch readable and meaningful;
- no branch soft-lock;
- 10–18 progression remains understandable without abstract Information currency;
- save/load and Goal Engine work through branch choice.

---

# 6. Iteration 5 — Multicellularity / Adaptation Points, ~18–28

## Gameplay

- Multicellularity;
- AP earning from milestones/side objectives;
- AP spending;
- Mobility;
- Sensory Cells;
- Digestion;
- Structural Tissue;
- tissue specialization.

## Acceptance

- core progression requires 0 AP;
- optional AP builds differ visibly/functionally;
- player can reach Multicellularity without buying all options;
- target Multicellularity ~24–28 min.

---

# 7. Iteration 6 — Nervous System / Cognition / Sapience, ~28–40

## Gameplay

- nervous tissue/system;
- behavior strategy;
- Cognition 0–100;
- sensory/neural/social/tool contributors;
- Danger / Other micro-events;
- condition-driven Sapience.

## Acceptance

- Sapience cannot be purchased as one ordinary resource node;
- Cognition contributors are inspectable;
- optional AP build cannot soft-lock 100 Cognition;
- target Sapience ~38–40 min;
- transition to civilization starts around Population 5.

---

# 8. Iteration 7 — Tribe, ~38–50

## Gameplay

- Food / Materials / Knowledge / Population;
- initial Population ~5;
- Forager/Hunter;
- Gatherer;
- Thinker;
- simple shelters/hearth/storage/tool structure;
- population growth;
- distribution event.

## Acceptance

- player understands Population→jobs→production;
- temporary Food deficit recoverable;
- Tribe established around 48–50 min.

---

# 9. Iteration 8 — Settlement, ~50–65

- Agriculture;
- Fields;
- Houses;
- Workshop;
- Storage;
- Farmer/Builder/Scholar/Artisan;
- Permanent Settlement;
- Traces Before Us.

Specialization is optional/profile unless separately approved as blocking.

---

# 10. Iteration 9 — City, ~65–80

- Writing;
- School;
- Market/trade-lite;
- organized labor/research;
- government-lite;
- City milestone.

Power is not yet the main top-level resource.

Target City ~78–80 min.

---

# 11. Iteration 10 — Industry, ~80–95

- Mechanization;
- Steam;
- factory/rail/logistics;
- electrification;
- Power unlock;
- automation;
- Industry milestone;
- Energy Crisis choice.

Target Industry ~93–95 min.

---

# 12. Iteration 11 — Modern → Atomic, ~95–108

## Modern

- mature grid;
- research institutions;
- communications/global connection;
- modern logistics/automation;
- ERROR 17.

## Atomic

- Scientific Method;
- Atomic Theory;
- reactor/lab project;
- Atomic Age;
- `Снова.`;
- Stability/World Tension start.

Target Atomic ~107–108 min.

---

# 13. Iteration 12 — Crisis / Ash / Archive

Keep accepted DS-02/DS-03 contract:

- crisis phases;
- bloc conflict;
- false warning;
- crisis responses;
- Last Protocol;
- unavoidable first Ash;
- Archive Summary;
- AF reward;
- idempotent reset;
- Timeline #2 teaser.

Regression-test the entire flow after balance changes.

---

# 14. Timeline #2 / meta implementation

Only after Timeline #1 v2 is stable:

- Archive Recall tuned against corrected RNA/DNA/Cognition path;
- AR01/AR02 rewritten effects;
- AR05 retained optional adaptation;
- AR06 secondary primary trait permission;
- AR09 numerical dual-trait activation;
- Timeline #2 timing tuned from corrected first-run p50.

---

# 15. Current command for Codex

Until explicit user approval:

```text
STOP.
Do not change game code.
Do not start Rework Iteration.
Do not start Iteration 4.
```

After approval, the next Codex task is the dedicated **Biological gameplay reconciliation 0–10** handoff, not the old Iteration 4.