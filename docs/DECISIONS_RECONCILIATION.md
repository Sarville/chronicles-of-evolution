# Хроники Эволюции — Design Reconciliation Decisions

**Date:** 2026-09-16  
**Status:** accepted  
**Authority:** более поздний decision addendum. Для вопросов, перечисленных ниже, этот документ имеет приоритет над `DECISIONS.md`, `DECISIONS_DS03.md`, `DECISIONS_DS04.md` и документами, которые наследовали superseded gameplay assumptions.

## REC-001 — Reconciliation principle

### Decision

Первоначальный gameplay-концепт `01_FIRST_120_MINUTES.md` и продуктовая fantasy из PRD снова являются смысловой основой Timeline #1.

Поздние документы сохраняются только там, где они:

- улучшают понятность или глубину исходного gameplay;
- формализуют architecture/data/save/testing;
- добавляют полезную meta/narrative систему;
- не заменяют предметную эволюцию техническими абстракциями.

Главный принцип:

> **RESTORE GAMEPLAY. KEEP ARCHITECTURE. KEEP GOOD META/NARRATIVE.**

Нельзя создавать третью версию игры ради reconciliation.

---

## REC-002 — Superseded source priority

### Supersedes

- `DEC-003` в части безусловного приоритета late economy над исходным gameplay concept;
- `DEC-004` в части ранних biological timings до Sapience;
- `DEC-005` полностью;
- `DEC-006` в части molecular/cellular resource sets;
- `DEC-018` в части timing Power и удаления отдельного Modern bridge;
- DS-02/DS-03 формулировки, которые механически наследуют перечисленные решения.

### New priority

1. `DECISIONS_RECONCILIATION.md` — reconciliation decisions.
2. `01_FIRST_120_MINUTES.md` — canonical gameplay progression and phase meaning.
3. `03_EVOLUTION_TREE.md` — canonical node/branch semantics.
4. `02_ECONOMY_FIRST_120_MINUTES.md` — current tuning targets **для уже утверждённого gameplay**, а не источник новых gameplay concepts.
5. DS-01/DS-02 documents — civilization, goals, events, ending details.
6. DS-03 technical contract — architecture/runtime contract.
7. DS-04 — meta and balance guardrails.

Economy не может вводить новый resource, generator, branch или milestone только ради удобства simulation без отдельного design decision.

---

## REC-003 — Canonical biological resource model

### Decision

Visible biological progression снова предметная:

```text
RNA
→ Self Replication
→ DNA
→ Membrane
→ Cell
→ Biomass
→ Metabolism
→ Organelles / body systems
→ Multicellularity
→ Nervous System
→ Cognition
→ Sapience
```

Canonical visible resources первого Timeline:

- **RNA** — стартовый molecular resource;
- **DNA** — открывается через replication/genetic synthesis;
- **Biomass** — открывается с Cell;
- **Energy** — появляется как реальная metabolic capacity после Cell/Metabolism, а не стартовая абстрактная валюта;
- **Adaptation Points** — milestone/side-objective reward для optional biological adaptations; не `/sec` grind currency.

`Information` больше не является player-facing spendable resource Timeline #1. Она может существовать как internal/system concept или derived stat.

### Remove from canonical player-facing gameplay

- Chemical Gradient;
- Catalytic Fold;
- Energy Pocket;
- Stable Bond в прежней economic semantics;
- универсальную E/I/B оплату всех biological nodes.

---

## REC-004 — M01–M06 semantics

Для сохранения data-driven infrastructure family `Mxx` остаётся, но content semantics меняются:

```text
M01 Stable RNA / Устойчивая РНК
M02 Self Replication / Саморепликация
M03 DNA Synthesis / Синтез ДНК
M04 Error Correction / Коррекция ошибок [OPTIONAL]
M05 Membrane / Мембрана
M06 Cell / Клетка [CONVERGENCE]
```

Точные prices/rates определяются новым balance pass после documentation approval.

M01–M06 IDs допустимо сохранить ради минимизации implementation churn, но старые names/effects не являются canon.

---

## REC-005 — First biological branch

### Decision

Первая meaningful branch после появления устойчивой Cell/Metabolism:

- **Поглощение**;
- **Симбиоз**;
- **Панцирь**.

Это необратимый primary trait Timeline #1.

Поздние `Photosynthesis` и `Chemosynthesis` не удаляются как идеи: они могут существовать как optional metabolic adaptations внутри подходящих путей, но не заменяют первую branch.

Правило `second branch cost ×2.5` удаляется из Timeline #1. Future Archive hybridization разрешает комбинирование traits явно через meta rules.

---

## REC-006 — Adaptation Points

Adaptation Points возвращаются.

Hard rules:

- не производятся пассивно;
- не являются постоянной meta currency;
- выдаются за biological milestones и optional objectives;
- тратятся на optional body/behavior adaptations;
- core breakthroughs Cell / Multicellularity / Nervous System / Sapience не требуют AP;
- unspent AP сбрасываются с обычным Timeline reset.

Цель AP — сделать optional evolution наградой за exploration/objectives, а не ещё одним слоем grind.

---

## REC-007 — Cognition and Sapience

После Nervous System открывается meter:

```text
Cognition: 0..100
```

Cognition растёт от:

- sensory development;
- neural complexity;
- social behavior;
- object manipulation/tool use;
- selected mini-events/objectives.

Sapience — qualitative threshold/convergence:

```text
cognition >= 100
+ required core nervous-system prerequisites
→ Sapience
```

Sapience не покупается как обычный дорогой node за три currencies.

Поздние nodes Social Signaling / Proto-language / Tool Use могут сохраняться как contributors/modifiers к Cognition и evolutionary profile.

---

## REC-008 — Corrected Timeline #1 pacing

Design targets до нового balance pass:

| Stage | Target window |
|---|---:|
| RNA / first stable life process | 0–2 min |
| Replication / DNA | 2–7 min |
| Membrane / Cell | 7–12 min |
| First branch / cellular adaptation | 10–18 min |
| Multicellularity | 18–28 min |
| Nervous System / Cognition | 28–38 min |
| Sapience | ~38–40 min |
| Tribe | 38–50 min |
| Settlement | 50–65 min |
| City | 65–80 min |
| Industry | 80–95 min |
| Modern bridge | 95–104 min |
| Atomic transition | 104–108 min |
| Crisis / Ash | 108–118 min |
| Archive / reset | 118–120 min |

City/Industry/Atomic/Ash/reset anchors поздней версии сохраняются приблизительно, но biological phase снова ближе к исходной драматургии.

Это design windows, не canonical numeric economy до нового simulation pass.

---

## REC-009 — Civilization model

Сохраняем базовую структуру:

```text
Tribe → Settlement → City → Industry → Modern → Atomic → Crisis
```

Canonical civilization resources:

- Food;
- Materials;
- Knowledge;
- Population;
- Power после начала industrial/electrification layer.

`Wood / Stone / Metal` не возвращаются как обязательные global currencies v1. Они могут быть internal production categories/visual concepts.

Population remains capacity for jobs, not spendable currency.

Jobs остаются phase-aware и обновляются по эпохам, но Tribe стартует маленькой группой около **5 Population**, а не через конверсию E/B/I в 18–24 Population.

Точная стартовая F/M/K экономика определяется новым balance pass.

Power не должен быть главным новым ресурсом сразу при City. Его полноценный gameplay unlock привязан к Industry/electrification transition.

---

## REC-010 — Modern bridge restored

Между Industry и Atomic сохраняется короткая Modern phase:

- electricity/grid;
- communications/global connection;
- research institutions;
- modern logistics/automation;
- Error 17;
- подготовка Atomic Theory.

Radio/Computing precursor не обязаны становиться отдельными grind-heavy mandatory technologies, но смысл «город стал глобальной современной цивилизацией» должен быть видим в gameplay и presentation.

---

## REC-011 — Crisis, Ash and Archive

Keep as canonical improvements:

- internal `Stability` with UI `World Tension = 100 - Stability`;
- first-run crisis clamps;
- first Ash unavoidable;
- Last Protocol variants converging into `ENDING_ASH`;
- Error 17;
- «Снова.» anomaly;
- Chronicle;
- Archive Fragments;
- idempotent reset;
- persistent narrative flags;
- Timeline #2;
- Archive Recall;
- retained optional traits/hybridization concept;
- save/recovery architecture.

These systems must adapt to corrected gameplay vocabulary; they do not force old E/I/B semantics back into the game.

---

## REC-012 — Architecture remains accepted

Iteration 3 remains **technically successful**.

Keep:

- `src/chronicles` isolated domain;
- canonical GameState;
- commands/domain events/selectors;
- serializable data-driven config;
- Goal Engine;
- save v1/recovery/autosave;
- dev time scale/tools;
- telemetry hooks;
- headless simulation;
- optional goal support;
- branch infrastructure;
- idempotent reset.

Accepted gameplay implementation baseline before reconciliation:

`32c0d72f56f48a21e3c22c8e3eb9ef3975e967fb`

Its 0–10 **content/balance** is superseded, not its technical foundation.

---

## REC-013 — Implementation order

Iteration 4 is blocked.

Required order:

1. documentation reconciliation;
2. approve corrected 0–120 canon;
3. update economy/tree/goals/events/meta/technical references;
4. **Rework Iteration — Biological gameplay reconciliation 0–10**;
5. migrate config/content while keeping architecture;
6. update tests;
7. rebalance 0–10 from scratch;
8. manual playtest 0–10;
9. only then start Iteration 4 after corrected Cell.

No game code changes are part of the documentation reconciliation commit series.