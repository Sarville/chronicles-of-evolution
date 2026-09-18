# Хроники Эволюции — долгосрочная progression и карта эпох

**Статус:** accepted product roadmap (2026-09-16), переписан под act-structure (2026-09-17).
**Назначение:** связать PRD, Act 1 (`T1–T5`) и поздний Evolve-контент в один
канонический план. GDD `01–11` по-прежнему задают конкретные правила `T1–T5`;
этот документ задаёт обязательный порядок возврата систем после каждого
reset и общую архитектуру продукта.

**Authority:** `docs/DECISIONS_ACT_STRUCTURE.md` — этот документ реализует
решения `ACT-001`…`ACT-007` и не переопределяет их. При расхождении
приоритет у `DECISIONS_ACT_STRUCTURE.md`.

---

# 1. Принятое решение

Продукт состоит из трёх актов, а не из лестницы одинаковых по форме
Timelines:

```text
Act 1 (T1–T5, ~3–4 ч суммарно)
  пять коротких причинно связанных попыток одной и той же цивилизационной
  дуги (Molecular → Atomic), каждая короче полного прогона и гибнет по
  своей, причинно связанной со прошлой попыткой, причине.
→ Act 2 (P1–P3, ~20–40 мин каждый)
  Архив пробует срезать путь: не растить цивилизацию с нуля, а войти в уже
  зрелую, но структурно однобокую цивилизацию и довести/направить её к
  собственному специфическому краху.
→ Act 3 (открытый финал)
  после любой попытки Act 2 Архив заключает, что ни «медленно с нуля», ни
  «срезать путь через готовую цивилизацию» не работает, и открывает полный
  набор механик — адаптированный оригинальный Evolve (расы/traits,
  multi-currency prestige, universes, challenge modifiers, ARPA-эквивалент,
  поздние resets).
```

Цель редизайна остаётся прежней:

```text
сохранить механическую глубину Evolve
→ раскрывать её по слоям между reset-эпохами
→ не заставлять игрока многократно проходить один и тот же двухчасовой пролог
→ не держать 15–30 валют и десять экранов открытыми одновременно
```

Это означает:

- сохраняется **семейство механик**, а не обязательно каждая старая цифра, кнопка или название;
- core-loop, новые здания, технологии, события и пути входят с привязкой к конкретной главе `T1–T5`, а не «когда-нибудь после релиза»;
- поздний слой остаётся бесконечным через коллекцию миров, видов, challenges, universe modifiers и routes в Act 3, а не через бесконечное умножение цен внутри Act 1;
- Act 1 имеет законченную историческую арку (пять попыток одной и той же дуги), но каждая попытка короче предыдущей эры, а не длиннее.

---

# 2. Почему документы сейчас создают ложное впечатление удаления

PRD требует сохранить evolution, ресурсы, jobs, buildings, tech, species traits, prestige, Bioseed-эквивалент, CRISPR-like meta, achievements, challenges, space, universes и поздние routes. Он же требует скрывать сложную биржу, шпионаж, религию, ARPA, challenge genes, сложную job optimization и secondary resources в первых попытках.

Ранние GDD `01–11` правильно детализируют геймплей `T1–T5`, но почти не назначают срок возвращения скрытых систем. Поэтому отсутствие механики в этих GDD означает лишь «не входит в Act 1», а не «удалена из продукта».

После принятия этой roadmap источники читаются так:

1. `PRD.md` задаёт долгосрочное обещание продукта.
2. `DECISIONS_ACT_STRUCTURE.md` задаёт трёхактный каркас и причинную цепочку `T1–T5`.
3. Этот документ задаёт порядок раскрытия систем после каждого reset внутри и после Act 1.
4. GDD `01–11` задают конкретные правила Act 1.
5. Отдельный GDD для каждой главы/эпохи уточняет числа, контент и UI до реализации.

---

# 3. Временной бюджет Act 1: пять глав вместо пяти Timelines

Время ниже — активное время, не календарное. Offline production сокращает ожидание, но не может автоматически принять choice, начать reset или завершить сюжетную арку.

Каждая глава — **полный replay с RNA** (`DECISIONS_ACT_STRUCTURE.md`
ACT-002, скорректировано 2026-09-18), не старт с гранта. Уже пройденный
участок сжимается Archive Recall и подаётся своим, более крупным recap
(`docs/gdd/07_GOALS_AND_MILESTONES.md` §5–8), а не буквально переигранным
прежним чек-листом.

| Глава | Era cutoff | Target total time (от RNA) | Новый слой этой главы | Reset/collapse |
|---|---|---:|---|---|
| `T1` — Origin | 5 — `TRIBE` | ~20 мин | жизнь → первая группа; базовая authored+procedural event deck | `Мор` (эпидемия) |
| `T2` — Одиночки | 6–7 — `SETTLEMENT` | ~25 мин | species skin swap #1 (на событии `C02A/B/C`) | `Катаклизм` |
| `T3` — Крепость | 8 — `CITY` | ~30 мин | крепость строится как новый контент главы, policy-lite | `Раскол` (внутренний конфликт) |
| `T4` — Большой мозг | 9–10 — `INDUSTRY/MODERN` | ~35 мин | species skin swap #2 (на событии `C02A/B/C`) | `Авария` (техно-катастрофа) |
| `T5` — Синтез | 12 — `ATOMIC` + Great Filter | ~40 мин | возврат к исходному виду, синтез уроков T1–T4, T5-only procedural deck | `Пепел` (обязательный первый Ash) |

Суммарно Act 1 занимает целевые ~3–4 часа активной игры вместо старых ~8–12
часов до первого Bioseed. Диапазоны — telemetry-ориентиры, а не жёсткие
таймеры; точный минутный бюджет каждой главы фиксируется после реализации и
playtest (см. `DECISIONS_ACT_STRUCTURE.md` §ACT-006), и зависит от ещё не
реализованных Archive Recall-коэффициентов.

## Правило причинной цепочки

Каждая глава `T2–T5` обязана:

1. в конце своего recap-а (порог между уже виденным и новым) нести
   короткую Archive-реплику, явно отсылающую к причине гибели предыдущей
   главы — не стартовый грант, а признание задним числом, что что-то было
   поправлено за время сжатого прогона;
2. эта правка обязана создавать новую, отличную от предыдущей, уязвимость (не повторять тот же collapse дважды подряд);
3. заканчиваться причиной гибели, которая логически вытекает из этой новой уязвимости, а не из внешнего произвольного события.

Правило anti-repetition из старой версии документа (два из трёх: новый
механический слой / новый meaningful route / persistent unlock) сохраняется
для `P1–P3` и Act 3, но внутри Act 1 заменяется причинной цепочкой выше —
пять глав уже не должны экономически оправдывать своё существование по
отдельности, они образуют одну историю.

---

# 4. Карта глав Act 1

## `T1` — Origin: первая попытка

**Стартовое условие:** нет — baseline-попытка, без правки Архива.

**Сохраняет:** предметную биологию, jobs/buildings/tech до Tribe,
экономические bottlenecks, базовую population economy, Chronicle.

**Добавляется сразу:**

- procedural minor event deck на молекулярном окне (уже реализовано);
- authored branch/story события GDD `04–08`;
- первые achievements без требования собирать catalogue.

**Новая уязвимость, которую создаёт baseline-старт:** плотная жизнь племени
без ответа на эпидемиологию.

**Reset:** `Мор` — эпидемия обрывает первую попытку вскоре после Tribe
milestone. Не является наказанием игрока: это структурная уязвимость
самого первого, ничем не защищённого старта.

## `T2` — Одиночки: RNA-replay, recap крупнее

**Начало:** RNA, как `T1` — нет гранта. Recap RNA→Tribe свой, крупнее
`G001–G015`, с 1–2 новыми Archive-репликами. У Tribe-порога короткая
реплика, отсылающая к `Мор` (не грант — признание задним числом, что
что-то было поправлено за время сжатого прогона).

**Species swap #1:** на существующем событии выбора primary trait
(`C02A`/`C02B`/`C02C`) — Архив сам предлагает другую ветку. Косметическая
смена вида (skin/label + 1–2 flavor способности); полная глубина traits
отложена до Act 3.

**Новая уязвимость:** рассредоточенные группы не могут скоординировать
коллективную защиту.

**Reset:** `Катаклизм` — природная катастрофа (землетрясение/наводнение/
нестабильная геология), с которой разрозненные группы не справляются
вместе.

## `T3` — Крепость: RNA-replay, recap ещё крупнее

**Начало:** RNA. Recap теперь покрывает `T1`+`T2` целиком (RNA→Settlement),
крупнее recap `T2`. У Settlement-порога реплика, отсылающая к `Катаклизм`.
Оборонительные структуры не выдаются — строятся как обычный новый контент
главы (`Заселите крепость`).

**Новая уязвимость:** безопасность снова концентрирует население — и
вместе с ней возвращается теснота и внутреннее напряжение.

**Reset:** `Раскол` — внутренний конфликт/фракционный раскол внутри
укреплённого поселения, не внешняя угроза.

## `T4` — Большой мозг: RNA-replay, recap покрывает T1–T3

**Начало:** RNA. Recap покрывает `T1–T3` целиком (RNA→City). У
City-порога реплика, отсылающая к `Раскол`. Повышенный Cognition/Writing не
выдаются — достигаются как обычный новый контент главы.

**Species swap #2:** на том же событии `C02A/B/C` — второй и последний skin
swap Act 1; после `T5` бюджет свопов исчерпан, `T5` возвращается к исходной
линии.

**Новая уязвимость:** цивилизация обгоняет собственную способность
управлять своей технологией.

**Reset:** `Авария` — техно-катастрофа (каскадный отказ инфраструктуры/
автоматики), а не внешний враг и не классический Ash.

## `T5` — Синтез: Архив вмешивается напрямую

**Начало:** RNA. Recap покрывает `T1–T4` целиком (RNA→Industry/Modern),
крупнее recap `T4`. На пороге между recap-ом и Atomic-контентом Архив
прямо вмешивается (`EV-NAR-08` «Синтез»), синтезируя уроки `T1–T4`, и
возвращает исходную видовую линию (бюджет species swap потрачен).

**Reset:** `Great Filter` / обязательный первый `Ash` — уже реализованный
контент (`T1-5…T1-6` в старой нумерации пакетов), теперь поданный как
итог четырёх предыдущих «исправимых» смертей против одной
неисправимой, экзистенциальной.

`T5` — единственная глава Act 1, где обязателен `Ash`; `T1–T4` заканчиваются
каждая своим уникальным reset, ни один из них не переиспользует `Ash`.

---

# 5. Что появляется в каждой главе

| Глава | Persistent reward | Новые systems/unlocks главы | Новая event deck |
|---|---|---|---|
| `T1 Origin` | выбор 1 из 3 T1-перков (Archive Recall), Chronicle первой попытки | first branch, AP, Cognition, базовые side objectives | authored RNA/DNA/Cell + Tribe deck (уже реализовано) |
| `T2 Одиночки` | species skin #1, защитный перк + выбор 1 из 3 T2-перков | свой recap RNA→Tribe, coordination-vs-isolation choices | cataclysm-readiness flavor events |
| `T3 Крепость` | защитный перк + выбор 1 из 3 T3-перков, запись в Chronicle | крепость строится как новый контент главы, early policy choice (unity vs control) | internal-tension flavor events |
| `T4 Большой мозг` | species skin #2, защитный перк + выбор 1 из 3 T4-перков, запись в Chronicle | Writing/culture и Cognition достигаются как новый контент главы, automation risk choices | techno-catastrophe-adjacent flavor events |
| `T5 Синтез` | выбор 1 из 3 постоянных endgame-перков, полный Timeline Summary | Great Filter/crisis flow (реализовано), **T5-only procedural random event deck**, синтез-flashback события, ссылающиеся на T1–T4 | authored crisis events (реализовано) + новая procedural deck §7 |

**Скорректировано 2026-09-18:** нет AF/валюты в Act 1-2 — persistent reward
каждой главы — только Archive Recall перки (`docs/gdd/10_META_PROGRESSION.md`
§4), не AF-пакет. После `T5` игрок переходит в Act 2 (`P1–P3`), где
persistent reward Act 1 (накопленные Archive Recall перки, Chronicle пяти
попыток, до двух species skins) продолжает действовать, но не становится
денежным стартовым капиталом — валюты начинаются только с Act 3.

---

# 6. Act 2 (`P1–P3`) и Act 3: что происходит после Act 1

## `P1–P3` — Worlds: готовые однобокие цивилизации

`P1–P3` (рабочее имя — не финализировано, см. `ACT-006`) — короткие
(~20–40 мин) забеги, стартующие из уже технологически зрелой, но
намеренно несбалансированной цивилизации: одна ось перекачана, другие
заброшены.

Примеры однобокости:

- all-diplomacy — мирная, застойная, коллапс от стагнации;
- all-military — сильная, агрессивная, коллапс через внутренний конфликт;
- all-scholar — продвинута в абстрактном знании, коллапс от пренебрежения
  базовым выживанием (голод).

Один `P` обязателен для прогресса, остальные — опциональны,
reward/achievement-driven. Механически `P1–P3` переиспользуют уже
существующий tech tree (смещённые стартовые jobs/governance/tech веса), а
не требуют новых систем.

## Переход в Act 3

После завершения любого `P`-прогона Архив заключает, что ни «медленно с
нуля» (Act 1), ни «срезать путь через готовую цивилизацию» (Act 2) не
решает исходную проблему, и открывает Act 3.

## Act 3 — адаптированный оригинальный Evolve

Здесь становятся доступны системы из старого §6 этого документа (races/
traits, полный multi-currency prestige loop, universes/challenge
modifiers, ARPA-эквивалент, полный каталог reset/ending типов) —
адаптированные под новый UI/UX (progressive disclosure, chapter-based
goals), а не буквальный порт старого DOM/меню. Act 3 — открытый финал, не
закрытая последовательность глав.

---

# 7. Procedural events: обязательная механика с первой главы

Random events не откладываются до `P1+`. Они дают миру ощущение жизни,
создают различия между попытками и были частью исходного Evolve-loop.

## Два параллельных слоя (без изменений)

1. **Authored events** — branch, milestone, anomaly, crisis и история. Их
   trigger детерминирован, а значимый выбор может блокировать только
   ближайший шаг.
2. **Procedural deck** — condition-based minor и major события. Оно не
   подменяет authored arc и никогда не блокирует critical path случайным
   проигрышем.

## Deck по главам Act 1

| Глава | Window | Minor examples | Major examples | Правило эффекта |
|---|---|---|---|---|
| `T1` | RNA/DNA → Cell/organism | unstable molecule, useful fragment, nutrient shift | RNA meteor, DNA replication, adaptation opportunity | небольшой capped grant; local resource/profile effect (уже реализовано) |
| `T2` | dispersed settlement | scattered signal, isolated success | coordination failure warning | flavor + малый profile-flag; не блокирует critical path |
| `T3` | fortified city | supply strain, guard rotation | faction murmur | flavor + малый Stability-adjacent tag |
| `T4` | industry/automation | sensor drift, minor overload | automation near-miss | flavor + малый risk-tag, предвестник `Авария` |
| `T5` | Modern/Atomic/crisis | **новая deck, см. `docs/scenario/04_STORY_EVENTS.md` §T5-DECK** | то же | flashback-flavor, ссылается на T1–T4; explicit risk/reward, route flags |

`T5` — единственная глава без собственного procedural deck до этого
решения; она получает его сейчас, спроектированного так, чтобы отражать
«синтез уроков» из стартового условия `T5` (см. §4). Точный список событий
и их текст — в `docs/scenario/04_STORY_EVENTS.md`.

## Fairness rules (без изменений)

- stateful seeded RNG и deck state сериализуются в save;
- minor target cadence: примерно один результат раз в 2–4 минуты активной
  игры; major: раз в 7–12 минут, с phase-specific cooldown;
- один event ID не повторяется, пока deck не исчерпан или пока не истёк
  явный long cooldown;
- rewards не переполняют cap и не дают больше, чем один ближайший
  meaningful purchase; loss не может создать hard lock;
- offline simulation может накопить report, но не принимает choices;
- обычные events идут toast/brief sheet, decisions — в event panel;
- weights, preconditions, cooldowns, effects и choice outcomes живут в
  config, не в UI callback.

## Required domain contract

Общий Event Engine (eligible-event query, weighted seeded draw, per-event
cooldown/state, queue priority, atomic `RESOLVE_EVENT`, effects/choices и
telemetry) уже реализован для `T1`. Расширение на `T5` не требует нового
движка — только новых записей конфига и нового deck-идентификатора.

---

# 8. Mobile / Яндекс Игры / VK: правила адаптации, а не упрощение глубины

## Экран и сессия

- на основном экране одновременно видны 3–4 главных ресурса, одна chapter goal и один primary CTA;
- secondary resources, recipes, trade offers, jobs и expeditions открываются контекстно в bottom sheet/панели;
- событие не должно появляться чаще, чем игрок успевает закрыть предыдущий meaningful payoff;
- late assets загружаются только с входом в соответствующую главу/эпоху;
- действия должны устойчиво переноситься между короткой mobile-сессией и desktop-web продолжением.

## Монетизация и честность

- baseline progression, reset, Archive Fragment, random event reward и critical choice никогда не требуют рекламы;
- rewarded допустим только для optional acceleration: offline multiplier, expedition speed, reroll quest, брифинг-интервенция или второй cosmetic/relic roll;
- fullscreen допустим в естественной паузе: ending, переход между главами; никогда не перед branch/crisis choice и не в первые 15 минут `T1`;
- daily/challenge systems — opt-in variety, не список обязательных chores.

## Telemetry gates

Перед открытием каждой новой главы/эпохи проверяются: p25/p50/p75 времени
до reset, abandonment before new layer, frequency/choice rate of event
deck, доля ручных действий, use of automation, species/route diversity и
crash/save recovery. Новый контент не лечит плохой первый loop скрытым
ускорением.

---

# 9. Архитектурные пакеты реализации

## Package A — Event Engine + T1 (реализовано)

1. Event Engine и первая RNA/DNA/Cell/Tribe deck.
2. Persisted RNG/deck state; save migration and deterministic tests.
3. Content unlock registry (`meta.unlocks`, route eligibility, content packs).
4. Chronicle schema, способная хранить ending, species, world, route и event-history.

## Package B — новые главы `T1` collapse + `T2`

1. `Мор` collapse flow для `T1` (новый ending, см.
   `docs/scenario/06_ENDINGS_COPY.md`) — **готово**, см. `docs/TODO.md` "T1
   retrofit: Мор collapse".
2. `T2` recap-goal chain (RNA→Tribe, свои ID), species skin #1 на событии
   `C02A/B/C`, `Катаклизм` collapse.
3. `T2` flavor deck.

## Package C — `T3` и `T4`

1. `T3` recap-goal chain (RNA→Settlement), policy-lite choice, `Раскол`
   collapse.
2. `T4` recap-goal chain (RNA→City), species skin #2 на событии `C02A/B/C`,
   `Авария` collapse.
3. `T3`/`T4` flavor decks.

## Package D — `T5` reframe + новая deck

1. Реframe существующего Modern→Atomic→Crisis→Ash контента как `T5`.
2. `T5` synthesis-flashback procedural deck (см. §7, §T5-DECK в scenario).
3. Act 1 → Act 2 transition screen и persistent-reward carryover.

## Package E — `P1–P3` (Act 2)

1. Lopsided-civilization starting presets (biased jobs/governance/tech weighting).
2. Achievement/reward-driven optional route selection.
3. Act 2 → Act 3 transition trigger.

## Package F — Act 3

1. Genetics, advanced governor, market contracts, terraforming.
2. Challenge framework and universe modifier packs.
3. Interstellar, Black Hole, anomaly realm и Truepath-like routes.
4. Continuous content rotation без изменения core save schema.

Each package requires headless simulation, mobile UI smoke, save migration tests and a focused playtest before the next package opens.

---

# 10. Decisions intentionally deferred, but no longer unowned

| Decision | Owner glava/epoch | Must be decided before |
|---|---|---|
| точный минутный бюджет каждой главы `T1–T5` | после playtest Act 1 (`ACT-006`) | Package D closeout |
| точные numeric gates для `Катаклизм`/`Раскол`/`Авария` collapse | `T2–T4` design GDD | Package B/C implementation |
| механика species skin swap (сколько переиспользуется из будущей Act-3 race-системы) | `T2`/`T4` GDD | Package B/C implementation |
| имя для `P1–P3` акта | продуктовое решение | Package E |
| выживает ли «Bioseed» как отдельное название или полностью заменяется переходом Act 2 → Act 3 | продуктовое решение | Package E/F |
| challenge/universe modifier catalogue | Act 3 GDD | Package F |
| перевод или исключение каждого Portal/Edenic/Hell legacy fantasy элемента | Act 3 narrative + product review | anomaly-realm production |

---

# 11. Acceptance criteria for this roadmap

Этот план становится каноническим, когда product review подтверждает, что:

- Act 1 (`T1–T5`) занимает ~3–4 активных часа, а не ~8–12, и заканчивается
  открытым Act 2, а не первым Bioseed;
- procedural random events возвращаются в `T1` и явно проектируются для `T5`;
- каждая глава `T1–T4` имеет собственный, причинно связанный с предыдущей,
  reset — ни одна не переиспользует `Ash`;
- каждое крупное семейство систем оригинала имеет одно из: epoch
  возвращения, явную трансформацию или явную причину исключения;
- поздняя глубина приходит из миров, traits, challenges, universes и
  routes в Act 3, а не из обязательных месяцев number inflation внутри
  Act 1;
- платформенные ограничения никогда не превращают рекламу, daily chores
  или скрытые ожидания в progression gate.

Статус, TODO и source-of-truth hierarchy синхронизированы с этим решением.
Следующий implementation step — `Мор` collapse для `T1` (Package B), а не
отдельная точечная итерация после Ash.
