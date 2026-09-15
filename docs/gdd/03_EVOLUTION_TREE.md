# Хроники Эволюции — дерево эволюции

**Версия:** reconciliation v2.0  
**Статус:** canonical progression graph  
**Authority:** `DECISIONS_RECONCILIATION.md`.

---

# 1. Tree philosophy

Tree remains data-driven and keeps four semantic node types:

- **CORE** — обязательный evolutionary step;
- **BRANCH** — meaningful path choice;
- **OPTIONAL** — skippable adaptation;
- **CONVERGENCE** — qualitative transition to a new stage.

Но типы node — это техническая структура, а не шаблон, который заставляет каждую эпоху иметь одинаковые три branch и одинаковую purchase economy.

---

# 2. Canonical first-run map

```text
M01 Stable RNA
 ↓
M02 Self Replication
 ↓
M03 DNA Synthesis
 ├─ M04 Error Correction [OPTIONAL]
 ↓
M05 Membrane
 ↓
M06 CELL
 ↓
C01 Metabolism
 ├─ C02A Absorption [PRIMARY BRANCH]
 ├─ C02B Symbiosis [PRIMARY BRANCH]
 └─ C02C Shell [PRIMARY BRANCH]
 ↓
C03 Protein Synthesis / Ribosome
 ├─ C04A Photosynthesis [OPTIONAL]
 ├─ C04B Chemosynthesis [OPTIONAL]
 └─ C04C Efficient Digestion [OPTIONAL]
 ↓
C05 Organelles
 ↓
C06 Cell Coordination
 ↓
C07 MULTICELLULARITY
 ↓
B01 Body Systems
 ├─ B02A Mobility [OPTIONAL / AP]
 ├─ B02B Sensory Cells [OPTIONAL / AP]
 ├─ B02C Digestion [OPTIONAL / AP]
 └─ B02D Structural Tissue [OPTIONAL / AP]
 ↓
B03 Tissue Specialization
 ↓
B04 Nervous Tissue
 ↓
B05 NERVOUS SYSTEM
 ↓
N01 Behavior
 ├─ N02A Solitary strategy
 ├─ N02B Social behavior
 └─ N02C Object manipulation
 ↓
N03 Neural Complexity
 ├─ N04 Social Signaling [OPTIONAL]
 ├─ N05 Proto-language [OPTIONAL/CORE contributor]
 └─ N06 Tool Use [OPTIONAL]
 ↓
Cognition 0..100
 ↓
N07 SAPIENCE [CONVERGENCE CONDITION]
 ↓
TRIBE → SETTLEMENT → CITY → INDUSTRY → MODERN → ATOMIC → CRISIS → ASH → ARCHIVE
```

IDs after `Mxx` are reconciliation canonical for documentation; implementation migration details are handled in the Rework Iteration. Existing stable IDs may receive aliases where needed.

---

# 3. Biological currencies and gates

## Core biological resources

- RNA;
- DNA;
- Biomass;
- Energy after Metabolism.

## Adaptation Points

AP are discrete rewards.

They can be used by optional biological nodes tagged:

```text
cost_class: adaptation_point
```

Core nodes cannot require AP.

## Information

`Information` is no longer a player-facing tree currency. Genetic/information complexity may exist as derived state/tag but not as a universal spendable wallet.

---

# 4. Era I — molecular life

| ID | Node | Type | Canonical role |
|---|---|---|---|
| M01 | Stable RNA | CORE | first stable molecular system; passive RNA foundation |
| M02 | Self Replication | CORE | replication/automation transition |
| M03 | DNA Synthesis | CORE | unlock DNA |
| M04 | Error Correction | OPTIONAL | fidelity / mutation-quality bonus; must remain skippable |
| M05 | Membrane | CORE | isolate internal environment |
| M06 | Cell | CONVERGENCE | unlock Biomass, cell visual state, metabolism path |

Exact costs/effects: **TBD by corrected 0–10 balance pass**.

Hard rules:

- no Chemical Gradient / Catalytic Fold / Energy Pocket player-facing producers;
- no Energy/Information payment contract for M01–M06;
- optional M04 may not block M05/M06.

---

# 5. Era II — Cell

## C01 Metabolism

CORE unlock that introduces Energy as a real metabolic resource/process.

## First branch — organism identity

| ID | Node | Type | Identity |
|---|---|---|---|
| C02A | Absorption | BRANCH | fast biomass acquisition / predatory bias |
| C02B | Symbiosis | BRANCH | cooperation / internal efficiency / stable growth |
| C02C | Shell | BRANCH | resilience / storage / reduced event losses |

Timeline #1 chooses one primary branch. Siblings are not purchasable for `×2.5`; hybridization is future meta functionality.

## Optional metabolic adaptations

| ID | Node | Type | Meaning |
|---|---|---|---|
| C04A | Photosynthesis | OPTIONAL | passive/steady Energy identity |
| C04B | Chemosynthesis | OPTIONAL | environment-independent Energy identity |
| C04C | Efficient Digestion | OPTIONAL | conversion/Biomass identity |

These preserve useful late-design ideas without replacing the original first branch.

## Core cell trunk

```text
Metabolism
→ primary branch
→ Protein Synthesis / Ribosome
→ Organelles
→ Cell Coordination
→ Multicellularity
```

Exact prerequisites/costs remain config-driven and are set during 10–28 balance design.

---

# 6. Era III — multicellular organism

Multicellularity opens body adaptations.

## AP adaptations

| Node | Typical cost class | Purpose |
|---|---|---|
| Mobility | 1–2 AP | movement, active encounters, Energy use |
| Sensory Cells | 1–2 AP | perception, Cognition contribution |
| Digestion | 1–2 AP | Biomass efficiency |
| Structural Tissue | 1–2 AP | resilience/body complexity |

Player should be able to buy several but not necessarily all before Sapience.

Core trunk:

```text
Body Systems
→ Tissue Specialization
→ Nervous Tissue
→ Nervous System
```

Optional adaptations modify form/profile and future Cognition contributions but cannot soft-lock core progression.

---

# 7. Era IV — behavior / Cognition / Sapience

After Nervous System the tree changes from simple purchase progression to a **condition-driven convergence**.

## Behavior choice

Keep useful identities from late design:

- Solitary specialization;
- Social behavior;
- Object manipulation.

This choice affects profile, visual behavior and Cognition sources.

## Cognition contributors

Potential nodes/effects:

- Neural Complexity — core;
- Social Signaling — optional/contributor;
- Proto-language — major contributor;
- Tool Use — contributor;
- advanced senses — contributor;
- behavior mini-events — small contributor.

## N07 Sapience

Type:

```text
CONVERGENCE / condition milestone
```

Condition:

```text
required nervous-system core complete
AND cognition >= 100
```

No direct resource price is required on the final Sapience milestone itself.

---

# 8. Civilization tree principles

Civilization remains data-driven, but mandatory branch density is reduced.

## Core trunk

```text
Fire / shared survival
→ Tribe
→ Agriculture / permanent settlement
→ Writing / organized labor
→ City
→ Mechanization / steam
→ Industry
→ Electrical grid / modern research / communications
→ Modern civilization
→ Atomic Theory / reactor program
→ Atomic Age
```

## Optional/profile choices retained

- cultural tradition;
- distribution of resources;
- settlement specialization;
- government-lite;
- city specialization;
- energy path;
- pre-atomic specialization.

Not every profile choice must be a blocking paid branch node. Events may write profile flags without adding another economic gate.

---

# 9. Civilization resources

- Food;
- Materials;
- Knowledge;
- Population;
- Power from Industry/electrification onward.

No biological E/I/B currency carries forward as active civilization wallet.

---

# 10. Modern and Atomic

Restore a visible Modern bridge.

Recommended progression semantics:

```text
Industry
→ Electrical Grid
→ Research Institutions
→ Communications / Global Connection
→ Modern Civilization
→ Scientific Method
→ Atomic Theory
→ Reactor/Lab Program
→ Atomic Age
```

Some of these may be composite goals rather than separate grind nodes.

---

# 11. Crisis layer

Keep `X*` crisis response architecture conceptually:

- energy/resilience response;
- science/foresight response;
- control/strategic response;
- final `X99 Ash` convergence.

Exact previous prices are provisional until full late-game regression simulation.

Timeline #1 no X-node can prevent Ash.

---

# 12. Archive tree reconciliation

Archive node concepts remain, but effects referencing removed resources must be rewritten.

Keep concepts:

- early familiar-path acceleration;
- retained OPTIONAL adaptation;
- cross-evolution/hybridization;
- culture inheritance;
- crisis foresight;
- secondary trait slot;
- deeper Archive lore;
- post-Ash route.

Examples requiring rewording:

- old `AR01 starting Energy production` → early biological production/replication bonus compatible with RNA canon;
- old `AR02 starting Information +10` → starting genetic/replication advantage compatible with DNA/RNA canon;
- old AR06 `remove ×2.5 cellular branch penalty` → permission to unlock a second primary biological trait under meta rules.

Final numeric effects live in `10_META_PROGRESSION.md` after corrected first-run balance exists.

---

# 13. Branch effect guardrails

For Timeline #1:

- branch should change identity/visuals, not only one multiplier;
- numerical benefit usually 10–25% in its specialty;
- disadvantage should not exceed ~10–15%;
- no branch may move first reset outside broad 110–130 min regression window;
- optional nodes must truly be skippable;
- no hidden prerequisite via balance pressure.

---

# 14. Data contract

Keep data-driven structure:

```js
{
  id,
  era,
  semanticRole,
  requiresNodes,
  cost,
  effects,
  branchGroup,
  adaptationPointCost,
  cognitionContribution,
  unlocks,
  transition
}
```

Only fields relevant to a node are present.

Example condition-driven Sapience:

```js
{
  id: 'N07',
  semanticRole: 'convergence',
  requiresNodes: ['B05', 'N03'],
  conditions: [
    { type: 'meter_at_least', id: 'cognition', value: 100 }
  ],
  transition: 'SAPIENCE'
}
```

---

# 15. What remains from late tree design

Keep:

- CORE/BRANCH/OPTIONAL/CONVERGENCE taxonomy;
- stable IDs where semantic identity survives;
- data-driven prerequisites/effects;
- optional M04-style early choice;
- branch history;
- retained traits;
- Archive hybridization;
- future tree silhouettes/discovery.

Remove the assumption that every evolutionary idea must be bought from the same universal wallet.