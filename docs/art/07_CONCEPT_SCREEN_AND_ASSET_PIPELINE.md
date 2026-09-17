# Хроники Эволюции — Concept Screens And Asset Pipeline

**Документ:** DS-08  
**Статус:** draft for user review  
**Область:** практический процесс approval постоянной компоновки, эпохальных диорам, чек-листов и handoff для ассетов/анимаций  
**Входы:** `05_ASSET_MANIFEST.md`, `06_GENERATION_PROMPTS.md`, `../ux/02_MOBILE_WIREFRAMES.md`, `../ux/03_DESKTOP_WIREFRAMES.md`, `../ux/06_PERSISTENT_LAYOUT_CONCEPTS.md`

---

# 1. Решение Процесса

Перед массовой генерацией ассетов сначала один раз фиксируется постоянная компоновка приложения, затем каждая эпоха проходит visual approval loop только по диораме и эпохальным объектам.

```text
global shell
→ 3-4 desktop layout concepts from `../ux/06_PERSISTENT_LAYOUT_CONCEPTS.md`
→ 3-4 mobile layout concepts from `../ux/06_PERSISTENT_LAYOUT_CONCEPTS.md`
→ review пользователя
→ выбранный desktop/mobile shell становится постоянным

эпоха / блок
→ 4 крупных diorama concepts: композиция / стиль / гамма / плотность деталей
→ 1 UI content sheet для этой эпохи в уже выбранном shell
→ review пользователя: что оставить, что убрать, что смешать в диораме
→ уточнение prompt direction и production notes
→ generation checklist freeze для блока
→ генерация ассетов блока
→ animation/reference handoff для движущихся объектов
→ acceptance блока
```

Цель: один раз определить, где живут органы управления на desktop/mobile, а затем перед production-генерацией каждой эпохи визуально оценивать стиль, композицию, гамму, плотность объектов и характер диорамы.

Нельзя менять базовую компоновку от эпохи к эпохе без отдельного UX decision. Нельзя сразу генерировать все мелкие ассеты эпохи без принятого diorama direction для этой эпохи.

---

# 2. Что Генерировать До Ассетов

## Global layout approval, один раз

| Sheet | Количество | Назначение |
| --- | --- | --- |
| Desktop layout concepts | 3-4 варианта | постоянный shell 1366x768: статус, цель, диорама, панели, нижняя строка |
| Mobile layout concepts | 3-4 варианта | постоянный shell 360x800: статус, диорама, goal card, нижняя панель/sheet |
| Global UI component sheet | 1 лист | базовый язык панелей, кнопок, вкладок, карточек цели и статусов |

Layout concept не является финальным UI mockup. Он нужен, чтобы один раз понять постоянные места управления и пропорции диорамы. Подготовленные варианты и recommended short list зафиксированы в `../ux/06_PERSISTENT_LAYOUT_CONCEPTS.md`.

## Per-block diorama approval

| Sheet | Количество | Назначение |
| --- | --- | --- |
| Diorama direction concepts | 4 варианта | крупные картинки мира без UI: композиция, стиль, гамма, плотность объектов |
| Shell preview | 1 desktop + 1 mobile | выбранная диорама вставлена в постоянный shell, чтобы проверить читаемость под UI |
| UI content sheet | 1 лист | какие элементы эпохи живут в уже выбранных панелях, без смены компоновки |
| Animated object refs | 1 лист на группу анимаций | статичный reference + описание цикла для других агентов |

Shell preview нужен только для проверки occlusion/readability. Он не открывает заново вопрос расположения органов управления.

---

# 3. Global Layout Варианты

Готовить один раз 3-4 варианта постоянного shell. Они различаются пропорцией диорамы и панелей, а не эпохальным стилем. Детальные варианты desktop/mobile и таблица решений находятся в `../ux/06_PERSISTENT_LAYOUT_CONCEPTS.md`.

## Variant A — Diorama Dominant

- диорама занимает максимум пространства;
- UI минимален и сжат;
- хорошо подчёркивает мир как главный surface;
- риск: игрок может хуже видеть доступные действия.

## Variant B — Balanced Control

- диорама остаётся главным полем, но панели явно рабочие;
- хороший default для desktop/mobile production.

## Variant C — System Focus

- правая/нижняя панель сильнее раскрыта;
- лучше для системной читаемости;
- риск: мир становится фоном, а не главным героем.

## Variant D — Adaptive Compact

- базовый shell имеет чёткие collapsed states;
- хорошо переносится на mobile и narrow desktop;
- риск: может выглядеть слишком утилитарно.

Пользователь выбирает один layout direction или смешивает два. После выбора компоновка считается постоянной для всех эпох, а milestone/cinematic states становятся временными overlays внутри той же системы.

Рекомендуемый short list на момент подготовки: `LAYOUT_B` как balanced default или `LAYOUT_HYBRID` как production-safe гибрид (`D-B` desktop, `M-A` mobile, раскрытые `M-C` sheets и временные cinematic simplifications).

---

# 4. Diorama Direction Варианты

Для каждого эпохального блока готовить 4 варианта диорамы без UI.

Каждый вариант должен отличаться по нескольким осям:

- композиция: где главный субъект, горизонт, ориентиры, глубина;
- стиль: степень живописности, научности, условности, детализации;
- гамма: температурный сдвиг, контраст, акцентные цвета;
- плотность: сколько объектов и процессов видно в кадре;
- mood: спокойствие, рост, напряжение, потеря, память.

## Diorama Variant A — Clear Focal Subject

- один главный объект или зона сразу читается;
- низкая/средняя плотность;
- хорош для early biology, milestones и мобильного экрана.

## Diorama Variant B — Layered Living System

- несколько смысловых слоёв среды и активности;
- средняя/высокая плотность, но с ясным фокусом;
- хорош для settlement/city/industry.

## Diorama Variant C — Map-Like Civilization

- композиция показывает связи, маршруты и масштаб;
- лучше для city, industrial, modern, atomic;
- риск: может потерять эмоциональный субъект.

## Diorama Variant D — Cinematic Atmosphere

- сильнее работает свет, пауза, настроение и силуэт;
- хорош для Sapience, Atomic, Ash, Archive-adjacent states;
- риск: может стать слишком иллюстративным и слабым как gameplay surface.

Пользователь может выбрать один вариант, смешать два или попросить новый prompt direction.

---

# 5. Desktop И Mobile Обязательные Проверки

## Chosen desktop shell must show

- `STATUS_STRIP`: эра, время/ключевой индикатор, без лишних ресурсов;
- `LEFT_PANEL`: current goal, главные ресурсы, primary action;
- `DIORAMA_STAGE`: самый крупный визуальный блок;
- `RIGHT_PANEL`: активная система эпохи;
- `BOTTOM_STRIP`: короткая строка Архива/feedback, если уместно.

## Chosen mobile shell must show

- верхнюю статусную полосу;
- диораму не меньше половины смыслового экрана, кроме full-screen milestones;
- карточку текущей цели;
- нижнюю контекстную панель или sheet;
- главный touch target;
- safe areas.

## Reject layout concept if

- mobile превращается в сжатый desktop;
- desktop превращается в пустую широкую иллюстрацию без органов управления.

## Reject diorama concept if

- диорама выглядит как background wallpaper, а не gameplay surface;
- главный subject не читается под выбранным UI shell;
- композиция не оставляет safe zones для постоянных панелей;
- стиль противоречит DS-07;
- показаны системы до unlock: AP до PB09, Cognition до PB12, Power до PB21, World Tension до PB25.

---

# 6. Epoch Blocks

Production делится на логически законченные блоки.

| Block ID | PB | V/C | Назначение |
| --- | --- | --- | --- |
| `B00_ORIGIN_CELL` | PB00-PB06 | V0-V1 / C0-C2 | boot, RNA/DNA, membrane, first cell, metabolism |
| `B01_BRANCH_BODY` | PB07-PB14 | V1-V3 / C2-C7 | branch choice, AP preview, multicellularity, cognition, Sapience |
| `B02_TRIBE_SETTLEMENT` | PB15-PB18 | V3-V4 / C7 | first group, tribe, settlement, anomaly |
| `B03_CITY_INDUSTRY` | PB19-PB23 | V5-V6 / C7 | city, chronicle, machines, energy crisis |
| `B04_MODERN_ATOMIC` | PB24-PB28 | V7-V8 / C7 | Modern, ERROR 17, Atomic, crisis, Last Protocol |
| `B05_ASH_ARCHIVE` | PB29-PB30 | V9 / Archive | Ash, Archive summary, Archive memory |

Каждый блок должен иметь свой diorama concept approval и asset checklist. Layout approval не повторяется.

---

# 7. Global Layout Checklist

До первого эпохального блока:

- [x] 3-4 desktop layout concepts;
- [x] 3-4 mobile layout concepts;
- [ ] 1 global UI component sheet;
- [ ] selected desktop shell;
- [ ] selected mobile shell;
- [ ] notes for diorama safe zones;
- [ ] notes for panel opacity/contrast over art;
- [ ] rejection rules for future diorama occlusion.

---

# 8. Block Checklists

## `B00_ORIGIN_CELL`

Concepts:

- [ ] 4 diorama direction concepts: V0, membrane transition, V1 cell, metabolism mood;
- [ ] 1 desktop shell preview using selected layout;
- [ ] 1 mobile shell preview using selected layout;
- [ ] UI content sheet: boot lines, RNA/DNA resource, early goal card, evolution entry;
- [ ] animation refs: particle drift, RNA stabilize, replication rhythm, membrane close, metabolism flow.

Assets:

- [ ] `art.world.v0.primordial_plate.base`;
- [ ] `art.world.v1.cellular_plate.base`;
- [ ] `art.creature.c1.protocell.base`;
- [ ] `art.creature.c2.cell.base`;
- [ ] `art.vfx.v0.rna_stabilize`;
- [ ] `art.vfx.v0.replication_rhythm`;
- [ ] `art.vfx.v0.dna_structure`;
- [ ] `art.vfx.v0_membrane_close`;
- [ ] `art.vfx.v1.metabolism_flow`;
- [ ] `art.ui_overlay.archive_boot_noise`.

## `B01_BRANCH_BODY`

Concepts:

- [ ] 4 diorama direction concepts: C2 trait previews, C3 colony, V2 organism, Sapience night pullback;
- [ ] 1 desktop shell preview using selected layout;
- [ ] 1 mobile shell preview using selected layout;
- [ ] UI content sheet: Evolution panel, AP card, Cognition meter, behavior event sheet;
- [ ] animation refs: absorption intake, symbiosis paired pulse, shell resistance, colony coordination, multicellularity transition, Sapience pullback.

Assets:

- [ ] `art.creature.c2.cell.absorption.trait`;
- [ ] `art.creature.c2.cell.symbiosis.trait`;
- [ ] `art.creature.c2.cell.shell.trait`;
- [ ] `art.creature.c3.colony.base`;
- [ ] `art.creature.c4.organism.base`;
- [ ] `art.creature.c5.adapted.modular_set`;
- [ ] `art.creature.c6.cognitive.behavior_set`;
- [ ] `art.creature.c7.sapient.body`;
- [ ] `art.creature.c7.sapient.group_five`;
- [ ] `art.creature.shared.tag.photosynthesis`;
- [ ] `art.creature.shared.tag.chemosynthesis`;
- [ ] `art.creature.shared.tag.efficient_digestion`;
- [ ] `art.world.v2.creature_shallows.base`;
- [ ] `art.world.v3.tribe_terrace.base`;
- [ ] `art.vfx.v1.colony_coordination`;
- [ ] `art.vfx.v1_to_v2.multicellularity`;
- [ ] `art.vfx.v2_to_v3.sapience_pullback`.

## `B02_TRIBE_SETTLEMENT`

Concepts:

- [ ] 4 diorama direction concepts: V3 terrace, first common space, V4 settlement, anomaly object in context;
- [ ] 1 desktop shell preview using selected layout;
- [ ] 1 mobile shell preview using selected layout;
- [ ] UI content sheet: jobs sheet/panel, buildings sheet/panel, Chronicle entry, event choice;
- [ ] animation refs: common light, work loop, farming/storage activity, anomaly idle.

Assets:

- [ ] `art.building.v3.common_light.base`;
- [ ] `art.building.v3.temporary_shelter.base`;
- [ ] `art.world.v4.settlement_terrace.base`;
- [ ] `art.building.v4.house_cluster.base`;
- [ ] `art.building.v4.food_production.base`;
- [ ] `art.building.v4.storage.base`;
- [ ] `art.building.v4.workshop.base`;
- [ ] `art.prop.v4.traces_before_us.anomaly`;
- [ ] `art.prop.shared.tool_grip_wrap`;
- [ ] `art.prop.shared.tool_pull_surface`.

## `B03_CITY_INDUSTRY`

Concepts:

- [ ] 4 diorama direction concepts: V5 city, V6 industry, V6 fossil, V6 clean/early atomic contrast;
- [ ] 1 desktop shell preview using selected layout;
- [ ] 1 mobile shell preview using selected layout;
- [ ] UI content sheet: city jobs/buildings, Chronicle panel, Energy tab, crisis choice panel;
- [ ] animation refs: market route, archive/school activity, factory loop, energy landmark variants.

Assets:

- [ ] `art.world.v5.city_overview.base`;
- [ ] `art.building.v5.market_route.base`;
- [ ] `art.building.v5.civic_center.base`;
- [ ] `art.building.v5.archive_school.base`;
- [ ] `art.prop.v5.writing_markers`;
- [ ] `art.world.v6.industrial_region.base`;
- [ ] `art.building.v6.factory.base`;
- [ ] `art.building.v6.energy_landmark.base`;
- [ ] `art.prop.shared.tool_coop_lever`;
- [ ] `art.prop.v6.machine_controls`;
- [ ] `art.vfx.v4.persistence_growth`;
- [ ] `art.vfx.v5.density_routes`;
- [ ] `art.vfx.v6.machine_age`.

## `B04_MODERN_ATOMIC`

Concepts:

- [ ] 4 diorama direction concepts: V7 Modern, ERROR 17 shell impact, V8 Atomic peak, V8 crisis escalated;
- [ ] 1 desktop shell preview using selected layout;
- [ ] 1 mobile shell preview using selected layout;
- [ ] UI content sheet: Modern status, ERROR 17 overlay, World Tension, Crisis panel, Last Protocol;
- [ ] animation refs: network reveal, tower signal, atomic activation, World Tension levels, protocol console alert.

Assets:

- [ ] `art.world.v7.modern_network.base`;
- [ ] `art.building.v7.network_tower.base`;
- [ ] `art.building.v7.research_campus.base`;
- [ ] `art.prop.v7.modern_control_surface`;
- [ ] `art.ui_overlay.error17_glitch`;
- [ ] `art.world.v8.atomic_peak.base`;
- [ ] `art.building.v8.atomic_complex.base`;
- [ ] `art.building.v8.crisis_center.base`;
- [ ] `art.prop.v8.protocol_console`;
- [ ] `art.vfx.v7.network_reveal`;
- [ ] `art.vfx.v8.atomic_activation`;
- [ ] `art.vfx.v8.world_tension_01`;
- [ ] `art.vfx.v8.world_tension_02`;
- [ ] `art.vfx.v8.world_tension_03`;
- [ ] `art.ui_overlay.crisis_warning_frame`;
- [ ] `art.ui_overlay.last_protocol_focus`.

## `B05_ASH_ARCHIVE`

Concepts:

- [ ] 4 diorama direction concepts: V9 Ash derived from V8, ash close detail, Archive summary background, Archive memory object;
- [ ] 1 desktop shell preview using selected layout;
- [ ] 1 mobile shell preview using selected layout;
- [ ] UI content sheet: Ending CTA, Archive summary cards, Timeline #2 CTA;
- [ ] animation refs: white flash, ash settle, archive trace pulse.

Assets:

- [ ] `art.world.v9.ash_from_v8.base`;
- [ ] `art.building.v9.atomic_complex.ash`;
- [ ] `art.prop.v9.archive_trace`;
- [ ] `art.vfx.v8_to_v9.white_flash`;
- [ ] `art.vfx.v9.ash_settle`;
- [ ] `art.ui_overlay.archive_memory_after_ash`.

---

# 9. Animation Handoff Template

Для каждого animated object до production animation нужен reference card:

```text
Animation ID:
Related asset ID:
PB/V/C:
Consumer:
Static reference:
Loop type: idle / process / transition / crisis / one-shot
Duration target:
Start pose:
End pose:
Motion beats:
What must remain readable:
What must not happen:
Layer dependencies:
Implementation notes:
```

Example:

```text
Animation ID: anim.v1.metabolism_flow.idle
Related asset ID: art.vfx.v1.metabolism_flow
PB/V/C: PB06 / V1 / C2
Consumer: SCR_WORLD
Loop type: process
Duration target: 2-4 sec loop
Start pose: nutrient particles drift near membrane
End pose: subtle internal pulse resolves into energy flow
Motion beats: intake → internal pulse → soft release
What must remain readable: membrane, inside/outside, cell silhouette
What must not happen: abstract glowing orb, magic explosion, organism body preview
Layer dependencies: V1 plate, C2 cell, optional trait overlay
Implementation notes: should be low-intensity enough for normal gameplay screen
```

---

# 10. Prompt Revision Loop

После concept review фиксировать:

- chosen variant(s);
- liked elements;
- rejected elements;
- mandatory edits;
- prompt additions;
- negative prompt additions;
- asset checklist changes;
- animation handoff notes.

Формат записи:

```text
Block:
Review date:
Diorama direction:
Shell impact:
Keep:
Remove:
Combine:
Prompt changes:
New reject rules:
Approved for asset generation: yes/no
```

Только после `Approved for asset generation: yes` блок переходит к производству отдельных ассетов. Если проблема только в UI occlusion, исправляется shell preview/safe-zone note, а не вся компоновка.

---

# 11. Recommended First Run

Первым запуском делать global layout approval, затем `B00_ORIGIN_CELL`.

Global layout задаёт:

- постоянную desktop компоновку;
- постоянную mobile компоновку;
- safe zones для диорам;
- поведение панелей поверх живописного мира.

`B00_ORIGIN_CELL` задаёт:

- общий rendering style;
- раннюю диорама-first композицию;
- степень научности/стилизации;
- поведение UI поверх мира;
- правила VFX без перегруза.

После принятия `B00` стиль переносится в `B01`, но creature/body direction всё равно получает собственный diorama concept review. Layout при этом не пересобирается.
