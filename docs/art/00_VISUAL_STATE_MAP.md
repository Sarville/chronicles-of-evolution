# Хроники Эволюции — Visual State Map

**Документ:** DS-05.5  
**Статус:** accepted  
**Область:** визуальные состояния Timeline #1 до детального art direction  
**Presentation authority:** `docs/ux/00_TIMELINE_PRESENTATION_MAP.md`  
**Narrative input:** `docs/scenario/01_TIMELINE_01_SCRIPT.md`

---

# 1. Назначение

Этот документ фиксирует **семантические визуальные состояния** игры до DS-07.

Он отвечает на вопросы:

- какое состояние мира должно быть визуально отличимо;
- что обязано измениться при переходе эпохи;
- как эволюционирует существо;
- какие выборы должны оставлять видимый след;
- какие визуальные решения ещё нельзя фиксировать до art direction.

Это не style bible и не asset manifest.

DS-07 определит художественное исполнение. DS-08 превратит требования в конкретные production assets.

---

# 2. Два независимых visual tracks

У игры есть два связанных, но разных visual tracks:

## World track

```text
V0 Primordial
→ V1 Cellular
→ V2 Creature
→ V3 Sapient Tribe
→ V4 Settlement
→ V5 City
→ V6 Industrial
→ V7 Modern
→ V8 Atomic
→ V9 Ash
```

Он отвечает за **масштаб мира, окружение и цивилизацию**.

## Creature track

```text
C0 Proto-chemistry
→ C1 Protocell
→ C2 Cell
→ C2A/B/C Primary Trait
→ C3 Coordinated Colony
→ C4 Multicellular Organism
→ C5 Adapted Organism
→ C6 Cognitive Organism
→ C7 Sapient Species
```

Он отвечает за **непрерывность вида**.

Hard rule: переход world state не должен случайно заменять вид новым несвязанным существом. Игрок должен узнавать собственную эволюционную историю.

---

# 3. V0 — Primordial

**Gameplay:** G001–G004 до завершения membrane transition.  
**Scale:** molecular / microscopic.  
**Narrative meaning:** порядок начинает возникать из химии.

Обязательные признаки:

- среда выглядит древней и небиологической;
- главное движение — химические/молекулярные реакции;
- RNA/DNA progression визуально читается как рост устойчивости и повторяемости структур;
- до Membrane нет полноценного living subject;
- Membrane впервые создаёт ясное `inside / outside`.

Не фиксируется пока:

- точная палитра;
- реалистичность молекул;
- 2D/2.5D/3D representation;
- форма decorative particles.

Transition out:

> membrane closes → cell becomes focal object → V1.

---

# 4. V1 — Cellular

**Gameplay:** G005–G008.  
**Scale:** cell-focused microscopic.  
**Narrative meaning:** жизнь стала отдельной системой и учится координировать клетки до настоящего многоклеточного breakthrough.

Обязательные признаки:

- клетка — главный визуальный subject;
- molecular background остаётся, но теряет главную роль;
- Biomass/Metabolism должны ощущаться как процессы живой клетки;
- Protein Synthesis / Organelles делают внутреннюю структуру богаче;
- primary trait меняет silhouette/behavior enough to be remembered;
- к G008 отдельные клетки/потомки могут образовывать более организованную колонию, но единый организм ещё не считается сформированным.

## Primary trait variants

### C2A — Absorption

Visual semantics:

- активный захват среды;
- более выраженные structures for intake/contact;
- ощущение движения/аппетита/экспансии.

Не означает обязательные клыки или хищное животное.

### C2B — Symbiosis

Visual semantics:

- совместимость/cooperation;
- внутренние или внешние partner structures;
- более целостный, стабильный rhythm.

Не превращать в literal friendly face.

### C2C — Shell

Visual semantics:

- защита должна сразу читаться по силуэту;
- оболочка/armor/structural reinforcement;
- более выраженное разделение core и exterior.

Shell — самый silhouette-critical из трёх вариантов.

## Optional metabolic tags

Photosynthesis/Chemosynthesis/Efficient Digestion могут добавлять secondary visual tags, но не должны перекрывать primary trait.

## C3 — Coordinated Colony / pre-multicellular

**Gameplay boundary:** G008 / AP introduction, до G009.

Visual semantics:

- несколько клеток/единиц действуют более согласованно;
- появляется направление будущего body plan;
- AP adaptation previews могут показывать будущие функции/форму;
- визуал не должен сообщать, что Multicellularity уже достигнута.

Hard rule:

> G008 может показать потенциал будущего тела, но переход `V1 → V2` происходит только на G009/MS02.

Transition out:

> coordinated colony → one readable organism → V2.

---

# 5. V2 — Creature

**Gameplay:** G009 Multicellularity → Cognition/Sapience, ~24–40 мин.  
**Scale:** whole organism / local environment.  
**Narrative meaning:** жизнь получает единое тело, поведение и затем внутреннюю модель мира.

Обязательные признаки:

- тело читается целиком;
- primary trait наследуется из V1;
- AP adaptations добавляются к одному и тому же body plan;
- sensory development должен иметь визуально/анимационно читаемый effect;
- Nervous System скорее меняет поведение/coordination, чем обязан рисовать literal мозг;
- Cognition phase должна ощущаться сложнее через реакцию, внимание, движение, social/object behavior.

## C4 — Multicellular Organism

- G009/MS02 — первый момент, когда вид становится единым многоклеточным организмом;
- единый body plan;
- движение/жизнедеятельность воспринимаются как действия одного организма;
- должна сохраняться узнаваемая связь с C3 и primary trait.

## C5 — Adapted Organism

Potential visible adaptation semantics:

- Mobility → locomotion structure;
- Sensory Cells → sensory structures;
- Digestion → intake/digestive specialization;
- Structural Tissue → stronger support/silhouette.

Точная анатомия — DS-07.

## C6 — Cognitive Organism

- coordinated behavior;
- sustained attention;
- реакция на угрозу/другого;
- manipulation/social behavior может менять animation repertoire.

Transition out:

> night scene / gaze at stars → camera pulls back → individual becomes group → V3.

---

# 6. V3 — Sapient Tribe

**Gameplay:** Sapience → Tribe, ~38–50 мин.  
**Scale:** small group / camp.  
**Narrative meaning:** evolution becomes history.

Обязательные признаки:

- C7 Sapient Species остаётся узнаваемым потомком C6;
- первая группа небольшая и физически понятная;
- shelter/hearth/work points появляются постепенно;
- мир ещё не должен выглядеть как готовая деревня;
- social actions становятся важнее индивидуальной survival animation.

At Sapience transition:

- одна особь — foreground emotional focus;
- после pull-back видна группа примерно из пяти;
- это ключевая смена масштаба всей игры.

Population scaling rule:

после ранней стадии население можно представлять выборочно/символически; не требуется рисовать каждого жителя.

Transition out:

> camp becomes permanent → fields/houses/workshop → V4.

---

# 7. V4 — Settlement

**Gameplay:** Farming → permanent settlement, ~50–65 мин.  
**Scale:** village / local territory.  
**Narrative meaning:** разумный вид решил остаться.

Обязательные признаки:

- permanent houses;
- fields;
- storage;
- workshop;
- paths becoming roads;
- visual persistence: построенное остаётся частью world history.

`Следы до нас`:

- anomaly object должен явно отличаться от settlement material language;
- не должен визуально раскрывать его происхождение;
- Preserve может оставить persistent landmark/storage trace.

Transition out:

> density + institutions + roads/market/research → V5.

---

# 8. V5 — City

**Gameplay:** Writing / organized labor / City, ~65–80 мин.  
**Scale:** city overview.  
**Narrative meaning:** общество становится системой взаимозависимых ролей.

Обязательные признаки:

- заметно выше density;
- roads/routes organize space;
- market/trade activity;
- school/research or equivalent institution;
- division into functional areas can begin;
- Writing/Chronicle theme may appear through symbols/signage/record structures without text clutter.

Governance choice may alter minor civic visual language later, but is not required to rebuild entire city art.

Transition out:

> steam/machines/factory/logistics become dominant → V6.

---

# 9. V6 — Industrial

**Gameplay:** Mechanization → Machine Age, ~80–95 мин.  
**Scale:** city/region.  
**Narrative meaning:** production escapes biological/manual limits.

Обязательные признаки:

- moving machinery;
- factories;
- rail/logistics;
- strong infrastructure motion;
- Power becomes visibly relevant only at late V6 / G021;
- scene must feel faster/more productive than V5.

## Energy Crisis persistent variants

### Fossil

- heavier extraction/generation;
- smoke/pollution tags;
- stronger immediate industrial intensity.

### Clean

- cleaner generation/infrastructure;
- reduced pollution visual tag;
- still industrial, not utopian eco-fantasy.

### Early Atomic

- more research/experimental energy landmarks;
- does not skip Modern or jump directly to V8.

Transition out:

> networks and regions connect → industrial city becomes global system → V7.

---

# 10. V7 — Modern

**Gameplay:** G022 / ERROR 17 bridge, ~95–104 мин.  
**Scale:** regional → planetary/global presentation.  
**Narrative meaning:** civilization becomes interconnected enough that local actions have global consequences.

Обязательные признаки:

- electrical grid/network readability;
- communications;
- modern research institutions;
- advanced logistics;
- connection between multiple regions/centers;
- retained visual consequences of Energy Crisis choice.

Hard rule:

> Modern is a full visual state. It cannot be visually collapsed into Industrial or Atomic.

ERROR 17 does not change V7 art state; it corrupts/interrupts UI presentation only.

Transition out:

> atomic program becomes tangible + milestone → V8.

---

# 11. V8 — Atomic

**Gameplay:** Atomic milestone + Great Filter, ~107–118 мин.  
**Scale:** global civilization under systemic risk.  
**Narrative meaning:** civilization gains destructive power before proving it can manage conflict.

Base state requirements:

- modern civilization remains visible;
- reactor/lab/atomic program is tangible;
- world initially appears near peak capability;
- World Tension starts at transition, not before.

## Crisis overlays

Crisis should degrade/pressure V8 progressively rather than swap to a new era asset:

1. readiness / military tension;
2. disrupted network/activity;
3. emergency logistics/shortages where applicable;
4. high-tension lighting/activity changes;
5. critical warning state.

The world must **not** look destroyed before Last Protocol.

Transition out:

> decision lock → pause → white flash → V9.

---

# 12. V9 — Ash

**Gameplay:** ENDING_ASH.  
**Scale:** same civilization space after catastrophe.  
**Narrative meaning:** continuity through absence.

Обязательные признаки:

- composition should be recognizably derived from V8;
- motion largely gone;
- infrastructure damaged/silent;
- rare smoke/fire only;
- no ordinary production overlays;
- no celebratory reward visuals before player has processed the ending.

Hard rule:

Ash is not a generic apocalypse wallpaper. It must feel like **this player's world**, now ended.

Subtypes `ash_fire`, `ash_too_late`, `ash_system` may alter details/copy; they do not require three unrelated world designs.

---

# 13. Creature inheritance rules

1. Primary trait is persistent visual ancestry across C2→C7.
2. C3 is a coordinated colony/pre-multicellular state; it must not steal the G009/MS02 payoff.
3. Optional adaptations layer on top of current morphology or preview the emerging body plan.
4. Later body development may abstract an early cellular feature, but should preserve a recognizable motif where possible.
5. No adaptation should silently disappear if it was sold to the player as visually meaningful.
6. Not every numeric modifier requires visible morphology.
7. Behavior choices can primarily change animation repertoire rather than anatomy.
8. Sapience should not turn the species into a generic human unless DS-07 explicitly chooses and justifies that direction.
9. Civilization buildings/props must be designed for the actual species/body plan chosen by DS-07.

---

# 14. Branch visual priority

When several choices affect visuals, use this priority:

```text
base evolutionary stage
→ primary biological trait
→ major body/AP adaptation
→ optional metabolic tag
→ behavior animation/profile
→ civilization energy strategy
→ crisis overlays
```

This prevents combinatorial asset explosion while retaining player history.

DS-07 must define which layers are:

- silhouette-changing;
- texture/material-changing;
- prop/accessory;
- animation-only;
- environment-only.

---

# 15. Camera/scale progression

Semantic camera progression:

```text
molecular detail
→ single cell
→ coordinated colony
→ whole organism
→ organism in environment
→ small sapient group
→ camp
→ settlement
→ city
→ region
→ global connected civilization
→ global crisis
→ ruined world
```

The exact camera system is deferred, but the **sense of increasing scale is mandatory**.

A player should be able to compare the first minutes and the Modern phase and immediately feel that the game has moved from microscopic chemistry to planetary history.

---

# 16. Transition principles

Major transitions should prefer continuity over hard cuts:

- V0→V1: membrane/cell focus;
- V1→V2: coordinated colony becomes one body only on G009/MS02;
- V2→V3: cognitive organism → night scene → camera pull-back → group;
- V3→V4: accumulation/permanence;
- V4→V5: density/institutions;
- V5→V6: machinery/logistics;
- V6→V7: network/global scale;
- V7→V8: atomic landmark + milestone + World Tension;
- V8→V9: intentional hard rupture via white flash.

The only deliberately violent visual discontinuity in Timeline #1 is Atomic crisis → Ash.

---

# 17. Deferred to DS-07

Not decided in DS-05.5:

- exact art style;
- species anatomy;
- whether creature is cute/realistic/alien;
- perspective/isometric/side/front composition;
- exact palette per era;
- exact building architecture;
- exact atomic/industrial iconography;
- exact level of animation;
- weather/day-night baseline;
- final transition durations;
- final VFX language.

DS-07 must solve these while preserving V0–V9/C0–C7 semantics.

---

# 18. Acceptance checklist

- [x] restored biology has visible continuity
- [x] primary trait has a persistent visual identity
- [x] AP/adaptations have a defined layering role without appearing before G008
- [x] G008 remains pre-multicellular and G009/MS02 owns the V1→V2 breakthrough
- [x] Sapience has a concrete scale transition
- [x] Tribe / Settlement / City are distinct
- [x] Industry and Modern are distinct
- [x] Energy Crisis has visible world consequences
- [x] Atomic is a peak civilization state before crisis degradation
- [x] Ash derives from the player's own world
- [x] camera scale grows with the game's subject
- [x] art decisions that require DS-07 remain deliberately open
