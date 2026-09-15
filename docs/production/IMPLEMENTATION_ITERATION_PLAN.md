# Хроники Эволюции — пошаговый план реализации для Codex

**Версия:** 1.0  
**Назначение:** implementation roadmap для Codex с итерациями, входными документами, deliverables, проверками и TODO.  
**Scope:** вертикальный срез первого Timeline примерно 0–120 минут, ending `Ash`, reset и teaser Timeline #2.  
**Принцип:** каждая итерация должна завершаться запускаемым состоянием игры. Нельзя делать несколько больших подсистем «в полурабочем виде» одновременно.

---

# 1. Роли

## ChatGPT

Отвечает за:
- PRD/GDD;
- сценарий;
- тексты;
- балансные спецификации;
- арт-дирекшн;
- asset manifests;
- промпты для генерации артов;
- audio direction;
- промпты для музыки/SFX;
- UX specifications;
- корректировку требований после playtest.

## Codex

Отвечает за:
- code audit;
- архитектуру реализации;
- data schemas;
- game systems;
- UI;
- save/load;
- analytics hooks;
- platform integration;
- тесты;
- performance;
- сборки.

Codex не должен менять дизайн без явного обновления документации.

---

# 2. Общие правила работы Codex

Перед каждой итерацией:

1. прочитать `docs/README.md`;
2. прочитать `docs/DECISIONS.md`;
3. прочитать только документы, перечисленные в `Inputs` итерации;
4. проверить `docs/TODO.md`;
5. выписать affected modules;
6. сделать короткий implementation plan;
7. только затем менять код.

После каждой итерации:

1. запустить tests;
2. запустить lint/typecheck/build;
3. проверить save compatibility;
4. сделать smoke test;
5. обновить `docs/production/05_KNOWN_ISSUES.md`;
6. отметить TODO;
7. записать, какие acceptance criteria выполнены;
8. не переходить к следующей итерации при critical regression.

---

# 3. Definition of Done для любой итерации

Итерация завершена только если:

- [ ] проект собирается;
- [ ] приложение запускается;
- [ ] основной путь итерации проходим;
- [ ] нет blocker console errors;
- [ ] новые сущности имеют стабильные IDs;
- [ ] данные отделены от presentation там, где это предусмотрено архитектурой;
- [ ] новые данные сохраняются или явно помечены как transient;
- [ ] добавлены минимальные unit/integration tests;
- [ ] добавлены analytics hooks, если они предусмотрены;
- [ ] UI работает mouse + touch;
- [ ] placeholders используют финальные asset IDs;
- [ ] acceptance checklist выполнен.

---

# 4. Итерация 0 — Repo baseline и code audit

## Цель
Понять исходный проект и получить безопасную точку старта.

## Inputs
- `docs/PRD.md`
- `docs/gdd/01_FIRST_120_MINUTES.md`
- `docs/gdd/02_ECONOMY_FIRST_120_MINUTES.md`
- `docs/gdd/03_EVOLUTION_TREE.md`
- `docs/technical/01_EXISTING_CODE_AUDIT.md` — шаблон/задача

## Задачи

- [x] определить build tool;
- [x] определить runtime/framework;
- [x] найти главный game loop;
- [x] найти resource calculations;
- [x] найти save/load;
- [x] найти current UI mounting points;
- [x] найти tech/building/job data;
- [x] определить platform-specific code;
- [x] определить зависимости, которые нельзя безопасно обновлять сейчас;
- [x] сделать baseline build;
- [x] зафиксировать baseline bundle size;
- [x] зафиксировать baseline startup time;
- [x] добавить smoke command/script, если отсутствует;
- [x] написать `docs/technical/01_EXISTING_CODE_AUDIT.md`.

## Deliverable

Исходный проект запускается без функциональных изменений, а структура кода документирована.

## Не делать

- не переписывать UI;
- не мигрировать framework;
- не менять balance;
- не удалять legacy systems;
- не делать «cleanup всего проекта».

---

# 5. Итерация 1 — Domain adapter и data foundation

## Цель
Создать слой, через который новый UI и новые systems смогут работать с game state.

## Inputs
- code audit;
- `technical/00_ARCHITECTURE.md`;
- `technical/02_DOMAIN_MODEL.md`;
- `technical/03_DATA_SCHEMAS.md`;
- economy;
- evolution tree.

## Задачи

### Data
- [ ] создать canonical resource IDs;
- [ ] создать evolution node schema;
- [ ] создать tech node schema;
- [ ] создать generator/building schema;
- [ ] создать job schema;
- [ ] создать goal schema;
- [ ] создать event schema;
- [ ] создать narrative flag schema;
- [ ] создать ending schema;
- [ ] создать diorama state schema;
- [ ] добавить schema validation в dev mode.

### State
- [ ] normalized game state;
- [ ] timeline state;
- [ ] era state;
- [ ] goal state;
- [ ] narrative flags;
- [ ] visual state;
- [ ] meta state placeholder.

### Runtime
- [ ] единый tick/update API;
- [ ] deterministic-enough production calculations;
- [ ] event bus/domain events;
- [ ] no direct UI mutation of economic state.

## Required domain events

Минимум:

```text
resource_changed
generator_bought
upgrade_bought
evolution_node_unlocked
branch_selected
goal_started
goal_completed
era_changed
milestone_reached
story_event_started
story_choice_made
ending_triggered
reset_completed
```

## Tests

- [ ] cost growth;
- [ ] production formula;
- [ ] milestone count multipliers;
- [ ] branch exclusivity;
- [ ] schema validation;
- [ ] deterministic tick sanity test.

## DoD

Можно программно запустить пустой Timeline, начислить ресурс, купить upgrade, получить domain event и сохранить state.

---

# 6. Итерация 2 — Save v1 и dev tools

## Цель
Не строить vertical slice на несохраняемом state.

## Задачи

- [ ] versioned save schema;
- [ ] run state;
- [ ] meta state;
- [ ] narrative flags;
- [ ] settings;
- [ ] autosave;
- [ ] manual dev reset;
- [ ] corrupt-save fallback;
- [ ] migration interface;
- [ ] dev-only time scale;
- [ ] dev resource grant;
- [ ] dev jump-to-era;
- [ ] dev trigger-event;
- [ ] dev dump-state.

## Очень важно

Сделать speed multiplier, например:

```text
1x / 5x / 20x / 100x
```

Только в development build.

Иначе тестирование 120-минутного run станет слишком дорогим.

## Tests

- [ ] save/load equality;
- [ ] autosave;
- [ ] migration noop;
- [ ] invalid save recovery;
- [ ] reset does not erase meta state.

---

# 7. Итерация 3 — Goal engine + tutorial shell

## Цель
Сначала построить систему целей, затем наполнять эпохами.

## Inputs
- goals/milestones GDD;
- UX tutorial/hints;
- analytics schema.

## Задачи

- [ ] current goal state;
- [ ] goal prerequisites;
- [ ] completion conditions;
- [ ] reward application;
- [ ] sequential chains;
- [ ] optional goals;
- [ ] hint timeout;
- [ ] CTA/highlight target;
- [ ] chapter goal slot;
- [ ] destiny goal slot;
- [ ] basic objective UI;
- [ ] goal analytics.

## UI

Минимальный shell:
- top resources;
- central placeholder diorama;
- current objective;
- primary action area;
- bottom navigation placeholder.

## DoD

Можно пройти mock-цепочку из 5 целей data-driven способом без специальных `if goal_1` в UI.

---

# 8. Итерация 4 — 0–10 минут: molecular life

## Цель
Сделать первый полностью playable segment.

## Inputs
- economy 0–10;
- evolution tree M01–M06;
- Timeline #1 scenario opening;
- art V0/V1 specs;
- primordial audio specs.

## Gameplay

- [ ] Energy;
- [ ] Information;
- [ ] manual onboarding action;
- [ ] Chemical Gradient;
- [ ] Catalytic Fold;
- [ ] Energy Pocket;
- [ ] Stable Bond;
- [ ] Self Replication;
- [ ] Catalytic RNA;
- [ ] Error Correction optional;
- [ ] Lipid Shell;
- [ ] Proto-cell.

## Narrative

- [ ] Archive boot;
- [ ] first system lines;
- [ ] RNA/information milestone copy;
- [ ] replication line;
- [ ] cell line.

## Visual

- [ ] V0 Primordial placeholder/final;
- [ ] V1 Cellular transition;
- [ ] visual response to first stable structure;
- [ ] lightweight particles.

## Audio

- [ ] primordial ambience;
- [ ] basic UI feedback;
- [ ] first unlock SFX;
- [ ] Proto-cell stinger.

## Timing acceptance

При симуляции reference player:
- [ ] first meaningful action <20 sec;
- [ ] automatic income <60 sec;
- [ ] Self Replication ~2 min;
- [ ] Proto-cell ~9–11 min.

---

# 9. Итерация 5 — 10–26 минут: cell → multicellularity

## Gameplay

- [ ] Biomass;
- [ ] cell generators;
- [ ] metabolism branch;
- [ ] Membrane Transport;
- [ ] Genome;
- [ ] Protein Synthesis;
- [ ] Mitochondrial Symbiosis;
- [ ] Cell Coordination;
- [ ] Multicellularity.

## Branching

- [ ] photosynthesis;
- [ ] chemosynthesis;
- [ ] absorption;
- [ ] exclusive group;
- [ ] second-branch price multiplier groundwork;
- [ ] branch visual tag.

## UI

- [ ] evolution node card;
- [ ] branch choice view;
- [ ] locked/affordable/completed states;
- [ ] selected branch history.

## Visual

- [ ] cellular scene reacts to organelles;
- [ ] V2 transition preparation;
- [ ] branch variant hook.

## Acceptance

- [ ] Multicellularity median sim ~25–27.5 min;
- [ ] no branch blocks progression;
- [ ] all three branches remain within pacing tolerance.

---

# 10. Итерация 6 — 26–46 минут: organism → Sapience

## Gameplay

- [ ] Digestive Tissue;
- [ ] Muscle Bundle;
- [ ] Neural Cluster;
- [ ] Sensory Organ;
- [ ] body branch;
- [ ] behavior branch;
- [ ] Nervous Network;
- [ ] Social Signaling;
- [ ] Proto-language;
- [ ] Sapience.

## Events

- [ ] danger mini-event;
- [ ] other/social mini-event;
- [ ] path score updates.

## UX

- [ ] cognition progress presentation;
- [ ] milestone full-screen transition;
- [ ] biological resource phase completion.

## Visual

- [ ] V2 Creature;
- [ ] Sapience illustration;
- [ ] transition into civilization diorama.

## Audio

- [ ] multicellular layer;
- [ ] cognition layer;
- [ ] Sapience stinger.

## Acceptance

- [ ] Sapience simulated window 44–48.5 min;
- [ ] biological resources convert using canonical formula;
- [ ] biological state remains available in Evolution tab/history.

---

# 11. Итерация 7 — 46–62 минут: Tribe

## Gameplay

- [ ] Food;
- [ ] Materials;
- [ ] Knowledge;
- [ ] Population;
- [ ] food consumption;
- [ ] population growth;
- [ ] Forager;
- [ ] Gatherer;
- [ ] Thinker;
- [ ] Caregiver;
- [ ] Hearth;
- [ ] Shelter;
- [ ] Tool Bench;
- [ ] Hunting Ground;
- [ ] Story Circle;
- [ ] Clan Camp;
- [ ] Fire;
- [ ] Cooperative Hunt;
- [ ] Tribe;
- [ ] Seed Selection;
- [ ] Agriculture.

## UX

- [ ] people/jobs screen;
- [ ] manual job assignment;
- [ ] auto-assign button basic version;
- [ ] food deficit warning;
- [ ] population cap warning.

## Story

- [ ] first civilization choice;
- [ ] first side quests;
- [ ] Chronicle first civilization cards.

## Visual

- [ ] V3 Tribe;
- [ ] campfire;
- [ ] population density stages;
- [ ] simple structures.

## Acceptance

- [ ] player cannot hard-fail from food starvation;
- [ ] deficit stops growth and provides recovery hint;
- [ ] Agriculture ~59.5–64.5 min.

---

# 12. Итерация 8 — 62–80 минут: Settlement → City

## Gameplay

- [ ] Farmer;
- [ ] Builder;
- [ ] Scholar;
- [ ] Artisan;
- [ ] Field;
- [ ] House;
- [ ] Workshop;
- [ ] Granary;
- [ ] School;
- [ ] Market;
- [ ] Permanent Settlement;
- [ ] Pottery & Storage;
- [ ] Writing;
- [ ] Division of Labor;
- [ ] Urban Planning;
- [ ] City.

## Story

- [ ] `Мы остались` milestone;
- [ ] `Следы до нас` event;
- [ ] choice and flag persistence;
- [ ] early government-lite event if its final timing is approved.

## Side quests

- [ ] settlement tutorial quest;
- [ ] knowledge quest;
- [ ] workshop quest.

## Visual

- [ ] V4 Settlement;
- [ ] fields;
- [ ] permanent houses;
- [ ] roads;
- [ ] workshop smoke;
- [ ] transition to V5 City.

## Acceptance

- [ ] City ~76.5–83.5 min;
- [ ] Knowledge behaves as intended soft bottleneck;
- [ ] event choice persists through save/load.

---

# 13. Итерация 9 — 80–94 минут: City → Industry

## Gameplay

- [ ] Power;
- [ ] Industrial Farmer;
- [ ] Miner;
- [ ] Engineer;
- [ ] Researcher;
- [ ] Mine;
- [ ] Foundry;
- [ ] Steam Plant;
- [ ] Rail Hub;
- [ ] Laboratory;
- [ ] Mechanization;
- [ ] Steam Network;
- [ ] Standard Parts;
- [ ] Mass Education;
- [ ] Industry.

## Visual

- [ ] V5 City;
- [ ] V6 Industrial;
- [ ] rail animation;
- [ ] factory smoke;
- [ ] electrification indicators.

## Audio

- [ ] city ambience;
- [ ] industrial music layer;
- [ ] machinery ambience;
- [ ] Industry stinger.

## Acceptance

- [ ] Industry ~90.5–97.5 min;
- [ ] Power unlock is understandable without wiki;
- [ ] Food becomes supporting resource rather than primary bottleneck.

---

# 14. Итерация 10 — 94–108 минут: Industry → Atomic Age

## Gameplay

- [ ] Mechanized Farmer;
- [ ] Industrial Worker;
- [ ] Power Engineer;
- [ ] Scientist;
- [ ] Steelworks;
- [ ] Grid Station;
- [ ] Research Institute;
- [ ] Chemical Complex;
- [ ] Electrical Grid;
- [ ] Scientific Method;
- [ ] Combustion & Logistics;
- [ ] Atomic Theory;
- [ ] Atomic Age.

## Event

- [ ] energy crisis choice;
- [ ] Nature/Industry path score;
- [ ] visual skyline modifier;
- [ ] future Filter Risk modifier.

## Narrative

- [ ] Archive prediction error;
- [ ] Error 17 hook;
- [ ] Atomic milestone;
- [ ] Archive line `Снова.`;
- [ ] correction line.

## Visual

- [ ] V7 Atomic;
- [ ] reactor landmark;
- [ ] denser skyline;
- [ ] electrical infrastructure;
- [ ] environmental variant overlays.

## Acceptance

- [ ] Atomic Age ~104–111.5 min;
- [ ] choices alter flags/path scores;
- [ ] crisis state initializes correctly.

---

# 15. Итерация 11 — 108–120 минут: Great Filter → Ash

## Gameplay

- [ ] Stability 0–100;
- [ ] crisis clock;
- [ ] stability drain formula;
- [ ] atomic_load;
- [ ] unresolved_crises;
- [ ] Reactor Prototype;
- [ ] Strategic Atom;
- [ ] Automated Grid;
- [ ] Global Research Net;
- [ ] Emergency Coordination;
- [ ] scripted minimum crisis duration;
- [ ] Ash trigger.

## Events

- [ ] conflict of two blocs;
- [ ] false alarm;
- [ ] final protocol;
- [ ] choices alter ending metadata, not first-run survival.

## UX

- [ ] world tension meter;
- [ ] warning escalation;
- [ ] stability explanation;
- [ ] crisis tasks;
- [ ] final choice screen.

## Audio

- [ ] crisis adaptive layer;
- [ ] warning SFX;
- [ ] white-flash cut;
- [ ] intentional silence;
- [ ] Ash ambience;
- [ ] Ash ending cue.

## Visual

- [ ] crisis overlays;
- [ ] flash transition;
- [ ] V8 Ash;
- [ ] ash particles;
- [ ] ending illustration.

## Acceptance

- [ ] first run cannot prevent Ash;
- [ ] different choices produce different flags/epitaph data;
- [ ] Ash occurs in intended timing corridor;
- [ ] no ad interrupts emotional ending sequence.

---

# 16. Итерация 12 — Ending summary, Archive и reset

## Gameplay

- [ ] ending summary data;
- [ ] Timeline number;
- [ ] species/archetype;
- [ ] duration;
- [ ] max population;
- [ ] technologies;
- [ ] dominant path;
- [ ] notable choices;
- [ ] Archive Fragment calculation;
- [ ] Chronicle card;
- [ ] Genetic Echo placeholder/final system according to approved GDD;
- [ ] explicit preserved/reset list;
- [ ] reset confirmation;
- [ ] Timeline lifecycle close/open.

## Meta

- [ ] Archive tree Tier 1;
- [ ] permanent unlock persistence;
- [ ] at least one meaningful first purchase;
- [ ] new timeline initialization.

## UX

- [ ] ending screen;
- [ ] rewards;
- [ ] Archive screen;
- [ ] new life CTA.

## Acceptance

- [ ] reset does not destroy meta state;
- [ ] new run starts cleanly;
- [ ] user can understand what was preserved;
- [ ] AF expected reward roughly 14–18 for reference run.

---

# 17. Итерация 13 — Timeline #2 teaser

## Scope
Не реализовывать весь второй run.

## Реализовать

- [ ] `Архив помнит` screen;
- [ ] one permanent bonus application;
- [ ] faster early start;
- [ ] one preserved/selected trait if approved;
- [ ] altered first minutes;
- [ ] impossible artifact hook;
- [ ] visual preview Meta Tree;
- [ ] clear indication that new run can differ.

## Acceptance

Игрок после reset должен за 1–3 минуты увидеть минимум два отличия от Timeline #1.

---

# 18. Итерация 14 — Diorama state system

До этого момента допустимы placeholders. Теперь нужно связать world art с gameplay.

## Задачи

- [ ] diorama state resolver;
- [ ] era base layer;
- [ ] population density layer;
- [ ] branch/theme layer;
- [ ] landmark layer;
- [ ] environment layer;
- [ ] pollution/nature layer;
- [ ] crisis layer;
- [ ] ending layer;
- [ ] animated props;
- [ ] lazy loading;
- [ ] quality tier.

## Data-driven example

```text
base = V6_INDUSTRIAL
population = DENSITY_2
path = INDUSTRY_5
landmarks = [RAIL_HUB, STEAM_PLANT]
environment = POLLUTION_2
crisis = NONE
```

UI не должен вручную решать, какой фон поставить.

---

# 19. Итерация 15 — Audio system

## Задачи

- [ ] music manager;
- [ ] ambience manager;
- [ ] SFX bus;
- [ ] volume settings;
- [ ] crossfades;
- [ ] era transitions;
- [ ] crisis adaptive state;
- [ ] pause/background tab behavior;
- [ ] unlock stingers;
- [ ] mobile autoplay handling;
- [ ] user interaction unlock for web audio.

## Performance

- [ ] streaming/compressed assets where appropriate;
- [ ] no simultaneous loading of all late-game tracks;
- [ ] fallback if asset unavailable.

---

# 20. Итерация 16 — Offline progression

## Реализовать first-run rules

- [ ] offline efficiency 50%;
- [ ] max 2h;
- [ ] no automatic breakthrough completion;
- [ ] population offline cap;
- [ ] no Ash while offline;
- [ ] crisis timer freeze first run;
- [ ] return summary;
- [ ] optional rewarded doubling hook.

## Tests

- [ ] 5 min offline;
- [ ] 2 h offline;
- [ ] >2 h offline;
- [ ] exit during crisis;
- [ ] save timestamp manipulation resilience where reasonable.

---

# 21. Итерация 17 — Analytics

## Events

Минимум:

```text
game_start
tutorial_step
goal_started
goal_completed
evolution_choice
milestone_reached
chapter_complete
quest_accept
quest_complete
tech_unlock
era_transition
ending_reached
reset_confirm
second_run_start
resource_starved
job_allocation_changed
atomic_age_started
ash_triggered
return_session
offline_reward_claim
session_end
```

## Parameters

- timeline;
- era;
- goal;
- elapsed real time;
- active time;
- species/archetype;
- branch IDs;
- path scores;
- bottleneck;
- population;
- Stability for crisis events.

## Privacy

Не отправлять весь save как analytics payload.

---

# 22. Итерация 18 — Ads/platform integration

Только после того, как first run полноценно работает без рекламы.

## Яндекс Игры / VK

- [ ] SDK initialization;
- [ ] gameplay ready signal;
- [ ] pause/resume around ads;
- [ ] rewarded result handling;
- [ ] interstitial cooldown;
- [ ] no fullscreen first 15 min;
- [ ] no ad before emotional ending reveal;
- [ ] no interstitial immediately after rewarded;
- [ ] optional cloud save hook if supported/approved;
- [ ] analytics around offers and completion.

## Acceptance

Полное прохождение возможно без просмотра рекламы и сохраняет target pacing.

---

# 23. Итерация 19 — Balance simulator и automated pacing test

Это обязательная итерация перед открытым тестом.

## Создать simulator

Он должен уметь:
- выполнять production ticks без UI;
- применять reference purchase policy;
- покупать recommended upgrades;
- распределять jobs по preset;
- логировать milestone times;
- прогонять разные branches;
- использовать seeded randomness для event timing;
- запускаться десятки/сотни раз.

## Профили

Минимум:
1. reference active;
2. delayed buyer;
3. knowledge-heavy;
4. production-heavy;
5. safe branch;
6. aggressive branch.

## Target windows

- [ ] Proto-cell 9–11 min;
- [ ] Sapience 43–49 min;
- [ ] City 76–84 min;
- [ ] Atomic Age 103–112 min;
- [ ] first reset 116–124 min.

## Не делать

Не тюнить economy «по ощущениям UI» без simulator + playtest.

---

# 24. Итерация 20 — Full vertical-slice QA

## Functional

- [ ] new game;
- [ ] save/load at every era;
- [ ] reload during event;
- [ ] reload during crisis;
- [ ] reset;
- [ ] Timeline #2 start;
- [ ] offline return;
- [ ] mobile touch;
- [ ] desktop mouse;
- [ ] resizing;
- [ ] background/foreground tab.

## UX

- [ ] no dead-end screen;
- [ ] every locked action explains why;
- [ ] objective always visible or reachable in one action;
- [ ] bottleneck hint works;
- [ ] no >5 min unexplained horizon first 30 min;
- [ ] resource bar does not overload mobile screen.

## Narrative

- [ ] all story lines fire once unless intended otherwise;
- [ ] no reveal occurs early;
- [ ] flags survive save/load;
- [ ] Chronicle contains correct choices;
- [ ] Ash epitaph matches decisions.

## Performance

- [ ] average Android target tested;
- [ ] acceptable startup time;
- [ ] no huge spikes on era transition;
- [ ] lazy-load late assets;
- [ ] animation tier works.

---

# 25. Итерация 21 — Closed playtest

## Минимальная выборка

Сначала 5–10 внутренних полных run, затем 30–50 тестовых полных прогонов для balance validation.

## Собирать

- milestone median/p25/p75;
- quit stage;
- first confusion point;
- objective stalls;
- bottleneck distribution;
- job reallocations;
- branch distribution;
- manual taps after minute 5;
- first reset acceptance;
- whether player understands why Timeline #2 matters.

## После теста

ChatGPT обновляет:
- economy;
- GDD;
- tutorial hints;
- copy;
- UX;
- audio/art notes при необходимости.

Codex затем выполняет отдельную balance/fix iteration.

---

# 26. Итерация 22 — Release candidate vertical slice

## Freeze

На RC:
- не добавлять новые mechanics;
- не менять schema IDs без миграции;
- не делать крупный refactor;
- не менять narrative flow без явной причины.

## Checklist

- [ ] clean production build;
- [ ] no dev tools in production UI;
- [ ] save migration tested;
- [ ] analytics verified;
- [ ] ad rules verified;
- [ ] platform SDK verified;
- [ ] asset licensing tracked;
- [ ] credits/NOTICE prepared;
- [ ] error logging enabled if предусмотрено;
- [ ] release notes prepared.

---

# 27. Текущий TODO — документация до Iteration 4

Сначала ChatGPT должен подготовить:

- [ ] `docs/README.md`
- [ ] `docs/DECISIONS.md`
- [ ] `docs/GLOSSARY.md`
- [ ] `docs/TODO.md`
- [ ] `gdd/04_CIVILIZATION_PROGRESSION.md`
- [ ] `gdd/05_BUILDINGS_AND_JOBS.md`
- [ ] `gdd/06_TECH_TREE.md`
- [ ] `gdd/07_GOALS_AND_MILESTONES.md`
- [ ] `gdd/09_EVENTS_AND_CHOICES.md`
- [ ] `gdd/10_ENDINGS_AND_RESET.md`
- [ ] `scenario/01_TIMELINE_01.md`
- [ ] `scenario/07_DIALOGUE_AND_COPY_GUIDE.md`
- [ ] `scenario/08_NARRATIVE_FLAGS.md`
- [ ] `ux/01_SCREEN_MAP.md`
- [ ] `ux/02_MOBILE_WIREFRAMES.md`
- [ ] `ux/04_COMPONENT_STATES.md`
- [ ] `art/00_ART_DIRECTION.md`
- [ ] `art/01_LOCATIONS_AND_DIORAMAS.md`
- [ ] `art/05_ASSET_MANIFEST.md`
- [ ] `art/06_GENERATION_PROMPTS.md`
- [ ] `audio/00_AUDIO_DIRECTION.md`
- [ ] `audio/01_MUSIC_CUES.md`
- [ ] `audio/02_AMBIENCE.md`
- [ ] `audio/03_SFX_LIBRARY.md`
- [ ] `audio/05_GENERATION_PROMPTS.md`

Codex параллельно может выполнять только Iteration 0 — code audit.

---

# 28. TODO — техническая подготовка Codex

- [ ] baseline build;
- [ ] audit codebase;
- [ ] document build commands;
- [ ] document save system;
- [ ] document current game loop;
- [ ] identify reusable simulation code;
- [ ] identify old UI boundary;
- [ ] identify platform integration points;
- [ ] propose domain adapter;
- [ ] create architecture doc draft;
- [ ] no gameplay rewrite yet.

---

# 29. TODO — MVP vertical slice

## Foundation
- [ ] normalized state;
- [ ] data schemas;
- [ ] versioned save;
- [ ] goals;
- [ ] events;
- [ ] narrative flags;
- [ ] dev speed tools.

## Biology
- [ ] 0–10 min;
- [ ] 10–26 min;
- [ ] 26–46 min;
- [ ] branches;
- [ ] Sapience transition.

## Civilization
- [ ] Tribe;
- [ ] Settlement;
- [ ] City;
- [ ] Industry;
- [ ] Atomic.

## Ending
- [ ] Stability;
- [ ] Filter events;
- [ ] Ash;
- [ ] summary;
- [ ] reset;
- [ ] Archive;
- [ ] Timeline #2 teaser.

## Production
- [ ] diorama states;
- [ ] art assets;
- [ ] audio;
- [ ] offline;
- [ ] analytics;
- [ ] ads/platform;
- [ ] balance simulator;
- [ ] QA.

---

# 30. Что делать прямо сейчас

Последовательность следующей работы должна быть такой:

### Шаг 1
Привести текущие документы к новой структуре `docs/` и создать `README / DECISIONS / GLOSSARY / TODO`.

### Шаг 2
Передать Codex только задачу на **Iteration 0: code audit**. Не просить его сразу «начать делать новую игру».

### Шаг 3
Пока Codex изучает код, ChatGPT формирует gameplay contract:
- civilization progression;
- buildings/jobs;
- tech tree;
- goals;
- events;
- ending/reset.

### Шаг 4
ChatGPT формирует полный `Timeline #1` сценарий и narrative flags.

### Шаг 5
ChatGPT формирует screen map и mobile-first UX.

### Шаг 6
На основе UX создаются art direction, location specs и asset manifest. После этого можно последовательно генерировать финальные арты.

### Шаг 7
Параллельно создаются audio direction, music cues и SFX prompts. Финальное аудио можно добавлять позднее, сохраняя IDs с placeholder assets.

### Шаг 8
После code audit согласовать target architecture. Только затем Codex начинает Iteration 1.

### Шаг 9
Реализовывать игру по playable slices: 0–10 → 10–26 → 26–46 → Tribe → Settlement → City/Industry → Atomic/Crisis → Reset.

### Шаг 10
После каждого slice делать accelerated playtest через dev time scale и обновлять документацию до следующего slice.

### Шаг 11
После complete run подключить art/audio state systems, offline, analytics и только потом ads/platform SDK.

### Шаг 12
Перед релизом построить balance simulator и прогнать серию 30–50 полных тестов первого Timeline.

---

# 31. Основной принцип проекта

Самая опасная стратегия — попросить Codex сразу реализовать «весь редизайн». Это создаст десятки скрытых решений в коде, которые потом придётся выковыривать.

Правильный цикл:

```text
SPEC → SMALL PLAYABLE SLICE → TEST → FIX SPEC → NEXT SLICE
```

Для **«Хроник Эволюции»** правильная единица работы — не «система целиком на будущее», а **законченный кусок progression, который можно пройти от начала до конца и проверить по времени, UX, сюжету и визуальному payoff**.
