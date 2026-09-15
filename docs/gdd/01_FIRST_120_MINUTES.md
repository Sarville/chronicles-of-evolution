# Хроники Эволюции — первые 120 минут

**Версия:** reconciliation v2.0  
**Статус:** canonical gameplay progression  
**Область:** Timeline #1, от первой устойчивой молекулы до Ash/reset.  
**Authority:** `docs/DECISIONS_RECONCILIATION.md`.

> Этот документ снова задаёт **смысловую progression** игры. Economy обязана балансировать эту progression, а не заменять её более удобными абстракциями.

---

# 1. Product promise первых 120 минут

Игрок должен прожить понятную причинно-следственную историю:

```text
RNA
→ replication
→ DNA
→ membrane
→ cell
→ biomass / metabolism
→ organelles / adaptations
→ multicellular organism
→ senses / mobility / digestion
→ nervous system
→ cognition
→ sapience
→ tribe
→ settlement
→ city
→ industry
→ modern civilization
→ atomic age
→ crisis
→ Ash
→ Archive / reset
```

Главный принцип biological phase:

> Не использовать абстрактный ресурс там, где игроку можно показать естественный предметный аналог.

---

# 2. Corrected timeline

| Окно | Стадия | Главный payoff |
|---:|---|---|
| 0–2 | Искра | RNA |
| 2–7 | Репликация | Self Replication, DNA |
| 7–12 | Первая клетка | Membrane, Cell, Biomass |
| 10–18 | Адаптация | Metabolism + первая branch |
| 18–28 | Многоклеточность | тело + Adaptation Points |
| 28–38 | Нервная система | Cognition layer |
| ~38–40 | Sapience transition | Civilization mode |
| 38–50 | Племя | Population / Food / Materials / Knowledge |
| 50–65 | Поселение | постоянные здания |
| 65–80 | Город | writing / research / trade-lite |
| 80–95 | Индустрия | mechanization / Power |
| 95–104 | Modern | grid / communications / global civilization |
| 104–108 | Атом | Atomic Theory / reactor program |
| 108–118 | Великий фильтр | World Tension / crisis / Last Protocol |
| 116–118 | Пепел | first ending |
| 118–120 | Архив | summary / AF / reset / Timeline #2 teaser |

Точные median timings будут подтверждены новым balance simulation после code reconciliation.

---

# 3. Resources by phase

## Molecular, 0–7

- **RNA** — основной видимый ресурс.
- DNA ещё locked.

## Cell, 7–18

- **RNA**;
- **DNA**;
- **Biomass** после Cell.

## Metabolic / multicellular, 10–38

- **DNA**;
- **Biomass**;
- **Energy** после Metabolism;
- **Adaptation Points** как milestone reward, не passive currency.

`Information` не является видимой spendable currency Timeline #1.

## Civilization

- Food;
- Materials;
- Knowledge;
- Population.

## Industry+

- Food supporting;
- Materials;
- Knowledge;
- Power;
- Population.

## Crisis

- Materials / Knowledge / Power;
- Stability internal;
- World Tension visible.

На mobile одновременно показывать только контекстно важные показатели.

---

# 4. 0:00–0:02 — RNA / Искра

## Objective

**Создайте первую устойчивую молекулу.**

Первое действие игрока запускает primordial reaction и создаёт RNA.

UX:

- успешное действие <20 секунд;
- действие ощущается как запуск реакции/process, а не бесконечный clicker;
- после нескольких действий открывается passive RNA formation;
- к концу блока игрок понимает, что жизнь начинает поддерживать процесс сама.

Milestone:

> «Молекула сохраняет форму.»

---

# 5. 0:02–0:07 — Replication / DNA

Core progression:

```text
Stable RNA
→ Self Replication
→ DNA Synthesis
```

Player-facing goals:

1. стабилизировать RNA production;
2. открыть Self Replication;
3. создать первые DNA;
4. усилить replication.

`Error Correction` может появиться как ранний OPTIONAL node, чтобы показать нелинейность дерева без блокировки core path.

Narrative payoff:

> «Информация научилась копировать себя.»

Manual input после Self Replication перестаёт быть главным источником прогресса.

---

# 6. 0:07–0:12 — Membrane / Cell

Core progression:

```text
DNA
→ Membrane
→ Cell
```

После Cell:

- unlock Biomass;
- cell становится главным visual object;
- появляются Ribosome / Protein Synthesis / Organelles hooks;
- старый molecular gameplay сворачивается в background production/history.

Milestone:

# ЖИЗНЬ

> Теперь система отделяет себя от среды и поддерживает собственные процессы.

---

# 7. 0:10–0:18 — Metabolism + first branch

После Cell открывается Metabolism и Energy как **реальная способность живой системы получать/использовать энергию**.

## First meaningful branch

### Поглощение

Identity:

- активный рост;
- сильная Biomass economy;
- predator/aggressive visual bias.

### Симбиоз

Identity:

- cooperation/internal efficiency;
- устойчивый passive growth;
- future research/social affinity.

### Панцирь

Identity:

- resilience;
- storage/survival;
- сниженные losses/risk later.

Timeline #1: выбрать один primary trait.

Поздние идеи `Photosynthesis` и `Chemosynthesis` сохраняются как **optional metabolic adaptations**, а не заменяют первую branch.

---

# 8. 0:18–0:28 — Multicellularity

Goal:

**Создайте сложный многоклеточный организм.**

Core requirements conceptually:

- достаточная Biomass;
- DNA/genetic complexity;
- several organelle/cell-system milestones.

## Adaptation Points

AP выдаются:

- за major biological milestones;
- за optional objectives;
- за exploration/behavior challenges.

AP тратятся на optional adaptations:

- Mobility;
- Sensory Cells;
- Digestion;
- Structural Tissue;
- later body-specific upgrades.

AP не производятся `/sec` и не нужны для обязательных breakthroughs.

Visual payoff: из cell colony формируется единый организм.

---

# 9. 0:28–0:38 — Nervous system / Cognition

Core progression:

```text
sensory development
→ neural tissue
→ nervous system
→ behavior
→ Cognition
```

## Cognition meter

```text
0..100
```

Источники Cognition:

- sensory upgrades;
- neural complexity;
- social behavior;
- object manipulation / tool-use precursor;
- selected mini-events.

Flavor events:

- **Опасность** — flee / confront;
- **Другой** — cooperate / conflict.

Они влияют на path profile и немного на Cognition, но не превращаются в обязательную visual-novel chain.

## Sapience

При `Cognition >= 100` и выполненных core nervous-system prerequisites:

# РАЗУМ ПРОБУДИЛСЯ

Sapience — milestone/convergence, **не обычная покупка за три currencies**.

---

# 10. Sapience transition

При переходе:

- biological production прекращает быть active main economy;
- evolutionary history остаётся в Evolution/Chronicle;
- UI меняет масштаб от организма к маленькой группе существ;
- стартовый Population ≈ **5**;
- открываются Food / Materials / Knowledge / Population.

Не использовать формулу конверсии остатка RNA/DNA/Biomass/Energy в 18–24 Population.

Допустим небольшой deterministic стартовый пакет F/M/K, но он задаётся новым balance pass, а не stock-farming exploit.

---

# 11. 38–50 — Tribe

Jobs first layer:

- Forager/Hunter;
- Gatherer;
- Thinker.

Caregiver может появиться позднее как optional/advanced role, а не обязательная четвёртая профессия с первой секунды civilization.

Buildings:

- Shelter;
- Campfire/Hearth;
- Food Store;
- Tool/Work area.

Primary goal:

- positive Food;
- Population growth;
- basic storage;
- first stable camp.

Civilization choice `Как делить добычу` сохраняется как narrative/profile decision.

---

# 12. 50–65 — Settlement

Core concepts:

- Farming;
- Housing;
- Workshop;
- Storage;
- first permanent roads/fields;
- Writing precursor.

Goal:

**Постройте постоянное поселение.**

Specializations Irrigation / Masonry / Exchange могут существовать как optional/recommended branch content, но не каждая Timeline обязана пройти ещё одну blocking branch только ради единообразия дерева.

`Следы до нас` остаётся canonical anomaly event.

---

# 13. 65–80 — City

Unlocks:

- organized labor;
- Writing;
- trade-lite;
- School/formal research;
- Market;
- government-lite choice.

Main resources остаются aggregate:

- Food;
- Materials;
- Knowledge;
- Population.

Wood/Stone/Metal могут быть internal categories, visuals или production breakdown, но не отдельные обязательные top-level currencies v1.

Government-lite:

- Council;
- Leader;
- Merchants.

Это profile choice; точные multipliers не должны скрыто ломать baseline economy.

---

# 14. 80–95 — Industry

Milestone:

# ЭПОХА МАШИН

Main concepts:

- Steam;
- Mechanization;
- factories;
- rail/logistics;
- automation;
- electricity;
- **Power becomes active resource here**.

Key goal:

**Электрифицируйте промышленную цивилизацию.**

Energy Crisis choice сохраняется:

- Fossil;
- Clean/Renewable;
- Early Atomic research.

Choice affects visuals, path profile and later crisis tags; numeric effects must be included explicitly in balance simulation.

---

# 15. 95–104 — Modern civilization

Короткая bridge phase должна быть видима, даже если не превращается в отдельную огромную tech tree.

Core meaning:

- electrical grid;
- modern research institutions;
- communications;
- global connection / regions;
- advanced logistics/automation;
- civilization becomes planetary/global in presentation.

`Radio` / `Computing precursor` могут быть combined milestones rather than mandatory grind nodes.

Здесь появляется `ERROR 17`.

---

# 16. 104–108 — Atomic transition

Core progression:

```text
Scientific Method
→ Atomic Theory
→ tangible reactor/lab program
→ Atomic Age
```

Milestone:

# МЫ РАСКОЛОЛИ МАТЕРИЮ

Archive anomaly:

> «Снова.»

then correction:

> «Событие зарегистрировано.»

On Atomic Age:

- Stability = 100;
- World Tension UI appears;
- crisis clock begins;
- first-run offline crisis progression freezes.

---

# 17. 108–118 — Great Filter

Internal state:

```text
Stability 100 → 0
```

Player-facing state:

```text
World Tension = 100 - Stability
```

Keep:

- conflict between blocs;
- false-warning event;
- shortages/pollution/atomic-risk tags;
- crisis response nodes;
- Last Protocol;
- minimum dramatic clamps;
- first Ash unavoidable.

Good play changes:

- timing inside allowed window;
- reward;
- Chronicle;
- subtype/epitaph;
- persistent flags.

It does not cancel Timeline #1 Ash.

---

# 18. Ash / Archive

All Last Protocol variants converge to:

```text
ENDING_ASH
```

with subtype/flags.

After cinematic:

- Timeline Summary;
- species/evolution profile;
- civilization profile;
- crisis decisions;
- Archive Fragments;
- Chronicle;
- clear list of preserved/reset state;
- Meta Tree;
- Timeline #2 teaser.

Reset is an ending of a civilization, not a failure screen.

---

# 19. Goal philosophy

Keep Goal Engine model:

- Current Goal: 30 sec–6 min;
- Chapter Goal: 10–25 min;
- Destiny Goal: run-scale.

Optional goals must provide meaningful rewards, especially Adaptation Points in biology.

Target time is telemetry, not hard completion.

---

# 20. Reward cadence

- 0–10: payoff every 30–90 sec;
- 10–30: meaningful unlock every 2–4 min;
- 30–60: visual/system payoff every 5–10 min;
- 60–120: major feature/milestone roughly every 10–15 min.

No invisible dead zone >5 min in the first 30 min.

---

# 21. Systems preserved from later design

This reconciliation **does not remove**:

- generic Goal Engine;
- optional objectives;
- data-driven config;
- branching infrastructure;
- save/recovery/autosave;
- dev simulation/time scale;
- telemetry;
- Stability/World Tension;
- Error 17;
- Ash;
- Chronicle;
- Archive/meta;
- idempotent reset;
- Timeline #2 concept.

Those systems now serve the restored gameplay progression instead of defining it.