# Хроники Эволюции — документация проекта

Этот каталог — каноническая проектная документация **Хроник Эволюции**.

Он используется как контракт между:
- пользователем/продакт-оунером;
- ChatGPT как design/content агентом;
- Codex как implementation агентом;
- репозиторием как долговременной памятью проекта.

Главный принцип: важное решение не должно существовать только в чате или только в коде.

---

## 1. Операционные файлы

### `PROJECT_STATE.yaml`
Единственный source of truth для текущего статуса проекта:
- текущая design session;
- зависимости;
- готовность документов;
- статус implementation iterations;
- gates для параллельной работы;
- open decisions;
- next action.

### `TODO.md`
Короткое человекочитаемое представление ближайших действий.

Если `TODO.md` расходится с `PROJECT_STATE.yaml`, верен `PROJECT_STATE.yaml`.

### `DECISIONS.md`
Канонические продуктовые/архитектурные решения, которые разрешают противоречия между более ранними документами.

### `GLOSSARY.md`
Единые термины, пользовательские названия и технические IDs/conventions.

### `production/DESIGN_SESSION_PLAN.md`
Разбивает проектирование на блоки формата:

**одна сессия/чат -> один связанный пакет -> review -> state update -> push -> новый чат.**

### `production/STATE_WORKFLOW.md`
Правила синхронизации state/TODO, параллельной работы и review gates.

### `production/IMPLEMENTATION_ITERATION_PLAN.md`
Roadmap Codex. Не является статус-файлом; фактический implementation status находится в `PROJECT_STATE.yaml`.

---

## 2. Структура

```text
docs/
├─ README.md
├─ PROJECT_STATE.yaml
├─ DECISIONS.md
├─ GLOSSARY.md
├─ TODO.md
├─ PRD.md
├─ 00_DOCS_STRUCTURE_AND_GENERATION_PLAN.md
│
├─ gdd/
│  ├─ 01_FIRST_120_MINUTES.md
│  ├─ 02_ECONOMY_FIRST_120_MINUTES.md
│  ├─ 03_EVOLUTION_TREE.md
│  ├─ 04_CIVILIZATION_PROGRESSION.md
│  ├─ 05_BUILDINGS_AND_JOBS.md
│  ├─ 06_TECH_TREE.md
│  ├─ 07_GOALS_AND_MILESTONES.md
│  ├─ 08_EVENTS_AND_CHOICES.md
│  ├─ 09_ENDINGS_AND_RESET.md
│  ├─ 10_META_PROGRESSION.md
│  └─ 11_BALANCE_RULES.md
│
├─ scenario/
│  ├─ 00_NARRATIVE_BIBLE.md
│  ├─ 01_TIMELINE_01_SCRIPT.md
│  ├─ 02_TIMELINE_02_SCRIPT.md
│  ├─ 03_ARCHIVE_STORY_ARC.md
│  ├─ 04_STORY_EVENTS.md
│  ├─ 05_NARRATIVE_FLAGS.md
│  ├─ 06_ENDINGS_COPY.md
│  └─ 07_COPY_GUIDE.md
│
├─ ux/
│  ├─ README.md
│  ├─ 00_UX_PRINCIPLES.md
│  ├─ 01_SCREEN_MAP.md
│  ├─ 02_MOBILE_WIREFRAMES.md
│  ├─ 03_DESKTOP_WIREFRAMES.md
│  ├─ 04_COMPONENT_STATES.md
│  └─ 05_TUTORIAL_AND_HINTS.md
│
├─ art/
│  ├─ README.md
│  ├─ 00_ART_DIRECTION.md
│  ├─ 01_LOCATIONS_AND_DIORAMAS.md
│  ├─ 02_ERA_TRANSITIONS.md
│  ├─ 03_BUILDINGS_AND_PROPS.md
│  ├─ 04_ASSET_MANIFEST.md
│  └─ 05_GENERATION_PROMPTS.md
│
├─ audio/
│  ├─ README.md
│  ├─ 00_AUDIO_DIRECTION.md
│  ├─ 01_MUSIC_CUES.md
│  ├─ 02_AMBIENCE.md
│  ├─ 03_SFX_LIBRARY.md
│  ├─ 04_STINGERS.md
│  └─ 05_GENERATION_PROMPTS.md
│
├─ technical/
│  ├─ 00_TECHNICAL_OVERVIEW.md
│  ├─ 01_EXISTING_CODE_AUDIT.md
│  ├─ 02_DOMAIN_ADAPTER.md
│  ├─ 03_GAME_STATE.md
│  ├─ 04_SAVE_ARCHITECTURE.md
│  ├─ 05_ANALYTICS_SCHEMA.md
│  ├─ 06_PLATFORM_INTEGRATION.md
│  └─ 07_TESTING_STRATEGY.md
│
└─ production/
   ├─ DESIGN_SESSION_PLAN.md
   ├─ STATE_WORKFLOW.md
   ├─ IMPLEMENTATION_ITERATION_PLAN.md
   ├─ CONTENT_PIPELINE.md
   └─ RELEASE_CHECKLIST.md
```

Файл в дереве может ещё не существовать, если его design session не завершена. Git не хранит пустые папки, поэтому разделы `ux/`, `art/`, `audio/` содержат собственные README до появления спецификаций.

---

## 3. Уже существующая база

Сейчас приняты как исходные:

- `PRD.md`;
- `gdd/01_FIRST_120_MINUTES.md`;
- `gdd/02_ECONOMY_FIRST_120_MINUTES.md`;
- `gdd/03_EVOLUTION_TREE.md`;
- `scenario/00_NARRATIVE_BIBLE.md`;
- `technical/01_EXISTING_CODE_AUDIT.md`;
- `00_DOCS_STRUCTURE_AND_GENERATION_PLAN.md`;
- `production/IMPLEMENTATION_ITERATION_PLAN.md`.

Актуальный список статусов всегда смотреть в `PROJECT_STATE.yaml`.

---

## 4. Иерархия источников истины

При конфликте сначала проверяется `DECISIONS.md`.

После него действует специализация документа.

### Статус проекта
1. `PROJECT_STATE.yaml`
2. `TODO.md`
3. roadmap/session plan

### Числа, production, цены, pacing
1. `DECISIONS.md`
2. `gdd/02_ECONOMY_FIRST_120_MINUTES.md`
3. `gdd/11_BALANCE_RULES.md` после его принятия для общих tuning rules
4. специализированные GDD
5. `gdd/01_FIRST_120_MINUTES.md`
6. PRD

### Evolution/tech/building/job graph
1. `DECISIONS.md`
2. `gdd/03_EVOLUTION_TREE.md` для биологического дерева
3. `gdd/04_CIVILIZATION_PROGRESSION.md`
4. `gdd/05_BUILDINGS_AND_JOBS.md`
5. `gdd/06_TECH_TREE.md`
6. ранний GDD

### Сюжет и тексты
1. `DECISIONS.md`
2. документы `scenario/`
3. `gdd/08_EVENTS_AND_CHOICES.md`
4. PRD/GDD

### UX
1. `DECISIONS.md`
2. документы `ux/`
3. GDD
4. PRD

### Арт/аудио
1. `DECISIONS.md`
2. `art/` и `audio/`
3. UX/scenario requirements
4. GDD
5. PRD

### Техническая реализация
1. `DECISIONS.md`
2. accepted `technical/` documents
3. code audit
4. implementation plan
5. дизайн-документы как requirements

Код сам по себе не переписывает продуктовую спецификацию.

---

## 5. Design-session workflow

Полные правила: `production/STATE_WORKFLOW.md`.

Коротко:

1. открыть `PROJECT_STATE.yaml`;
2. взять только текущую `design.current_session`;
3. прочитать её inputs;
4. сделать весь связанный пакет в одном чате;
5. пользователь проверяет;
6. после approval документы становятся accepted;
7. обновляются state/TODO/decisions/glossary;
8. push;
9. следующий блок начинается в новом чате.

Не начинать следующий design block автоматически до review текущего.

---

## 6. Роли

### ChatGPT
Отвечает за:
- PRD/GDD;
- сценарий и copy;
- UX specifications;
- балансные спецификации;
- art direction и asset manifests;
- generation prompts и производство артов;
- audio direction и prompts;
- согласованность документации;
- обновление design state после approval.

### Codex
Отвечает за:
- code audit;
- архитектуру реализации в рамках accepted technical contract;
- gameplay implementation;
- UI implementation;
- save/load;
- тесты;
- analytics hooks;
- platform integrations;
- performance/builds.

Codex не должен самостоятельно придумывать missing gameplay rules или переводить design session в done.

---

## 7. Параллельная работа

Текущий gate определяется `PROJECT_STATE.yaml`.

До принятия DS-03 implementation Codex в основном паузится, кроме безопасных baseline/research задач.

После DS-03 разрешается параллельно:
- продолжать narrative/UX/meta/art/audio design;
- завершать Codex Iteration 0 baseline;
- начинать Codex Iteration 1 после review technical contract.

Если два потока реально работают одновременно, использовать отдельные branches согласно `STATE_WORKFLOW.md`.

---

## 8. Scope текущего проекта

Главная цель — первый Timeline:

**Жизнь -> Разум -> Цивилизация -> Индустрия -> Атом -> Великий фильтр -> Пепел -> Архив -> Timeline #2 teaser.**

Глубокий космос, Bioseed, universes и поздний контент не должны расширять scope текущего vertical slice.

---

## 9. Data-driven правило

Баланс, evolution/tech nodes, buildings, jobs, goals, events, rewards, narrative flags, endings и visual/audio IDs должны быть data-driven там, где это разумно для текущей legacy architecture.

Не зашивать продуктовые данные в presentation layer без необходимости.

---

## 10. Именование

Основное название проекта во всех новых документах:

# Хроники Эволюции

`Evolve` используется только для обозначения исходного open-source проекта/legacy engine.
