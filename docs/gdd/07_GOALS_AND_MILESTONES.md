# Хроники Эволюции — цели и вехи первых 120 минут

**Документ:** DS-02 / 07_GOALS_AND_MILESTONES  
**Версия:** 1.0  
**Область:** Timeline #1, от запуска Архива до первого reset  
**Статус:** implementation specification

---

# 1. Назначение

Этот документ задаёт точную последовательность целей первого двухчасового прохождения и связывает в одну систему:

- экономический pacing;
- дерево эволюции;
- сюжетные события;
- визуальные milestone-переходы;
- подсказки при bottleneck;
- аналитику;
- переход к первому ending и reset.

Главная задача документа — исключить ситуацию, когда UI, экономика, сценарий и дерево развития ведут игрока в разные стороны.

---

# 2. Источники и приоритет при расхождениях

DS-02 опирается на существующие документы проекта:

1. `02_ECONOMY_FIRST_120_MINUTES.md` — **источник истины по целевым временам, ценам, производству и milestone-коридорам**;
2. `03_EVOLUTION_TREE.md` — **источник истины по ID узлов, требованиям и branch-структуре**;
3. `01_FIRST_120_MINUTES.md` — источник gameplay flow, UX-принципов, визуальных стадий и tutorial philosophy;
4. `../scenario/00_NARRATIVE_BIBLE.md` — источник narrative beats, тона, событий и mystery hooks;
5. `../PRD.md` — продуктовые принципы верхнего уровня.

## 2.1. Зафиксированное расхождение ранних версий

Ранний GDD помещает пробуждение разума примерно в диапазон 28–38 минут. Более поздняя экономика v1.0 и дерево эволюции v1.0 фиксируют `Sapience / Разум` около **46:00**.

Для реализации DS-02 используется более поздняя шкала:

- Proto-cell — ~10:00;
- Multicellularity — ~26:00;
- Sapience — ~46:00;
- Tribe — ~56:00;
- Agriculture — ~62:00;
- City — ~80:00;
- Industry — ~94:00;
- Atomic Age — ~108:00;
- Ash — ~116:00;
- reset — ~120:00.

Все старые narrative beats сохраняются, но привязываются к этой шкале.

---

# 3. Иерархия целей

На экране одновременно могут существовать три уровня цели.

## 3.1. Current Goal

Горизонт: 30 секунд – 6 минут.

Содержит:

- одно главное действие;
- короткий progress indicator;
- понятную награду/следующий unlock;
- один primary CTA.

Пример:

> **Создайте протоклетку**  
> 420 / 520 Energy  
> 63 / 80 Information  
> Откроет Biomass и клеточную эру.

## 3.2. Chapter Goal

Горизонт: 10–25 минут.

Показывает направление эпохи и состоит из нескольких Current Goals.

Пример:

> **Пробудите разум**  
> Развивайте органы чувств, нервную сеть и протоязык.

## 3.3. Destiny Goal

Горизонт: весь текущий run.

В Timeline #1 постепенно раскрывается как:

1. `Создайте жизнь`;
2. `Доведите жизнь до разума`;
3. `Создайте цивилизацию`;
4. `Пройдите Великий фильтр`.

Последняя формулировка намеренно не сообщает, что первый run scripted заканчивается «Пеплом».

---

# 4. Правила Goal Engine

Каждая цель имеет состояния:

```text
hidden
→ revealed
→ active
→ completed
→ reward_pending
→ archived
```

Дополнительные состояния:

- `blocked_by_event` — экономические условия выполнены, но требуется обязательное событие/выбор;
- `stalled` — нет заметного прогресса дольше порога;
- `skipped_by_archive` — применяется только в будущих timelines;
- `failed_soft` — только для side objectives, никогда для core goal Timeline #1.

## 4.1. Основной принцип

Целевое время — **не hard timer**.

Goal открывается по состоянию игры и prerequisites. Время используется для:

- telemetry;
- catch-up;
- определения stall;
- narrative clamp там, где он явно задан экономикой.

## 4.2. Completion

Core Goal считается выполненной только после покупки/активации соответствующего breakthrough node, а не просто при накоплении цены.

## 4.3. Reward preview

До выполнения всегда показывается хотя бы один конкретный payoff:

- новый ресурс;
- новая механика;
- визуальная смена мира;
- новый тип building/job;
- сюжетное событие;
- доступ к следующей эре.

---

# 5. Главная шкала Timeline #1

| Глава | Целевое окно | Chapter Goal | Крупный payoff |
|---|---:|---|---|
| CH01 Искра | 0–10 | Создайте протоклетку | Biomass, клетка |
| CH02 Клетка | 10–26 | Станьте многоклеточным | тело, branch тела |
| CH03 Разум | 26–46 | Преодолейте когнитивный порог | Civilization mode |
| CH04 Племя | 46–62 | Создайте устойчивое племя | Agriculture |
| CH05 Поселение | 62–80 | Создайте город | Power, городской слой |
| CH06 Машины | 80–94 | Начните индустриализацию | Industry |
| CH07 Ускорение | 94–108 | Расколите материю | Atomic Age, Stability |
| CH08 Фильтр | 108–120 | Переживите глобальный кризис | Ending «Пепел», Архив |

---

# 6. Каталог core goals

Ниже — 24 обязательные цели. Их ID используются во всех остальных документах DS-02.

## G001 — Стабилизируйте энергетический градиент

**Target:** 00:45  
**Chapter:** CH01  
**Node:** `M01 Stable Bond / Стабильная связь`  
**Цена:** 12 E

### До цели

Первый tap/click даёт игроку понятный feedback. Ручное действие нужно только для onboarding.

### Completion

Куплен M01.

### Reward

- открывается автоматический Energy production;
- ручной gain ×2;
- UI впервые показывает rate `/s`.

### UX

Игрок должен понять принцип «я запускаю процесс, а не обязан кликать бесконечно».

---

## G002 — Запустите саморепликацию

**Target:** 02:00  
**Node:** `M02 Саморепликация`  
**Цена:** 40 E + 3 I

### Completion

Куплен M02.

### Reward

- Information production ×1.60;
- визуально молекула начинает копироваться;
- narrative line: «Информация научилась копировать себя.»

### DS-02 requirement

После этой цели ручной input больше не должен восприниматься главным способом прогресса.

---

## G003 — Создайте каталитическую РНК

**Target:** 04:00  
**Node:** `M03 Каталитическая РНК`  
**Цена:** 90 E + 10 I

### Reward

- Energy ×1.35;
- Information ×1.25;
- открывается optional `M04 Коррекция ошибок`.

### Teaching point

Впервые показать optional node рядом с обязательным путём, но не заставлять его покупать.

---

## G004 — Создайте липидную оболочку

**Target:** 07:00  
**Node:** `M05 Липидная оболочка`  
**Цена:** 210 E + 28 I

### Reward

- global production ×1.20;
- визуальная структура получает выраженную мембрану;
- следующий payoff preview: `Протоклетка → Biomass`.

---

## G005 — Создайте протоклетку

**Target:** 10:00  
**Node:** `M06 Протоклетка`  
**Цена:** 520 E + 80 I

### Blocking event

Перед продолжением запускается `EV-BIO-01 Метаболический путь` из `08_EVENTS_AND_CHOICES.md`.

### Reward

- появляется Biomass;
- UI переходит к трём биологическим ресурсам;
- открывается Cell era;
- визуальный milestone `MS01 Жизнь`.

### Milestone copy

> **ЖИЗНЬ**  
> Теперь это можно назвать жизнью.

---

## G006 — Освойте мембранный транспорт

**Target:** 13:30  
**Node:** `C02 Мембранный транспорт`  
**Цена:** 650 E + 60 B + 90 I

### Prerequisite

Выбран `C01A/B/C` в EV-BIO-01.

### Reward

Membrane Pump ×1.75.

### Goal hint

Если не хватает Biomass — подсветить Assimilator, а не весь экран.

---

## G007 — Создайте геном

**Target:** 17:00  
**Node:** `C03 Геном`  
**Цена:** 1,050 E + 130 B + 180 I

### Reward

- mutation slot +1;
- Genome Copier ×1.80 по экономической модели;
- Archive UI впервые показывает силуэт закрытых наследуемых признаков как `???`.

### Mystery hook

Игрок видит, что часть генетического интерфейса недоступна в Timeline #1.

---

## G008 — Освойте митохондриальный симбиоз

**Target:** 21:00  
**Node:** `C06 Митохондриальный симбиоз`  
**Цена:** 1,850 E + 260 B + 300 I

### Reward

Energy ×1.60.

### Narrative

Это не новый сюжетный выбор: событие трактуется как breakthrough внутренней кооперации клетки.

---

## G009 — Станьте многоклеточным организмом

**Target:** 26:00  
**Node:** `C09 Многоклеточность`  
**Цена:** 3,600 E + 650 B + 720 I

### Reward

- новая эра;
- генераторы интерпретируются как ткани/системы;
- визуальный milestone `MS02 Многоклеточность`;
- запускается `EV-BIO-02 Архитектура тела`.

---

## G010 — Специализируйте ткани

**Target:** 31:00  
**Node:** `B02 Специализация тканей`  
**Цена:** 4,400 E + 1,000 B + 850 I

### Prerequisite

Выбран один `B01A/B/C`.

### Reward

все tissues ×1.35.

---

## G011 — Развейте органы чувств

**Target:** 36:00  
**Node:** `B05 Сенсорные клетки`  
**Цена:** 5,800 E + 1,350 B + 1,250 I

### Reward

- Neural output ×1.55;
- в диораме появляются реакции организма на среду;
- открывается preview `Нервная сеть`.

---

## G012 — Создайте нервную сеть

**Target:** 41:00  
**Node:** `B07 Нервная сеть`  
**Цена:** 8,200 E + 1,800 B + 1,750 I

### Reward

- открывается cognition/behavior layer;
- запускается `EV-BIO-03 Поведенческая стратегия`;
- возможны короткие micro-events «Опасность» / «Другой» как presentation событий, но они не должны останавливать экономику.

---

## G013 — Пробудите разум

**Target:** 46:00  
**Node:** `N06 Разум`  
**Цена:** 12,500 E + 2,800 B + 3,200 I

### Required path before completion

Минимально должны быть куплены:

- N02 Обучение;
- N03 Социальные сигналы;
- N05 Протоязык.

### Reward

- биологическая фаза фиксируется;
- рассчитывается стартовый пакет цивилизации;
- открываются Food / Materials / Knowledge / Population;
- milestone `MS03 РАЗУМ ПРОБУДИЛСЯ`;
- Destiny Goal меняется на `Создайте цивилизацию`.

### Presentation

Полноэкранный milestone можно пропустить после первой демонстрации текста, но нельзя полностью скрывать.

---

## G014 — Освойте огонь и совместную добычу

**Target:** 51:00  
**Nodes:** `T02 Огонь`, `T03 Совместная добыча`  
**Основная экономика:** 420 F + 240 M + 60 K для Fire; далее 610 F + 330 M + 95 K

### Before goal

Запускается `EV-CIV-01 Первая культурная традиция`.

### Reward

- Food production bonuses;
- впервые объясняется job allocation;
- цель учит не просто накапливать ресурсы, а перераспределять Population.

---

## G015 — Создайте племя

**Target:** 56:00  
**Node:** `T05 Племя`  
**Цена:** 900 F + 520 M + 145 K + Population 32

### Reward

- pop cap +25;
- job presets;
- milestone `MS04 ПЛЕМЯ`;
- событие `EV-CIV-02 Как делить добычу`.

### Soft failure rule

Недостаток Food не вызывает game over. Рост населения останавливается, включается recovery hint.

---

## G016 — Освойте земледелие

**Target:** 62:00  
**Node:** `T08 Земледелие`  
**Цена:** 1,650 F + 900 M + 300 K + Population 42

### Reward

- Farmer / Fields;
- устойчивый Food surplus;
- переход к settlement economy;
- запускается branch `EV-CIV-03 Специализация поселения`.

---

## G017 — Создайте постоянное поселение

**Target:** 68:00  
**Node:** `S02 Постоянное поселение`  
**Цена:** 2,800 F + 1,700 M + 520 K + Population 58

### Reward

- pop cap +40;
- birth ×1.10;
- визуальная смена шатров на постоянные дома/поля/дороги;
- milestone `MS05 МЫ ОСТАЛИСЬ`.

### Required narrative event

После покупки, но до G018, запускается `EV-NAR-01 Следы до нас`.

---

## G018 — Откройте письменность

**Target:** 74:00  
**Node:** `S04 Письменность`  
**Цена:** 3,700 F + 2,400 M + 920 K + Population 78

### Reward

- Knowledge ×1.50;
- Chronicle впервые становится видимым как отдельный раздел;
- часть карточек Chronicle закрыта символом `???`, подчёркивая будущие timelines/endings.

---

## G019 — Создайте город

**Target:** 80:00  
**Node:** `S08 Город`  
**Цена:** 5,500 F + 4,000 M + 1,600 K + Population 105

### Reward

- открывается Power;
- jobs обновляются до городской модели;
- новая визуальная стадия `V5 City`;
- запускаются `EV-CIV-04 Кто принимает решения?` и `EV-CIV-05 Городская специализация` в установленном порядке.

### Order

1. Milestone City;
2. Government-lite event;
3. Urban specialization branch.

---

## G020 — Механизируйте производство

**Target:** 87:00  
**Node:** `I02 Механизация`  
**Цена:** 8,500 M + 2,800 K + 1,100 PWR + Population ~135

### Reward

M/F ×1.35.

### UX

Goal card должен объяснить Power как новый bottleneck и предложить Steam Plant, если PWR отрицательный/слишком низкий.

---

## G021 — Войдите в эпоху машин

**Target:** 94:00  
**Node:** `I05 Индустрия`  
**Цена:** 14,000 M + 5,200 K + 3,200 PWR + Population 170

### Reward

- Industrial jobs;
- визуальный milestone `MS06 ЭПОХА МАШИН`;
- диорама получает фабрики/дым/железнодорожный слой;
- запускается `EV-CIV-06 Энергетический кризис`.

---

## G022 — Создайте современную энергосеть и научную базу

**Target:** 101:00  
**Nodes:** `A02 Электросеть` + инфраструктурное требование лабораторий/институтов  
**Ключевая цена A02:** 23,000 M + 9,500 K + 7,500 PWR + Population ~215

### Goal checklist

- выбрать предатомную специализацию `A01A/B/C`;
- обеспечить стабильный Power surplus;
- купить Electrical Grid;
- иметь минимум одну активную Research Institute/Laboratory line.

### Reward

- Power ×1.45;
- открывается Scientific Method / Atomic Theory path;
- запускается story anomaly `EV-NAR-02 Ошибка 17`.

---

## G023 — Войдите в атомный век

**Target:** 108:00  
**Node:** `A06 Атомный век`  
**Цена:** 36,000 M + 17,500 K + 15,000 PWR + Population 260

### Required prerequisite

`A05 Атомная теория`.

### Reward

- milestone `MS07 МЫ РАСКОЛОЛИ МАТЕРИЮ`;
- создаётся Stability = 100;
- включается crisis clock;
- production ×1.35;
- Archive произносит «Снова.» и затем исправляет сообщение;
- Destiny Goal меняется на `Переживите Великий фильтр`.

### Hard rule

С этого момента offline crisis clock заморожен в Timeline #1.

---

## G024 — Переживите глобальный кризис

**Target:** ~116:00 ending trigger, ~120:00 reset  
**Final node:** `X99 «Пепел»`

### Goal structure

Это не обычная purchase goal. Она состоит из crisis chain:

1. отреагировать на конфликт блоков;
2. пройти ложную тревогу раннего предупреждения;
3. выбрать Последний протокол;
4. увидеть ending;
5. подтвердить сохранение Архива.

### Trigger «Пепла»

```text
if time_since_atomic >= 480 sec OR stability <= 15:
    trigger_ash()
```

Минимальное время до ending в Timeline #1 — 7:15 после Atomic Age.

### Reward

- Archive Fragments;
- Chronicle card «Пепел»;
- evolutionary profile и выбранные branches сохраняются в Chronicle; отдельная валюта Genetic Echo в DS-02 не вводится;
- Meta Tree;
- teaser Timeline #2.

Подробности — `09_ENDINGS_AND_RESET.md`.

---

# 7. Branch events между core goals

Branch choices не должны случайно потеряться между экономическими целями.

| Event ID | После / перед | Связанная группа |
|---|---|---|
| EV-BIO-01 | после G005, до G006 | C01A/B/C metabolism |
| EV-BIO-02 | после G009, до G010 | B01A/B/C body |
| EV-BIO-03 | после G012, до G013 | N01A/B/C behavior |
| EV-CIV-01 | после G013, до G014 | T01A/B/C culture |
| EV-CIV-02 | после G015 | cooperation/dominance choice |
| EV-CIV-03 | после G016, до G017 | S01A/B/C settlement |
| EV-CIV-04 | после G019 | government-lite |
| EV-CIV-05 | после EV-CIV-04 | I01A/B/C city specialization |
| EV-CIV-06 | после G021 | energy crisis choice |
| EV-CIV-07 | в пути G022→G023 | A01A/B/C pre-atomic specialization |

Экономические branch node и narrative choice могут совпадать только тогда, когда это явно указано в `08_EVENTS_AND_CHOICES.md`. Нельзя автоматически превращать каждый tech branch в длинную сюжетную сцену.

---

# 8. Milestones

Milestone — это эмоциональный payoff, а не отдельная валюта.

| ID | Trigger | Заголовок | Visual state |
|---|---|---|---|
| MS01 | G005 | ЖИЗНЬ | V1 Cellular |
| MS02 | G009 | МНОГОКЛЕТОЧНОСТЬ | V2 Creature |
| MS03 | G013 | РАЗУМ ПРОБУДИЛСЯ | переход к V3 Tribe |
| MS04 | G015 | ПЛЕМЯ | V3 Tribe |
| MS05 | G017 | МЫ ОСТАЛИСЬ | V4 Settlement |
| MS06 | G021 | ЭПОХА МАШИН | V6 Industrial |
| MS07 | G023 | МЫ РАСКОЛОЛИ МАТЕРИЮ | V7 Atomic |
| MS08 | G024 | ПЕПЕЛ | V8 Ash |
| MS09 | reset saved | АРХИВ ПОМНИТ | Meta Tree teaser |

## 8.1. Milestone duration

Никакой milestone не должен превращаться в длинную блокирующую кат-сцену.

Рекомендуемая структура:

- 0.3–0.8 сек transition;
- заголовок;
- 1–2 короткие строки;
- CTA или auto-close через несколько секунд;
- gameplay simulation можно ставить на pause только там, где игрок принимает обязательный выбор.

---

# 9. Reward cadence

Сохраняется принцип GDD:

- 0–10 минут: reward каждые 30–90 секунд;
- 10–30 минут: meaningful unlock каждые 2–4 минуты;
- 30–60 минут: visual/system payoff каждые 5–10 минут;
- 60–120 минут: крупный feature/milestone примерно каждые 10–15 минут.

## 9.1. Анти-пустота

В первые 30 минут нельзя оставлять игрока без видимого следующего горизонта более 5 минут.

Если следующий core goal далёк, UI показывает один из промежуточных ориентиров:

- afford next generator milestone;
- optional evolution node;
- side quest;
- следующий визуальный threshold.

---

# 10. Bottleneck hints

Hint engine включается только при реальном stall.

## 10.1. Stall thresholds

| Период | Stall threshold |
|---|---:|
| 0–10 мин | 90 сек без заметного progress |
| 10–46 мин | 150 сек |
| 46–80 мин | 180 сек |
| 80–108 мин | 210 сек |
| Crisis | context-specific |

`progress` = рост доли выполнения цели минимум на 5 процентных пунктов либо покупка релевантного production объекта.

## 10.2. Диагностика

Goal Engine определяет основной дефицит:

```text
required_resource_rate
current_resource_rate
estimated_time_to_afford
population_gate
prerequisite_gate
storage/cap gate
```

Показывается только главная причина.

### Пример

> **Не хватает Knowledge**  
> Увеличьте число Scholars или постройте School.

CTA: `Показать`

Подсвечиваются только связанные элементы.

## 10.3. Запрещено

- автоматически покупать за игрока в Timeline #1;
- давать скрытый бесплатный ресурс как «подсказку»;
- показывать пять причин одновременно;
- использовать rewarded ad как стандартное решение bottleneck.

---

# 11. Catch-up и pacing integration

DS-02 не меняет формулу экономики:

```text
catchup_mult = min(1.18, 1 + delay_ratio × 0.50)
```

Она применяется только при отставании от stage target более чем на 12%.

Goal UI не должен сообщать игроку, что включён скрытый catch-up.

Если игрок опережает pacing:

- core content не nerf-ится;
- обязательные narrative events и prerequisites не скипаются;
- короткие narrative locks могут удерживать sequencing в пределах, уже заданных экономикой.

---

# 12. Side goals в Timeline #1

Side goals не блокируют core progression.

Одновременно в tutorial phase — максимум 2 активных side goal.

Рекомендуемый набор из источников:

| ID | Период | Цель | Reward class |
|---|---|---|---|
| SQ01 | biology | открыть 3 adaptations | Archive fragment / sample |
| SQ02 | biology | не уходить в negative energy 3 мин | temporary boost |
| SQ03 | tribe | 5 мин без Food deficit | Food in-run +5% |
| SQ04 | tribe | улучшить Campfire/Hearth | small Knowledge burst |
| SQ05 | city | развить мастерские | production module |
| SQ06 | city | открыть несколько технологий | Knowledge reward |
| SQ07 | industry | Energy surplus | Knowledge burst |
| SQ08 | industry | низкое загрязнение заданное время | relic fragment / Chronicle stamp |

Точные численные reward values для side goals в исходных документах полностью не определены. DS-02 фиксирует только reward class; значения должны быть вынесены в отдельную quest/balance table, чтобы не создавать скрытую новую экономику внутри этого документа.

---

# 13. Mystery / hidden-content hooks

Первый run должен ясно показывать, что увиденное — только часть игры.

Это делается не pop-up рекламой будущего контента, а интерфейсными следами:

- после G007 — закрытые genetic slots `???`;
- после G018 — Chronicle с закрытыми категориями концовок/цивилизаций;
- после EV-NAR-01 — первый anomaly flag;
- после EV-NAR-02 — story quest `Ошибка 17`, которую нельзя закончить в Timeline #1;
- после G023 — Archive демонстрирует знание события, которого «не должен» помнить;
- после reset — Meta Tree содержит ветви выше доступного Tier как силуэты;
- на экране нового Timeline допускается один teaser post-Ash / space route, но без раскрытия полного дерева.

## Rule

Не показывать игроку полный объём поздней игры числом экранов или десятками locked buttons. Достаточно 2–4 хорошо выбранных признаков глубины в каждый момент.

---

# 14. Goal UI mobile

На mobile Current Goal card располагается сразу под диорамой.

Карточка содержит максимум:

1. заголовок;
2. 1–3 progress rows;
3. reward preview;
4. primary CTA;
5. маленькую кнопку `?` / hint при необходимости.

### Запрещено

- длинный текст;
- горизонтальный скролл;
- больше одного primary CTA;
- обязательный hover;
- touch targets меньше 44 px.

Chapter Goal доступна разворачиванием карточки или в отдельном chapter sheet.

Destiny Goal видна компактно и не конкурирует с Current Goal.

---

# 15. Goal UI desktop

В левой панели:

- текущая Chapter Goal;
- Current Goal;
- до 2 side goals;
- компактный Destiny indicator.

При клике Current Goal можно показать:

- prerequisites;
- estimated bottleneck;
- what unlocks next;
- связанный объект/tech с кнопкой `Показать`.

---

# 16. Data model

Рекомендуемый формат core goal:

```json
{
  "id": "G019",
  "chapter": "CH05",
  "title": "Создайте город",
  "target_time_sec": 4800,
  "completion": {
    "node": "S08",
    "population_min": 105
  },
  "prerequisites": ["G018"],
  "blocking_events": [],
  "on_complete": [
    "unlock:power",
    "milestone:MS_CITY",
    "event:EV-CIV-04"
  ],
  "reward_preview": [
    "Power",
    "городская экономика",
    "новая стадия диорамы"
  ],
  "stall_threshold_sec": 180,
  "telemetry_key": "create_city"
}
```

Branch event:

```json
{
  "id": "EV-BIO-02",
  "blocks_goal": "G010",
  "trigger_after": "G009",
  "required": true
}
```

---

# 17. Analytics

Минимальные события:

```text
goal_revealed
goal_started
goal_stalled
goal_hint_opened
goal_completed
chapter_started
chapter_completed
milestone_shown
milestone_closed
```

Параметры `goal_completed`:

```text
goal_id
timeline
elapsed_real_sec
active_play_sec
session_index
species/path
resource_snapshot
production_snapshot
population
used_hint
catchup_active
```

## Key dashboard

Для G005, G009, G013, G016, G019, G021, G023, G024 считать:

- median;
- p25;
- p75;
- abandon rate до следующей цели;
- stall rate;
- hint usage;
- branch breakdown.

---

# 18. Implementation order

1. Реализовать data model Chapter/Core Goal.
2. Загрузить 24 core goal definitions.
3. Связать completion с node purchase / state conditions.
4. Подключить reward preview.
5. Добавить milestone triggers.
6. Добавить event blockers.
7. Реализовать stall detector.
8. Реализовать contextual hint.
9. Добавить side goal slots.
10. Добавить analytics.
11. Провести scripted simulation по целевым checkpoints.
12. Проверить mobile composition.

---

# 19. Acceptance criteria DS-02 / Goals

Система считается готовой, если:

- все 24 core goals имеют уникальные ID и однозначное completion condition;
- каждый evolution/civilization breakthrough первого run имеет понятный следующий горизонт;
- ни один обязательный branch event нельзя случайно перескочить;
- G013 достигается в целевом коридоре экономики около 46 минут, а не по старому GDD-таймингу;
- G019 связан с City/Power примерно на 80 минуте;
- G023 запускает Atomic/Stability примерно на 108 минуте;
- G024 приводит к ending, а не к hard gameplay failure;
- reset показывает следующий горизонт Timeline #2;
- на mobile всегда виден ровно один главный CTA;
- Goal Engine умеет определить главный bottleneck;
- rewarded ads не являются частью обязательного пути;
- все тайминги и цены берутся из конфигурации, а не зашиваются в UI.

---

# 20. Связанные документы

- `08_EVENTS_AND_CHOICES.md` — события, branch choices, flags и consequences;
- `09_ENDINGS_AND_RESET.md` — Stability, Великий фильтр, «Пепел», награды и переход Timeline #2;
- `02_ECONOMY_FIRST_120_MINUTES.md` — числовая экономика;
- `03_EVOLUTION_TREE.md` — узлы развития.
