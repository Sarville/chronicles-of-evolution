# Хроники Эволюции — DS-02 Product Inputs

**Status:** accepted input for DS-02  
**Date:** 2026-09-15  
**Purpose:** сохранить продуктовые решения, принятые между DS-01 и DS-02, и гарантировать их дальнейшее оформление в gameplay, UX и monetization/platform документации.

---

# 1. Future-content discoverability — масштаб Архива должен быть виден заранее

## Принцип

Игрок уже в первые минуты должен понимать, что текущая стадия — только малая часть большой игры. Интерфейс и progression должны постоянно показывать существование ещё не открытого контента, не раскрывая сюжетных спойлеров.

Игра должна обещать исследование через видимую структуру неизвестного:

- будущие эволюционные ветви;
- неизвестные формы жизни;
- цивилизационные пути;
- Chronicle / Timeline records;
- Archive anomalies;
- endings / outcomes;
- achievements;
- meta progression;
- поздние эпохи и дальние области дерева.

## Presentation principle

Не использовать бесконечную стену одинаковых серых замков. Locked/unknown content должен подаваться через язык Архива:

- `ЗАПИСЬ ПОВРЕЖДЕНА`;
- `ДАННЫЕ ОТСУТСТВУЮТ В ТЕКУЩЕЙ ЛИНИИ`;
- `ИСТОЧНИК НЕИЗВЕСТЕН`;
- `???`;
- silhouettes / fogged branches / incomplete collections.

Архив с самого начала показывает **масштаб**, но не содержание.

## Gameplay hooks для DS-02

DS-02 должен заложить discovery/reveal events в `07_GOALS_AND_MILESTONES.md` и при необходимости в `08_EVENTS_AND_CHOICES.md`:

- раннее открытие Index/Archive teaser;
- milestone, после которого игрок видит, что существуют неизвестные разделы;
- reveal hooks при крупных переходах;
- Chronicle entries и empty/unknown slots как мотивация replay;
- branch collection progress: выбран 1 путь, другие существуют;
- achievements/discoveries как часть long-term curiosity;
- `Следы до нас`, `ERROR 17`, `Снова.` и первый reset постепенно переосмысливают ранее видимые locked sections.

## Safety against false promises

Не показывать фиксированное количество (`2/47`, `14/83`) для контента, который ещё не зафиксирован production scope.

До content freeze предпочтительно:

- `2 обнаружено`;
- `неизвестные записи`;
- `???`;
- qualitative progress.

Численные collection totals разрешены только для реально существующего или гарантированно запланированного контента release scope.

## Downstream handoff

### DS-05
Оформить narrative meaning неизвестных/повреждённых записей Архива.

### DS-06
Обязательно спроектировать:
- Archive/collection preview;
- locked / unknown / corrupted states;
- fogged future tech/evolution branches;
- hidden achievements;
- incomplete Chronicle/Timeline states;
- способы показывать масштаб игры без spoiler overload.

---

# 2. Manual involvement without clicker grind

## Принцип

В «Хрониках Эволюции» ручной клик не должен означать `+1 ресурс`.

Ручное действие означает запуск процесса:

- запустить реакцию;
- инициировать каталитический цикл;
- инициировать деление клетки;
- провести короткий эксперимент;
- активировать временный импульс.

Процесс идёт некоторое время и сам выдаёт пакет результата.

Пример:

```text
Нажать «Запустить каталитический цикл»
→ 4 секунды процесса
→ визуальная реакция
→ +Energy / +Information пакетом
```

Это сохраняет ощущение причастности без механики «кликни 500 раз».

## Early-game arc

Предпочтительная эволюция взаимодействия:

```text
ручной запуск реакции
→ ручные короткие production cycles
→ Self Replication / частичная автоматизация
→ редкий manual catalytic pulse
→ Proto-cell / полная автоматизация базовой добычи
→ обычный resource clicking исчезает
```

Тематическая идея: сначала жизнь зависит от вмешательства Оператора, затем учится поддерживать себя сама.

Особенно желателен tactile moment с клеточным делением:

```text
Инициировать деление
→ 5–8 секунд анимации
→ клетка физически делится
→ пакет Biomass / Information
```

Несколько таких действий интересны благодаря visual payoff; сотни повторений запрещены самой моделью.

## Anti-abuse

- один click запускает timed process, а не мгновенный линейный gain;
- процесс имеет duration / busy state / cooldown;
- spam/autoclicker не даёт линейного преимущества;
- после раннего onboarding manual contribution быстро становится вторичной;
- baseline economy не должна зависеть от постоянного clicking.

## Archive Intervention — поздняя замена ручного клика

После того как обычная production полностью автоматизирована, активное «вмешательство» игрока может вернуться как редкая способность Архива.

Рабочая концепция:

**Вмешательство Архива / Воззвание к Архиву**

Игрок выбирает один доступный ресурс и временно усиливает его производство, например:

```text
selected resource production ×2
60 seconds
```

В первом balance pass это не является обязательной частью progression.

## Rewarded-ad mapping

Позднее Archive Intervention может быть связано с rewarded ad:

- реклама не участвует в baseline balance;
- игрок сам выбирает момент и target resource;
- rewarded даёт временный boost, а не уникальный обязательный ресурс;
- способность должна выглядеть как часть игровой системы, а не внешний рекламный popup.

Предпочтительная модель для исследования в DS-10:

- ×2 выбранного ресурса;
- примерно 60 секунд в базовой версии;
- не более одного активного boost;
- cooldown / charges;
- возможен бесплатный восстанавливаемый заряд;
- rewarded может восстанавливать/добавлять заряд;
- meta upgrades лучше увеличивают duration/charges/flexibility, а не уходят в экстремальные ×10 multipliers.

Финальные значения не фиксируются до balance/monetization pass.

## Gameplay hooks для DS-02

DS-02 должен определить:

- какие ранние goals требуют manual process start;
- когда процесс становится semi-auto;
- какой milestone окончательно убирает обязательный clicking;
- является ли manual catalytic pulse отдельным early ability;
- какие goal/tutorial hooks объясняют переход `manual intervention → self-sustaining life`;
- Archive Intervention как future gameplay hook без включения rewarded ads в baseline progression.

## Downstream handoff

### DS-06
Обязательно оформить UX:
- кнопка запуска процесса;
- busy/progress state;
- визуальный payoff реакции/деления;
- исчезновение/эволюция manual action;
- Archive Intervention UI;
- выбор target resource;
- boost timer/charge/cooldown states.

### DS-10
Обязательно оформить monetization/platform contract:
- rewarded-ad activation flow;
- бесплатные charges vs rewarded refill;
- cooldown/frequency limits;
- platform SDK behavior;
- ad unavailable/failure fallback;
- analytics;
- правило, что baseline progression проходит без рекламы;
- balance limits для улучшений Archive Intervention.

---

# 3. Product-level invariants

1. Игрок должен рано увидеть, что мир игры намного больше текущего экрана/эры.
2. Unknown content создаёт curiosity, но не раскрывает ключевые спойлеры.
3. Ручное взаимодействие означает запуск осмысленного процесса, а не единицу ресурса за click.
4. С развитием жизни производство естественно автоматизируется.
5. Позднее активное вмешательство возвращается в форме редкой способности Архива.
6. Rewarded ads могут ускорять процесс, но не являются обязательными для целевого pacing.
7. DS-06 и DS-10 не могут считаться завершёнными, пока соответствующие UX и monetization aspects этих принципов не оформлены.