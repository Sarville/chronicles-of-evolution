# Хроники Эволюции — документация проекта

Этот каталог — каноническая проектная документация **Хроник Эволюции**.

Он используется как контракт между:

- пользователем/продакт-оунером;
- ChatGPT как design/content агентом;
- Codex как implementation агентом;
- репозиторием как долговременной памятью проекта.

Главный принцип: важное решение не должно существовать только в чате или только в коде.

---

## 1. Операционные файлы

### `PROJECT_STATE.yaml`

Единственный source of truth для текущего статуса проекта.

### `TODO.md`

Человекочитаемый work queue.

Если `TODO.md` расходится с `PROJECT_STATE.yaml`, верен `PROJECT_STATE.yaml`.

### `DECISIONS.md`

Основной исторический реестр решений.

### `DECISIONS_RECONCILIATION.md`

Текущий authoritative addendum для design reconciliation.

Для вопросов biological progression, resources, first branch, Adaptation Points, Cognition/Sapience, Power timing, Modern phase и implementation order он имеет приоритет над более ранними решениями.

### `GLOSSARY.md`

Единые канонические термины.

### `production/DESIGN_SESSION_PLAN.md`

Порядок design sessions и review gates.

### `production/IMPLEMENTATION_ITERATION_PLAN.md`

Roadmap Codex. Фактический статус всегда берётся из `PROJECT_STATE.yaml`.

---

## 2. Каноническая структура

```text
docs/
├─ README.md
├─ PROJECT_STATE.yaml
├─ DECISIONS.md
├─ DECISIONS_DS03.md
├─ DECISIONS_DS04.md
├─ DECISIONS_RECONCILIATION.md
├─ GLOSSARY.md
├─ TODO.md
├─ PRD.md
│
├─ gdd/
│  ├─ 01_FIRST_120_MINUTES.md
│  ├─ 02_ECONOMY_FIRST_120_MINUTES.md
│  ├─ 03_EVOLUTION_TREE.md
│  ├─ 04_CIVILIZATION_PROGRESSION.md
│  ├─ 05_BUILDINGS_AND_JOBS.md
│  ├─ 06_TECH_TREE.md
│  ├─ 07_GOALS_AND_MILESTONES.md
│  ├─ 08_EVENTS_AND_CHOICES.md
│  ├─ 09_ENDINGS_AND_RESET.md
│  ├─ 10_META_PROGRESSION.md
│  └─ 11_BALANCE_RULES.md
│
├─ scenario/
├─ ux/
├─ art/
├─ audio/
├─ technical/
└─ production/
```

---

## 3. Source-of-truth hierarchy after reconciliation

When documents conflict, use this order.

### Current project status

1. `PROJECT_STATE.yaml`
2. `TODO.md`
3. production roadmap/session docs

### Cross-document design decisions

1. `DECISIONS_RECONCILIATION.md` for topics it explicitly supersedes
2. later accepted decision addenda relevant to the topic
3. `DECISIONS.md`

### Gameplay progression / phase meaning

1. `DECISIONS_RECONCILIATION.md`
2. `gdd/01_FIRST_120_MINUTES.md`
3. `gdd/03_EVOLUTION_TREE.md`
4. specialized GDD
5. PRD

### Numbers / production / pacing

1. reconciliation decisions and gameplay semantics
2. `gdd/02_ECONOMY_FIRST_120_MINUTES.md`
3. `gdd/11_BALANCE_RULES.md`
4. specialized GDD
5. PRD

Important:

> Economy is a tuning source for approved gameplay. It cannot invent a new resource/generator/progression model solely for simulation convenience.

### Evolution / tech / buildings / jobs

1. reconciliation decisions
2. `gdd/03_EVOLUTION_TREE.md`
3. `gdd/04_CIVILIZATION_PROGRESSION.md`
4. `gdd/05_BUILDINGS_AND_JOBS.md`
5. `gdd/06_TECH_TREE.md`

### Goals / events / ending

1. reconciliation decisions
2. `gdd/07_GOALS_AND_MILESTONES.md`
3. `gdd/08_EVENTS_AND_CHOICES.md`
4. `gdd/09_ENDINGS_AND_RESET.md`
5. scenario docs

### Meta / balance

1. reconciliation decisions
2. `gdd/10_META_PROGRESSION.md`
3. `gdd/11_BALANCE_RULES.md`

### Technical implementation

1. reconciliation decisions for gameplay content
2. accepted `technical/` architecture docs
3. `production/IMPLEMENTATION_ITERATION_PLAN.md`
4. code audit
5. implementation code

Code never silently overrides product specification.

---

## 4. Reconciled gameplay shorthand

Canonical first Timeline now follows:

```text
RNA
→ Self Replication
→ DNA
→ Membrane
→ Cell
→ Metabolism
→ Absorption / Symbiosis / Shell
→ Multicellularity + Adaptation Points
→ Nervous System
→ Cognition
→ Sapience
→ Tribe
→ Settlement
→ City
→ Industry
→ Modern
→ Atomic
→ Great Filter
→ Ash
→ Archive
```

The following late-design improvements remain canonical:

- generic Goal Engine;
- data-driven config/branching;
- save v1/recovery/autosave;
- dev simulation/time scale;
- telemetry;
- Stability/World Tension;
- Error 17;
- `Снова.`;
- Ash;
- Chronicle/Archive;
- idempotent reset;
- Timeline #2 meta progression.

---

## 5. Superseded early content

The following may exist in git history or implementation baseline, but are not current reconciled player-facing canon:

- starting Energy / Information wallet;
- Chemical Gradient;
- Catalytic Fold;
- Energy Pocket;
- Stable Bond old economic semantics;
- Sapience as a normal expensive E/B/I node at ~46 min;
- first branch Photosynthesis/Chemosynthesis/Absorption;
- second sibling branch purchase at ×2.5 in Timeline #1.

Historical references must be explicitly labelled `superseded`.

---

## 6. Implementation baseline

Accepted technical implementation baseline before content reconciliation:

`32c0d72f56f48a21e3c22c8e3eb9ef3975e967fb`

Meaning:

```text
KEEP architecture
KEEP Goal Engine
KEEP save/recovery
KEEP dev tools/simulation
REWORK early content/config
REBALANCE early gameplay
```

Iteration 4 is blocked until the dedicated biological 0–10 reconciliation implementation passes simulation + manual playtest.

---

## 7. Workflow

Current order:

```text
document reconciliation
→ approval
→ biological 0–10 code rework
→ rebalance
→ manual playtest
→ corrected Iteration 4
→ further design sessions
→ final design freeze v2
```

Before any Codex task, read `PROJECT_STATE.yaml` and the current iteration inputs.

Do not use old git revisions as design authority when active docs explicitly mark them superseded.