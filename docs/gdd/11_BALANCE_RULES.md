# Хроники Эволюции — Balance rules

**Документ:** DS-04 / reconciliation revision 2.0  
**Статус:** canonical balance guardrails.

---

# 1. Source-of-truth rule

`02_ECONOMY_FIRST_120_MINUTES.md` remains the numeric tuning document **only after gameplay semantics are defined by**:

- `DECISIONS_RECONCILIATION.md`;
- `01_FIRST_120_MINUTES.md`;
- `03_EVOLUTION_TREE.md`.

Balance may tune an approved system; it may not invent a replacement system merely because it is easier to simulate.

---

# 2. Timeline #1 invariants

## INV-01 — First run is self-contained

Playable without:

- Archive spend;
- ads;
- offline progress;
- paid acceleration.

## INV-02 — Full run ≈120 min

Corrected anchors:

| Milestone | Target |
|---|---:|
| Self Replication | ~2–3 min |
| Cell | ~9–11 min |
| Multicellularity | ~24–28 min |
| Sapience | ~38–40 min |
| Tribe | ~48–50 min |
| Settlement | ~62–65 min |
| City | ~78–80 min |
| Industry | ~93–95 min |
| Modern | ~102–104 min |
| Atomic | ~107–108 min |
| Ash | ~116–118 min |
| Reset | ~120 min |

Normal full-run working window remains roughly 110–130 min during tuning.

## INV-03 — Biological readability

Player-facing causal chain must remain understandable:

```text
RNA → replication → DNA → Cell → metabolism → organism → nervous system → Cognition → Sapience
```

A balance patch may not replace that chain with abstract currencies/generators.

## INV-04 — Manual input not dominant

After ~3 min:

```text
manual contribution <= 5% competent optimal income
```

Manual actions are resource-agnostic config entries, not hardcoded RNA clicks. A manual action may grant or convert resources, declare cooldown/input/reward data, and support a future reward multiplier at the command layer. Ads/rewarded multipliers must not be required for baseline Timeline #1 progression.

## INV-04A — Frozen biological 0–10 baseline

After the accepted live playtest, biological 0–10 is frozen across M01–M06, RNA/DNA producer economics, explicit milestone values, manual RNA, manual DNA, canonical 9–11 min Cell pacing and the basic World/Evolution UX. Changes in this range require regression or playtest evidence.

## INV-05 — Optional means optional

An OPTIONAL node must not become mandatory through:

- hidden prerequisite;
- impossible core affordability without it;
- Goal Engine requirement;
- simulation script assumption.

## INV-06 — Ash unavoidable first run

No branch, perfect economy, Archive effect, ad or offline gain cancels first-run Ash.

---

# 3. Adaptation Points invariants

AP:

- no passive production;
- no generator;
- no exponential cost curve;
- core biological path costs 0 AP;
- optional adaptations typically cost 1–2 AP;
- earned from milestones/side objectives;
- reset with run unless a meta rule explicitly retains an adaptation.

Telemetry should track:

- AP earned before Sapience;
- AP spent;
- selected adaptations;
- unspent AP at Sapience;
- abandonment after first AP choice.

---

# 4. Cognition invariants

Cognition is a meter, not a wallet.

Sapience requires:

```text
core neural prerequisites + cognition >= 100
```

Balance must ensure:

- core path supplies most required Cognition;
- optional paths change pace/profile but do not create soft locks;
- at least one meaningful behavior/evolution choice is experienced;
- the final 20–30 Cognition does not become idle waiting with no decisions.

Meta cannot directly skip Cognition with one permanent grant.

---

# 5. Resource visibility

No more than the context needs.

Canonical active sets:

- molecular: RNA;
- cell: RNA/DNA/Biomass;
- organism: DNA/Biomass/Energy + AP indicator;
- civilization: Food/Materials/Knowledge/Population;
- industry: Materials/Knowledge/Power + Food/Population contextually;
- crisis: Materials/Knowledge/Power + World Tension.

`Information` must not reappear as a visible spendable resource through a balance patch.

---

# 6. Pacing cadence

Timeline #1 meaningful payoff target:

```text
0–10 min: 30–90 sec
10–30 min: 2–4 min
30–60 min: 3–6 min
60–120 min: 5–12 min
```

No visible horizon gap >5 min in first 30 min.

A payoff may be:

- new resource;
- visual transformation;
- new mechanic;
- adaptation;
- branch choice;
- major goal/milestone;
- anomaly/event.

It does not have to be another producer multiplier.

## INV-07 — Producer milestones must be legible

Count-based producer/process milestone bonuses are permitted only when the player can understand why production changed.
Milestone thresholds and multipliers must be declared on the specific producer/process config. Runtime must not grant implicit global `10/25/50` bonuses.

For each repeatable process that uses milestone bonuses, define:

- threshold count;
- fiction label;
- short explanation;
- affected resource/output;
- whether the bonus is shown in UI/tooltip/log.

For biological 0–10, the only canonical repeatable-process milestone is currently:

```text
count 10 -> explicit qualitative transition -> x1.15
```

`25` and `50` are not canonical thresholds for this slice.

Biological examples:

| Process family | Acceptable explanation |
|---|---|
| Primordial reactions | reactions connect into a cooperative RNA network |
| Replication | copies form a shared template pool |
| DNA synthesis | reusable genetic assembly chain stabilizes |

If no convincing explanation exists, the milestone multiplier should be disabled for that process.

---

# 7. Patch priority

When a phase is too slow/fast, tune in this order:

1. local process/producer output;
2. specific breakthrough requirement;
3. job/building output;
4. starting/one-time grant;
5. local branch modifier;
6. Population growth/gate if civilization-wide issue;
7. growth factor last.

For Cognition/AP systems, use system-specific inputs rather than forcing a generic price adjustment.

---

# 8. Recommended patch sizes

For ordinary telemetry pass:

```text
base output/process speed: ±5–10%
breakthrough requirement: ±5–10%
job/building output: ±5–10%
one-time grant: ±10–20%
branch local effect: ±5–10%
growth factor: <= ±0.01 per pass
```

Larger changes require regression simulation.

The first reconciliation rebalance is exempt from these small-patch limits because it is a new ruleset/content migration, not an ordinary telemetry patch.

---

# 9. Timeline #2 target

Old fixed target `20–28 min Sapience` is superseded.

New principle:

```text
familiar pre-Sapience p50 ≈ 50–65% of corrected Timeline #1 p50
```

Initial post-reconciliation tuning envelope:

```text
Timeline #1 Sapience: ~38–40 min
T2 no-spend: ~22–25 min
T2 typical Tier1: ~18–22 min
readability floor: ~16–18 min
```

These become final only after corrected Timeline #1 simulation.

---

# 10. Meta caps

Keep existing anti-snowball ceilings as guardrails:

```text
pre-Sapience meta process/production <= 1.60
Tribe/Settlement <= 1.35
City <= 1.25
Industry/Atomic <= 1.15
offline <= 75%
Archive Intervention <= 1.50
```

Familiar core requirement/cost floor remains approximately:

```text
>= 70% canonical
```

For non-price conditions, define explicit equivalents instead of fake cost conversion.

---

# 11. Civilization balance rules

Population starts around 5 after Sapience.

Therefore all old population thresholds are provisional until retuned.

Hard rules:

- temporary Food deficit does not hard-fail the run;
- Population assignment remains main production control;
- Power becomes a major active resource in Industry/electrification, not City;
- Modern must be a visible scale transition before Atomic;
- no mandatory branch exists only to normalize tree shape.

---

# 12. Crisis balance

Keep accepted principles:

- Stability internal / World Tension visible;
- first-run crisis offline freeze;
- dramatic minimum duration;
- hard maximum duration around 8 min as starting point;
- crisis choices can change reward/summary/subtype;
- first Ash is guaranteed.

Exact drain coefficients are regression-tested after the new 0–108 pacing is stable.

---

# 13. Simulation profiles

Headless simulation remains required.

For each relevant segment maintain at least:

- competent/reference;
- optimized;
- slower/non-optimal;
- optional-content route where relevant.

Biological simulation must additionally vary:

- first primary trait;
- AP spending pattern;
- behavior strategy;
- optional M04/metabolic adaptation;
- Cognition contribution mix.

No single scripted path defines canon.

---

# 14. Telemetry

Per milestone track:

```text
p25 / p50 / p75
time_to_afford or condition progress
abandonment_before
resource/process bottleneck
selected branch/adaptations
goal stall time
```

Additional biological telemetry:

- time to first passive RNA;
- manual contribution share;
- first DNA time;
- AP earned/spent;
- Cognition gain sources;
- time spent 80→100 Cognition.

Additional civilization telemetry:

- job reallocations;
- Food deficit time;
- Population gate delay;
- Power deficit time;
- Modern bridge duration.

---

# 15. Ruleset/versioning

The reconciled gameplay requires a new ruleset version.

Recommended semantic name:

```text
timeline1-v2-reconciled
```

The old E/I implementation is historical pre-release ruleset content.

Save/schema architecture remains versioned separately.

Do not silently apply changed prices/resources to an active persisted run without an explicit migration/restart policy.

---

# 16. Rebalance sequence

Mandatory order:

1. corrected 0–10 config implementation;
2. 0–10 headless balance;
3. manual 0–10 playtest;
4. 10–18 implementation/balance;
5. full 0–40 biological simulation;
6. civilization start/population retune;
7. 38–108 simulation;
8. crisis regression;
9. Timeline #2/meta tuning;
10. design freeze v2.

Iteration 4 must not start before step 3 is approved.
