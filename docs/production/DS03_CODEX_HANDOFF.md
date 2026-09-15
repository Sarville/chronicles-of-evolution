# Хроники Эволюции — DS-03 Codex Handoff

**Статус:** active implementation handoff  
**Дата:** 2026-09-15

Этот файл синхронизирует ближайшие implementation-шаги после принятия DS-03. Если старый `IMPLEMENTATION_ITERATION_PLAN.md` для Iteration 0/1 ссылается на прежние имена `00_ARCHITECTURE.md`, `02_DOMAIN_MODEL.md` или `03_DATA_SCHEMAS.md`, для ближайшей реализации использовать **этот handoff + `PROJECT_STATE.yaml`**.

## Сначала — закрыть Iteration 0

Codex должен выполнить и зафиксировать:

- baseline build confirmation;
- baseline bundle size;
- baseline startup measurement;
- smoke command/script decision.

Не начинать массовую gameplay implementation до успешного baseline build.

## Затем — Iteration 1: Domain adapter and data foundation

Обязательные technical inputs:

1. `docs/technical/00_TECHNICAL_OVERVIEW.md`
2. `docs/technical/02_DOMAIN_ADAPTER.md`
3. `docs/technical/03_GAME_STATE.md`
4. `docs/technical/04_SAVE_ARCHITECTURE.md`
5. `docs/technical/07_TESTING_STRATEGY.md`
6. `docs/technical/01_EXISTING_CODE_AUDIT.md`

Gameplay inputs:

- `docs/gdd/02_ECONOMY_FIRST_120_MINUTES.md`
- `docs/gdd/03_EVOLUTION_TREE.md`
- `docs/gdd/04_CIVILIZATION_PROGRESSION.md`
- `docs/gdd/05_BUILDINGS_AND_JOBS.md`
- `docs/gdd/06_TECH_TREE.md`
- `docs/gdd/07_GOALS_AND_MILESTONES.md`
- `docs/gdd/08_EVENTS_AND_CHOICES.md`
- `docs/gdd/09_ENDINGS_AND_RESET.md`
- `docs/DECISIONS.md`

## Первый implementation slice

```text
src/chronicles/
  config/
  domain/
  adapters/
  save/
  dev/

tests/
  config/
  domain/
  save/
  simulation/
```

Порядок:

1. serializable config registries + validators;
2. canonical initial GameState;
3. commands + domain events + selectors;
4. Resource/Cost/Production pure services;
5. clock/RNG/storage/localization/platform ports;
6. save repository skeleton with separate `chronicles_evolution` namespace;
7. zero/low-dependency config/domain/save tests;
8. headless simulation shell;
9. only then first real entity flow.

## Hard constraints

Codex не должен:

- менять канонические economy values;
- придумывать `TBD` balance constants;
- мутировать новый gameplay через legacy `global`;
- импортировать jQuery/Vue/Buefy в domain;
- переписывать весь Evolve;
- автоматически конвертировать legacy `evolved` save;
- выбирать production UI framework в Iteration 1;
- добавлять Yandex/VK SDK до DS-10.

## Gate Iteration 1

Минимальный результат Iteration 1:

- config validation проходит;
- headless engine создаёт новый run;
- ресурс можно изменить через command/service;
- node/building purchase использует atomic cost flow;
- domain event можно получить без DOM;
- state JSON-serializable;
- fake clock/RNG/storage работают;
- новый save namespace не меняет `localStorage['evolved']`;
- tests/smoke проходят.

После этого переход к Save v1/dev tools (Iteration 2) выполняется по accepted DS-03 save/testing contract.