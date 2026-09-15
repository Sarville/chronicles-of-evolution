# Хроники Эволюции — Decisions

**Consolidated:** 2026-09-15 after DS-03 approval.  
Этот файл фиксирует принятые решения, имеющие приоритет над более ранними общими формулировками. Консолидация сокращает формулировки, но не меняет смысл ранее принятых DEC-001–DEC-022.

---

## DEC-001 — Название проекта
**Status:** accepted  
Основное название во всей новой документации и новом UI: **Хроники Эволюции**. Legacy Evolve допускается только как название исходного кода/истории миграции.

## DEC-002 — Первый релизуемый vertical slice
**Status:** accepted  
Timeline #1: жизнь → разум → цивилизация → индустрия → атом → кризис → Пепел → reset → teaser Timeline #2. Цель первого run ≈120 минут.

## DEC-003 — Числовой source of truth
**Status:** accepted  
`docs/gdd/02_ECONOMY_FIRST_120_MINUTES.md` — authority по production values, prices, rates и milestone timings.

## DEC-004 — Milestone times Timeline #1
**Status:** accepted  
Self Replication 2m; Proto-cell 10m; Multicellularity 26m; Sapience 46m; Tribe 56m; Agriculture 62m; City 80m; Industry 94m; Atomic 108m; Ash ~116m; reset ~120m. Это target windows, кроме явно заданных crisis clamps.

## DEC-005 — Ресурсы ранней биологии
**Status:** accepted  
Основные runtime currencies: Energy, Information, Biomass. RNA/DNA остаются thematic/content concepts до отдельного решения.

## DEC-006 — Resource visibility
**Status:** accepted  
UI показывает контекстные ресурсы текущей эры, а не весь список валют одновременно.

## DEC-007 — Первый ending неизбежен
**Status:** accepted  
Timeline #1 всегда приводит к `ENDING_ASH`. Выборы меняют путь, subtype, Chronicle, flags и reward evaluation, но не отменяют первый Ash.

## DEC-008 — Reset не является поражением
**Status:** accepted  
Reset — завершение истории и перенос Памяти Архива. Run resources/buildings/jobs/normal tech reset; Archive/Chronicle/achievements/persistent flags сохраняются по contract.

## DEC-009 — Data-driven gameplay
**Status:** accepted  
Evolution nodes, technologies, buildings, jobs, goals, events, costs/effects, narrative flags и endings должны быть data-driven настолько, насколько позволяет архитектура.

## DEC-010 — Не переписывать engine без доказанной необходимости
**Status:** accepted  
Legacy subsystems адаптируются/переиспользуются, если это безопаснее полного rewrite. Mass cleanup/rewrite запрещён без отдельного доказательства.

## DEC-011 — Новый UI поверх normalized state
**Status:** accepted  
Между gameplay и presentation существует normalized state; UI не зависит от множества legacy DOM selectors/side effects.

## DEC-012 — Mobile-first
**Status:** accepted  
Основной UX mobile-first; primary interactions без hover; touch targets ≥44 px; диорама остаётся главным визуальным элементом.

## DEC-013 — Итерационная реализация
**Status:** accepted  
Codex реализует последовательные playable/testable slices. Нельзя сначала построить все systems в полурабочем состоянии.

## DEC-014 — Dev time acceleration
**Status:** accepted  
Debug time scale минимум: 1× / 5× / 20× / 100×. Production UI его не показывает.

## DEC-015 — Реклама не участвует в базовом балансе
**Status:** accepted  
Timeline #1 полностью проходим без ads. Rewarded может ускорять, но не является обязательным.

## DEC-016 — Арт как layered diorama
**Status:** accepted  
Мир собирается слоями и thresholds, а не симулируется как полноценный city builder.

## DEC-017 — Контент отделён от implementation
**Status:** accepted  
Canonical scenario/copy/art/audio specs формируются документацией; Codex интегрирует, а не самостоятельно придумывает канонический контент.

## DEC-018 — Каноническая цивилизационная модель Timeline #1
**Status:** accepted  
Food/Materials/Knowledge/Population, Power после City; DS-01 jobs/buildings/T-S-I-A nodes. Deferred ранние концепты не становятся обязательными runtime entities без нового решения.

## DEC-019 — Профессии сменяются по фазам
**Status:** accepted  
Displayed job set заменяется на актуальный по эпохе; старые профессии не остаются параллельными production paths.

## DEC-020 — Tribe structures unique, поздняя infrastructure stackable
**Status:** accepted  
Tribal structures из DS-01 — unique phase structures; более поздняя infrastructure с growth — stackable. Producer milestones применяются только к явно tagged producers.

## DEC-021 — Ранний интерфейс показывает масштаб неизвестного контента
**Status:** accepted  
Использовать known/locked/unknown/corrupted/discovered states, silhouettes/fogged branches/Archive language; не показывать ложные collection totals.

## DEC-022 — Ручной input запускает процесс
**Status:** accepted  
Manual input запускает timed process/cycle, а не линейный `+1`. Progression: manual → self-replication/semi-auto → automation. Archive Intervention — отдельный будущий temporary boost hook.

## DEC-023 — Strangler architecture для нового gameplay
**Status:** accepted  
**Date:** 2026-09-15  
Timeline #1 реализуется в новом isolated domain (`src/chronicles`) поверх anti-corruption adapters. Legacy Evolve не является каноническим state нового gameplay и не переписывается целиком.

## DEC-024 — Canonical GameState, commands/events/selectors и ESM config
**Status:** accepted  
**Date:** 2026-09-15  
Новый `Chronicles GameState` — единственный runtime authority. Presentation посылает commands, domain применяет validation/mutations, эмитит immutable domain events и отдаёт selectors/view models. Canonical config — plain serializable ESM `.js` без DOM, arbitrary functions и `global` dependencies.

## DEC-025 — Новый save namespace и migration policy
**Status:** accepted  
**Date:** 2026-09-15  
Новый save использует versioned `chronicles_evolution` + backup/pending. Legacy `localStorage['evolved']` сохраняется нетронутым и не конвертируется автоматически в Timeline #1. Save разделяет schemaVersion/rulesetVersion и использует recoverable writes.

## DEC-026 — Reset transaction и headless test contract
**Status:** accepted  
**Date:** 2026-09-15  
Ending/reset формируется как idempotent transaction: immutable Timeline Summary + meta rewards + transaction ID + новый run коммитятся единым recoverable candidate. До расширения gameplay обязательны headless domain/config/save tests и ускоренная simulation. Clock/RNG/storage/platform/localization — injectable ports.

---

# Open decisions

- production UI framework / точная степень reuse Vue 2 — закрыть в DS-06 / UI implementation;
- точная Yandex/VK SDK mapping, rewarded flow и cloud conflict policy — DS-10;
- явно помеченные TBD/proposal balance values DS-01/DS-02 — отдельный balance/meta review, не скрытые constants;
- scope альтернативных endings и позднего Space/Bioseed за пределами первого vertical slice — отдельные будущие решения.