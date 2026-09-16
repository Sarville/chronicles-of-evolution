# Art documentation

Арт-документы проекта **Хроники Эволюции** создаются после стабилизации gameplay, сценарных milestones и UX flow.

Перед DS-07 создан bridge-contract **DS-05.5**:

- `00_VISUAL_STATE_MAP.md` — semantic visual states мира `V0–V9`, creature continuity `C0–C7`, branch inheritance и обязательные visual transitions.

Основные design sessions:
- **DS-07** — art direction, creature evolution, locations/dioramas, era transitions;
- **DS-08** — buildings/props, asset manifest, generation prompts.

## Planned files

- `00_ART_DIRECTION.md`
- `01_LOCATIONS_AND_DIORAMAS.md`
- `02_ERA_TRANSITIONS.md`
- `03_CREATURE_EVOLUTION.md`
- `04_BUILDINGS_AND_PROPS.md`
- `05_ASSET_MANIFEST.md`
- `06_GENERATION_PROMPTS.md`

## First Timeline world visual states

- V0 Primordial
- V1 Cellular
- V2 Creature
- V3 Sapient Tribe
- V4 Settlement
- V5 City
- V6 Industrial
- V7 Modern
- V8 Atomic
- V9 Ash

## Creature continuity states

- C0 Proto-chemistry
- C1 Protocell
- C2 Cell
- C2A/B/C Primary Trait variants
- C3 Coordinated Colony / pre-multicellular
- C4 Multicellular Organism
- C5 Adapted Organism
- C6 Cognitive Organism
- C7 Sapient Species

G008/AP may introduce `C3` and previews будущего body plan, но полноценный переход `V1 Cellular → V2 Creature` принадлежит только G009/MS02 Multicellularity.

Primary trait and major visible adaptations must remain recognizable through later stages unless a future explicit meta system changes them.

## Production rule

`docs/art/` описывает **что должно существовать и как выглядеть**.

`00_VISUAL_STATE_MAP.md` задаёт required meaning/readability. DS-07 решает художественное исполнение, но не должен убирать обязательные visual states или пропускать Modern.

Финальные изображения не должны определять механику. Каждый production asset после DS-08 получает стабильный asset ID, формат, размеры, слой/назначение и consumer.

Главный мир строится как layered diorama:
- background;
- terrain;
- settlement layer;
- landmarks;
- production overlays;
- moving props;
- environment;
- VFX.

Не начинать массовую генерацию финальных ассетов до принятия `05_ASSET_MANIFEST.md`; допустимы только mood/concept tests.

Фактический статус раздела смотреть в `../PROJECT_STATE.yaml`.
