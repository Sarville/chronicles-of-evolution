# Хроники Эволюции — Asset Manifest

**Документ:** DS-08  
**Статус:** draft for user review  
**Область:** stable asset IDs, consumers, layers, variants and production requirements  
**Входы:** `00_VISUAL_STATE_MAP.md`, `00_ART_DIRECTION.md`, `01_LOCATIONS_AND_DIORAMAS.md`, `02_ERA_TRANSITIONS.md`, `04_BUILDINGS_AND_PROPS.md`

---

# 1. Правила ID

Asset ID должен быть стабильным, человекочитаемым и не зависеть от имени файла генератора.

Формат:

```text
art.<track>.<state>.<name>[.<variant>][.<layer>]
```

Где:

- `track`: `world`, `creature`, `building`, `prop`, `vfx`, `ui_overlay`;
- `state`: `v0`-`v9`, `c0`-`c7`, или `shared`;
- `name`: смысловой объект;
- `variant`: `absorption`, `symbiosis`, `shell`, `fossil`, `clean`, `early_atomic`, etc.;
- `layer`: `base`, `activity`, `crisis`, `ash`, `trait`, etc.

Пример:

```text
art.building.v8.atomic_complex.clean.base
art.building.v8.atomic_complex.clean.ash
art.creature.c7.sapient.shell.pose_work
```

---

# 2. Общие Production Требования

Каждая строка манифеста должна иметь:

- asset ID;
- consumer;
- presentation beat(s);
- visual state(s);
- creature state(s), если применимо;
- layer role;
- required variants;
- animation need;
- source note.

Consumers:

| Consumer | Значение |
| --- | --- |
| `SCR_WORLD` | основная диорама |
| `SCR_EVOLUTION` | дерево/узлы/preview адаптаций |
| `SCR_EVENT` | event choice overlay |
| `SCR_MILESTONE` | milestone payoff |
| `SCR_CRISIS` | кризисный world mode |
| `SCR_ENDING` | Ash/result |
| `SCR_ARCHIVE` | summary/meta memory |

---

# 3. World Diorama Plates

| Asset ID | Consumer | PB | V | C | Layer | Variants | Animation |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `art.world.v0.primordial_plate.base` | `SCR_WORLD` | PB00-PB04 | V0 | C0-C1 | background/base | none | slow particle drift |
| `art.world.v1.cellular_plate.base` | `SCR_WORLD` | PB05-PB09 | V1 | C2-C3 | background/base | none | cellular medium drift |
| `art.world.v2.creature_shallows.base` | `SCR_WORLD` | PB10-PB14 | V2 | C4-C6 | background/base | none | water/vegetation idle |
| `art.world.v3.tribe_terrace.base` | `SCR_WORLD` | PB14-PB15 | V3 | C7 | background/base | trait culture overlays | fire/light idle |
| `art.world.v4.settlement_terrace.base` | `SCR_WORLD` | PB16-PB18 | V4 | C7 | background/base | trait culture overlays | settlement activity |
| `art.world.v5.city_overview.base` | `SCR_WORLD` | PB19-PB21 | V5 | C7 | background/base | trait culture overlays | routes/activity |
| `art.world.v6.industrial_region.base` | `SCR_WORLD` | PB22-PB23 | V6 | C7 | background/base | fossil/clean/early_atomic | machines/logistics |
| `art.world.v7.modern_network.base` | `SCR_WORLD` | PB24-PB25 | V7 | C7 | background/base | fossil/clean/early_atomic | network/light |
| `art.world.v8.atomic_peak.base` | `SCR_WORLD`, `SCR_CRISIS` | PB26-PB28 | V8 | C7 | background/base | fossil/clean/early_atomic | tension overlays |
| `art.world.v9.ash_from_v8.base` | `SCR_ENDING` | PB29 | V9 | none visible | destructive base | fossil/clean/early_atomic | minimal ash drift |

Hard rule:

`art.world.v9.ash_from_v8.base` must be derived from the exact composition family of `art.world.v8.atomic_peak.base`.

---

# 4. Creature Assets

| Asset ID | Consumer | PB | V | C | Layer | Variants | Animation |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `art.creature.c1.protocell.base` | `SCR_WORLD` | PB04 | V0-V1 | C1 | subject | none | membrane forming |
| `art.creature.c2.cell.base` | `SCR_WORLD`, `SCR_EVOLUTION` | PB05-PB08 | V1 | C2 | subject | none | pulse/metabolism |
| `art.creature.c2.cell.absorption.trait` | `SCR_WORLD`, `SCR_EVOLUTION` | PB07-PB08 | V1 | C2A | trait overlay | absorption | intake pulse |
| `art.creature.c2.cell.symbiosis.trait` | `SCR_WORLD`, `SCR_EVOLUTION` | PB07-PB08 | V1 | C2B | trait overlay | symbiosis | paired pulse |
| `art.creature.c2.cell.shell.trait` | `SCR_WORLD`, `SCR_EVOLUTION` | PB07-PB08 | V1 | C2C | trait overlay | shell | resistant pulse |
| `art.creature.c3.colony.base` | `SCR_WORLD`, `SCR_EVOLUTION` | PB09-PB10 | V1 | C3 | subject cluster | trait overlays | coordinated drift |
| `art.creature.c4.organism.base` | `SCR_WORLD`, `SCR_MILESTONE` | PB10 | V2 | C4 | subject | absorption/symbiosis/shell | first body motion |
| `art.creature.c5.adapted.modular_set` | `SCR_WORLD`, `SCR_EVOLUTION` | PB11 | V2 | C5 | adaptation overlays | mobility/sensory/digestion/structural | per adaptation |
| `art.creature.c6.cognitive.behavior_set` | `SCR_WORLD`, `SCR_EVENT` | PB12-PB13 | V2 | C6 | animation set | trait-compatible | attention/social loops |
| `art.creature.c7.sapient.body` | `SCR_WORLD`, `SCR_MILESTONE` | PB14-PB28 | V3-V8 | C7 | subject/group | absorption/symbiosis/shell | idle/work/social |
| `art.creature.c7.sapient.group_five` | `SCR_MILESTONE`, `SCR_WORLD` | PB14-PB15 | V3 | C7 | group composition | trait-compatible | fire/social idle |

Secondary metabolic tags:

| Asset ID | Applies To | Visibility |
| --- | --- | --- |
| `art.creature.shared.tag.photosynthesis` | C2-C7 | pigment panels/surfaces toward light |
| `art.creature.shared.tag.chemosynthesis` | C2-C7 | mineral/dark metallic markings |
| `art.creature.shared.tag.efficient_digestion` | C2-C7 | subtle internal processing rhythm |

---

# 5. Buildings And Landmarks

| Asset ID | Consumer | PB | V | C | Layer | Variants | Animation |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `art.building.v3.common_light.base` | `SCR_WORLD`, `SCR_MILESTONE` | PB14-PB15 | V3 | C7 | landmark | trait-compatible | flame/glow |
| `art.building.v3.temporary_shelter.base` | `SCR_WORLD` | PB15 | V3 | C7 | settlement layer | trait overlays | none/low |
| `art.building.v4.house_cluster.base` | `SCR_WORLD` | PB16-PB18 | V4 | C7 | settlement layer | absorption/symbiosis/shell | low activity |
| `art.building.v4.food_production.base` | `SCR_WORLD` | PB16-PB18 | V4 | C7 | production layer | trait-compatible | farming loop |
| `art.building.v4.storage.base` | `SCR_WORLD` | PB16-PB18 | V4 | C7 | landmark | trait overlays | stock activity |
| `art.building.v4.workshop.base` | `SCR_WORLD` | PB16-PB18 | V4 | C7 | production layer | trait overlays | craft loop |
| `art.prop.v4.traces_before_us.anomaly` | `SCR_EVENT`, `SCR_WORLD` | PB17 | V4 | C7 | event landmark | preserve/dismantle/archive overlays | subtle anomaly |
| `art.building.v5.market_route.base` | `SCR_WORLD` | PB19-PB21 | V5 | C7 | activity layer | trait-compatible | route flow |
| `art.building.v5.civic_center.base` | `SCR_WORLD` | PB19-PB21 | V5 | C7 | landmark | trait overlays | gathering loop |
| `art.building.v5.archive_school.base` | `SCR_WORLD`, `SCR_CHRONICLE` | PB19-PB21 | V5 | C7 | landmark | trait overlays | record activity |
| `art.building.v6.factory.base` | `SCR_WORLD` | PB22-PB23 | V6 | C7 | production layer | fossil/clean/early_atomic | machine loop |
| `art.building.v6.energy_landmark.base` | `SCR_WORLD`, `SCR_EVENT` | PB22-PB23 | V6 | C7 | landmark | fossil/clean/early_atomic | energy activity |
| `art.building.v7.network_tower.base` | `SCR_WORLD` | PB24-PB25 | V7 | C7 | landmark | energy variants | signal loop |
| `art.building.v7.research_campus.base` | `SCR_WORLD` | PB24-PB25 | V7 | C7 | landmark | energy variants | light/activity |
| `art.building.v8.atomic_complex.base` | `SCR_WORLD`, `SCR_CRISIS` | PB26-PB28 | V8 | C7 | landmark | fossil/clean/early_atomic | reactor/tension |
| `art.building.v8.crisis_center.base` | `SCR_CRISIS` | PB27-PB28 | V8 | C7 | crisis overlay | energy variants | alert loop |
| `art.building.v9.atomic_complex.ash` | `SCR_ENDING` | PB29 | V9 | none visible | ash landmark | fossil/clean/early_atomic | minimal smoke |

---

# 6. Props

| Asset ID | Consumer | PB | V | C | Layer | Variants | Animation |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `art.prop.shared.tool_grip_wrap` | `SCR_WORLD`, `SCR_EVENT` | PB15-PB23 | V3-V6 | C7 | prop | trait-compatible | optional |
| `art.prop.shared.tool_pull_surface` | `SCR_WORLD`, `SCR_EVENT` | PB15-PB23 | V3-V6 | C7 | prop | trait-compatible | optional |
| `art.prop.shared.tool_coop_lever` | `SCR_WORLD` | PB18-PB23 | V4-V6 | C7 | prop | trait-compatible | mechanical |
| `art.prop.v5.writing_markers` | `SCR_WORLD`, `SCR_CHRONICLE` | PB19-PB21 | V5 | C7 | prop/symbol | trait motifs | none |
| `art.prop.v6.machine_controls` | `SCR_WORLD` | PB22-PB23 | V6 | C7 | prop | energy variants | button/light |
| `art.prop.v7.modern_control_surface` | `SCR_WORLD` | PB24-PB25 | V7 | C7 | prop | energy variants | screen/light |
| `art.prop.v8.protocol_console` | `SCR_CRISIS` | PB28 | V8 | C7 | event prop | Last Protocol subtypes | alert |
| `art.prop.v9.archive_trace` | `SCR_ARCHIVE`, `SCR_META` | PB30 | V9/meta | none | memory prop | none | subtle pulse |

---

# 7. VFX And Overlays

| Asset ID | Consumer | PB | V | Layer | Variants | Animation |
| --- | --- | --- | --- | --- | --- | --- |
| `art.vfx.v0.rna_stabilize` | `SCR_WORLD` | PB01 | V0 | milestone micro-vfx | none | short |
| `art.vfx.v0.replication_rhythm` | `SCR_WORLD` | PB02 | V0 | process overlay | none | loop |
| `art.vfx.v0.dna_structure` | `SCR_WORLD` | PB03 | V0 | unlock overlay | none | short/idle |
| `art.vfx.v0_membrane_close` | `SCR_WORLD`, `SCR_MILESTONE` | PB04-PB05 | V0-V1 | transition | none | 3-8 sec |
| `art.vfx.v1.metabolism_flow` | `SCR_WORLD` | PB06 | V1 | process overlay | none | loop |
| `art.vfx.v1.colony_coordination` | `SCR_EVOLUTION`, `SCR_WORLD` | PB09 | V1 | coordination overlay | trait variants | loop |
| `art.vfx.v1_to_v2.multicellularity` | `SCR_MILESTONE` | PB10 | V1-V2 | transition | trait variants | 3-8 sec |
| `art.vfx.v2_to_v3.sapience_pullback` | `SCR_MILESTONE` | PB14 | V2-V3 | transition | trait variants | 3-8 sec |
| `art.vfx.v4.persistence_growth` | `SCR_WORLD` | PB16 | V4 | transition overlay | none | short |
| `art.vfx.v5.density_routes` | `SCR_WORLD` | PB19 | V5 | transition overlay | none | loop |
| `art.vfx.v6.machine_age` | `SCR_WORLD` | PB22 | V6 | transition overlay | energy variants | loop |
| `art.vfx.v7.network_reveal` | `SCR_WORLD` | PB24 | V7 | transition overlay | energy variants | loop |
| `art.vfx.v8.atomic_activation` | `SCR_WORLD`, `SCR_CRISIS` | PB26 | V8 | transition overlay | energy variants | short |
| `art.vfx.v8.world_tension_01` | `SCR_CRISIS` | PB27-PB28 | V8 | crisis overlay | energy variants | loop |
| `art.vfx.v8.world_tension_02` | `SCR_CRISIS` | PB27-PB28 | V8 | crisis overlay | energy variants | loop |
| `art.vfx.v8.world_tension_03` | `SCR_CRISIS` | PB27-PB28 | V8 | crisis overlay | energy variants | loop |
| `art.vfx.v8_to_v9.white_flash` | `SCR_ENDING` | PB29 | V8-V9 | rupture | none | short |
| `art.vfx.v9.ash_settle` | `SCR_ENDING` | PB29 | V9 | ash overlay | energy variants | slow |

---

# 8. UI-Adjacent Art Overlays

These are visual overlays, not UI component implementations.

| Asset ID | Consumer | PB | Purpose |
| --- | --- | --- | --- |
| `art.ui_overlay.archive_boot_noise` | `SCR_BOOT` | PB00 | Archive recovery texture |
| `art.ui_overlay.error17_glitch` | `SCR_WORLD` | PB24-PB25 | UI-only anomaly |
| `art.ui_overlay.crisis_warning_frame` | `SCR_CRISIS` | PB27-PB28 | World Tension framing |
| `art.ui_overlay.last_protocol_focus` | `SCR_CRISIS` | PB28 | decision focus |
| `art.ui_overlay.archive_memory_after_ash` | `SCR_ARCHIVE`, `SCR_META` | PB30 | meta memory layer |

Hard rule:

`art.ui_overlay.error17_glitch` must not damage the V7 world plate. It affects UI/presentation only.

---

# 9. Production Priority

## P0 / Needed for coherent vertical slice presentation

- V0-V2 plates;
- C1-C6 creature assets;
- primary trait overlays;
- membrane close;
- metabolism flow;
- C3 coordination;
- multicellularity transition;
- Sapience pullback;
- V3 first group.

## P1 / Needed for full Timeline #1 visual continuity

- V4-V8 plates;
- civilization building sets;
- Energy Crisis variants;
- Modern network set;
- Atomic complex and World Tension overlays;
- Last Protocol focus.

## P2 / Needed for first ending and reset identity

- V9 Ash derived plate;
- ash overlays for V8 landmarks;
- Archive memory overlay;
- `archive_trace` prop.

## P3 / Polish and variant expansion

- additional prop poses;
- optional animation density variants;
- event-specific secondary props;
- additional weather/light variants.

---

# 10. Open Production Decisions

- final runtime file format and compression;
- exact pixel dimensions for mobile/desktop source exports;
- whether animation loops ship as sprite sheets, WebM, Lottie-like vectors or implementation-native canvas layers;
- final directory layout under game runtime assets;
- whether generated concept sheets are stored separately from final cleaned production exports.

These are implementation pipeline choices and do not block DS-08 design acceptance.
