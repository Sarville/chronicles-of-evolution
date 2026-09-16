# Хроники Эволюции — Codex Handoff: Biological Gameplay Reconciliation 0–10

**Status:** ready  
**Scope:** code/content rework + balance for corrected playable 0–10 only.  
**Do not start Iteration 4.**

---

# 1. Context

Iteration 3 is technically successful. Keep its architecture.

Accepted technical baseline:

`32c0d72f56f48a21e3c22c8e3eb9ef3975e967fb`

The problem is content canon, not Goal Engine/domain/save architecture.

The old playable 0–10 used:

```text
Energy / Information
Chemical Gradient
Catalytic Fold
Energy Pocket
Stable Bond
Self Replication
Catalytic RNA
Lipid Shell
Proto-cell
```

That content is superseded.

Corrected canonical progression:

```text
Stable RNA
→ Self Replication
→ DNA Synthesis
→ Error Correction [OPTIONAL]
→ Membrane
→ Cell
```

---

# 2. Read first

Mandatory:

1. `docs/PROJECT_STATE.yaml`
2. `docs/TODO.md`
3. `docs/DECISIONS_RECONCILIATION.md`
4. `docs/gdd/01_FIRST_120_MINUTES.md`
5. `docs/gdd/02_ECONOMY_FIRST_120_MINUTES.md`
6. `docs/gdd/03_EVOLUTION_TREE.md`
7. `docs/gdd/07_GOALS_AND_MILESTONES.md`
8. `docs/gdd/11_BALANCE_RULES.md`
9. `docs/technical/00_TECHNICAL_OVERVIEW.md`
10. `docs/technical/03_GAME_STATE.md`
11. `docs/technical/04_SAVE_ARCHITECTURE.md`
12. `docs/technical/07_TESTING_STRATEGY.md`
13. `docs/production/IMPLEMENTATION_ITERATION_PLAN.md`
14. `docs/production/DS03_CODEX_HANDOFF.md`

Do not use older git revisions as design authority when they conflict with reconciliation docs.

---

# 3. Hard constraints

## KEEP

- isolated `src/chronicles` architecture;
- canonical GameState;
- commands/events/selectors;
- data-driven serializable config;
- generic Goal Engine;
- optional goal support;
- CTA/highlight/hint foundation;
- save v1/autosave/recovery;
- dev speed/resource/event tools;
- telemetry hooks;
- headless simulation framework;
- UI technical shell;
- idempotent reset foundation.

## REMOVE / REPLACE in current ruleset

- player-facing `Information`;
- starting `Energy` wallet;
- Chemical Gradient;
- Catalytic Fold;
- Energy Pocket;
- Stable Bond old economic semantics;
- old M01–M06 costs/effects;
- old 0–10 E/I simulation assumptions.

## DO NOT

- mass-refactor legacy Evolve;
- redesign architecture;
- invent a third gameplay version;
- keep old content because it is already implemented;
- start post-Cell Metabolism/branch content beyond hooks required for Cell transition;
- start Iteration 4 automatically.

---

# 4. Ruleset

Create or activate a new explicit ruleset:

```text
timeline1-v2-reconciled
```

Do not silently reinterpret an old `timeline1-v1` active run.

For pre-release old runs implement one explicit safe policy:

- deterministic migration if semantic mapping is trustworthy; or
- explicit restart of run preserving meta/settings.

Never guess `energy→rna` or `information→dna` from stock amounts.

Document the chosen policy.

---

# 5. Resource/content model 0–10

## Resources

At start:

```text
RNA
```

After M03:

```text
RNA + DNA
```

After M06 Cell:

```text
Biomass becomes available for following content
```

Energy is not active until later Metabolism content.

Information is not a visible spendable resource.

## Early process model

Prefer generic biological process config rather than forcing three repeatable abstract generators.

Possible content-neutral process IDs:

```text
PROC_PRIMORDIAL_REACTION
PROC_RNA_REPLICATION
PROC_DNA_SYNTHESIS
```

Exact implementation names may differ if existing architecture has a cleaner generic abstraction.

Do not put gameplay-specific calculations in UI.

---

# 6. Node semantics

Keep M-family IDs where practical:

```text
M01 Stable RNA
M02 Self Replication
M03 DNA Synthesis
M04 Error Correction [OPTIONAL]
M05 Membrane
M06 Cell [CONVERGENCE]
```

Requirements:

- M04 truly skippable;
- M05 does not require M04;
- M06 transitions to cellular state and unlocks Biomass hook;
- no old E/I prices survive accidentally;
- exact new costs/rates are tuning variables, not guessed canon.

---

# 7. Goal content

Update existing Goal Engine config/content, not engine architecture:

```text
G001 Create Stable RNA
G002 Start Self Replication
G003 Create DNA
G004 Create Membrane
G005 Create Cell
```

Target meaning:

- G001 teaches first process/passive production;
- G002 teaches self-sustaining replication;
- G003 reveals DNA;
- G004 gives visible membrane payoff;
- G005 gives Cell milestone and Biomass preview/unlock.

CTA/highlight and stall hints must point to reconciled entities/processes.

No hint/UI copy may reference old molecular generators or Information.

---

# 8. Manual onboarding

Keep the accepted product principle:

- first meaningful action <20 sec;
- first manual action starts/advances a primordial process;
- player should feel participation without clicker grind;
- passive/self-sustaining production <60 sec;
- after ~3 min manual contribution <=5% competent optimal income.

Do not preserve old cooldown constants just because they passed E/I simulation.

Tune the new process based on the new economy.

---

# 9. UI changes

For reconciled ruleset:

- top resources use RNA/DNA reveal order;
- remove Information counter;
- remove Chemical Gradient/Catalytic Fold/Energy Pocket purchase cards;
- display current biological process/action clearly;
- retain objective panel/CTA/highlight behavior;
- show replication visual feedback;
- show DNA reveal;
- show membrane visual state;
- Cell milestone transitions cleanly;
- dev tools remain dev-only.

Do not do full production UX redesign in this task.

---

# 10. State/save migration

Update normalized state/config examples as needed while preserving save architecture.

Requirements:

- state stays JSON-serializable;
- no duplicate legacy/canonical authoritative copies;
- save/load equality for a mid-slice reconciled run;
- corrupt save recovery unchanged;
- autosave unchanged;
- old ruleset behavior explicitly handled;
- meta/settings preservation tested if run restart is used.

---

# 11. Tests

At minimum update/add:

## Config

- reconciled resource IDs valid;
- old molecular producers absent from v2 ruleset;
- M graph reachable;
- M04 optional;
- Goal refs valid.

## Domain

- primordial process produces RNA;
- passive RNA unlocks;
- M02 changes replication behavior;
- DNA locked before M03 and unlocked after;
- M05 prerequisite works without M04;
- M06 Cell transition works;
- Biomass hook/resource unlock works;
- no Information spend path.

## Goal Engine

- G001→G005 sequence;
- rewards exactly once;
- stalled state does not re-emit starts;
- CTA targets valid.

## Save

- mid-slice save/load;
- recovery regression;
- old-ruleset policy;
- no guessed semantic conversion.

## UI smoke

- no obsolete labels/cards;
- CTA focus works;
- dev tools hidden in production.

---

# 12. Headless simulation

Keep at least four profiles:

1. competent/reference;
2. optimized;
3. slower/non-optimal;
4. optional M04 route.

Initial acceptance windows:

```text
first meaningful action <00:20
passive/self-sustaining RNA <01:00
M02 Self Replication ~02:00–03:00
M03 DNA visible ~04:00–06:00
M06 Cell ~09:00–11:00
```

M04 should create a meaningful tradeoff but not be automatically required or always fastest.

Record:

- completion times;
- process/resource rates;
- manual contribution share;
- spending/upgrade choices;
- final state before Cell.

---

# 13. Balance strategy

This is a new content/ruleset pass, so do not constrain changes to old ±5–10% telemetry patch sizes.

Tune in this order:

1. process base output/speed;
2. individual node requirements;
3. one-time grants/unlocks;
4. optional-node effect;
5. only then any growth/scaling mechanism if actually used.

Avoid hidden catch-up as the primary way to hit targets.

The player should understand why progress accelerates.

---

# 14. Required commands before reporting done

Run the repository's relevant gates, including at minimum the equivalents of:

```text
npm test
npm run test:sim
npm run test:ui
npm run smoke
npm run build
```

If command names changed, use the current repository equivalents and report them explicitly.

---

# 15. Definition of Done

This rework is done only when:

- reconciled 0–10 is playable from fresh run through Cell;
- no canonical E/I molecular UI remains;
- tests pass;
- save/recovery regressions pass;
- competent/optimized/slower/M04 simulation profiles pass;
- timing falls inside the accepted initial windows or deviations are explicitly justified;
- manual contribution is non-dominant after ~3 min;
- old ruleset handling is explicit;
- no Iteration 4 content was started.

---

# 16. Final report format

Return:

1. summary of changed modules;
2. chosen early process model;
3. old-ruleset migration/restart policy;
4. new resource/node/goal mapping;
5. simulation timing table for all four profiles;
6. manual contribution measurement;
7. test/build results;
8. known issues/TBD balance values;
9. exact commit SHA;
10. explicit statement: `Iteration 4 not started`.

Then STOP for manual playtest/user review.