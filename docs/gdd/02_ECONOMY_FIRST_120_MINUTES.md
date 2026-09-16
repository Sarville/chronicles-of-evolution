# Хроники Эволюции — экономика первых 120 минут

**Версия:** reconciliation balance spec v2.3
**Статус:** canonical / biological 0–18 resource-flow, storage-cap and Cell-cost pass applied / later phases provisional
**Authority:** `DECISIONS_RECONCILIATION.md` + `01_FIRST_120_MINUTES.md`.

> Economy описывает **как сбалансировать утверждённый gameplay**. Она больше не может вводить новые visible resources, generators или progression nodes ради удобства симуляции.

---

# 1. Balance goals

Timeline #1 должен:

1. дать первое осмысленное действие <20 sec;
2. дать passive/self-sustaining process <60 sec;
3. убрать clicker dominance после первых 2–3 минут;
4. давать понятный payoff каждые 2–6 минут;
5. доводить до Sapience примерно к 38–40 минуте;
6. сохранить City около 80, Industry около 94–95, Atomic около 108;
7. приводить к Ash около 116–118 и reset около 120;
8. не требовать ads/offline/meta для первого прохождения.

---

# 2. Canonical milestone windows

| Milestone | Design target |
|---|---:|
| First passive RNA | <01:00 |
| Self Replication | ~02:00–03:00 |
| DNA unlocked | ~04:00–06:00 |
| Membrane / Cell | ~09:00–11:00 |
| First biological branch | ~11:00–14:00 |
| Multicellularity | ~24:00–28:00 |
| Nervous System | ~31:00–35:00 |
| Sapience | ~38:00–40:00 |
| Tribe established | ~48:00–50:00 |
| Permanent Settlement | ~62:00–65:00 |
| City | ~78:00–80:00 |
| Industry | ~93:00–95:00 |
| Modern bridge complete | ~103:00–104:00 |
| Atomic Age | ~107:00–108:00 |
| Ash | ~116:00–118:00 |
| Reset | ~120:00 |

These are telemetry targets, not hard timers except explicit crisis clamps.

---

# 3. Active resources

| Phase | Player-facing resources |
|---|---|
| 0–7 molecular | RNA |
| 7–12 cell formation | RNA / DNA |
| 10–18 cell/metabolism | RNA or DNA contextually / Biomass / ATP |
| 18–38 organism | DNA / Biomass / ATP + AP indicator |
| 38–80 civilization | Food / Materials / Knowledge / Population |
| 80–108 industry/modern | Food supporting / Materials / Knowledge / Power / Population |
| 108–120 crisis | Materials / Knowledge / Power + World Tension UI |

`Information` is not a spendable visible resource.

`Adaptation Points`:

- no passive income;
- no generator;
- no exponential producer curve;
- earned only from milestone/side-objective rewards.

`Population` is job capacity, not spendable currency.

`Stability` is internal 0–100 state; UI displays inverse World Tension.

---

# 4. Generic economy formulas kept

## Repeatable producer/building cost

```text
cost(n) = round_3sig(base_cost × growth^(n-1))
```

Use only where an entity is intentionally repeatable. Do not force every biological process into a repeatable-generator pattern.

## Production

```text
production/sec = base × local_mult × era_mult × event_mult
```

Count is included only for actual repeatable entities.

## Repeatable process milestone bonuses

Implementation currently supports count-based production milestone bonuses for repeatable processes/producers.
These bonuses are allowed only when they are player-facing and fiction-backed, not hidden math.
Milestone thresholds are producer-specific and data-driven. There are no implicit global `10/25/50` bonuses.

Design finding from the 0–10 playable rework:

- the `10` count threshold should read as a qualitative process transition, not as an arbitrary multiplier;
- `25` and `50` are not canonical biological 0–10 milestone thresholds;
- biological process bonuses need scenario names such as reaction network, shared template pool or genetic assembly chain;
- every future repeatable biological process with milestone bonuses needs its own narrative justification;
- if a process cannot be explained as a real qualitative transition, disable its milestone bonus instead of keeping a silent multiplier.
- `×2 @ 10` was tested and rejected for biological 0–10 because milestone-seeking reached Cell far too early.

Current early examples:

| Process | Threshold | Multiplier | First milestone interpretation |
|---|---:|---:|---|
| Primordial Reaction | 10 | ×1.15 | isolated reactions link into a cooperative RNA reaction network |
| RNA Replication | 10 | ×1.15 | copies reinforce a shared template pool |
| DNA Synthesis | 10 | ×1.15 | synthesis stabilizes into a reusable genetic assembly chain |

## Manual onboarding

Manual actions are a generic data-driven framework:

- an action may grant a resource or convert one resource into another;
- each action declares its own availability gate, cooldown, input cost and reward resource;
- future rewarded multipliers may scale the reward through the same domain command, but ads are not part of baseline first-run balance;
- passive production remains the primary economy.

Current biological 0–10 manual actions:

| Action | Availability | Effect | Intent |
|---|---|---|---|
| Primordial reaction | start | RNA grant equal to max(`1`, `1.5s` of current RNA production), affected by early manual-gain modifier | onboarding / first push |
| Manual DNA Synthesis | after M03 | convert `18 RNA` into `3 DNA`, 45 sec cooldown | small active assist after DNA chemistry unlocks |

After ~3 min:

```text
manual contribution <= 5% of competent optimal income
```

## Biological 0–10 frozen baseline

The biological 0–10 slice is frozen after successful live playtest and simulation verification.

Freeze scope:

- M01–M06;
- RNA/DNA producer economics, except an explicit original-resource-flow correction;
- producer milestone thresholds and multipliers;
- manual RNA;
- manual DNA;
- canonical 9–11 min Cell pacing;
- basic World/Evolution UX;
- integer stock display;
- ETA semantics.

Further changes to this range require regression or playtest evidence.

---

# 5. 0–12 — RNA → DNA → Cell

The old molecular economy based on:

- Chemical Gradient;
- Catalytic Fold;
- Energy Pocket;
- Energy / Information;

is **superseded**.

## Canonical economic flow

```text
primordial manual process
→ RNA
→ passive RNA reaction
→ Self Replication
→ stronger RNA production
→ DNA Synthesis
→ DNA
→ Membrane
→ Cell
→ Biomass
```

### Biological tuning status

Biological 0–10 numeric baseline is **frozen**. 10–18 and later biological numbers remain provisional.

Frozen constraints:

- first passive RNA <60 sec;
- Self Replication ~2–3 min;
- DNA visible before ~6 min;
- Cell ~9–11 min;
- no need to buy arbitrary counts of three abstract molecular generators;
- optional M04 Error Correction must not become hidden prerequisite;
- competent path and slower path both remain understandable without hidden catch-up.

The previous measured values `M01 00:45 / M02 02:25 / M06 09:20` are historical results for the superseded E/I ruleset, not targets that constrain the new content.

Current deterministic headless evidence (seed 7) includes every mandatory
storage purchase: the competent Absorption route reaches M06 at **09:55** and
C06 at **18:00**; optimized reaches C06 at **15:27**. The competent route buys
four Membrane Layers, one Genetic Storage, one Biomass Reserve and one ATP
Reserve. The deliberately low-attention baseline-slow profile is an outer
corridor at **19:21**, not the target route.

### Frozen early baseline numbers

| Entity | Value |
|---|---|
| Primordial Reaction base output | 0.22 RNA/s |
| RNA Replication base output | 0.82 RNA/s |
| DNA Synthesis base output | 0.26 DNA/s |
| Producer growth | ×1.35 |
| Producer milestone | count 10 → ×1.15 (no implicit 25/50) |
| M01 | 9 RNA |
| M02 | 130 RNA |
| M03 | 350 RNA |
| M04 | 450 RNA + 120 DNA |
| M05 | 520 RNA + 90 DNA |
| M06 | 930 RNA + 205 DNA |
| Manual RNA | productionSeconds = 1.5 |
| Manual DNA | 18 RNA → 3 DNA, cooldown 45s |

### RNA → DNA resource-flow correction

The legacy evolution loop in `src/main.js` forms DNA by spending **2 RNA for
every 1 DNA** and limits DNA output when RNA is insufficient. The earlier
reconciled slice preserved the DNA output but omitted that consumption, which
allowed DNA capacity to grow as an independent economy.

The current ruleset restores the dependency while keeping first-run pacing
faster than legacy:

```text
DNA Synthesis: 0.52 RNA/s → 0.26 DNA/s (2 RNA → 1 DNA)
RNA Replication: 0.82 RNA/s base output
Respiration: 0.30 Biomass/s → 0.35 ATP/s
```

Every repeatable process must now declare either a consumed input or its
external source. New resource producers may not silently create a downstream
resource without recording that relationship in config and simulation.

### Resource storage caps and capacity buildings

Every current resource has a finite base storage cap. Production stops adding
the resource at that limit; spending frees space again. The visible resource
counter is always rendered as `current / cap` with integer stock values.

| Resource | Base cap | First required storage purchase |
|---|---:|---|
| RNA | 100 | M02 costs 130 RNA: Membrane Layers (`+250 RNA`) |
| DNA | 100 | M06 costs 205 DNA: Genetic Storage (`+150 DNA`) |
| Biomass | 80 | C03 costs 110 Biomass: Biomass Reserve (`+160 Biomass`) |
| ATP | 40 | C03 costs 50 ATP: ATP Reserve (`+120 ATP`) |
| Food | 300 | T02 costs 420 Food: Food Store (`+500 Food`) |
| Materials | 150 | T02 costs 240 Materials: Materials Store (`+400 Materials`) |
| Knowledge | 100 | T05 costs 145 Knowledge: Knowledge Archive (`+300 Knowledge`) |
| Power | 100 | Power Reserve (`+500 Power`) |

ATP is intentionally a new cellular-metabolism name. It must not be conflated
with the original game's later, psychic-only `Energy` resource.

Capacity is granted **only** by repeatable storage buildings; discoveries,
branches and producer milestones never expand it. This preserves the purpose
of a cap: a next discovery whose cost is above the current store is a visible,
mandatory reason to buy storage rather than merely wait for more production.

The early RNA/DNA role split follows the original: RNA begins at 100, membrane
layers expand RNA space, and DNA begins at 100 with later genetic/cell storage.
Legacy increments are small (membrane `+5 RNA`, eukaryotic cells `+10 DNA`),
so this accelerated T1 uses larger per-building increments while retaining
the original order and the mandatory purchase decision. Capacity remains a
data-driven `resource_capacity` building effect for every later resource.

### DNA Synthesis output A/B decision

The freeze decision compared `0.24` and `0.26 DNA/s`. Only measured values retained in the freeze record are listed here; missing per-profile values are intentionally not reconstructed.

| DNA output | `baseline_slow` Cell | Other retained evidence | Result |
|---|---:|---|---|
| 0.24 DNA/s | 702s / 11:42 | exceeds the existing 690s regression ceiling | rejected |
| 0.26 DNA/s | 684s / 11:24 | `competent` remains ~10.1 min; manual DNA stays `18 RNA → 3 DNA / 45s` | **frozen** |

`0.26 DNA/s` is retained because `0.24` fails the existing slow-profile regression corridor. The former standalone DNA-output reading is superseded by the RNA → DNA resource-flow correction above; the RNA replication increase keeps the corrected chain inside the canonical Cell window.

---

# 6. 10–18 — Cell / Metabolism / first branch

After Cell:

- Biomass becomes active;
- Metabolism unlocks ATP production;
- organelles/protein synthesis improve Biomass/ATP;
- first branch chooses **Absorption / Symbiosis / Shell**.

Branch effects must be strong enough to feel different but weak enough that all paths remain inside the first-run timing corridor.

The first primary branch uses one common entry price: **30 Biomass + 15 ATP**
for Absorption, Symbiosis and Shell. Its identity belongs in the effect, not
in a hidden affordability advantage.

For the mandatory Cell continuation, costs intentionally rise above the M06
equivalent in the resources available at that point: C03 is `110 Biomass +
50 ATP`, C05 is `160 Biomass + 70 ATP`, and C06 is `170 Biomass + 100 ATP +
160 DNA`. C03 deliberately exceeds the initial Biomass and ATP caps, requiring
Biomass Reserve and ATP Reserve after the branch. C05 and C06 receive no
hidden capacity from discoveries: players expand a repeatable store again when
a later cost outgrows it. This keeps storage meaningful while allowing the
post-M06 production ramp to finish the 0–18 minute slice rather than turning
the second half into a long flat wait.

Fixed seeded headless profiles now reach C06 at: optimized `17:13`, competent
`17:50`, Symbiosis `17:55`, and manual-assisted `17:40`. The deliberately
slow profiles remain below the 20-minute diagnostic ceiling. A milestone-heavy
route reaches C06 around `15:16`; it pays for that acceleration with its early
producer investment rather than receiving a cheaper Cell path.

Target branch power guideline:

```text
primary advantage: roughly 10–25%
secondary disadvantage: <=10–15%
```

Do not implement second-branch `×2.5` purchase in Timeline #1.

Photosynthesis/Chemosynthesis can be optional metabolism nodes with local effects and must not be required for all routes.

---

# 7. 18–28 — Multicellularity / AP economy

Core resources:

- DNA;
- Biomass;
- ATP.

`Adaptation Points` come from discrete rewards.

Suggested first-run AP envelope for later tuning:

```text
available before Sapience: 3–6 AP
core path AP cost: 0
optional adaptation typical cost: 1–2 AP
```

This is a balance envelope, not final pricing.

Optional adaptations must not be required to reach Multicellularity or Sapience.

---

# 8. 28–40 — Nervous System / Cognition

Cognition is not purchased directly.

```text
Cognition = sum(core neural progress + adaptation contributions + behavior/event contributions)
clamp 0..100
```

Tuning rules:

- core nervous-system route alone must provide most of the required progress;
- player must make at least one meaningful behavior/sensory choice;
- optional AP spending can accelerate or reshape Cognition but cannot soft-lock a player who spent AP elsewhere;
- final stretch should feel like qualitative emergence, not waiting for one huge resource price.

Target:

```text
Cognition 100 / Sapience ≈ 38–40 min median
```

---

# 9. Sapience → civilization transition

Remove the old formula converting E/B/I stock into 18–24 Population.

Canonical start:

```text
Population ≈ 5
```

New-run start package must be fixed/derived from completed evolutionary profile, not farmable biological stock.

Provisional design envelope for future simulation:

```text
Population: 5
Food: enough for 2–4 minutes of safe onboarding
Materials: enough for first shelter/tool decision
Knowledge: small seed, not enough to skip first tribal goals
```

Exact values TBD in full civilization rebalance.

---

# 10. Tribe / Settlement / City

The aggregate economy remains:

```text
Food + Materials + Knowledge + Population
```

Keep phase-aware jobs and buildings from DS-01, but retune population thresholds for the smaller civilization start.

The old numeric thresholds `24/32/42/58/78/105` must not be assumed canonical before the new simulation pass. `City ≈80 min` remains the pacing anchor; population values are variables to retune around that anchor.

## Population model

Keep the concept:

```text
Food surplus → growth
Food deficit → growth pauses / recovery hint
```

No demographic hard fail in Timeline #1.

## Materials

Wood/Stone/Metal remain aggregate Materials for top-level economy. Internal breakdown can be used later without changing the primary resource model.

---

# 11. Industry / Power

Power becomes a full active resource at the Industry/electrification transition, not immediately on City unlock.

Carry-over industrial entities worth retaining:

- Mine;
- Foundry;
- Steam Plant;
- Rail Hub;
- Laboratory;
- Steelworks;
- Grid Station;
- Research Institute;
- Chemical Complex.

Exact costs/output from balance v1.0 are **provisional carry-over** until the 38–108 simulation is rerun with corrected biological/civilization pacing.

Industry target remains ~94–95 min.

---

# 12. Modern bridge

95–104 min should provide a short acceleration phase rather than another full economy reset.

Economic meaning:

- Power scaling;
- Knowledge scaling;
- automation/logistics;
- global connection/communications;
- preparation for Atomic Theory.

Modern bridge should add at most a small number of mandatory purchases. Its job is pacing and scale change, not another 15-node tree.

---

# 13. Atomic / crisis

Keep current late-game model as the strongest accepted part of balance, subject to regression simulation:

On Atomic Age:

```text
Stability = 100
crisis_clock = 0
crisis_active = true
```

Canonical internal drain shape remains configurable:

```text
stability_drain/sec = base + atomic_load contribution + unresolved_crisis contribution
```

First run:

- Ash unavoidable;
- minimum dramatic window before ending;
- maximum crisis duration around 8 min;
- offline crisis clock frozen;
- crisis choices affect reward/Chronicle/subtype, not survival of Timeline #1.

---

# 14. Archive reward

Keep DS-04 first-reset envelope:

```text
14–18 AF typical
```

AF reward remains idempotent and cannot be multiplied by ads/meta.

The exact formula may continue to use discovered evolution nodes, peak Population and crisis bonus, but thresholds must be revalidated after node/population reconciliation.

---

# 15. Timeline #2 impact

Because Timeline #1 Sapience moves from ~46 to ~38–40 min, old Timeline #2 target `20–28 min` is no longer automatically canonical.

New rule:

```text
familiar pre-Sapience replay target ≈ 50–65% of corrected Timeline #1 pre-Sapience time
```

Initial tuning target for validation:

```text
no-spend: ~22–25 min
typical Tier1: ~18–22 min
hard readability floor: ~16–18 min
```

These values are provisional until the corrected first-run simulation exists.

---

# 16. Rebalance order

Biological 0–10 is already implemented, balanced, manually approved and frozen. The active rebalance order starts after Cell:

1. implement/rebalance 10–18 Cell / Metabolism / first branch;
2. simulate biological 0–40 end-to-end;
3. retune civilization start and population thresholds;
4. simulate 38–108;
5. regression-test crisis / Ash / reset;
6. retune Timeline #2 acceleration against the corrected Timeline #1;
7. run cross-document consistency / design freeze pass;
8. only then freeze full Timeline #1 numeric v2.

Do not reopen biological 0–10 without regression or playtest evidence. Do not tune old E/I numbers further.
