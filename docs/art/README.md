# Art documentation

Арт-документы проекта **Хроники Эволюции** создаются после стабилизации gameplay, сценарных milestones и UX flow.

Основные design sessions:
- **DS-07** — art direction, locations/dioramas, era transitions;
- **DS-08** — buildings/props, asset manifest, generation prompts.

## Planned files

- `00_ART_DIRECTION.md`
- `01_LOCATIONS_AND_DIORAMAS.md`
- `02_ERA_TRANSITIONS.md`
- `03_BUILDINGS_AND_PROPS.md`
- `04_ASSET_MANIFEST.md`
- `05_GENERATION_PROMPTS.md`

## First Timeline visual states

- V0 Primordial
- V1 Cellular
- V2 Creature
- V3 Tribe
- V4 Settlement
- V5 City
- V6 Industrial
- V7 Atomic
- V8 Ash

## Production rule

`docs/art/` описывает **что должно существовать и как выглядеть**.

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

Не начинать массовую генерацию финальных ассетов до принятия `04_ASSET_MANIFEST.md`; допустимы только mood/concept tests.

Фактический статус раздела смотреть в `../PROJECT_STATE.yaml`.
