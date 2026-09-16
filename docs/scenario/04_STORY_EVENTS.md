# Хроники Эволюции — Story Events Timeline #1

**Документ:** DS-05  
**Статус:** ready for review  
**Назначение:** implementation-ready narrative events and choices для Timeline #1.  
**Gameplay authority:** `docs/gdd/08_EVENTS_AND_CHOICES.md`.  
**Narrative order:** `docs/scenario/01_TIMELINE_01_SCRIPT.md`.

---

# 1. Event contract

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

Этот файл задаёт **тексты и смысл**, но не придумывает скрытые numeric modifiers.

Если GDD не задаёт число, implementation должен использовать config/provisional value, а не извлекать процент из narrative wording.

---

# 2. Общие правила

1. Не более одного blocking choice одновременно.
2. Обычное событие: 1–3 коротких абзаца.
3. Кнопка — действие, а не оценка (`Исследовать`, а не `Правильный выбор`).
4. Archive response сообщает результат, но не хвалит и не осуждает.
5. Все необязательные biological choices должны оставаться необязательными.
6. Первый Ash неизбежен независимо от crisis choices.
7. Persistent mystery flags не должны давать игроку прямое lore-объяснение в Timeline #1.

---

# 3. EV-BIO-01 — Первый эволюционный путь

**Trigger:** Cell + active Metabolism.  
**Type:** blocking branch.  
**Blocks:** только ближайшее cellular progression до выбора.

## Title

**Первый путь**

## Lead

> Среда не предлагает правильного решения.
>
> Только разные способы выжить.

## Choice A — Поглощение

Button:

**Поглощение**

Description:

> Брать необходимое напрямую. Быстрый рост ценой большей зависимости от доступной добычи.

Immediate Archive response:

> Адаптация закреплена.

Chronicle:

> Вид выбрал активное получение ресурсов из окружающей среды как основной путь выживания.

Flags:

```text
run.bio.primary_trait = "absorption"
run.bio.absorption = true
```

## Choice B — Симбиоз

Button:

**Симбиоз**

Description:

> Выживать через совместную эффективность и устойчивые внутренние связи.

Response:

> Адаптация закреплена.

Chronicle:

> Ранний вид сделал взаимную выгоду и внутреннюю кооперацию частью своей биологии.

Flags:

```text
run.bio.primary_trait = "symbiosis"
run.bio.symbiosis = true
```

## Choice C — Панцирь

Button:

**Панцирь**

Description:

> Сохранить себя, когда среда становится враждебной. Устойчивость важнее скорости.

Response:

> Адаптация закреплена.

Chronicle:

> Вид сделал защиту и сохранение накопленного главным ранним преимуществом.

Flags:

```text
run.bio.primary_trait = "shell"
run.bio.shell = true
```

### Narrative rule

Не использовать `Хищник / Мирный / Танк` как canonical terminology. Это могут быть internal art shorthand, но не player-facing labels.

---

# 4. Optional metabolism events

## Photosynthesis unlock

Type: non-blocking adaptation notification.

Text:

> Свет стал источником роста.

Chronicle:

> Часть метаболизма вида научилась напрямую использовать энергию света.

Flag:

```text
run.bio.metabolism.photosynthesis = true
```

## Chemosynthesis unlock

Text:

> Жизнь научилась использовать энергию химических реакций среды.

Chronicle:

> Вид получил дополнительный путь питания там, где свет не был доступен.

Flag:

```text
run.bio.metabolism.chemosynthesis = true
```

No exclusive branch semantics.

---

# 5. EV-BIO-02 — Адаптации тела

**Trigger area:** post-AP / Multicellularity development.  
**Type:** profile/adaptation layer.  
**Blocking:** no.

Первое открытие Adaptation Points:

> Некоторые изменения не обязательны для следующего шага.
>
> Они определят, каким станет организм.

После первой покупки:

> Адаптация сохранена в истории вида.

Recommended adaptation copy:

## Mobility

Title: **Подвижность**  
Description: `Организм быстрее меняет положение и активнее взаимодействует со средой.`

## Sensory Cells

Title: **Чувствительные клетки**  
Description: `Изменения среды обнаруживаются раньше и точнее.`

## Digestion

Title: **Пищеварение**  
Description: `Организм эффективнее извлекает полезное из поглощённой материи.`

## Structural Tissue

Title: **Опорные ткани**  
Description: `Форма становится устойчивее и позволяет увеличивать размеры тела.`

Exact AP cost/effect belongs to GDD/config.

---

# 6. EV-BIO-03 — Поведенческая стратегия

**Trigger:** Nervous System complete.  
**Type:** short blocking branch.

## Title

**Поведение**

## Lead

> Сложное тело требует решений быстрее, чем их может дать случайность.

## Choice A — Одиночная стратегия

Description:

> Полагаться на собственную эффективность и избегать лишней зависимости от других.

Response:

> Поведенческий паттерн закреплён.

Chronicle:

> Вид чаще решал задачи индивидуально, делая ставку на самостоятельность.

Flag:

```text
run.bio.behavior = "solitary"
```

## Choice B — Социальное поведение

Description:

> Использовать других как часть общей стратегии выживания.

Response:

> Поведенческий паттерн закреплён.

Chronicle:

> Координация с другими особями стала устойчивой частью поведения вида.

Flag:

```text
run.bio.behavior = "social"
```

## Choice C — Манипуляция объектами

Description:

> Изменять среду вместо того, чтобы только приспосабливаться к ней.

Response:

> Поведенческий паттерн закреплён.

Chronicle:

> Вид начал использовать предметы среды как продолжение собственных возможностей.

Flag:

```text
run.bio.behavior = "tool_use"
```

---

# 7. EV-FLAVOR-01 — Опасность

**Trigger:** Cognition phase.  
**Type:** flavor / small profile event.  
**Blocking:** no or very short queue lock.

## Lead

> Резкое движение. Незнакомый сигнал. Времени на анализ почти нет.

### Choice: Отступить

Response:

> Организм сохраняет дистанцию и запоминает угрозу.

Chronicle fragment:

> Перед неизвестностью вид чаще выбирал осторожность.

Suggested semantic flag:

```text
run.bio.encounters.danger = "flee"
```

### Choice: Встретить угрозу

Response:

> Организм приближается к источнику сигнала и запоминает результат.

Chronicle:

> Перед неизвестностью вид чаще отвечал прямым действием.

Flag:

```text
run.bio.encounters.danger = "confront"
```

Do not imply one option yields Sapience and the other does not.

---

# 8. EV-FLAVOR-02 — Другой

**Trigger:** Cognition phase.  
**Type:** flavor.

## Lead

> Перед организмом — другой представитель сложной жизни.
>
> Он не нападает.

### Choice: Приблизиться

Response:

> Контакт изменил поведенческую модель.

Chronicle:

> Встреча с другим существом стала опытом взаимодействия, а не только конкуренции.

Flag:

```text
run.bio.encounters.other = "cooperate"
```

### Choice: Оттеснить

Response:

> Контакт изменил поведенческую модель.

Chronicle:

> Вид закрепил территориальный ответ на близость другого существа.

Flag:

```text
run.bio.encounters.other = "conflict"
```

---

# 9. EV-CIV-01 — Культурная традиция

**Trigger area:** early civilization.  
**Type:** optional/profile.  
**Blocking:** no by default.

Если событие используется в build, recommended title:

**Что стоит передавать дальше?**

Lead:

> У группы появляется время учить молодых не только выживанию, но и повторяемым способам жить.

Possible options retained from GDD:

- Охотничья традиция
- Сеть собирателей
- Ритуал знания

Response for all:

> Традиция закреплена.

Narrative rule: no strong numeric promise in text unless exact modifier is configured and shown elsewhere.

---

# 10. EV-CIV-02 — Как делить добычу

**Trigger:** Tribe milestone.  
**Type:** narrative/profile.  
**Blocking:** short.

## Title

**Как делить добычу?**

## Lead

> Удачная охота принесла больше пищи, чем нужно сегодня.
>
> Теперь важен не только ресурс, но и правило.

### Choice A — Делить добычу

Description:

> Каждый получает долю независимо от личного результата.

Response:

> Социальное правило закреплено.

Chronicle:

> Племя выбрало общее распределение добычи как основу внутренней устойчивости.

Flag:

```text
run.civ.distribution = "shared"
```

### Choice B — Лучшие получают больше

Description:

> Доля зависит от вклада, навыка и силы.

Response:

> Социальное правило закреплено.

Chronicle:

> Племя связало вознаграждение с личным вкладом и положением внутри группы.

Flag:

```text
run.civ.distribution = "merit_weighted"
```

No player-facing claim that one is objectively more cooperative/efficient unless UI separately displays configured effects.

---

# 11. EV-CIV-03 — Settlement specialization

**Trigger area:** Agriculture / Settlement.  
**Type:** optional/profile.  
**Blocking:** no by default.

Recommended framing:

**Что укрепит поселение?**

Options:

## Ирригация

> Сделать урожай менее зависимым от случайности сезона.

## Каменная кладка

> Строить медленнее, но надолго.

## Обмен

> Связать поселение с соседними группами через регулярную торговлю.

Response:

> Направление развития зафиксировано.

Flags:

```text
run.civ.settlement_focus = "irrigation" | "masonry" | "exchange"
```

---

# 12. EV-NAR-01 — Следы до нас

**Trigger:** permanent Settlement.  
**Type:** anomaly.  
**Blocking:** short narrative choice.

## Title

**Следы до нас**

## Lead

> Во время работ найден объект правильной геометрической формы.
>
> Его возраст не соответствует возрасту поселения.

Archive:

> Источник: неизвестен.

### Choice A — Исследовать

Description:

> Попытаться определить материал и происхождение объекта.

Response:

> Структура не соответствует известной технологии.

Chronicle:

> В земле нашли предмет, который не должен был существовать в этом времени. Его изучили, но происхождение осталось неизвестным.

Flags:

```text
run.anomaly.trace_choice = "study"
meta.anomaly.first_trace_found = true
```

Optional persistent detail:

```text
meta.anomaly.first_trace_studied = true
```

### Choice B — Разобрать

Description:

> Использовать необычный материал сейчас.

Response:

> Объект утрачен. Материал сохранён.

Chronicle:

> Необычный предмет разобрали ради полезного материала. Его происхождение осталось неизвестным.

Flags:

```text
run.anomaly.trace_choice = "dismantle"
meta.anomaly.first_trace_found = true
meta.anomaly.first_trace_lost = true
```

### Choice C — Сохранить

Description:

> Не трогать находку до появления лучших методов исследования.

Response:

> Объект помещён в хранилище.

Chronicle:

> Странный предмет пережил своих первооткрывателей и был сохранён для будущих поколений.

Flags:

```text
run.anomaly.trace_choice = "preserve"
meta.anomaly.first_trace_found = true
meta.anomaly.first_trace_preserved = true
```

### Hard narrative rule

Не использовать слова `предыдущая Timeline`, `предыдущая цивилизация Архива`, `reset residue` в player-facing copy Timeline #1.

---

# 13. EV-CIV-04 — Кто принимает решения?

**Trigger:** City.  
**Type:** government-lite profile.  
**Blocking:** short.

## Title

**Кто принимает решения?**

## Lead

> Чем больше становится город, тем меньше решений можно принимать всем одновременно.

### Совет

> Представители групп договариваются до общего решения.

Response: `Модель управления зафиксирована.`

Flag:

```text
run.civ.governance = "council"
```

### Лидер

> Полномочия сосредоточены у одного центра принятия решений.

Response: `Модель управления зафиксирована.`

Flag:

```text
run.civ.governance = "leader"
```

### Торговые дома

> Крупные обменные сети получают политическое влияние вместе с экономическим.

Response: `Модель управления зафиксирована.`

Flag:

```text
run.civ.governance = "merchants"
```

Chronicle should summarize the selected model neutrally.

---

# 14. EV-CIV-05 — City / Industry profile

**Type:** optional/profile.  
**Blocking:** no by default.

Allowed identity set:

- Production
- Science
- Energy

Recommended title:

**Чем станет город?**

Do not make this an extra mandatory paid gate before Mechanization without a separate balance decision.

Flag:

```text
run.civ.city_focus = "production" | "science" | "energy"
```

---

# 15. EV-CIV-06 — Энергетический кризис

**Trigger:** Industry / Machine Age.  
**Type:** major narrative choice.  
**Blocking:** yes, short.

## Title

**Энергетический кризис**

## Lead

> Рост требует больше энергии, чем прежняя система способна дать.
>
> Следующий выбор изменит не только производство, но и облик мира.

### Choice A — Ископаемая промышленность

Description:

> Быстро расширить добычу топлива и генерацию.

Response:

> Энергетическая стратегия принята.

Chronicle:

> Цивилизация выбрала быстрый промышленный рост и масштабное использование ископаемого топлива.

Flag:

```text
run.energy.strategy = "fossil"
```

Tags may include pollution only if gameplay config maps them explicitly.

### Choice B — Чистая программа

Description:

> Расширять энергетику медленнее, снижая долгосрочную нагрузку на среду.

Response:

> Энергетическая стратегия принята.

Chronicle:

> Цивилизация перестроила рост вокруг более чистых источников энергии.

Flag:

```text
run.energy.strategy = "clean"
```

### Choice C — Ранняя атомная программа

Description:

> Направить крупную часть исследований в новую область энергии.

Response:

> Энергетическая стратегия принята.

Chronicle:

> Цивилизация начала исследовать атомную энергию раньше, чем это требовалось текущей инфраструктуре.

Flag:

```text
run.energy.strategy = "early_atomic"
```

---

# 16. EV-CIV-07 — Preatomic specialization

**Trigger area:** Modern.  
**Type:** optional/profile.  
**Blocking:** no by default.

Possible focuses:

- Electrification
- Research Institutions
- Logistics

Recommended title:

**Что свяжет современный мир?**

This event must not duplicate Energy Crisis semantics.

Flag:

```text
run.civ.modern_focus = "electrification" | "research" | "logistics"
```

---

# 17. EV-NAR-02 — ERROR 17

**Trigger:** Modern civilization before Atomic Age.  
**Type:** anomaly.  
**Blocking:** no; interrupts briefly.

No choice.

Sequence:

> Прогноз завершения цикла: доступен.

Pause.

> ERROR 17

> Доступ к записи запрещён.

Then remove/hide first line from ordinary UI and create story objective:

**Найдите источник повреждённых данных.**

Detail view:

> Фрагмент существует в Архиве дольше текущей биосферы.
>
> Временная метка повреждена.

Flags:

```text
meta.anomaly.error17_seen = true
meta.archive.prediction_leak_seen = true
run.anomaly.error17_active = true
```

Timeline #1 cannot complete the objective.

---

# 18. EV-NAR-03 — Снова

**Trigger:** Atomic Age milestone.  
**Type:** anomaly/milestone.  
**Blocking:** only cinematic beat.

Sequence:

> Снова.

~1 sec pause.

Replace with:

> Событие зарегистрировано.

Do not append `ошибка`, `исправление`, `предыдущий цикл` or explanation.

Flags:

```text
meta.archive.heard_again = true
run.anomaly.again_seen = true
```

Chronicle:

> Архив зарегистрировал атомный переход дважды. Первая строка состояла из одного слова: «Снова.»

---

# 19. EV-CR-01 — Конфликт блоков

**Trigger:** crisis C1.  
**Type:** required crisis choice.

## Title

**Конфликт блоков**

## Lead

> Две коалиции требуют несовместимых условий безопасности.
>
> Военные системы переведены в повышенную готовность.

### Деэскалация

Description:

> Сохранить прямые каналы связи и предложить взаимное снижение готовности.

Response:

> Каналы связи сохранены.

Flag:

```text
run.crisis.bloc_choice = "deescalate"
```

### Санкции

Description:

> Усилить экономическое давление без прямого военного шага.

Response:

> Экономическое давление усилилось.

Flag:

```text
run.crisis.bloc_choice = "sanctions"
```

### Демонстрация силы

Description:

> Повысить военную готовность, пытаясь заставить противника отступить.

Response:

> Военная готовность повышена.

Flag:

```text
run.crisis.bloc_choice = "force"
```

Exact Stability effects belong to crisis config.

---

# 20. EV-CR-02 — Ложное предупреждение

**Trigger:** crisis C2.  
**Type:** required crisis choice.

## Title

**Предупреждение**

## Lead

> Система раннего предупреждения фиксирует атаку.
>
> Подтверждение из независимых источников отсутствует.

### Довериться автоматике

Description:

> Начать предусмотренную процедуру до получения дополнительного подтверждения.

Response:

> Ответные процедуры начаты до завершения проверки.

Flag:

```text
run.crisis.warning_choice = "trust_automation"
```

### Ручная проверка

Description:

> Задержать ответ и потребовать независимое подтверждение.

Response:

> Сигнал не подтверждён.

Flag:

```text
run.crisis.warning_choice = "manual_verify"
```

This event must not imply manual verification guarantees survival in Timeline #1.

---

# 21. EV-CR-03 — Последний протокол

**Trigger:** crisis C4 after dramatic clamps.  
**Type:** mandatory final choice.

## Title

**ПОСЛЕДНИЙ ПРОТОКОЛ**

## Lead

> Несколько систем требуют окончательного решения.
>
> Полной информации нет.
>
> Времени на новый цикл проверки не осталось.

### Choice A — Ответить ударом

Description:

> Подтвердить ответные действия.

Confirmation button:

**Подтвердить**

Flag:

```text
run.crisis.last_protocol = "retaliate"
meta.endings.pending_subtype = "ash_fire"
```

### Choice B — Попытаться разоружить систему

Description:

> Остановить собственные цепочки запуска, даже если противник не сделает того же.

Flag:

```text
run.crisis.last_protocol = "disarm"
meta.endings.pending_subtype = "ash_too_late"
```

### Choice C — Передать решение системе

Description:

> Разрешить автоматике завершить протокол без нового человеческого решения.

Flag:

```text
run.crisis.last_protocol = "delegate_system"
meta.endings.pending_subtype = "ash_system"
```

After confirmation:

- disable ordinary gameplay input;
- begin ending cinematic;
- do not show ad/reward modal;
- converge to `ENDING_ASH`.

---

# 22. Milestone narrative copy

| Milestone | UI title | Primary line |
|---|---|---|
| MS01 | ЖИЗНЬ | Теперь система поддерживает собственные процессы. |
| MS02 | МНОГОКЛЕТОЧНОСТЬ | Клетки становятся частями одного целого. |
| MS03 | РАЗУМ ПРОБУДИЛСЯ | Жизнь попыталась понять, что означает увиденное. |
| MS04 | ПЛЕМЯ | Группа стала чем-то большим, чем сумма её членов. |
| MS05 | МЫ ОСТАЛИСЬ | Это место должно пережить тех, кто его построил. |
| MS06 | ЭПОХА МАШИН | Энергия превращается в инфраструктуру. |
| MS07 | МЫ РАСКОЛОЛИ МАТЕРИЮ | Цивилизация получила доступ к энергии внутри самой материи. |
| MS08 | ПЕПЕЛ | Timeline #1 завершена. |
| MS09 | АРХИВ ПОМНИТ | Некоторые данные могут быть перенесены дальше. |

---

# 23. Event queue priority

Canonical queue priority:

```text
ENDING / EV-CR-03
> required crisis
> EV-BIO blocking branch
> milestone
> required narrative choice
> anomaly
> optional/profile
> flavor
```

`ERROR 17` may visually interrupt but must not steal control from an active crisis/blocking choice.

---

# 24. Implementation checklist

- [x] every canonical GDD event has narrative copy
- [x] no obsolete Energy/Information early branch
- [x] Absorption/Symbiosis/Shell is primary biological branch
- [x] Photosynthesis/Chemosynthesis are optional
- [x] AP adaptation layer is non-exclusive
- [x] Cognition events are lightweight
- [x] civilization choices are neutral in tone
- [x] Energy Crisis remains major
- [x] ERROR 17 has no Timeline #1 solution
- [x] `Снова.` remains unexplained
- [x] three Last Protocol choices map to three Ash subtypes
- [x] numeric effects remain owned by gameplay config
