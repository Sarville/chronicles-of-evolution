# Хроники Эволюции — события, выборы и narrative flags Act 1 (`T1–T5`)

**Документ:** DS-02 / act-structure revision 3.0
**Статус:** canonical event semantics для `T1`/`T5` (реализовано); `T2–T4` —
новый scope, добавлен этой ревизией.
**Authority:** `docs/DECISIONS_ACT_STRUCTURE.md`,
`docs/gdd/13_ACT_ONE_CHAPTERS.md`.

> Всё, что описано ниже под заголовками `EV-BIO-*`, `EV-FLAVOR-*`,
> `EV-CIV-01..07`, `EV-NAR-01..03`, `EV-CR-01..03` — контент главы `T1`
> (§3–17) и главы `T5` (§14–19, Modern/Atomic/crisis блок; `T5` начинает
> играть именно с этой точки, минуя биологию). Новые секции 22–24 ниже
> добавляют события `T2–T4` и `T5`-only procedural deck.

---

# 1. Event principles

Events remain short, data-driven and subordinate to gameplay flow.

Types:

- `branch`;
- `narrative`;
- `milestone`;
- `crisis`;
- `anomaly`;
- `flavor`.

Priority remains:

```text
ending/crisis > blocking branch > milestone > required narrative > anomaly > side/flavor
```

No two blocking modal choices at once.

Manual playtest rule (2026-09-17): every key branch/choice point must be
surfaced as its own explicit event/modal with a dedicated goal, the same way
`EV-BIO-01` is. It must never be reachable only through a general
adaptation/unlock/discoveries list — non-exclusive choices (like body
adaptations) still need an explicit presentation, even if the player can pick
more than one over time.

---

# 2. Corrected event sequence

| ID / semantic key | Approx window | Type | Trigger |
|---|---:|---|---|
| EV-BIO-01 | ~11–14 | branch | Cell + Metabolism ready |
| EV-BIO-02 | ~20–28 | adaptation/profile | multicellular development |
| EV-BIO-03 | ~33–36 | behavior branch | Nervous System |
| EV-FLAVOR-01/02 | ~34–39 | flavor | Cognition phase |
| EV-CIV-01 | ~40–45 | optional/profile | early civilization |
| EV-CIV-02 | ~48–50 | narrative | Tribe established |
| EV-CIV-03 | ~55–62 | optional/profile | Agriculture/Settlement |
| EV-NAR-01 | ~62–70 | anomaly | Permanent Settlement |
| EV-CIV-04 | ~78–80 | narrative | City |
| EV-CIV-05 | ~80–88 | optional/profile | City/Industry path |
| EV-CIV-06 | ~94–96 | major narrative | Industry |
| EV-CIV-07 | ~99–104 | optional/profile | Modern/preatomic path |
| EV-NAR-02 | ~102–104 | anomaly | Modern civilization |
| EV-NAR-03 | ~107–108 | anomaly/milestone | Atomic Age |
| EV-CR-01 | crisis | crisis | bloc conflict phase |
| EV-CR-02 | crisis | crisis | false warning phase |
| EV-CR-03 | ending | crisis | Last Protocol |

---

# 3. EV-BIO-01 — Первый эволюционный путь

**Type:** blocking branch  
**Trigger:** Cell exists, Metabolism active.  
**Blocks:** only immediate next cellular progression until resolved.

## A — Поглощение

Identity:

- stronger active Biomass acquisition;
- predator/aggressive future bias;
- faster growth with higher resource pressure.

Flags:

```text
run.bio.primary_trait = "absorption"
run.bio.absorption = true
```

Profile scores may bias dominance/expansion, but exact numbers remain config values.

## B — Симбиоз

Identity:

- cooperation/internal efficiency;
- stable passive growth;
- future research/social affinity.

Flags:

```text
run.bio.primary_trait = "symbiosis"
run.bio.symbiosis = true
```

## C — Панцирь

Identity:

- resilience;
- storage/survival;
- reduced event losses/risk;
- strong visual silhouette difference.

Flags:

```text
run.bio.primary_trait = "shell"
run.bio.shell = true
```

### Hard rule

Timeline #1 selects one primary trait. No `×2.5` sibling purchase rule.

Future Archive hybridization may enable a secondary trait under explicit meta rules.

---

# 4. Optional metabolic adaptations

Late-design `Photosynthesis` and `Chemosynthesis` are preserved as optional biological nodes/events.

They do not replace EV-BIO-01.

Possible flags:

```text
run.bio.metabolism.photosynthesis = true
run.bio.metabolism.chemosynthesis = true
```

They may alter local production/visual profile after explicit balance validation.

---

# 5. EV-BIO-02 — Body adaptation profile

Multicellular phase uses Adaptation Points rather than another forced 3-way exclusive branch.

Examples:

- Mobility;
- Sensory Cells;
- Digestion;
- Structural Tissue.

Player may combine several depending on AP budget.

The primary Absorption/Symbiosis/Shell trait remains visually important and may modify adaptation effects.

Chronicle records purchased adaptations.

Presentation (2026-09-17 playtest finding, implemented): `EV-BIO-02` fires
on `C06` completion as its own branch-style modal, the same window treatment
as `EV-BIO-01`, and `G008` points at it directly (`cta`/`highlight` type
`event`). It only blocks direct `B02A`–`D` purchases while pending, so a
player cannot silently complete the choice from the tech tree without seeing
the window; once one pick resolves the event, the remaining adaptations stay
freely purchasable (`body_adaptation_1` branch group with
`allowAdditionalBranches: true` — no exclusivity, no cost penalty).

---

# 6. EV-BIO-03 — Behavioral strategy

**Trigger:** Nervous System complete.

Keep useful late-design choices:

## Solitary strategy

- individual efficiency bias;
- dominance/freedom profile.

## Social behavior

- cooperation/social cognition bias;
- future Population/culture affinity.

## Object manipulation

- tool-use/cognitive bias;
- future Materials/production affinity.

This choice contributes to Cognition but does not directly purchase Sapience.

Flags:

```text
run.bio.behavior = "solitary" | "social" | "tool_use"
```

---

# 7. Cognition micro-events

## EV-FLAVOR-01 — Опасность

Choices:

- flee;
- confront.

Small effects:

- path profile;
- small Cognition contribution;
- Chronicle flavor.

## EV-FLAVOR-02 — Другой

Choices:

- cooperate;
- conflict.

Same rule: flavor + small Cognition/profile effect, never a hard Sapience blocker by itself.

---

# 8. Early civilization profile

A cultural tradition event may remain, but reconciliation changes it from a mandatory paid gate to optional/profile-first content unless later playtest proves the branch economically meaningful.

Possible identities retained:

- Hunting Tradition;
- Gathering Network;
- Knowledge Ritual.

It may provide a small configured local modifier, but the player must be able to start jobs/buildings before resolving a large tech-tree detour.

---

# 9. EV-CIV-02 — Как делить добычу

Keep original decision:

## Делить добычу

- cooperation;
- population stability/profile.

## Лучшие получают больше

- production/control profile.

Exact permanent multipliers are not assumed. In Timeline #1 the choice may primarily affect profile, future crisis flavor and Chronicle unless explicit balance values are added.

---

# 10. Settlement specialization

Retain ideas:

- Irrigation;
- Masonry;
- Exchange.

Default reconciliation semantics:

```text
optional/profile choice
```

It may become blocking only if implementation/playtest demonstrates that the choice is a meaningful part of Settlement identity rather than tree symmetry.

---

# 11. EV-NAR-01 — Следы до нас

Keep canonical anomaly.

Choices remain:

- Study → Knowledge + anomaly flags;
- Dismantle → Materials + artifact lost;
- Preserve → future secret thread.

Any numeric resource burst must be small/configured and included in balance simulation.

Persistent flags remain valid, including first trace discovery/preservation.

---

# 12. EV-CIV-04 — Кто принимает решения?

Government-lite remains:

- Council;
- Leader;
- Merchants.

This is a profile/narrative decision, not a full government system.

It may alter visuals/Chronicle/crisis profile and later unlocks.

---

# 13. City specialization

Production / Science / Energy identities remain useful.

Default status after reconciliation:

```text
optional/profile specialization
```

Do not require it as a mandatory paid gate before Mechanization unless the new economy explicitly uses it.

---

# 14. EV-CIV-06 — Энергетический кризис

Keep as a major meaningful choice after Industry.

## Fossil industry

- strongest immediate Power/production boost;
- pollution tag;
- darker industrial visual variant.

## Clean program

- smaller immediate boost;
- nature/preservation profile;
- clean-tech objective/visual variant.

## Early Atomic research

- Knowledge/Atomic acceleration;
- atomic-risk tag.

All numeric modifiers must be explicit config and included in simulation. No hidden percentages copied automatically from old GDD.

---

# 15. Preatomic specialization

Electrification / Research Institutions / Logistics may remain as optional/profile content inside the Modern bridge.

It is separate from Energy Crisis and must not duplicate the same decision in another three-button paid branch.

---

# 16. EV-NAR-02 — ERROR 17

Trigger during Modern phase before Atomic Age.

Sequence remains canonical:

> Прогноз завершения цикла: доступен.

> ERROR 17

Then persistent story quest:

> Найдите источник повреждённых данных.

Cannot be fully completed in Timeline #1.

Persistent flags remain:

```text
meta.anomaly.error17_seen
meta.archive.prediction_leak_seen
```

---

# 17. EV-NAR-03 — «Снова.»

Trigger on Atomic Age.

Sequence remains:

> «Снова.»

short pause

> «Событие зарегистрировано.»

Do not explain in Timeline #1.

Persistent flag:

```text
meta.archive.heard_again = true
```

---

# 18. World Tension / Stability

Keep one state with two presentations:

```text
Stability: internal 0..100
World Tension = 100 - Stability
```

UI shows World Tension.

Crisis factors may include:

- pollution;
- shortages;
- risky Atomic choices;
- unresolved crises;
- control/dominance flavor where explicitly mapped.

Do not derive a hidden giant formula from every path score.

---

# 19. Crisis events

## Bloc conflict

Choices remain de-escalation / sanctions / force demonstration.

## False warning

Choices remain trust automated system / manual verification.

## Last Protocol

Choices remain:

- retaliate;
- attempt disarm;
- delegate to system.

All converge into `ENDING_ASH` in Timeline #1, with different subtype/flags/Chronicle.

---

# 20. Flag namespaces

Keep:

```text
run.bio.*
run.civ.*
run.energy.*
run.crisis.*
run.anomaly.*
run.chapter          // current chapter id, "T1".."T5"
run.chapterN.*       // N=1..4: chapter-scoped collapse state (blight_noticed, response, ...)
chronicle.timeline_*
meta.archive.*
meta.anomaly.*
meta.endings.*        // includes chapterN_subtype (T1–T4) and timeline_1_subtype (T5)
meta.act1.*           // species_skin budget, Act 1 progress
```

Полный контракт новых namespaces — `docs/scenario/05_NARRATIVE_FLAGS.md`.

New biological flags must use restored terms and should not persist obsolete `metabolism=photosynthesis/chemosynthesis/absorption` as the primary first-branch identity.

Migration can map old pre-release saves/config during the dedicated rework.

---

# 21. Narrative systems preserved

Reconciliation explicitly keeps:

- path/profile scores as non-dominating summary inputs;
- Chronicle;
- anomaly thread;
- Error 17;
- Again;
- crisis choices;
- Ash subtypes;
- persistent narrative flags.

They now attach to the restored gameplay progression.

---

# 22. Implemented event and crisis boundary

The authored config now implements the civilization events in the sequence
above: early group/distribution, Tribe, Settlement profile, `Следы до нас`,
governance, energy path, `ERROR 17`, `Снова.`, then the three crisis choices.
`EV-FLAVOR-01` / `EV-FLAVOR-02` also provide small persisted Cognition
contributions during the neural phase; they enrich the route but cannot be the
sole Sapience gate.

Atomic crisis phases are active-play-only and pause while a required modal is
pending. The current regression profile queues C1 / bloc conflict at 90 s,
C2 / false warning at 210 s, C3 at 330 s and C4 / Last Protocol at 435 s.
Those checkpoints protect narrative order; their exact coefficients remain a
balance-pass input. `EV-CR-03` is the only first-run path to `ENDING_ASH` and
all three choices retain their distinct subtype.

---

# 23. Chapter collapse events (`T1–T4`)

Каждая глава `T1–T4` заканчивается **двумя** событиями вместо полной
4-фазной последовательности `EV-CR-01..03`: одно authored anomaly-событие
(«rising» — вводит угрозу как факт, non-blocking) и одно mandatory
choice-событие («final» — три варианта, определяет subtype, не отменяет
коллапс). Копии текста — `docs/scenario/04_STORY_EVENTS.md`; здесь только
gameplay-контракт. Priority-правило §1 применяется без изменений: final
собятия имеют приоритет `ending/crisis`, rising — приоритет `anomaly`.

**ID/flag authority:** exact choice IDs, subtype strings and flag
namespace below are owned by `docs/scenario/04_STORY_EVENTS.md` §4–7 and
`docs/scenario/05_NARRATIVE_FLAGS.md` §5A/5B — this table mirrors them,
narrative doc wins on any future wording/ID drift.

## `T1` — Мор

| ID | Trigger | Type | Blocking | Goal |
|---|---|---|---|---|
| `EV-NAR-04` | Tribe milestone (`MS04`) reached + short delay | anomaly | no | `G025` |
| `EV-CR-T1` | after `EV-NAR-04`, short delay | ending | yes, mandatory | `G026` |

`EV-CR-T1` choices: `isolate` (Изолировать больных) / `stay_together`
(Держаться вместе) / `healer` (Довериться целителю). Flags:

```text
run.chapter1.blight_noticed = boolean
run.chapter1.response = "isolate" | "stay_together" | "healer"
```

All three converge to `ENDING_BLIGHT` with subtype
`meta.endings.chapter1_subtype = "blight_isolated" | "blight_unified" | "blight_early_medicine"`.

## `T2` — Катаклизм

| ID | Trigger | Type | Blocking | Goal |
|---|---|---|---|---|
| `EV-NAR-05` | after Farming/`G028`, Settlement specialization | anomaly | no | `G029` |
| `EV-CR-T2` | after `EV-NAR-05`, short delay | ending | yes, mandatory | `G030` |

`EV-CR-T2` choices: `converge` (Стянуть группы к центру) /
`shelter_separately` (Укрыть каждую группу отдельно) / `old_experience`
(Довериться прежнему опыту). Flags:

```text
run.chapter2.tremor_noticed = boolean
run.chapter2.response = "converge" | "shelter_separately" | "old_experience"
```

Converge to `ENDING_CATACLYSM`, `meta.endings.chapter2_subtype =
"cataclysm_converge" | "cataclysm_scattered" | "cataclysm_unprepared"`.

## `T3` — Раскол

| ID | Trigger | Type | Blocking | Goal |
|---|---|---|---|---|
| `EV-CIV-04` (reused, unchanged text) | City-equivalent reached | narrative/profile | no, feeds into `EV-CR-T3` condition | `G032B` |
| `EV-NAR-06` | after governance choice | anomaly | no | `G033` |
| `EV-CR-T3` | after `EV-NAR-06`, short delay | ending | yes, mandatory | `G034` |

`EV-CR-T3` choices: `suppress` (Подавить несогласных) / `split` (Разделить
крепость) / `vote` (Вынести решение на всех). Flags:

```text
run.chapter3.fracture_noticed = boolean
run.chapter3.response = "suppress" | "split" | "vote"
```

Converge to `ENDING_FRACTURE`, `meta.endings.chapter3_subtype =
"fracture_suppressed" | "fracture_split" | "fracture_deliberated"`.
`EV-CIV-04`'s prior choice (`council` / `leader` / `merchants`, see §12) is
a condition input for `EV-CR-T3` framing, not a hard gate — all three final
choices remain available regardless of governance pick.

## `T4` — Авария

| ID | Trigger | Type | Blocking | Goal |
|---|---|---|---|---|
| `EV-CIV-08` (new) | Machine Age milestone reached | branch/profile | no, feeds into `EV-CR-T4` condition | `G037` |
| `EV-NAR-07` | after `EV-CIV-08` | anomaly | no | `G038` |
| `EV-CR-T4` | after `EV-NAR-07`, short delay | ending | yes, mandatory | `G039` |

`EV-CIV-08` choices: `cautious` (Осторожный темп) / `aggressive`
(Агрессивный темп) / `delegated` (Делегировать полный контроль). Flag:

```text
run.chapter4.automation_pace = "cautious" | "aggressive" | "delegated"
run.chapter4.overload_noticed = boolean
```

`EV-CR-T4` choices: `manual_stop` (Остановить вручную) / `reroute`
(Перенаправить нагрузку) / `trust_automation` (Довериться автоматике до
конца — automatic outcome when `automation_pace = "delegated"`, no manual
choice offered). Flag:

```text
run.chapter4.response = "manual_stop" | "reroute" | "trust_automation"
```

Converge to `ENDING_OVERLOAD`, `meta.endings.chapter4_subtype =
"overload_manual" | "overload_rerouted" | "overload_automated"`.

## Hard rules (shared with `EV-CR-01..03`)

- никакой choice не отменяет коллапс своей главы — тот же принцип, что уже
  действует для `Ash`;
- final-событие каждой главы не показывает rewarded ad и не открывает
  shop/meta CTA — идентично правилу для Last Protocol (`09_ENDINGS_AND_
  RESET.md` §2);
- rising-событие не блокирует обычный gameplay input дольше короткого
  toast/brief sheet (см. `12_LONG_TERM_PROGRESSION_AND_RESET_ROADMAP.md`
  §7 fairness rules).

---

# 24. Chapter framing: recap threshold events (не starting-condition grants)

**Скорректировано 2026-09-18** (`docs/DECISIONS_ACT_STRUCTURE.md` ACT-002):
`T2–T5` не открываются intro-сценой, объявляющей стартовый грант — гранта
нет, каждая глава начинается на RNA точно как `T1`. `run.chapter` тегируется
на саму попытку (сама механика reset/continue в Archive UI между главами,
не игровое событие) и известен движку с первого тика — это то, что решает,
идёт ли `G015` дальше в `G025` (Мор, только `T1`) или в recap-цепочку
следующей главы (`docs/gdd/07_GOALS_AND_MILESTONES.md` §5.1, §11).

Что действительно происходит внутри каждой попытки:

| Глава | Где | Что |
|---|---|---|
| `T2`, `T4` | на существующем событии выбора primary trait (`C02A`/`C02B`/`C02C`, всё ещё внутри recap-а) | `meta.act1.species_skin` ставится в `1`/`2` — Архив сам предлагает другую ветку вместо оставленного открытым выбора |
| `T2`, `T3`, `T4` | на пороге между recap-ом и новым контентом (Tribe/Settlement/City) | короткая non-blocking Archive-реплика, отсылающая к причине предыдущего коллапса (тексты — `07_GOALS_AND_MILESTONES.md` §5.1/6.1/7.1) — implementation detail, не отдельный event ID, как и раньше |
| `T5` (`EV-NAR-08` «Синтез») | на пороге между recap-ом (RNA→Industry/Modern) и Atomic-контентом | полноценный event ID — значимый reveal (Архив впервые прямо говорит о предыдущих четырёх главах), `meta.act1.species_skin` возвращается в `0` (исходная линия, swap budget исчерпан) |

`EV-NAR-08` остаётся единственной из этих сцен с отдельной event-записью —
остальные реализуются как короткие Archive-реплики без отдельного event ID,
implementation detail. `run.chapter`/`meta.act1.species_skin` — namespace
`docs/scenario/05_NARRATIVE_FLAGS.md` §5A.

---

# 25. `T5` — `t5_synthesis` procedural deck

Поверх существующего Modern/Atomic/crisis-контента `T5` (§14–19)
добавляется процедурный deck `deck: 't5_synthesis'` — тот же Event Engine
контракт, что уже обслуживает `deck: 'early_biology'` в `T1` (weighted
seeded draw, per-event cooldown, save-сериализуемое deck state), не новый
движок. Полная спецификация и текст карточек — `docs/scenario/
04_STORY_EVENTS.md` §T5-DECK.

Восемь карточек, по паре (minor + major) на каждую из четырёх прошлых
глав: `EV-T5-ECHO-BLIGHT-MINOR/MAJOR`, `EV-T5-ECHO-CATACLYSM-MINOR/MAJOR`,
`EV-T5-ECHO-FRACTURE-MINOR/MAJOR`, `EV-T5-ECHO-OVERLOAD-MINOR/MAJOR`.
Каждая пара читается через `meta.endings.chapterN_subtype` этого
конкретного прогона (precondition — соответствующий флаг должен быть
установлен; если предыдущая глава была пройдена по-другому или история не
сохранилась при миграции, пара просто не входит в eligible pool — никаких
generic заглушек). Major-карточка каждой пары доступна только после того,
как её minor уже была разыграна в этом прогоне. Hard rule: ни одна
карточка этой deck не может предотвратить обязательный первый `Ash` — тот
же принцип, что уже действует для `EV-CR-01`/`EV-CR-02`.
