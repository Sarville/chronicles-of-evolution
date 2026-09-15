# Хроники Эволюции — документация проекта

Этот каталог содержит продуктовую, игровую, сценарную, визуальную, аудио- и техническую документацию проекта **Хроники Эволюции**.

Главная цель структуры — разделить:
- продуктовые решения;
- игровой дизайн;
- сценарий;
- UX/UI;
- арт;
- звук;
- техническую архитектуру;
- план реализации.

Документация используется как контракт между:
- дизайнером/продуктовым агентом;
- агентом, который формирует сценарии, арт и аудио-спецификации;
- Codex, который выполняет имплементацию.

---

## 1. Главный принцип

Codex не должен самостоятельно придумывать или усреднять противоречащие друг другу продуктовые решения.

Если документы расходятся:

1. проверить `DECISIONS.md`;
2. использовать более специализированный документ;
3. если решение не зафиксировано — добавить вопрос в `TODO.md`;
4. не менять продуктовую логику без отдельного решения.

---

## 2. Структура

```text
docs/
├─ README.md
├─ DECISIONS.md
├─ GLOSSARY.md
├─ TODO.md
├─ 00_DOCS_STRUCTURE_AND_GENERATION_PLAN.md
│
├─ gdd/
│  ├─ 00_GAME_DESIGN_OVERVIEW.md
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
│  ├─ 00_UX_PRINCIPLES.md
│  ├─ 01_SCREEN_MAP.md
│  ├─ 02_MOBILE_WIREFRAMES.md
│  ├─ 03_DESKTOP_WIREFRAMES.md
│  ├─ 04_COMPONENT_STATES.md
│  └─ 05_TUTORIAL_AND_HINTS.md
│
├─ art/
│  ├─ 00_ART_DIRECTION.md
│  ├─ 01_LOCATIONS_AND_DIORAMAS.md
│  ├─ 02_ERA_TRANSITIONS.md
│  ├─ 03_BUILDINGS_AND_PROPS.md
│  ├─ 04_ASSET_MANIFEST.md
│  └─ 05_GENERATION_PROMPTS.md
│
├─ audio/
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
   ├─ IMPLEMENTATION_ITERATION_PLAN.md
   ├─ RELEASE_CHECKLIST.md
   └─ CONTENT_PIPELINE.md
```

---

## 3. Текущие исходные документы

Следующие документы являются исходной базой проекта и должны быть разложены по новой структуре:

| Текущий документ | Новое место |
|---|---|
| PRD проекта | `docs/PRD.md` |
| GDD первых 120 минут | `docs/gdd/01_FIRST_120_MINUTES.md` |
| Экономика первых 120 минут | `docs/gdd/02_ECONOMY_FIRST_120_MINUTES.md` |
| Дерево эволюции | `docs/gdd/03_EVOLUTION_TREE.md` |
| План сценария | `docs/scenario/00_NARRATIVE_BIBLE.md` |
| План структуры документации | `docs/00_DOCS_STRUCTURE_AND_GENERATION_PLAN.md` |
| План реализации | `docs/production/IMPLEMENTATION_ITERATION_PLAN.md` |

---

## 4. Иерархия источников истины

При конфликте документов используется следующий порядок.

### Числа, production, цены, pacing
1. `gdd/02_ECONOMY_FIRST_120_MINUTES.md`
2. специализированные balance-документы
3. `gdd/01_FIRST_120_MINUTES.md`
4. PRD

### Узлы развития, ID, prerequisites
1. `gdd/03_EVOLUTION_TREE.md`
2. специализированный tech/evolution document
3. GDD первых 120 минут

### Сюжет, тексты, narrative flags
1. документы `scenario/`
2. `gdd/08_EVENTS_AND_CHOICES.md`
3. PRD/GDD

### UX и представление
1. документы `ux/`
2. GDD первых 120 минут
3. PRD

### Арт и аудио
1. `art/` и `audio/`
2. GDD
3. PRD

### Техническая реализация
1. `technical/`
2. `DECISIONS.md`
3. production roadmap
4. остальные документы как требования

---

## 5. Рабочий процесс

### Дизайн и контент

1. Создать или обновить спецификацию.
2. Зафиксировать новые продуктовые решения в `DECISIONS.md`.
3. При необходимости обновить `GLOSSARY.md`.
4. Обновить `TODO.md`.
5. Только после этого передавать задачу Codex.

### Codex

Перед каждой итерацией Codex должен прочитать:

- `README.md`;
- `DECISIONS.md`;
- `GLOSSARY.md`;
- `TODO.md`;
- `production/IMPLEMENTATION_ITERATION_PLAN.md`;
- документы, перечисленные во входах текущей итерации.

После каждой итерации:

- выполнить тесты;
- проверить Definition of Done;
- обновить checklist;
- обновить `TODO.md`;
- перечислить изменённые файлы;
- записать выявленные противоречия;
- не начинать следующую итерацию автоматически.

---

## 6. Правило scope

Текущая главная цель — полностью реализовать первый Timeline:

**Жизнь → Разум → Цивилизация → Индустрия → Атом → Великий фильтр → Пепел → Архив → Timeline #2 teaser.**

Не реализовывать глубокий космос, Bioseed и поздние системы до завершения, тестирования и балансировки первого Timeline, если отдельное решение не говорит обратного.

---

## 7. Правило data-driven реализации

Баланс, дерево развития, цели, события и narrative flags должны храниться в данных/конфигурациях там, где это разумно.

Не зашивать в UI:

- цены;
- времена;
- branch prerequisites;
- тексты событий;
- награды;
- условия milestones;
- narrative flags.

UI должен отображать состояние доменной модели.

---

## 8. Именование

Рабочее и пользовательское название проекта:

# Хроники Эволюции

В новых документах не использовать старое рабочее название как основное название продукта.

Ссылки на Evolve допустимы только когда речь идёт об исходном open-source проекте или наследуемой технической логике.

---

## 9. Когда обновлять этот файл

Обновлять `README.md`, если:

- появилась новая крупная папка;
- изменился source-of-truth;
- появился новый обязательный тип документа;
- изменился процесс работы между контентом и реализацией.
