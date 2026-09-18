# Хроники Эволюции — Act 1 (`T1–T5`): экономика и темп по главам

**Версия:** act-structure revision 3.0
**Статус:** canonical gameplay progression для `T1`/`T5` (реализовано);
`T2–T4` — новый scope, темп provisional.
**Область:** Act 1 целиком, от первой устойчивой молекулы (`T1`) до
обязательного `Ash` (`T5`), ~3–4 часа суммарно вместо старых 180 минут в
одном прогоне.
**Authority:** `docs/DECISIONS_ACT_STRUCTURE.md`, `docs/gdd/12_LONG_TERM_
PROGRESSION_AND_RESET_ROADMAP.md`.

> Этот документ задаёт **смысловую progression и темп** внутри каждой
> главы. Economy обязана балансировать эту progression, а не заменять её
> более удобными абстракциями. Конкретные goals/ID — в
> `docs/gdd/07_GOALS_AND_MILESTONES.md`.

---

# 1. Product promise Act 1

Игрок проживает не одну длинную арку, а пять попыток одной и той же
цивилизационной дуги, **каждая — полный replay с RNA** (`docs/
DECISIONS_ACT_STRUCTURE.md` ACT-002, скорректировано 2026-09-18: нет
стартового гранта/скипа). Каждая обрывается собственной, дальше по
времени причиной; уже пройденный участок сжат Archive Recall и подан
своим, более крупным recap-чек-листом, а не заново пройденной прежней
progression (`docs/gdd/07_GOALS_AND_MILESTONES.md` §5–8):

```text
T1 Origin:      RNA → cell → sapience → tribe                  → Мор
T2 Одиночки:    (recap RNA→Tribe) → settlement                 → Катаклизм
T3 Крепость:    (recap RNA→Settlement) → city                  → Раскол
T4 Большой мозг: (recap RNA→City) → industry/modern             → Авария
T5 Синтез:      (recap RNA→Industry/Modern) → atomic → Great Filter → Ash (обязателен)
```

Главный принцип biological phase (`T1`) не меняется:

> Не использовать абстрактный ресурс там, где игроку можно показать
> естественный предметный аналог.

---

# 2. Темп по главам

| Глава | Target total time (от RNA) | Главный payoff конца главы |
|---|---:|---|
| `T1` | ~20 мин | ПЛЕМЯ → Мор |
| `T2` | ~25 мин | ПЕРВЫЙ ТОЛЧОК → Катаклизм |
| `T3` | ~30 мин | КРЕПОСТЬ → Раскол |
| `T4` | ~35 мин | ЭПОХА МАШИН → Авария |
| `T5` | ~40 мин | МЫ РАСКОЛОЛИ МАТЕРИЮ → Ash |

Компетентный детерминированный профиль `T1` (seed 7) уже завершает Мор в
границах целевого диапазона (`docs/TODO.md` "T1 retrofit: Мор collapse"
pacing pass); окна выше для `T2–T5` — целевые telemetry ranges, а не
таймеры, и зависят от того, насколько реально Archive Recall сжимает
recap (не реализовано в коде — `docs/gdd/10_META_PROGRESSION.md` §4).

---

# 3. `T1` — Origin: RNA → Tribe → Мор

Раздел ниже воспроизводит принятую (реализованную) экономику `T1` без
изменений по существу — только границы окна теперь ~0–20 мин вместо
~0–56.

## 3.1 Resources by phase

**Molecular:** RNA основной видимый ресурс, DNA locked.
**Cell:** RNA, DNA, Biomass после Cell.
**Metabolic/multicellular:** DNA, Biomass, Energy после Metabolism, AP как
milestone reward.
**Civilization (Tribe):** Food, Materials, Knowledge, Population.

`Information` не является видимой spendable currency.

## 3.2 Ключевые биения (без изменений)

```text
Stable RNA → Self Replication → DNA Synthesis → Membrane → Cell
→ Metabolism + первая branch (Absorption/Symbiosis/Shell)
→ Multicellularity + Adaptation Points
→ Nervous system → Cognition 0..100 → Sapience
→ Tribe (Population ≈5, Food/Materials/Knowledge)
```

Точные UX-описания каждого биения — см. историю этого документа (revision
2.0) и реализованный `config/`; они не переносятся сюда повторно, так как
не изменились.

## 3.3 Новое: 16–20 мин — Мор

После `ПЛЕМЯ` плотная жизнь без ответа на эпидемиологию становится
уязвимостью, не выбором игрока. Archive не предупреждает заранее —
`EV-NAR-04` вводит вспышку как факт, одно mandatory choice (`EV-CR-T1`)
определяет subtype, `Мор` неизбежен.

Reward cadence остаётся плотной до самого конца — это by design: чем
короче глава, тем чаще payoff (см. §9).

---

# 4. `T2` — Одиночки: recap RNA→Tribe → Settlement → Катаклизм

## 4.1 Recap, не стартовое условие

Глава начинается на RNA, как `T1` — без гранта. RNA→Tribe участок подаётся
своим, более крупным recap-чек-листом (не буквальные `G001–G015`, см.
`docs/gdd/07_GOALS_AND_MILESTONES.md` §5.1), с 1–2 новыми Archive-репликами
внутри. У Tribe-порога:

> «Плотность более не единственная переменная модели.»

Species skin #1 применяется не здесь и не на новом стартовом экране, а на
уже существующем событии выбора primary trait (`C02A`/`C02B`/`C02C`),
которое recap всё равно проходит — Архив сам предлагает другую ветку
(«Давай попробуем вот это»).

## 4.2 Resources by phase

Food, Materials, Knowledge, Population — как в старой Settlement-фазе.
Никакого стартового «разброс/объединение» модификатора нет — это была
идея гранта из старой модели, снята.

## 4.3 Ключевые биения

```text
Соедините первые группы (G027)
→ Освойте земледелие (G028, переиспользует старый G016-контент)
→ Первый толчок (G029, EV-NAR-05)
→ Переживите Катаклизм (G030, EV-CR-T2)
```

## 4.4 Новое: конец главы — Катаклизм

Разрозненные группы физически не могут собрать единый ответ на
геологическую катастрофу. Один mandatory choice меняет subtype/epitaph,
не сам факт коллапса.

---

# 5. `T3` — Крепость: recap RNA→Settlement → City → Раскол

## 5.1 Recap

RNA-старт, как всегда. Recap теперь покрывает `T1`+`T2` целиком (RNA →
Tribe → Settlement), крупнее, чем recap `T2` (§4.1) — своя нарезка, не
`G001–G015` и не `G027`/`G028`. У Settlement-порога:

> «Рассеивание не защитило группу. Проверяется концентрация с
> укреплением.»

Никакого стартового defense kit — укрепления строятся как обычный новый
контент главы (`G031` «Заселите крепость»), не выдаются бесплатно.
Species skin не меняется на событии `C02A/B/C` — та же линия, что в `T2`.

## 5.2 Resources by phase

Как старая City-фаза (Food/Materials/Knowledge/Population, organized
labor, trade-lite).

## 5.3 Ключевые биения

```text
Заселите крепость (G031)
→ Откройте письменность (G032, переиспользует старый G018-контент)
→ Выберите модель управления (G032B, EV-CIV-04, policy-lite)
→ Заметьте раскол (G033, EV-NAR-06)
→ Переживите Раскол (G034, EV-CR-T3)
```

## 5.4 Новое: конец главы — Раскол

Первый коллапс Act 1, причина которого исходит изнутри, а не из среды:
безопасность снова концентрирует население, и вместе с ней теснота и
внутреннее напряжение. Governance-выбор из `G032B` явно входит в условие
`EV-CR-T3`, а не остаётся изолированным profile-флагом.

---

# 6. `T4` — Большой мозг: recap RNA→City → Industry/Modern → Авария

## 6.1 Recap + skin swap

RNA-старт. Recap покрывает `T1–T3` целиком (RNA → City), крупнее recap
`T3` (§5.1), со своей парой новых Archive-реплик. У City-порога:

> «Управление не удержало систему. Проверяется способность системы
> понимать себя.»

Никакого стартового Cognition/Writing бонуса — они достигаются как обычный
новый контент главы. Species skin #2 применяется на событии `C02A/B/C` —
второй и последний swap Act 1, той же формой, что swap #1 в `T2`; `T5`
возвращается к исходной линии.

## 6.2 Resources by phase

Как старые Industry/Modern-фазы (Food supporting, Materials, Knowledge,
Power, Population).

## 6.3 Ключевые биения

```text
Механизируйте производство (G035, переиспользует старый G020-контент)
→ Войдите в эпоху машин (G036, переиспользует старый G021-контент)
→ Automation-risk choice (G037, EV-CIV-08)
→ Заметьте перегрузку (G038, EV-NAR-07)
→ Переживите Аварию (G039, EV-CR-T4)
```

## 6.4 Новое: конец главы — Авария

Цивилизация обгоняет собственную способность управлять своей
технологией — каскадный отказ инфраструктуры/автоматики, не внешний
враг и не атомный Ash. Automation-risk выбор из `G037` напрямую входит в
условие `EV-CR-T4`.

Reveal на переходе к `T5`: «Вероятность успешного прохождения Фильтра:
—» (строка появляется и тут же удаляется — последний предвестник перед
Синтезом).

---

# 7. `T5` — Синтез: recap RNA→Industry/Modern → Atomic → Great Filter → Ash

Раздел воспроизводит принятую (реализованную) экономику старых секций
14–18 этого документа без изменений по существу — только recap-часть,
стартовая сцена и procedural deck новые.

## 7.1 Recap + возврат видовой линии

RNA-старт. Recap покрывает `T1–T4` целиком (RNA → Industry/Modern), крупнее
recap `T4` (§6.1). В конце recap-а Archive вмешивается напрямую,
синтезируя уроки `T1–T4`, и возвращает исходную видовую линию (swap budget
исчерпан). `EV-NAR-08 «Синтез»` — intro-сцена на этой границе, не отдельная
economy-фаза.

## 7.2 Resources by phase (без изменений)

Modern: Food supporting, Materials, Knowledge, Power, Population.
Atomic/crisis: Materials, Knowledge, Power, Stability internal, World
Tension visible.

## 7.3 Ключевые биения (без изменений)

```text
Scientific Method → Atomic Theory → tangible reactor/lab program
→ Atomic Age (МЫ РАСКОЛОЛИ МАТЕРИЮ) → World Tension → crisis events
→ Last Protocol → Ash → Archive Summary
```

## 7.4 Новое: `T5`-only procedural deck

Поверх Modern/Atomic окна работает новая procedural deck
(`deck: 't5_synthesis'`), флейвор-события которой явно ссылаются на
исходы `T1–T4` этого конкретного прогона. Полный список — `docs/
scenario/04_STORY_EVENTS.md` §T5-DECK.

## 7.5 Ash / Archive (без изменений)

Все Last Protocol variants converge to `ENDING_ASH`. После cinematic —
Timeline Summary всей Act 1 (не только `T5`), Archive Fragments,
Chronicle всех пяти глав, Meta Tree, переход в Act 2 (`P1`) teaser.

Reset остаётся окончанием истории цивилизации, не failure screen — как и
`Мор`/`Катаклизм`/`Раскол`/`Авария` до него.

---

# 8. Goal philosophy (без изменений)

Keep Goal Engine model:

- Current Goal: 30 sec–6 min;
- Chapter Goal: 10–25 min;
- Destiny Goal: границы одной главы `T1–T5`.

Optional goals must provide meaningful rewards, особенно Adaptation
Points в `T1`. Target time — telemetry, не hard completion.

---

# 9. Reward cadence

- `T1` (0–20): payoff каждые 30 сек — 4 мин, тот же темп, что в старой
  0–56-минутной версии `T1`, просто глава заканчивается раньше;
- `T2` (0–25): значимый unlock каждые 2–5 мин;
- `T3` (0–30): visual/system payoff каждые 4–8 мин;
- `T4` (0–35): major feature/milestone каждые 6–12 мин;
- `T5` (0–40): major feature/milestone каждые 8–15 мин, плюс procedural
  deck заполняет промежутки между authored событиями.

Каденс относится к **новой** части каждой главы (после recap-а) — во
время Recall-сжатого recap-а каденс задаётся recap-огрублением самим по
себе (`docs/gdd/07_GOALS_AND_MILESTONES.md` §5–8), не этой таблицей.

No invisible dead zone >5 мин ни в одной главе — глава короче 180-минутного
старого run, поэтому допустимый dead zone тоже пропорционально короче.

---

# 10. Systems preserved from later design (без изменений)

Этот документ **не убирает**:

- generic Goal Engine;
- optional objectives;
- data-driven config;
- branching infrastructure;
- save/recovery/autosave;
- dev simulation/time scale;
- telemetry;
- Stability/World Tension (только в `T5`);
- Error 17, Again (только в `T5`);
- Ash (только в `T5`) плюс новые `Мор`/`Катаклизм`/`Раскол`/`Авария`
  endings (`T1–T4`);
- Chronicle;
- Archive/meta;
- idempotent reset;
- Act 2 (`P1`) teaser.

Те системы теперь обслуживают пять глав вместо одной.
