# Хроники Эволюции — Великий фильтр, ending «Пепел» и первый reset

**Документ:** DS-02 / reconciliation revision 2.0  
**Статус:** canonical ending/reset contract.

---

# 1. Canonical final act

The final act remains one of the strongest accepted late-design systems and is preserved.

Corrected pacing:

- Modern bridge: ~132–140 min;
- Atomic preparation: ~140–168 min;
- Atomic Age / Great Filter: ~168–180 min;
- Ash: ~177–183 min;
- Archive/reset: immediately after Ash.

The first Ash remains unavoidable.

---

# 2. Entering Atomic Age

Required conceptually:

```text
Scientific Method
+ Atomic Theory
+ tangible Reactor/Lab project
+ late-civilization readiness condition
→ Atomic Age
```

On transition:

```text
stability = 100
crisis_clock = 0
crisis_active = true
```

Also trigger:

- milestone `МЫ РАСКОЛОЛИ МАТЕРИЮ`;
- Archive line `Снова.` followed by correction;
- Destiny Goal → Great Filter;
- World Tension UI.

No old biological resource conversion or `Sapience 46` assumption participates in this phase.

---

# 3. Stability / World Tension

One state:

```text
Stability: 0..100
World Tension = 100 - Stability
```

UI uses World Tension.

Internal balance uses Stability.

The exact drain coefficients remain configurable and must be regression-tested after full 0–108 rebalance.

---

# 4. Crisis timing rules

Keep the dramatic clamp concept:

- Ash cannot trigger immediately after Atomic Age;
- player must see at least the major crisis beats;
- first-run offline progression freezes the crisis clock/drain;
- maximum crisis duration remains around 8 minutes unless later playtest changes the narrative pacing.

Historical v1 values `435 sec minimum / 480 sec maximum` remain the preferred starting point for regression testing, not immutable design law.

---

# 5. Crisis phases

## C0 — Atomic euphoria

Peak civilization visual state; production surge may remain if explicitly balanced.

## C1 — Warnings

World Tension becomes readable; bloc conflict event.

## C2 — Systemic risk

False-warning event; optional crisis-response nodes.

## C3 — Critical phase

Player can improve Stability/reward/understanding, but cannot cancel first Ash.

## C4 — Last Protocol

Mandatory final decision before cinematic.

---

# 6. Crisis choices

Keep:

- bloc conflict choices;
- false-warning choices;
- optional resilience/science/strategic responses;
- Last Protocol.

Good play may improve:

- Stability at final protocol;
- crisis bonus;
- Archive reward within allowed envelope;
- Chronicle;
- ending subtype;
- persistent flags.

Good play does not change the first ending ID.

---

# 7. Ending ID and subtypes

Canonical ending:

```text
ENDING_ASH
```

Last Protocol variants:

- retaliate → `ash_fire`;
- disarm → `ash_too_late`;
- delegate_system → `ash_system`.

All variants converge into Ash while preserving different narrative/meta traces.

---

# 8. Ending cinematic

Sequence remains:

1. Last Protocol confirmed;
2. short visual pause;
3. white flash;
4. audio collapse/silence;
5. V8 Ash world;
6. `ЦИВИЛИЗАЦИЯ №1 ЗАВЕРШЕНА`;
7. `ПЕПЕЛ`;
8. subtype/epitaph;
9. CTA `Сохранить в Архив`.

No ad may interrupt between Last Protocol and first Ash result.

---

# 9. Archive Summary

Summary keeps four semantic blocks.

## World

- Timeline ID;
- duration;
- peak Population;
- era reached;
- ending/subtype.

## Species

Now records restored biological profile:

- primary trait: Absorption / Symbiosis / Shell;
- optional metabolic adaptations;
- AP adaptations;
- behavior strategy;
- Cognition/Sapience path;
- visual archetype.

Do not show obsolete primary metabolism branch `Photosynthesis/Chemosynthesis/Absorption` as the canonical first choice.

## Civilization

- cultural/profile choices;
- settlement profile;
- governance;
- city/industry profile;
- Energy Crisis path;
- Modern/Atomic specialization.

## Filter

- minimum Stability;
- crisis choices;
- crisis responses;
- Last Protocol;
- crisis bonus.

---

# 10. Archive reward

Use Archive Fragments as the single spendable first prestige currency.

Target remains:

```text
14–18 AF typical first reset
```

Reward application must be idempotent.

The old exact formula can be retained only after thresholds are revalidated against:

- changed evolution node count;
- changed Population scale;
- corrected crisis bonus.

Until then the formula is config/provisional, while the reward envelope is canonical.

Ads/meta cannot multiply mandatory first-reset AF.

---

# 11. Reset semantics

Preserve:

### Saved

- Archive Fragments;
- Archive nodes;
- Chronicle;
- achievements;
- discovered records;
- persistent narrative flags;
- ending history;
- allowed retained traits.

### Reset

- run resources;
- Population;
- buildings;
- ordinary technologies;
- AP;
- current Timeline branch selections unless meta explicitly preserves them.

Reset is the completed history of a civilization, not failure.

---

# 12. Idempotent reset

DS-03 reset architecture remains fully accepted.

Reset transaction must:

- create immutable Timeline Summary;
- calculate permanent reward once;
- write persistent flags/Chronicle once;
- create next run candidate;
- commit through recoverable save flow;
- use stable transaction ID;
- be safe to retry without duplicate AF or Chronicle entries.

---

# 13. Timeline #2 teaser

After reset:

> Архив помнит.

> Мы можем изменить результат.

Timeline #2 starts with restored biological progression, accelerated by Archive systems.

It is not a return to the obsolete Energy/Information molecular economy.

---

# 14. What reconciliation changed here

Changed:

- final-act entry now follows restored Modern/Atomic bridge;
- species summary uses restored biological branches/AP/Cognition;
- AF formula thresholds are marked for revalidation.

Kept:

- Stability/World Tension;
- crisis clamps;
- unavoidable first Ash;
- Last Protocol;
- Archive Summary;
- AF envelope;
- Chronicle;
- idempotent reset;
- Timeline #2 teaser.

---

# 15. Implemented first-run transaction

`A04 Atomic Age` initializes `run.crisis` with Stability 100 and an
active-play clock. `EV-CR-01`, `EV-CR-02` and `EV-CR-03` are queued in phase
order; a Last Protocol choice writes `ENDING_ASH` plus one of
`ash_fire`, `ash_too_late` or `ash_system`, and closes ordinary input.

The Archive CTA then uses the existing canonical reset transaction ID. It
writes one ending Chronicle record and a bounded 14–18 AF award, then creates
the next active run without duplicating a transaction on retry. The AF formula
and crisis coefficients are provisional pending balance; idempotency and the
reward envelope are not.
