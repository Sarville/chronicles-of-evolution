# Хроники Эволюции — Balance rules

**Документ:** DS-04 / 11_BALANCE_RULES  
**Версия:** 1.0  
**Область:** Timeline #1 baseline, Timeline #2 acceleration, meta caps, telemetry-driven tuning  
**Статус:** accepted

---

# 1. Назначение

Этот документ не заменяет `02_ECONOMY_FIRST_120_MINUTES.md`.

Он задаёт:

- balance invariants;
- допустимые границы meta power;
- правила telemetry tuning;
- порядок изменения параметров;
- правила versioning;
- критерии, по которым balance patch считается безопасным.

Числовым source of truth для Timeline #1 остаётся:

```text
docs/gdd/02_ECONOMY_FIRST_120_MINUTES.md
```

Meta semantics задаются:

```text
docs/gdd/10_META_PROGRESSION.md
```

---

# 2. Главные invariants

## INV-01 — Первый run самодостаточен

Timeline #1 должен быть полностью проходим:

- без Archive nodes;
- без Archive Intervention;
- без rewarded ads;
- без offline progress;
- без платного ускорения.

## INV-02 — Первый полный цикл ≈120 минут

Canonical milestones:

| Milestone | Target |
|---|---:|
| Self Replication | 02:00 |
| Proto-cell | 10:00 |
| Multicellularity | 26:00 |
| Sapience | 46:00 |
| Tribe | 56:00 |
| Agriculture | 62:00 |
| City | 80:00 |
| Industry | 94:00 |
| Atomic Age | 108:00 |
| Ash | ~116:00 |
| Reset | ~120:00 |

Обычный разброс:

```text
±10 min full run
```

## INV-03 — Ash Timeline #1 неизбежен

Ни:

- branch;
- perfect economy;
- Archive node;
- intervention;
- offline gain

не отменяют `ENDING_ASH` первого Timeline.

## INV-04 — Manual input не становится оптимальной стратегией

После 3-й минуты:

```text
manual contribution <= 5% optimal income
```

## INV-05 — Meaningful cadence

Timeline #1 должен давать meaningful unlock/decision примерно каждые:

```text
2–6 min
```

Timeline #2 знакомые части могут быть плотнее:

```text
1–4 min
```

Новый контент не должен сжиматься только потому, что старый знаком.

## INV-06 — Ads outside baseline

Любой rewarded effect считается bonus layer.

При отключении rewarded flow canonical progression остаётся валидной.

---

# 3. Timeline #2 target

Первый знакомый блок заканчивается на `N06 Sapience`.

Timeline #1:

```text
Sapience ≈ 46 min
```

Timeline #2 target:

```text
p50 = 20–28 min
```

## No-spend target

Игрок с first reset, но без AF purchases:

```text
p50 <= 28 min
```

## Typical first-spend target

Игрок с 2–4 Tier 1 Archive nodes:

```text
p50 = 20–25 min
```

## Guardrail

Если T2 Sapience:

```text
> 30 min
```

то meta acceleration считается недостаточной.

Если:

```text
< 18 min
```

то ранняя игра считается чрезмерно compressed и теряет gameplay readability.

---

# 4. Phase-specific meta ceilings

Meta-only multipliers ограничиваются независимо от ordinary run effects.

| Phase | Max meta production multiplier |
|---|---:|
| Molecular → Sapience | 1.60 |
| Tribe / Settlement | 1.35 |
| City | 1.25 |
| Industry / Atomic | 1.15 |

Cost reduction floor familiar CORE:

```text
>= 70% canonical cost
```

Offline efficiency hard cap:

```text
<= 75%
```

Archive Intervention:

```text
resource multiplier <= 1.50
duration <= 180 sec
stored charges <= 3
```

---

# 5. Stack model

Каждый modifier должен иметь group.

Recommended groups:

```text
run_local
run_branch
run_event
meta_early_production
meta_cost
meta_start
meta_offline
temporary_intervention
```

## Same-group rule

Внутри одной meta group:

- additive deltas сначала суммируются;
- затем применяется group cap;
- group result применяется один раз.

Не разрешать цепочки из нескольких hidden multipliers одной и той же permanent системы.

## Cross-group rule

Обычные run progression bonuses могут перемножаться с meta group.

Именно поэтому caps ставятся на meta layer отдельно.

---

# 6. Cost rules

Canonical generator curve:

```text
cost(n) = round_3sig(base_cost × growth^(n-1))
```

Growth factors остаются shape-control параметрами.

## Tuning priority

Если одна фаза медленная, сначала менять:

1. `base_output`;
2. конкретный breakthrough cost;
3. job output / building output;
4. one-time grant;
5. local branch modifier.

И только последним:

6. growth factor.

Причина: growth меняет всю последующую кривую, а не один bottleneck.

---

# 7. Allowed patch size

Для обычного telemetry pass рекомендуется:

```text
base_output: ±5–10%
breakthrough cost: ±5–10%
job/building output: ±5–10%
one-time grant: ±10–20%
branch local effect: ±5–10%
growth factor: не более ±0.01 за один pass
```

Большие изменения требуют отдельной regression simulation.

Это recommendation, не runtime clamp.

---

# 8. Bottleneck diagnostics

## Если весь phase поздний

Признаки:

- большинство goals фазы опаздывает сходно;
- один ресурс consistently low;
- покупки распределены нормально.

Действие:

```text
adjust producer/job base_output
```

## Если один breakthrough поздний

Признаки:

- предыдущий goal вовремя;
- следующий резко опаздывает;
- после покупки pace нормализуется.

Действие:

```text
adjust breakthrough cost/prerequisite
```

## Если late game резко расходится

Признаки:

- early phase нормален;
- p75 всё сильнее отстаёт;
- generator counts между игроками сильно отличаются.

Проверить:

```text
growth
milestone thresholds
job allocation
resource cross-dependency
```

Growth менять только после проверки остальных причин.

## Если meta слишком сильна

Не замедлять Timeline #1.

Сначала менять:

```text
Archive node effect
meta group cap
retained/hybrid efficiency
```

---

# 9. Telemetry targets — Timeline #1

Для каждой canonical milestone хранить:

```text
p25
p50
p75
abandonment_before
resource_bottleneck_time
```

## Core targets

```text
p50 milestone error <= ±10% target time
```

Для полного run:

```text
p50 reset ≈ 120 min
```

Допустимый рабочий window:

```text
110–130 min
```

Spread target:

```text
p75 <= p50 × 1.20
```

Это directional target; маленькая выборка не требует искусственно подгонять distribution.

---

# 10. Telemetry targets — Timeline #2

Главная DS-04 метрика:

```text
time_to_sapience
```

Segment обязательно разделять:

```text
no AF spend
Tier1 spend
AR05+
AR06+
AR09+
```

## Targets

No-spend:

```text
p50 24–28 min
```

Typical Tier1:

```text
p50 20–25 min
```

Minimum readability:

```text
p50 >= 18 min
```

Нельзя балансировать только по среднему — нужны p25/p50/p75.

---

# 11. AF telemetry

Логировать:

```text
AF earned
AF spent
AF balance before reset
first purchased node
time from reset to first purchase
nodes owned per timeline
```

## Guardrails

После первого reset:

```text
typical AF earned = 14–18
```

Ни один node:

```text
AF earnings multiplier > 1.0
```

Ads:

```text
AF reward multiplier = 1.0
```

---

# 12. Branch balance

Branch не обязан давать идентичный production profile.

Он обязан сохранять сравнимый completion viability.

## Target

Для одного и того же milestone при разных canonical branch choices:

```text
median timing difference <= 15%
```

Если branch intentionally high-risk/high-speed, допускается до:

```text
20%
```

но это должно быть явным design trait.

## Forbidden

Нельзя иметь branch, который:

- системно блокирует CORE progression;
- требует рекламы;
- делает reset заметно хуже без очевидной компенсации;
- скрыто уменьшает AF reward, если это не объяснено.

---

# 13. Hybrid balance

AR06/AR09 добавляют breadth, а не бесконечное multiplicative stacking.

## AR06

До AR09:

```text
second purchased branch numeric effect is not simultaneously stacked
```

## AR09

Secondary trait efficiency:

```text
65%
```

Если combined result упирается в meta cap, применяется cap.

## Balance test

Hybrid loadout должен быть:

- интереснее;
- гибче;
- не более чем примерно 10–15% быстрее лучшего single-branch build на знакомом segment, если сравнивать только экономический time-to-goal.

Большая выгода должна приходить через новые варианты/content access, а не raw speed.

---

# 14. Retained trait balance

AR05:

```text
1 OPTIONAL biological node
cost in run = 0
activation at original prerequisites
```

Retained OPTIONAL не должен:

- завершать CORE goal;
- пропускать era;
- давать effect раньше prerequisite;
- быть converted в AF;
- занимать обычную покупку дважды.

## Power check

Если конкретный OPTIONAL node сокращает одну фазу более чем на:

```text
~10%
```

при бесплатном retention, его retained version требует отдельного coefficient или exclusion.

---

# 15. Offline balance

Timeline #1:

```text
efficiency = 50%
cap = 2h
population growth <= +35%
crisis frozen
```

Timeline #2+:

```text
50%
AR04 => 60%
future hard cap => 75%
```

## Offline claim guardrails

Offline claim не должен:

- auto-complete branch choice;
- auto-complete breakthrough;
- auto-trigger ending;
- grant AF;
- resolve crisis/event;
- consume intervention charge.

Если накопленных ресурсов хватает на milestone, игрок возвращается и совершает решение online.

---

# 16. Crisis invariants

Timeline #1 crisis timing:

```text
minimum Ash time after Atomic = 435 sec
hard maximum = 480 sec
```

Meta progression не меняет эти clamps.

Archive Intervention не меняет:

```text
crisis_clock
Stability directly
atomic_load directly
AF reward directly
```

AR08 может только раскрывать information.

AR12 не применяется к Timeline #1 ending retroactively.

---

# 17. No hidden rubber-banding

Запрещено скрыто менять production/cost на основе того, что игрок:

- идёт медленнее target;
- не смотрит ads;
- давно не платил;
- имеет мало AF;
- выбрал «невыгодную» ветку.

Допустимые catch-up systems должны быть видимыми:

- Archive Recall;
- purchased Archive nodes;
- hints;
- explicit temporary Intervention;
- known difficulty/accessibility settings в будущем.

---

# 18. Stall handling

Если goal долго не прогрессирует, Goal Engine может:

- показать hint;
- подсветить bottleneck resource;
- показать недостающий prerequisite;
- предложить разрешённую Intervention UI entry.

Но не должен тайно:

- снижать цену;
- добавлять ресурсы;
- менять RNG;
- завершать goal.

---

# 19. Balance config ownership

Все числовые параметры должны жить в serializable config.

Минимум:

```text
resource base outputs
generator base costs
growth
milestones
breakthrough costs
job outputs
building effects
branch effects
crisis values
Archive node effects
meta caps
offline coefficients
Intervention envelope
```

UI не содержит копии balance values как authority.

---

# 20. Ruleset versioning

Каждый run хранит:

```text
run.rulesetVersion
```

Telemetry также обязана писать `ruleset_version`.

## Patch types

### Content-only

Текст/art/UX без economy effect.

```text
rulesetVersion unchanged
```

### Tuning patch

Изменяет production/cost/effects.

```text
rulesetVersion bump
```

### Structural patch

Меняет formulas, entity graph, reset/meta semantics.

```text
rulesetVersion bump + migration review
```

## Active run rule

Balance patch не должен:

- отзывать уже купленный node;
- делать resource отрицательным;
- удалять completed goal;
- повторно выдавать reward.

Если новая config применяется к существующему run, migration обязана быть deterministic и тестируемой.

---

# 21. Balance experiment discipline

Один telemetry pass не должен одновременно менять много независимых families.

Recommended:

```text
one hypothesis
-> one parameter family
-> simulation
-> release cohort
-> telemetry compare
```

Пример:

```text
Problem:
G009 p50 = 31:20 вместо 26:00

Check:
Bottleneck Biomass throughout cellular era

Change:
Assimilator base output +8%

Do not also:
change C09 cost
change growth
change Archive Recall
```

---

# 22. Headless simulation gates

Перед merge balance patch должен проходить deterministic simulation scenarios.

Минимальный набор:

```text
T1 baseline median strategy
T1 low-interaction strategy
T1 each major biological branch
T1 each civilization branch family
T1 crisis minimum/maximum timing
T2 no-spend Archive Recall
T2 common Tier1 spend
T2 AR05 retained trait
T2 AR06 second branch
T2 AR09 hybrid
offline claim cases
```

## Assertions

- no negative resources;
- no impossible prerequisite;
- no deadlock;
- Ash timing clamps intact;
- AF first reward in expected band for canonical scenarios;
- T2 Sapience within target window;
- meta caps not exceeded.

---

# 23. Balance change order

Если telemetry показывает pacing problem, порядок действий:

```text
0. проверить bug / wrong prerequisite / save issue
1. проверить resource bottleneck
2. base producer/job output
3. конкретный breakthrough price
4. one-time starting grant
5. local branch modifier
6. milestone multiplier
7. growth factor
8. meta values
9. global formula
```

Global formula меняется только если локальные параметры не решают проблему.

---

# 24. Что нельзя исправлять meta-бонусом

Если Timeline #1:

- слишком медленная;
- имеет deadlock;
- требует manual spam;
- имеет плохой bottleneck;
- ломается на одной branch,

нельзя «лечить» это Archive upgrades.

Первый run должен быть исправлен в baseline economy.

Meta layer ускоряет повторение, а не компенсирует плохой первый баланс.

---

# 25. Archive Intervention balance tests

Intervention выключена:

```text
all canonical targets remain reachable
```

Intervention включена:

- может заметно сократить локальный wait;
- не должна пропустить целую era;
- не должна менять ending;
- не должна быть обязательной для p50.

Для одной activation ожидаемый выигрыш на полном Timeline должен быть локальным, а не превращаться в постоянный time multiplier.

---

# 26. Review gates DS-04

`11_BALANCE_RULES.md` считается принятым, если:

- Timeline #1 source of truth не изменён;
- Timeline #2 имеет числовой early target;
- meta bonuses имеют caps;
- retained/hybrid semantics тестируемы;
- offline rules определены;
- Archive Intervention имеет balance envelope;
- tuning order определён;
- telemetry segmentation определён;
- headless simulation scenarios определены;
- нет механики, которая делает ads или AF обязательными для первого run.

---

# 27. Handoff в implementation

Codex может безопасно реализовать после approval:

```text
Archive node registry AR01–AR12
Archive Recall config
meta modifier groups/caps
meta loadout schema
retained OPTIONAL activation
AR06 branch purchase rule
AR09 secondary trait coefficient
offline coefficients
Archive Intervention balance constants as disabled/feature-gated hooks
telemetry payload fields
headless balance assertions
```

Не реализовывать до DS-10:

```text
Yandex/VK rewarded SDK flow
ad availability
rewarded refill UI
platform cooldown persistence details
```
