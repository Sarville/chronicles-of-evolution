# Хроники Эволюции — план сборки Act 1 (`T1–T5`)

**Статус:** rework под act-structure; `T1` (2026-09-18) реализован полностью —
контент до `TRIBE` плюс новый `Мор`-collapse (`ENDING_BLIGHT`), `T1` больше не
продолжается в старый `G016+` Settlement-маршрут внутри одного прогона.
`T5`-контент (бывший «Timeline #1» Modern→Atomic→Ash, `G016–G024`) остаётся в
конфиге без изменений — переиспользуется главой `T5`, не главой `T1`.
`T2–T4` — не начаты. Manual playtest нового `Мор`-флоу ещё не проводился.
**Дата:** 2026-09-18.
**Программа:** `timeline1-v13-t1-blight-collapse` (текущий ruleset, `Мор`
реализован) → следующая версия вводит `Катаклизм`/`Раскол`/`Авария`.

**Authority:** `docs/DECISIONS_ACT_STRUCTURE.md` задаёт саму структуру глав;
этот документ — build-план её реализации. `docs/gdd/12_LONG_TERM_
PROGRESSION_AND_RESET_ROADMAP.md` задаёт порядок reset-эпох.

---

## 1. Цель

Собрать пять коротких причинно связанных глав Act 1 (`T1–T5`, target ~3–4 ч
суммарно) вместо одного цельного 180-минутного Timeline. Уже реализованный
контент не выбрасывается — он переиспользуется и нарезается по новым era
cutoffs (см. таблицу переиспользования в §4).

Обязательный `Ash` остаётся только у `T5`. `T1–T4` каждая заканчивается
собственным reset (`Мор`, `Катаклизм`, `Раскол`, `Авария`), который вводит
следующую главу как прямое исправление Архива.

## 2. Границы программы

### Входит

- новый collapse-контент для `T1` (`Мор`), `T2` (`Катаклизм`), `T3`
  (`Раскол`), `T4` (`Авария`) — goals, authored события, ending copy;
- переразметка era cutoffs существующего `T1`-контента по главам;
- species skin swap #1 (`T2`) и #2 (`T4`) — косметика/label/1–2 flavor
  способности, без полной trait-глубины;
- `T5`-only procedural event deck (синтез-flashback, ссылается на `T1–T4`);
- Act 1 → Act 2 transition screen и persistent-reward carryover;
- deterministic simulation, save/recovery, telemetry и mobile/desktop
  presentation для полного прогона `T1–T5`.

### Не входит

- `P1–P3` (Act 2): lopsided-civilization presets, achievement-driven route
  selection;
- Act 3: races/traits полной глубины, genetics, policies (полные), trade,
  Orbit, planets, challenges и universes;
- буквальный перенос legacy DOM, старых формул или каждой микровалюты
  Evolve;
- незапланированный визуальный production-пакет DS-08. Его активы могут
  подключаться по готовности, но не блокируют доменную реализацию.

`P1–P3`/Act 3 здесь получают только устойчивые extension points:
ending/Chronicle record, content unlock registry и save-safe identifiers.
Нельзя создавать пустые UI-экраны поздних систем заранее.

## 3. Базовые правила реализации

1. Канон gameplay: GDD `01–11`; порядок глав и причинная цепочка: GDD `12`
   и `DECISIONS_ACT_STRUCTURE.md`; точные narrative/presentation triggers:
   scenario и UX contracts.
2. Существующий ruleset (`timeline1-v11-branch-cost-fix`) не выбрасывается.
   `T1`-контент до `TRIBE` (`G001–G015`, `MS01–MS04`) становится главой `T1`
   почти без изменений — добавляется только `Мор` collapse после Tribe.
   `T5`-контент (`G020–G024`, crisis flow, `Ash`) становится главой `T5`
   почти без изменений — добавляется только новая procedural deck и
   reframe стартового условия/copy.
3. Новый полный content ruleset после `Мор`+`T2`+`T3`+`T4` получает
   отдельный идентификатор; его нельзя подменять незаметной правкой
   активного save.
4. Каждая content-волна обязана поставлять config validation, доменные
   тесты, целевую simulation profile, UI smoke и save compatibility check.
5. Нельзя начинать Act 2 (`P1`) runtime, пока `T5`/Act 1 closeout не
   завершит full-run regression и manual playtest.

## 4. Пакеты работы

| Пакет | Целевое активное время главы | Что поставляется | Переиспользует (старая нумерация) | Gate перед следующим пакетом |
|---|---:|---|---|---|
| `T1` — Origin (retrofit) | ~20 мин | audit существующего `G001–G015`/`MS01–MS04`; новый `Мор` collapse: epidemic authored event chain, `ENDING_BLIGHT`, Chronicle/Archive reveal «Архив уже запускался раньше» | `T1-0…T1-3` (почти без изменений) | `Мор` не блокирует critical path раньше Tribe; save/reset regression на новом ending |
| `T2` — Одиночки | ~25–30 мин | dispersed-start modifier (economy/job weighting), species skin #1, coordination-vs-isolation authored choice, flavor deck, `Катаклизм` collapse (`ENDING_CATACLYSM`) | `T1-3…T1-4` (truncated) | skin swap не ломает save schema; collapse достижим без stuck-state |
| `T3` — Крепость | ~30–35 мин | стартовый defense kit, policy-lite choice (unity vs control), flavor deck, `Раскол` collapse (`ENDING_FRACTURE`) | `T1-4` (truncated) | policy choice не открывает скрытый permanent gate; collapse timing внутри окна |
| `T4` — Большой мозг | ~35–45 мин | Cognition-bias старт, раннее Writing/culture, species skin #2, automation-risk choices, flavor deck, `Авария` collapse (`ENDING_OVERLOAD`) | `T1-4…T1-5` (truncated) | skin swap #2 не требует нового save field сверх skin #1; collapse причинно связан с automation-risk выборами |
| `T5` — Синтез (reframe) | ~45–60 мин | reframe стартового условия/copy (возврат исходной линии, синтез уроков); **новая `T5`-only procedural deck** (§5); existing crisis flow/`Ash` без изменений | `T1-5…T1-6` (почти без изменений) | новая deck не блокирует authored crisis events; Ash award idempotent как раньше |
| Act 1 closeout | 0 — весь прогон `T1–T5` | rebalance, accessibility/UX pass, analytics taxonomy, Act1→Act2 transition screen, persistent-reward carryover, manual playtests | `T1-7` (расширен на 5 глав) | release-candidate test matrix и approved timing profile для всех пяти глав |

## 5. `T5`-only procedural deck: обязательный первый шаг этого документа

`T5` — единственная глава `T1–T5` без собственной procedural deck на
момент этого документа (deck есть только у `T1`, molecular window). Задача
явно поставлена пользователем и зафиксирована здесь как отдельный
work-item, не подпакет.

### Контракт

- deck подключается к существующему Event Engine (`RESOLVE_EVENT`,
  seeded RNG, cooldown, queue priority) — новый движок не нужен;
- events используют `phaseWindow.eraIds: ['MODERN', 'ATOMIC']` и не
  триггерятся раньше Modern, чтобы не конкурировать с `T1`-decky
  окном/ритмом;
- каждое событие этой deck обязано либо явно ссылаться на один из четырёх
  предыдущих collapse (`Мор`/`Катаклизм`/`Раскол`/`Авария`) как на
  flashback/echo, либо явно маркироваться как neutral filler —
  большинство должно быть первого типа, это и есть «приправить
  сценарием»;
- authored crisis events (`EV-CR-01…03`) сохраняют приоритет в queue —
  procedural deck не может прервать или заблокировать crisis choice;
- полный список событий, их текст и Chronicle-версии — в
  `docs/scenario/04_STORY_EVENTS.md` §T5-DECK; flags — в
  `docs/scenario/05_NARRATIVE_FLAGS.md`.

### Реализация

Технически это только новые записи `config/events.js` с `deck: 't5_synthesis'`
и соответствующей `phaseWindow` — сериализация RNG/deck state и
`RESOLVE_EVENT` уже общие для всех deck. Работа не требует нового домена.

## 6. Definition of done для Act 1 (`T1–T5`)

- новый игрок проходит понятную дугу из пяти попыток: каждая начинается с
  явной правки Архива и заканчивается собственным, причинно понятным
  reset, без внешней инструкции;
- `T1` и `T5` сохраняют существующие authored+procedural events;
  `T2–T4` получают собственный flavor deck (не обязательно того же
  объёма, что `T1`/`T5`);
- `T5`-only synthesis deck работает и явно ссылается на исходы `T1–T4`
  конкретного прогона (через `run`/`meta` флаги, не только текстом
  наугад);
- ровно один обязательный `Ash` за весь Act 1 — на `T5`; `T1–T4` не
  переиспользуют `ENDING_ASH`;
- игрок видит только релевантные 3–4 главные counters на каждой главе;
- persistent reward (AF, Chronicle, species skins) переносится между
  главами без потери и без дублирования при пересборке/сбое;
- save/load/recovery устойчивы на каждой границе между главами;
- full simulation, config/domain/save/UI/smoke/build gates проходят для
  всех пяти глав;
- есть manual mobile и desktop playtest от `T1` до конца `T5`.

## 7. Порядок исполнения

```text
T1 retrofit: Мор collapse
→ T2: dispersed start + skin #1 + Катаклизм
→ T3: defense start + policy-lite + Раскол
→ T4: Cognition-bias start + skin #2 + Авария
→ T5 reframe: synthesis deck + Ash copy update
→ Act 1 closeout: full T1–T5 regression + manual playtest
→ design and implementation of P1 (Act 2)
```

DS-08/DS-09 продолжаются как production tracks, но не меняют этот порядок
gameplay delivery. Любое изменение milestone semantics, reset condition или
time target требует обновить GDD/decision до изменения кода.
