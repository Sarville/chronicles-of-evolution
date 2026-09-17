# Хроники Эволюции — Story Events Act 1 (`T1–T5`)

**Документ:** DS-05, act-structure revision 3.0
**Статус:** ready for review
**Назначение:** implementation-ready narrative events and choices для всех
пяти глав Act 1.
**Gameplay authority:** `docs/gdd/08_EVENTS_AND_CHOICES.md`,
`docs/gdd/07_GOALS_AND_MILESTONES.md`.
**Narrative order:** `docs/scenario/01_TIMELINE_01_SCRIPT.md`.

**Supersedes:** предыдущую версию этого документа, написанную для единого
0–120-минутного прогона. События `T1`-контента (§3–§9 ниже) не меняются
по тексту — только по своей `phaseWindow`/`chapterId` принадлежности.
Полностью новые: `EV-NAR-04..08`, `EV-CR-T1..T4`, `EV-CIV-08`, и
T5-only procedural deck (§T5-DECK) — прямой ответ на запрос ввести
случайные события в `T5`, приправленные сценарием.

---

# 1. Event contract (без изменений)

Каждое событие описывается через:

- semantic ID;
- trigger;
- blocking/non-blocking;
- title;
- lead text;
- choices;
- immediate response;
- Chronicle summary;
- flags;
- gameplay-effect ownership.

Этот файл задаёт **тексты и смысл**, но не придумывает скрытые numeric
modifiers. Если GDD не задаёт число, implementation использует
config/provisional value, а не извлекает процент из narrative wording.

---

# 2. Общие правила (без изменений, +1 новое)

1. Не более одного blocking choice одновременно.
2. Обычное событие: 1–3 коротких абзаца.
3. Кнопка — действие, а не оценка.
4. Archive response сообщает результат, но не хвалит и не осуждает.
5. Все необязательные biological choices остаются необязательными.
6. Первый `Ash` (`T5`) неизбежен независимо от crisis choices; так же
   неизбежны `Мор` (`T1`), `Катаклизм` (`T2`), `Раскол` (`T3`), `Авария`
   (`T4`) — выбор меняет subtype/epitaph, не сам факт коллапса главы.
7. Persistent mystery flags не должны давать игроку прямое
   lore-объяснение до конца `T5`.
8. **Новое:** событие T5-only deck обязано либо явно ссылаться на исход
   одной из `T1–T4` этого конкретного прогона через `run`/`meta` флаг,
   либо быть явно помечено как neutral filler — большинство обязано
   быть первого типа.

---

# 3. Карта событий по главам

| Глава | Reused (текст не меняется) | Новое в этой revision |
|---|---|---|
| `T1` | `EV-RNA-01/DNA-01/CELL-01`, `EV-BIO-01/02/03/04`, `EV-FLAVOR-01/02`, `EV-CIV-01/02`, `EV-RNA-RESONANCE`, `EV-DNA-TRACE` | `EV-NAR-04`, `EV-CR-T1` |
| `T2` | `EV-CIV-03` (settlement specialization), `EV-NAR-01` (Следы до нас) | `EV-NAR-05`, `EV-CR-T2` |
| `T3` | `EV-CIV-04` (Кто принимает решения) | `EV-NAR-06`, `EV-CR-T3` |
| `T4` | `EV-CIV-06` (Энергетический кризис), `EV-CIV-05` (city/industry profile, optional) | `EV-CIV-08`, `EV-NAR-07`, `EV-CR-T4` |
| `T5` | `EV-CIV-07` (Preatomic specialization), `EV-NAR-02` (ERROR 17), `EV-NAR-03` (Снова), `EV-CR-01/02/03` | `EV-NAR-08`, T5-only procedural deck (§T5-DECK) |

Полный текст reused-событий — в предыдущей версии этого документа
(git history) и в реализованном `config/events.js`; он не дублируется
здесь повторно. Ниже — только новое.

---

# 4. `T1` — новое

## `EV-NAR-04` — Заметьте первых больных

**Trigger:** Tribe milestone (`MS04`) + короткая задержка.
**Type:** anomaly, non-blocking.

Lead:

> Часть группы не встаёт с места отдыха дольше обычного.
>
> Симптомы не совпадают с усталостью.

Archive:

> Отклонение зафиксировано. Причина: неизвестна.

Choices: нет — narrative gate.

Flags:

```text
run.chapter1.blight_noticed = true
```

## `EV-CR-T1` — Мор

**Trigger:** ~2 мин после `EV-NAR-04`.
**Type:** mandatory final choice, ending.

Lead:

> Плотная жизнь одного лагеря не оставляет для отклонения свободного
> пространства.
>
> Решение необходимо сейчас, не после подтверждения причины.

### Choice A — Изолировать больных

Response: `Часть группы отделена. Часть — потеряна раньше срока.`

Flag: `run.chapter1.response = "isolate"`, `meta.endings.chapter1_subtype = "blight_isolated"`

### Choice B — Держаться вместе

Response: `Группа осталась цельной. Отклонение осталось тоже.`

Flag: `run.chapter1.response = "stay_together"`, `meta.endings.chapter1_subtype = "blight_unified"`

### Choice C — Довериться целителю

Response: `Единственный доступный ответ был испробован раньше, чем понят.`

Flag: `run.chapter1.response = "healer"`, `meta.endings.chapter1_subtype = "blight_early_medicine"`

После любого выбора:

```text
complete_ending: subtype = <см. flag выше>, ending_id = "ENDING_BLIGHT"
set_meta_flag: meta.archive.heard_before_seen = true
```

Chronicle: `Первая цивилизация не пережила собственную плотность. Архив зафиксировал: это уже происходило.`

---

# 5. `T2` — новое

## Вход в главу (не событие с выбором, intro-сцена)

Проигрывается автоматически при старте `T2`, до первого игрового
действия.

> Плотность более не единственная переменная модели.
>
> Начальное распределение: рассредоточенное.

Flags: `run.chapter = "T2"`, `meta.act1.species_skin = 1`

## `EV-NAR-05` — Первый толчок

**Trigger:** ~20–24 мин внутри `T2`, после Settlement specialization.
**Type:** anomaly, non-blocking.

Lead:

> Земля движется там, где раньше не двигалась.
>
> Ни одна из групп не находится достаточно близко к другой, чтобы
> сравнить наблюдения.

Archive:

> Сигналы не согласованы между локациями.

Flags: `run.chapter2.tremor_noticed = true`

## `EV-CR-T2` — Катаклизм

**Trigger:** ~3–5 мин после `EV-NAR-05`.
**Type:** mandatory final choice, ending.

Lead:

> То, что защитило группу от одного вида отклонения, не защищает её от
> земли под ногами.

### Choice A — Стянуть группы к центру

Response: `Путь между очагами оказался длиннее, чем оставшееся время.`

Flag: `run.chapter2.response = "converge"`, `meta.endings.chapter2_subtype = "cataclysm_converge"`

### Choice B — Укрыть каждую группу отдельно

Response: `Каждая группа выбрала собственный ответ. Не каждый ответ оказался верным.`

Flag: `run.chapter2.response = "shelter_separately"`, `meta.endings.chapter2_subtype = "cataclysm_scattered"`

### Choice C — Довериться прежнему опыту

Response: `Прежний опыт отвечал на прежнюю угрозу.`

Flag: `run.chapter2.response = "old_experience"`, `meta.endings.chapter2_subtype = "cataclysm_unprepared"`

```text
complete_ending: subtype = <см. flag>, ending_id = "ENDING_CATACLYSM"
```

Chronicle: `Рассредоточение остановило Мор и не остановило землю. Вторая цивилизация закончилась порознь.`

---

# 6. `T3` — новое

## Вход в главу

> Рассеивание не защитило группу. Проверяется концентрация с
> укреплением.

Flags: `run.chapter = "T3"`

`EV-CIV-04` («Кто принимает решения?») переиспользуется без изменений
текста; выбор в нём (`run.civ.governance`) становится precondition для
части ответов `EV-CR-T3` ниже.

## `EV-NAR-06` — Заметьте раскол

**Trigger:** ~24–28 мин внутри `T3`, после governance choice.
**Type:** anomaly, non-blocking.

Lead:

> Стены держат снаружи то, что было снаружи.
>
> Они не рассчитаны на то, что уже внутри.

Archive:

> Внутреннее расхождение превышает модельный порог впервые с начала
> главы.

Flags: `run.chapter3.fracture_noticed = true`

## `EV-CR-T3` — Раскол

**Trigger:** ~4–6 мин после `EV-NAR-06`.
**Type:** mandatory final choice, ending.

Lead:

> Укрытие сделало тесноту постоянной, а не временной.

### Choice A — Подавить несогласных

Response: `Порядок восстановлен там, где раньше был спор.`

Flag: `run.chapter3.response = "suppress"`, `meta.endings.chapter3_subtype = "fracture_suppressed"`

### Choice B — Разделить крепость

Response: `Стена, построенная против внешнего, оказалась пригодна и для внутреннего раздела.`

Flag: `run.chapter3.response = "split"`, `meta.endings.chapter3_subtype = "fracture_split"`

### Choice C — Вынести решение на всех

Response: `Решение заняло больше времени, чем у крепости оставалось.`

Flag: `run.chapter3.response = "vote"`, `meta.endings.chapter3_subtype = "fracture_deliberated"`

```text
complete_ending: subtype = <см. flag>, ending_id = "ENDING_FRACTURE"
set_meta_flag: meta.archive.knows_more_seen = true
```

Chronicle: `Крепость пережила катастрофу снаружи и не пережила себя изнутри.`

---

# 7. `T4` — новое

## Вход в главу

> Управление не удержало систему. Проверяется способность системы
> понимать себя.

Flags: `run.chapter = "T4"`, `meta.act1.species_skin = 2`

`EV-CIV-06` («Энергетический кризис») переиспользуется без изменений
текста.

## `EV-CIV-08` — Темп автоматизации

**Trigger:** после Machine Age milestone.
**Type:** branch, non-blocking, входит в условие `EV-CR-T4`.

Lead:

> Автоматика уже способна решать быстрее, чем система успевает её
> проверить.

### Choice A — Осторожный темп

Response: `Темп автоматизации зафиксирован.`

Flag: `run.chapter4.automation_pace = "cautious"`

### Choice B — Агрессивный темп

Response: `Темп автоматизации зафиксирован.`

Flag: `run.chapter4.automation_pace = "aggressive"`

### Choice C — Делегировать полный контроль

Response: `Темп автоматизации зафиксирован.`

Flag: `run.chapter4.automation_pace = "delegated"`

## `EV-NAR-07` — Заметьте перегрузку

**Trigger:** ~30–34 мин внутри `T4`.
**Type:** anomaly, non-blocking.

Lead:

> Одна подсистема требует больше ресурсов, чем ей выделено.
>
> Запрос удовлетворён автоматически, до подтверждения человеком.

Flags: `run.chapter4.overload_noticed = true`

## `EV-CR-T4` — Авария

**Trigger:** ~3–5 мин после `EV-NAR-07`.
**Type:** mandatory final choice, ending. Набор choices зависит от
`run.chapter4.automation_pace` (см. `07_GOALS_AND_MILESTONES.md` §7.6);
ниже — базовый набор при `cautious`/`aggressive`; при `delegated` выбор
недоступен и происходит автоматически (см. Choice C с автоматическим
исходом).

Lead:

> Каскад уже начался. Время есть только на один уровень вмешательства.

### Choice A — Остановить вручную

Response: `Ручная остановка успела не везде.`

Flag: `run.chapter4.response = "manual_stop"`, `meta.endings.chapter4_subtype = "overload_manual"`

### Choice B — Перенаправить нагрузку

Response: `Перенаправленная нагрузка нашла новую точку отказа.`

Flag: `run.chapter4.response = "reroute"`, `meta.endings.chapter4_subtype = "overload_rerouted"`

### Choice C — Довериться автоматике до конца (автоматически при `delegated`)

Response: `Система выполнила то, для чего была построена.`

Flag: `run.chapter4.response = "trust_automation"`, `meta.endings.chapter4_subtype = "overload_automated"`

```text
complete_ending: subtype = <см. flag>, ending_id = "ENDING_OVERLOAD"
```

Chronicle: `Цивилизация научилась думать быстрее, чем успевала за собственной мыслью.`

Reveal (появляется и тут же исчезает, не в choice-response, а отдельной
строкой после ending card):

> Вероятность успешного прохождения Фильтра: —

Flag: `meta.archive.filter_probability_glimpsed = true`

---

# 8. `T5` — новое: вход в главу

## `EV-NAR-08` — Синтез

**Trigger:** старт `T5`, до первого игрового действия.
**Type:** narrative intro, non-blocking.

Lead:

> Четыре модели исчерпаны. Пятая объединяет условия предыдущих.
>
> Видовая линия: исходная.

Archive не объясняет, что значит «объединяет» — это раскрывается только
через T5-DECK ниже, не текстом здесь.

Flags: `run.chapter = "T5"`, `meta.act1.species_skin = 0` (возврат к
исходной линии)

---

# T5-DECK. `T5`-only procedural event deck («Синтез уроков»)

**Deck id:** `t5_synthesis`.
**PhaseWindow:** `eraIds: ['MODERN', 'ATOMIC']` (не раньше `EV-NAR-08`).
**Назначение:** прямой ответ на запрос — до этой revision случайные
(procedural, deck-сэмплируемые) события существовали только в
молекулярном окне `T1` (`early_biology` deck: `EV-RNA-RESONANCE`,
`EV-DNA-TRACE`); `T5` имел только authored-события. Эта deck закрывает
разрыв и одновременно выполняет требование «приправить случайные
события сценарием»: каждое событие явно ссылается на исход одной из
`T1–T4` этого конкретного прогона через `meta.endings.chapterN_subtype`.

## Правила deck

- authored crisis events (`EV-NAR-02/03`, `EV-CR-01…03`) сохраняют
  приоритет в queue — эта deck никогда не прерывает и не блокирует их;
- каждое minor-событие ссылается на ровно одну прошлую главу; каждое
  major-событие — на ту же главу, что и предшествующий ему minor (пара),
  чтобы echo читался как связная деталь, а не случайный шум;
- если `meta.endings.chapterN_subtype` для нужной главы не записан
  (например, save мигрировал без полной истории Act 1), событие
  считается неприменимым и не попадает в eligible pool — никаких
  default-текстов, придумывающих чужую историю игроку;
- weight/cooldown — как у `early_biology` deck (см.
  `docs/gdd/12_LONG_TERM_PROGRESSION_AND_RESET_ROADMAP.md` §7 fairness
  rules): minor раз в 2–4 мин, major раз в 7–12 мин активной игры внутри
  `T5`.

## `EV-T5-ECHO-BLIGHT-MINOR` — Протокол карантина

**Deck:** `t5_synthesis`. **Precondition:** `meta.endings.chapter1_subtype` set.
**Type:** flavor, minor.

Lead:

> Новый регламент здравоохранения ссылается на случай, у которого нет
> названия в текущих архивах.

Archive: `Протокол применён.`

Choices: `{ id: 'acknowledge', label: 'Принять к сведению', effects: [{ grant_resource: knowledge, small }] }`

Chronicle: `Где-то в основании современной медицины лежит урок, который никто не помнит вслух.`

## `EV-T5-ECHO-BLIGHT-MAJOR` — Вспышка старого штамма

**Deck:** `t5_synthesis`. **Precondition:** предшествует
`EV-T5-ECHO-BLIGHT-MINOR` в том же прогоне.
**Type:** flavor, major, risk/reward.

Lead:

> Локальная вспышка совпадает с моделью, для которой уже есть готовый
> протокол.

### Choice A — Применить протокол немедленно

Response: `Вспышка локализована до распространения.` Small Stability-adjacent bonus.

### Choice B — Провести проверку сначала

Response: `Проверка заняла больше времени, чем распространение.` Меньший или нулевой bonus.

Chronicle (варьируется по `meta.endings.chapter1_subtype`):

- если `blight_isolated`: `Разделение оказалось не только первым ответом цивилизации — оно стало последним общим правилом на этот случай.`
- если `blight_unified`/`blight_early_medicine`: `На этот раз готового правила не было — только медленно собранный опыт.`

## `EV-T5-ECHO-CATACLYSM-MINOR` — Сейсмический протокол

**Deck:** `t5_synthesis`. **Precondition:** `meta.endings.chapter2_subtype` set.
**Type:** flavor, minor.

Lead:

> Инфраструктурный кодекс требует запаса прочности, обоснование которого
> отсутствует в текущей документации.

Archive: `Требование сохранено без источника.`

## `EV-T5-ECHO-CATACLYSM-MAJOR` — Толчок в новой сети

**Deck:** `t5_synthesis`. **Precondition:** предшествует
`EV-T5-ECHO-CATACLYSM-MINOR` в том же прогоне.
**Type:** flavor, major, risk/reward.

Lead:

> Сейсмический датчик фиксирует событие в пределах спрогнозированного
> сценария.

### Choice A — Довериться инфраструктурному запасу

Response: `Сеть выдержала нагрузку, для которой не была официально рассчитана.`

### Choice B — Экстренно перераспределить ресурсы

Response: `Перераспределение сработало почти везде.`

Chronicle (варьируется по `meta.endings.chapter2_subtype`):

- если `cataclysm_converge`: `На этот раз путь между точками сети был рассчитан заранее.`
- если `cataclysm_scattered`/`cataclysm_unprepared`: `Никто прямо не связал этот запас прочности с землёй, ушедшей из-под ног пятью попытками раньше.`

## `EV-T5-ECHO-FRACTURE-MINOR` — Эхо раскола

**Deck:** `t5_synthesis`. **Precondition:** `meta.endings.chapter3_subtype` set.
**Type:** flavor, minor.

Lead:

> Модель общественного согласия ссылается на исторический случай без
> указания источника.

Archive: `Ссылка сохранена. Случай — неизвестен.`

## `EV-T5-ECHO-FRACTURE-MAJOR` — Голос несогласных

**Deck:** `t5_synthesis`. **Precondition:** предшествует
`EV-T5-ECHO-FRACTURE-MINOR` в том же прогоне.
**Type:** flavor, major, choice.

Lead:

> Часть населения открыто не согласна с текущим направлением развития.
> Модель управления предлагает три пути ответа.

### Choice A — Услышать и скорректировать курс

Response: `Курс скорректирован. Несогласие осталось меньшинством.`

### Choice B — Настоять на едином курсе

Response: `Курс не изменился. Несогласие осталось меньшинством другого рода.`

Chronicle (варьируется по `meta.endings.chapter3_subtype`):

- если `fracture_deliberated`: `На этот раз у несогласия было место для голоса, прежде чем оно стало расколом.`
- если `fracture_suppressed`/`fracture_split`: `Модель управления решила вопрос до того, как он стал историей — по крайней мере, официально.`

## `EV-T5-ECHO-OVERLOAD-MINOR` — Автоматика помнит

**Deck:** `t5_synthesis`. **Precondition:** `meta.endings.chapter4_subtype` set.
**Type:** flavor, minor.

Lead:

> Диагностика автоматики отклоняет команду, ссылаясь на правило, не
> указанное ни в одном текущем регламенте.

Archive: `Отказ подтверждён. Источник правила: не определён.`

## `EV-T5-ECHO-OVERLOAD-MAJOR` — Каскад под контролем

**Deck:** `t5_synthesis`. **Precondition:** предшествует
`EV-T5-ECHO-OVERLOAD-MINOR` в том же прогоне.
**Type:** flavor, major, risk/reward.

Lead:

> Локальная перегрузка сети повторяет паттерн, для которого автоматика
> уже имеет готовый ответ.

### Choice A — Позволить автоматике сработать

Response: `Каскад остановлен раньше, чем стал заметен людям.`

### Choice B — Перехватить управление вручную

Response: `Ручной перехват сработал — медленнее, чем сработала бы автоматика.`

Chronicle (варьируется по `meta.endings.chapter4_subtype`):

- если `overload_automated`: `На этот раз довериться автоматике оказалось не последней ошибкой, а первым верным решением.`
- если `overload_manual`/`overload_rerouted`: `Автоматика справилась с тем, с чем не справились раньше её создатели.`

## Event queue priority внутри `T5` (расширено)

```text
ENDING / EV-CR-03
> required crisis (EV-CR-01/02)
> EV-NAR-02/03 (ERROR 17 / Снова)
> milestone
> EV-CIV-07 (preatomic specialization)
> T5-DECK major
> T5-DECK minor
```

---

# 9. Implementation checklist (act-structure revision)

- [x] `T1` reused events сохранили canonical текст
- [x] каждая `T1–T4` collapse имеет три choice, три subtype, один
      неизбежный ending_id
- [x] `T5` получила новую procedural deck (`t5_synthesis`), отсутствовавшую
      ранее
- [x] каждое событие T5-DECK явно завязано на `meta.endings.chapterN_subtype`
      конкретного прогона, а не на generic текст
- [x] authored crisis events `T5` сохраняют приоритет над T5-DECK
- [x] `ERROR 17` / `Снова.` остаются необъяснёнными
- [x] species swap flags (`meta.act1.species_skin`) выставляются на входе
      `T2` (=1), `T4` (=2), `T5` (=0, возврат к исходной линии)
- [x] numeric effects остаются во владении gameplay config
