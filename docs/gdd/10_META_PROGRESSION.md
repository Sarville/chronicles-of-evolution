# Хроники Эволюции — Meta progression

**Документ:** DS-04 / 10_META_PROGRESSION  
**Версия:** 1.0  
**Область:** первый reset, Память Архива, Archive Fragments, ускорение Timeline #2 и правила гибридизации  
**Статус:** accepted

---

# 1. Назначение

Этот документ задаёт мета-прогрессию после первого завершения Timeline #1.

Главная продуктовая задача meta loop:

> Следующая Timeline должна ощущаться не как повтор тех же двух часов, а как знакомый мир, который игрок проходит быстрее, глубже и с новыми возможностями выбора.

Meta progression не должна:

- заменять обычный gameplay постоянными множителями;
- превращать первый run в «неполноценную версию»;
- требовать рекламы;
- давать бесконечно растущие глобальные multipliers;
- позволять купить Archive Fragments за Archive Fragments;
- автоматически отменять Великий фильтр или ending `ENDING_ASH` в Timeline #1.

---

# 2. Термины

## 2.1. Память Архива

**Память Архива** — вся permanent/meta-система проекта.

Она включает:

- Archive Fragments;
- Archive Tree;
- persistent discovery;
- Chronicle;
- endings collection;
- achievements;
- persistent narrative flags;
- retained traits;
- hybridization permissions;
- future Archive Intervention upgrades.

## 2.2. Archive Fragments

**Фрагменты Архива (`AF`)** — единственная spendable meta currency первого prestige-loop.

До отдельного решения запрещено вводить вторую параллельную spendable meta currency.

## 2.3. Archive node

Permanent unlock, купленный за AF.

Archive node:

- сохраняется между timelines;
- не сбрасывается обычным reset;
- имеет stable ID `ARxx`;
- не может напрямую увеличивать будущий AF reward.

---

# 3. Первый reset reward

Каноническая формула DS-02 сохраняется без изменений:

```text
AF = 8
   + floor(unique_evolution_nodes / 5)
   + floor(peak_population / 75)
   + crisis_bonus
```

где:

```text
crisis_bonus = 0..4
```

Целевой результат первого reset:

```text
14–18 AF
```

Это reward за завершение Timeline #1, а не за просмотр рекламы.

## Hard rules

- AF начисляется до уничтожения run state.
- Reward transaction idempotent.
- Повторная загрузка ending не может выдать AF повторно.
- Rewarded ad не умножает mandatory first-reset AF.
- Meta upgrades не увеличивают AF multiplier.
- AF не теряется при обычном reset.

---

# 4. First-reset spending experience

После первого reset игрок:

1. получает Archive Summary;
2. видит `+14..18 AF`;
3. открывает Archive Tree;
4. может купить узлы;
5. может ничего не покупать;
6. создаёт Timeline #2.

Игра не заставляет делать первую покупку.

## Первый бюджет

Tier 1 целиком стоит:

```text
AR01 2
AR02 2
AR03 3
AR04 3
---------
total 10 AF
```

Поэтому первый reset позволяет:

- купить несколько понятных ранних upgrades;
- купить весь Tier 1 и сохранить часть AF;
- либо накопить на более дорогой Tier 2.

Это намеренно создаёт первый meta-choice.

---

# 5. Archive Tree — канонические узлы

Идентичность и базовые цены `AR01–AR12` берутся из `03_EVOLUTION_TREE.md`.

DS-04 уточняет activation/stacking semantics.

## Tier 1

| ID | Узел | Цена | Канонический эффект | DS-04 semantics |
|---|---|---:|---|---|
| AR01 | Эхо молекулы | 2 AF | старт E production ×1.25 | входит в `meta_early_production` group |
| AR02 | Стабильная память | 2 AF | старт Information +10 | one-time grant в начале Timeline |
| AR03 | Быстрый онтогенез | 3 AF | goals 1–5 требуют на 8% меньше ресурсов | применяется к breakthrough costs, не к generators |
| AR04 | Спящий метаболизм | 3 AF | offline efficiency 50% → 60% | не меняет offline cap и event rules |

## Tier 2

| ID | Узел | Цена | Канонический эффект | DS-04 semantics |
|---|---|---:|---|---|
| AR05 | Сохранённая адаптация | 5 AF | сохранить 1 OPTIONAL biological node бесплатно | один retained slot |
| AR06 | Перекрёстная эволюция | 6 AF | второй cellular branch без ×2.5 penalty | второй branch покупается по base cost; не даёт dual-active multiplier сам по себе |
| AR07 | Наследие культуры | 5 AF | цивилизация: +20 K и +10% pop | one-time civilization transition grant |
| AR08 | Память катастрофы | 7 AF | скрытые параметры crisis видимы в Timeline #2 | informational power, не Stability bonus |

## Tier 3

| ID | Узел | Цена | Канонический эффект | DS-04 semantics |
|---|---|---:|---|---|
| AR09 | Двойная специализация | 10 AF | 2 branch traits одного biological tier | primary 100%, secondary 65% numerical effect |
| AR10 | Ускоренная история | 9 AF | ранние narrative locks −50% | не пропускает обязательные choices |
| AR11 | Глубокий архив | 12 AF | альтернативные записи Великого фильтра | content unlock, не economy multiplier |
| AR12 | За пределом Пепла | 12 AF | путь к post-atomic / space progression | требует special condition; не отменяет Timeline #1 Ash |

---

# 6. Automatic Archive Recall

После первого reset каждый новый run получает базовый permanent эффект:

```text
meta.archive.first_reset == true
=> Archive Recall enabled
```

Это не покупаемый node и не тратит AF.

Причина: игрок может сознательно копить AF, но Timeline #2 всё равно должен ощущаться как следующий цикл, а не повтор первого onboarding.

## 6.1. Область действия

Archive Recall действует только:

- на уже завершённые ранее `CORE` nodes;
- только до `N06 Разум`;
- только если node присутствует в persistent discovery/Chronicle;
- только на знакомую часть progression.

Не действует на:

- новые branch nodes;
- OPTIONAL nodes, которые игрок раньше не открывал;
- civilization after Sapience;
- crisis;
- AF reward;
- Stability;
- future route-specific content.

## 6.2. Known-core cost factor

Для familiar CORE breakthrough до Sapience:

```text
archive_recall_cost_factor = 0.75
```

То есть familiar CORE cost уменьшается на 25%.

## 6.3. Known-era production factor

Пока игрок находится в знакомой pre-Sapience era:

```text
archive_recall_production_factor = 1.25
```

Этот multiplier входит в meta multiplier group и исчезает после `N06`.

## 6.4. Почему не skip

Archive Recall не помечает CORE nodes автоматически completed.

Игрок всё ещё:

- проживает эволюционную последовательность;
- видит визуальные переходы;
- делает branch choices;
- производит ресурсы;
- покупает ключевые breakthroughs.

Ускоряется знакомый путь, а не удаляется gameplay.

---

# 7. Timeline #2 acceleration target

Timeline #1:

```text
Sapience target ≈ 46:00
```

Timeline #2 familiar early phase:

```text
target = 40–60% от Timeline #1
```

То есть:

```text
Sapience p50 target ≈ 20–28 min
```

## Без покупки AF

Archive Recall сам должен держать median знакомого пути около верхней границы:

```text
~26–28 min
```

## С типичным первым spend

Покупка 2–4 Tier 1 nodes должна сдвигать median примерно в:

```text
~20–25 min
```

Это tuning target, а не жёсткий таймер.

## Важно

Timeline #2 не получает blanket `×2` ко всей экономике.

После Sapience автоматический Archive Recall выключается. Дальнейшее ускорение приходит только из конкретных permanent upgrades, retained traits и знакомых automation paths.

---

# 8. Meta stacking rules

Meta bonuses группируются отдельно от ordinary run bonuses.

Рекомендуемые groups:

```text
meta_early_production
meta_breakthrough_cost
meta_starting_grant
meta_offline_efficiency
meta_retained_trait
meta_hybridization
```

## 8.1. Early production cap

До Sapience:

```text
total meta production multiplier <= 1.60
```

Пример:

```text
Archive Recall 1.25
× AR01 1.25
= 1.5625
```

Дополнительный meta bonus не может поднять эту группу выше `1.60`.

Обычные run upgrades/branch effects считаются отдельно.

## 8.2. Familiar breakthrough cost cap

После всех meta reductions:

```text
effective familiar CORE cost >= 70% canonical cost
```

Пример:

```text
Archive Recall 0.75
AR03 0.92
raw = 0.69
clamped = 0.70
```

## 8.3. Late-era meta cap

Archive nodes не должны создавать большой blanket bonus в поздней игре.

Для meta-only production multipliers:

```text
pre-Sapience: <= 1.60
Tribe/Settlement: <= 1.35
City: <= 1.25
Industry/Atomic: <= 1.15
```

Это guardrail для будущих nodes.

---

# 9. Retained traits — AR05

`AR05 Сохранённая адаптация` создаёт один retained slot.

Перед стартом новой Timeline игрок может выбрать:

```text
1 ранее discovered OPTIONAL biological node
```

Запрещены:

- CORE;
- CONVERGENCE;
- BRANCH;
- crisis/civilization nodes;
- Archive nodes.

## Activation

Retained node не действует с первой секунды.

Он находится в состоянии:

```text
dormant_retained
```

Когда новый run достигает исходных prerequisites узла:

```text
dormant_retained -> completed_retained
```

Стоимость в текущей Timeline:

```text
0
```

Так сохраняется логика мира и не появляется эффект сложного организма до соответствующей эры.

## Slot rules

- один node на один retained slot;
- один и тот же node нельзя дублировать;
- сменить retained node можно только между timelines;
- смена loadout бесплатна;
- сама покупка AR05 permanent.

---

# 10. Cross evolution — AR06

В Timeline #1 первый cellular branch:

```text
C01A / C01B / C01C
```

обычно делает альтернативы дорогими ×2.5.

После AR06:

```text
second_cellular_branch_cost = canonical_base_cost
```

Игрок может приобрести второй cellular branch.

## Ограничение до AR09

AR06 сам по себе не разрешает full dual-active stat stacking.

Состояние:

```text
primary cellular branch = full numerical effect
secondary purchased branch = discovered/hybrid available
```

Secondary branch может:

- считаться discovered;
- открывать соответствующие narrative/event hooks;
- участвовать в будущих hybrid requirements.

Но его основной production multiplier не складывается одновременно с primary.

Это делает AR06 расширением вариантов, а не ранним глобальным multiplier.

---

# 11. Dual specialization — AR09

После AR09 игрок получает один `secondary_trait_slot` для одного biological tier.

Допустимые tier groups:

```text
metabolism
body
behavior
```

Для выбранного tier:

```text
primary trait = 100% numerical effect
secondary trait = 65% numerical effect
```

Unique/non-numeric unlocks secondary trait разрешены полностью, если отдельная spec не запрещает их.

## Hard rules

- одновременно только один secondary trait slot;
- два одинаковых trait не допускаются;
- multiplicative effect одной и той же stat проходит обычные caps;
- AR09 не позволяет dual civilization specialization автоматически;
- AR09 не увеличивает AF earnings.

---

# 12. Timeline loadout

Перед созданием Timeline #2+ Archive может сформировать meta loadout:

```json
{
  "retainedOptionalNodeId": "M04",
  "secondaryTraitTier": "metabolism",
  "preferredPrimaryBranch": null
}
```

Loadout:

- меняется только до старта новой Timeline;
- сохраняется в meta;
- копируется в run как immutable start parameters;
- изменение meta loadout после старта не ретроактивно меняет текущий run.

---

# 13. Catch-up / anti-snowball principles

Meta loop single-player, поэтому catch-up — это не PvP rubber-banding.

Цель: не допустить, чтобы ранние permanent bonuses экспоненциально ускоряли все следующие timelines.

## Hard rules

1. Ни один Archive node не увеличивает AF multiplier.
2. Нет `global production ×N` на всю Timeline.
3. Сильные bonuses привязаны к ранним знакомым фазам.
4. Стоимость familiar CORE имеет hard floor.
5. Meta production имеет phase caps.
6. Hybridization ограничена slots.
7. Tier 3 требует минимум 2 resets.
8. AR12 требует special condition.
9. Новые/неизвестные ветви всегда проходят по нормальному balance.
10. Ads не дают permanent economy multiplier.

## Result

Игрок быстро проходит знакомое, но новый контент снова становится содержательной частью игры.

---

# 14. AF economy after first reset

DS-04 фиксирует только первый reward как полностью числовой contract.

Для последующих timelines до появления их ending specs действует принцип:

```text
AF reward = completion value + discovery value + outcome value
```

Запрещено заранее хардкодить одну универсальную формулу для всех будущих endings.

## Permanent constraints

Будущие formulas:

- не должны зависеть от ads;
- не должны иметь meta multiplier;
- должны вознаграждать новое открытие;
- могут учитывать глубину Timeline и outcome;
- должны логироваться с breakdown;
- должны быть idempotent.

---

# 15. Offline progression

## Timeline #1 — unchanged

```text
offline_gain =
online_rate_at_exit
× min(offline_time, 2h)
× 0.50
```

Дополнительно:

- breakthrough не завершается offline;
- Ash не запускается offline;
- crisis clock freeze;
- Stability drain freeze;
- Population offline growth <= +35% значения при выходе.

## Timeline #2+

Без AR04:

```text
offline efficiency = 50%
```

С AR04:

```text
offline efficiency = 60%
```

Hard cap для текущего meta design:

```text
offline efficiency <= 75%
```

Future upgrades могут двигать 60% к 75%, но не выше без нового decision record.

## Никогда offline

Offline progression не может:

- выбирать branch;
- подтверждать event choice;
- запускать ending;
- выполнять reset;
- начислять AF;
- активировать Archive Intervention;
- автоматически принимать narrative decision.

---

# 16. Archive Intervention — meta balance envelope

Archive Intervention остаётся optional acceleration hook.

Точный rewarded/platform flow — DS-10.

DS-04 фиксирует только безопасные balance limits.

## Target

Archive Intervention может временно усиливать:

```text
energy
information
biomass
food
materials
knowledge
power
```

Нельзя выбирать:

```text
Archive Fragments
Population
Stability
World Tension
crisis timer
```

## Baseline envelope

```text
one resource target
multiplier = 1.50
base duration = 120 sec
one active intervention at a time
no stacking
```

## Meta upgrade caps

Future Archive upgrades могут улучшать:

- duration;
- stored free charges;
- target flexibility.

Hard maximums без нового balance decision:

```text
multiplier <= 1.50
duration <= 180 sec
stored charges <= 3
```

То есть meta progression не усиливает multiplier выше ×1.50 — она улучшает удобство и частоту.

## Safety

Archive Intervention:

- не участвует в target timings baseline;
- не обязателен для goal completion;
- не умножает AF;
- не ускоряет crisis clock;
- не отменяет Ash;
- не работает offline;
- не стакается сам с собой.

DS-10 определяет free charge cadence, rewarded refill, cooldown и unavailable-ad fallback.

---

# 17. Save/state additions

DS-03 `meta` расширяется без нарушения run/meta separation.

Recommended additions:

```json
{
  "archiveFragments": 18,
  "archiveNodes": {
    "AR01": { "purchasedAtTimeline": 1 },
    "AR05": { "purchasedAtTimeline": 1 }
  },
  "archiveRecall": {
    "enabled": true
  },
  "loadout": {
    "retainedOptionalNodeId": "M04",
    "secondaryTraitTier": null
  },
  "intervention": {
    "maxStoredCharges": 1
  }
}
```

Derived multipliers не сохраняются как source of truth.

Они вычисляются из:

```text
meta
+ current run era
+ config
```

---

# 18. Commands / domain hooks

Минимальные meta commands:

```text
purchase_archive_node(nodeId)
set_meta_loadout(loadout)
start_new_timeline()
activate_archive_intervention(resourceId)
```

`start_new_timeline()` обязан:

1. проверить, что previous reset transaction завершён;
2. зафиксировать meta loadout snapshot;
3. назначить `timelineId = meta.nextTimelineId`;
4. создать clean run state;
5. включить Archive Recall, если доступен;
6. применить стартовые grants;
7. сохранить run до начала simulation.

---

# 19. Telemetry

Минимальные события DS-04:

```text
archive_node_viewed
archive_node_purchased
archive_fragments_balance_changed
meta_loadout_changed
timeline_started
archive_recall_applied
retained_trait_activated
secondary_branch_purchased
dual_trait_activated
offline_progress_claimed
archive_intervention_activated
```

Required properties:

```text
timeline_id
ruleset_version
archive_nodes_owned
af_before
af_after
node_id
goal_id / era_id
elapsed_seconds
```

---

# 20. Acceptance tests

## First reset

- 14–18 AF typical first reward.
- AF cannot be granted twice by reload/retry.
- player can start Timeline #2 with 0 AF spent.

## Archive Recall

- applies only after first reset;
- applies only to familiar pre-Sapience CORE nodes;
- stops at Sapience;
- never affects AF/Stability.

## Meta caps

- AR01 + Archive Recall <= 1.60 meta early production;
- AR03 + Recall cannot reduce familiar CORE below 70% canonical cost.

## Retained trait

- OPTIONAL only;
- dormant until original prerequisites;
- zero current-run cost;
- one slot.

## Hybridization

- AR06 removes second-cellular-branch ×2.5 penalty;
- AR06 alone does not stack both branch numeric effects;
- AR09 allows one secondary biological trait at 65%.

## Offline

- Timeline #1 rules unchanged;
- AR04 = 60%;
- no ending/event choice/reset/AF offline.

## Intervention

- cannot target AF/Stability/Population;
- multiplier <=1.50;
- duration <=180 sec;
- stored charges <=3;
- no stacking.

---

# 21. Review decisions

DS-04 считается принятым, если согласованы следующие product decisions:

1. Archive Recall — automatic baseline reward первого reset.
2. Timeline #2 Sapience target — 20–28 минут.
3. familiar CORE: cost ×0.75 + pre-Sapience production ×1.25.
4. AR05 retained OPTIONAL slot semantics.
5. AR06 purchase-breadth without dual numeric stacking.
6. AR09 secondary trait = 65%.
7. meta multipliers/cost reductions имеют hard caps.
8. Archive Intervention multiplier остаётся fixed ×1.50; upgrades улучшают duration/charges/flexibility.
