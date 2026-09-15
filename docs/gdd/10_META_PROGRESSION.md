# Хроники Эволюции — Meta progression

**Документ:** DS-04 / 10_META_PROGRESSION  
**Версия:** 1.0  
**Статус:** accepted

## Назначение

Память Архива — permanent/meta-система. Archive Fragments (`AF`) — единственная spendable meta currency первого prestige-loop. Meta progression ускоряет знакомый контент, но не заменяет baseline economy, не требует рекламы и не отменяет `ENDING_ASH` Timeline #1.

## Первый reset

```text
AF = 8 + floor(unique_evolution_nodes / 5)
       + floor(peak_population / 75)
       + crisis_bonus
crisis_bonus = 0..4
```

Target: **14–18 AF**. Reward idempotent; reload/retry не выдаёт AF повторно; ads/meta не умножают AF.

Tier 1: AR01=2, AR02=2, AR03=3, AR04=3 AF. Первая покупка не обязательна.

## Archive Recall

После первого reset автоматически:

```text
meta.archive.first_reset == true => Archive Recall enabled
```

Только для уже знакомых pre-Sapience `CORE` nodes:

```text
familiar CORE cost ×0.75
familiar pre-Sapience production ×1.25
```

Recall не auto-complete узлы, не действует на новые branches/unknown OPTIONAL, post-Sapience civilization, crisis, AF или Stability и прекращается после `N06 Разум`.

Timeline #2 target:

```text
Sapience p50 = 20–28 min
no AF spend = 24–28 min
typical Tier 1 spend = 20–25 min
```

`<18 min` — слишком быстро; `>30 min` — недостаточное ускорение.

## Meta caps

```text
pre-Sapience meta production <= 1.60
Tribe/Settlement <= 1.35
City <= 1.25
Industry/Atomic <= 1.15
familiar CORE effective cost >= 70% canonical
offline efficiency <= 75%
```

## Archive Tree semantics

`AR05` — один previously discovered OPTIONAL biological node. Он стартует `dormant_retained`, активируется бесплатно только после исходных prerequisites и не может быть CORE/BRANCH/CONVERGENCE/civilization/crisis/archive node.

`AR06` — второй cellular branch покупается по base cost вместо ×2.5. До AR09 его numerical effect не stackается с primary; он даёт discovery/content/hybrid breadth.

`AR09` — один secondary biological trait slot (`metabolism|body|behavior`): primary 100%, secondary 65% numerical effect. Не даёт dual civilization specialization и не увеличивает AF.

Meta loadout выбирается между timelines и фиксируется при старте нового run.

## Anti-snowball

- нет AF earnings multiplier;
- нет blanket global ×N на всю Timeline;
- strong bonuses привязаны к знакомым phases;
- new/unknown branches идут по normal balance;
- Tier 3 требует минимум 2 resets;
- AR12 требует special condition;
- ads не дают permanent economy multiplier.

## Offline

Timeline #1:

```text
offline_gain = online_rate_at_exit × min(offline_time, 2h) × 0.50
```

Crisis/Stability frozen; breakthrough не auto-complete; Population growth <= +35%. Timeline #2+ базово 50%, AR04=60%, hard cap=75%. Offline не выбирает branch/event, не запускает ending/reset, не выдаёт AF.

## Archive Intervention

Balance envelope; SDK/rewarded flow — DS-10.

Разрешён target: energy/information/biomass/food/materials/knowledge/power. Запрещены AF, Population, Stability, World Tension, crisis timer.

```text
multiplier = 1.50
base duration = 120 sec
one active intervention
no stacking
future duration <= 180 sec
future stored charges <= 3
```

Multiplier выше ×1.50 meta-upgrades не дают. Intervention не входит в baseline pacing и не влияет на AF/crisis/Ash.

## State / implementation

DS-03 `meta` расширяется `archiveRecall`, `loadout`, future `intervention`. Derived modifiers вычисляются из `meta + run era + config`.

Commands:

```text
purchase_archive_node(nodeId)
set_meta_loadout(loadout)
start_new_timeline()
activate_archive_intervention(resourceId)
```

Acceptance: first reward 14–18 AF typical/idempotent; T2 можно начать с 0 AF spent; Recall только familiar pre-Sapience CORE; AR05 dormant до prerequisites; AR06 без dual stacking; AR09 secondary=65%; AR04=60% offline; Intervention ×1.50/<=180s/<=3 charges/no stacking.
