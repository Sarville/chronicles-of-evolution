# Хроники Эволюции — Act 1: пять концовок и переход между главами

**Документ:** DS-02 / act-structure revision 3.0
**Статус:** canonical reset/ending contract для всех пяти глав `T1–T5`;
`T5`/`Ash`-специфика (§2–15) реализована, `T1–T4`-специфика — новый scope
этой ревизии.
**Authority:** `docs/DECISIONS_ACT_STRUCTURE.md`, `docs/gdd/13_ACT_ONE_
CHAPTERS.md` §6.

> Этот документ описывает **общий reset-паттерн**, разделяемый всеми пятью
> главами Act 1: shared cinematic beats, ending card, Archive Summary,
> idempotent reset transaction, forbidden CTA wording (никогда `Game Over`/
> `Попробовать снова`). Конкретный визуал, ending ID/title/subtype и
> набор Archive Recall перков, который выдаёт эта конкретная концовка,
> отличаются по главе — см. таблицу в §10 и `docs/gdd/10_META_PROGRESSION.md`
> §4.2/§4.4 (**2026-09-18: нет никакой валюты/AF в Act 1-2, награда —
> только перки**). Секции 2–15 ниже описывают `T5`/`Ash` во
> всех деталях, т.к. это уже реализованный, самый глубокий из пяти
> case — читай их как образец полноты, которую `T1–T4` эндинги
> переиспользуют в упрощённом виде (§16–18).

---

# 1. Canonical final act (`T5` specifics)

`T5` остаётся сильнейшей из уже принятых late-design систем и сохраняется
почти без изменений — теперь как содержимое одной конкретной, последней
главы Act 1, а не всего продукта.

Corrected pacing (внутри `T5`, не всего Act 1):

- Modern bridge: ранняя часть `T5`;
- Atomic preparation → Atomic Age / Great Filter → Ash: остаток `T5`,
  target ~45–60 мин суммарно (`13_ACT_ONE_CHAPTERS.md` §3);
- Archive/reset: immediately after Ash.

The first Ash remains unavoidable — и остаётся единственным `Ash` за весь
Act 1: `T1–T4` заканчиваются каждая своим уникальным ending, ни один не
переиспользует `Ash`.

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

Canonical `T5` ending:

```text
ENDING_ASH
```

Last Protocol variants:

- retaliate → `ash_fire`;
- disarm → `ash_too_late`;
- delegate_system → `ash_system`.

All variants converge into Ash while preserving different narrative/meta traces.

## `T1–T4` endings (parallel table)

Same convergence rule — a chapter's collapse is unavoidable once its final
event fires; only subtype/reward/Chronicle vary.

| Глава | Ending ID | Title | Choice → subtype |
|---|---|---|---|
| `T1` | `ENDING_BLIGHT` | МОР | `isolate → blight_isolated` / `stay_together → blight_unified` / `healer → blight_early_medicine` |
| `T2` | `ENDING_CATACLYSM` | КАТАКЛИЗМ | `converge → cataclysm_converge` / `shelter_separately → cataclysm_scattered` / `old_experience → cataclysm_unprepared` |
| `T3` | `ENDING_FRACTURE` | РАСКОЛ | `suppress → fracture_suppressed` / `split → fracture_split` / `vote → fracture_deliberated` |
| `T4` | `ENDING_OVERLOAD` | АВАРИЯ | `manual_stop → overload_manual` / `reroute → overload_rerouted` / `trust_automation → overload_automated` (exact choice set narrowed by `run.chapter4.automation_pace`, see `08_EVENTS_AND_CHOICES.md` §23) |

Full event/goal contract for each — `08_EVENTS_AND_CHOICES.md` §23.

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

# 10. Archive Recall reward

**Corrected 2026-09-18:** no Archive Fragments, no currency of any kind,
anywhere in Act 1 or Act 2 — see `docs/gdd/10_META_PROGRESSION.md` §1-3.
Every ending in this document (`T1-T5`) grants Archive Recall perks
instead:

```text
T1 Мор:       choice of 1 of 3 T1 style perks (10_META_PROGRESSION.md §4.2)
T2 Катаклизм: defense perk (cosmetic) + choice of 1 of 3 T2 style perks
T3 Раскол:    defense perk (cosmetic) + choice of 1 of 3 T3 style perks
T4 Авария:    defense perk (cosmetic) + choice of 1 of 3 T4 style perks
T5 Ash:       choice of 1 of 3 permanent endgame perks (§4.4), no defense perk
```

The other two of each chapter's 3 style perks (and, for `T5`, the other 2
of its 3 endgame perks) are recovered later via Archive-mode replay
(`10_META_PROGRESSION.md` §4.6), not from this same first-playthrough
ending.

Reward application must be idempotent (unchanged).

Ads/meta cannot multiply or bypass a mandatory perk-choice grant.

---

# 11. Reset semantics

Preserve:

### Saved

- Archive Recall perk unlocks (`10_META_PROGRESSION.md` §4);
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
- be safe to retry without duplicate perk grants or Chronicle entries.

---

# 13. Timeline #2 / Act 2 teaser (`T5` only)

This section applies **only** after `T5`/`Ash` — the end of Act 1. `T1–T4`
endings transition into the next chapter of Act 1 instead; see §16.

After reset:

> Архив помнит.

> Мы можем изменить результат.

Timeline #2 starts with restored biological progression, accelerated by
whichever Archive Recall perks were unlocked during Act 1
(`10_META_PROGRESSION.md` §4) — not by any currency.

It is not a return to the obsolete Energy/Information molecular economy.

---

# 14. What reconciliation changed here

Changed:

- final-act entry now follows restored Modern/Atomic bridge;
- species summary uses restored biological branches/AP/Cognition;
- AF removed entirely from `T5`/`Ash` reward — replaced by a perk choice
  (§10, `10_META_PROGRESSION.md` §4.4) as of 2026-09-18.

Kept:

- Stability/World Tension;
- crisis clamps;
- unavoidable first Ash;
- Last Protocol;
- Archive Summary;
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
writes one ending Chronicle record and grants a choice among `T5`'s 3
permanent endgame perks (`10_META_PROGRESSION.md` §4.4 — no AF, as of the
2026-09-18 currency-removal), then creates the next active run without
duplicating a transaction on retry. Crisis coefficients are provisional
pending balance; idempotency and the perk-grant contract are not.

---

# 16. `T1–T4` chapter transitions (not the Act 1 → Act 2 teaser)

Each of `ENDING_BLIGHT` / `ENDING_CATACLYSM` / `ENDING_FRACTURE` /
`ENDING_OVERLOAD` uses a **compact** transition, lighter than `T5`'s full
cinematic — no white flash (reserved for `Ash`), no full Archive Summary
screen:

1. short world pause (1–2 sec) + local diorama dimming (not a white flash);
2. ending card: `ЦИВИЛИЗАЦИЯ №{N} ЗАВЕРШЕНА` / chapter title (`МОР` etc.);
3. one to two lines of Archive neutral summary (e.g. `Ответ на отклонение:
   изоляция.`);
4. that chapter's reveal line, if it has one — `T1`, `T3`, `T4` do, `T2`
   does not (§5B in `docs/scenario/05_NARRATIVE_FLAGS.md`);
5. CTA **Продолжить синтез**, leading straight into the next chapter's
   opening scene — no intermediate menu.

It does not show:

- `Мы можем изменить результат.` (reserved for the end of `T5`);
- the `СОЗДАТЬ НОВУЮ ЖИЗНЬ` CTA (reserved for the Act 1 → Act 2 transition);
- a full multi-section Archive Summary (World/Species/Civilization/Filter);
- a Timeline #2 / Act 2 teaser of any kind.

Full copy for all four transitions — `docs/scenario/06_ENDINGS_COPY.md`
§T1–§T4 and §0 (shared template).

The reset transaction itself is idempotent in the same sense as `T5`'s (§12):
one immutable per-chapter summary, one perk-choice grant (§10 for that
chapter — defense perk + 1 of 3 style perks, no AF), one Chronicle entry,
safe to retry without duplication. What differs
is only that "the next run candidate" this transaction creates is the next
chapter of the same Act 1 attempt, not a fresh Act 1 `T1`.

---

# 17. What this revision changed

Changed:

- scope: this document now covers reset/ending for all five Act 1 chapters,
  not only the former single-run `Ash`;
- four new ending IDs/titles/subtypes (§7);
- AF removed entirely, replaced by the Archive Recall perk-choice grant for
  every chapter including `T5` (§10, 2026-09-18);
- `T1–T4` endings transition into the next chapter, not into a Timeline #2 /
  Act 2 teaser (§16).

Kept, unchanged for `T5`:

- everything in §1–15 above describing `Ash` specifically;
- Stability/World Tension, crisis clamps, unavoidable first Ash, Last
  Protocol, Archive Summary shape, Chronicle, idempotent reset, Act 2
  teaser after `T5`.
