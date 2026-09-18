# Хроники Эволюции — цели и вехи Act 1 (`T1–T5`)

**Документ:** DS-02 / act-structure revision 3.0
**Статус:** canonical goal semantics для `T1` и `T5` (реализовано); `T2–T4`
goal design — новый scope, numeric targets provisional до balance pass.
**Authority:** `docs/DECISIONS_ACT_STRUCTURE.md` задаёт причинную цепочку
глав; этот документ переносит её в конкретные goals/milestones.

---

# 1. Goal Engine contract (без изменений)

Generic Goal Engine remains accepted.

Goal states remain data-driven:

```text
hidden → revealed → active → completed → archived
```

Additional states such as `stalled`, `blocked_by_event`, `reward_pending` remain valid.

Target time is telemetry, never automatic completion.

## Goal kinds (structural — 2026-09-17 playtest finding, unchanged)

- **Standard** — one concrete target, one condition, resolved by a single
  direct action. Большинство `G0xx` chapter goals и every `*_OPTIONAL` side
  goal.
- **Progressive** — a derived counter accumulated from several distinct
  sources across more than one chapter goal (Cognition в `T1`; World
  Tension/Crisis Stability в `T5`). Needs its own always-visible slot and an
  introducing event at the first contributing source.
- **Super-global** — spans beyond a single chapter/run (Archive/meta
  progression across `T1–T5` and beyond). See §9.

---

# 2. Goal hierarchy (без изменений, теперь явно вложена в главу)

## Current Goal

30 sec–6 min horizon.

## Chapter Goal

10–25 min horizon — теперь это подцель **внутри** одной из глав `T1–T5`,
а не внутри единого 180-минутного run.

## Destiny Goal

Направление внутри одной главы `T1–T5`:

```text
T1: Create Life → Awaken Sapience → Build a Tribe → Survive the Blight
T2: Rebuild dispersed → Settle again → Survive the Cataclysm
T3: Fortify → Hold together → Survive the Fracture
T4: Outgrow the past → Industrialize → Survive the Overload
T5: Synthesize → Reach the Atomic Age → Face the Great Filter
```

## Chapter-level Destiny (Act 1)

```text
T1 Origin → T2 Одиночки → T3 Крепость → T4 Большой мозг → T5 Синтез
```

Каждая стрелка — reset конкретной главы, а не generic «reset».

---

# 3. Главы Act 1 и их era cutoff

Каждая глава — полный replay с RNA (`docs/DECISIONS_ACT_STRUCTURE.md`
ACT-002, скорректировано 2026-09-18): нет стартового гранта/скипа, только
растущий бюджет и растущий era cutoff. Уже пройденный участок сжимается
Archive Recall-перками (`10_META_PROGRESSION.md` §4), не пропускается.

| Глава | Era cutoff | Sub-chapters (`chapterId`) | Target total time (от RNA) | Reset goal |
|---|---|---|---:|---|
| `T1` — Origin | `TRIBE` | `CH01–CH04` | ~20 мин | `G025`/`G026` — `Мор` |
| `T2` — Одиночки | `SETTLEMENT` | `CH05` | ~25 мин | `G029`/`G030` — `Катаклизм` |
| `T3` — Крепость | `CITY` | `CH06` | ~30 мин | `G033`/`G034` — `Раскол` |
| `T4` — Большой мозг | `INDUSTRY/MODERN` | `CH07` | ~35 мин | `G038`/`G039` — `Авария` |
| `T5` — Синтез | `ATOMIC` + Great Filter | `CH08` | ~40 мин | `G023`/`G024` — `Ash` (существующий) |

Существующие `G001–G024` не переименовываются и не перенумеровываются —
они реализованы и покрыты тестами. Новые goals для collapse-контента
получают следующие свободные ID (`G025+`); они активны только в своей
главе — предыдущие коллапс-цели не входят в goal-набор более поздней главы
(см. §5.1).

---

# 4. `T1` — Origin: `G001–G015` + `Мор` (`G025`, `G026`)

`G001–G015` остаются canonical без изменений — полное описание см. в
истории этого документа (revision 2.0, сохранена ниже в §4.1 для
справки). Здесь фиксируется только новое: collapse после `MS04 ПЛЕМЯ`.

## 4.1 Существующая цепочка (без изменений)

```text
G001 Создайте устойчивую РНК → G002 Запустите саморепликацию
→ G003 Создайте ДНК → G004 Создайте мембрану → G005 Создайте клетку
→ G006 Стабилизируйте метаболизм → G007 Развейте клеточные системы
→ G008 Освойте адаптации → G009 Станьте многоклеточным
→ G010 Специализируйте тело → G011 Развейте органы чувств
→ G011_COGNITION_TRACK (progressive) → G012 Создайте нервную систему
→ G013 Пробудите разум → G014 Обеспечьте первую группу
→ G015 Создайте племя (MS04 ПЛЕМЯ)
```

Точные targetTimeMs/conditions — в реализованном `config/goals.js`, не
дублируются здесь повторно.

## 4.2 `G025` — Заметьте первых больных

**Target:** ~16–18 мин (вскоре после `MS04`).
**Trigger area:** Tribe, население ≥ порога плотности.

Не progressive-счётчик — одно authored anomaly-событие (`EV-NAR-04`,
см. `docs/scenario/04_STORY_EVENTS.md`), которое вводит Мор как факт, не
как игровую механику с собственным UI-индикатором (в отличие от World
Tension в `T5` — масштаб `T1` не требует отдельного meter).

Reward: нет — это narrative gate, не экономический payoff.

## 4.3 `G026` — Переживите Мор

**Target:** Мор неизбежен ~18–20 мин, reset сразу после.

Не purchase goal. Subflow:

1. `G025` вводит вспышку;
2. одно mandatory choice-событие (`EV-CR-T1`, аналог `Last Protocol`, но
   без multi-phase Stability — одно решение, не последовательность из
   четырёх, потому что глава короче на порядок);
3. решение меняет subtype/epitaph, но не сам факт `Мор` — как `Ash` в
   `T5`, первый `Мор` неизбежен;
4. `ENDING_BLIGHT`, Archive Summary, Chronicle, переход к `T2`.

Reveal при переходе: `Архив уже запускался раньше` (перенесено из старой
макро-Acт I bible — теперь это payoff конца `T1`, а не отложенная тайна
на много часов позже).

---

# 5. `T2` — Одиночки: recap RNA→Tribe (свои ID) + `G027–G030`

## 5.1 Recap + skin swap (не отдельный grant, не буквальный replay `G001–G015`)

`T2` начинается на RNA, как `T1`, но **не** проходит `G001–G015` карточка в
карточку — те же 15 шагов второй раз подряд выглядели бы как повтор
чек-листа. Вместо этого `T2` получает свой собственный, более крупный recap
того же RNA→Tribe участка (новые ID, design scope — см.
`13_ACT_ONE_CHAPTERS.md` §5): меньше шагов, каждый шире, плюс 1–2 новые
короткие Archive-реплики внутри ускоренного куска, чтобы он не читался как
немой монтаж. Species skin #1 применяется на уже существующем событии
выбора primary trait (`C02A`/`C02B`/`C02C`, `03_EVOLUTION_TREE.md` §M/C):
Архив сам предлагает другую ветку вместо оставленного открытым выбора `T1`
— «Давай попробуем вот это.» Это единственное место, где `T2` визуально
отличается от `T1` до самого `G027`.

В конце recap-а `T2` не уходит на collapse-хвост `T1` (`G025`/`G026` не
входят в её goal-набор — см. §3) и продолжает в `G027`.

Archive line у Tribe-порога, отсылающая к `Мор`: «Плотность более не
единственная переменная модели.»

## 5.2 `G027` — Соедините первые группы

**Target:** provisional, вскоре после Tribe (точная минута зависит от
Recall-компрессии §5.1, пока не реализованной — см. `10_META_PROGRESSION.md`
§4).
**Trigger area:** SETTLEMENT_EARLY.

Переиспользует механику `G014` (job assignment, Food balance).

## 5.3 `G028` — Освойте земледелие

**Target:** provisional, внутри оставшегося бюджета `T2` (~25 мин суммарно
от RNA) после `G027`.

Переиспользует существующий `G016`-контент (Farming/Field) без изменений
в механике — новый ID только потому, что goal принадлежит другой главе с
собственным reset-циклом.

## 5.4 `G029` — Почувствуйте первый толчок

**Target:** provisional, ближе к концу бюджета `T2`.

Authored anomaly-событие (`EV-NAR-05`), вводящее геологическую
нестабильность как факт мира — параллель `G025` в `T1`.

## 5.5 `G030` — Переживите Катаклизм

**Target:** ~25 мин от RNA-старта `T2` (весь бюджет главы), reset сразу
после.

Тот же shape, что `G026`: одно mandatory choice-событие
(`EV-CR-T2`) → `ENDING_CATACLYSM` → Archive Summary → переход к `T3`.

Разрозненные группы не могут скоординировать общий ответ — выбор в
`EV-CR-T2` может смягчить subtype/epitaph, но не отменяет коллапс.

Точные минуты `G027–G029` — provisional до отдельного balance pass (как и
раньше), теперь дополнительно зависят от ещё не реализованных Archive
Recall-коэффициентов, а не только от числового баланса самого `T2`.

---

# 6. `T3` — Крепость: recap RNA→Settlement (свои ID) + `G031–G034`

## 6.1 Recap

`T3` — снова RNA-старт. Recall-сжатый участок теперь покрывает весь путь
`T1` и `T2` (RNA → Tribe → Settlement), но не буквальными `G001–G015` или
`G027`/`G028` — свой recap, **крупнее**, чем recap `T2` (§5.1): ещё меньше
шагов, ещё шире каждый, плюс своя пара новых Archive-реплик. Не заново
переживает сам `Катаклизм` (его collapse-хвост `G029`/`G030` не входит в
goal-набор `T3` — см. §3). Species skin не меняется на событии `C02A/B/C` —
та же линия, что выбрал `T2` (см. `13_ACT_ONE_CHAPTERS.md` §3).

Archive line у Settlement-порога, отсылающая к `Катаклизм`: «Рассеивание не
защитило группу. Проверяется концентрация с укреплением.»

## 6.2 `G031` — Заселите крепость

**Target:** provisional, вскоре после Settlement.

Переиспользует City-подобную механику (Population threshold + жильё).

## 6.3 `G032` — Откройте письменность

**Target:** provisional, внутри оставшегося бюджета `T3` (~30 мин суммарно
от RNA) после `G031`.

Переиспользует существующий `G018`-контент (Writing) без изменений в
механике.

## 6.4 `G032B` — Выберите модель управления (policy-lite)

Optional/profile goal, переиспользует существующее `EV-CIV-04`
(«Кто принимает решения?»), но здесь оно явно на пути к `Раскол` —
выбор governance напрямую входит в условие следующего события.

## 6.5 `G033` — Заметьте раскол

**Target:** provisional, ближе к концу бюджета `T3`.

Authored anomaly/tension-событие (`EV-NAR-06`), вводящее внутреннее
напряжение как факт: концентрация населения внутри укреплений снова
создаёт тесноту.

## 6.6 `G034` — Переживите Раскол

**Target:** ~30 мин от RNA-старта `T3` (весь бюджет главы), reset сразу
после.

Тот же shape: одно mandatory choice-событие (`EV-CR-T3`) →
`ENDING_FRACTURE` → Archive Summary → переход к `T4`.

Внутренний конфликт, не внешняя угроза — это первый collapse Act 1, где
причина смерти исходит изнутри цивилизации, а не из среды. Точные минуты
`G031–G033` — provisional, как и в `T2` (§5.5).

---

# 7. `T4` — Большой мозг: recap RNA→City (свои ID) + `G035–G039`

## 7.1 Recap + skin swap

`T4` снова RNA-старт. Свой recap, крупнее recap `T3` (§6.1), покрывает
`T1–T3` целиком (RNA → City), без повторного `Раскол`-коллапса (`G033`/
`G034` не входят в goal-набор `T4` — см. §3), с очередной парой новых
Archive-реплик внутри ускоренного куска. Species skin #2 применяется на
событии `C02A/B/C` — второй и последний swap Act 1, той же формой, что
swap #1 в `T2` (Архив снова сам предлагает ветку).

Archive line у City-порога, отсылающая к `Раскол`: «Управление не удержало
систему. Проверяется способность системы понимать себя.»

## 7.2 `G035` — Механизируйте производство

**Target:** provisional, вскоре после City.

Переиспользует существующий `G020`-контент (Mechanization) без изменений
в механике.

## 7.3 `G036` — Войдите в эпоху машин

**Target:** provisional, внутри оставшегося бюджета `T4` (~35 мин суммарно
от RNA) после `G035`.

Переиспользует существующий `G021`-контент (Power/Machine Age).

## 7.4 `G037` — Automation-risk choice

Authored branch-событие (`EV-CIV-08`, новое): цивилизация выбирает темп
автоматизации (осторожный / агрессивный / делегированный) — выбор
напрямую входит в условие `Авария`, аналогично governance-выбору в `T3`.

## 7.5 `G038` — Заметьте перегрузку

**Target:** provisional, ближе к концу бюджета `T4`.

Authored anomaly-событие (`EV-NAR-07`), вводящее каскадную
перегрузку инфраструктуры/автоматики как факт.

## 7.6 `G039` — Переживите Аварию

**Target:** ~35 мин от RNA-старта `T4` (весь бюджет главы), reset сразу
после.

Тот же shape: одно mandatory choice-событие (`EV-CR-T4`) →
`ENDING_OVERLOAD` → Archive Summary → переход к `T5`.

Reveal при переходе: строка из старой макро-bible «Вероятность успешного
прохождения Фильтра: —» (Архив почти ломает нейтральность, затем
удаляет строку) — теперь это payoff конца `T4`, последний перед `T5`.
Точные минуты `G035–G038` — provisional, как и в `T2`/`T3`.

---

# 8. `T5` — Синтез: recap RNA→Modern (свои ID) + `G020_T5`(reframe intro) + `G022–G024`

`T5` — снова RNA-старт. Свой recap, крупнее recap `T4` (§7.1), покрывает
`T1–T4` целиком (RNA → Industry/Modern), без повторного `Авария`-коллапса
(`G038`/`G039` не входят в goal-набор `T5` — см. §3), с финальной парой
новых Archive-реплик. `G022–G024` — исключение из recap-принципа: это
по-настоящему новый для `T5` контент (никакая более ранняя глава его живьём
не проходит), поэтому переиспользуется как есть, без огрубления —
переиспользует существующий Modern→Atomic→Great Filter контент (`G022–
G024`, crisis flow `EV-CR-01…03`) почти без изменений — см. revision 2.0
§6–7 этого документа для деталей, не дублируются здесь.

## 8.1 Возврат видовой линии (не отдельный goal)

Архив вмешивается напрямую, возвращая исходную видовую линию (species
swap budget исчерпан) и синтезируя уроки `T1–T4`. Реализуется как
authored intro-событие (`EV-NAR-08 «Синтез»`), а не отдельный goal —
Modern-стадия начинается сразу с этой сценой.

## 8.2 Новое: `T5`-only procedural deck

В отличие от `T1–T4`, `T5` не получает нового collapse-цикла — коллапс
уже существует (`Ash`, `G024`). Новое здесь — procedural random event
deck (`deck: 't5_synthesis'`) поверх существующего Modern/Atomic/crisis
окна, флейвор-события которой явно ссылаются на исходы `T1–T4` этого
конкретного прогона.

Полный список событий — `docs/scenario/04_STORY_EVENTS.md` §T5-DECK;
технический контракт — `docs/gdd/12_LONG_TERM_PROGRESSION_AND_RESET_
ROADMAP.md` §5, §7.

---

# 9. Milestones (`MS01–MS09` не перенумеровываются; новое — `MS10+`)

`MS01–MS09` реализованы и покрыты regression-тестами под существующий
ruleset — переименование/перенумерование уже отгруженных ID без
технической необходимости создаёт риск без пользы, поэтому эта ревизия
их не трогает. `МЫ ОСТАЛИСЬ` и `ЭПОХА МАШИН` остаются общими вехами «эта
эра достигнута»: их получает первая глава, которая проходит этот участок
как **новый**, ещё не Recall-сжатый контент (`T2` — первая, что доходит
до Settlement как новое; `T4` — первая, что доходит до Industry как
новое). Более поздние главы тоже физически проходят этот же участок (он
теперь сжат по времени, а не пропущен, см. `13_ACT_ONE_CHAPTERS.md` §4),
но веха уже выдана глобально один раз и повторно не триггерится — тот же
generic «первый раз за всю игру» механизм, что уже действует для
achievements/Chronicle discovery.

| ID | Глава | Trigger | Title |
|---|---|---|---|
| `MS01` | `T1` | `G005` | ЖИЗНЬ |
| `MS02` | `T1` | `G009` | МНОГОКЛЕТОЧНОСТЬ |
| `MS03` | `T1` | `G013` | РАЗУМ ПРОБУДИЛСЯ |
| `MS04` | `T1` | `G015` | ПЛЕМЯ |
| `MS05` | `T2` (первая живая) | settlement reached | МЫ ОСТАЛИСЬ |
| `MS06` | `T4` (первая живая) | industry reached | ЭПОХА МАШИН |
| `MS07` | `T5` | `G023` | МЫ РАСКОЛОЛИ МАТЕРИЮ |
| `MS08` | `T5` | `G024` ending | ПЕПЕЛ |
| `MS09` | `T5` | reset saved | АРХИВ ПОМНИТ / ACT 1 ЗАВЕРШЁН |
| `MS10` | `T1` | `G026` ending | МОР |
| `MS11` | `T2` | `G029` | ПЕРВЫЙ ТОЛЧОК |
| `MS12` | `T2` | `G030` ending | КАТАКЛИЗМ |
| `MS13` | `T3` | `G031` | КРЕПОСТЬ |
| `MS14` | `T3` | `G034` ending | РАСКОЛ |
| `MS15` | `T4` | `G039` ending | АВАРИЯ |

Milestones остаются emotional payoffs, не currencies и не arbitrary locks.

---

# 10. Между-главовые Archive-переходы (не milestones, отдельный beat)

После `Мор`/`Катаклизм`/`Раскол`/`Авария` игрок видит компактный
Archive Summary конкретной главы (короче, чем финальный `T5` Summary) и
короткую переходную сцену — аналог `АРХИВ ПОМНИТ`, но без полноценного
CTA «СОЗДАТЬ НОВУЮ ЖИЗНЬ» (это CTA зарезервировано за переходом Act 1 →
Act 2 после `T5`). Copy — `docs/scenario/06_ENDINGS_COPY.md` §per-chapter
transition.

---

# 11. Branch/event integration (расширено на пять глав)

Каждая строка активна только в указанной главе: поскольку `T2–T5` заново
проходят участок мира, где сработало событие предыдущей главы, сам ID этого
события просто не входит в goal/event-набор более поздней главы (§3, §5.1) —
это не отдельный runtime-флаг «уже произошло», а другой активный набор
контента по `run.chapter`.

| Event | Глава | Trigger area | Blocks core? |
|---|---|---|---|
| Первая биологическая ветвь | `T1` | after Cell/Metabolism | yes, briefly |
| Behavior strategy | `T1` | after Nervous System | yes/short |
| Danger / Other micro-events | `T1` | Cognition | no |
| Distribution | `T1` | Tribe | no |
| `EV-NAR-04` Заметьте первых больных | `T1` | Tribe | no |
| `EV-CR-T1` Мор choice | `T1` | Tribe end | yes, mandatory |
| Settlement specialization | `T2` | Settlement | optional/profile |
| `EV-NAR-05` Первый толчок | `T2` | Settlement | no |
| `EV-CR-T2` Катаклизм choice | `T2` | Settlement end | yes, mandatory |
| Governance (`EV-CIV-04`) | `T3` | City | no, но входит в условие Раскол |
| `EV-NAR-06` Заметьте раскол | `T3` | City | no |
| `EV-CR-T3` Раскол choice | `T3` | City end | yes, mandatory |
| Energy Crisis | `T4` | Industry | major narrative choice |
| `EV-CIV-08` Automation-risk | `T4` | Industry/Modern | no, но входит в условие Аварии |
| `EV-NAR-07` Заметьте перегрузку | `T4` | Modern | no |
| `EV-CR-T4` Авария choice | `T4` | Modern end | yes, mandatory |
| `EV-NAR-08` Синтез (intro) | `T5` | Modern start | no |
| Error 17 | `T5` | Modern | persistent anomaly |
| Again | `T5` | Atomic | anomaly/milestone |
| T5-only synthesis deck | `T5` | Modern/Atomic | no, flavor only |
| Crisis events (`EV-CR-01…03`) | `T5` | Atomic crisis | required final flow |

---

# 12. Side goals (без изменений)

Side goals остаются non-blocking для всех пяти глав. Биологические side
goals в `T1` продолжают преимущественно награждать Adaptation Points,
Chronicle stamps и discovery — не вводить вторую постоянную биологическую
валюту. Side goals в `T2–T4` (settlement specialization, governance,
automation-risk) могут давать малые burst-бонусы или in-run modifiers, но
их числовое значение обязано войти в balance simulation конкретной главы.

---

# 13. Stall hints (без изменений)

Keep diagnostic Goal Engine behavior для каждой главы:

- identify one primary bottleneck;
- highlight relevant producer/job/building/node/event;
- never auto-buy;
- never use rewarded ad as default solution.

Ранние биологические hints используют восстановленную лексику: RNA, DNA,
Biomass, Energy/Metabolism, AP, Cognition. Hints `T2–T4` используют
canonical civilization-лексику из `docs/scenario/07_COPY_GUIDE.md`.

---

# 14. Implementation status

`T1` (`G001–G015`, `MS01–MS04`) и `T5`-содержимое (`G020–G024` под старой
нумерацией, `MS06–MS09` под старой нумерацией) реализованы и покрыты
regression-тестами. `T1`'s collapse (`G025`/`G026`, `Мор` timer/decay) тоже
реализован, ruleset `timeline1-v14-blight-timer` (`docs/TODO.md` "T1
retrofit: Мор collapse"). Оставшиеся новые goals `G027–G039` (`T2–T4`
collapse-контент) и per-chapter recap-цепочки (`T2–T5`'s свои, более
крупные ID на Recall-сжатый участок — не назначены, `T5`-only procedural
deck) — design-scope этого revision, numeric targets provisional до
отдельного implementation + balance pass, и дополнительно блокированы
Archive Recall perk-системой (не реализована — см.
`docs/DECISIONS_ACT_STRUCTURE.md` ACT-006) — без неё нет реального числа
для длительности сжатого recap-а (см.
`docs/production/TIMELINE_01_REBUILD_PLAN.md` §4 Package B/C/D).
