# Хроники Эволюции — структура документации и план генерации недостающих документов

**Версия:** 1.0  
**Назначение:** master-документ для организации `docs/` и последовательной генерации всей продуктовой, игровой, сценарной, визуальной, аудио- и технической документации.  
**Исполнители:** документация, тексты, арт-описания и промпты — ChatGPT; имплементация — Codex.  
**Главная цель:** сделать репозиторий таким, чтобы Codex мог реализовывать игру итерациями, не придумывая продуктовые правила и не разрешая противоречия между документами самостоятельно.

---

# 1. Главный принцип репозитория

Документация является источником требований, код — реализацией этих требований.

Codex не должен:
- самостоятельно придумывать новые механики;
- менять числовой баланс без отдельной задачи;
- «усреднять» противоречащие друг другу документы;
- добавлять новые сюжетные события без спецификации;
- подменять временный placeholder финальным артом или текстом;
- реализовывать поздние системы раньше их итерации.

Любое существенное решение должно иметь один из источников:
1. утверждённый документ в `docs/`;
2. запись в `docs/DECISIONS.md`;
3. отдельная задача пользователя.

---

# 2. Предлагаемая структура `docs/`

```text
docs/
├── README.md
├── PRD.md
├── DECISIONS.md
├── GLOSSARY.md
├── TODO.md
│
├── gdd/
│   ├── 00_GDD_OVERVIEW.md
│   ├── 01_FIRST_120_MINUTES.md
│   ├── 02_ECONOMY_FIRST_120_MINUTES.md
│   ├── 03_EVOLUTION_TREE.md
│   ├── 04_CIVILIZATION_PROGRESSION.md
│   ├── 05_BUILDINGS_AND_JOBS.md
│   ├── 06_TECH_TREE.md
│   ├── 07_GOALS_AND_MILESTONES.md
│   ├── 08_SIDE_QUESTS.md
│   ├── 09_EVENTS_AND_CHOICES.md
│   ├── 10_ENDINGS_AND_RESET.md
│   ├── 11_META_PROGRESSION.md
│   ├── 12_OFFLINE_PROGRESSION.md
│   ├── 13_MONETIZATION_AND_ADS.md
│   └── 14_BALANCE_VALIDATION.md
│
├── scenario/
│   ├── 00_NARRATIVE_BIBLE.md
│   ├── 01_TIMELINE_01.md
│   ├── 02_TIMELINE_02.md
│   ├── 03_ARCHIVE_MYSTERY.md
│   ├── 04_SPACE_AND_BIOSEED.md
│   ├── 05_NARRATIVE_EVENTS.md
│   ├── 06_CHRONICLE_CONTENT.md
│   ├── 07_DIALOGUE_AND_COPY_GUIDE.md
│   └── 08_NARRATIVE_FLAGS.md
│
├── ux/
│   ├── 00_UX_PRINCIPLES.md
│   ├── 01_SCREEN_MAP.md
│   ├── 02_MOBILE_WIREFRAMES.md
│   ├── 03_DESKTOP_WIREFRAMES.md
│   ├── 04_COMPONENT_STATES.md
│   ├── 05_TUTORIAL_AND_HINTS.md
│   └── 06_ACCESSIBILITY.md
│
├── art/
│   ├── 00_ART_DIRECTION.md
│   ├── 01_LOCATIONS_AND_DIORAMAS.md
│   ├── 02_ERA_TRANSITIONS.md
│   ├── 03_BUILDINGS_AND_PROPS.md
│   ├── 04_UI_ICONOGRAPHY.md
│   ├── 05_ASSET_MANIFEST.md
│   └── 06_GENERATION_PROMPTS.md
│
├── audio/
│   ├── 00_AUDIO_DIRECTION.md
│   ├── 01_MUSIC_CUES.md
│   ├── 02_AMBIENCE.md
│   ├── 03_SFX_LIBRARY.md
│   ├── 04_STINGERS_AND_TRANSITIONS.md
│   └── 05_GENERATION_PROMPTS.md
│
├── technical/
│   ├── 00_ARCHITECTURE.md
│   ├── 01_EXISTING_CODE_AUDIT.md
│   ├── 02_DOMAIN_MODEL.md
│   ├── 03_DATA_SCHEMAS.md
│   ├── 04_STATE_MACHINE.md
│   ├── 05_SAVE_AND_MIGRATIONS.md
│   ├── 06_ANALYTICS_SCHEMA.md
│   ├── 07_PLATFORM_INTEGRATION.md
│   ├── 08_PERFORMANCE_BUDGET.md
│   ├── 09_TEST_STRATEGY.md
│   └── 10_RELEASE_CHECKLIST.md
│
└── production/
    ├── 00_ROADMAP.md
    ├── 01_IMPLEMENTATION_ITERATIONS.md
    ├── 02_CONTENT_PIPELINE.md
    ├── 03_ASSET_STATUS.md
    ├── 04_BALANCE_TEST_LOG.md
    └── 05_KNOWN_ISSUES.md
```

Не все документы должны быть созданы сразу. Главное — создавать их в правильной последовательности перед соответствующей итерацией реализации.

---

# 3. Куда перенести существующие документы

Текущие документы являются основой проекта и не должны потеряться.

## 3.1. PRD

Текущий PRD переносится в:

```text
docs/PRD.md
```

При переносе:
- использовать название проекта **«Хроники Эволюции»**;
- сохранить продуктовые принципы, scope и KPI;
- старое рабочее название можно один раз отметить как происхождение проекта, но не использовать как актуальный title.

## 3.2. GDD первых 120 минут

Текущий документ первых двух часов переносится в:

```text
docs/gdd/01_FIRST_120_MINUTES.md
```

Это документ поведения и пользовательского опыта, а не источник точных чисел.

## 3.3. Экономика

Текущая экономика переносится в:

```text
docs/gdd/02_ECONOMY_FIRST_120_MINUTES.md
```

Этот документ является **каноническим источником чисел** для Timeline #1:
- production/sec;
- costs;
- milestone timing;
- jobs;
- building growth;
- crisis timing;
- reset reward.

## 3.4. Дерево эволюции

Текущий документ переносится в:

```text
docs/gdd/03_EVOLUTION_TREE.md
```

Он является каноническим источником:
- node IDs;
- dependencies;
- branch groups;
- costs узлов;
- persistent Archive upgrades.

## 3.5. Сценарный план

Текущий сценарный план переносится в:

```text
docs/scenario/00_NARRATIVE_BIBLE.md
```

Он является каноническим источником:
- общей тайны Архива;
- драматургических актов;
- роли игрока;
- основных раскрытий;
- темпа подачи истории;
- списка больших концовок.

---

# 4. Приоритет документов при конфликте

Codex и агент документации должны использовать следующую иерархию.

## 4.1. Продуктовый уровень

`docs/PRD.md`

Определяет:
- что за игра создаётся;
- для кого;
- что входит в scope;
- продуктовые принципы;
- какие системы сохраняются или переделываются.

## 4.2. Числа

`docs/gdd/02_ECONOMY_FIRST_120_MINUTES.md`

Имеет приоритет для:
- времени milestone;
- цен;
- production;
- экономики;
- численных ограничений.

## 4.3. Узлы progression

`docs/gdd/03_EVOLUTION_TREE.md`

Имеет приоритет для:
- ID технологий и эволюционных узлов;
- prerequisites;
- branch behavior;
- мета-дерева.

## 4.4. Игровой flow и UX

`docs/gdd/01_FIRST_120_MINUTES.md`

Имеет приоритет для:
- порядка экранов;
- целей игрока;
- визуальных milestone;
- tutorial flow;
- screen behavior.

Если timing из этого документа расходится с экономикой, побеждает экономика.

## 4.5. Сюжет

`docs/scenario/*`

Имеет приоритет для:
- сюжетного смысла события;
- формулировок;
- последовательности раскрытий;
- flags;
- endings.

## 4.6. Последнее слово

`docs/DECISIONS.md`

Каждое решение, отменяющее или уточняющее существующий документ, записывается сюда.

---

# 5. Первые обязательные документы верхнего уровня

## `docs/README.md`

Короткая карта документации.

Должен содержать:
- название проекта;
- текущее состояние разработки;
- ссылку на PRD;
- ссылки на основные GDD;
- ссылки на сценарий;
- ссылки на арт/аудио;
- ссылки на technical docs;
- правила source of truth;
- описание статусов документов: `draft`, `approved`, `implemented`, `deprecated`.

## `docs/DECISIONS.md`

Формат записи:

```text
## DEC-XXXX — Название
Date:
Status: proposed | accepted | superseded
Affected docs:
Decision:
Reason:
Implementation impact:
```

Первые решения, которые необходимо зафиксировать:

1. числовая экономика имеет приоритет над ранними примерными timing из GDD;
2. каноническая ранняя экономика использует `Energy / Information / Biomass`, а `RNA / DNA` остаются narrative/visual concepts либо должны получить отдельное точное mapping-решение;
3. `Sapience` первого run целится примерно в 46 минут;
4. `Atomic Age` — около 108 минут;
5. `Ash` — около 116 минут;
6. reset — около 120 минут;
7. Timeline #1 не позволяет избежать `Ash`;
8. все balance-константы должны храниться в конфигурации, а не быть захардкожены в UI.

## `docs/GLOSSARY.md`

Нужен единый словарь терминов:
- Timeline;
- Run;
- Archive;
- Archive Fragments;
- Memory;
- Information;
- Biomass;
- Knowledge;
- Stability;
- Era;
- Milestone;
- Chapter;
- Goal;
- Side Quest;
- Story Quest;
- Ending;
- Reset;
- Branch;
- Trait;
- Diorama State.

## `docs/TODO.md`

Это живой backlog документации и реализации. Он не заменяет detailed implementation plan.

Рекомендуемые статусы:

```text
[ ] planned
[~] in progress
[x] done
[!] blocked
[-] dropped
```

---

# 6. Недостающие GDD-документы

Ниже — документы, которые агент должен создать на основе уже существующих материалов.

---

## 6.1. `docs/gdd/04_CIVILIZATION_PROGRESSION.md`

### Цель
Полностью описать progression от `Sapience` до `Atomic Age`.

### Содержимое
- Tribe;
- Settlement;
- City;
- Industry;
- Atomic;
- правила открытия эпох;
- какой gameplay loop меняется в каждой фазе;
- какие UI-разделы появляются;
- какие ресурсы входят и выходят;
- связь с сюжетными событиями;
- связь с диорамой;
- таблица milestone → unlock → visual payoff.

### Источники
- PRD;
- first 120 minutes GDD;
- economy;
- evolution tree;
- narrative bible.

---

## 6.2. `docs/gdd/05_BUILDINGS_AND_JOBS.md`

### Цель
Сделать одну canonical table всех зданий и профессий первого run.

### Для каждого building
- ID;
- era;
- name;
- unlock condition;
- base cost;
- growth;
- output;
- modifiers;
- visual representation;
- max recommended count;
- dependencies;
- UI category.

### Для каждого job
- ID;
- era;
- output/pop;
- availability;
- cap;
- influence on other systems;
- recommended default allocation;
- auto-assign priority.

---

## 6.3. `docs/gdd/06_TECH_TREE.md`

### Цель
Отделить культурно-технологическое дерево цивилизации от биологического evolution tree.

### Нужно описать
- Fire;
- Agriculture;
- Writing;
- Mechanization;
- Steam;
- Electricity;
- Scientific Method;
- Atomic Theory;
- Atomic Age;
- optional upgrades;
- future hooks к космосу.

Для каждого узла нужны стабильные IDs.

---

## 6.4. `docs/gdd/07_GOALS_AND_MILESTONES.md`

### Цель
Сделать data-driven каталог целей.

Для каждой цели:
- `goal_id`;
- display title;
- description;
- era;
- prerequisites;
- completion condition;
- reward;
- next goal;
- hint rules;
- telemetry checkpoint;
- expected target time;
- hard/soft lock.

Первая версия должна полностью покрывать 24 balance targets первого run.

---

## 6.5. `docs/gdd/08_SIDE_QUESTS.md`

### Цель
Описать tutorial side quests и правила будущего генератора.

Нужны:
- fixed quests Timeline #1;
- reward tables;
- category tags;
- prerequisites;
- expiration rules;
- concurrency limit;
- optional future templates.

Важно: в первом run quests должны быть curated, а не procedural.

---

## 6.6. `docs/gdd/09_EVENTS_AND_CHOICES.md`

### Цель
Объединить механические последствия narrative choices.

Для каждого события:
- ID;
- trigger;
- blocking/non-blocking;
- available choices;
- preview text;
- immediate effects;
- path score changes;
- narrative flags;
- visual changes;
- later consequences;
- Chronicle entry.

Минимум для Timeline #1:
- первая адаптация;
- social choice;
- `Следы до нас`;
- government-lite choice;
- energy crisis;
- `Ошибка 17`;
- global crisis event 1;
- false alarm;
- final protocol.

---

## 6.7. `docs/gdd/10_ENDINGS_AND_RESET.md`

### Цель
Сделать reset системной сущностью.

Нужно описать:
- `Ash` Timeline #1;
- future endings;
- ending data schema;
- reward calculation;
- Chronicle data;
- preserved state;
- reset state;
- cinematic sequencing;
- second timeline bootstrap.

---

## 6.8. `docs/gdd/11_META_PROGRESSION.md`

### Цель
Определить Archive progression после первого reset.

Нужно описать:
- Archive Fragments;
- unlock tree;
- preserved traits;
- accelerated replay;
- branch mixing;
- Timeline #2 differences;
- rules that prevent early phase from becoming irrelevant.

---

## 6.9. `docs/gdd/12_OFFLINE_PROGRESSION.md`

Должен формализовать:
- first-run offline cap;
- post-reset improvements;
- return summary;
- research completion;
- population growth cap;
- crisis freeze;
- rewarded multiplier;
- anti-skip rules.

---

## 6.10. `docs/gdd/13_MONETIZATION_AND_ADS.md`

Требуется до интеграции SDK.

Нужно описать:
- rewarded placements;
- interstitial placements;
- cooldowns;
- prohibited moments;
- first 15 minutes rule;
- interaction with offline reward;
- skip conditions;
- telemetry.

---

## 6.11. `docs/gdd/14_BALANCE_VALIDATION.md`

### Цель
Сделать баланс проверяемым.

Нужно определить:
- simulation model;
- representative player profiles;
- expected milestone windows;
- telemetry comparison;
- acceptable variance;
- parameters allowed to tune;
- parameters to avoid changing casually;
- checklist before every balance release.

---

# 7. Недостающая сценарная документация

---

## 7.1. `docs/scenario/01_TIMELINE_01.md`

Это **полный сценарный пакет первых 120 минут**.

Должен содержать:
- пролог;
- все системные строки Архива;
- milestone copy;
- события;
- choices;
- `Ash` sequence;
- ending;
- reset screen;
- CTA Timeline #2.

Формат каждого блока:

```text
ID:
Trigger:
Screen/context:
Short text:
Choice text:
Archive line:
Chronicle extended text:
Flags written:
Next narrative hook:
```

---

## 7.2. `docs/scenario/02_TIMELINE_02.md`

Первая версия не требует полного второго run.

Нужно описать:
- изменённый старт;
- `Архив помнит`;
- сохранённую адаптацию;
- невозможный artifact из Timeline #1;
- первые отличия;
- первый path, позволяющий двигаться к космосу.

---

## 7.3. `docs/scenario/03_ARCHIVE_MYSTERY.md`

Нужно вынести mystery progression из Narrative Bible в отдельную revelation map.

Таблица:

```text
Reveal ID | Earliest timeline | Trigger | What player learns | What remains hidden | Future payoff
```

Это защитит сюжет от слишком раннего раскрытия.

---

## 7.4. `docs/scenario/04_SPACE_AND_BIOSEED.md`

Нужен до разработки post-120-minute контента.

Пока можно создать только outline.

---

## 7.5. `docs/scenario/05_NARRATIVE_EVENTS.md`

Каталог всех событий с текстами.

---

## 7.6. `docs/scenario/06_CHRONICLE_CONTENT.md`

Описывает:
- Timeline cards;
- milestone records;
- ending cards;
- species cards;
- Archive fragments;
- extended lore.

---

## 7.7. `docs/scenario/07_DIALOGUE_AND_COPY_GUIDE.md`

Нужен для консистентного текста.

Должен определить:
- тон Архива;
- длину строк;
- typography rules;
- терминологию;
- capitalisation;
- русский оригинал;
- будущую локализацию;
- запрещённые стилистические конструкции.

---

## 7.8. `docs/scenario/08_NARRATIVE_FLAGS.md`

Очень важный технический документ.

Для каждого flag:
- ID;
- type;
- when set;
- reset behavior;
- permanent/temporary;
- consumers;
- effect on events/endings;
- analytics visibility.

---

# 8. Документация UX

До серьёзной верстки должны быть созданы как минимум:

## `docs/ux/01_SCREEN_MAP.md`

Содержит все экраны и переходы.

Минимум:
- boot;
- primordial;
- evolution;
- civilization;
- building sheet;
- science;
- event modal;
- era transition;
- crisis;
- ending;
- reset summary;
- Archive tree;
- Chronicle.

## `docs/ux/02_MOBILE_WIREFRAMES.md`

Приоритетный документ.

Для каждого экрана:
- portrait layout;
- information hierarchy;
- sticky areas;
- bottom nav behavior;
- bottom sheet behavior;
- touch targets;
- loading/locked/empty states.

## `docs/ux/03_DESKTOP_WIREFRAMES.md`

Desktop не должен быть просто растянутым mobile UI.

## `docs/ux/04_COMPONENT_STATES.md`

Обязательные состояния:
- locked;
- unavailable;
- affordable;
- active;
- completed;
- warning;
- crisis;
- boosted;
- disabled.

---

# 9. Графический дизайн

Пользователю нужен отдельный пакет документации для генерации артов. Главный документ:

```text
docs/art/00_ART_DIRECTION.md
```

Но для производства лучше разбить его на несколько файлов.

---

## 9.1. `docs/art/00_ART_DIRECTION.md`

Должен определить единый визуальный язык **«Хроник Эволюции»**.

### Обязательные разделы
- artistic premise;
- mood;
- level of realism;
- camera model;
- diorama perspective;
- scale transitions;
- palette principles;
- lighting principles;
- texture language;
- UI vs world art distinction;
- evolution of visual complexity by era;
- mobile readability;
- no-go list.

### Ключевой принцип
Каждая эпоха должна визуально отличаться с первого взгляда, но оставаться частью одной игры.

---

## 9.2. `docs/art/01_LOCATIONS_AND_DIORAMAS.md`

Это основной production-файл локаций.

Для каждого состояния мира:

```text
Location ID:
Era:
Gameplay window:
Narrative mood:
Camera:
Composition:
Background:
Midground:
Foreground:
Landmarks:
Animated elements:
Environmental overlays:
Variants:
Transitions from previous state:
Required assets:
Generation prompt:
Negative prompt:
Post-processing notes:
```

### Минимальные состояния первого vertical slice

1. `V0_PRIMORDIAL`
2. `V1_CELLULAR`
3. `V2_CREATURE`
4. `V3_TRIBE`
5. `V4_SETTLEMENT`
6. `V5_CITY`
7. `V6_INDUSTRIAL`
8. `V7_ATOMIC`
9. `V8_ASH`

Дополнительно:
- Reason milestone;
- Settlement milestone;
- Industrial milestone;
- Atomic milestone;
- Ash ending illustration;
- Archive/reset scene.

---

## 9.3. `docs/art/06_GENERATION_PROMPTS.md`

В этом файле должны храниться не только готовые промпты, но и **prompt grammar**, чтобы новые ассеты генерировались в одном стиле.

### Базовая структура prompt

```text
[project visual identity],
[era],
[location / subject],
[camera and composition],
[lighting],
[materials and architecture],
[population/activity],
[atmosphere],
[color direction],
[required readable landmarks],
[game asset constraints],
[negative constraints]
```

### Пример: первичный океан

```text
Хроники Эволюции, cinematic stylized scientific diorama of a primordial ocean,
macro-scale shallow alien sea before complex life, dark mineral water,
floating organic molecules and tiny luminous proto-structures,
slightly elevated isometric camera, strong readable central focal area for gameplay,
deep blue-black water with restrained cyan bioluminescent accents,
soft volumetric light from above, subtle suspended particles,
scientific wonder, calm and mysterious rather than horror,
clean composition, large readable forms, suitable for mobile game background,
no text, no UI, no humanoids, no modern objects, no excessive micro-detail,
no photorealistic documentary look, no fantasy magic symbols
```

### Пример: индустриальная эпоха

```text
Хроники Эволюции, stylized evolving civilization diorama, industrial era city,
layered dense city with factories, rail lines, power infrastructure and workshops,
same persistent terrain identity as previous settlement stage,
isometric 2.5D game camera, clearly separated gameplay landmarks,
warm furnace light against cool atmospheric haze,
controlled smoke columns, moving train, visible electrification beginning,
ambitious technological mood with first signs of environmental cost,
large forms readable on mobile, modular layered composition,
no text, no UI, no cyberpunk neon, no steampunk ornament overload,
no modern skyscraper skyline yet
```

### Пример: Пепел

```text
Хроники Эволюции, aftermath diorama of the same atomic-era civilization after collapse,
recognizable skyline now damaged and silent, ash falling through cold air,
small isolated fires, abandoned infrastructure, no active population,
wide cinematic game composition preserving the same camera and terrain,
pale grey sky, desaturated environment, faint warm embers,
tragic stillness, readable silhouettes, emotional but not graphic,
mobile-friendly large shapes, no bodies, no gore, no text, no UI
```

---

# 10. Звуковое сопровождение

Основной пакет:

```text
docs/audio/
```

Задача — не просто перечислить звуки, а построить систему эволюции аудио вместе с миром.

---

## 10.1. `docs/audio/00_AUDIO_DIRECTION.md`

Должен определить:
- sonic identity;
- dynamic music rules;
- ambience layering;
- transitions between eras;
- how Archive voice/UI sounds;
- loudness priorities;
- mobile speaker considerations;
- loop length targets;
- prohibited sonic clichés.

Главный принцип:

> Музыка и ambient должны становиться сложнее вместе с жизнью и цивилизацией.

---

## 10.2. `docs/audio/01_MUSIC_CUES.md`

Для каждой эпохи:

```text
Cue ID:
Era:
Narrative function:
Duration target:
Loopable: yes/no
Tempo:
Harmony:
Instrumentation:
Texture:
Intensity range:
Layers:
Transition in:
Transition out:
Generation prompt:
Negative prompt:
```

### Обязательные cues первого run

1. `MUS_PRIMORDIAL`
2. `MUS_CELLULAR`
3. `MUS_MULTICELLULAR`
4. `MUS_SAPIENCE`
5. `MUS_TRIBE`
6. `MUS_SETTLEMENT`
7. `MUS_CITY`
8. `MUS_INDUSTRIAL`
9. `MUS_ATOMIC`
10. `MUS_CRISIS`
11. `MUS_ASH`
12. `MUS_ARCHIVE_RESET`

---

## 10.3. Music prompt examples

### Primordial

```text
Loopable ambient game soundtrack for the primordial-life era of Хроники Эволюции.
Slow, sparse and scientific rather than mystical. Deep soft drones, glassy resonances,
subtle watery textures, isolated organic pulses that suggest chemistry slowly becoming life.
No melody at first, only a tiny two-note motif emerging near the end of the loop.
60–70 BPM perceived pulse, very low intensity, seamless 2–3 minute loop,
large dynamic headroom for UI sounds.
Avoid epic orchestra, horror tension, fantasy choir, obvious synthwave and cinematic trailer drums.
```

### Tribe

```text
Loopable game soundtrack for the first tribal civilization in Хроники Эволюции.
Warm, curious and hopeful. Light hand percussion, wooden and skin textures,
soft breathy flutes and simple repeating melodic fragments, restrained and non-ethnographically specific.
The music should feel like social coordination and the first shared culture,
not like a generic historical documentary. 80–92 BPM, 2–3 minute seamless loop,
leave space for campfire ambience and UI feedback.
Avoid stereotypical tribal chanting, aggressive war drums, Hollywood ethnic clichés and vocals.
```

### Industrial

```text
Loopable adaptive strategy-game music for the industrial era of Хроники Эволюции.
Mechanical rhythmic pulse built from muted metallic percussion and low strings/synth textures,
steady forward motion, optimistic technological momentum with a subtle uneasy undertone.
Layerable arrangement: base rhythm, harmonic layer, tension layer.
96–108 BPM, seamless loop, no dominant lead melody, suitable for long play sessions.
Avoid steampunk carnival sound, EDM drops, heroic trailer brass and overly dark dystopian tone.
```

### Atomic / crisis transition

```text
Adaptive game music for the atomic threshold in Хроники Эволюции.
Begin with precise, confident scientific minimalism and gradually introduce unstable intervals,
distant low pulses and thinning harmonic support. The cue must be able to crossfade into crisis music
without a hard restart. Controlled tension, not horror. No sirens in the music layer.
90–100 BPM perceived pulse, modular stems, restrained percussion.
Avoid jump scares, action-movie drums, bombastic orchestra and obvious nuclear-era pastiche.
```

### Ash

```text
Short non-looping ending cue for Хроники Эволюции after the first civilization collapses.
Start almost from silence. A distant low resonance, one fragile version of the game's main motif,
then decay into empty air and ash ambience. 25–40 seconds, emotionally restrained,
melancholic and reflective rather than melodramatic.
Avoid choir, heroic sadness, loud impacts and cinematic trailer climax.
```

---

## 10.4. `docs/audio/02_AMBIENCE.md`

Для каждой локации определить loop layers.

Примеры:

### Primordial
- underwater low rumble;
- bubbles;
- suspended particle shimmer;
- faint fluid movement.

### Tribe
- fire;
- distant voices without intelligible speech;
- insects/wind;
- tool impacts.

### City
- crowd wash;
- carts;
- workshop rhythm;
- bells/market texture.

### Industrial
- distant machinery;
- rail pass;
- steam;
- electrical hum;
- city density.

### Atomic
- cleaner electrical city bed;
- traffic/industry;
- laboratory tone;
- subtle warning texture after crisis begins.

### Ash
- wind;
- ash fall;
- isolated crackle;
- distant structural creaks;
- almost no human activity.

---

## 10.5. `docs/audio/03_SFX_LIBRARY.md`

Каталог SFX должен включать ID.

Минимальные группы:
- UI tap;
- confirm;
- invalid;
- purchase;
- resource milestone;
- technology unlock;
- branch selected;
- era transition;
- objective complete;
- side quest complete;
- Archive message;
- warning;
- crisis escalation;
- reset confirmation.

Пример prompt:

```text
Short clean game UI sound for a technology unlock in Хроники Эволюции:
soft scientific chime with a subtle rising harmonic shimmer and one precise low confirmation tone,
0.7–1.1 seconds, clear on mobile speakers, satisfying but not flashy,
no speech, no reverb tail longer than 0.4 seconds, no arcade coin sound, no fantasy magic sparkle.
```

---

# 11. Technical docs, которые нужны до активного кодинга

## 11.1. `docs/technical/01_EXISTING_CODE_AUDIT.md`

Codex должен сначала исследовать исходный проект и описать:
- framework/build system;
- game loop;
- data locations;
- resource calculations;
- save system;
- UI architecture;
- state management;
- platform APIs;
- reusable systems;
- code to isolate;
- code that should not be modified initially.

Никакой большой переписки архитектуры до этого аудита.

## 11.2. `docs/technical/00_ARCHITECTURE.md`

После audit.

Целевая схема:

```text
Legacy/Existing Simulation
        ↓
Domain Adapter / Normalized State
        ↓
Game State + Milestone Engine
        ↓
Goals / Story / Visual State / Analytics
        ↓
New UI
```

Не обязательно физически использовать именно эти классы, но ответственность должна быть разделена именно так.

## 11.3. `docs/technical/03_DATA_SCHEMAS.md`

Обязательные schemas:
- resources;
- generators;
- buildings;
- jobs;
- tech nodes;
- evolution nodes;
- goals;
- quests;
- events;
- endings;
- narrative flags;
- diorama states;
- audio cues;
- analytics events.

## 11.4. `docs/technical/04_STATE_MACHINE.md`

Нужны state machines:
- era progression;
- goal progression;
- crisis;
- ending/reset;
- Timeline lifecycle;
- Archive/meta unlock lifecycle.

## 11.5. `docs/technical/05_SAVE_AND_MIGRATIONS.md`

Нужно до реализации reset.

---

# 12. Порядок генерации документов

Агент не должен пытаться написать все документы сразу.

## Пакет A — нормализация требований

Создать:
1. `docs/README.md`
2. `docs/DECISIONS.md`
3. `docs/GLOSSARY.md`
4. `docs/TODO.md`
5. перенести и переименовать существующие документы.

После этого проверить противоречия.

## Пакет B — gameplay contract первого run

Создать:
1. `04_CIVILIZATION_PROGRESSION.md`
2. `05_BUILDINGS_AND_JOBS.md`
3. `06_TECH_TREE.md`
4. `07_GOALS_AND_MILESTONES.md`
5. `09_EVENTS_AND_CHOICES.md`
6. `10_ENDINGS_AND_RESET.md`

Это минимальный пакет до полноценной реализации vertical slice.

## Пакет C — scenario first run

Создать:
1. `scenario/01_TIMELINE_01.md`
2. `scenario/07_DIALOGUE_AND_COPY_GUIDE.md`
3. `scenario/08_NARRATIVE_FLAGS.md`

## Пакет D — UX

Создать:
1. screen map;
2. mobile wireframes;
3. component states;
4. tutorial/hints.

## Пакет E — art/audio

Создать:
1. art direction;
2. locations/dioramas;
3. asset manifest;
4. generation prompts;
5. audio direction;
6. music cues;
7. ambience;
8. SFX;
9. audio prompts.

## Пакет F — technical contract

Codex делает code audit, затем на его основе формируются:
1. architecture;
2. domain model;
3. schemas;
4. state machines;
5. save/migrations;
6. analytics schema;
7. test strategy.

---

# 13. Правило готовности документа

Документ получает статус `approved`, только если:

- у всех систем есть стабильные IDs;
- нет ссылок на несуществующие сущности;
- нет конфликтов с higher-priority docs;
- указаны dependencies;
- указаны входы и выходы системы;
- для числовых систем есть единицы измерения;
- для events определены flags;
- для визуальных объектов определён asset ID;
- для audio определён cue/SFX ID;
- для UI определены states;
- понятно, что должен реализовать Codex;
- понятно, как проверить готовность.

---

# 14. Правило генерации новых документов агентом

Для каждого документа агент выполняет процедуру:

1. прочитать все документы из раздела `Dependencies`;
2. выписать существующие сущности и IDs;
3. найти противоречия;
4. не исправлять их молча;
5. если можно разрешить по source-of-truth hierarchy — разрешить и записать в документ;
6. если нельзя — добавить запись `DECISION REQUIRED`;
7. создать документ;
8. в конце добавить раздел `Implementation Contract`;
9. перечислить data entities, которые должен реализовать Codex;
10. добавить acceptance checklist;
11. обновить `docs/README.md`;
12. обновить `docs/TODO.md`.

---

# 15. Implementation Contract в каждом документе

В конце каждого GDD/UX/scenario документа должен быть блок:

```text
## Implementation Contract

### Required data
...

### Required state
...

### Required events
...

### Required UI
...

### Required assets
...

### Analytics
...

### Save impact
...

### Acceptance criteria
- [ ] ...
- [ ] ...
```

Это превращает дизайн-документ в прямой вход для Codex.

---

# 16. Что не генерировать заранее

Пока vertical slice первых 120 минут не работает, не тратить много времени на:
- полный interstellar GDD;
- глубокие universe mechanics;
- десятки будущих species;
- сложный challenge system;
- полную религию;
- полную торговую биржу;
- late-game warfare;
- десятки endings;
- финальный набор daily systems.

Для них достаточно outline/hook.

---

# 17. Definition of Ready для начала имплементации vertical slice

Codex может переходить к активной реализации первого run, когда готовы:

- [ ] PRD;
- [ ] first 120 minutes GDD;
- [ ] economy first 120 minutes;
- [ ] evolution tree;
- [ ] civilization progression;
- [ ] buildings/jobs;
- [ ] civilization tech tree;
- [ ] goals/milestones;
- [ ] Timeline #1 scenario;
- [ ] events/choices;
- [ ] endings/reset;
- [ ] narrative flags;
- [ ] screen map;
- [ ] mobile wireframes core screens;
- [ ] art direction;
- [ ] first-run asset manifest;
- [ ] audio direction;
- [ ] code audit;
- [ ] target architecture;
- [ ] save schema;
- [ ] analytics schema.

Не обязательно ждать финальных картинок и музыки: до asset integration допускаются placeholders с финальными asset IDs.

---

# 18. Главный результат этой структуры

После организации документации pipeline должен выглядеть так:

```text
Идея / решение пользователя
        ↓
ChatGPT обновляет design/scenario/art/audio docs
        ↓
DECISIONS.md фиксирует изменения требований
        ↓
Codex читает конкретный пакет документов
        ↓
Codex реализует одну ограниченную итерацию
        ↓
Tests + playable build
        ↓
Проверка против acceptance criteria
        ↓
Telemetry / ручной playtest
        ↓
ChatGPT корректирует документы
        ↓
Следующая итерация
```

Главный принцип: **Codex не проектирует игру. Он реализует утверждённую спецификацию. ChatGPT не вносит скрытые изменения в код. Документы связывают дизайн и реализацию.**
