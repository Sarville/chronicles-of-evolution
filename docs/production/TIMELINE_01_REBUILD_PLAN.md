# Хроники Эволюции — план полной пересборки Timeline #1

**Статус:** approved for implementation planning.
**Дата:** 2026-09-16.
**Программа:** `timeline1-v3-full`.

---

## 1. Цель

Собрать один цельный первый Timeline от первой RNA до обязательного первого
`Ash` и Archive/reset за 105–120 минут активной игры. Это не продолжение
локальных итераций `0–18` по инерции, а их включение в единый балансируемый
контур `0–120`.

Первый Ash остаётся неизбежным. Он знакомит игрока с Archive и открывает
`T2 Memory`; он не является концом продукта. Дальнейшая карта `T2`–`U2`
зафиксирована в [long-term roadmap](../gdd/12_LONG_TERM_PROGRESSION_AND_RESET_ROADMAP.md).

## 2. Границы программы

### Входит

- `T1`-контент: биология, AP, Cognition, Sapience, Tribe, Settlement, City,
  Industry, Modern, Atomic, Great Filter, Ash и Archive;
- authored milestones/choices и procedural minor/major event deck с самого
  начала Timeline;
- здания, jobs, contextual crafting, population, power и crisis из GDD
  `01–11`;
- deterministic simulation, save/recovery, telemetry и mobile/desktop
  presentation для полного run;
- единый rebalance по профилям игры от 0 до 120 минут.

### Не входит

- runtime `T2+`: archetypes, genetics, policies, trade-lite, Orbit, Bioseed,
  planets, challenges и universes;
- буквальный перенос legacy DOM, старых формул или каждой микровалюты Evolve;
- незапланированный визуальный production-пакет DS-08. Его активы могут
  подключаться по готовности, но не блокируют доменную реализацию.

`T2+` здесь получает только устойчивые extension points: ending/Chronicle
record, content unlock registry и save-safe identifiers. Нельзя создавать
пустые UI-экраны поздних систем заранее.

## 3. Базовые правила реализации

1. Канон gameplay: GDD `01–11`; порядок reset-эпох: GDD `12`; точные
   narrative/presentation triggers: scenario и UX contracts.
2. `timeline1-v2-reconciled` остаётся именем существующего принятого
   биологического среза. Новый полный content ruleset получает отдельный
   идентификатор `timeline1-v3-full`; его нельзя подменять незаметной
   правкой активного v2 save.
3. Существующие RNA/DNA/Cell и Cell Coordination не выбрасываются. В `T1-0`
   они проходят config/goal/economy audit и затем проверяются в полном
   simulation pass. Принятый `0–10` baseline меняется только с явным
   balance decision и migration note.
4. Каждая content-волна обязана поставлять config validation, доменные
   тесты, целевую simulation profile, UI smoke и save compatibility check.
5. Нельзя начинать `T2` runtime, пока `T1-7` не завершит full-run regression
   и manual playtest. Поздние GDD пишутся до кода соответствующей эпохи.

## 4. Пакеты работы

| Пакет | Целевое активное время | Что поставляется | Gate перед следующим пакетом |
|---|---:|---|---|
| `T1-0` Foundation + Event Engine | 0–18 мин, retroactive | ruleset audit; полный event schema; seeded deck, cooldown, persisted deck state, `RESOLVE_EVENT`, queue priority, telemetry; RNA/DNA/Cell minor/major events; `meta.unlocks` и Chronicle contract | deterministic deck/save tests; no hard-lock loss; existing 0–18 sims remain explainable |
| `T1-1` Organism | 18–28 мин | `G008–G009`: AP, Multicellularity, adaptation presentation and costs | AP and branch profiles simulate within target window |
| `T1-2` Cognition | 28–40 мин | Nervous System, Cognition `0..100`, Sapience convergence, `G010–G013` | three biological profiles reach Sapience without hidden manual grind |
| `T1-3` First civilization | 38–65 мин | Tribe/Settlement, Population around 5, buildings, phase-aware jobs, Food/Morale/Knowledge loop, events | job reassignment, save/load and population-deficit recovery pass |
| `T1-4` City and Industry | 65–95 мин | City/Industry, contextual materials/crafting, market sheet, compact Power capacity/deficit, policies deferred | city/industry sim profiles; resources remain contextual in UI |
| `T1-5` Modern and Atomic | 95–108 мин | Modern bridge, Atomic transition, World Tension, Error 17, `Again`, late event deck | scripted and procedural events coexist; Atomic route timing passes |
| `T1-6` Great Filter and reset | 108–120 мин | Last Protocol variants, inevitable first Ash, AF award, Archive, idempotent reset transaction and `T2` teaser | repeated reset cannot duplicate rewards or corrupt state; ending and save recovery tests |
| `T1-7` Full-run closeout | 0–120 мин | rebalance, accessibility/UX pass, analytics taxonomy, performance, production build and manual playtests | release-candidate test matrix and approved timing profile |

## 5. `T1-0`: обязательный первый шаг

Event Engine идёт раньше `T1-1`, потому что random events — часть живого
первого Timeline, а не оформление готового контента.

### Контракт событий

- data config задаёт id, deck, phase window, preconditions, weight, cooldown,
  cap-safe effects, choices и telemetry key;
- RNG seed, used IDs, long cooldowns, pending queue и resolved outcomes живут
  в `GameState` и сериализуются;
- selector возвращает только eligible events; weighted draw детерминирован
  при равном state/seed;
- `RESOLVE_EVENT` атомарно применяет chosen effect и записывает историю;
- authored story/crisis events имеют приоритет над procedural deck, но не
  используют второй самодельный механизм;
- offline progress может подготовить event report, но не может выбрать
  decision за игрока;
- loss/reward соблюдают caps и не блокируют critical path.

### Audits в этом пакете

- сверить живой config с `G001–G007`, убрать либо формально обосновать
  неканонические временные nodes/goals;
- проверить отдельные `timeline1-v2-reconciled` saves: для внутреннего,
  незрелизного среза допускается явный restart/migration notice, но не
  молчаливое угадывание состояния;
- bump `CURRENT_SCHEMA_VERSION` только если меняется структура persisted
  state; ruleset version и schema version не смешивать;
- добавить event-aware headless profiles: normal, inactive/manual-light и
  branch variants.

## 6. Ожидаемый темп T1

| Граница | Target |
|---|---:|
| Cell | 9–11 мин |
| Cellular systems / G007 | 15–20 мин |
| Multicellularity | 24–28 мин |
| Sapience | 38–40 мин |
| Settlement | около 65 мин |
| City | 78–80 мин |
| Industry | 93–95 мин |
| Modern | 95–104 мин |
| Atomic | 107–108 мин |
| Ash + Archive | 105–120 мин |

Диапазоны сверяются по p25/p50/p75, а не по одному идеальному dev profile.
Случайное событие может менять локальную историю run, но не должно быть
единственной причиной попасть внутрь или вне этих границ.

## 7. Definition of done для полного T1

- новый игрок проходит понятную арку RNA → Ash без внешней инструкции;
- на протяжении run работают authored и procedural события; ранний DNA/RNA
  reward существует как capped deck outcome;
- игрок видит только релевантные 3–4 главные counters, а вторичные материалы
  открывает контекстно;
- первый Ash гарантирован и выдаёт `Archive Memory I`/AF только один раз;
- reset открывает корректный `T2` teaser и оставляет достаточный Chronicle
  record для будущих archetype/route systems;
- save/load/recovery устойчивы в pending event, crisis и reset boundary;
- full simulation, config/domain/save/UI/smoke/build gates проходят;
- есть manual mobile и desktop playtest от fresh state до Ash.

## 8. Порядок исполнения

```text
T1-0 Event Engine + 0–18 audit
→ T1-1 Organism
→ T1-2 Cognition
→ T1-3 First civilization
→ T1-4 City and Industry
→ T1-5 Modern and Atomic
→ T1-6 Great Filter and reset
→ T1-7 full-run closeout
→ design and implementation of T2 Memory
```

DS-08/DS-09 продолжаются как production tracks, но не меняют этот порядок
gameplay delivery. Любое изменение milestone semantics, reset condition или
time target требует обновить GDD/decision до изменения кода.
