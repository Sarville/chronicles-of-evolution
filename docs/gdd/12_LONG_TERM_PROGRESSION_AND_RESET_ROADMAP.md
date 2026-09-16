# Хроники Эволюции — долгосрочная progression и карта reset-эпох

**Статус:** accepted product roadmap (2026-09-16).
**Назначение:** связать PRD, первый Timeline и поздний Evolve-контент в один
канонический план. GDD `01–11` по-прежнему задают конкретные правила `T1`;
этот документ задаёт обязательный порядок возврата систем после первого Ash.

---

# 1. Принятое решение

`Timeline #1` на 0–120 минут — не весь продукт и не сокращённая замена Evolve. Это первый доказанный вертикальный срез продукта, который по PRD должен привести к нескольким видам, космосу и первому Bioseed за первые 8–12 часов активной игры.

Цель редизайна:

```text
сохранить механическую глубину Evolve
→ раскрывать её по слоям между reset-эпохами
→ не заставлять игрока многократно проходить один и тот же двухчасовой пролог
→ не держать 15–30 валют и десять экранов открытыми одновременно
```

Это означает:

- сохраняется **семейство механик**, а не обязательно каждая старая цифра, кнопка или название;
- core-loop, новые здания, технологии, события и пути должны входить не «когда-нибудь после релиза», а с привязкой к reset-эпохе;
- поздний слой остаётся бесконечным через коллекцию миров, видов, challenges, universe modifiers и routes, а не через бесконечное умножение цен;
- один run имеет законченную историческую арку, но после первого он становится существенно короче за счёт automation и уже изученных систем.

---

# 2. Почему документы сейчас создают ложное впечатление удаления

PRD требует сохранить evolution, ресурсы, jobs, buildings, tech, species traits, prestige, Bioseed, CRISPR-like meta, achievements, challenges, space, universes и поздние routes. Он же требует скрывать сложную биржу, шпионаж, религию, ARPA, challenge genes, сложную job optimization и secondary resources в первых runs.

Поздние GDD `01–11` правильно детализируют первый 120-минутный run, но почти не назначают срок возвращения скрытых систем. Поэтому отсутствие механики в этих GDD означает лишь «не входит в Timeline #1», а не «удалена из продукта».

После принятия этой roadmap источники читаются так:

1. `PRD.md` задаёт долгосрочное обещание продукта.
2. Этот документ задаёт порядок раскрытия систем после первого Ash.
3. GDD `01–11` задают конкретные правила Timeline #1.
4. Отдельный GDD для каждой эпохи уточняет числа, контент и UI до реализации.

---

# 3. Временной бюджет: глубина без месяцев до первого большого payoff

Время ниже — активное время, не календарное. Offline production сокращает ожидание, но не может автоматически принять choice, начать reset или завершить сюжетную арку.

| Epoch / завершённый run | Суммарное активное время | Target run time | Новый большой слой | Итог/reset |
|---|---:|---:|---|---|
| `T1` — Origin | 0–2 ч | 105–120 мин | жизнь → цивилизация → Atomic; базовая event deck | первый обязательный `Ash` |
| `T2` — Memory | 2–4 ч | 75–90 мин | species archetype, Archive Recall, базовая automation, achievements | второй Timeline с открытой развилкой |
| `T3` — Divergence | 4–6 ч | 85–100 мин | expanded traits, trade-lite, policies, side quests, первый альтернативный исход | Orbit route или альтернативный civilizational ending |
| `T4` — Sky | 6–8 ч | 100–120 мин | орбита, Moon, экспедиции, ранние ARPA projects, relics | подготовка `Exodus` |
| `T5` — Exodus | 8–12 ч | 120–150 мин | space economy, seed vessel, planet selection | первый `Bioseed` / новый мир |
| `P1+` — Worlds | 12–30 ч | 35–70 мин за world-cycle | planetary traits, full genetics, advanced automation, challenges | новые планеты, варианты исходов |
| `U1+` — Beyond | 30 ч+ | 45–90 мин за expedition/cycle | universes, anomaly realms, Black Hole, Truepath-like route | долгий meta/endgame |

Диапазоны не являются жёсткими таймерами. Они означают, что игрок не обязан провести десять одинаковых двухчасовых runs, чтобы увидеть космос. Первый Bioseed должен быть достижим ориентировочно за 5 содержательных runs и 8–12 часов активной игры; побочные quests, эксперименты с видами и неидеальная игра определяют положение внутри этого окна, а не компенсируют недостающий core content.

## Правило anti-repetition

Каждый новый Timeline обязан добавить одновременно:

1. один новый механический слой;
2. один новый meaningful route или тип решения;
3. один persistent unlock, сокращающий уже понятную рутину.

Если run не добавляет хотя бы два из трёх, он не должен быть обязательным порогом progression.

---

# 4. Карта reset-эпох

## `T1` — Origin: Ash как знакомство с формулой игры

**Сохраняет:** предметную биологию, jobs/buildings/tech, экономические bottlenecks, базовую population economy, Power, кризис и Chronicle.

**Добавляется сразу, а не после reset:**

- procedural minor/major event deck;
- authored branch/story/crisis events из GDD;
- несколько простых side objectives;
- первые achievements без требования собирать catalogue;
- trait/profile history в Chronicle.

Первый Ash остаётся неизбежным. Он нужен, чтобы игрок понял Archive, а не чтобы игра немедленно раскрывала все поздние правила.

## `T2` — Memory: быстрый знакомый путь, но другой вид

Перед новым стартом игрок выбирает один доступный **species archetype** и один Archive bias. Archetype меняет 1–2 производственных правила, event weights и визуальную тему, но не создаёт непроходимый балансный лабиринт.

Открываются:

- Archive Recall: знакомые biological costs/processes быстрее, но Cell, branches и Sapience всё ещё проживаются;
- auto-buy базовых producers/buildings и auto-assign базовых jobs;
- achievement/mastery panel и первые recommended objectives;
- дополнительная ветвь random events, связанная с выбранным archetype;
- один retained optional adaptation или точный genetic bias.

`T2` не обещает автоматически предотвратить Ash. Он показывает, что Archive влияет на путь, а не только прибавляет числа. Альтернативный ending становится доступной целью только после явно выполненных route conditions.

## `T3` — Divergence: цивилизация получает направления

Здесь возвращаются systems, которые в первом run были намеренно сведены к одному narrative choice:

- culture/government превращаются в компактные policy packages;
- trade-lite и contextual crafting становятся реальными производственными инструментами;
- открываются diplomacy/defense choices и первые military consequences;
- side quest slot становится постоянным;
- traits расширяются до комбинации species + adaptation + civilization profile.

Игрок выбирает один из первых путей окончания: сохранить биосферу, построить контрольную/экспансионную цивилизацию или выйти на Orbit route. Полный симулятор дипломатии и ручные бои здесь не нужны: выборы меняют производство, stability, доступные проекты, event deck и эпилог.

## `T4` — Sky: ранний космос как новый gameplay, а не финальная картинка

Открываются:

- orbit, Moon/outpost, telescopes и экспедиции;
- короткие asynchronous expedition jobs;
- новые contextual resources (helium, rare metals, artifacts), не в общей верхней панели;
- relics за route outcomes, anomalies и expeditions;
- первые ARPA-like mega projects как длинные, видимые цели;
- signal arc, связывающий космос с Archive.

Основной экран по-прежнему остаётся миром-диорамой. Карта экспедиций — отдельная компактная поверхность, а не второй симулятор на десятки вкладок.

## `T5` — Exodus: первый Bioseed

Bioseed — первый большой post-Ash payoff и новый тип reset, а не более дорогой Ash. Для него нужны выбранный route, space infrastructure, seed vessel и подходящий discovery package.

После Bioseed игрок получает:

- новую планету с biome/geology/atmosphere modifiers;
- новый species pool и новый набор event conditions;
- Chronicle world record;
- доступ к planetary resource variants;
- route-specific Archive/relic rewards.

Новая планета меняет условия familiar progression, но не требует заново учить базовый интерфейс. Первые 10–20 минут нового world-cycle ускорены automation и Archive Recall; затем планетные свойства создают свежие bottlenecks.

## `P1+` — Worlds: ширина оригинального Evolve начинает работать как коллекция

После первого Bioseed возвращаются полноценнее:

- несколько species archetypes и trait pools;
- genetics/CRISPR-like samples и trait recombination;
- advanced resources, market/contract trade и manufacturing chains;
- advanced jobs, governor rules и conditional production;
- planet traits, terraforming, ecology/industry tension;
- achievements/mastery как карта альтернативных способов играть;
- challenges как opt-in rule sets, а не обязательные grind walls.

World-cycle должен занимать 35–70 минут активной игры, а не 2 часа. Игрок выбирает следующий planet/challenge/route; повторять прошлую планету ради единственного обязательного +5% нельзя.

## `U1+` — Beyond: late game и бесконечная глубина

Последний слой возвращает самое широкое пространство оригинала:

- universe modifiers и challenge universes;
- galaxy/interstellar projects;
- Black Hole route;
- deep Archive mystery;
- Truepath-like way to break the cycle;
- anomaly realms, вдохновлённые Portal/Edenic/hell content;
- редкие late endings и hybrid routes.

Это не обязательный путь до Bioseed и не условие для базовой мобильной retention. Он строится как набор добровольных экспедиций и режимов для игроков, которым нужна старая Evolve-глубина.

---

# 5. Операционная карта: что именно появляется в каждом reset

Обозначение `unlock` ниже означает новый доступный gameplay после завершения
данного Timeline. Игрок может не выполнить желаемый route и получить `Ash`,
но контент не исчезает: он остаётся видимой целью следующего run, а не
рандомным скрытым лотерейным порогом.

## Первые пять Timelines

| Timeline | Outcome/reset по умолчанию | Persistent reward | Новые systems и permanent unlocks | Новые buildings / tech / jobs | Новая event deck |
|---|---|---|---|---|---|
| `T1 Origin` | `ENDING_ASH` обязателен | `Archive Memory I`, 14–18 AF, Chronicle первого вида | first branch, AP, Cognition, базовые side objectives, **minor/major events с начала run** | RNA/DNA/Cell; camp, storage, workshop, field, school, market, factory, grid, reactor; базовые jobs каждой эпохи | RNA meteor, DNA replication, nutrient bloom, membrane stress, harvest/shortage, fire, grid fault |
| `T2 Memory` | `ENDING_ASH_REMEMBERED`: Ash ещё возможен и не считается провалом | первый species archetype, `Archive Recall I`, 1 genetic bias, Mastery I | auto-buy базовых producers, auto-assign базовых jobs, achievement recommendations, один retained optional adaptation | Archive Relay, Gene Vault; `Archive Recall I`, `Auto Production I`, `Auto Assignment I`; species-specific producer modifier | species discovery, adaptive mutation, favorable habitat, inherited anomaly; ранние события получают новые weights |
| `T3 Divergence` | первый не-Ash route: `ENDING_GUARDIANS`; при невыполнении Ash всё равно открывает `T4` через Crisis Dossier | `Custodian Relic` **или** `Crisis Dossier I`, policy slot, route record | policies, trade-lite, contextual crafting, постоянный side-quest slot, diplomacy/defense resolution | Council Hall, Trade Post, Foundry Upgrade, Watchtower; ecology/industry policy, trade contract, civil defense project | trade convoy, civic tension, diplomatic offer, raid pressure, ecological recovery; выборы меняют Stability и route eligibility |
| `T4 Sky` | `ENDING_ORBIT`: цивилизация сохраняет запись и переводит Archive в орбитальный режим | `Orbital Charter`, expedition slot, first relic | orbit map, asynchronous expeditions, basic space contracts, early ARPA projects | Observatory, Spaceport, Orbital Relay, Lunar Outpost; telescope, rocketry, life-support, probe program | launch window, equipment failure, moon artifact, Archive signal, expedition discovery/risk |
| `T5 Exodus` | `ENDING_EXODUS` / первый `Bioseed` | new-world charter, planet record, planet-specific trait slot | planet selection, world ruleset pack, planetary resource variants, first cross-world collection | Seed Vault, Launch Complex, Seed Vessel, Planetary Survey; colonization protocol, seed genome, landing plan | departure anomaly, cryo failure/success, destination signal, landing conditions, first planetary discovery |

### `T1` — обязательная детализация

`T1` не должен быть только набором scripted milestones. В нём одновременно
работают authored GDD events и первая procedural deck. Это возвращает ранние
DNA/RNA rewards, но с новыми caps и fairness rules из раздела 7.

Глобальные counters остаются компактными. `wood`, `stone`, `iron`, `steel`,
fuel и аналогичные legacy resources входят как contextual inputs для
crafting/building sheets, когда открывается соответствующая эпоха. Они не
засоряют DNA/Cell экран и не исчезают из продукта.

### `T2` — конкретная разница, а не только ускорение

Первый выбор archetype предлагает три стартовых пакета:

| Archetype | Механическая идентичность | Визуальная тема | Event bias |
|---|---|---|---|
| Aquatic | надёжная Food/Biomass economy, зависимость от среды | прибрежный/водный мир | nutrient bloom, current shift |
| Mycelial | cooperation, storage, slow-but-stable Population | сеть/колонии | symbiosis, spore discovery |
| Verdant | passive Energy, ecology route | растительная/фотосинтетическая форма | sunlight, seasonal stress |

Synthetic не входит в первый выбор: он остаётся поздним route reward, чтобы
не превращать второй run в немедленный скачок от биологии к машинам.

### Failure-forward: переход `T3 → T4`

`Guardians` — желаемый исход `T3`, но не пропуск в `T4`. После любого
завершённого `T3` начинается `T4 Sky`:

- `ENDING_GUARDIANS` даёт `Custodian Relic`: экологический стартовый modifier,
  меньший риск части space events и доступ к preservation-планетам;
- Ash выдаёт `Crisis Dossier I`: Archive прямо показывает незакрытые причины
  collapse и открывает **Orbital Hypothesis** — новую главу, потому что один
  мир оказался недостаточным объектом спасения;
- `T4` не требует повторить `T3` ради идеального результата. Позднее
  `Guardians` можно получить на другой планете или в challenge-world и
  добавить в Chronicle.

Это общее правило roadmap: значимый ending улучшает следующий route, но
открытие нового gameplay-layer привязано к завершённой главе и накопленным
discovery, а не к безупречной игре. В каждом epoch допускается не более одной
обязательной fail-forward попытки; после неё следующий основной layer обязан
стать видимой доступной целью.

## После Bioseed: world-cycles с конкретным новым содержанием

| Cycle | Основной reset/outcome | Что открывается в этом cycle | Какой legacy-depth возвращается |
|---|---|---|---|
| `P1 Frontier` | `ENDING_SETTLEMENT_WORLD` или Ash на новой планете | biome/geology/atmosphere modifiers, advanced jobs, Gene Foundry, Planetary Survey | planet traits, расширенный species pool, environment-driven production |
| `P2 Shaping` | `ENDING_TERRAFORM` или route-specific alternative | Terraforming Lab, climate projects, ecology/industry balance, conditional governor rules | terraform family, advanced grid, storage and manufacturing chains |
| `P3 Network` | interplanetary route outcome | Interplanetary Exchange, relay network, multi-world relic contracts | full contract trade, governor, advanced ARPA projects, diplomacy between settlements |
| `C1 Challenge` | optional challenge completion, никогда не mandatory reset | challenge preset, mastery reward, unusual artifact/species mutation | original challenge philosophy без обязательных challenge genes в main path |
| `U1 Universe` | selected universe expedition | universe rule modifier, new anomaly world, rare ending component | universe types/affixes и alternate economic rules |
| `U2 Beyond` | Black Hole / Truepath-like route | interstellar map, anomaly realm, Archive-origin revelation | Galaxy, Portal/Edenic/Hell translation, Black Hole and late path systems |

`P1–P3` доступны последовательно, но `C1` становится optional после первого
нового мира. Это даёт глубину и replayability без обязанности проходить
десятки планет перед новым слоем.

## Каталог ending routes

| Ending | Первый возможный Timeline | Gameplay condition | Что меняет дальше |
|---|---|---|---|
| `Ash` | `T1` | неизбежен только в первом run; далее возможен при неудачной route | Archive Memory, анализ причин, новый шанс |
| `Ash Remembered` | `T2` | Ash после выбора archetype/Archive bias | фиксирует species learning и показывает, что память не всемогуща |
| `Guardians` | `T3` | высокие Stability/ecology, Custodian policy, выполненный preservation project | Custodian Relic, открывает экологические planetary options; `T4` начинает с лучшими условиями |
| `Orbit` | `T4` | Spaceport, probe program, signal discovery, Lunar Outpost | Orbital Charter, expedition layer |
| `Exodus` / Bioseed | `T5` | seed vessel, colonization protocol, planet target, expedition discoveries | новая планета и world-cycle |
| `Terraform` | `P2` | Terraforming Lab, climate stability, planetary projects | новый planet modifier and Harmony-like meta track |
| `Singularity`, `Empire`, `Ascension`, `Beyond` | `P2+` | отдельные machine/control/spiritual-anomaly routes | новые species/route/universe conditions, не просто другой текст финала |
| `Break the Cycle` | `U2+` | Truepath-like multi-universe conditions | late meta resolution; не обязательная финальная точка для обычного игрока |

---

# 6. Судьба механик оригинального Evolve

| Семейство оригинала | Решение | Когда становится полноценным | Упрощение для портального UX |
|---|---|---|---|
| Major/minor random events | **Вернуть сразу** | `T1` | два прозрачных deck-а, saved seed, cooldown и защита от повторов; выбор только для значимых событий |
| Evolution, tech, buildings, producers | **Вернуть сразу** | `T1` | progressive disclosure и chapter goals вместо длинной сырой таблицы |
| Jobs/population/food deficits | **Вернуть сразу** | `T1` | 3–4 релевантные профессии на эпоху, не весь список одновременно |
| Contextual resources, crafting, storage | **Вернуть поэтапно** | City в `T1`, глубже `T3+` | глобально 3–5 counters; wood/iron/steel видны только в нужной production sheet |
| Trade/market | **Вернуть** | trade-lite `T3`, full contracts `P1+` | не постоянная биржа; предложения, контракты и automation |
| Species, traits, biomes | **Вернуть** | archetypes `T2`, pools/planets `T5+` | несколько сильных архетипов вместо десятков мелких trait toggles в первом дне |
| Genetics, CRISPR, blood/gene pools | **Вернуть как Archive Genetics** | foundations `T2`, full `P1+` | одна понятная permanent screen; no opaque currencies at start |
| Achievements, feats, perks | **Вернуть** | visible `T1`, mastery `T2+` | рекомендуемые 3 цели, а не каталог из сотен скрытых иконок |
| Governor / automation | **Вернуть** | basic `T2`, conditional `T3+`, advanced `P1+` | automation освобождает внимание, но не играет critical choices за игрока |
| Government, diplomacy, warfare | **Вернуть по глубине** | policies `T3`, advanced routes `P1+` | no real-time combat or micromanaged armies; стратегии разрешаются через projects, readiness и event outcomes |
| Power grid / industry | **Вернуть** | compact `T1`, advanced grid `T3+` | одна понятная capacity/deficit модель вместо постоянной инженерной таблицы |
| Space, planets, galaxy | **Вернуть** | orbit `T4`, planets `T5`, galaxy `U1+` | expeditions/map as compact asynchronous layer; late art lazy-loaded |
| ARPA / mega projects | **Вернуть** | light `T4`, full `P1+` | несколько видимых projects, не огромный скрытый каталог |
| Bioseed / Terraform | **Вернуть** | Bioseed `T5`, terraforming `P1+` | каждый новый мир даёт качественный modifier, не только новый коэффициент |
| Challenges / universes | **Вернуть** | challenges `P1+`, universes `U1+` | opt-in, короткие rulesets с понятной наградой; не mandatory gate |
| Multiple resets/endings | **Вернуть как routes** | first alternatives `T3`, broad set `P1+` | каждый reset имеет Chronicle, reward, distinct next-run consequence |
| Portal, Edenic, Hell, True Path | **Сохранить как late anomaly routes** | `U1+` | переводить в язык Archive/anomaly realms; не тащить фэнтезийные вкладки в раннюю научную историю |
| Seasons, astrology, pet minutiae | **Трансформировать/сократить** | climate/world events `P1+` | сохранять влияние среды и редких discovery, не обязательные zodiac/pet subgames |
| Exact legacy balance, old reset formulae, legacy DOM | **Не переносить буквально** | никогда | переносить rule family и payoff только после нового balance/test pass |

`Удалить` в этом плане означает только три узких класса: дублирующие микросистемы без самостоятельного решения, непрозрачные старые формулы и геймплей, требующий постоянной мелкой ручной работы. Ни одна крупная progression-family из PRD не остаётся без назначенной эпохи.

---

# 7. Procedural events: обязательная механика первого Timeline

Random events не следует откладывать до `T2`. Они дают миру ощущение жизни, создают различия между runs и были частью исходного Evolve-loop.

## Два параллельных слоя

1. **Authored events** — branch, milestone, anomaly, crisis и история. Их trigger детерминирован, а значимый выбор может блокировать только ближайший шаг.
2. **Procedural deck** — condition-based minor и major события. Оно не подменяет authored arc и никогда не блокирует critical path случайным проигрышем.

## Первая deck в `T1`

| Window | Minor examples | Major examples | Правило эффекта |
|---|---|---|---|
| RNA/DNA | unstable molecule, useful fragment | RNA meteor, DNA replication | небольшой capped grant; DNA event возвращается здесь |
| Cell/organism | nutrient shift, membrane stress | adaptation opportunity, predation/environment pressure | local resource/profile effect; Shell действительно снижает риск/loss |
| Civilization | good harvest, shortage, rumor | fire, trade opportunity, civic tension | short production/stability effect; recoverable loss |
| Industry/space | equipment fault, discovery | energy disruption, expedition anomaly | explicit risk/reward, route flags или relic chance |

## Fairness rules

- stateful seeded RNG и deck state сериализуются в save;
- minor target cadence: примерно один результат раз в 2–4 минуты активной игры; major: раз в 7–12 минут, с phase-specific cooldown;
- один event ID не повторяется, пока deck не исчерпан или пока не истёк явный long cooldown;
- rewards не переполняют cap и не дают больше, чем один ближайший meaningful purchase; loss не может создать hard lock;
- offline simulation может накопить report, но не принимает choices;
- обычные events идут toast/brief sheet, decisions — в event panel;
- weights, preconditions, cooldowns, effects и choice outcomes живут в config, не в UI callback.

## Required domain contract

До следующей content-итерации нужен общий Event Engine: eligible-event query, weighted seeded draw, per-event cooldown/state, queue priority, atomic `RESOLVE_EVENT`, effects/choices и telemetry. Существующий `rng` port и event queue — правильное начало, но не сама механика.

---

# 8. Mobile / Яндекс Игры / VK: правила адаптации, а не упрощение глубины

## Экран и сессия

- на основном экране одновременно видны 3–4 главных ресурса, одна chapter goal и один primary CTA;
- secondary resources, recipes, trade offers, jobs и expeditions открываются контекстно в bottom sheet/панели;
- событие не должно появляться чаще, чем игрок успевает закрыть предыдущий meaningful payoff;
- late assets загружаются только с входом в соответствующую эпоху/карту;
- действия должны устойчиво переноситься между короткой mobile-сессией и desktop-web продолжением.

## Монетизация и честность

- baseline progression, reset, Archive Fragment, random event reward и critical choice никогда не требуют рекламы;
- rewarded допустим только для optional acceleration: offline multiplier, expedition speed, reroll quest, brief temporary intervention или второй cosmetic/relic roll;
- fullscreen допустим в естественной паузе: ending, перелёт, закрытая глава; никогда не перед branch/crisis choice и не в первые 15 минут;
- daily/challenge systems — opt-in variety, не список обязательных chores.

## Telemetry gates

Перед открытием каждого нового epoch проверяются: p25/p50/p75 времени до reset, abandonment before new layer, frequency/choice rate of event deck, доля ручных действий, use of automation, species/route diversity и crash/save recovery. Новый контент не лечит плохой первый loop скрытым ускорением.

---

# 9. Архитектурные пакеты реализации

## Package A — сейчас, до расширения biological content

1. Event Engine и первая RNA/DNA/Cell deck.
2. Persisted RNG/deck state; save migration and deterministic tests.
3. Content unlock registry (`meta.unlocks`, route eligibility, content packs), чтобы поздние системы не проверяли магические `timelineId` по всему коду.
4. Chronicle schema, способная хранить ending, species, world, route и event-history.

## Package B — завершение `T1`

1. Iteration 5–12 из текущего roadmap: AP, Cognition, Tribe, Civilization, Industry, Modern, Crisis, Ash.
2. Basic random deck расширяется вместе с эпохами.
3. Job/building/Power data model не завязывается на один единственный world.

## Package C — `T2` и `T3`

1. Archive Recall, archetype selection, starter genetic bias.
2. Achievements/mastery, side quests, basic automation.
3. Policy, trade-lite, contextual crafting, diplomacy/defense route.
4. Alternative ending eligibility и Chronicle comparison.

## Package D — `T4` и `T5`

1. Expedition/Orbit domain and compact map UI.
2. Relics, early ARPA projects, space resource contracts.
3. Bioseed transaction, planet generation, new-world ruleset packs.
4. Planet/route-specific event deck and presentation state.

## Package E — `P1+` и `U1+`

1. Genetics, advanced governor, market contracts, terraforming.
2. Challenge framework and universe modifier packs.
3. Interstellar, Black Hole, anomaly realm and Truepath-like routes.
4. Continuous content rotation: new species, planets, events, achievements and challenge presets without changing the core save schema.

Each package requires headless simulation, mobile UI smoke, save migration tests and a focused playtest before the next package opens.

---

# 10. Decisions intentionally deferred, but no longer unowned

| Decision | Owner epoch | Must be decided before |
|---|---|---|
| numerical gates for `Guardians`, `Orbit` and `Exodus` routes | `T3–T5` design GDD | implementation Package C/D |
| exact output/cost balance of the three T2 archetypes | `T2` species GDD | archetype selection UI |
| policy/diplomacy/defense resolution model | `T3` civilization extension GDD | first non-Ash ending |
| orbit economy and expedition duration | `T4` space GDD | expedition runtime |
| Bioseed planet generation and reward formula | `T5` Bioseed GDD | reset transaction Package D |
| challenge/universe modifier catalogue | `P1/U1` GDD | challenge framework |
| translation or exclusion of each Portal/Edenic/Hell legacy fantasy | `U1` narrative + product review | anomaly-realm production |

---

# 11. Acceptance criteria for this roadmap

This plan is ready to become canonical only when product review confirms that:

- Release 1 targets the first Bioseed, not only the Timeline #2 teaser;
- procedural random events return in `T1`;
- every major original system family has one of: return epoch, explicit transformation, or explicit exclusion reason;
- a player can reach Bioseed in 8–12 active hours without repeating a two-hour opening more than once;
- late-game depth comes from worlds, traits, challenges, universes and routes, rather than mandatory months of number inflation;
- platform constraints never turn ads, daily chores or hidden waits into a progression gate.

Статус, TODO, source-of-truth hierarchy и план полной пересборки `T1`
синхронизированы с этим решением. Следующий implementation step —
`T1-0 Foundation + Event Engine`, а не отдельная точечная итерация после Cell.
