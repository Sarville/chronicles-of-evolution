# Хроники Эволюции — Meta progression

**Документ:** DS-04 / reconciliation revision 3.0
**Статус:** canonical meta semantics for Act 1-2 (Archive Recall perks);
Act 3 currency semantics (§2) canonical, exact numbers provisional.

---

# 1. Meta principles

Archive remains a major accepted improvement.

**Corrected 2026-09-18** (supersedes this doc's prior revision, which
treated Archive Fragments (AF) as "the only spendable prestige currency of
the first meta loop" and had every `T1-T5` ending grant AF): Act 1 and
Act 2 carry **no spendable currency at all**. The only thing that survives
a reset inside Act 1/Act 2 is Archive Recall perk unlocks (§4). AF and the
rest of the original game's multi-currency set (Plasmid/Phage/Dark/
Harmony/Artifact/Supercoiled/AICore-equivalents) start accumulating only
once Act 3 opens — see `docs/DECISIONS_ACT_STRUCTURE.md` ACT-002
"Currency" subsection for the decision record.

Meta progression must:

- make each successive Act 1 attempt (`T1-T5`) and, later, each Act 2
  replay meaningfully faster than the one before, driven entirely by
  Archive Recall perk unlocks, not by a currency purchase;
- preserve familiar gameplay rather than skip it automatically;
- never invalidate first-run balance;
- never require ads;
- never grant AF or any other currency before Act 3 is reached.

The corrected biological canon is RNA/DNA/Cell/AP/Cognition. Meta must adapt to that vocabulary.

---

# 2. Permanent system

Two permanent layers now exist, scoped to different acts — do not conflate them:

**Act 1-2 layer — Archive Recall perks (§4).** No currency, no shop. Perks
are granted directly by chapter/attempt endings and by Archive-mode
replays (§4.6). This is the only progression that survives a reset before
Act 3.

**Act 3 layer — Archive Memory.** Unlocked once Act 3 opens. Includes:

- Archive Fragments (AF);
- Archive Tree;
- persistent discovery;
- Chronicle;
- ending history;
- achievements;
- persistent narrative flags;
- retained traits;
- hybridization permissions;
- future Archive Intervention upgrades.

AF becomes the spendable prestige currency of this loop specifically — not
before, and it does not retroactively apply to Act 1/Act 2.

---

# 3. Chapter reset rewards (Act 1-2)

No AF anywhere in Act 1-2. Each chapter ending grants perks only:

**`T1-T4` endings** each grant:

- one cosmetic defense perk against that chapter's own collapse cause,
  applied automatically going into the next chapter — flavor only, since
  the same collapse structurally cannot refire anyway (its collapse goal
  is simply absent from any later chapter's own goal set, see
  `docs/gdd/13_ACT_ONE_CHAPTERS.md` §5 / `[[act1-recap-goal-granularity]]`);
- a choice of 1 of that chapter's 3 not-yet-unlocked Archive Recall style
  perks (§4.2) — permanent once picked, that slot is never re-offered on a
  first playthrough.

**`T5`'s ending** grants a choice among its 3 permanent endgame perks
instead (§4.4) — no defense perk, since the first `Ash` is mandatory by
design, nothing to protect against.

Hard rules:

- idempotent grant (unchanged from the old reset-transaction contract —
  `docs/gdd/09_ENDINGS_AND_RESET.md` §12);
- perk unlocks never require ads;
- perks survive every future reset, including the eventual transition into
  Act 3.

The old "14-18 AF typical" first-reward envelope and the old `T1-T4`
per-chapter AF ranges (`docs/gdd/09_ENDINGS_AND_RESET.md` §10,
`docs/gdd/13_ACT_ONE_CHAPTERS.md` §6) are retired along with AF itself for
these acts. Act 3's own entry reward is a separate, not-yet-designed
question — out of scope here.

---

# 4. Archive Recall

Archive Recall is no longer a single automatic global modifier (the old
"cost ×0.75 / production ×1.25 on familiar progression" formula). It is a
set of permanent, stacking perks earned per chapter: first offered as a
choice of 1 of 3 on that chapter's own ending, with the other two
recoverable later via Archive-mode replay (§4.6).

Semantic contract (unchanged in spirit from the original design intent):

- acts only on familiar progression the player has already lived through;
- never completes core milestones automatically;
- does not auto-select branches;
- does not unlock unknown optional adaptations;
- each perk targets a *specific* mechanical range or named milestone (e.g.
  the RNA→Tribe range, or Cognition specifically), so it keeps paying off
  in every later chapter/replay that passes back through that same range
  — this is the actual mechanism behind "each successive attempt is
  faster than the last."

## 4.1 The three axes

Every `T1-T4` chapter offers the same three axes on its own new mechanical
range — three different mechanisms for the same order of acceleration, so
the choice is genuinely about playstyle, not about picking the strongest
option:

- **Авто/пассив** — something now happens without player input;
- **Вложение/постройка** — investing (building more of something) pays
  off more;
- **Эффективность** — the same actions cost or require less.

## 4.2 `T1-T4` perk table

| Глава | Защита (авто, косметика) | Авто/пассив | Вложение/постройка | Эффективность |
|---|---|---|---|---|
| `T1` | — (первая попытка, нечего защищать) | Резонанс молекул: пассивное производство RNA/DNA ×1.5 | Нулевая задержка: кулдаун ручного клика −90% | Дешёвый онтогенез: цена первых biological breakthrough ×0.75 |
| `T2` (после Мор) | Карантинный протокол | Самообслуживающиеся хранилища: кап склада растёт сам с населением/эрой | Крупная тара: кап склада за постройку выше | Дешёвая застройка: цена построек Settlement-эпохи ×0.75 |
| `T3` (после Катаклизм) | Сейсмоусиленные опоры | Самоорганизация: простаивающие рабочие авто-назначаются; рабочий, чей ресурс упёрся в кап хранилища, авто-перераспределяется на другую работу | Ускоренное строительство: цена/время построек крепости ×0.75 | Единство раньше: policy-lite порог/бонус к Stability открывается раньше |
| `T4` (после Раскол) | Единый протокол согласия | Фоновые процессы: производственные здания Industry/Modern сохраняют ~25% выпуска без назначенных рабочих | Форсированное производство: industry-output ×1.25 | Быстрое обучение — см. §4.3 |

Each cell in the three style columns is a separate, independent unlock.
The first one comes from that chapter's own ending; the other two come
from Archive-mode replays of that same chapter (§4.6). Once unlocked, all
of a chapter's unlocked perks stack simultaneously, and apply everywhere
their target range recurs across Act 1 *and* Act 2 — a `T1` perk targeting
RNA→Tribe also speeds up `T2-T5`'s own recap of that same range.

## 4.3 `T4` Эффективность — "Быстрое обучение" (worked example)

Targets two specific named milestones, each relieved by ~45% of its total
requirement — same ratio, deliberately different mechanism, because the
two milestones are structurally different:

**Cognition** (`src/chronicles/config/goals.js` `G011_COGNITION_TRACK`,
condition `cognition_at_least: 100`, a weighted sum of 4 contributors:
`B04` Nervous Tissue 20, `B05` Nervous System 25, `N03` Neural Complexity
30, `N05` Proto-language 25) — the perk auto-grants `B04` + `N05` (45 of
100) for free; the player still completes `B05` + `N03` (55 of 100) live.
Keeping `B05`/`N03` live (the majority) satisfies §8's "core
nervous-system route alone must provide most of the required progress"
rule — this was a deliberate pick, not just "the two smallest."

**Письменность** (`src/chronicles/config/nodes.js` `T09`→`T10`, two
sequential cost gates, not a weighted sum: `T09` costs food 2100 /
materials 1150 / knowledge 390 + population 14 + 3 buildings; `T10` costs
food 2700 / materials 1450 / knowledge 520) — the perk applies a flat
×0.55 cost multiplier to **both** `T09` and `T10`, rather than skipping
one gate outright. A full skip of `T09` was considered and rejected: it's
a fixed, one-off saving that doesn't grow with the rest of the stacked
perk set, and its relative value shrinks every time the surrounding
economy gets faster from other unlocked perks. The ×0.55-on-both-gates
version behaves like every other efficiency perk on this page — a
percentage that keeps compounding with the rest of the stack instead of a
flat, non-scaling one-off.

Exact 45%/×0.55 numbers are a starting point, not final — ordinary
balance pass after implementation, like every other number on this page.

## 4.4 `T5` — permanent endgame perks

`T5`'s ending offers a choice among 3 permanent perks instead of the
`T1-T4` pattern — no defense perk (the first `Ash` is mandatory by design):

- **Производство** — permanent bonus to base output;
- **Экспансия/Стабильность** — permanent bonus to caps/Stability reserve;
- **Познание** — permanent bonus to Cognition/tech-progression rate.

The first pick applies **immediately, live**, to whatever Act 3/endgame
run happens to be active at that moment (Act 1/2 Archive-mode and Act 3+
run in parallel and switch freely — §4.6) — it does not wait for the next
Act 3 entry. Archive-mode replays of `T5` recover the other two; once all
3 are unlocked they all **stack simultaneously** (they are not mutually
exclusive, unlike the `T1-T4` pattern's per-slot picks). Once all 3 exist,
every further `T5` completion no longer grants anything new — instead it
increases their numeric magnitude, subject to the anti-snowball ceilings
in §7. The exact scaling curve (soft cap / diminishing returns per
completion) is not designed yet — open work, tracked in `docs/TODO.md`.

## 4.5 Why the collapse timers are safe from this

Every `T1-T4` collapse fires on a hidden, fixed timer, not on a resource
threshold (`[[chapter-collapse-timer-mechanic]]`). Stacking Archive Recall
perks cannot let the player skip a chapter's own collapse — it only frees
more time within that chapter's fixed budget for genuinely new content
before the timer expires, which is the intended effect.

## 4.6 Archive-mode (parallel replay)

Available once Act 1 is completed for the first time (and, once Act 2 has
its own perk table designed, once Act 2 is completed too). It is a full,
real-time replay of `T1-T5` (or later, a `P`), using whatever perks are
already unlocked going in — not a shortcut picker that skips content.
Each successive Archive-mode run is faster than the last purely because
more perks are already stacked, right up until every `T1-T4` slot for
that act is full; after that, further `T5` completions only feed the §4.4
numeric scaling, so the mode stays useful indefinitely.

Archive-mode grants zero currency of any kind, consistent with §1 — there
is no currency before Act 3, so there is nothing else for it to grant.
Its only reward is perk progress. It is freely switchable with the main
Act 3+ run at any time, and a perk unlocked or upgraded inside Archive-mode
applies to the Act 3+ run immediately and live, not on the next entry.

Act 2's own equivalent (replaying `P1-P3` for their own perk set) is
explicitly out of scope until Act 2 has its own perk table designed —
`P1-P3` don't have one yet
(`docs/gdd/12_LONG_TERM_PROGRESSION_AND_RESET_ROADMAP.md` §6/§10).

---

# 5. Superseded: the generic `AR01-12` tree

The prior generic, AF-purchased Archive Tree (`AR01-AR12` across 3 tiers)
is superseded by the concrete per-chapter table in §4 — there is no AF to
spend on it in Act 1-2 anymore. Two groups of concepts from the old tree
are **not** covered by the new per-chapter perks and are deliberately left
undecided rather than deleted:

- **Retained trait / hybridization** (old `AR05`/`AR06`/`AR09` — keep one
  discovered optional biological node across a reset; later unlock a
  numerically-active secondary primary trait). This may belong to Act 3's
  races/traits system (`docs/gdd/15_ACT_THREE_SYSTEMS.md`) instead of
  Archive Recall — needs its own decision, not assumed here.
- **Crisis foresight / narrative-lock reduction / lore unlock / post-Ash
  route** (old `AR08`/`AR10`/`AR11`/`AR12`). Likely folds into ordinary
  Chronicle/achievement content rather than a dedicated perk slot, but
  this is also not decided.

---

# 6. Chapter pacing

Superseded by the concrete per-chapter target-budget table in
`docs/gdd/13_ACT_ONE_CHAPTERS.md` §3 (`T1` ~20 min … `T5` ~40 min) and the
entry-point/compression breakdown in its §4. This page intentionally no
longer states its own pacing numbers, to avoid two sources of truth
drifting apart.

---

# 7. Meta caps

Keep anti-snowball philosophy. These ceilings bound how far a fully
stacked Archive Recall perk set (§4) — not just a single automatic
modifier — may push production/cost/Stability. Recommended ceilings
remain starting guardrails:

```text
pre-Sapience meta production/process multiplier <= 1.60
Tribe/Settlement <= 1.35
City <= 1.25
Industry/Atomic <= 1.15
offline efficiency <= 0.75
```

Familiar core effective requirement/cost floor remains around:

```text
>= 70% canonical
```

Exact interpretation for non-price condition milestones (for example
Cognition) must use explicit per-system rules rather than a fake universal
cost multiplier — §4.3's Cognition/Writing split is the concrete example.

---

# 8. Cognition and meta

Archive must not simply grant `+100 Cognition`.

Allowed meta effects:

- earlier access to familiar Cognition contributors;
- modest contribution bonus from retained sensory/social/tool traits;
- faster familiar neural-development requirements.

Guardrail:

> Sapience still requires the player to pass through the Cognition phase
> and make at least one meaningful behavioral/evolutionary choice.

§4.3's Cognition perk (auto-grant 45 of 100, leave the core 55 live) is
the concrete instance of this rule in the current design.

---

# 9. Adaptation Points and meta

AP remain run-local.

Archive may:

- retain an OPTIONAL adaptation (see §5's deferred retained-trait note);
- later increase flexibility of AP loadout;
- unlock hybrid combinations.

Archive must not create passive AP generation or permanent AP farming.

---

# 10. Archive Intervention

Independent of the AF removal in §1 — this envelope was never AF-funded
to begin with. Keep accepted envelope:

- optional temporary acceleration;
- one eligible resource/process target;
- no stacking;
- base around 120 sec;
- hard duration <=180 sec;
- <=3 stored charges;
- multiplier <=1.50.

Cannot target:

- AF;
- Population directly;
- Stability/World Tension;
- crisis timer;
- Cognition directly.

For restored early biology, eligible targets may include RNA/DNA/Biomass/Energy production processes where appropriate.

---

# 11. What remains accepted

Keep:

- anti-snowball caps;
- retained optional node (deferred, §5);
- hybridization progression (deferred, §5);
- crisis foresight (deferred, §5);
- ads outside baseline;
- offline caps;
- Archive Intervention envelope;
- each Act 1 chapter must feel different from the last, not just globally
  faster.

Reconciled 2026-09-18:

- removed AF/currency entirely from Act 1-2 (§1-3);
- replaced the single automatic Archive Recall modifier with the
  per-chapter, player-chosen, stacking perk system (§4);
- superseded the generic `AR01-12` tree (§5);
- retired this doc's own pacing numbers in favor of
  `13_ACT_ONE_CHAPTERS.md` §3 (§6).
