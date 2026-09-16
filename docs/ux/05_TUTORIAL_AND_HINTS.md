# Хроники Эволюции — Обучение и подсказки

**Документ:** DS-06  
**Статус:** черновик, готов к ревью  
**Область:** contextual onboarding, hints, recovery UX  
**Основание:** принятые DS-05 и DS-05.5; DS-06 screen/component contracts

---

# 1. Назначение

Первый запуск должен обучать игрока через текущую цель, реакцию мира и контекстные подсказки, а не через длинный обязательный tutorial. Игрок осваивает системы ровно тогда, когда они становятся частью Timeline #1.

Обучение не должно раскрывать будущие системы заранее. Нет подсказок про AP до `PB09`, «Познание» до `PB12`, Power до `PB21` и World Tension до `PB25`.

---

# 2. Принципы

1. **Учить через действие.** Подсказка появляется рядом с кнопкой, ресурсом или объектом мира, который решает текущую задачу.
2. **Одна новая идея за раз.** Milestone или unlock объясняет только систему, которая только что стала relevant.
3. **Диорама объясняет вместе с UI.** Изменение мира должно подтверждать, зачем игрок нажал действие.
4. **Подсказки короткие.** Основной flow использует одну-две строки. Развёрнутое объяснение уходит в «Хронику» или деталь компонента.
5. **Не наказывать за паузу.** Возврат после idle показывает, что изменилось и какое действие теперь важно.
6. **Не оптимизировать вместо игрока.** Подсказки объясняют bottleneck, но не навязывают единственный build.

---

# 3. First-run onboarding by PB

| Биты | Что учим | Форма |
|---|---|---|
| `PB00–PB01` | Current Goal + manual action | Goal card + one highlighted CTA |
| `PB02` | Passive production exists | Short resource feedback + world rhythm |
| `PB03` | Evolution panel | New entry appears only after DNA relevance |
| `PB05` | Milestones change phase | Short payoff, then new context |
| `PB06` | Energy as metabolism resource | Resource appears next to relevant goal |
| `PB07` | Branch choice | Live preview + concise consequence |
| `PB09` | AP and optional adaptations | First AP callout inside Evolution |
| `PB12` | Cognition meter | Meter appears with nervous-system behavior |
| `PB15–PB17` | Jobs/buildings | First assignable rows, visible free groups |
| `PB19` | Chronicle | New entry badge and story panel |
| `PB21` | Power | Machine Age payoff + Power panel intro |
| `PB22` | Persistent world modifier | Option preview changes diorama |
| `PB25` | World Tension | Atomic milestone explains crisis signal |
| `PB27` | Irreversible protocol | Focused confirmation |
| `PB29–PB30` | Archive continuity | Summary sections + new run CTA |

---

# 4. Hint triggers

## 4.1. Resource shortage

Trigger:

- player attempts action without required resource;
- goal progress stalls for a short threshold;
- relevant production source is unlocked but unused.

Behavior:

- highlight missing requirement in Goal Card;
- show one direct route to the relevant panel or action;
- avoid showing future systems as solutions.

Example pattern:

```text
Недостаточно биомассы.
Усильте поглощение или дождитесь следующего цикла.
```

## 4.2. Idle return

Trigger:

- player returns after significant offline/idle delta;
- multiple production ticks or milestone-ready states happened.

Behavior:

1. show compact changed-since-return line;
2. update Goal Card to current next action;
3. optionally badge Chronicle if story entries were added;
4. do not open a modal unless a required irreversible event is pending.

## 4.3. New system unlock

Trigger:

- first unlock of Evolution, AP, Cognition, jobs/buildings, Chronicle, Power, World Tension, Archive.

Behavior:

- anchor hint to the actual component;
- explain one interaction, not the full system;
- do not freeze the game longer than the milestone payoff requires.

## 4.4. Repeated failed action

Trigger:

- player repeatedly taps disabled action or cycles panel without progress.

Behavior:

- show missing requirement and likely source;
- if source is a panel, open it only by user action;
- after repeated hints, reduce frequency and leave persistent subtle marker.

---

# 5. Hints by system

## Current Goal

Goal Card is the default tutorial surface. It should answer:

- what matters now;
- what requirement is missing;
- where the next action lives;
- what changed after a milestone.

It should not explain all future steps of the Timeline.

## Resources

Resource hints are local:

- requirement highlight;
- shortage explanation;
- production source if already unlocked;
- cap explanation only after cap is relevant.

Historical resources should not continue sending hints after they leave the main phase.

## Evolution and AP

- Evolution intro at `PB03` explains opening the panel and unlocking current biological nodes.
- Branch choice at `PB07` explains permanence through preview and consequence text.
- AP intro at `PB09` explains that AP buys optional adaptations. It must not appear earlier in tutorial copy.
- Adaptation hints point to body-part previews, not just numbers.

## Cognition

At `PB12`, the hint frames Cognition as emerging behavior, not generic XP. Near Sapience threshold, Goal Card can explain the condition that moves the world from organism to group.

## Jobs and Buildings

First jobs hint explains:

- groups can be assigned;
- free groups are limited;
- roles affect resource flow.

First building hint explains:

- buildings change production or unlock the next social layer;
- costs are contextual to the current goal.

The UI should avoid a long city-builder tutorial before the player has a stable settlement.

## Power

Power hint appears only after `PB21`. It explains sources/consumption in the Power panel and points to the current bottleneck if a goal depends on Power.

## World Tension

World Tension hint appears only after `PB25`. It explains that this is a crisis pressure indicator, not a normal spendable resource.

## Archive

Archive hints explain:

- the world is being recorded;
- reset continues the story;
- preserved and reset items are distinct.

The wording must avoid defeat framing.

---

# 6. Tutorial surfaces

| Surface | Allowed tutorial form |
|---|---|
| `SCR_BOOT` | Minimal system text, no controls tutorial wall |
| `SCR_WORLD` | Goal Card, anchored hints, subtle component badges |
| `SCR_EVOLUTION` | First-use callout, node requirement explanation |
| `SCR_EVENT` | Consequence preview, confirm only for high-impact choice |
| `SCR_MILESTONE` | Short payoff line and one next-step cue after return |
| `SCR_CHRONICLE` | Optional deeper explanations and remembered decisions |
| `SCR_CRISIS` | Tight crisis hints; no broad onboarding |
| `SCR_ENDING` | No tutorial; only result and Archive CTA |
| `SCR_ARCHIVE` | Explain preserved record/reward sections |
| `SCR_META` | New-run CTA as continuity |

---

# 7. Copy rules

- Use active, concrete language.
- Keep primary hint text to one or two short sentences.
- Avoid explaining UI mechanics in lore-heavy text.
- Avoid future spoilers in tutorial text.
- Do not call the first Ash a failure.
- Do not imply the player can prevent Timeline #1 Ash.
- When an action is irreversible, say so plainly.

Examples of acceptable pattern:

```text
Выбор будет записан в Хронику.
Его нельзя изменить в этой линии времени.
```

```text
Напряжение мира растёт.
События кризиса теперь важнее обычного производства.
```

---

# 8. Recovery UX

## Autosave / restore

Restore flow:

1. `SCR_BOOT` or compact overlay says Archive is restoring the current line.
2. Return to `SCR_WORLD` or active surface.
3. Goal Card shows current next action.
4. Chronicle badge appears only if meaningful entries occurred.

## Interrupted milestone

If a milestone was reached but not viewed:

- show milestone on next resume;
- then apply post-milestone layout;
- do not skip the payoff silently.

## Interrupted event

If an event choice is pending:

- restore the event panel with the world visible;
- if the choice is irreversible, keep confirmation state unconfirmed.

## Interrupted ending/archive

If ending was reached:

- restore to the earliest uncommitted final surface: Ending if not saved, Archive if saved, Meta if Archive reward committed.
- Never return player to normal crisis controls after Last Protocol has locked them.

---

# 9. Anti-patterns

- Full-screen tutorial carousel before the first action.
- Locked AP/Cognition/Power/World Tension slots before their canonical unlock.
- Tooltip-only learning that requires hover.
- Event choices on a blank modal with no world context.
- Crisis tutorial that pauses the dramatic pressure for broad production lessons.
- Archive summary framed as failure statistics.
- Hints that reveal Timeline #2 systems during Timeline #1 onboarding.

---

# 10. Acceptance checklist

- First run teaches every major system at first relevance.
- No tutorial text introduces AP before `PB09`.
- No tutorial text introduces Cognition before `PB12`.
- No tutorial text introduces Power before `PB21`.
- No tutorial text introduces World Tension before `PB25`.
- Branch, crisis and Last Protocol choices have clear consequence/confirmation patterns.
- Archive/reset onboarding presents continuity, not defeat.
- Recovery states preserve milestone/event/ending intent.
