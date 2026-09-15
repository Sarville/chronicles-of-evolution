# GDD — первые 2 часа «Хроники Эволюции»
**Версия:** 0.1  
**Назначение:** vertical slice gameplay design document  
**Цель среза:** за 105–120 минут показать весь базовый цикл игры: жизнь → эволюция → разум → цивилизация → индустрия → атомный кризис → ending → prestige/reset.

> Все численные значения ниже — стартовые tuning targets. Они должны быть вынесены в конфигурацию и проверены telemetry/playtests.

---

# 1. Цели vertical slice

Игрок за первые 2 часа должен:
- понять основной resource loop;
- увидеть минимум 4 визуально разных стадии мира;
- сделать минимум 3 meaningful choices;
- получить первый разумный вид;
- построить цивилизацию;
- открыть индустрию;
- увидеть сюжет Великого фильтра;
- завершить первый timeline;
- понять смысл reset;
- захотеть начать Timeline #2.

---

# 2. Стадии первых 120 минут

| Минуты | Стадия | Основной unlock |
|---:|---|---|
| 0–2 | Искра | RNA |
| 2–7 | Репликация | DNA |
| 7–12 | Первая клетка | automation |
| 10–18 | Адаптация | первое ветвление |
| 18–28 | Многоклеточность | тело |
| 28–38 | Нервная система | разум |
| 38–50 | Племя | население / пища |
| 50–65 | Поселение | здания |
| 65–80 | Город | ремесло / знания |
| 80–95 | Индустрия | энергия |
| 95–107 | Атом | Filter Risk |
| 107–118 | Кризис | ending |
| 118–120 | Архив | reset + meta teaser |

---

# 3. Screen flow

## 0. Splash
Логотип.

## 1. Archive boot
Чёрный фон + системные строки.

## 2. Primordial view
Макро-сцена океана/клетки.

## 3. Evolution diorama
Микро/биологический мир.

## 4. Civilization diorama
Главный основной UI.

## 5. Era transition
Полноэкранная иллюстрация.

## 6. Crisis state
Тот же мир, но визуально напряжённый.

## 7. Ending
Отдельная cinematic scene.

## 8. Archive summary
Статистика + reward.

---

# 4. Ресурсы первой биологической стадии

## Energy
Получается автоматически из среды.

## RNA
Первый active/auto resource.

## DNA
Открывается после репликации.

## Biomass
Открывается с клеткой.

На экране одновременно максимум 3 ресурса.

---

# 5. 0:00–0:02 — Искра

## Сцена
Тёмный океан.

UI почти отсутствует.

### Story
> АРХИВ ЖИЗНИ // восстановление

### Objective
**Создайте первую устойчивую молекулу**

Требование:
10 RNA.

### Input
Первый tap/click:
+1 RNA.

После 3 кликов:
открывается Passive Reaction:
+0.5 RNA/s.

После 10:
покупается Self Replication.

### Visual
В воде появляется первая светящаяся структура.

### Reward
- passive RNA;
- новая цель.

### UX requirement
Игрок должен совершить первое успешное действие <20 секунд после загрузки.

---

# 6. 0:02–0:07 — Репликация

## Goal
**Научите информацию копировать себя**

Задачи:
- накопить 25 RNA;
- улучшить Replication ×3;
- создать 10 DNA.

## Upgrades
### Replication I
Стоимость: 10 RNA
+0.5 RNA/s

### Replication II
20 RNA
+1 RNA/s

### DNA synthesis
30 RNA
Открывает DNA.

## Side objective
**Без остановки**
Поддерживать положительное производство RNA 60 секунд.

Reward:
малый boost + Chronicle stamp.

### Narrative line
> «Информация научилась копировать себя.»

---

# 7. 0:07–0:12 — Первая клетка

## Goal
**Создайте клеточную оболочку**

Стоимость:
- 50 DNA;
- 100 RNA.

После покупки:
- появляется Cell;
- unlock Biomass;
- manual clicking перестаёт быть основным способом прогресса.

## New buildings
### Membrane
+stability

### Metabolism
+energy income

### Ribosome
+biomass conversion

## Objective chain
1. Производить 2 biomass/s.
2. Создать 50 biomass.
3. Развить organelle.

### Visual payoff
На экране уже явно живая клетка с внутренними структурами.

---

# 8. 0:10–0:18 — Первая развилка

Показывается milestone:
## ЖИЗНЬ ВЫБИРАЕТ ПУТЬ

Три варианта vertical slice.

## A. Поглощение
Theme: predator.
Bonus:
+25% biomass from active organisms.
Future bias:
carnivore/aggressive traits.

## B. Симбиоз
Bonus:
+15% passive generation;
+research bonus позже.

## C. Панцирь
Bonus:
+storage;
+resilience;
снижает crisis penalties позже.

### Требование
Выбор необратим в текущем timeline.

### Preview
Игрок видит:
- 2 явных бонуса;
- художественную миниатюру;
- hint будущего направления.

---

# 9. 0:18–0:28 — Многоклеточность

## Goal
**Создайте сложный организм**

Requirements:
- 500 biomass;
- 100 DNA;
- 3 organelles.

## New resource
Adaptation Points.

Получаются:
- за milestones;
- за mini quests.

## Upgrades
- Mobility;
- Sensory Cells;
- Digestion;
- Structural Tissue.

## Optional quest
### Исследователь
Открыть 3 адаптации.

Reward:
1 genetic sample.

## Visual
Из одиночной клетки возникает простое многоклеточное существо.

---

# 10. 0:28–0:38 — Разум

## Goal
**Преодолейте когнитивный порог**

Progress bar:
0–100 Cognition.

Получается из:
- sensory upgrades;
- neural tissue;
- social behavior.

### Mini-events
#### Опасность
Побег / нападение.

#### Другой
Конфликт / сотрудничество.

Выборы дают маленькие path scores.

## Milestone
При 100 cognition:

# РАЗУМ ПРОБУДИЛСЯ

Полноэкранная иллюстрация.

### Reward
Открывается Civilization mode.

---

# 11. Переход UI в 0:38

Экран визуально меняется.

Вместо биологической панели:
- живая landscape diorama;
- 3–5 представителей вида;
- костёр;
- природные ресурсы.

Новая resource set:
- Food;
- Materials;
- Knowledge;
- Population.

Старые biological resources уходят в Meta/Evolution tab.

---

# 12. 0:38–0:50 — Племя

## Starting values
Population: 5.

Jobs:
- Gatherer;
- Hunter/Forager depending species;
- Thinker.

## Primary goal
### ОБЕСПЕЧЬТЕ ПЛЕМЯ
- Food income ≥ 2/s;
- Population 10;
- Storage 100.

## Buildings
### Shelter
+population cap.

### Campfire
+knowledge.

### Food Store
+storage.

## First civilization choice
### Делить добычу
+cooperation
+population stability

или

### Лучшие получают больше
+production
+control score

## Visual
Добавляются:
- новые шатры;
- жители;
- костры;
- склад.

---

# 13. 0:45 — первая побочная задача

Открывается Side Quest panel.

Не больше 2 quests сразу в tutorial phase.

### Наблюдатель
Открыть 3 природных объекта.

Reward:
+50 Knowledge.

### Сытое племя
5 минут не допустить Food deficit.

Reward:
permanent-in-run Food +5%.

---

# 14. 0:50–1:05 — Поселение

Milestone:
# МЫ ОСТАЛИСЬ

Unlock:
- Farming;
- Workshop;
- Housing;
- Writing precursor.

## Chapter goal
**Постройте постоянное поселение**

Checklist:
- 3 Houses;
- 2 Farms;
- Workshop;
- Population 30.

## Buildings
House:
+5 cap.

Farm:
+food.

Workshop:
+materials efficiency.

Storehouse:
+storage.

## Visual transitions
- permanent houses;
- cultivated fields;
- roads;
- workshop smoke.

---

# 15. 0:55 — story event «Следы до нас»

На строительстве найден странный предмет.

Options:

### Исследовать
+knowledge
adds Archive anomaly flag.

### Разобрать
+materials
artifact lost.

### Сохранить
opens future secret quest.

В первом run последствия небольшие, но Chronicle фиксирует выбор.

---

# 16. 1:05–1:20 — Город

## Unlock
- organized labor;
- writing;
- trade-lite;
- formal research.

## Resource simplification
Main bar:
Food / Materials / Knowledge / Population.

Inside Production:
Wood / Stone / Metal.

## Goal
### СОЗДАЙТЕ ГОРОД
- Population 100;
- School;
- Market;
- 5 Workshops;
- Writing.

## Jobs
- Farmer;
- Worker;
- Scholar;
- Merchant.

## Auto assignment
В tutorial:
кнопка «Распределить автоматически».

---

# 17. 1:10 — Government-lite choice

Не полноценная система правительства.

Event:
## Кто принимает решения?

### Совет
+knowledge
+cooperation

### Вождь
+production
+control

### Купцы
+trade
+materials

Позже этот выбор mapping-ится в глубокую government system.

---

# 18. 1:20–1:35 — Индустрия

Milestone:
# ЭПОХА МАШИН

Визуальная смена:
- фабрики;
- дым;
- железная дорога;
- плотный город.

## New resource
Energy.

## Goal
### ЭЛЕКТРИФИЦИРУЙТЕ ГОРОД

Tasks:
- build Power Plant;
- produce 1000 Energy;
- research Motor;
- automate 1 Workshop.

## Tech
- Steam;
- Electricity;
- Mass Production;
- Chemistry.

---

# 19. 1:25 — Ключевой выбор «Энергетический кризис»

## Fossil industry
+40% Energy immediately.
+Industry score.
+Pollution.

## Renewable program
+20% Energy.
+Nature score.
unlock clean-tech quest.

## Atomic research
+30% Knowledge.
+future Atomic speed.
+Filter Risk.

Выбор меняет skyline.

---

# 20. 1:30 — новые side quests

### Мастер производства
Автоматизировать 3 здания.
Reward: production module.

### Чистый воздух
Удержать Pollution ниже threshold 10 минут.
Reward: relic fragment.

### Город света
Обеспечить Energy surplus.
Reward: +Knowledge burst.

---

# 21. 1:35–1:47 — Современная эпоха

Темп быстрый.

Задача:
### СОЗДАЙТЕ ГЛОБАЛЬНУЮ ЦИВИЛИЗАЦИЮ

- Population milestone;
- research Radio;
- research Computing precursor;
- connect regions.

Вместо полноценной карты мира:
прогресс-глобус / цивилизационная шкала.

---

# 22. 1:40 — первая странность Архива

System:
> Прогноз завершения цикла: доступен.

Immediately:
> ERROR 17

Через несколько секунд строка исчезает.

Story quest:
### Ошибка 17
«Найдите источник повреждённых данных.»

Полностью выполнить в первом run нельзя.

Это long-term hook.

---

# 23. 1:47–1:50 — Атом

Milestone:
# МЫ РАСКОЛОЛИ МАТЕРИЮ

Игрок строит:
- Research Reactor;
- Atomic Lab.

Unlock:
Nuclear Technology.

При unlock:
Архив пишет:
> «Снова.»

Через 1.5 секунды:
> «Событие зарегистрировано.»

---

# 24. Великий фильтр UI

Появляется отдельная шкала:
## НАПРЯЖЕНИЕ МИРА

0–100.

В первом run она scripted растёт, но скорость зависит от решений.

Factors:
- control;
- dominance;
- pollution;
- atomic choice;
- shortages.

Игрок получает задачи:
- стабилизировать food;
- удерживать energy surplus;
- провести diplomacy event.

Он может отсрочить crisis и улучшить reward, но не отменить первый ending.

---

# 25. Финальный sequencing

- **1:47** — Atomic unlock
- **1:50** — Filter warnings
- **1:55** — global crisis
- **1:58** — ending trigger
- **2:00** — reset screen

---

# 26. 1:50–1:55 — Глобальный кризис

Event chain.

## Событие 1
Конфликт двух блоков.

Options:
- уступить;
- санкции;
- силовая демонстрация.

## Событие 2
Автоматическая система раннего предупреждения фиксирует ложную тревогу.

Options:
- доверять системе;
- ручная проверка.

В первом run crisis всё равно развивается, но решения влияют на:
- score;
- reward;
- Chronicle epitaph.

---

# 27. 1:55–1:58 — Последний выбор

## Последний протокол

### Ответный удар
ending subtype: «Огонь».

### Попытка отключить оружие
ending subtype: «Слишком поздно».

### Передать контроль системе
teaser synthetic route.

Все три сходятся в tutorial ending «Пепел», но дают разные flags.

Позже эти варианты могут открыть реальные альтернативные endings.

---

# 28. 1:58 — Ending cinematic

Белая вспышка.

Затем:
- тишина;
- разрушенный skyline;
- медленный снег/пепел.

Текст:

# ЦИВИЛИЗАЦИЯ №1 ЗАВЕРШЕНА
## ПЕПЕЛ

> «Они научились изменять материю раньше, чем научились изменять себя.»

---

# 29. Итоговый экран

Статистика:
- Timeline 001;
- species;
- duration;
- max population;
- technologies;
- dominant path;
- notable choices.

Rewards:
- 100–150 Памяти Архива;
- 1 Genetic Echo;
- Chronicle card «Пепел»;
- unlock Meta Tree.

Важно:
до reset confirmation явно показать:

## Сохранится
- Память;
- генетический echo;
- Chronicle;
- achievements.

## Будет сброшено
- ресурсы;
- здания;
- population;
- technologies текущей цивилизации.

---

# 30. 2:00 — teaser второго run

Архив:
> Сохранение завершено.

> Подготовить новую биосферу?

Новая строка:
> **Мы можем изменить результат.**

CTA:
# СОЗДАТЬ НОВУЮ ЖИЗНЬ

После нажатия:
короткий preview нового Meta Tree.

Vertical slice заканчивается.

---

# 31. Первые цели по порядку

1. Создайте 10 RNA.
2. Запустите саморепликацию.
3. Создайте DNA.
4. Создайте клетку.
5. Стабилизируйте metabolism.
6. Выберите адаптацию.
7. Создайте многоклеточный организм.
8. Развивайте органы чувств.
9. Пробудите разум.
10. Обеспечьте племя пищей.
11. Достигните 10 населения.
12. Постройте постоянные дома.
13. Создайте поселение.
14. Откройте письменность.
15. Создайте город.
16. Организуйте производство.
17. Откройте пар.
18. Электрифицируйте город.
19. Выберите энергетический путь.
20. Создайте глобальную цивилизацию.
21. Исследуйте атом.
22. Переживите кризис.
23. Завершите Timeline #1.
24. Откройте Память Архива.

---

# 32. Reward cadence

## 0–10 минут
Reward каждые 30–90 секунд.

## 10–30 минут
Meaningful unlock каждые 2–4 минуты.

## 30–60 минут
Visual milestone каждые 5–10 минут.

## 60–120 минут
Major feature/milestone каждые 10–15 минут.

Нельзя оставлять игрока без нового понятного горизонта >5 минут в первые 30 минут.

---

# 33. Tutorial philosophy

Не использовать отдельный длинный tutorial.

Обучение через цели:
> Постройте Shelter.

При первом открытии:
короткий tooltip:
> Shelter увеличивает предел населения.

После первого использования tooltip больше не показывается.

---

# 34. Подсказки при bottleneck

Если objective не продвинулся X минут:

UI анализирует причину.

Пример:
> Не хватает Materials.

CTA:
**Показать, как увеличить производство**

Подсвечиваются:
- Workers;
- Workshop;
- Storage.

---

# 35. UI mobile первых 2 часов

## Portrait
Top:
4 resources.

Middle:
Diorama.

Below:
Current Goal card.

Bottom nav:
- Мир
- Люди
- Строить
- Наука
- Ещё

## Critical interactions
Все primary buttons:
≥44px touch target.

Не требовать hover.

---

# 36. Диорама: visual state list

## V0 Primordial
Океан.

## V1 Cellular
Макро-клетка.

## V2 Creature
Живое существо/биом.

## V3 Tribe
Костры/шатры.

## V4 Settlement
Поля/дома.

## V5 City
Рынок/мастерские.

## V6 Industrial
Фабрики/поезд.

## V7 Atomic
Реактор/современный skyline.

## V8 Ash
Разрушенный мир.

---

# 37. Asset list vertical slice

Минимум:
- 8 world backgrounds/states;
- 3 evolution branch illustrations;
- 1 Reason milestone;
- 1 Settlement milestone;
- 1 Industrial milestone;
- 1 Atomic milestone;
- 1 ending illustration;
- 20–30 building icons;
- 15–20 resource/technology icons;
- advisor/archive UI;
- particles and ambient animation assets.

---

# 38. Ads в первых 2 часах

## Первые 15 минут
Никакого fullscreen.

## Rewarded
Можно впервые показать как optional:
- после первого meaningful idle return;
- после ~20–30 минут как ×2 optional chest.

Не показывать aggressive reward prompts в tutorial.

## Fullscreen
Потенциальные точки:
- после «Разум пробудился»;
- после Industrial transition;
- после ending.

Но:
- не использовать все три в одной короткой session;
- global cooldown;
- пропуск при короткой session;
- ending ad только после того, как игрок увидел эмоциональный результат, не перед ним.

---

# 39. Offline в vertical slice

Если игрок ушёл >2 минут:
при возврате:
- summary;
- accumulated resources;
- completed passive research.

До первого reset offline cap можно сделать сравнительно небольшим, чтобы не перескочить tutorial milestones без участия.

---

# 40. Баланс reset reward

Цель:
Timeline #2 early phase должен проходиться примерно в 40–60% времени первого.

Первые permanent upgrades:
- +RNA base rate;
- +starting DNA;
- +early biomass;
- retain 1 trait;
- auto-complete first basic replication step.

Нельзя:
полностью скипать evolution на втором run.

Игрок должен увидеть, что progression ускорилась.

---

# 41. Side quests первых 2 часов

## Biology
### Наблюдатель
3 adaptations.

### Устойчивый организм
Не уйти в negative energy 3 минуты.

## Tribe
### Сытое племя
No food deficit 5 минут.

### Хранитель огня
Upgrade campfire.

## City
### Мастер
3 workshops.

### Учёный
5 technologies.

## Industry
### Город света
Energy surplus.

### Чистый воздух
Low pollution.

Награды:
- temporary boosts;
- Archive fragments;
- cosmetic Chronicle stamps.

---

# 42. Achievements первых 2 часов

### Искра
Создать жизнь.

### Мысль
Получить разум.

### Дом
Создать поселение.

### Тысяча рук
Развить массовое производство.

### Новый огонь
Открыть атом.

### Первый конец
Завершить Timeline #1.

---

# 43. Analytics checkpoints

T+1m:
first action.

T+5m:
DNA unlock.

T+12m:
evolution branch.

T+30m:
cognition.

T+45m:
tribe.

T+60m:
settlement.

T+80m:
city/industry.

T+100m:
atomic.

T+120m:
ending/reset.

Measure:
- elapsed real time;
- active time;
- objective stalls;
- ad impact;
- species/path;
- abandon stage.

---

# 44. Failure handling

В первых 2 часах нельзя hard-fail цивилизацию из-за плохого resource management.

Если Food падает:
- population growth stops;
- temporary penalty;
- recovery quest.

Если Energy отрицательна:
- production slows;
- система предлагает fix.

Реальные catastrophic failures появляются позже.

Первый ending должен быть narrative climax, а не punishment за UI misunderstanding.

---

# 45. Vertical slice success criteria

Срез считается успешным, если новый игрок:
- без внешней wiki понимает, что делать;
- ощущает визуальную эволюцию;
- помнит минимум один выбор;
- понимает причину первого ending;
- понимает, что сохраняется после reset;
- воспринимает Timeline #2 как новую возможность, а не повтор;
- после ending может сформулировать: «я хочу попробовать другую цивилизацию».

---

# 46. Следующий уровень детализации

После утверждения GDD необходимо отдельно сделать:

1. **balance table** всех production/cost values 0–120 минут;
2. **tech tree** первого run;
3. **building table**;
4. **job table**;
5. **evolution branch graph**;
6. **events table** с flags/consequences;
7. **quest table**;
8. **UI wireframes** mobile + desktop;
9. **diorama state specification**;
10. **analytics event schema**;
11. **ad frequency rules**;
12. **implementation map на существующий код Evolve**.
