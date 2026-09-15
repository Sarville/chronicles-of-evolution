# Audio documentation

Audio-пакет проекта **Хроники Эволюции** проектируется в design session **DS-09** после принятия Timeline #1 narrative package и базового art direction.

## Planned files

- `00_AUDIO_DIRECTION.md`
- `01_MUSIC_CUES.md`
- `02_AMBIENCE.md`
- `03_SFX_LIBRARY.md`
- `04_STINGERS.md`
- `05_GENERATION_PROMPTS.md`

## Minimum first-Timeline coverage

### Music
- primordial;
- cellular/organism;
- tribe;
- settlement;
- city;
- industrial;
- atomic tension;
- crisis;
- Ash aftermath.

### Ambience
- primordial ocean/micro world;
- nature/creature;
- campfire/tribe;
- settlement/city;
- industrial machinery;
- atomic facility/tension;
- Ash wind/ruins.

### SFX
- resource feedback;
- buy/build/upgrade;
- tech/evolution unlock;
- branch select;
- warning/error;
- event choice;
- crisis escalation;
- reset/archive confirmation;
- UI navigation.

### Stingers
- Proto-cell;
- Multicellularity;
- Sapience;
- City;
- Industry;
- Atomic Age;
- Ash;
- Archive/reset.

## Production rule

Каждый финальный cue/SFX получает стабильный audio ID, purpose, duration/loop rule, intensity and transition rules.

Не генерировать полный production audio pack до принятия cue map и prompt guide. До этого допустимы только style tests.

Музыка меняется по эпохам плавно и не перезапускается из-за обычных UI transitions.

Фактический статус раздела смотреть в `../PROJECT_STATE.yaml`.
