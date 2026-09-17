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

Игрок проживает не одну длинную арку, а пять коротких попыток одной и той
же цивилизационной дуги, каждая обрывается собственной причиной и
объясняется прямой правкой Архива в начале следующей:

```text
T1 Origin:      RNA → cell → sapience → tribe            → Мор
T2 Одиночки:    dispersed start → settlement              → Катаклизм
T3 Крепость:    fortified start → city                    → Раскол
T4 Большой мозг: cognition-bias start → industry/modern    → Авария
T5 Синтез:      synthesis start → atomic → Great Filter    → Ash (обязателен)
```

Главный принцип biological phase (`T1`) не меняется:

> Не использовать абстрактный ресурс там, где игроку можно показать
> естественный предметный аналог.

---

# 2. Темп по главам

| Глава | Target active time | Главный payoff конца главы |
|---|---:|---|
| `T1` | ~20 мин | ПЛЕМЯ → Мор |
| `T2` | ~25–30 мин | ПЕРВЫЙ ТОЛЧОК → Катаклизм |
| `T3` | ~30–35 мин | КРЕПОСТЬ → Раскол |
| `T4` | ~35–45 мин | ЭПОХА МАШИН → Авария |
| `T5` | ~45–60 мин | МЫ РАСКОЛОЛИ МАТЕРИЮ → Ash |

Компетентный детерминированный профиль (`T1`+`T5`, seed 7, старая
нумерация) уже завершает Ash в границах целевого диапазона; окна выше —
целевые telemetry ranges для новых глав `T2–T4`, а не таймеры.

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

# 4. `T2` — Одиночки: dispersed start → Settlement → Катаклизм

## 4.1 Стартовое условие

Глава начинается не с нуля. Archive line:

> «Плотность более не единственная переменная модели.»

Population стартует рассредоточенной — несколько малых групп вместо
одного лагеря. Экономически это медленнее локальный рост (несколько
меньших Food/Materials пулов вместо одного), но снижает вероятность
повторения `Мор`-подобной механики (её здесь и нет — Archive уже
исправил именно эту причину).

Species skin #1 применяется на этом входе — косметическая смена
(art/label/1–2 flavor-способности), не переоткрывает биологическую
progression `T1`.

## 4.2 Resources by phase

Food, Materials, Knowledge, Population — как в старой Settlement-фазе,
но с явным «разброс/объединение» modifier на старте.

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

# 5. `T3` — Крепость: fortified start → City → Раскол

## 5.1 Стартовое условие

Archive line:

> «Рассеивание не защитило группу. Проверяется концентрация с
> укреплением.»

Базовые оборонительные структуры уже построены на входе. Species skin
не меняется (та же линия, что в `T2`).

## 5.2 Resources by phase

Как старая City-фаза (Food/Materials/Knowledge/Population, organized
labor, trade-lite), но стартующая не с нуля, а с готового укрытия.

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

# 6. `T4` — Большой мозг: cognition-bias start → Industry/Modern → Авария

## 6.1 Стартовое условие

Archive line:

> «Управление не удержало систему. Проверяется способность системы
> понимать себя.»

Повышенный стартовый Cognition, раннее Writing/культура. Species skin #2
применяется здесь — второй и последний swap Act 1; `T5` возвращается к
исходной линии.

## 6.2 Resources by phase

Как старые Industry/Modern-фазы (Food supporting, Materials, Knowledge,
Power, Population), но с более ранним доступом к Power за счёт
стартового Cognition-bias.

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

# 7. `T5` — Синтез: Modern → Atomic → Great Filter → Ash

Раздел воспроизводит принятую (реализованную) экономику старых секций
14–18 этого документа без изменений по существу — только стартовая сцена
и procedural deck новые.

## 7.1 Новое стартовое условие

Archive вмешивается напрямую, синтезируя уроки `T1–T4`, и возвращает
исходную видовую линию. `EV-NAR-08 «Синтез»` — intro-сцена, не отдельная
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
- `T2` (0–30): значимый unlock каждые 2–5 мин;
- `T3` (0–35): visual/system payoff каждые 4–8 мин;
- `T4` (0–45): major feature/milestone каждые 6–12 мин;
- `T5` (0–60): major feature/milestone каждые 8–15 мин, плюс procedural
  deck заполняет промежутки между authored событиями.

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
