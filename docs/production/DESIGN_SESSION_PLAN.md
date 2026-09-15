# Хроники Эволюции — план дизайн-сессий

Этот документ разбивает проектирование первого Timeline на самостоятельные блоки. Один основной блок проектирования выполняется в одной сессии/чате, затем проходит пользовательскую проверку, после чего обновляются `PROJECT_STATE.yaml`, `TODO.md`, при необходимости `DECISIONS.md`, и изменения пушатся в репозиторий.

## Принцип

Не генерировать всю документацию сразу. Каждый блок должен:

1. иметь понятные входы;
2. давать законченный набор связанных документов;
3. не зависеть от ещё не принятых решений следующего блока;
4. завершаться review gate;
5. после принятия становиться source of truth для следующих блоков.

Канонический статус сессий хранится в `docs/PROJECT_STATE.yaml`.

---

## DS-00 — Оркестрация документации и структуры

**Статус:** done

### Цель
Создать единый процесс работы между ChatGPT, пользователем, Codex и репозиторием.

### Результат
- `docs/README.md`
- `docs/DECISIONS.md`
- `docs/GLOSSARY.md`
- `docs/TODO.md`
- `docs/PROJECT_STATE.yaml`
- `docs/production/DESIGN_SESSION_PLAN.md`
- `docs/production/STATE_WORKFLOW.md`

### Gate
Структура принята, code audit Codex прочитан, следующая дизайн-сессия определена.

---

## DS-01 — Civilization gameplay contract

**Основной диапазон:** примерно 46–108 минут Timeline #1.

### Входы
- `docs/PRD.md`
- `docs/gdd/01_FIRST_120_MINUTES.md`
- `docs/gdd/02_ECONOMY_FIRST_120_MINUTES.md`
- `docs/gdd/03_EVOLUTION_TREE.md`
- `docs/DECISIONS.md`

### Создаём
1. `docs/gdd/04_CIVILIZATION_PROGRESSION.md`
2. `docs/gdd/05_BUILDINGS_AND_JOBS.md`
3. `docs/gdd/06_TECH_TREE.md`

### Должно быть решено
- фазы Tribe -> Settlement -> City -> Industry -> Atomic;
- полный набор buildings первого Timeline;
- jobs, unlock conditions и роли;
- технологический ствол и ветки;
- mapping к уже утверждённой экономике;
- стабильные IDs для будущей реализации;
- какие системы оригинального Evolve реально используются в первом Timeline, а какие скрыты;
- prerequisite graph без тупиков;
- визуальные hooks, которые позже нужны UX/art.

### Не делаем
- финальные тексты событий;
- детальные wireframes;
- финальные арты;
- implementation schema.

### Review gate
Все сущности 46–108 минут согласованы между progression, economy и evolution tree; нет неизвестных обязательных building/job/tech для следующего блока.

---

## DS-02 — Goals, events and first ending contract

### Входы
DS-01 + текущий GDD + Narrative Bible + `docs/production/DS-02_PRODUCT_INPUTS.md`.

### Создаём
1. `docs/gdd/07_GOALS_AND_MILESTONES.md`
2. `docs/gdd/08_EVENTS_AND_CHOICES.md`
3. `docs/gdd/09_ENDINGS_AND_RESET.md`

### Должно быть решено
- current/chapter/destiny goals на весь 0–120;
- rewards и completion conditions;
- tutorial hints и bottleneck hooks на уровне логики;
- все обязательные meaningful choices Timeline #1;
- event IDs, варианты и механические последствия;
- crisis flow;
- Ash trigger/variants;
- reset contract: что сбрасывается и что сохраняется;
- discovery/reveal progression: как уже в первые минуты показать масштаб будущего неизвестного контента Архива без спойлеров и ложных collection totals;
- reveal hooks для будущих ветвей, Chronicle, anomalies, outcomes и achievements;
- early manual interaction как запуск timed process/cycle, а не `+1 resource per click`;
- progression ручного участия: manual process -> self-replication/semi-auto -> automation;
- короткий tactile interaction для реакции/деления клетки с visual payoff без clicker grind;
- Archive Intervention как future gameplay hook для временного boost выбранного ресурса без зависимости baseline economy от рекламы.

### Review gate
Timeline #1 можно описать как data-driven последовательность gameplay states без необходимости придумывать механику в сценарии или UI. Первые минуты одновременно дают ручную причастность без clicker grind и показывают, что текущая линия — малая часть большого Архива.

---

## DS-03 — Technical architecture and data contract

### Входы
DS-01, DS-02, `technical/01_EXISTING_CODE_AUDIT.md`.

### Создаём
1. `docs/technical/00_TECHNICAL_OVERVIEW.md`
2. `docs/technical/02_DOMAIN_ADAPTER.md`
3. `docs/technical/03_GAME_STATE.md`
4. `docs/technical/04_SAVE_ARCHITECTURE.md`
5. `docs/technical/07_TESTING_STRATEGY.md`

### Должно быть решено
- граница legacy engine / новый gameplay contract / presentation;
- normalized state;
- entity schemas и stable IDs;
- event/domain-event model;
- config location/format recommendation;
- save wrapper и migration approach;
- test seams;
- как переиспользуются найденные Codex loop/resource/payment primitives;
- что не переписывается.

### Review gate
После утверждения Codex может завершить оставшиеся пункты Iteration 0 и начать Iteration 1 без самостоятельного проектирования доменной модели.

### Параллельность
После DS-03 реализация Codex может идти параллельно с DS-04/DS-05/DS-06.

---

## DS-04 — Meta progression and balance rules

### Создаём
1. `docs/gdd/10_META_PROGRESSION.md`
2. `docs/gdd/11_BALANCE_RULES.md`

### Должно быть решено
- Память Архива / AF;
- первый reset reward;
- permanent upgrades;
- Timeline #2 acceleration rules;
- branch retention/hybridization;
- catch-up/anti-snowball rules;
- offline ограничения первого run;
- tuning invariants и telemetry adjustment order;
- при необходимости meta-upgrades Archive Intervention: duration/charges/flexibility без разрушения baseline economy.

### Gate
Reset и второй run имеют конкретную механику, а не только narrative teaser.

---

## DS-05 — Timeline #1 full narrative package

### Создаём
1. `scenario/01_TIMELINE_01_SCRIPT.md`
2. `scenario/04_STORY_EVENTS.md`
3. `scenario/05_NARRATIVE_FLAGS.md`
4. `scenario/06_ENDINGS_COPY.md`
5. `scenario/07_COPY_GUIDE.md`

### Должно быть решено
- весь сценарный sequencing 0–120;
- точные короткие реплики Архива;
- milestone copy;
- Story events;
- Error 17;
- `Снова.`;
- crisis event chain;
- Last Protocol;
- Ash;
- summary/reset;
- teaser Timeline #2;
- flag IDs и последствия;
- narrative meaning неизвестных/повреждённых записей Архива, видимых игроку до их раскрытия.

### Gate
Для первого Timeline больше не требуется писать текст непосредственно во время implementation.

---

## DS-06 — UX architecture and wireframes

### Создаём
1. `ux/00_UX_PRINCIPLES.md`
2. `ux/01_SCREEN_MAP.md`
3. `ux/02_MOBILE_WIREFRAMES.md`
4. `ux/03_DESKTOP_WIREFRAMES.md`
5. `ux/04_COMPONENT_STATES.md`
6. `ux/05_TUTORIAL_AND_HINTS.md`

### Должно быть решено
- mobile-first gameplay shell;
- layout по фазам;
- resource visibility;
- goal card;
- bottom navigation;
- building/job/tech/evolution screens;
- event choice presentation;
- era transition;
- crisis UI;
- ending/reset UI;
- responsive desktop adaptation;
- component state matrix;
- Archive/collection preview, который рано показывает масштаб неоткрытого контента;
- locked / unknown / corrupted states вместо однообразной стены замков;
- fogged future evolution/tech branches;
- hidden achievements и incomplete Chronicle/Timeline states;
- manual process-start button, busy/progress state и visual payoff реакции/деления;
- UX-переход ручного процесса в автоматизацию;
- Archive Intervention: выбор target resource, timer, charges/cooldown и active-boost state.

### Gate
Codex может реализовать UI без самостоятельного продуктового дизайна. DS-06 не считается завершённым, пока оба handoff из `DS-02_PRODUCT_INPUTS.md` не оформлены в UX.

---

## DS-07 — Art direction, locations and era transitions

### Создаём
1. `art/00_ART_DIRECTION.md`
2. `art/01_LOCATIONS_AND_DIORAMAS.md`
3. `art/02_ERA_TRANSITIONS.md`

### Должно быть решено
- единый визуальный язык;
- camera/composition;
- palette/lighting по эпохам;
- V0–V8 diorama states;
- layers каждой сцены;
- branch visual thresholds;
- milestone illustrations;
- требования к animation/VFX;
- ограничения для mobile/web.

### Gate
Можно начать последовательную генерацию фоновых сцен и milestone art без изменения art direction от ассета к ассету.

---

## DS-08 — Art production manifest and prompts

### Создаём
1. `art/03_BUILDINGS_AND_PROPS.md`
2. `art/04_ASSET_MANIFEST.md`
3. `art/05_GENERATION_PROMPTS.md`

### Должно быть решено
- каждый required asset имеет стабильный ID;
- размер/формат/alpha/layers;
- dependency на visual state;
- variant rules;
- промпты и negative constraints;
- placeholder -> final replacement contract.

### После документации
Сами арты генерируются отдельными asset batches по эпохам, но это уже production задачи, а не изменение дизайна.

---

## DS-09 — Audio design and generation package

### Создаём
1. `audio/00_AUDIO_DIRECTION.md`
2. `audio/01_MUSIC_CUES.md`
3. `audio/02_AMBIENCE.md`
4. `audio/03_SFX_LIBRARY.md`
5. `audio/04_STINGERS.md`
6. `audio/05_GENERATION_PROMPTS.md`

### Должно быть решено
- musical identity;
- transitions между эпохами;
- loop rules;
- ambience layers;
- UI/gameplay SFX taxonomy;
- milestone stingers;
- crisis/ending audio arc;
- stable audio IDs;
- generation prompts.

### Gate
Все звуковые требования первого Timeline перечислены и могут производиться независимо от кода.

---

## DS-10 — Analytics, platform and production readiness

### Создаём
1. `technical/05_ANALYTICS_SCHEMA.md`
2. `technical/06_PLATFORM_INTEGRATION.md`
3. `production/CONTENT_PIPELINE.md`
4. `production/RELEASE_CHECKLIST.md`

### Должно быть решено
- analytics taxonomy;
- balancing telemetry;
- Yandex/VK adapter boundary;
- save/cloud responsibilities;
- ads integration points;
- content delivery pipeline;
- release gates;
- rewarded-ad activation flow для Archive Intervention;
- бесплатные charges vs rewarded refill, cooldown/frequency limits;
- поведение при unavailable/failed ad;
- telemetry использования boost/rewarded;
- platform SDK mapping;
- проверка, что baseline progression полностью проходим без рекламы;
- monetization/balance limits для улучшений Archive Intervention.

### Gate
DS-10 не считается завершённым, пока rewarded-механика Archive Intervention не оформлена как необязательное ускорение, а не обязательная часть экономики.

---

## DS-11 — Cross-document consistency + design freeze v1

### Цель
Проверить всю документацию первого Timeline как один продуктовый контракт.

### Проверяем
- одинаковые IDs;
- одинаковые timings;
- одинаковые names/resources;
- отсутствие orphan goals/nodes/assets;
- каждый story event имеет gameplay trigger;
- каждый visual/audio asset имеет реального потребителя;
- every implementation input exists;
- open decisions либо закрыты, либо явно deferred.

### Результат
**First Timeline Design Baseline v1.0**.

После него изменение канонической механики требует записи в `DECISIONS.md` и version bump соответствующего документа.

---

# Рекомендуемая параллельность

## Сейчас
Только DS-02. Codex на реализации паузится.

## После DS-03
Параллельно:
- ChatGPT/user: DS-04, DS-05, DS-06;
- Codex: завершение baseline-пунктов Iteration 0, затем Iteration 1.

## После DS-05 + DS-06
Параллельно можно вести:
- art track;
- audio track;
- implementation gameplay shell/domain work.

Не запускать Codex на конкретную playable era, если входные GDD/scenario/UX документы этой era ещё не прошли review gate.
