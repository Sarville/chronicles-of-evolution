# Хроники Эволюции — Generation Prompts

**Документ:** DS-08  
**Статус:** draft for user review  
**Область:** prompt package for concept/prototype art generation  
**Входы:** `00_ART_DIRECTION.md`, `01_LOCATIONS_AND_DIORAMAS.md`, `03_CREATURE_EVOLUTION.md`, `05_ASSET_MANIFEST.md`

---

# 1. Prompt Policy

Промпты предназначены для concept/prototype generation и production exploration. Они не заменяют арт-дирекцию и не могут менять канон.

Каждый prompt должен:

- указывать asset ID;
- указывать `PB`, `V`, `C` и consumer;
- сохранять 2.5D layered diorama style;
- избегать human default civilization;
- сохранять body plan и primary trait;
- не показывать systems до gameplay unlock.

Запрещённые prompt-сдвиги:

- "magical particles" вместо химии;
- humanoid alien city;
- fantasy medieval village;
- cute mascot creature;
- generic apocalypse;
- nuclear wasteland вместо Ash from player's V8;
- UI text baked into art;
- readable real-world labels/logos.

---

# 2. Global Style Prefix

Использовать как начало для большинства world/building/creature prompts:

```text
Stylized painterly 2.5D game diorama, scientifically plausible but warm and tactile, clear readable silhouettes for mobile screens, layered parallax composition, no embedded UI text, no real-world logos, non-human amphibious coastal species civilization, soft organic continuity from cell to creature to society, cinematic but not photorealistic, production concept art with clean separable layers
```

Для early biology:

```text
Microscopic living-science diorama, dark mineral fluid environment, tactile membranes and semi-transparent biological structures, readable chemistry rather than magic, subtle internal glow, calm background, clear central subject, layered 2.5D production concept art
```

Для crisis/Ash:

```text
Same composition preserved from the previous thriving civilization state, quiet severe aftermath, restrained color, no heroic apocalypse spectacle, visible absence of life and motion, production concept art with separable destruction and ash overlays
```

---

# 3. Negative Prompt

Базовый negative prompt:

```text
humans, humanoid default anatomy, medieval fantasy, cartoon mascot face, cute toy style, magical sparkles, random sci-fi city, generic alien metropolis, unreadable clutter, excessive bloom, UI text, real-world logos, military fetish spectacle, unrelated apocalypse scene, hard black outlines, flat icon style, photorealistic microscope photo, horror gore
```

Добавлять для V0/V1:

```text
fully formed animal, face, eyes, hands, city, landscape horizon, fantasy magic dust
```

Добавлять для V8:

```text
destroyed world, post-apocalypse, ruins before the ending, mushroom cloud as default background
```

Добавлять для V9:

```text
new camera angle, unrelated ruins, generic wasteland, living crowd, active factories
```

---

# 4. World Plate Prompts

## `art.world.v0.primordial_plate.base`

```text
Asset ID: art.world.v0.primordial_plate.base
PB00-PB04, V0 Primordial, C0-C1, consumer SCR_WORLD.
Microscopic ancient mineral fluid diorama with dark volcanic liquid, iron and sulfur tones, mineral surfaces, drifting molecular structures, one weak reaction zone in focus, no living creature yet, no horizon, calm readable composition for mobile UI framing, subtle cyan and amber local glows, layered 2.5D parallax background.
```

## `art.world.v1.cellular_plate.base`

```text
Asset ID: art.world.v1.cellular_plate.base
PB05-PB09, V1 Cellular, C2-C3, consumer SCR_WORLD.
Cell-focused microscopic diorama, one central living cell in a dark nutrient medium, semi-transparent membrane, soft internal biological light, drifting biomass particles, space around the cell for future colony units, readable center subject, tactile science illustration style, layered background and foreground particles.
```

## `art.world.v2.creature_shallows.base`

```text
Asset ID: art.world.v2.creature_shallows.base
PB10-PB14, V2 Creature, C4-C6, consumer SCR_WORLD.
Coastal swamp shallows diorama, wet ground, shallow water, algae and mineral edges, small shelters in nature only as environmental forms, one non-human amphibious soft-bodied organism as main subject, body close to water and ground, natural daylight, clear local behavior space, no civilization yet.
```

## `art.world.v3.tribe_terrace.base`

```text
Asset ID: art.world.v3.tribe_terrace.base
PB14-PB15, V3 Sapient Tribe, C7, consumer SCR_WORLD.
Protected swamp terrace at dusk, water nearby and dry raised ground, small fragile first common space, about five non-human amphibious sapient beings around a shared warm light source, temporary partial shelters, low work surfaces, tools adapted to flexible manipulators, fragile beginning of society, not a village.
```

## `art.world.v4.settlement_terrace.base`

```text
Asset ID: art.world.v4.settlement_terrace.base
PB16-PB18, V4 Settlement, C7, consumer SCR_WORLD.
Permanent coastal settlement built on the same swamp terrace, low broad shelters, food production plots, storage, workshop, paths following old movement lines, central decision space, architecture adapted to low wide amphibious bodies, local wood clay shell and plant materials, warm practical daylight.
```

## `art.world.v5.city_overview.base`

```text
Asset ID: art.world.v5.city_overview.base
PB19-PB21, V5 City, C7, consumer SCR_WORLD.
Non-human species city overview, dense but low and wide architecture, civic center, market routes, craft district, storage logistics, archive or school structure, symbol surfaces inspired by biological traits, roads and platforms suited for low amphibious movement, no human medieval houses, daylight with civic color accents.
```

## `art.world.v6.industrial_region.base`

```text
Asset ID: art.world.v6.industrial_region.base
PB22-PB23, V6 Industrial, C7, consumer SCR_WORLD.
Industrial region grown from the earlier city, factories and machine halls adapted to non-human low body plan, rail or conveyor logistics, visible acceleration of production, heavy silhouettes and working light, energy landmark variant-ready, smoke or clean network depending on energy choice, layered 2.5D diorama.
```

## `art.world.v7.modern_network.base`

```text
Asset ID: art.world.v7.modern_network.base
PB24-PB25, V7 Modern, C7, consumer SCR_WORLD.
Modern regional network built from the same civilization, old city still visible but connected to distributed research campuses, communication towers, electric grid, logistics corridors and distant nodes, clean geometry, night network or clear daylight variant, visibly beyond Industrial but not Atomic crisis.
```

## `art.world.v8.atomic_peak.base`

```text
Asset ID: art.world.v8.atomic_peak.base
PB26-PB28, V8 Atomic, C7, consumer SCR_WORLD and SCR_CRISIS.
Advanced modern civilization at peak capability, atomic complex or reactor-laboratory landmark integrated into the regional network, high-power city lights, monitoring structures and controlled warning geometry, growing tension but not destroyed, space for progressive crisis overlays, same non-human architectural ergonomics.
```

## `art.world.v9.ash_from_v8.base`

```text
Asset ID: art.world.v9.ash_from_v8.base
PB29, V9 Ash, consumer SCR_ENDING.
Same camera composition and landmarks as art.world.v8.atomic_peak.base after catastrophe, atomic complex damaged or silent, network lights broken, production motion gone, desaturated ash-gray world with faint coal-red residuals, sparse smoke and ash, no active inhabitants, no new unrelated wasteland composition.
```

---

# 5. Creature Prompts

## Primary Trait Template

Use one of:

```text
Absorption trait: extended intake folds, cilia or flexible tendril-like contact structures, active reaching toward nutrient flows, curious and hungry motion, not horror tentacles.
```

```text
Symbiosis trait: paired nodules, partner organism motifs, shared rhythm of glow or movement, supportive clustered forms, not a smiling friendly face.
```

```text
Shell trait: reinforced outer membrane or mineral-chitin plates, clear protected inner core, heavier contour and resistant posture, not medieval metal armor.
```

## `art.creature.c2.cell.*`

```text
Asset ID: art.creature.c2.cell.[variant]
PB05-PB08, V1 Cellular, C2/C2A/C2B/C2C, consumer SCR_WORLD and SCR_EVOLUTION.
Central living cell with semi-transparent membrane, visible internal biological processes, readable silhouette at mobile scale, apply [primary trait template], floating in nutrient medium, production concept with transparent separable subject layer.
```

## `art.creature.c3.colony.base`

```text
Asset ID: art.creature.c3.colony.base
PB09-PB10, V1 Cellular, C3, consumer SCR_WORLD and SCR_EVOLUTION.
Coordinated colony of related cell units, several units moving in a shared direction and rhythm, repeated primary trait motif across the cluster, suggests future body plan but does not yet form one animal body, clear pre-multicellular boundary.
```

## `art.creature.c4.organism.base`

```text
Asset ID: art.creature.c4.organism.base
PB10, V2 Creature, C4, consumer SCR_WORLD and SCR_MILESTONE.
Small non-human amphibious multicellular organism in coastal shallows, broad soft central body, low center of mass, flexible front manipulators, side or lower locomotion structures, visible inherited primary trait, wet organic skin, first unified body motion, not humanoid.
```

## `art.creature.c7.sapient.body`

```text
Asset ID: art.creature.c7.sapient.body
PB14-PB28, V3-V8, C7, consumer SCR_WORLD.
Sapient version of the same amphibious coastal species, broad low body, flexible front manipulators used for tools, visible sensory focus, inherited primary trait in silhouette, intelligent attention shown through posture and object interaction, non-human ergonomics, no human proportions or hands.
```

---

# 6. Building And Prop Prompts

## Trait Architecture Modifiers

Absorption:

```text
open exchange plazas, shallow resource channels, filtering surfaces, flexible tie points, curved intake-like civic motifs
```

Symbiosis:

```text
paired courtyards, nested shared chambers, living containers, repeated twin motifs, cooperative work surfaces
```

Shell:

```text
low arched openings, plated roofs, protected storage forms, ribbed mineral supports, sheltered civic spaces
```

## `art.building.v4.house_cluster.base`

```text
Asset ID: art.building.v4.house_cluster.base
PB16-PB18, V4 Settlement, C7, consumer SCR_WORLD.
Cluster of permanent low broad dwellings for a non-human amphibious species, wide ground-level entrances, ramps and wet-dry platforms, local plant clay shell and wood materials, preserves coastal terrace location, apply [trait architecture modifier], no human cottage shapes.
```

## `art.building.v5.archive_school.base`

```text
Asset ID: art.building.v5.archive_school.base
PB19-PB21, V5 City, C7, consumer SCR_WORLD and SCR_CHRONICLE.
Archive or learning building for non-human city, low accessible platforms, symbol surfaces made from carved plates or arranged shell-stones, civic importance without human columns, biologically inspired motifs from primary trait, readable as knowledge storage.
```

## `art.building.v6.energy_landmark.base`

```text
Asset ID: art.building.v6.energy_landmark.base
PB22-PB23, V6 Industrial, C7, consumer SCR_WORLD and SCR_EVENT.
Industrial energy landmark adapted to non-human civilization, machine structures, logistics lines, low maintenance platforms, variant [fossil clean early atomic], visibly industrial but not modern or atomic peak, production overlay-ready.
```

## `art.building.v8.atomic_complex.base`

```text
Asset ID: art.building.v8.atomic_complex.base
PB26-PB28, V8 Atomic, C7, consumer SCR_WORLD and SCR_CRISIS.
Atomic reactor-laboratory complex within advanced non-human modern network, controlled symmetry, warning geometry, research and monitoring structures, high-power lighting, not destroyed, tension-ready overlays, architecture still suited to low amphibious body plan.
```

## `art.prop.v8.protocol_console`

```text
Asset ID: art.prop.v8.protocol_console
PB28, V8 Atomic, C7, consumer SCR_CRISIS.
Last Protocol decision console or crisis interface physically adapted to low wide non-human bodies and flexible manipulators, large cooperative controls, warning lights, no readable real-world text, serious restrained crisis mood.
```

---

# 7. VFX Prompt Notes

VFX prompts should be short and compositable. Generate on transparent or easily maskable backgrounds when possible.

## `art.vfx.v0_membrane_close`

```text
Readable membrane closing around a central proto-life reaction in microscopic mineral fluid, outside and inside become clearly separated, soft biological edge, 3-8 second milestone transition, no fully formed animal, no magic explosion.
```

## `art.vfx.v1_to_v2.multicellularity`

```text
Coordinated cell colony reorganizing into one unified small organism, cells become body structure, inherited primary trait remains visible, camera scale expands from microscopic colony to whole organism, milestone transition, no separate unrelated animal.
```

## `art.vfx.v2_to_v3.sapience_pullback`

```text
Night coastal shallows scene, one cognitive organism raises attention toward stars or distant light, camera pulls back to reveal about five sapient beings and first shared space, emotional but restrained, no humanoid transformation.
```

## `art.vfx.v8_to_v9.white_flash`

```text
Hard white flash rupture from atomic crisis state into silence, no spectacle montage, brief fixed composition, prepares transition to same world as ash.
```

---

# 8. Review Checklist For Generated Images

Reject generated output if:

- it introduces humans or humanoid default anatomy;
- V3-V8 architecture ignores C7 body ergonomics;
- V3 looks like a finished village;
- V7 looks like V6 with wires only;
- V8 is already destroyed before Ash;
- V9 uses a new unrelated camera angle;
- primary trait disappears from C7;
- Shell becomes metal armor;
- Symbiosis becomes a face;
- Absorption becomes horror;
- text/logos are baked into the asset;
- the image implies gameplay systems before their PB unlock.
