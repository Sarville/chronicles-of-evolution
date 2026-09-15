# Хроники Эволюции — Balance rules

**Документ:** DS-04 / 11_BALANCE_RULES  
**Версия:** 1.0  
**Статус:** accepted

## Назначение

`02_ECONOMY_FIRST_120_MINUTES.md` остаётся числовым source of truth Timeline #1. Этот документ задаёт invariants, meta ceilings, telemetry/tuning order и regression gates. Meta semantics — `10_META_PROGRESSION.md`.

## Baseline invariants

Timeline #1 полностью проходим без Archive nodes, Archive Intervention, ads и offline progress. Canonical milestones остаются: 02:00 Self Replication, 10:00 Proto-cell, 26:00 Multicellularity, 46:00 Sapience, 56:00 Tribe, 62:00 Agriculture, 80:00 City, 94:00 Industry, 108:00 Atomic, ~116:00 Ash, ~120:00 Reset.

Полный run target: ~120 мин, рабочее окно 110–130. Ash Timeline #1 неизбежен. После 3-й минуты manual contribution <=5% optimal income. Meaningful unlock/decision: T1 каждые 2–6 мин; знакомый T2 может 1–4 мин.

## Timeline #2

```text
Sapience p50 = 20–28 min
no-spend p50 = 24–28 min
Tier1 typical p50 = 20–25 min
minimum readability = 18 min
```

>30 мин означает слабое meta acceleration; <18 мин — чрезмерное сжатие.

## Meta ceilings

```text
pre-Sapience production <= 1.60
Tribe/Settlement <= 1.35
City <= 1.25
Industry/Atomic <= 1.15
familiar CORE effective cost >= 70%
offline efficiency <= 75%
Archive Intervention <= ×1.50, <=180 sec, <=3 charges
```

Meta layer cap применяется отдельно от ordinary run upgrades.

## Tuning order

Generator curve остаётся:

```text
cost(n) = round_3sig(base_cost × growth^(n-1))
```

Если phase медленный, менять в порядке:

```text
0 bug/prerequisite/save issue
1 resource bottleneck
2 base producer/job output
3 specific breakthrough cost
4 one-time grant
5 local branch modifier
6 milestone multiplier
7 growth factor
8 meta values
9 global formula
```

Growth меняется последним, потому что меняет форму всей кривой.

Recommended single-pass sizes:

```text
base_output ±5–10%
breakthrough ±5–10%
job/building output ±5–10%
one-time grant ±10–20%
branch effect ±5–10%
growth <= ±0.01
```

## Telemetry targets

Для каждого milestone: `p25`, `p50`, `p75`, `abandonment_before`, `resource_bottleneck_time`.

Timeline #1:

```text
p50 milestone error <= ±10%
p50 reset ≈120 min
p75 <= p50 ×1.20
```

Timeline #2 обязательно сегментировать: no AF spend, Tier1, AR05+, AR06+, AR09+; главная метрика — `time_to_sapience`.

AF telemetry: earned/spent/balance, first purchased node, time-to-first-purchase, nodes owned. First reset typical 14–18 AF. AF/ad multiplier всегда 1.0.

## Branch / hybrid balance

Branch choices должны сохранять completion viability: median timing difference обычно <=15%, intentional risk/speed path <=20%.

AR06 сам не stackает numerical effect второго branch. AR09 secondary=65%. Hybrid build по raw speed не должен быть более чем примерно на 10–15% быстрее лучшего single-branch build на знакомом segment; главная ценность hybrid — breadth/content access.

AR05 retained OPTIONAL активируется только при исходных prerequisites. Если retained node сокращает фазу >~10%, нужен coefficient/exclusion review.

## Offline / crisis

Timeline #1 offline: 50%, cap 2h, Population growth <=+35%, crisis frozen. AR04=60%, future hard cap=75%. Offline не auto-complete breakthrough/choice/ending/reset/AF.

Crisis clamps неизменны:

```text
minimum Ash after Atomic = 435 sec
hard maximum = 480 sec
```

Meta/Intervention не меняют crisis clock, Stability напрямую, atomic_load или AF reward. AR08 только раскрывает информацию.

## No hidden rubber-banding

Запрещено скрыто менять production/cost из-за медленного игрока, отсутствия ads, малого AF или branch choice. Допустимы только видимые systems: Archive Recall, Archive nodes, hints, explicit Intervention и будущие явно обозначенные accessibility settings.

Stall handling может показать hint/bottleneck/prerequisite/Intervention entry, но не тайно снижать цену или добавлять ресурсы.

## Config / versioning

Все balance values живут в serializable config, не в UI. Каждый run и telemetry хранят `rulesetVersion`.

- content-only patch: ruleset unchanged;
- tuning patch: version bump;
- structural formula/meta change: bump + migration review.

Patch не отзывает purchased nodes, completed goals/rewards и не делает resources отрицательными.

## Headless gates

Перед merge проверять:

```text
T1 baseline + low-interaction
T1 major biological/civilization branches
T1 crisis clamps
T2 no-spend Recall
T2 Tier1 spend
T2 AR05 / AR06 / AR09
offline claim cases
```

Assertions: no negative resources/deadlocks/impossible prerequisites; Ash clamps intact; first AF reward ожидаемый; T2 Sapience в target window; meta caps не превышены.

## Rule

Плохой Timeline #1 нельзя «лечить» meta-бонусом. Baseline economy исправляется в Timeline #1; meta ускоряет повторение. Archive Intervention выключена — все canonical targets остаются достижимы. SDK/rewarded flow не реализуется до DS-10.
