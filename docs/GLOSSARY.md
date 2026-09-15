# Хроники Эволюции — Glossary

Единый словарь терминов проекта.

Если термин используется в коде, документации и UI по-разному, это должно быть явно указано.

---

# Проект

### Хроники Эволюции

Основное название игры и проекта.

### Evolve

Исходный open-source проект, логика которого используется как база.

Не использовать `Evolve` как пользовательское название нового продукта.

---

# Основные игровые понятия

### Timeline

Один полный цикл существования отдельной цивилизации от возникновения жизни до ending/reset.

### Run

Технический/дизайнерский синоним Timeline.

### Reset

Завершение Timeline и переход к новой линии с сохранением meta progression.

Не трактуется как поражение.

### Prestige

Жанровый термин для reset-механики. В пользовательской подаче заменяется Архивом/Памятью.

---

# Архив

### Архив Жизни

Narrative framework + meta-progression interface + Chronicle storage.

### Оператор Архива

Роль игрока внутри fiction.

### Память Архива

Permanent/meta-система проекта.

### Archive Fragments / AF

Единственная spendable meta currency первого prestige-loop.

### Хроника

Журнал завершённых timelines, видов, milestones, решений, событий и endings.

---

# Биологическая progression

### RNA / РНК

Первый player-facing biological resource Timeline #1.

Используется в molecular progression и ведёт к Self Replication / DNA.

### Self Replication / Саморепликация

Переход от ручного primordial process к self-sustaining molecular production.

### DNA / ДНК

Второй player-facing genetic resource, открываемый через DNA Synthesis.

### Membrane / Мембрана

Core biological milestone перед Cell.

### Cell / Клетка

Первый крупный biological convergence milestone.

Target: примерно 9–11 мин после нового balance pass.

### Biomass / B

Ресурс клеточной и многоклеточной биологии, открываемый с Cell.

### Energy / E

Метаболический ресурс, который появляется **после Cell/Metabolism**.

Не является стартовой molecular currency reconciled Timeline #1.

### Information / I

Не является player-facing spendable currency reconciled Timeline #1.

Может использоваться только как внутреннее/концептуальное понятие информации, наследственности или complexity, если конкретная система этого требует.

### Adaptation Points / AP

Run-local discrete reward currency for optional biological adaptations.

- не производится `/sec`;
- выдаётся за milestones/side objectives;
- не нужна для core breakthroughs;
- сбрасывается с Timeline, кроме explicit Archive retention semantics.

### Metabolism / Метаболизм

Cell-stage system that introduces real Energy economy.

### Primary biological trait

Первая meaningful branch Timeline #1:

- Absorption / Поглощение;
- Symbiosis / Симбиоз;
- Shell / Панцирь.

Timeline #1 выбирает один primary trait.

### Photosynthesis / Фотосинтез

Optional metabolic adaptation, не primary first branch.

### Chemosynthesis / Хемосинтез

Optional metabolic adaptation, не primary first branch.

### Multicellularity / Многоклеточность

Переход от cell-level progression к организму и body systems.

Target: примерно 24–28 мин.

### Nervous System / Нервная система

Core transition that unlocks Behavior + Cognition.

### Cognition / Когниция

Meter `0..100`.

Получается через sensory/neural/social/tool-use development и отдельные events.

Не является spendable resource.

### Sapience / Разум

Condition-driven convergence from biological to civilization gameplay.

Requirement concept:

```text
core nervous-system prerequisites + Cognition >= 100
```

Target: примерно 38–40 мин.

Не покупается как обычный дорогой node за несколько currencies.

---

# Типы evolution node

### CORE

Обязательный узел progression.

### BRANCH

Meaningful specialization/path choice.

### OPTIONAL

Необязательная адаптация.

### CONVERGENCE

Качественный milestone/transition. Может быть condition-driven, а не обязательно обычной покупкой.

### ARCHIVE node

Permanent meta upgrade после reset.

---

# Цивилизация

### Population / Pop

Количество представителей цивилизации, доступных для jobs.

Не является обычной spendable currency.

После first Sapience civilization начинает с маленькой группы около 5 Population.

### Food / F

Главный early-civilization resource.

### Materials / M

Aggregate infrastructure/materials resource.

Wood/Stone/Metal не являются обязательными top-level currencies Timeline #1.

### Knowledge / K

Knowledge/research resource.

### Power / PWR

Industrial/electrical resource.

Становится полноценным active resource в Industry/electrification layer, а не сразу при City.

### Stability / ST

Internal crisis state `0..100`.

### World Tension / Напряжение мира

Player-facing crisis meter:

```text
World Tension = 100 - Stability
```

---

# Эры первого Timeline

### Molecular era

RNA → Self Replication → DNA.

### Cellular era

Membrane → Cell → Biomass → Metabolism → first primary trait.

### Multicellular era

Organism, AP adaptations, tissues/body systems.

### Cognition phase

Nervous System → Behavior → Cognition → Sapience.

### Tribe

Маленькая sapient group, first jobs, Food/basic structures.

### Settlement

Agriculture, houses, workshop, permanent infrastructure.

### City

Writing, research, market/trade-lite, governance profile.

### Industry

Mechanization, steam, factories, electrification, Power.

### Modern

Grid, research institutions, communications/global connection, Error 17.

### Atomic

Atomic Theory, reactor/lab program, Atomic Age, `Снова.`.

### Crisis / Great Filter

World Tension, crisis events, Last Protocol, inevitable first Ash.

---

# Финал / meta

### Ash / Пепел

Canonical first Timeline ending `ENDING_ASH`.

### Last Protocol / Последний протокол

Final crisis choice whose variants converge to Ash in Timeline #1.

### Error 17

Persistent Archive anomaly introduced during Modern phase.

### Archive Recall

Automatic post-first-reset familiar-path acceleration before Sapience.

### Retained adaptation

OPTIONAL biological node preserved by Archive semantics and activated only after original prerequisites.

### Hybridization

Future meta ability to combine primary/secondary biological traits across timelines.

---

# Superseded terminology

The following terms may appear in git history or historical reconciliation notes, but are **not current canonical player-facing early gameplay**:

- Chemical Gradient;
- Catalytic Fold;
- Energy Pocket;
- Stable Bond old economic semantics;
- Energy/Information as starting molecular wallet;
- Proto-cell as the old M06 name if referring to the superseded E/I ruleset;
- Sapience ~46 min as fixed first-run target.

Historical mentions must be marked as superseded when present in active docs.