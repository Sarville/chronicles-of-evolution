# Хроники Эволюции — Великий фильтр, ending «Пепел» и первый reset

**Документ:** DS-02 / 09_ENDINGS_AND_RESET  
**Версия:** 1.0  
**Область:** конец Timeline #1, примерно 108–120 минут, плюс переход к Timeline #2  
**Статус:** implementation specification

---

# 1. Назначение

Документ задаёт полный финальный flow первого прохождения:

1. вход в Atomic Age;
2. появление шкалы Великого фильтра;
3. рост глобального напряжения;
4. crisis tasks и решения;
5. Последний протокол;
6. ending cinematic «Пепел»;
7. итоговую страницу Timeline;
8. расчёт permanent reward;
9. сохранение Chronicle/meta state;
10. reset;
11. teaser и старт Timeline #2.

Главный продуктовый принцип:

> Первый ending — narrative climax и объяснение prestige-loop, а не наказание игрока за неправильное управление ресурсами.

---

# 2. Канонические решения

## 2.1. Timing

Канонический pacing:

- Atomic Age — ~108:00;
- Ash — ~116:00;
- reset — ~120:00.

Ранний GDD использует близкий sequencing 1:47–2:00. Драматическая структура сохраняется, но привязывается к актуальной экономической шкале.

## 2.2. World Tension / Stability

В UI:

> **НАПРЯЖЕНИЕ МИРА** 0–100

В balance/code:

```text
Stability = 100 - WorldTension
```

Это одна шкала, не две независимые системы.

## 2.3. Permanent currency

Для vertical slice:

- **Память Архива** — название permanent/meta-системы;
- **Фрагменты Архива (AF)** — единственная spendable meta currency первого reset;
- первый reset даёт ориентир **14–18 AF**;
- `Genetic Echo` не вводится как отдельная spendable currency до DS-04/meta-progression specification.

---

# 3. Предусловия финального акта

Финальный акт начинается после `G023 — Войдите в атомный век`.

Минимальные условия:

```text
A05 Atomic Theory completed
A06 Atomic Age purchased
population >= 260
```

При покупке A06:

```text
stability = 100
crisis_clock = 0
crisis_active = true
atomic_load = 1
unresolved_crises = 0
production_event_mult = 1.35
```

Запускаются:

- `MS07 МЫ РАСКОЛОЛИ МАТЕРИЮ`;
- `EV-NAR-03 «Снова»`;
- Destiny Goal `Переживите Великий фильтр`;
- UI шкалы `НАПРЯЖЕНИЕ МИРА`.

---

# 4. Философия Великого фильтра

Игрок должен чувствовать, что:

- решения имеют последствия;
- кризис можно замедлить;
- отдельные риски можно увидеть и снизить;
- хорошая игра улучшает summary/reward;
- но первый конец ещё нельзя полностью предотвратить.

Нельзя создавать ощущение:

> «Я проиграл, потому что не понял UI».

Правильное ощущение:

> «Эта Timeline закончилась, но Архив сохранил опыт, и следующий цикл можно изменить».

---

# 5. Stability model

Базовая формула economy v1.0:

```text
stability_drain/sec = 0.08
                    + atomic_load × 0.025
                    + unresolved_crises × 0.045
```

Начало:

```text
atomic_load = 1
```

Рискованные атомные upgrades могут добавлять `atomic_load`.

## UI thresholds

| Stability | World Tension | UI state |
|---:|---:|---|
| 100–76 | 0–24 | normal |
| 75–51 | 25–49 | warning |
| 50–26 | 50–74 | severe |
| 25–16 | 75–84 | critical |
| ≤15 | ≥85 | ending-ready |

Точные цвета/анимации задаются UX/art spec. Цвет не должен быть единственным сигналом.

---

# 6. Crisis clock и clamps

Основной trigger:

```text
if time_since_atomic >= 480 sec OR stability <= 15:
    trigger_ash()
```

Дополнительное правило первого Timeline:

```text
minimum_ash_time = 435 sec after Atomic Age
```

То есть:

- раньше 7:15 ending не срабатывает;
- после 7:15 может сработать по `Stability <= 15`;
- на 8:00 после Atomic Age срабатывает в любом случае.

Clamp нужен, чтобы игрок успел увидеть шкалу, минимум два crisis event, один crisis/atomic response и Last Protocol.

---

# 7. Offline rule

В Timeline #1:

```text
if crisis_active and app_inactive:
    freeze(crisis_clock)
    freeze(stability_drain)
```

При возвращении:

- сначала показать return summary;
- не запускать ending до восстановления gameplay UI;
- затем продолжить кризис.

Первый «Пепел» должен произойти в присутствии игрока.

---

# 8. Crisis phases

## C0 — Atomic euphoria

**Окно:** +0:00–1:30 после A06.

- production ×1.35;
- мир визуально на пике развития;
- Archive выдаёт «Снова.»;
- World Tension начинает медленно расти.

## C1 — Предупреждения

**Окно:** примерно +1:30–3:00.

- появляется явный warning state;
- Goal Engine просит сохранить supply/Power surplus;
- запускается `EV-CR-01 Конфликт двух блоков`.

## C2 — Системный риск

**Окно:** примерно +3:00–5:30.

- tension становится главным видимым риском;
- доступны X-crisis nodes;
- запускается `EV-CR-02 Ложная тревога`.

## C3 — Критическая фаза

**Окно:** примерно +5:30–7:15.

- UI переходит warning → severe → critical;
- игрок может улучшить Stability/понимание причин;
- никакой hard fail по ресурсам не должен завершить run раньше narrative climax.

## C4 — Последний протокол

**Окно:** +7:15–8:00 либо раньше по критическому Stability после clamp.

- запускается `EV-CR-03 Последний протокол`;
- после выбора ending armed;
- cinematic больше не может быть отменён Timeline #1.

---

# 9. Crisis goals

Внутри G024 используются внутренние subgoals, не заменяющие основной Goal ID.

## CR-G01 — Удержите базовое снабжение

Проверяет отсутствие длительного критического дефицита.

Soft failure:

- добавляет crisis pressure/tag;
- не завершает Timeline немедленно.

## CR-G02 — Снизьте напряжение

Связано с EV-CR-01.

## CR-G03 — Проверьте предупреждение

Связано с EV-CR-02.

## CR-G04 — Выберите Последний протокол

Обязательный финальный выбор.

---

# 10. Crisis technology nodes

Используются узлы X из evolution tree.

## X01A — Reactor Prototype

```text
Cost: 18k M + 9k K + 12k PWR
Effect: PWR ×1.65
Risk: atomic_load +1
Archive tag: atomic_mastery
```

## X02A — Distributed Grid

```text
Cost: 24k M + 12.5k K + 16k PWR
Effect: PWR ×1.35
Effect: drain −0.02/s
Archive tag: grid_resilience
```

## X01B — Global Science Network

```text
Cost: 26k M + 15k K + 17.5k PWR
Effect: K ×1.35
Archive tag: shared_science
```

## X02B — Risk Forecasting

```text
Cost: 18k M + 14k K + 10k PWR
Effect: shows Stability drain causes
Archive tag: foresight
```

## X01C — Strategic Atom

```text
Cost: 20k M + 11k K + 13.5k PWR
Effect: M/K ×1.15
Risk: Stability drain ↑
Archive tag: deterrence
```

## X02C — Centralized Coordination

```text
Cost: 12k M + 8k K + 7k PWR
Effect: Stability +18 once
Archive tag: coordination
```

Ни один из узлов не отменяет «Пепел» в Timeline #1.

---

# 11. Crisis bonus

Экономика задаёт `crisis_bonus = 0..4`, но не полный mapping. DS-02 фиксирует прозрачный default mapping:

```text
+1  CR-G01 completed without prolonged critical shortage
+1  de-escalating/manual-verification crisis action
+1  Stability >= 25 at Last Protocol
+1  at least one resilience/science crisis node completed
```

Maximum:

```text
crisis_bonus = 4
```

Это влияет на AF, но не меняет сам факт Ash.

Все условия должны жить в config и логироваться.

---

# 12. Last Protocol readiness

Last Protocol становится доступен, если:

```text
crisis_clock >= 435 sec
OR stability <= 22
```

Но если `stability <= 15` раньше 435 сек:

```text
ash_pending = true
wait until minimum_ash_time
show Last Protocol
```

Если наступило 480 сек, а игрок не выбрал:

- simulation ставится на controlled pause;
- Event Card Last Protocol становится обязательной;
- ending не идёт за спиной UI.

---

# 13. Last Protocol variants

Главный ending ID во всех случаях:

```text
ENDING_ASH
```

## A — Ответный удар

```text
last_protocol = retaliate
ending_subtype = ash_fire
```

Player-facing subtype:

> **Пепел — Огонь**

Chronicle emphasis:

- dominance;
- escalation;
- retaliation.

## B — Попытка отключить оружие

```text
last_protocol = disarm
ending_subtype = ash_too_late
```

Player-facing subtype:

> **Пепел — Слишком поздно**

Chronicle emphasis:

- preservation;
- late de-escalation;
- failure to stop cascade.

## C — Передать контроль системе

```text
last_protocol = delegate_system
ending_subtype = ash_system
meta.archive.synthetic_route_teased = true
```

Player-facing subtype:

> **Пепел — Последний оператор**

Chronicle emphasis:

- machines;
- control;
- synthetic-route teaser.

---

# 14. Ending cinematic

Sequence:

1. последний выбор подтверждён;
2. 0.5–1.5 сек визуальной паузы;
3. белая вспышка;
4. звук резко уходит;
5. появляется V8 Ash — разрушенный skyline, пепел/снег, редкие пожары;
6. заголовок:

# ЦИВИЛИЗАЦИЯ №1 ЗАВЕРШЕНА
## ПЕПЕЛ

7. основная строка:

> «Они научились изменять материю раньше, чем научились изменять себя.»

8. короткая строка subtype;
9. CTA:

> **Сохранить в Архив**

## Rule

Сначала эмоциональный результат, потом статистика и reward.

---

# 15. Ads вокруг ending

Нельзя показывать interstitial:

- перед белой вспышкой;
- между Last Protocol и результатом;
- поверх первой демонстрации Ash;
- перед выдачей обязательной permanent reward.

Если fullscreen/rewarded monetization позднее используется после ending, она допускается только после Archive Summary и не может блокировать AF/Chronicle save.

---

# 16. Archive Summary

Summary строится из четырёх блоков.

## 16.1. Мир

- Timeline 001;
- duration;
- max population;
- era reached;
- ending + subtype.

## 16.2. Вид

- metabolism branch;
- body branch;
- behavior branch;
- optional biological traits;
- species visual/archetype label.

## 16.3. Цивилизация

- cultural tradition;
- settlement specialization;
- governance profile;
- city specialization;
- energy path;
- preatomic specialization;
- dominant path descriptor.

## 16.4. Фильтр

- minimum Stability;
- Last Protocol;
- crisis nodes;
- crisis bonus;
- notable crisis decisions.

---

# 17. Notable choices

Summary не должен выводить полный лог из десятков строк.

Показывать максимум 4 карточки:

1. главный biological choice;
2. `Следы до нас`;
3. энергетический путь;
4. Last Protocol.

Остальные события доступны в Chronicle detail view.

---

# 18. Dominant path

Dominant path — descriptive summary, не отдельная валюта и не новый ending.

Возможные labels первого run:

- Хранители;
- Технократы;
- Торговая сеть;
- Имперский профиль;
- Синтетический уклон;
- Смешанный путь.

Timeline #1 всегда имеет главный ending `Пепел`, независимо от profile label.

---

# 19. Archive Fragments reward

Каноническая формула economy v1.0:

```text
AF = 8
   + floor(unique_evolution_nodes / 5)
   + floor(peak_population / 75)
   + crisis_bonus
```

`crisis_bonus = 0..4`.

Target первого reset:

```text
14–18 AF
```

Пример:

```text
unique_evolution_nodes = 20 → +4
peak_population = 285        → +3
crisis_bonus = 3             → +3
base = 8
AF = 18
```

UI:

> **+18 Фрагментов Архива**

Награда не удваивается рекламой в baseline first reset.

---

# 20. Chronicle reward

После ending создаётся immutable historical record:

```text
Timeline 001
Ending: ENDING_ASH
Subtype: ash_fire / ash_too_late / ash_system
```

Также сохраняются:

- species/profile;
- milestones;
- major choices;
- anomaly flags;
- crisis summary;
- duration;
- peak population;
- discovered nodes;
- persistent narrative flags.

Устанавливаются как минимум:

```text
meta.endings.ash_seen = true
meta.archive.first_atomic_age = true
meta.archive.first_reset = true
```

---

# 21. Что сохраняется после reset

По умолчанию сохраняется:

- Archive Fragments;
- purchased Archive nodes;
- discovered evolution nodes/codex visibility;
- Chronicle;
- endings collection;
- achievements;
- persistent narrative/meta flags;
- settings;
- historical crisis record;
- persistent story-thread state.

Не сохраняется по умолчанию:

- run resources;
- Population;
- buildings;
- jobs allocation;
- current technologies/upgrades;
- current Stability;
- selected Timeline branch effects как активные bonuses.

Поздние Archive upgrades могут разрешить перенос отдельных traits; это не baseline первого reset.

---

# 22. Reset confirmation UI

Заголовок:

> **СОХРАНЕНИЕ ЗАВЕРШЕНО**

Обязательно показать две группы.

## Архив сохранит

- Фрагменты Архива;
- Chronicle Timeline 001;
- обнаруженные узлы/аномалии;
- achievements;
- persistent Archive progress.

## Новая Timeline начнёт заново

- ресурсы;
- Population;
- buildings;
- jobs;
- текущие технологии;
- Stability.

Primary CTA:

> **Открыть Архив**

Не использовать формулировку `Удалить мир`.

---

# 23. First Meta Tree reveal

После первого reset открываются Tier 1 Archive nodes из evolution tree.

| ID | Узел | Цена | Эффект |
|---|---|---:|---|
| AR01 | Эхо молекулы | 2 AF | старт E production ×1.25 |
| AR02 | Стабильная память | 2 AF | старт Information +10 |
| AR03 | Быстрый онтогенез | 3 AF | goals 1–5 требуют на 8% меньше ресурсов |
| AR04 | Спящий метаболизм | 3 AF | offline efficiency 50% → 60% |

Tier 2 показывается как partially locked/silhouette.

Tier 3 допускается показывать через `???`/corrupted nodes без полного spoil.

---

# 24. Первая meta-покупка

Игра не заставляет тратить AF немедленно.

Но UI может рекомендовать:

- AR01 как понятное ускорение старта;
- AR03 как заметное сокращение повторения первых шагов.

Нельзя автоматически покупать node за игрока.

---

# 25. Timeline #2 teaser

После Archive summary/meta tree:

> Сохранение завершено.

> Подготовить новую биосферу?

Новая системная строка:

> **Мы можем изменить результат.**

Primary CTA:

# СОЗДАТЬ НОВУЮ ЖИЗНЬ

Это завершение vertical slice и одновременно начало второго gameplay loop.

---

# 26. Что обещает Timeline #2

До CTA игроку достаточно показать три отличия:

1. **Быстрее** — Archive upgrades ускоряют уже знакомые стадии;
2. **Иначе** — доступен другой вид/эволюционный bias;
3. **Глубже** — часть сохранённых данных меняет доступные решения и скрытые ветви.

Не показывать весь поздний space/Bioseed content сразу.

---

# 27. Timing второго run

Product target:

```text
Timeline #2 early phase ≈ 40–60% времени Timeline #1
```

Это не означает ×2 ко всей экономике.

Ускорение должно приходить через:

- Archive nodes;
- автоматизацию знакомых шагов;
- preserved knowledge;
- сокращение некоторых early goals.

Точный Timeline #2 balance определяется DS-04/meta progression, не этим документом.

---

# 28. Невозможный артефакт Timeline #2

После первого reset narrative bible разрешает teaser:

> в первичном океане новой Timeline обнаруживается невозможный объект, связанный с Timeline #1.

Минимальные flags:

```text
meta.archive.first_reset = true
meta.anomaly.timeline2_artifact_enabled = true
```

Если в EV-NAR-01 игрок сохранил артефакт:

```text
meta.anomaly.artifact_preserved_any_timeline = true
```

DS-02 не раскрывает объяснение — это вход для DS-05 narrative package.

---

# 29. Безопасный reset transaction

Reset не должен быть последовательностью несвязанных local mutations.

Рекомендуемый transaction flow:

```text
1. lock run mutations
2. build immutable timeline summary
3. calculate AF reward
4. write Chronicle record
5. apply persistent meta flags/rewards
6. persist meta state
7. verify persistence
8. create new run state
9. persist new run state
10. unlock gameplay
```

## Save failure

Если шаг 6/7 не подтверждён:

- не удалять текущий run;
- показать retry;
- не выдавать AF повторно при повторной попытке.

Использовать idempotency key:

```text
reward_transaction_id = "timeline_001_ending_ash"
```

---

# 30. Timeline summary model

```json
{
  "timeline_id": 1,
  "ending": {
    "id": "ENDING_ASH",
    "subtype": "ash_too_late"
  },
  "duration_sec": 7080,
  "peak_population": 276,
  "species": {
    "metabolism": "chemosynthesis",
    "body": "sensitivity",
    "behavior": "social"
  },
  "civilization": {
    "tradition": "knowledge_ritual",
    "settlement": "exchange",
    "governance": "council",
    "city_specialization": "science",
    "energy_path": "clean",
    "preatomic": "institutes"
  },
  "crisis": {
    "min_stability": 17,
    "last_protocol": "disarm",
    "bonus": 3,
    "tags": ["foresight", "grid_resilience"]
  },
  "rewards": {
    "archive_fragments": 17
  },
  "anomalies": ["first_trace_seen", "error17_seen", "archive_said_again"]
}
```

---

# 31. Runtime state split

## Run state

```text
run.timeline_id
run.resources
run.population
run.buildings
run.jobs
run.tech
run.flags
run.path_scores
run.stability
run.crisis_clock
run.atomic_load
run.unresolved_crises
```

## Meta state

```text
meta.archive_fragments
meta.archive_nodes
meta.discovered_nodes
meta.chronicle
meta.achievements
meta.narrative_flags
meta.endings
meta.settings
```

Reset переводит данные через explicit summary/reward mapper, а не копирует run state целиком.

---

# 32. Analytics

Минимальные события:

```text
atomic_age_started
world_tension_threshold
crisis_event_shown
crisis_choice_selected
crisis_node_bought
last_protocol_shown
last_protocol_selected
ash_triggered
ending_cinematic_completed
archive_summary_opened
archive_reward_calculated
reset_confirmed
reset_saved
meta_tree_opened
archive_node_bought
second_run_start
```

Критичные параметры:

```text
timeline
elapsed_sec
stability
world_tension
atomic_load
unresolved_crises
last_protocol
ending_subtype
crisis_bonus
archive_fragments
peak_population
path_profile
```

---

# 33. KPI / validation

Проверять:

- median Atomic Age: 103–112 мин;
- median Ash: 112–119 мин;
- median reset: 116–124 мин;
- долю игроков, увидевших Last Protocol;
- долю игроков, понявших что сохраняется после reset;
- reset acceptance rate;
- second_run_start rate;
- распределение final protocol;
- средний first-reset AF;
- save/reset error rate.

---

# 34. Failure handling

## Resource collapse в кризисе

Не game over.

- production замедляется;
- появляется recovery hint;
- shortage может добавить crisis pressure;
- run всё равно приходит к narrative ending.

## Игрок не нажимает crisis choices

После разумного таймаута simulation может быть поставлена на controlled pause, но система не должна тайно принимать Last Protocol за игрока.

## Save failure

Старый run остаётся доступен до подтверждения meta save.

---

# 35. Audio sequence requirement

Минимальная логика:

1. Atomic milestone stinger;
2. обычная музыка продолжается с напряжённым layer;
3. warning ambience;
4. alarm layer в critical phase;
5. при flash — резкое прерывание;
6. 1–2 сек почти полной тишины;
7. Ash ambience;
8. Archive summary — спокойный low-intensity layer.

Точные cues определяются audio package.

---

# 36. Visual requirements

Crisis должен использовать ту же диораму, а не отдельную мини-игру.

Изменения:

- lights/alarms;
- транспорт/авиация;
- pollution/weather intensity;
- military/emergency silhouettes;
- reactor/grid landmarks;
- progressive desaturation/contrast shift при росте Tension.

Ash:

- разрушенный skyline;
- отсутствие обычных ambient citizens/vehicles;
- ash/snow particles;
- редкие пожары;
- холодное/приглушённое освещение.

---

# 37. Copy constraints

Ending UI:

- title — до 3 слов;
- subtype — одна короткая строка;
- основная цитата — 1–2 предложения;
- statistics labels — короткие;
- полный lore — только Chronicle.

Не объяснять тайну Архива на ending screen.

---

# 38. Implementation order

1. Ввести Stability state.
2. Вывести World Tension как derived UI value.
3. Реализовать crisis clock + offline freeze.
4. Подключить X crisis nodes.
5. Реализовать crisis phase state machine.
6. Подключить EV-CR-01/02.
7. Реализовать Last Protocol gate.
8. Реализовать `ENDING_ASH` + subtype.
9. Создать Timeline Summary builder.
10. Реализовать AF calculator.
11. Создать Chronicle record.
12. Реализовать idempotent reset transaction.
13. Открыть Archive Tree Tier 1.
14. Создать Timeline #2 blank/start state.
15. Добавить analytics + automated tests.

---

# 39. Тестовые кейсы

## TC01 — Normal first run

- A06 около 108 мин;
- EV-CR-01/02 показываются;
- Last Protocol показывается;
- Ash около 116 мин;
- AF около 14–18;
- reset около 120 мин.

## TC02 — Stability падает слишком быстро

- Stability достигает ≤15 раньше 435 сек;
- `ash_pending = true`;
- cinematic не стартует раньше clamp;
- Last Protocol всё равно показывается.

## TC03 — Игрок держит Stability высокой

- до 480 сек Ash не отменяется;
- Last Protocol показывается;
- повышенный crisis bonus возможен.

## TC04 — Offline во время кризиса

- clock/drain заморожены;
- при возврате нет мгновенного Ash;
- кризис продолжается после summary.

## TC05 — Save failure

- meta state не подтверждён;
- старый run не удалён;
- повторная попытка не дублирует AF.

## TC06 — Все Last Protocol variants

Каждый:

- даёт `ENDING_ASH`;
- имеет свой subtype;
- записывает flag;
- создаёт корректный Chronicle record.

## TC07 — Second run start

После reset:

- meta state сохранён;
- run resources/buildings сброшены;
- AF доступны;
- Timeline ID увеличен;
- teaser flags доступны;
- early progression может быть ускорена Archive nodes.

---

# 40. Acceptance criteria

- первый ending нельзя случайно пропустить;
- игрок видит минимум два crisis decision + Last Protocol;
- плохой resource management не создаёт ранний hard fail;
- World Tension и Stability синхронны как одна шкала;
- Ash неизбежен в Timeline #1, но решения влияют на subtype/summary/reward;
- first-reset reward использует AF, а не две конкурирующие валюты;
- reset однозначно показывает, что сохраняется и что сбрасывается;
- Chronicle создаётся до удаления run state;
- reset transaction идемпотентен;
- реклама не стоит между игроком и ending/reward;
- Timeline #2 CTA ясно показывает, зачем повторять цикл;
- implementation не требует придумывать ending/reset механику в коде.

---

# 41. Открытые вопросы после DS-02

Не блокируют первый ending contract, но требуют следующих документов:

1. финальное user-facing название AF и локализация — DS-04;
2. точная meta economy после Tier 1 — DS-04;
3. точный Timeline #2 pacing — DS-04;
4. полный literary copy всех событий — DS-05;
5. exact UX ending/archive screens — DS-06;
6. visual variants Ash — DS-07/08;
7. audio cues — DS-09;
8. ad frequency/frequency caps после ending — DS-10.

---

# 42. Связанные документы

- `07_GOALS_AND_MILESTONES.md` — G023/G024 и milestones;
- `08_EVENTS_AND_CHOICES.md` — crisis events, Last Protocol, flags;
- `02_ECONOMY_FIRST_120_MINUTES.md` — Stability formula, AF formula, timing;
- `03_EVOLUTION_TREE.md` — X-nodes и Archive Tree;
- `../scenario/00_NARRATIVE_BIBLE.md` — mystery/ending narrative framework.
