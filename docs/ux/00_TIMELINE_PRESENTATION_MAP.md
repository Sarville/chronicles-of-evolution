# Хроники Эволюции — Timeline #1 Presentation Map

**Документ:** DS-05.5  
**Статус:** ready for review  
**Область:** Timeline #1, ~0–120 минут  
**Назначение:** единый мост между gameplay, сценарием, UX и визуальными состояниями.  
**Gameplay authority:** `docs/gdd/01_FIRST_120_MINUTES.md`, `07_GOALS_AND_MILESTONES.md`, `08_EVENTS_AND_CHOICES.md`, `09_ENDINGS_AND_RESET.md`  
**Narrative authority:** `docs/scenario/01_TIMELINE_01_SCRIPT.md`, `04_STORY_EVENTS.md`, `06_ENDINGS_COPY.md`  
**Visual-state authority for this contract:** `docs/art/00_VISUAL_STATE_MAP.md`

---

# 1. Что фиксирует этот документ

Этот файл отвечает на вопрос:

> Когда происходит gameplay/narrative beat, что именно в этот момент видит игрок?

Он фиксирует:

- активный UX surface;
- состояние диорамы;
- состояние существа/цивилизации;
- какие UI-слои видимы;
- когда UI должен уступить место визуальному payoff;
- переход между масштабами мира;
- какие изменения обязательны, а какие зависят от выбора игрока;
- placeholder-намерение для звука, без production audio asset IDs.

Он **не** задаёт:

- точные layout/размеры компонентов — DS-06;
- художественный стиль, палитру, материалы — DS-07;
- asset IDs/formats/prompts — DS-08;
- финальные SFX/music IDs — DS-09.

---

# 2. Семантические UX surfaces

Имена ниже — presentation IDs, не обязательные route/component names реализации.

| ID | Surface | Назначение |
|---|---|---|
| `SCR_BOOT` | Boot / Archive recovery | пролог, восстановление Архива, минимальный UI |
| `SCR_WORLD` | Main World | основная диорама + контекстные ресурсы + Current Goal |
| `SCR_EVOLUTION` | Evolution | эволюционные узлы, ветви, AP/adaptations |
| `SCR_EVENT` | Event Choice | короткое обязательное/необязательное решение поверх мира |
| `SCR_MILESTONE` | Milestone Overlay | эмоциональный payoff; фон мира остаётся читаемым |
| `SCR_CHRONICLE` | Chronicle | расширенный текст истории, не блокирует core flow без причины |
| `SCR_CRISIS` | Crisis World | World в кризисном режиме + World Tension + crisis events |
| `SCR_ENDING` | Ending / Ash | cinematic/result surface с минимумом обычного UI |
| `SCR_ARCHIVE` | Archive Summary | итог Timeline, награды, сохранённые решения |
| `SCR_META` | Archive Memory / next run | meta-переход и teaser Timeline #2 |

Hard rule: `SCR_WORLD` остаётся базовой поверхностью игры. Остальные surfaces должны ощущаться как временные режимы/слои, а не как набор несвязанных экранов.

---

# 3. Правила режиссуры

1. **Диорама — главный visual surface.** Большой milestone не должен превращать игру в стену текста.
2. **Один главный визуальный payoff за beat.** Текст, UI и VFX не конкурируют одновременно.
3. **Масштаб камеры растёт вместе с эволюцией:** molecule → cell → organism → group → settlement → city → region/world.
4. **UI раскрывается только когда соответствующая система становится gameplay-relevant.**
5. **Новые ресурсы появляются контекстно.** Power не показывается до Industry; AP — только с G008; Cognition — только после Nervous System; World Tension — только после Atomic transition.
6. **Narrative anomalies ломают привычный интерфейс минимально.** ERROR 17 должен выглядеть как нарушение обычной системы, а не как отдельный cinematic.
7. **Кризис сжимает язык и UI.** Чем выше World Tension, тем меньше декоративных/вторичных элементов.
8. **Ash разрывает предыдущий темп.** Вспышка → тишина → почти неподвижный мир → result.
9. **Reset — продолжение истории, не fail screen.** Переход идёт Ash → Archive Summary → Archive Memory → Timeline #2.

---

# 4. Главная карта 0–120 минут

## PB00 — Boot / 0:00

**Trigger:** новый Timeline #1.  
**Gameplay:** до G001.  
**Narrative:** восстановление Архива.  
**Surface:** `SCR_BOOT` → `SCR_WORLD`.  
**Visual state:** чёрный экран → `V0_PRIMORDIAL`.  
**Creature state:** `C0_NONE/PROTO_CHEMISTRY`.  
**UI:** только системные строки; затем Current Goal `Создайте устойчивую РНК`.  
**Transition:** точка света → строки Архива → первичный океан.  
**Audio intent:** почти тишина, слабый системный/ambient onset.

## PB01 — Stable RNA / <1 мин

**Trigger:** G001.  
**Surface:** `SCR_WORLD`.  
**Visual:** `V0_PRIMORDIAL`; локальная реакционная зона становится устойчивее/читаемее.  
**Creature:** `C0_PROTO_CHEMISTRY`.  
**UI:** RNA становится главным видимым ресурсом; passive production читается после unlock.  
**Presentation:** без fullscreen milestone; короткая строка Архива + локальный visual stabilization.

## PB02 — Self Replication / ~2–3 мин

**Trigger:** G002.  
**Surface:** `SCR_WORLD`.  
**Visual:** повторяющиеся molecular patterns; движение становится менее случайным.  
**UI:** passive/self-sustaining RNA подчёркивается production feedback.  
**Transition intent:** от единичной реакции к циклу/ритму.  
**Narrative beat:** `Информация научилась копировать себя.`

## PB03 — DNA / ~4–6 мин

**Trigger:** G003.  
**Surface:** `SCR_WORLD` + доступ к `SCR_EVOLUTION`.  
**Visual:** новая устойчиво различимая molecular structure.  
**UI:** DNA появляется как новый контекстный ресурс; Error Correction может быть optional, но не modal.  
**Presentation:** player sees qualitative complexity increase, not just another counter.

## PB04 — Membrane / ~7–9 мин

**Trigger:** G004.  
**Surface:** `SCR_WORLD`.  
**Visual:** `V0_PRIMORDIAL` начинает переход к `V1_CELLULAR`; вокруг proto-life замыкается читаемая граница.  
**Creature:** `C1_PROTOCELL`.  
**UI:** вторичный UI можно кратко приглушить в момент замыкания мембраны.  
**Transition:** outside/inside becomes visually obvious.

## PB05 — Life / ~9–11 мин

**Trigger:** G005 / MS01.  
**Surface:** `SCR_MILESTONE` поверх `SCR_WORLD`.  
**Visual state:** `V1_CELLULAR`.  
**Creature:** `C2_CELL`.  
**UI:** вторичный UI уходит на короткий момент; затем появляется Biomass context, molecular controls становятся background/history.  
**Camera:** клетка становится главным объектом кадра.  
**Title:** `ЖИЗНЬ`.  
**Transition:** molecular view → cell-focused view.

## PB06 — Metabolism / ~11–14 мин

**Trigger:** C01 / начало G006.  
**Surface:** `SCR_WORLD` + `SCR_EVOLUTION`.  
**Visual:** внутри/вокруг клетки появляется читаемый energetic flow, но Energy — не отдельный абстрактный "сияющий шар".  
**UI:** Energy становится видимой только теперь.  
**Creature:** `C2_CELL`.  
**Presentation:** подготовка к первой branch.

## PB07 — First biological branch / ~12–14 мин

**Trigger:** EV-BIO-01.  
**Surface:** `SCR_EVENT` или focused branch state внутри `SCR_EVOLUTION`; DS-06 выбирает финальную форму.  
**Visual:** live-preview трёх вариантов поверх текущей клетки.

- Absorption → более активные структуры захвата/поглощения;
- Symbiosis → признаки внутренней/внешней кооперации, более спокойная целостность;
- Shell → явно читаемая защитная оболочка/силуэт.

**Creature:** `C2A_ABSORPTION_CELL` / `C2B_SYMBIOSIS_CELL` / `C2C_SHELL_CELL`.  
**After choice:** вариант должен остаться визуально узнаваемым дальше.  
**G006 completion:** после Metabolism + branch resolution.

## PB08 — Cellular systems / ~15–20 мин

**Trigger:** G007 progression: Protein Synthesis / Organelles / Cell Coordination.  
**Surface:** `SCR_WORLD` + `SCR_EVOLUTION`.  
**Visual:** клетка становится внутренне структурированной; branch silhouette сохраняется.  
**Optional visual tags:** Photosynthesis / Chemosynthesis / Efficient Digestion добавляют вторичный, не доминирующий визуальный признак.  
**Rule:** optional metabolic adaptation не должна выглядеть как смена primary species identity.

## PB09 — Adaptation Points / ~20–24 мин

**Trigger:** первый AP reward / G008, **не раньше**.  
**Surface:** `SCR_EVOLUTION`.  
**Visual state:** всё ещё `V1_CELLULAR`; появляется более организованная клеточная колония/coordination preview, но breakthrough Multicellularity ещё не произошёл.  
**Creature:** `C3_COORDINATED_COLONY`.  
**UI:** впервые появляется AP; optional adaptations получают previews будущих body traits.  
**Rule:** никакого AP UI в Iteration 4 / до G008; полноценный `V2_CREATURE` начинается только с G009.

## PB10 — Multicellularity / ~24–28 мин

**Trigger:** G009 / MS02.  
**Surface:** `SCR_MILESTONE` → `SCR_WORLD`.  
**Visual transition:** `V1_CELLULAR` → `V2_CREATURE`; coordinated colony собирается в читаемое единое тело.  
**Creature:** `C3_COORDINATED_COLONY` → `C4_MULTICELLULAR_ORGANISM`.  
**Title:** `МНОГОКЛЕТОЧНОСТЬ`.  
**Camera:** расширяется настолько, чтобы тело читалось целиком.  
**Transition:** colony/cluster → coordinated organism.

## PB11 — Body specialization / ~28–33 мин

**Trigger:** G010–G011.  
**Surface:** `SCR_WORLD` + `SCR_EVOLUTION`.  
**Visual:** Mobility / sensory / digestion / structural adaptations меняют конкретные части тела, а не полностью заменяют creature asset concept.  
**Creature:** `C5_ADAPTED_ORGANISM`.  
**Rule:** branch identity + AP adaptations должны быть совместимы визуально.

## PB12 — Nervous System / ~33–35 мин

**Trigger:** G012.  
**Surface:** `SCR_WORLD`.  
**Visual:** `V2_CREATURE`; более сложное реактивное поведение, sensory attention, coordinated motion.  
**Creature:** `C6_COGNITIVE_ORGANISM`.  
**UI:** впервые появляется Cognition 0–100.  
**Audio intent:** более структурированные reactive cues; без человеческой музыкальной темы.

## PB13 — Behavior + micro-events / ~34–39 мин

**Trigger:** EV-BIO-03, `Опасность`, `Другой`.  
**Surface:** короткий `SCR_EVENT` поверх живой диорамы.  
**Visual:** события происходят вокруг существа, а не на пустом modal background.  
**Rule:** выбор должен занимать секунды, не превращать фазу в visual novel.

## PB14 — Sapience / ~38–40 мин

**Trigger:** G013 / MS03.  
**Surface:** `SCR_MILESTONE`.  
**Visual transition:** `V2_CREATURE` → `V3_SAPIENT_TRIBE`.  
**Creature:** `C6_COGNITIVE_ORGANISM` → `C7_SAPIENT_SPECIES`.  
**Scene:** ночь; одно существо поднимает взгляд к звёздам.  
**UI:** Cognition/biological controls отходят на второй план; затем biological history сворачивается в Evolution/Chronicle.  
**Camera:** сильный pull-back — индивидуальный организм → маленькая группа примерно из 5 особей.  
**After:** Food / Materials / Knowledge / Population становятся активными.  
**Title:** `РАЗУМ ПРОБУДИЛСЯ`.

## PB15 — First group / ~40–48 мин

**Trigger:** G014.  
**Surface:** `SCR_WORLD`.  
**Visual:** `V3_SAPIENT_TRIBE`; небольшой лагерь, укрытие, hearth, рабочие точки.  
**Population presentation:** несколько читаемых существ/групп, не буквальная визуализация каждого жителя при будущем росте.  
**UI:** jobs/buildings layer появляется постепенно.  
**Rule:** бытовой масштаб прежде политического.

## PB16 — Tribe / ~48–50 мин

**Trigger:** G015 / MS04 + EV-CIV-02.  
**Surface:** milestone/short event.  
**Visual:** лагерь выглядит устойчивым, появляются повторяемые социальные/production routines.  
**Title:** `ПЛЕМЯ`.  
**Choice:** `Как делить добычу` поверх той же сцены.  
**Rule:** решение меняет Chronicle/profile; визуальная разница может быть subtle и задаётся DS-07.

## PB17 — Farming → Settlement / ~50–65 мин

**Trigger:** G016 → G017 / MS05.  
**Surface:** `SCR_WORLD`.  
**Visual transition:** `V3_SAPIENT_TRIBE` → `V4_SETTLEMENT`.  
**World changes:** поля, постоянные дома, storage, workshop, дороги/тропы становятся устойчивыми.  
**Milestone:** `МЫ ОСТАЛИСЬ`.  
**Camera:** чуть шире, чтобы поселение читалось как единая система.

## PB18 — Traces Before Us / ~62–70 мин

**Trigger:** EV-NAR-01.  
**Surface:** `SCR_EVENT`.  
**Visual:** объект должен быть показан в контексте раскопки/стройки, не как абстрактная карточка.  
**Diorama:** остаётся `V4_SETTLEMENT`.  
**Rule:** визуально объект должен ощущаться "не отсюда", но не раскрывать его происхождение.  
**After:** Study/Dismantle/Preserve может оставить маленький persistent world/Chronicle trace.

## PB19 — Writing / City / ~65–80 мин

**Trigger:** G018 → G019.  
**Surface:** `SCR_WORLD`, Chronicle становится заметнее.  
**Visual transition:** `V4_SETTLEMENT` → `V5_CITY`.  
**World changes:** плотность, дороги, market, school/research, organized labor.  
**UI:** Knowledge получает более институциональную presentation; government-lite event появляется после city readability.  
**Camera:** city overview, но ещё не global map.

## PB20 — Mechanization / ~80–93 мин

**Trigger:** G020.  
**Surface:** `SCR_WORLD`.  
**Visual transition:** `V5_CITY` → ранний `V6_INDUSTRIAL`.  
**World changes:** steam, factories, rail/logistics, machine motion, stronger production overlays.  
**Rule:** Power ещё не должен выглядеть как давно существовавший top-level system.

## PB21 — Machine Age / ~93–95 мин

**Trigger:** G021 / MS06.  
**Surface:** `SCR_MILESTONE` → `SCR_WORLD`.  
**Visual:** `V6_INDUSTRIAL`.  
**Title:** `ЭПОХА МАШИН`.  
**UI:** Power становится active resource.  
**Camera:** первый ощутимый шаг к regional/global scale.

## PB22 — Energy Crisis branch / ~94–98 мин

**Trigger:** EV-CIV-06.  
**Surface:** `SCR_EVENT`.  
**Visual preview must show world consequence:**

- Fossil → дым/добыча/heavy industry;
- Clean → cleaner generation/infrastructure profile;
- Early Atomic → research-heavy/experimental energy profile.

**Visual state:** остаётся `V6_INDUSTRIAL`, но получает persistent branch modifier.  
**Rule:** это один из немногих choices, который обязан заметно менять world look.

## PB23 — Modern global civilization / ~95–104 мин

**Trigger:** G022.  
**Surface:** `SCR_WORLD`.  
**Visual transition:** `V6_INDUSTRIAL` → `V7_MODERN`.  
**World changes:** electrical grid, communications, research institutions, advanced logistics, connected regions.  
**Camera:** regional/world-scale presentation; игрок должен физически почувствовать путь от 5 существ к планетарной связности.  
**Rule:** Modern — обязательное отдельное визуальное состояние, не промежуточный кадр между Industry и Atomic.

## PB24 — ERROR 17 / ~102–104 мин

**Trigger:** EV-NAR-02.  
**Surface:** `SCR_WORLD`; anomaly поверх обычного интерфейса.  
**Visual:** `V7_MODERN` не прерывается.  
**UI:** строка `Прогноз завершения цикла: доступен` → `ERROR 17` → запрет доступа; затем остаётся side/story objective.  
**Rule:** никаких glitch-heavy horror effects; нарушение должно быть системным и кратким.

## PB25 — Atomic / ~107–108 мин

**Trigger:** G023 / MS07 / EV-NAR-03.  
**Surface:** `SCR_MILESTONE`.  
**Visual transition:** `V7_MODERN` → `V8_ATOMIC`.  
**World:** reactor/lab program становится tangible landmark; modern world остаётся узнаваемым.  
**Title:** `МЫ РАСКОЛОЛИ МАТЕРИЮ`.  
**Archive anomaly:** `Снова.` → `Событие зарегистрировано.`  
**UI after milestone:** появляется World Tension; crisis mode armed.  
**Audio intent:** короткий conceptual sting, затем напряжённая тишина/ambient.

## PB26 — Great Filter / ~108–116 мин

**Trigger:** G024 / crisis active.  
**Surface:** `SCR_CRISIS`.  
**Visual:** `V8_ATOMIC` постепенно получает crisis overlays: readiness, disrupted links, shortages/pollution where applicable, emergency activity.  
**UI:** World Tension dominant secondary indicator; ordinary noncritical UI compressed.  
**Events:** bloc conflict → false warning → critical phase.  
**Rule:** мир деградирует ступенчато; не превращать его в Ash до ending.

## PB27 — Last Protocol / ~116–118 мин

**Trigger:** EV-CR-03 after dramatic clamps.  
**Surface:** focused `SCR_EVENT` inside `SCR_CRISIS`.  
**Visual:** current `V8_ATOMIC` visible behind decision; minimal distractions.  
**After confirm:** all gameplay controls lock.  
**Transition:** короткая пауза → белая вспышка.

## PB28 — Ash / ~116–118 мин

**Trigger:** `ENDING_ASH`.  
**Surface:** `SCR_ENDING`.  
**Visual state:** `V9_ASH`.  
**World:** почти неподвижная тёмная диорама, редкий дым/пожары, отсутствие normal production motion.  
**UI:** сначала почти ничего; затем `ЦИВИЛИЗАЦИЯ №1 ЗАВЕРШЕНА` / `ПЕПЕЛ`.  
**Audio:** резкий collapse → несколько секунд тишины.  
**CTA:** `Сохранить в Архив`.

## PB29 — Archive Summary / ~118–120 мин

**Trigger:** Save to Archive.  
**Surface:** `SCR_ARCHIVE`.  
**Visual:** Ash world может оставаться приглушённым фоном или перейти в Archive presentation; DS-06 решает layout.  
**Content:** species, adaptations, civilization path, key decisions, peak Population, crisis, ending subtype, Archive Fragments.  
**Rule:** это завершённая история мира, не статистика поражения.

## PB30 — Archive remembers / ~120 мин

**Trigger:** summary/reward committed.  
**Surface:** `SCR_META`.  
**Visual:** Archive-focused neutral space; прошлый Timeline сохраняется как record.  
**Title:** `АРХИВ ПОМНИТ`.  
**Copy:** `Мы можем изменить результат.`  
**CTA:** `СОЗДАТЬ НОВУЮ ЖИЗНЬ`.  
**Transition:** Timeline #2 teaser → accelerated familiar boot.

---

# 5. Presentation continuity map

```text
SCR_BOOT
  ↓
SCR_WORLD / V0 Primordial
  ↓
V1 Cellular
  ↓
V2 Creature
  ↓
SCR_MILESTONE / Sapience scale shift
  ↓
V3 Sapient Tribe
  ↓
V4 Settlement
  ↓
V5 City
  ↓
V6 Industrial
  ↓
V7 Modern
  ↓
V8 Atomic + SCR_CRISIS
  ↓
white flash
  ↓
V9 Ash / SCR_ENDING
  ↓
SCR_ARCHIVE
  ↓
SCR_META / Timeline #2 teaser
```

---

# 6. Creature continuity map

Creature progression is tracked separately from world visual states:

```text
C0 proto-chemistry
→ C1 protocell
→ C2 cell
→ C2A/B/C primary-trait cell
→ C3 coordinated colony / pre-multicellular state
→ C4 multicellular organism
→ C5 adapted organism
→ C6 cognitive organism
→ C7 sapient species
→ population/group representation
```

Primary trait must remain visually inherited unless a later explicit meta system replaces/hybridizes it.

AP adaptations modify/preview parts/features of the emerging body plan. They do not cause the Multicellularity breakthrough before G009 and do not reset the species to a new unrelated design.

---

# 7. What DS-06 must resolve

DS-06 inherits this map and must decide:

- exact mobile screen layout for each surface;
- whether branch/event choices are modal, bottom sheet, panel, or in-world focus;
- location and collapse behavior of resources;
- Goal card states;
- Evolution/AP navigation;
- Cognition meter presentation;
- jobs/buildings interaction model;
- transition from creature UI to civilization UI;
- World Tension placement;
- ending/archive responsive layout;
- desktop adaptation.

DS-06 may change **layout**, but not the ordering/meaning of PB00–PB30 without a design decision.

---

# 8. What DS-07 must resolve

DS-07 inherits `V0–V9`, `C0–C7` and must define:

- composition and camera language per state;
- exact environment/art direction;
- creature morphology rules;
- branch visual grammar;
- adaptation visibility rules;
- building/landmark silhouettes;
- time-of-day/lighting strategy;
- era transition visual language;
- crisis degradation layers;
- Ash composition.

DS-07 may refine **appearance**, but must preserve readability of every state transition defined here.

---

# 9. What DS-08 must resolve

Every visual requirement in this document that needs a production asset must receive:

- stable asset ID;
- consumer/surface;
- visual-state reference;
- branch/state variants;
- format/size/layering;
- animation/static requirement;
- generation/source prompt;
- status.

No final mass asset generation before this manifest exists.

---

# 10. Acceptance checklist

- [x] every major G001–G024 phase has a presentation state
- [x] RNA/DNA/Cell canon preserved
- [x] AP appears only from G008
- [x] G008 does not visually pre-empt the G009 Multicellularity breakthrough
- [x] Cognition appears only after Nervous System
- [x] primary biological branch changes creature presentation
- [x] Sapience includes an explicit scale change from organism to group
- [x] Tribe / Settlement / City / Industry / Modern / Atomic are visually distinct
- [x] Power appears in Industry
- [x] Modern is not skipped
- [x] ERROR 17 remains an in-UI anomaly, not a separate cinematic
- [x] World Tension appears only with Atomic/crisis
- [x] first Ash remains unavoidable
- [x] Archive/reset is presented as continuity, not failure
- [x] DS-06 and DS-07 responsibilities are separated cleanly
