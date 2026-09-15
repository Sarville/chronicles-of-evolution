# Хроники Эволюции — DS-03 Codex Handoff

**Status:** architecture-valid / gameplay inputs superseded by reconciliation  
**Date updated:** 2026-09-16

---

# 1. Important reconciliation note

This handoff remains authoritative for **technical architecture only**.

Its old gameplay-input assumption that `02_ECONOMY_FIRST_120_MINUTES.md` + `03_EVOLUTION_TREE.md` meant Energy/Information molecular gameplay has been superseded by:

1. `docs/DECISIONS_RECONCILIATION.md`;
2. reconciled `docs/gdd/01_FIRST_120_MINUTES.md`;
3. reconciled `docs/gdd/02_ECONOMY_FIRST_120_MINUTES.md`;
4. reconciled `docs/gdd/03_EVOLUTION_TREE.md`.

Codex must not use git history or older document revisions to restore:

- visible Information;
- Chemical Gradient;
- Catalytic Fold;
- Energy Pocket;
- Stable Bond old semantics;
- Sapience 46-minute purchase model.

---

# 2. DS-03 architecture remains accepted

Keep:

```text
src/chronicles/
  config/
  domain/
  adapters/
  save/
  dev/

tests/
  config/
  domain/
  save/
  simulation/
```

Keep implementation principles:

1. serializable config registries + validators;
2. canonical GameState;
3. commands + domain events + selectors;
4. pure Resource/Cost/Production services;
5. injectable clock/RNG/storage/localization/platform ports;
6. versioned save/recovery;
7. headless tests/simulation;
8. UI uses commands/selectors, not direct state mutation.

---

# 3. Accepted Iteration 3 baseline

Technical baseline commit:

`32c0d72f56f48a21e3c22c8e3eb9ef3975e967fb`

Interpretation:

```text
architecture accepted
Goal Engine accepted
save/recovery accepted
dev tools accepted
simulation foundation accepted
0-10 content superseded
```

Do not roll back the architecture in order to restore original gameplay.

---

# 4. Current implementation state

Iteration 0: done.  
Iteration 1: done.  
Iteration 2: done.  
Iteration 3: technically done, early content requires reconciliation rework.  
Iteration 4: blocked.

Next code step after explicit user approval:

**Biological gameplay reconciliation 0–10.**

---

# 5. Required inputs for next code step

After approval Codex must read:

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
- `docs/technical/07_TESTING_STRATEGY.md`;
- `docs/production/IMPLEMENTATION_ITERATION_PLAN.md`.

---

# 6. Hard constraints for reconciliation rework

Codex must:

- preserve `src/chronicles` boundaries;
- preserve generic Goal Engine;
- preserve versioned save/recovery;
- preserve dev speed controls;
- preserve telemetry/event architecture;
- preserve headless simulation framework;
- use a new ruleset version;
- explicitly handle obsolete pre-release content state.

Codex must not:

- mass-refactor legacy Evolve;
- replace domain architecture;
- invent exact new balance numbers without running simulation;
- keep old E/I config merely to reduce work;
- start 10–18 content before corrected 0–10 passes review;
- start old Iteration 4.

---

# 7. Corrected first implementation slice

```text
Stable RNA
→ Self Replication
→ DNA Synthesis
→ Error Correction [optional]
→ Membrane
→ Cell
```

Player-facing early resources:

- RNA;
- DNA;
- Biomass only after Cell.

Energy appears in following metabolism content, not at game start.

Information is not a visible spendable resource.

---

# 8. Gate

Before any post-Cell expansion:

- config validation passes;
- domain tests pass;
- save/recovery regression passes;
- UI smoke passes;
- competent/optimized/slower/M04 simulations pass;
- Cell target ~9–11 min;
- manual playtest completed;
- user approves playable 0–10.

Only then unlock corrected Iteration 4.