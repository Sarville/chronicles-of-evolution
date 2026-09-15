# Хроники Эволюции — TODO

**Last update:** 2026-09-15

> `TODO.md` — короткое представление текущей работы. Канонический статус хранится в `docs/PROJECT_STATE.yaml`.

---

# Current phase

## Documentation design

Формат работы:

**одна design session -> один чат -> пакет связанных документов -> пользовательская проверка -> state/TODO update -> push -> новый чат.**

---

# Last completed design session

## DS-01 — Civilization gameplay contract

**Status:** done

Accepted documents:
- [x] `docs/gdd/04_CIVILIZATION_PROGRESSION.md`
- [x] `docs/gdd/05_BUILDINGS_AND_JOBS.md`
- [x] `docs/gdd/06_TECH_TREE.md`

Зафиксировано:
- [x] canonical progression Sapience -> Tribe -> Agriculture -> Settlement -> City -> Industry -> Atomic Age;
- [x] canonical jobs и buildings 46–108 минут;
- [x] stable design IDs для tech/jobs/buildings;
- [x] Merchant / Wood-Stone-Metal / Radio / Computing не являются обязательными runtime systems v1;
- [x] industrial resource называется Power;
- [x] Tribe structures unique, поздняя infrastructure stackable;
- [x] phase job sets не накапливаются параллельно.

Новые решения: `DEC-018` — `DEC-020`.

---

# Current design session

## DS-02 — Goals, events and first ending contract

**Status:** ready

### Goal

Сделать весь первый Timeline описываемым как data-driven последовательность целей, событий и кризисных состояний, не оставляя Codex необходимости самостоятельно придумывать gameplay-логику ending/reset.

### Inputs
- `docs/PRD.md`
- `docs/gdd/01_FIRST_120_MINUTES.md`
- `docs/gdd/02_ECONOMY_FIRST_120_MINUTES.md`
- `docs/gdd/03_EVOLUTION_TREE.md`
- `docs/gdd/04_CIVILIZATION_PROGRESSION.md`
- `docs/gdd/05_BUILDINGS_AND_JOBS.md`
- `docs/gdd/06_TECH_TREE.md`
- `docs/scenario/00_NARRATIVE_BIBLE.md`
- `docs/production/DS-02_PRODUCT_INPUTS.md`
- `docs/DECISIONS.md`

### Deliverables
- [ ] `docs/gdd/07_GOALS_AND_MILESTONES.md`
- [ ] `docs/gdd/08_EVENTS_AND_CHOICES.md`
- [ ] `docs/gdd/09_ENDINGS_AND_RESET.md`

### Must decide
- [ ] current/chapter/destiny goals на 0–120 минут;
- [ ] stable goal IDs и completion conditions;
- [ ] milestone sequencing;
- [ ] обязательные meaningful choices первого Timeline;
- [ ] government-lite choice и его mechanical flags;
- [ ] energy-crisis choice и mapping к DS-01 tech branches;
- [ ] `Следы до нас`;
- [ ] `ERROR 17` как gameplay/story hook;
- [ ] Atomic Age -> crisis handoff;
- [ ] Stability / World Tension presentation contract на уровне gameplay;
- [ ] crisis event chain;
- [ ] Last Protocol;
- [ ] Ash trigger/subtypes;
- [ ] reset: что сбрасывается и что сохраняется;
- [ ] какие значения передаются в Chronicle/meta layer;
- [ ] ранний Archive/discovery reveal: как игрок в первые минуты понимает масштаб ещё не открытого контента;
- [ ] reveal hooks для неизвестных эволюционных ветвей, Chronicle, anomalies, outcomes и achievements без сюжетных спойлеров;
- [ ] early manual interaction как запуск timed process/cycle, а не `+1 resource per click`;
- [ ] момент перехода `manual process -> self replication/semi-auto -> full automation`;
- [ ] возможность короткого manual catalytic/division interaction с visual payoff без clicker grind;
- [ ] Archive Intervention как future gameplay hook: временный boost выбранного ресурса без включения рекламы в baseline economy.

### Review gate
- [ ] каждый обязательный event имеет trigger и stable ID;
- [ ] каждый choice имеет механическое последствие или явно narrative-only flag;
- [ ] crisis не может быть случайно пропущен;
- [ ] Timeline #1 неизбежно приходит к Ash, но choices влияют на summary/reward/flags;
- [ ] reset contract однозначен;
- [ ] первые минуты показывают масштаб будущих открытий без ложных обещаний и крупных спойлеров;
- [ ] ручной onboarding не требует повторного линейного resource clicking;
- [ ] DS-03 получает полный gameplay state contract без необходимости придумывать goals/events/endings.

После approval перевести DS-02 в `done`, разблокировать DS-03, DS-04 и DS-05; DS-06 станет ready после DS-02 вместе с уже завершённым DS-01.

---

# Required downstream handoff

## DS-06 — UX architecture and wireframes

Обязательно оформить принятые в `DS-02_PRODUCT_INPUTS.md` принципы:

- [ ] Archive/collection preview с ранним ощущением большого объёма контента;
- [ ] locked / unknown / corrupted states;
- [ ] fogged future evolution/tech branches;
- [ ] hidden achievements / incomplete Chronicle states;
- [ ] manual process button, busy/progress state и visual payoff;
- [ ] UX перехода от ручного запуска к автоматизации;
- [ ] Archive Intervention UI, resource target, timer, charges/cooldown.

## DS-10 — Analytics, platform and production readiness

Обязательно оформить:

- [ ] rewarded-ad flow для Archive Intervention;
- [ ] бесплатные charges / rewarded refill / cooldown rules;
- [ ] fallback при недоступной/неуспешной рекламе;
- [ ] analytics для boost/ad use;
- [ ] platform SDK mapping;
- [ ] ограничение monetization: baseline progression не зависит от рекламы;
- [ ] balance limits для апгрейдов Archive Intervention.

---

# Codex / implementation

## Iteration 0 — Repo baseline and code audit

**Status:** partial / paused for design contract

### Уже сделано
- [x] Static code audit.
- [x] Module/architecture reconnaissance.
- [x] Найдены game loop, resource/payment primitives, save/reset, UI boundaries.
- [x] Проверено отсутствие Yandex/VK platform abstraction.
- [x] Создан `docs/technical/01_EXISTING_CODE_AUDIT.md`.

### Осталось перед закрытием Iteration 0
- [ ] Baseline build confirmation.
- [ ] Baseline bundle size.
- [ ] Baseline startup measurement.
- [ ] Решить/добавить smoke command/script.

### Gate

Не начинать Iteration 1 до approval **DS-03 — Technical architecture and data contract**.

---

# Current open decisions

Не блокируют DS-02, если не затрагиваются напрямую:

- [ ] exact UI framework / степень reuse Vue 2;
- [ ] canonical gameplay config format;
- [ ] legacy save compatibility vs new versioned wrapper;
- [ ] portal SDK abstraction details;
- [ ] visible World Tension vs Stability + explanations — желательно закрыть в DS-02;
- [ ] user-facing name Archive permanent currency — можно окончательно закрыть в DS-04.

---

# Rules for this phase

- [ ] Не писать gameplay implementation до DS-03 approval.
- [ ] Не проектировать финальные wireframes в DS-02.
- [ ] Не писать полный литературный сценарий вместо gameplay event contract.
- [ ] Не менять DS-01 economy/tech prerequisites без возврата DS-01 в review.
- [ ] Не расширять первый Timeline глубоким Space/Bioseed.
- [ ] `docs/production/DS-02_PRODUCT_INPUTS.md` является обязательным входом DS-02.
- [ ] После approval обновлять `PROJECT_STATE.yaml` и этот TODO в одном push cycle.

---

# Start command for next chat

> Продолжаем Хроники Эволюции. Открой GitHub, прочитай `docs/PROJECT_STATE.yaml` и выполни текущую design session.
