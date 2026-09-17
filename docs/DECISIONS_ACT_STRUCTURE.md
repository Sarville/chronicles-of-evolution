# Хроники Эволюции — Act Structure Redesign Decisions

**Date:** 2026-09-17
**Status:** accepted design direction; exact timing and scenario text pending
**Authority:** this document supersedes `DEC-023` and `DEC-024` in `docs/DECISIONS.md`
wherever they define Timeline #1 as one 105–180-minute RNA→Ash run and gate `T2`
behind full `T1-7` regression. It supersedes sections 3–6 of
`docs/gdd/12_LONG_TERM_PROGRESSION_AND_RESET_ROADMAP.md` (time budget table,
`T1–T5` epoch map, `P1–P3` world-cycle description). `docs/production/
TIMELINE_01_REBUILD_PLAN.md` and `docs/scenario/*` are not rewritten yet — this
document is what the rewrite must follow.

Origin: design discussion in session
`https://claude.ai/code/session_011juGDUVyJ5oDnu4kF1w8Do`, 2026-09-17.

---

## ACT-001 — Three-act macro structure

### Decision

The product is restructured into three acts instead of one long Timeline #1
followed by a slow reset-epoch ladder:

1. **Act 1 (`T1–T5`, target ~3–4h total active time)** — five short, connected
   attempts at the same civilization arc (Molecular → Atomic), each ending
   earlier than a full run and failing for a different, causally-linked reason.
   Teaches the reset ritual, the Archive, and the shape of the game's
   mechanics without exposing full depth.
2. **Act 2 (`P1–P3`, ~20–40 min each)** — the Archive tries a shortcut: instead
   of growing a civilization from zero again, the player is dropped into an
   already-mature but structurally lopsided civilization (overspecialized in
   one axis) and watches/steers it toward its specific collapse. One is
   mandatory, the rest optional, reward/achievement-driven.
3. **Act 3 (open-ended)** — after any Act 2 attempt, the Archive concludes
   that neither "slow from zero" nor "shortcut from a finished civilization"
   works, and unlocks the full mechanic set: the original Evolve's systems
   (multi-currency prestige, races/traits, universes, challenge modifiers,
   ARPA-equivalent tech, later resets) adapted to the new UI/UX, not ported
   literally. This is the actual long-term/infinite-progress loop the product
   promises in `docs/PRD.md`.

### Reason

Session discussion concluded that gating all horizontal content (species,
worlds, trait variety) behind ~12h of vertical progression (old `T1–T5`) and
fully behind ~30h (old `U1+`) was an unjustified pacing choice, not a
necessity — see the design conversation transcript in the session linked
above. The old ladder repeated the same full-length arc five times with only
incremental additions per Timeline (per the old anti-repetition rule in
`12_LONG_TERM_PROGRESSION_AND_RESET_ROADMAP.md:63-71`); the new structure
reuses the same already-implemented content but slices it at different
depths instead of replaying it in full each time.

---

## ACT-002 — Act 1: five-chapter causal chain

### Decision

`T1–T5` keep their names but change scope. Each chapter is a short run ending
at a specific era cutoff (era numbers per `src/chronicles/config/eras.js`),
reusing the already-implemented `T1-0…T1-6` packages sliced at that depth.
Each chapter's starting condition is presented as the Archive's direct fix for
the previous chapter's cause of death, and that fix creates the next chapter's
new vulnerability:

| Chapter | Era cutoff | Starting condition (fix for previous death) | New vulnerability it creates | Collapse cause | Reused package | Species/skin swap |
|---|---|---|---|---|---|---|
| T1 — Origin | 5 — `TRIBE` | none (baseline attempt) | dense tribal living, no epidemiology answer | Epidemic | `T1-0…T1-3` | no |
| T2 — Одиночки | 6–7 — `SETTLEMENT` | dispersed/non-clustering lifestyle | scattered groups can't coordinate collective defense | Cataclysm (unstable planet/quake) | `T1-3…T1-4` (truncated) | **yes — swap #1**, skin only, full traits deferred to Act 3 |
| T3 — Крепость | 8 — `CITY` | early defensive structures/tech granted from the start | safety re-concentrates population; close-quarters tension returns | Social fracture / mutation-driven internal conflict | `T1-4` (truncated) | no — same lineage, new starting tech |
| T4 — Большой мозг | 9–10 — `INDUSTRY/MODERN` | higher baseline Cognition, earlier Writing/culture | smarter civilization outruns its ability to manage its own technology | Techno-catastrophe (industrial/automation disaster) | `T1-4…T1-5` (truncated) | **yes — swap #2**, skin only |
| T5 — Синтез | 12 — `ATOMIC` + Great Filter | Archive intervenes directly, blends lessons from T1–T4; returns to the original lineage (swap budget spent) | — | **Great Filter / mandatory first Ash** — already-implemented `T1-6` content, now framed as the payoff of four prior "fixable" failures vs. one unfixable existential one | `T1-5…T1-6` (near-unchanged) | no |

Only two species/skin swaps happen across all five chapters (T2, T4) — the
other three chapters differentiate by starting tech/condition, not by
changing the playable species. Swapped skins pull cosmetic/flavor only
(labels, 1–2 flavor abilities); full trait/perk depth for those species is
reserved for Act 3.

### Timing

Target ~3–4h total for all five chapters combined; `T1` ~20 minutes as the
introductory chapter. Exact per-chapter minute budgets are **not** decided
yet — they are computed after Act 1 is implemented and played, not designed
upfront (see ACT-006).

### Currency

A single unified currency (working name: Archive Fragments, per existing
`docs/gdd/09_ENDINGS_AND_RESET.md`) is awarded after every reset in Act 1 and
Act 2, spent on light upgrades/perks. It does not fragment into the original
game's multi-currency set (Plasmid/Phage/Dark/Harmony/Artifact/Supercoiled/
AICore-equivalents) until the Act 3 transition.

---

## ACT-003 — Act 2: pre-built lopsided civilizations

### Decision

`P1–P3` (name TBD — no longer "Worlds" world-cycles in the old sense) are
short (~20–40 min) runs starting from an already technologically mature but
deliberately unbalanced civilization: one axis overdeveloped, others
neglected. Examples from the design discussion:

- all-diplomacy civilization — peaceful, stagnant, collapses from stagnation/lack of drive;
- all-military civilization — strong, aggressive, collapses by destroying itself through internal conflict;
- all-scholar civilization — deeply advanced in abstract knowledge (space theory etc.), collapses from neglecting basic subsistence (starvation).

One `P` is mandatory to progress; the rest are optional, reward/achievement-driven.
Mechanically these reuse existing tech-tree branch/specialization content
(biased starting jobs/government/tech weighting) rather than requiring new
systems — consistent with the earlier finding that the original tech tree has
few true exclusive forks and is mostly additive/checklist-shaped; Act 2 turns
that property into content instead of working around it.

### Transition trigger

After completing any `P` run, the Archive concludes that neither "slow from
zero" (Act 1) nor "shortcut from a finished civilization" (Act 2) solves the
underlying problem, and opens Act 3.

---

## ACT-004 — Act 3: adapted original Evolve

### Decision

Act 3 is where the systems catalogued in the old `12_LONG_TERM_
PROGRESSION_AND_RESET_ROADMAP.md` §6 ("Судьба механик оригинального Evolve")
actually become available — races/traits, the full multi-currency prestige
loop, universes/challenge modifiers, ARPA-equivalent permanent unlocks, and
the full catalogue of reset/ending types — but adapted to the new UI/UX
(progressive disclosure, chapter-based goals), not a literal port of the
original DOM/menus. This constraint already existed for Timeline #1
(`docs/production/TIMELINE_01_REBUILD_PLAN.md:37`, "не входит: буквальный
перенос legacy DOM") and is explicitly extended to apply to this later layer
too, since this is where the original's complexity is heaviest and the
adapter's job matters most.

---

## ACT-005 — Reuse of existing implementation

Existing packages `T1-0` through `T1-6` (`docs/PROJECT_STATE.yaml:157-166`,
status `implemented_pending_manual_playtest`) are not discarded. They map
onto the new chapters as shown in the ACT-002 table and are the starting
point for the rework: slice at the new era cutoffs, add the per-chapter
starting condition and collapse event, reskin twice (T2, T4). This is
expected to reuse the large majority of already-built mechanical content
(event engine, jobs/production, goal engine, save/reset transaction).

---

## ACT-006 — Open questions (not decided yet)

- Exact per-chapter minute budget within the ~3–4h Act 1 total — computed
  after implementation and playtest, not designed upfront.
- Whether "Bioseed" as a named concept/ending survives in some form, or the
  Act 2→Act 3 transition replaces it entirely — old `DEC-023`'s "first
  Bioseed in 8–12h" no longer applies as written and needs an explicit
  replacement statement.
- Exact mechanical shape of the T2/T4 species skin swap (how much is reused
  from the future Act-3 race system vs. bespoke flavor content).
- Naming for the `P1–P3` act/tier (currently a placeholder).
- Full rewrite of `docs/scenario/*` narrative scripts to match the five new
  chapter endings — not started.

---

## ACT-007 — Documents requiring rework

- `docs/gdd/12_LONG_TERM_PROGRESSION_AND_RESET_ROADMAP.md` — sections 3–6 to
  be rewritten around this act structure.
- `docs/production/TIMELINE_01_REBUILD_PLAN.md` — work-package table and
  gates assume the old single-Timeline scope; needs a full rework once Act 1
  chapter design is finalized.
- `docs/scenario/*` — written for the old single 180-minute arc; needs
  per-chapter rewrite (see ACT-006).
- `docs/gdd/07_GOALS_AND_MILESTONES.md` — `G001–G019` milestone timings are
  tied to the old pacing and will need remapping to the new chapter cutoffs.
- `docs/TODO.md` — `T1-4` onward execution order superseded; see pointer note
  added there.

Old documents are kept in place (not deleted/moved) as historical record,
per this repo's existing convention (`DECISIONS_RECONCILIATION.md` does the
same for what it supersedes).
