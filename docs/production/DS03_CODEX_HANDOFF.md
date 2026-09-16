# Хроники Эволюции — DS-03 Codex Handoff

**Status:** architecture-valid / reconciliation handoff ready  
**Date updated:** 2026-09-16

---

# 1. Authority note

This handoff remains authoritative for technical architecture only.

Gameplay content authority is now:

1. `docs/DECISIONS_RECONCILIATION.md`;
2. `docs/gdd/01_FIRST_120_MINUTES.md`;
3. `docs/gdd/03_EVOLUTION_TREE.md`;
4. `docs/gdd/02_ECONOMY_FIRST_120_MINUTES.md` for tuning inside approved gameplay.

Do not use older git revisions to restore superseded:

- visible Information;
- Chemical Gradient;
- Catalytic Fold;
- Energy Pocket;
- Stable Bond old semantics;
- Sapience 46-minute purchase model.

---

# 2. Architecture remains accepted

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

Keep:

- serializable config + validators;
- canonical GameState;
- commands/events/selectors;
- pure services;
- injectable ports;
- versioned save/recovery;
- headless simulation/tests;
- generic Goal Engine;
- idempotent reset foundation.

---

# 3. Accepted implementation baseline

`32c0d72f56f48a21e3c22c8e3eb9ef3975e967fb`

Interpretation:

```text
architecture accepted
Goal Engine accepted
save/recovery accepted
dev tools accepted
simulation foundation accepted
0-10 content superseded
0-10 balance superseded
```

Do not roll back architecture to restore original gameplay.

---

# 4. Current status

- Iteration 0: done
- Iteration 1: done
- Iteration 2: done
- Iteration 3: technically done; early content requires rework
- Reconciliation documentation: accepted
- Biological gameplay reconciliation 0–10: **READY**
- Iteration 4: blocked until rework/playtest passes

---

# 5. Required inputs for next Codex task

Read:

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

# 6. Next implementation slice

Only:

```text
Stable RNA
→ Self Replication
→ DNA Synthesis
→ Error Correction [optional]
→ Membrane
→ Cell
```

Player-facing resources:

- RNA;
- DNA;
- Biomass only after Cell.

Energy begins in following Metabolism content.

Information is not a visible spendable resource.

---

# 7. Hard constraints

Preserve:

- `src/chronicles` boundaries;
- Goal Engine;
- save/recovery;
- dev speed controls;
- telemetry/events;
- headless simulation.

Use new ruleset:

```text
timeline1-v2-reconciled
```

Explicitly handle obsolete pre-release state.

Do not:

- mass-refactor legacy Evolve;
- keep old E/I config just to minimize work;
- guess final balance without simulation;
- start 10–18 content;
- start Iteration 4 automatically.

---

# 8. Rework gate

Required before Iteration 4:

- config/domain/save tests pass;
- UI smoke passes;
- competent/optimized/slower/M04 simulations pass;
- first action <20 sec;
- passive RNA <60 sec;
- Self Replication ~2–3 min;
- DNA ~4–6 min;
- Cell ~9–11 min;
- manual share <=5% after ~3 min;
- manual 0–10 playtest completed;
- user approves corrected playable.

After this gate, stop and report. Do not continue automatically into Iteration 4.