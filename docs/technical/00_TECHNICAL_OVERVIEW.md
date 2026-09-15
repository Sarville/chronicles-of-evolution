# Хроники Эволюции — Technical Overview

**Документ:** DS-03 / 00_TECHNICAL_OVERVIEW  
**Версия:** 1.0  
**Статус:** accepted  
**Область:** техническая архитектура Timeline #1 vertical slice  
**Входы:** DS-01, DS-02, `01_EXISTING_CODE_AUDIT.md`, `DECISIONS.md`

---

# 1. Цель

DS-03 определяет технический контракт, по которому Codex может реализовывать новый Timeline #1 без самостоятельного проектирования доменной модели и без большого rewrite исходного Evolve.

Архитектура должна одновременно:

- сохранить проверенные low-level части legacy runtime;
- отделить новый gameplay от `global`, jQuery/Vue templates и DOM selectors;
- сделать gameplay data-driven;
- дать единственный канонический `GameState`;
- позволить headless simulation полного 120-минутного Timeline;
- обеспечить versioned save, migration и безопасный idempotent reset;
- не блокировать будущую замену UI framework или подключение Yandex/VK.

---

# 2. Архитектурный принцип

Используется **Strangler / anti-corruption architecture**.

Legacy Evolve не переписывается целиком. Новый gameplay растёт рядом с ним и получает доступ к старому runtime только через адаптеры.

```text
                 ┌──────────────────────────┐
                 │      Gameplay config     │
                 │  serializable ESM data   │
                 └────────────┬─────────────┘
                              │
                              v
┌──────────────┐     ┌──────────────────────┐     ┌─────────────────────┐
│ Presentation │<--->│  Chronicles Domain   │<--->│   Adapter / Ports   │
│ selectors +  │ cmd │  canonical GameState │     │ legacy / storage /  │
│ view models  │     │  commands + events   │     │ locale / platform   │
└──────────────┘     └──────────┬───────────┘     └──────────┬──────────┘
                                │                            │
                                v                            v
                       ┌─────────────────┐          ┌────────────────────┐
                       │ Save / migration│          │ Legacy Evolve      │
                       │ versioned       │          │ worker + selected  │
                       │ envelope        │          │ primitives         │
                       └─────────────────┘          └────────────────────┘
```

## Hard rule

Ни один новый UI component не меняет экономическое состояние напрямую.

```text
UI
→ dispatch(command)
→ domain validation
→ state mutation
→ domain event(s)
→ selectors/view model
→ UI redraw
```

Legacy `global`, jQuery и Vue/Buefy не являются публичным API нового domain layer.

---

# 3. Source of truth

## 3.1. Design values

- цены, rates, milestone windows и production — `02_ECONOMY_FIRST_120_MINUTES.md`;
- evolution/tech node IDs и prerequisites — `03_EVOLUTION_TREE.md` + DS-01;
- buildings/jobs — DS-01;
- goals/events/endings/reset — DS-02;
- принятые cross-document решения — `DECISIONS.md`.

## 3.2. Runtime

Для нового Timeline единственным gameplay authority является:

```text
Chronicles GameState
```

`GameState` хранит минимальный persisted state. Prices, rates, availability, derived multipliers, World Tension и UI view models пересчитываются из `GameState + ruleset config`.

Legacy `global` может временно существовать рядом, но:

- не считается источником нового narrative/meta state;
- не читается presentation layer напрямую;
- любое взаимодействие с ним скрыто adapter layer;
- новые сущности не получают вторую независимую копию состояния в `global`.

---

# 4. Что переиспользуем из Evolve

| Legacy часть | Решение DS-03 | Причина |
|---|---|---|
| `evolve/evolve.js` low-drift worker | **reuse через RuntimeClockAdapter** | хороший источник cadence, не содержит gameplay state |
| `gameLoop` / loop cadence | **reuse concept / integration point** | проверенный scheduler |
| `modRes()` | **не публичный API нового domain**; формулу/clamp можно извлечь в pure ResourceService | функция жёстко мутирует `global` |
| `checkCosts()` / `payCosts()` | **extract/reimplement pure atomic payment contract** | legacy функция зависит от `global` и special-case ресурсов |
| `loadResource()` | **не reuse в domain** | одновременно создаёт state и Vue/jQuery UI |
| `actions` / `setAction` | legacy only; patterns можно использовать как reference | новый catalog задаётся DS config |
| callback/build queues | selective reuse только за port | не должны становиться доменной шиной событий |
| power grid | не использовать как каноническую Power-модель Timeline #1 | текущий GDD задаёт `Power` как ресурс, а не полный legacy grid |
| `seededRandom()` algorithm | **wrap as injectable RNG** | нужен deterministic test seam |
| `loc()` / string packs | **reuse через LocalizationPort** | полезная готовая localization boundary |
| LZString | **reuse codec** | подходит для localStorage/export |
| legacy migrations in `vars.js` | legacy save only | новый schema получает отдельный migration pipeline |
| `vBind`, jQuery helpers | presentation legacy only | запрещены как dependency domain |

---

# 5. Что не переписываем в DS-03 / Iteration 1

Не делаем:

- массовый refactor `main.js`, `actions.js`, `tech.js`;
- перенос всего исходного Evolve в новый framework;
- удаление legacy content;
- новый city-builder simulation;
- Yandex/VK SDK;
- cloud save;
- полный новый production UI;
- rebalance DS-01/DS-02;
- перенос позднего Space/Bioseed;
- автоматическую миграцию произвольного старого Evolve-progress в Timeline #1.

Iteration 1 должен быть преимущественно **headless/domain-first**.

---

# 6. Рекомендуемая структура кода

```text
src/
  chronicles/
    config/
      resources.js
      producers.js
      nodes.js
      buildings.js
      jobs.js
      goals.js
      events.js
      eras.js
      milestones.js
      endings.js
      effects.js
      index.js

    domain/
      state.js
      commands.js
      domainEvents.js
      engine.js
      selectors.js
      validation.js
      services/
        resources.js
        costs.js
        production.js
        modifiers.js
        evolution.js
        population.js
        goals.js
        events.js
        eras.js
        crisis.js
        reset.js

    adapters/
      runtimeClockAdapter.js
      legacyAdapter.js
      localizationAdapter.js
      storageAdapter.js
      platformPort.js

    save/
      codec.js
      migrations.js
      repository.js
      resetTransaction.js

    dev/
      debugApi.js
      simulation.js
```

Имена файлов могут быть уточнены Codex без изменения границ слоёв.

---

# 7. Canonical gameplay config

## Decision

Config первого vertical slice хранится как **plain serializable ES modules (`.js`)**.

Причины:

- проект уже ES modules + esbuild;
- не нужен новый TypeScript toolchain;
- JSON неудобен для composition/comments/imports;
- можно использовать JSDoc;
- объекты легко валидировать runtime;
- config остаётся сериализуемым и пригодным для headless tests.

## Hard constraints

Config:

- не мутирует state;
- не вызывает DOM;
- не содержит arbitrary callbacks/functions;
- не импортирует `global`;
- использует только stable IDs и declarative operations.

Пример:

```js
export const S08 = {
  id: 'S08',
  entityType: 'node',
  semanticRole: 'breakthrough',
  requiresNodes: ['S07'],
  populationMin: 105,
  cost: {
    food: 5500,
    materials: 4000,
    knowledge: 1600,
  },
  unlocks: [
    { type: 'resource', id: 'power' },
    { type: 'job_set', id: 'city_v1' },
    { type: 'building_set', id: 'city_v1' },
  ],
  transition: 'CITY',
  goalId: 'G019',
};
```

Для неизвестного/TBD значения поле либо отсутствует, либо явно:

```js
balanceStatus: 'tbd'
```

Codex не подставляет guessed default в канонический config.

---

# 8. Stable ID rules

После первого production save ID считается public persistence contract.

## Уже канонические семейства

```text
Resources: energy, information, biomass, food, materials, knowledge, power
Nodes: M*, C*, B*, N*, T*, S*, I*, A*, X*
Buildings: BLD_*
Jobs: JOB_*
Goals: G001..G024
Events: EV-*
Milestones: MS*
Ending: ENDING_ASH
Archive: AR*
```

## Rules

- player-facing name никогда не является ID;
- localization не меняет ID;
- переименование ID после release требует save migration/alias;
- removed entity не переиспользует старый ID;
- config validation проверяет глобальную уникальность в пределах entity type.

---

# 9. Domain commands

Command означает намерение игрока или runtime.

Минимальный набор:

```text
START_MANUAL_PROCESS
BUY_PRODUCER
BUY_NODE
BUY_BUILDING
ASSIGN_JOB
AUTO_ASSIGN_JOBS
SELECT_EVENT_CHOICE
ACK_MILESTONE
TICK
SET_APP_ACTIVE
CONFIRM_ENDING
CONFIRM_RESET
BUY_ARCHIVE_NODE
START_NEXT_TIMELINE
```

Command:

- может быть отклонён;
- сам по себе не является историческим фактом;
- содержит только необходимые arguments;
- проходит validation в domain.

Пример:

```json
{
  "type": "BUY_NODE",
  "nodeId": "S08"
}
```

---

# 10. Domain events

Domain event — immutable факт, произошедший после успешной команды.

Минимальный контракт:

```text
resource_changed
producer_bought
building_bought
job_assignment_changed
node_bought
branch_selected
goal_revealed
goal_started
goal_stalled
goal_completed
era_changed
milestone_reached
event_armed
story_event_started
story_choice_made
ending_triggered
archive_record_created
reset_completed
```

Envelope:

```json
{
  "type": "goal_completed",
  "eventId": "evt_...",
  "runId": "run_001",
  "timelineId": 1,
  "simulationTimeMs": 4800000,
  "payload": {
    "goalId": "G019"
  }
}
```

Domain events используются для:

- Goal/Event Engine;
- analytics hooks;
- Chronicle builder;
- presentation reactions;
- test assertions.

Это не означает, что нужно строить полноценный distributed event-sourcing system.

---

# 11. Effect engine

Config не выполняет код. Он описывает effects.

Минимальные declarative operations:

```text
resource.add
modifier.add
modifier.remove
unlock.add
flag.set
path_score.add
stability.add
era.transition
event.queue
goal.reveal
goal.complete
```

Пример:

```json
{
  "op": "modifier.add",
  "id": "A01B_KNOWLEDGE",
  "group": "branch_bonus",
  "target": "knowledge.rate",
  "stackMode": "multiplicative",
  "value": 1.30,
  "source": "A01B"
}
```

Каждый `op`, `target`, `group`, `stackMode` проходит whitelist validation.

---

# 12. Derived state и selectors

Не сохраняются и не мутируются UI:

- resource `/s`;
- current building price;
- node affordability;
- unlocked/available nodes;
- World Tension (`100 - stability`);
- final production multiplier;
- bottleneck reason;
- goal percentage;
- diorama presentation tier, если он однозначно выводится из state/config;
- localized labels.

Presentation получает immutable view model:

```text
selectTopResources()
selectCurrentGoal()
selectAvailableNodes()
selectJobs()
selectCurrentEvent()
selectCrisisView()
selectArchivePreview()
```

---

# 13. UI framework recommendation

DS-03 **не требует migration framework**.

Для ближайшей реализации:

- Vue 2/Buefy допускается как temporary host существующей страницы и dev/debug UI;
- новые domain modules не импортируют Vue, Buefy или jQuery;
- новый production UI из DS-06 работает только через commands/selectors;
- выбор Vue 2 / Vue 3 / другого presentation framework не блокирует Iteration 1.

Рекомендация: не наращивать новый permanent UI на legacy `__vue__`, jQuery selectors и string templates. Решение о production framework закрыть вместе с DS-06/первой UI implementation iteration.

---

# 14. Platform boundary

DS-03 вводит только interface seam, без SDK:

```text
PlatformPort
  ready()
  getLocale()
  getPlayerId()
  loadCloudSave()
  saveCloudSave()
  showRewarded()
  showInterstitial()
  track()
```

Default web implementation может быть no-op/local.

Yandex/VK mapping, signatures, ads и cloud responsibilities остаются DS-10.

Gameplay не вызывает `YaGames`/`vkBridge` напрямую.

---

# 15. Manual process contract

DEC-022 требует process-based input.

State:

```json
{
  "manualProcess": {
    "id": "PROC_PRIMORDIAL_REACTION",
    "status": "idle",
    "startedAtSimulationMs": null,
    "completeAtSimulationMs": null,
    "cooldownUntilSimulationMs": null
  }
}
```

Flow:

```text
START_MANUAL_PROCESS
→ validate idle/cooldown
→ state = running
→ TICK reaches completion
→ batch result
→ process_completed domain event
→ visual payoff
```

Ни один presentation handler не делает `resource += 1`.

---

# 16. Runtime clock

Новый domain получает не wall-clock callbacks, а:

```text
tick(deltaSimulationMs)
```

RuntimeClockAdapter может использовать существующий worker/cadence.

Rules:

- production math определяется `deltaSimulationMs`;
- debug scale меняет simulation delta, а не prices/rates;
- RNG и clock injectable;
- first-run crisis offline freeze реализуется domain policy, а не остановкой всего browser timer;
- catch-up/offline policy задаётся отдельно от render cadence.

---

# 17. Debug contract

Обязательно до контентной реализации:

```text
timeScale: 1 / 5 / 20 / 100
grantResource(id, amount)
setPopulation(value)
buyFree(entityId)
unlockNode(id)
setEra(id)
triggerEvent(id)
completeGoal(id)
setStability(value)
simulate(seconds)
dumpState()
validateConfig()
showModifierBreakdown(target)
showPrerequisiteTrace(id)
```

Dev API не входит в production navigation.

---

# 18. Принятые решения DS-03

1. Strangler architecture, без engine rewrite.
2. Новый canonical `GameState` для Timeline #1.
3. Serializable ESM config under `src/chronicles/config`.
4. Commands + immutable domain events + selectors.
5. Legacy functions доступны только через anti-corruption layer; DOM-coupled primitives не являются новым API.
6. Новый versioned save namespace; legacy `evolved` не конвертируется автоматически.
7. Headless Iteration 1; framework choice не блокирует domain work.
8. PlatformPort определяется сейчас, SDK details — DS-10.
9. Zero/low-dependency automated test + simulation harness обязателен до gameplay expansion.

---

# 19. Gate для Codex

После принятия DS-03 Codex может:

1. завершить Iteration 0 baseline;
2. создать `src/chronicles/`;
3. создать config validators и initial registries;
4. создать canonical GameState;
5. создать command/domain-event engine;
6. создать Runtime/Legacy/Storage ports;
7. реализовать Save v1;
8. добавить test/simulation harness;
9. только затем подключать реальные первые entities.

Codex не должен выбирать gameplay numbers, entity semantics или reset policy самостоятельно.