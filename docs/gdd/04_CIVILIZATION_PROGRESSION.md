# Хроники Эволюции — цивилизационная progression Timeline #1

**Версия:** reconciliation revision 2.0  
**Статус:** canonical civilization contract  
**Область:** от Sapience (~38–40 min) до Atomic (~108 min).  
**Authority:** `DECISIONS_RECONCILIATION.md`, `01_FIRST_120_MINUTES.md`, `02_ECONOMY_FIRST_120_MINUTES.md`.

> **(2026-09-17) Act-structure note:** этот документ описывает
> переиспользуемый civilization-контент-пакет, а не единственный забег.
> Только `T1` доходит здесь до Tribe (~era 5); `T2` доходит до Settlement,
> `T3` до City, `T4` до Industry/Modern, `T5` — единственная, что доходит
> до Atomic, начиная не с нуля, а со стартовым грантом «синтез уроков
> `T1–T4`». Полная нарезка по главам — `docs/gdd/13_ACT_ONE_CHAPTERS.md`;
> per-chapter темп и стартовые условия — `docs/gdd/01_FIRST_120_MINUTES.md`
> §3–7.

---

# 1. Design intent

Civilization progression должна ощущаться как рост масштаба:

```text
small sapient group
→ Tribe
→ Settlement
→ City
→ Industry
→ Modern civilization
→ Atomic Age
```

Поздняя DS-01 нормализация сущностей сохраняется:

- Technology Node;
- Building;
- Job;
- Upgrade;
- Milestone/Era State.

Но timing и gameplay meaning теперь подчиняются reconciled canon, а не старому `Sapience 46` balance.

---

# 2. Canonical phases

| Window | Era state | Main meaning |
|---|---|---|
| ~38–50 | EARLY_CIV / TRIBE | Food, first jobs, camp, Population growth |
| 50–65 | SETTLEMENT | farming, permanent housing, workshop/storage |
| 65–80 | CITY | Writing, School, Market, formal research, government-lite |
| 80–95 | INDUSTRY | mechanization, steam, factories, Power |
| 95–104 | MODERN | grid, communications, global connection, research institutions |
| 104–108 | PRE_ATOMIC | Scientific Method, Atomic Theory, reactor/lab program |
| 108+ | ATOMIC | World Tension / crisis layer |

Targets are telemetry windows, not hard timers.

---

# 3. Sapience → EARLY_CIV

Trigger:

```text
Cognition >= 100
+ nervous-system prerequisites complete
→ Sapience
```

On transition:

- biological active economy closes;
- evolutionary history remains visible;
- new active resources: Food / Materials / Knowledge / Population;
- `Population ≈ 5` at start;
- small fixed/derived F/M/K onboarding package;
- unlock simple tribal jobs/buildings.

Remove old stock-conversion formula from Energy/Biomass/Information.

---

# 4. EARLY_CIV / Tribe

## First jobs

Keep the simple player-facing set first:

- Forager/Hunter;
- Gatherer;
- Thinker.

`Caregiver` may unlock later in Tribe if balance needs an explicit fertility control; it is not required in the first civilization minute.

## First structures

- Hearth/Campfire;
- Shelter;
- Food Store / storage;
- Tool Bench / work area.

## Goal flow

```text
stabilize Food
→ assign first jobs
→ increase Population
→ establish Tribe
```

Keep narrative choice `Как делить добычу` as profile decision.

Do not require a paid 3-way culture branch before the player can learn basic civilization controls. Cultural tradition can be optional/recommended or event-driven.

---

# 5. Settlement

Core flow:

```text
Agriculture
→ Fields
→ Houses
→ Workshop
→ Storage
→ Permanent Settlement
→ Writing precursor
```

Keep phase-aware jobs:

- Farmer;
- Builder;
- Scholar;
- Artisan.

Settlement specialization ideas remain useful:

- Irrigation;
- Masonry;
- Exchange.

But they are not automatically a blocking branch. A specialization may be:

- optional paid node;
- event/profile choice;
- recommended goal;

provided core Settlement progression stays readable.

`Следы до нас` occurs during this phase.

---

# 6. City

City remains a major anchor near 78–80 min.

Core gameplay:

- Writing;
- School;
- Market/trade-lite;
- organized labor;
- formal research;
- dense permanent infrastructure.

Government-lite event remains:

- Council;
- Leader;
- Merchants.

This writes profile/path flags and may later receive small configured modifiers. It does not need to become a hidden mandatory economy multiplier.

## Jobs

Use phase-aware upgraded roles, but preserve semantic continuity:

- Farmer;
- Worker/Builder/Artisan lineage;
- Scholar/Researcher lineage;
- optional trade/utility representation.

Old labels do not need to coexist forever in UI.

## Power

City may visually introduce proto-power infrastructure, but **Power does not become the main new resource until Industry/electrification**.

---

# 7. Industry

Target ~93–95 min.

Milestone:

# ЭПОХА МАШИН

Core progression:

```text
Mechanization
→ Steam
→ factories / rail / logistics
→ electrification
→ Power resource
→ automation
→ Industry milestone
```

Carry-over infrastructure concepts:

- Mine;
- Foundry;
- Steam Plant;
- Rail Hub;
- Laboratory.

Industrial jobs remain phase-aware.

## Energy Crisis

Keep the major narrative choice:

- Fossil industry;
- Clean/Renewable program;
- Early Atomic research.

It changes skyline/profile/crisis tags. Any numeric chapter modifier must live in config and be included in simulation.

---

# 8. Modern civilization

Restore an explicit `MODERN` state/beat between Industry and Atomic.

Main meaning:

- national/urban industry becomes global civilization;
- electrical grid matures;
- modern research institutions;
- communications;
- global logistics/connections;
- automation/computation precursor can be represented compactly.

This does not require a full world map.

Presentation can use globe/connection progress.

`ERROR 17` appears here.

---

# 9. Pre-Atomic

Core flow:

```text
Modern Grid / Research Base
→ Scientific Method
→ Atomic Theory
→ Reactor/Lab Program
→ Atomic Age
```

Keep useful specializations like Electrification / Research Institutions / Logistics as optional/profile content, not automatically another mandatory 3-way paid gate.

Atomic transition must feel tangible: at least one reactor/lab project or equivalent visible preparation is required before Atomic Age milestone.

---

# 10. Atomic transition

On Atomic Age:

```text
set era_state = ATOMIC
set stability = 100
set crisis_clock = 0
freeze first-run offline crisis progression
```

Presentation:

- `МЫ РАСКОЛОЛИ МАТЕРИЮ`;
- Archive `Снова.` anomaly;
- V7 Atomic visual state;
- Destiny Goal becomes Great Filter/crisis goal.

---

# 11. Resources

## Tribe → City

- Food;
- Materials;
- Knowledge;
- Population.

## Industry → Atomic

- Materials;
- Knowledge;
- Power;
- Food supporting;
- Population.

## Crisis

- Materials;
- Knowledge;
- Power;
- World Tension visible / Stability internal.

No separate Wood/Stone/Metal top-level currencies in v1.

---

# 12. Population architecture

Population remains production capacity.

Rules retained:

- assignments <= current Population;
- unassigned Population allowed;
- Food surplus supports growth;
- Food deficit stops/slows growth and triggers recovery hints;
- no temporary Food deficit hard-fails Timeline #1.

Exact growth rates and phase thresholds are **rebalanced after the new Population≈5 start**.

Old thresholds `24/32/42/58/78/105/...` are no longer source-of-truth values.

---

# 13. Jobs replacement policy

Keep phase-aware replacement as a useful late-design improvement.

On era transition:

- UI shows current relevant roles;
- assigned Population can be safely remapped where semantic lineage exists;
- remainder becomes unassigned;
- historical Chronicle/profile is not rewritten.

Recommended semantic lineages:

```text
Forager → Farmer → industrial food role
Gatherer/Builder → Worker/Miner/Industrial Worker
Thinker/Scholar → Researcher/Scientist
Artisan → Engineer/Worker depending era
```

Exact auto-remap is implementation detail and must be reversible/transparent enough not to surprise the player.

---

# 14. Branch policy

Civilization does **not** need a mandatory paid branch in every phase.

Keep meaningful choices where they create identity:

- cultural profile;
- settlement specialization;
- governance;
- city specialization;
- energy path;
- pre-atomic specialization.

They can be represented by event flags, optional nodes or paid branches depending on actual gameplay value.

Hard rule:

> No blocking branch exists only because previous docs used a uniform tree template.

---

# 15. Visual states

| Era | Visual state |
|---|---|
| EARLY_CIV | tiny camp / fire / few individuals |
| TRIBE | larger camp / storage / activity |
| SETTLEMENT | permanent houses / fields / roads |
| CITY | dense town / school / market / workshops |
| INDUSTRY | factories / rail / smoke or clean-industrial variant |
| MODERN | grid / communications / modern skyline / global hints |
| ATOMIC | reactor/research landmark / high-energy modern skyline |

Buildings remain layered-diorama thresholds, not 1:1 city-builder placement.

---

# 16. Goal integration

Goal Engine remains generic and data-driven.

Corrected chapter sequence:

```text
Sapience
→ establish Tribe
→ build permanent Settlement
→ create City
→ industrialize
→ become Modern global civilization
→ enter Atomic Age
→ face Great Filter
```

Exact Goal IDs are defined in `07_GOALS_AND_MILESTONES.md` and may retain stable IDs with changed semantics where safe.

---

# 17. Deferred balance values

After the accepted 0–180 headless balance pass, the following remain configurable/provisional for manual playtest:

- civilization starting grants;
- Population thresholds;
- birth rates;
- exact job outputs;
- exact building costs/growth;
- branch multipliers;
- Power unlock numbers;
- modern/atomic costs.

Do not use old numbers merely because they were already simulated under the superseded 46-minute Sapience model.

---

# 18. Implemented T1 route contract

The first-run implementation uses one contiguous, save-safe route:

```text
T08 Agriculture → SETTLEMENT_EARLY
T09 Permanent Settlement → SETTLEMENT
T10 Writing → T11 Organized Labor → T12 City → CITY
T13 Mechanization → T14 Steam/Rail → T15 Electrification → INDUSTRY
T16 Grid → T17 Research Institutions → T18 Global Connection → MODERN
A01 Scientific Method → A02 Atomic Theory → Reactor/Lab → A03 Program → A04 Atomic → ATOMIC
```

On each era transition, job assignments remap by semantic lineage (food,
materials, knowledge) when a direct successor exists; otherwise they become
unassigned. This prevents a hidden workforce lock after Settlement, City or
Industry.

The route is complete as a domain/config/UI baseline. Its numbers are a
simulation input, not an approved balance table.
