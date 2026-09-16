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

### `DECISIONS.md` + addenda

Исторический реестр решений. Для reconciliation используются также:

- `DECISIONS_DS03.md`;
- `DECISIONS_DS04.md`;
- `DECISIONS_RECONCILIATION.md`.

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
├─ DECISIONS*.md
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
│  ├─ 00_NARRATIVE_BIBLE.md
│  ├─ 01_TIMELINE_01_SCRIPT.md
│  ├─ 04_STORY_EVENTS.md
│  ├─ 05_NARRATIVE_FLAGS.md
│  ├─ 06_ENDINGS_COPY.md
│  └─ 07_COPY_GUIDE.md
│
├─ ux/
│  ├─ 00_TIMELINE_PRESENTATION_MAP.md   # DS-05.5 bridge contract
│  └─ README.md                         # DS-06 plan
│
├─ art/
│  ├─ 00_VISUAL_STATE_MAP.md            # DS-05.5 bridge contract
│  └─ README.md                         # DS-07/08 plan
│
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

### Narrative copy / dramatic sequence

1. gameplay triggers/conditions from GDD
2. `scenario/01_TIMELINE_01_SCRIPT.md`
3. `scenario/04_STORY_EVENTS.md`
4. `scenario/06_ENDINGS_COPY.md`
5. `scenario/07_COPY_GUIDE.md`

Narrative docs may define presentation/copy but cannot silently create new gameplay gates.

### Presentation bridge — gameplay/narrative → UX/art

1. gameplay + scenario authorities above
2. `ux/00_TIMELINE_PRESENTATION_MAP.md` for presentation beats `PB00–PB30`
3. `art/00_VISUAL_STATE_MAP.md` for semantic world/creature states `V0–V9` / `C0–C7`
4. future accepted DS-06 UX docs for exact layout/interaction
5. future accepted DS-07 art docs for exact appearance
6. DS-08 asset manifest for production files

DS-06 may refine **layout**. DS-07 may refine **appearance**. Neither may silently change gameplay/narrative meaning already bound by the presentation contract.

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

Canonical first Timeline follows:

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

The following later-design improvements remain canonical:

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

## 5. Presentation shorthand

World visual progression:

```text
V0 Primordial
→ V1 Cellular
→ V2 Creature
→ V3 Sapient Tribe
→ V4 Settlement
→ V5 City
→ V6 Industrial
→ V7 Modern
→ V8 Atomic
→ V9 Ash
```

Creature continuity:

```text
C0 Proto-chemistry
→ C1 Protocell
→ C2 Cell
→ C2A/B/C Primary Trait
→ C3 Early Multicellular
→ C4 Multicellular Organism
→ C5 Adapted Organism
→ C6 Cognitive Organism
→ C7 Sapient Species
```

Detailed timing and screen mapping: `ux/00_TIMELINE_PRESENTATION_MAP.md`.

---

## 6. Superseded early content

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

## 7. Implementation status

Accepted technical foundation:

`32c0d72f56f48a21e3c22c8e3eb9ef3975e967fb`

Accepted biological 0–10 freeze reference:

`e0b2f5e8eb9e5433eb6c3b934fa048c7203537b1`

Iteration 4 implementation reference:

`79e7b93ea5bde181ff77ad8c6d281449cc5be1d8`

Iteration 4 is complete/user-confirmed. A subsequent consistency pass aligned G006/G007 with the canonical GDD/scenario and removed premature G008/G009/AP content. Exact 10–18 balance remains provisional until manual playtest.

Always read `PROJECT_STATE.yaml` for current implementation scope and caveats.

---

## 8. Current workflow

```text
reconciled gameplay baseline
→ biological 0–10 freeze
→ Iteration 4 complete
→ DS-05 narrative package
→ DS-05.5 presentation bridge
→ DS-06 UX
→ DS-07 art direction
→ DS-08 asset manifest / DS-09 audio
→ DS-10 analytics/platform
→ balance/regression
→ DS-11 design freeze v2
```

Before any Codex task, read `PROJECT_STATE.yaml` and the current iteration inputs.

Do not use old git revisions as design authority when active docs explicitly mark them superseded.
