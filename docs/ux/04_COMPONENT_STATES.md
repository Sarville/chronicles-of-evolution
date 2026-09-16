# Хроники Эволюции — Состояния компонентов

**Документ:** DS-06  
**Статус:** черновик, готов к ревью  
**Область:** UI component states для Timeline #1  
**Основание:** `00_UX_PRINCIPLES.md`, `01_SCREEN_MAP.md`, `02_MOBILE_WIREFRAMES.md`, `03_DESKTOP_WIREFRAMES.md`

---

# 1. Назначение

Этот документ фиксирует состояния основных UX-компонентов, чтобы mobile и desktop использовали одну логику отображения. Он не задаёт финальный visual style, а определяет, какие данные и действия компонент может показывать на каждом этапе Timeline #1.

Главное правило: компонент не должен показывать систему до её canonical unlock.

---

# 2. Current Goal Card

## 2.1. Базовые состояния

| State | Когда используется | Содержимое | Действие |
|---|---|---|---|
| `goal_available` | Игрок может прямо продвинуть цель | Название, требование, прогресс, CTA | Основное действие |
| `goal_waiting` | Цель зависит от производства или условия | Название, прогресс, ETA/подсказка | Открыть связанную систему |
| `goal_branch` | Нужен выбор пути | Название, краткое объяснение, варианты | Открыть branch/event panel |
| `goal_milestone_ready` | Веха достигнута | Название вехи, reward preview | Показать payoff / продолжить |
| `goal_blocked_hint` | Игрок упёрся в очевидный bottleneck | Требование, недостающий ресурс/условие | Открыть релевантную панель |
| `goal_crisis` | `SCR_CRISIS` | Угроза, tension context, ближайшее решение | Открыть crisis event |
| `goal_locked_after_protocol` | После Last Protocol | Зафиксированное решение | Нет обычного действия |

## 2.2. Правила

- Карточка цели всегда остаётся более важной, чем список доступных зданий или событий.
- Reward preview показывается только если помогает понять ближайший шаг; он не раскрывает будущую систему заранее.
- После milestone карточка коротко показывает результат, затем меняется на следующую цель.
- В `PB26–PB27` карточка перестаёт быть growth-oriented и становится crisis-oriented.

---

# 3. Context Resources

## 3.1. Наборы по фазам

| Фаза | Видимые ресурсы |
|---|---|
| `PB00–PB02` | РНК, если нужна текущей цели |
| `PB03–PB04` | РНК / ДНК в контексте текущей цели |
| `PB05–PB08` | Биомасса / Энергия и актуальные cellular requirements |
| `PB09–PB14` | AP после `PB09`; Cognition только после `PB12` |
| `PB15–PB20` | Food / Materials / Knowledge / Population |
| `PB21–PB24` | Food / Materials / Knowledge / Power / Population |
| `PB25–PB27` | World Tension плюс crisis-critical resources |
| `PB28–PB30` | Обычные resources скрыты; Archive summary показывает итоги |

## 3.2. Состояния ресурса

| State | Поведение |
|---|---|
| `normal` | Компактное значение и прирост, если прирост важен |
| `required` | Подсвечен как требование текущей цели |
| `shortage` | Показывает недостачу и действие для исправления |
| `incoming` | Показывает производство/ETA после relevant unlock |
| `historical` | Свернут в детали после потери актуальности |
| `hidden_unlocked_later` | Не занимает место и не показывается как locked slot |

---

# 4. Primary Action

| State | Когда используется | Пример |
|---|---|---|
| `manual_process` | Ранние действия и простые процессы | Соединить, усилить, собрать |
| `purchase_unlock` | Узел или здание доступно | Открыть, построить |
| `open_system` | Нужны детали | Открыть «Эволюцию», открыть «Работы» |
| `choose_option` | Событие или ветвь | Выбрать |
| `confirm_irreversible` | Необратимое решение | Подтвердить |
| `continue_story` | Milestone/Archive | Продолжить |
| `disabled_explain` | Не хватает требования | Показывает недостающее условие |

Один экран не должен иметь две равные primary CTA. Второй важный путь становится secondary button, вкладкой или строкой в panel.

---

# 5. Evolution / AP Components

## 5.1. Evolution entry

- До `PB03`: вход отсутствует.
- `PB03–PB08`: вход открывает trunk/current biological progression.
- `PB09–PB14`: вход показывает AP и optional adaptations.
- После `PB14`: вход становится историей вида и поздними biological remnants, а не главным action surface.

## 5.2. Node card

| State | Содержимое |
|---|---|
| `available` | Название, стоимость, эффект, CTA |
| `progressing` | Прогресс, вклад ресурсов/процесса |
| `completed` | Краткий результат и визуальный след |
| `branch_preview` | Вариант, consequence, live preview target |
| `ap_adaptation` | Стоимость AP, часть тела/поведения, preview |
| `locked_by_current_goal` | Показывается только если это непосредственный next step |

AP card не появляется до `PB09`. Недоступные будущие AP nodes не должны формировать отдельный locked catalog раньше первого AP reward.

---

# 6. Cognition Meter

**Unlock:** `PB12` / Nervous System.

| State | Поведение |
|---|---|
| `hidden` | До `PB12`, без placeholder |
| `introduced` | Первое появление рядом с реактивным поведением существа |
| `building` | Значение 0–100, источники прогресса в деталях |
| `near_threshold` | Связь с Sapience goal становится явной |
| `historical_after_sapience` | После `PB14` сворачивается в историю вида |

Meter не должен звучать как generic XP bar. Он отражает поведенческое усложнение и переход масштаба к Sapience.

---

# 7. Jobs And Buildings

**Unlock:** `PB15` постепенно, stable layer с `PB17`.

## 7.1. Jobs row

| State | Содержимое |
|---|---|
| `assignable` | Название роли, назначенные группы, plus/minus |
| `at_min` | minus disabled |
| `at_max` | plus disabled, причина |
| `bottleneck` | Роль подсвечена как решение текущей нехватки |
| `obsolete_low_priority` | Старая роль доступна в деталях, но не конкурирует с новой фазой |

## 7.2. Building card

| State | Содержимое |
|---|---|
| `available` | Название, стоимость, эффект, CTA |
| `affordable_soon` | Требуемый ресурс и ETA |
| `under_construction` | Прогресс/очередь |
| `built` | Эффект, количество, upgrade path если есть |
| `phase_hidden` | Будущие эпохи не показаны как locked grid |

---

# 8. Event Choice

| State | Когда используется | Форма |
|---|---|---|
| `quick_choice` | Низкий риск, поведенческий выбор | Bottom sheet / side panel |
| `branch_choice` | Primary trait / Energy Crisis | Focused panel with live preview |
| `story_discovery` | «Следы до нас», ERROR-adjacent beats | Panel tied to diorama object |
| `irreversible_confirm` | Last Protocol | Focused overlay |
| `resolved_trace` | После выбора | Chronicle entry + possible world modifier |

Каждый вариант должен иметь короткий текст следствия. Для `PB22` preview обязан показывать persistent world modifier до подтверждения.

---

# 9. Chronicle

| State | Поведение |
|---|---|
| `unavailable` | До первых meaningful records |
| `new_entry` | Короткий badge/строка в нижней полосе |
| `browse` | Список ключевых решений и milestone records |
| `contextual_detail` | Открыто из события, здания или Archive reference |
| `archive_source` | После `PB29` становится частью итоговой записи |

Chronicle не является логом каждого production tick. Она хранит историю мира, решения, flags и тексты, которые важны для Archive.

---

# 10. Power And Energy Panel

**Unlock:** активный Power только `PB21`.

| State | Поведение |
|---|---|
| `hidden` | До `PB21`; механизация не показывает Power как active resource |
| `introduced` | После Machine Age milestone |
| `managed` | Источники, потребление, current bottleneck |
| `crisis_branch_preview` | `PB22`, показывает последствия варианта |
| `crisis_compressed` | `PB26`, уступает место World Tension |

---

# 11. World Tension

**Unlock:** `PB25` после Atomic milestone.

| State | Диапазон | UX |
|---|---:|---|
| `hidden` | до `PB25` | Нет placeholder |
| `armed` | первое появление | Header/goal card explanation |
| `rising` | среднее значение | Видимый процент и event pressure |
| `critical` | high/clamped | Dominant secondary indicator |
| `locked_after_protocol` | после `PB27` | Значение фиксируется или исчезает перед flash |

World Tension не должен выглядеть как обычный ресурс для оптимизации. Это показатель состояния мира и драматического давления.

---

# 12. Ending / Archive Components

## 12.1. Ending result

- Full-screen.
- Нет обычных controls.
- Сначала диорама V9 Ash, затем заголовок и CTA.
- CTA: `СОХРАНИТЬ В АРХИВ`.

## 12.2. Archive summary

Секции:

1. Вид и адаптации.
2. Путь цивилизации.
3. Ключевые решения.
4. Кризис и финал.
5. Фрагменты Архива.

Каждая секция имеет compact summary и expandable details. Итог не ранжирует игрока как победителя/проигравшего.

## 12.3. Meta CTA

`АРХИВ ПОМНИТ` → `Мы можем изменить результат.` → `СОЗДАТЬ НОВУЮ ЖИЗНЬ`.

CTA начинает Timeline #2 teaser and accelerated familiar boot, а не «retry from fail».

---

# 13. Error And Recovery States

| Component | State | Поведение |
|---|---|---|
| Goal card | `stale_after_idle` | Показывает, что изменилось с возвращения игрока |
| Resource | `overflow_or_cap` | Коротко объясняет cap, если cap уже открыт |
| Save | `recovering` | Archive/system text, затем возврат в world shell |
| UI | `offline_autosave_pending` | Не блокирует обычный flow, если данные безопасны локально |
| ERROR 17 | `anomaly_inline` | Нарушает обычную строку/карточку, не открывая horror modal |

---

# 14. Coverage checklist

- Current Goal Card: ordinary, branch, milestone, crisis, locked.
- Resources: contextual, shortage, historical, hidden future.
- Evolution/AP: no AP before `PB09`.
- Cognition: no meter before `PB12`.
- Jobs/buildings: gradual unlock from `PB15`.
- Power: no active resource before `PB21`.
- World Tension: no indicator before `PB25`.
- Event choices: branch, story, crisis, irreversible.
- Ending/Archive: full final flow without fail-screen language.
