# Хроники Эволюции — Canonical Game State

**Документ:** DS-03 / 03_GAME_STATE  
**Версия:** 1.0  
**Статус:** accepted

---

# 1. Цель

Этот документ задаёт normalized runtime/persisted state для Timeline #1.

State должен:

- быть JSON-compatible;
- не содержать DOM/Vue objects/functions;
- использовать stable IDs;
- разделять `run`, `meta`, `settings`, transient runtime;
- сохранять только то, что нельзя безопасно восстановить;
- позволять deterministic headless simulation;
- поддерживать idempotent ending/reset.

---

# 2. Top-level runtime model

```js
{
  run,
  meta,
  settings,
  session
}
```

`session` transient и в save не входит.

Save envelope/schema version описан в `04_SAVE_ARCHITECTURE.md`.

---

# 3. Run state

Recommended shape:

```json
{
  "id": "run_001",
  "timelineId": 1,
  "rulesetVersion": "timeline1-v1",
  "lifecycle": "active",

  "clock": {
    "simulationMs": 0,
    "activeMs": 0
  },

  "chapterId": "CH01",
  "eraId": "MOLECULAR",

  "resources": {},
  "producers": {},
  "nodes": {},
  "population": null,
  "buildings": {},
  "goals": {},
  "events": {},
  "flags": {},
  "pathScores": {},
  "modifiers": {},
  "manualProcesses": {},
  "crisis": null,
  "stats": {}
}
```

---

# 4. Run lifecycle

```text
active
ending_pending
ending_shown
archive_summary
reset_pending
closed
```

Hard rules:

- normal gameplay commands доступны только в `active`;
- после `ending_triggered` economic mutations можно controlled-freeze;
- `closed` run immutable;
- reset never mutates historical closed summary.

---

# 5. Clock state

Persist:

```json
{
  "simulationMs": 5820000,
  "activeMs": 5680000
}
```

Wall-clock timestamps находятся в save envelope/metadata, не используются как единственный gameplay clock.

Derived:

- target delay;
- goal elapsed;
- crisis timeline;
- pacing telemetry.

Offline progression policy применяет elapsed wall time при load отдельно.

Crisis Timeline #1:

```text
offline => crisis simulation frozen
```

---

# 6. Resources

Canonical IDs:

```text
energy
information
biomass
food
materials
knowledge
power
```

Stability и Population не являются обычными resources.

Stored:

```json
{
  "resources": {
    "energy": { "amount": 1240.5 },
    "information": { "amount": 312.2 }
  }
}
```

Если конкретный resource имеет stateful cap невыводимый из config, допускается explicit override:

```json
{
  "amount": 1240.5,
  "capOverride": null
}
```

Не сохранять:

- `/s`;
- `delta`;
- UI display;
- localized name;
- current calculated cap, если он полностью derived;
- current calculated price.

---

# 7. Producers

Биологические/molecular generators являются отдельными entities от buildings.

Recommended ID convention:

```text
GEN_CHEMICAL_GRADIENT
GEN_CATALYTIC_FOLD
GEN_ENERGY_POCKET
GEN_MEMBRANE_PUMP
GEN_ASSIMILATOR
GEN_GENOME_COPIER
GEN_MITOCHONDRIAL_UNIT
...
```

State:

```json
{
  "producers": {
    "GEN_CHEMICAL_GRADIENT": { "count": 13 },
    "GEN_CATALYTIC_FOLD": { "count": 9 }
  }
}
```

Milestone multipliers derived from count + config.

---

# 8. Nodes

All evolution/tech/crisis nodes use same completion registry.

```json
{
  "nodes": {
    "completed": {
      "M01": { "completedAtMs": 43000 },
      "M02": { "completedAtMs": 119000 }
    },
    "selectedBranchByGroup": {
      "metabolism_1": "C01B",
      "body_1": "B01C",
      "behavior_1": "N01B",
      "culture_1": "T01C"
    }
  }
}
```

Runtime statuses like `affordable`, `available_unaffordable`, `abandoned_branch` derived.

Do not save copied costs/effects.

---

# 9. Discovery

Persist only irreversible discovery/seen information.

Run-local:

```json
{
  "discovery": {
    "seenEntities": ["M01", "M02"],
    "corruptedSeen": ["ARCHIVE_UNKNOWN_01"]
  }
}
```

Persistent discovery lives in `meta`.

UI status is selector output:

```text
known_open
known_locked
unknown_corrupted
discovered
```

Config + state decide actual status.

---

# 10. Population and jobs

Before Sapience:

```text
population = null
```

After civilization starts:

```json
{
  "population": {
    "current": 105,
    "peak": 108,
    "assignments": {
      "JOB_SETTLEMENT_FARMER": 42,
      "JOB_SETTLEMENT_BUILDER": 26,
      "JOB_SETTLEMENT_SCHOLAR": 24,
      "JOB_SETTLEMENT_ARTISAN": 8
    }
  }
}
```

`cap` is derived from base rules/buildings/nodes unless an explicit non-derived override is needed.

Invariant:

```text
sum(assignments) <= current
```

Unassigned:

```text
current - sum(assignments)
```

No negative assignment.

---

# 11. Buildings

```json
{
  "buildings": {
    "BLD_FIELD": { "count": 4 },
    "BLD_HOUSE": { "count": 3 },
    "BLD_WORKSHOP": { "count": 2 }
  }
}
```

Unique structure still uses `count` (`0|1`), so purchase flow remains uniform.

Config defines:

- unique/stackable;
- growth;
- effects;
- producer flag;
- visual family.

---

# 12. Goals

Core states:

```text
hidden
revealed
active
completed
reward_pending
archived
blocked_by_event
stalled
skipped_by_archive
```

State:

```json
{
  "goals": {
    "currentId": "G019",
    "states": {
      "G018": {
        "status": "archived",
        "completedAtMs": 4440000
      },
      "G019": {
        "status": "active",
        "startedAtMs": 4440000,
        "lastProgressAtMs": 4700000,
        "bestProgress": 0.72,
        "usedHint": false
      }
    },
    "side": {
      "activeIds": []
    }
  }
}
```

Do not save percentage if it can be fully recalculated except `bestProgress/lastProgress` needed for stall behavior.

---

# 13. Events

```json
{
  "events": {
    "queue": ["EV-CIV-04"],
    "states": {
      "EV-CIV-04": {
        "status": "queued"
      },
      "EV-NAR-01": {
        "status": "resolved",
        "choiceId": "preserve",
        "resolvedAtMs": 4140000
      }
    }
  }
}
```

`choice_pending` must survive reload.

Event presentation/modal open state is not saved; reconstructed from event state.

---

# 14. Flags

Use flat namespaced keys exactly as design contract.

```json
{
  "flags": {
    "run.bio.metabolism": "chemosynthesis",
    "run.bio.body": "sensitivity",
    "run.bio.behavior": "social",
    "run.civ.tradition": "knowledge_ritual",
    "run.energy.path": "clean",
    "run.anomaly.error17_seen": true
  }
}
```

Accepted value types:

```text
boolean | string | finite number | null
```

No arbitrary objects unless schema explicitly defines them.

---

# 15. Path scores

Always initialize all axes:

```json
{
  "pathScores": {
    "nature": 0,
    "industry": 0,
    "freedom": 0,
    "control": 0,
    "cooperation": 0,
    "dominance": 0,
    "biology": 0,
    "machines": 0,
    "preservation": 0,
    "expansion": 0
  }
}
```

Clamp each axis to design range:

```text
-10..+10
```

Timeline #1 path scores are descriptive/profile inputs, not hidden balance multipliers.

---

# 16. Modifiers

Persist active modifiers when their lifetime crosses ticks/save.

```json
{
  "modifiers": {
    "active": {
      "EV_CIV_06_CLEAN": {
        "sourceType": "event",
        "sourceId": "EV-CIV-06",
        "target": "power.rate",
        "group": "chapter_modifier",
        "stackMode": "multiplicative",
        "value": 1.20,
        "startedAtMs": 5660000,
        "expiresOn": {
          "eraEnter": "ATOMIC"
        }
      }
    }
  }
}
```

No function references.

Derived modifier breakdown is not saved.

---

# 17. Manual processes

```json
{
  "manualProcesses": {
    "PROC_PRIMORDIAL_REACTION": {
      "status": "running",
      "startedAtMs": 2000,
      "completeAtMs": 4200,
      "cooldownUntilMs": null
    }
  }
}
```

Statuses:

```text
idle
running
ready_to_claim
cooldown
automated
```

If result is auto-applied at completion, `ready_to_claim` may be unused.

After automation, process remains in history/discovery but does not encourage spam clicking.

---

# 18. Era/chapter

Canonical `eraId` is explicit persisted state.

Do not infer era exclusively from completed nodes.

Reason: future meta may start with known/unlocked nodes without skipping world progression.

Recommended eras:

```text
MOLECULAR
CELLULAR
MULTICELLULAR
COGNITIVE
EARLY_CIV
TRIBE
SETTLEMENT_EARLY
SETTLEMENT
CITY
INDUSTRY
ATOMIC
ARCHIVE_SUMMARY
```

Exact early era granularity may be consolidated if transitions remain unambiguous.

`chapterId` follows CH01..CH08.

---

# 19. Crisis

Before Atomic:

```text
crisis = null
```

On A06:

```json
{
  "crisis": {
    "active": true,
    "stability": 100,
    "clockMs": 0,
    "atomicLoad": 1,
    "unresolvedCrises": 0,
    "ashPending": false,
    "lastProtocol": null,
    "endingSubtype": null,
    "minStability": 100,
    "bonus": 0,
    "tags": []
  }
}
```

Derived:

```text
worldTension = 100 - stability
drain/sec
phase C0..C4
ending readiness
```

`stability` clamp: `0..100`.

Offline freeze does not erase state.

---

# 20. Stats

Only values required for summary/reward/telemetry and expensive/impossible to reconstruct:

```json
{
  "stats": {
    "peakPopulation": 276,
    "uniqueNodesCompleted": 20,
    "startedAtWallMs": 0,
    "firstActionAtMs": 12000
  }
}
```

Do not turn stats into a shadow copy of current state.

---

# 21. Meta state

```json
{
  "archiveFragments": 18,
  "archiveNodes": {
    "AR01": { "purchasedAtTimeline": 1 }
  },
  "discovery": {
    "nodes": ["M01", "M02", "C01B"],
    "anomalies": ["error17"]
  },
  "chronicle": [],
  "endings": {
    "ENDING_ASH": {
      "seen": true,
      "subtypes": ["ash_too_late"]
    }
  },
  "achievements": {},
  "narrativeFlags": {
    "meta.archive.first_reset": true,
    "meta.endings.ash_seen": true
  },
  "storyThreads": {
    "error17": "persistent_open"
  },
  "appliedTransactions": [],
  "nextTimelineId": 2
}
```

Exact DS-04 Archive Tree data can extend `meta` without changing separation principle.

---

# 22. Chronicle

Each completed run produces immutable summary object.

```json
{
  "timelineId": 1,
  "runId": "run_001",
  "ending": {
    "id": "ENDING_ASH",
    "subtype": "ash_too_late"
  },
  "durationSec": 7080,
  "peakPopulation": 276,
  "species": {
    "metabolism": "chemosynthesis",
    "body": "sensitivity",
    "behavior": "social"
  },
  "civilization": {
    "tradition": "knowledge_ritual",
    "settlement": "exchange",
    "governance": "council",
    "citySpecialization": "science",
    "energyPath": "clean",
    "preatomic": "institutes"
  },
  "crisis": {
    "minStability": 17,
    "lastProtocol": "disarm",
    "bonus": 3,
    "tags": ["foresight", "grid_resilience"]
  },
  "rewards": {
    "archiveFragments": 17
  },
  "anomalies": [
    "first_trace_seen",
    "error17_seen",
    "archive_said_again"
  ]
}
```

После добавления в Chronicle record не редактируется balance patch-ами.

---

# 23. Settings

User preferences отделены от meta progression.

Minimum:

```json
{
  "language": "ru",
  "audio": {
    "master": 1,
    "music": 1,
    "sfx": 1
  },
  "accessibility": {},
  "ui": {}
}
```

Platform-specific keys добавляются через explicit schema.

---

# 24. Session/transient state

Never persisted:

```text
render cache
localized strings
computed rates
computed prices
affordability
current selector cache
DOM refs
Vue instances
hover/focus
animation progress
temporary breakdown objects
event subscriptions
worker handles
```

May be persisted if domain-significant:

- mandatory choice pending;
- manual timed process;
- ending/reset transaction state.

---

# 25. Entity schema registry

Every config entity has:

```text
id
entityType
schemaVersion
```

Common optional fields:

```text
nameKey
descriptionKey
tags
presentation
analyticsKey
```

Gameplay-specific fields live per entity type.

---

# 26. ResourceDef

```json
{
  "id": "knowledge",
  "entityType": "resource",
  "schemaVersion": 1,
  "visibleFromEra": "EARLY_CIV",
  "spendable": true
}
```

---

# 27. ProducerDef

```json
{
  "id": "GEN_ASSIMILATOR",
  "entityType": "producer",
  "schemaVersion": 1,
  "cost": {
    "energy": 70
  },
  "growth": 1.17,
  "outputs": {
    "biomass": 0.18
  },
  "producerMilestones": true
}
```

---

# 28. BuildingDef

```json
{
  "id": "BLD_STEAM_PLANT",
  "entityType": "building",
  "schemaVersion": 1,
  "era": "CITY",
  "requiresNodes": ["I03"],
  "cost": {
    "materials": 2200,
    "knowledge": 650
  },
  "growth": 1.20,
  "maxCount": null,
  "effects": ["EFF_STEAM_PLANT_OUTPUT"],
  "producer": true,
  "producerMilestones": true,
  "dioramaFamily": "energy_city"
}
```

---

# 29. JobDef

```json
{
  "id": "JOB_CITY_ENGINEER",
  "entityType": "job",
  "schemaVersion": 1,
  "era": "CITY",
  "outputs": {
    "materials": 0.75,
    "power": 0.26
  },
  "populationCost": 1,
  "replacementFor": ["JOB_SETTLEMENT_ARTISAN"]
}
```

---

# 30. NodeDef

```json
{
  "id": "S08",
  "entityType": "node",
  "schemaVersion": 1,
  "semanticRole": "breakthrough",
  "requiresNodes": ["S07"],
  "populationMin": 105,
  "cost": {
    "food": 5500,
    "materials": 4000,
    "knowledge": 1600
  },
  "effects": [],
  "unlocks": [
    "resource:power",
    "job_set:city_v1",
    "building_set:city_v1"
  ],
  "transition": "CITY",
  "goalId": "G019"
}
```

---

# 31. GoalDef

```json
{
  "id": "G019",
  "entityType": "goal",
  "schemaVersion": 1,
  "chapter": "CH05",
  "targetTimeSec": 4800,
  "completion": {
    "node": "S08",
    "populationMin": 105
  },
  "prerequisites": ["G018"],
  "blockingEvents": [],
  "onComplete": [
    "transition:TR_SET_CITY"
  ],
  "stallThresholdSec": 180,
  "telemetryKey": "create_city"
}
```

Player copy referenced by localization keys/presentation package, not embedded as authority.

---

# 32. EventDef

```json
{
  "id": "EV-CIV-06",
  "entityType": "event",
  "schemaVersion": 1,
  "type": "narrative_choice",
  "priority": "required_narrative",
  "trigger": {
    "goalCompleted": "G021"
  },
  "blocking": false,
  "choices": [
    {
      "id": "clean",
      "effectIds": ["EFF_ENERGY_CRISIS_CLEAN"],
      "setFlags": {
        "run.energy.path": "clean"
      },
      "pathDelta": {
        "nature": 3,
        "preservation": 2
      }
    }
  ]
}
```

---

# 33. TransitionDef

```json
{
  "id": "TR_SET_CITY",
  "entityType": "transition",
  "schemaVersion": 1,
  "from": "SETTLEMENT",
  "to": "CITY",
  "requires": {
    "node": "S08",
    "goalComplete": "G019",
    "populationMin": 105
  },
  "actions": [
    "unlock:resource:power",
    "switch_jobs:city_v1",
    "switch_buildings:city_v1",
    "event:EV-CIV-04"
  ]
}
```

---

# 34. EndingDef

```json
{
  "id": "ENDING_ASH",
  "entityType": "ending",
  "schemaVersion": 1,
  "timeline": 1,
  "subtypes": [
    "ash_fire",
    "ash_too_late",
    "ash_system"
  ]
}
```

Ending trigger logic lives in Crisis/Ending service, not UI.

---

# 35. Validation invariants

At config load:

- unique IDs;
- known resource references;
- no missing prerequisites;
- no cycles in core node graph;
- branch node has exactly one valid group;
- Goal/Event refs exist;
- transition targets exist;
- effect op/stat keys whitelisted;
- OPTIONAL node not hidden core prerequisite;
- unique building `maxCount = 1`;
- job replacement references valid;
- all stable IDs match syntax convention.

At state load:

- finite numbers only;
- resource amount >= 0;
- assignments >= 0 and sum <= Population;
- Stability 0..100;
- path score -10..10;
- selected branch belongs group;
- completed nodes exist in pinned ruleset;
- current era exists;
- mandatory pending event valid.

---

# 36. State normalization on load

Allowed safe corrections:

- missing optional map -> default empty map;
- obsolete transient fields -> drop;
- resource tiny negative from floating point -> clamp to 0 within tolerance;
- unknown non-critical historical ID -> quarantine/log.

Not allowed silently:

- inventing a missing core prerequisite;
- replacing missing current era with latest node;
- spending/granting resources to “repair” progress;
- switching branch;
- duplicating AF;
- converting unresolved ending automatically.

Critical invalid state triggers backup/recovery path.

---

# 37. Acceptance criteria

- state is JSON serializable;
- run/meta/settings split clear;
- no saved DOM/framework objects;
- rates/prices/World Tension are derived;
- era explicit, not reconstructed solely from tech;
- pending choices survive reload;
- Population invariant enforced;
- state can be advanced using fake clock/RNG/storage;
- Timeline Summary can be built without UI;
- reset can replace `run` without erasing `meta`.