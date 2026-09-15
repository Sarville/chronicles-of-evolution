# Хроники Эволюции — дерево технологий цивилизации Timeline #1

**Версия:** reconciliation revision 2.0  
**Статус:** canonical semantic tree / exact costs provisional.

---

# 1. Principle

Civilization tech remains data-driven, but reconciliation removes the assumption that every era requires a blocking 3-way paid branch.

Node roles remain:

- `branch`;
- `core_tech`;
- `upgrade`;
- `breakthrough`.

Era state is still separate from a purchased technology node.

---

# 2. Corrected high-level tree

```text
SAPIENCE
 ↓
Fire / Shared Survival
 ↓
TRIBE
 ├─ cultural profile [optional/event]
 ├─ distribution choice [event]
 ↓
Agriculture
 ↓
Permanent Settlement
 ├─ Irrigation / Masonry / Exchange [optional/profile]
 ↓
Writing
 ↓
Organized Labor / Research
 ↓
CITY
 ├─ government-lite [event]
 ├─ city specialization [optional/profile]
 ↓
Mechanization
 ↓
Steam / Factories / Rail
 ↓
Electrification / Power
 ↓
INDUSTRY
 ├─ Energy Crisis path [major event]
 ↓
Electrical Grid
 ↓
Research Institutions
 ↓
Communications / Global Connection
 ↓
MODERN CIVILIZATION
 ├─ pre-atomic specialization [optional/profile]
 ↓
Scientific Method
 ↓
Atomic Theory
 ↓
Reactor/Lab Program
 ↓
ATOMIC AGE
 ↓
CRISIS X*
```

---

# 3. Tribe technologies

Recommended core set:

- Fire;
- Cooperative/Shared Hunt or equivalent shared survival tech;
- Tribe breakthrough;
- Seed Selection;
- Agriculture.

Useful optional content:

- Craft;
- Oral Tradition;
- Role Division/presets.

A cultural identity choice can remain, but it must not block the player from learning basic jobs/buildings immediately after Sapience.

---

# 4. Settlement technologies

Core:

```text
Agriculture
→ Permanent Settlement
→ Writing
→ Division/Organization of Labor
→ City
```

Optional/profile:

- Irrigation;
- Masonry;
- Exchange;
- Storage/Pottery;
- Law;
- Accounting;
- Urban planning improvements.

If `Urban Planning` remains a core prerequisite, it should have clear player-facing meaning beyond `growth -0.01`. Otherwise it should become optional/supporting.

---

# 5. City / Industry technologies

Core:

```text
City
→ Mechanization
→ Steam
→ industrial infrastructure
→ Electrification
→ Industry
```

Optional/profile:

- Production City;
- Academic City;
- Energy-focused City;
- Standardization;
- Mass Education.

City specialization is not required to be a paid blocking branch. It can be represented by event/profile selection with a configured local effect.

---

# 6. Power unlock

Power is not a major active resource at City transition.

Canonical activation:

```text
Mechanization / Steam
→ Electrification / first Power infrastructure
→ Power becomes active top-level resource
```

This restores the original payoff of the Industry stage while keeping `Power` as the normalized resource name.

---

# 7. Modern bridge

Restore the semantic step removed by the late tree.

Core meanings:

- Electrical Grid;
- Research Institutions;
- Communications;
- Global Connection;
- modern logistics/automation.

Implementation may combine these into a small number of composite nodes/goals. The important design requirement is that the player experiences a scale transition before Atomic Age.

`ERROR 17` occurs in this phase.

---

# 8. Pre-Atomic tree

Recommended core:

```text
Modern Civilization
→ Scientific Method
→ Atomic Theory
→ Reactor/Lab Program
→ Atomic Age
```

Optional/profile ideas retained from late design:

- Electrification focus;
- Research Institutions focus;
- Mass Logistics focus.

These should affect route/profile without becoming a redundant mandatory branch on top of the Energy Crisis choice.

---

# 9. Atomic tangible requirement

Before `Atomic Age`, at least one player-visible reactor/lab project is required.

Possible data shape:

```text
A05 Atomic Theory
+ BLD/PROJECT_REACTOR_LAB complete
→ A06 Atomic Age available
```

This restores the original concrete progression without requiring two separate late-game buildings if one composite project is clearer.

---

# 10. Crisis boundary

Keep X-layer as crisis response, not ordinary economic tech progression.

Conceptual branches:

- Energy/resilience;
- Science/foresight;
- Strategic/control.

All converge to `ENDING_ASH` in Timeline #1.

No crisis node may cancel Ash on the first run.

---

# 11. Branch policy

A branch is justified only when it creates at least two of:

- different gameplay economics;
- different visuals;
- different event availability;
- persistent Chronicle/meta meaning;
- future route consequence.

Do not keep a branch solely because old tree structure had `A/B/C` symmetry.

---

# 12. Stable IDs

Existing IDs may be preserved where semantic identity survives.

If reconciliation changes semantic identity materially:

- prefer alias/migration;
- do not silently reuse one old ID for a different concept after release;
- pre-release implementation may remap IDs during the dedicated Rework Iteration.

Player-facing names are never persistence IDs.

---

# 13. Goal mapping

Canonical chapter mapping:

```text
Tribe goal → Fire/shared survival + Population/camp condition
Settlement goal → Agriculture + permanent buildings
City goal → Writing/research + City breakthrough
Industry goal → Mechanization/Steam/Power
Modern goal → Grid + research + communications/global connection
Atomic goal → Atomic Theory + Reactor/Lab + Atomic transition
Crisis goal → event chain / Last Protocol / Ash
```

Goal completion should not be reduced to buying a node when the fantasy is inherently composite.

---

# 14. Balance status

Exact old prices/effects from the previous T/S/I/A tree are **reference values only** until the new 38–108 simulation.

Keep as canonical now:

- semantic progression;
- technology/building distinction;
- state transition architecture;
- profile choices;
- Power timing;
- Modern bridge;
- tangible Atomic preparation.

Retune later:

- node costs;
- Population gates;
- branch multipliers;
- Power requirements;
- modern/atomic pacing.