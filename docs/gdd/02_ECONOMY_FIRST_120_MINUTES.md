# Хроники Эволюции — экономика первых 120 минут

**Версия:** reconciliation balance spec v2.0  
**Статус:** canonical structure / biological numbers pending re-balance  
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
| 10–18 cell/metabolism | RNA or DNA contextually / Biomass / Energy |
| 18–38 organism | DNA / Biomass / Energy + AP indicator |
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

Exact numbers are intentionally **TBD until Rework Iteration simulation**.

Required tuning constraints:

- first passive RNA <60 sec;
- Self Replication ~2–3 min;
- DNA visible before ~6 min;
- Cell ~9–11 min;
- DNA Synthesis producer output is currently `0.26 DNA/s`;
- no need to buy arbitrary counts of three abstract molecular generators;
- optional M04 Error Correction must not become hidden prerequisite;
- competent path and slower path both remain understandable without hidden catch-up.

The previous measured values `M01 00:45 / M02 02:25 / M06 09:20` are historical results for the superseded E/I ruleset, not targets that constrain the new content.

---

# 6. 10–18 — Cell / Metabolism / first branch

After Cell:

- Biomass becomes active;
- Metabolism unlocks Energy production;
- organelles/protein synthesis improve Biomass/Energy;
- first branch chooses **Absorption / Symbiosis / Shell**.

Branch effects must be strong enough to feel different but weak enough that all paths remain inside the first-run timing corridor.

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
- Energy.

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

After documentation approval:

1. implement corrected 0–10 content;
2. balance 0–10;
3. manual playtest;
4. implement/rebalance 10–18;
5. simulate biological 0–40 end-to-end;
6. retune civilization start and population thresholds;
7. simulate 38–108;
8. regression-test crisis/Ash/reset;
9. only then freeze Timeline #1 numeric v2.

Do not tune old E/I numbers further.
