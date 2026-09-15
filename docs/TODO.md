# Хроники Эволюции — TODO

**Last update:** 2026-09-15

> `TODO.md` — короткое представление текущей работы. Канонический статус хранится в `docs/PROJECT_STATE.yaml`.

---

# Current phase

## Documentation design

Сейчас проектирование идёт блоками по `docs/production/DESIGN_SESSION_PLAN.md`.

Формат работы:

**одна design session -> один чат -> пакет связанных документов -> пользовательская проверка -> state/TODO update -> push -> новый чат.**

---

# Current design session

## DS-01 — Civilization gameplay contract

**Status:** ready

### Goal
Полностью формализовать цивилизационную часть первого Timeline примерно от Sapience до Atomic Age, не переходя пока к полному сценарию и UX.

### Inputs
- `docs/PRD.md`
- `docs/gdd/01_FIRST_120_MINUTES.md`
- `docs/gdd/02_ECONOMY_FIRST_120_MINUTES.md`
- `docs/gdd/03_EVOLUTION_TREE.md`
- `docs/DECISIONS.md`

### Deliverables
- [ ] `docs/gdd/04_CIVILIZATION_PROGRESSION.md`
- [ ] `docs/gdd/05_BUILDINGS_AND_JOBS.md`
- [ ] `docs/gdd/06_TECH_TREE.md`

### Review checklist
- [ ] Tribe -> Settlement -> City -> Industry -> Atomic progression согласована с economy timing.
- [ ] Все обязательные buildings имеют стабильные IDs, unlocks и функции.
- [ ] Все jobs имеют стабильные IDs и понятные роли.
- [ ] Tech tree не конфликтует с evolution tree.
- [ ] Нет обязательной gameplay-сущности 46–108 минут, которую следующий блок должен будет придумывать заново.
- [ ] Определены visual hooks для будущего UX/art, но не спроектирован сам UI.
- [ ] Все новые продуктовые решения добавлены в `DECISIONS.md`.

После approval перевести DS-01 в `done`, разблокировать DS-02 и обновить state.

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

### Текущий gate
Не начинать Iteration 1 до approval **DS-03 — Technical architecture and data contract**.

Безопасные измерительные/baseline задачи Iteration 0 можно выполнить отдельно, но сейчас основной фокус — документация.

---

# Immediately after DS-01

Следующий блок:

## DS-02 — Goals, events and first ending contract

Планируемые документы:
- `gdd/07_GOALS_AND_MILESTONES.md`
- `gdd/08_EVENTS_AND_CHOICES.md`
- `gdd/09_ENDINGS_AND_RESET.md`

После DS-02:

## DS-03 — Technical architecture and data contract

После его approval Codex можно запускать параллельно с дальнейшим design work.

---

# Current blockers / open decisions

Не блокируют DS-01, но должны быть закрыты до соответствующих этапов:

- [ ] exact UI framework / степень reuse Vue 2;
- [ ] canonical gameplay config format;
- [ ] legacy save compatibility vs new versioned wrapper;
- [ ] portal SDK abstraction details;
- [ ] visible World Tension vs Stability + explanations;
- [ ] user-facing name Archive permanent currency.

---

# Rules for this phase

- [ ] Не писать код gameplay в текущей design session.
- [ ] Не проектировать UX раньше gameplay contract.
- [ ] Не генерировать финальные арты до art direction + asset manifest.
- [ ] Не генерировать финальный audio pack до audio direction/cue map.
- [ ] Не расширять scope первым Space/Bioseed.
- [ ] Не закрывать session без пользовательского review.
- [ ] После approval обновлять `PROJECT_STATE.yaml` и этот TODO в одном push cycle.

---

# Start command for next chat

После завершения текущего блока достаточно написать:

> Продолжаем Хроники Эволюции. Открой GitHub, прочитай `docs/PROJECT_STATE.yaml` и выполни текущую design session.
