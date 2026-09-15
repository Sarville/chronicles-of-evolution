# Хроники Эволюции — Testing Strategy

**Документ:** DS-03 / reconciliation revision 2.0  
**Статус:** accepted testing architecture / reconciled gameplay cases.

---

# 1. Principle

Keep the accepted headless-first strategy.

New gameplay must be testable without production UI.

Reconciliation changes test fixtures and assertions, not the testing architecture.

---

# 2. Test layers

Keep:

- L0 config validation;
- L1 pure unit;
- L2 domain integration;
- L3 adapter contracts;
- L4 save/migration;
- L5 headless simulation;
- L6 browser smoke/E2E.

No large framework migration is required just because content changed.

---

# 3. Config validation after reconciliation

Validate:

- unique IDs;
- references exist;
- graph has no cycles;
- branch groups valid;
- optional nodes skippable;
- effects whitelisted;
- costs/outputs finite/non-negative where present;
- AP rewards/costs non-negative integers or accepted config type;
- Cognition contributors valid;
- condition-driven convergence valid;
- Goal/Event mappings valid;
- removed E/I content is not referenced by reconciled ruleset.

Explicit negative checks for `timeline1-v2-reconciled`:

```text
no player-facing Information resource
no Chemical Gradient producer
no Catalytic Fold producer
no Energy Pocket producer
no old Stable Bond semantics
```

---

# 4. Early biological domain tests

Minimum route:

```text
M01 Stable RNA
→ M02 Self Replication
→ M03 DNA Synthesis
→ M05 Membrane
→ M06 Cell
```

Cases:

- first manual process works;
- passive RNA unlock works;
- Self Replication changes process behavior;
- DNA unavailable before M03;
- DNA available after M03;
- M04 Error Correction optional/skippable;
- Membrane requires intended prerequisites;
- Cell transition unlocks Biomass/cellular state;
- no UI/DOM required.

---

# 5. Manual-input tests

Headless simulation should measure manual contribution share.

Acceptance target after tuning:

```text
manual contribution <=5% competent optimal income after ~3 min
```

Test behavior rather than exact obsolete E/I cooldown constants.

---

# 6. First-branch tests

Primary branch group:

```text
Absorption / Symbiosis / Shell
```

Validate:

- exactly one primary selected in Timeline #1;
- sibling is not buyable through generic `×2.5` rule;
- all branches preserve core reachability;
- branch flag/history persists in run save;
- optional Photosynthesis/Chemosynthesis do not overwrite primary trait;
- future meta hybridization has explicit separate permission seam.

---

# 7. Adaptation Points tests

Minimum:

- AP awarded by configured milestone/side objective exactly once;
- no passive AP tick;
- cannot spend below zero;
- core node purchase never requires AP;
- optional adaptation can spend AP atomically;
- retained Archive optional adaptation can activate at zero AP cost only under valid meta rules;
- reset clears run-local AP.

---

# 8. Cognition tests

Minimum:

- Cognition clamped 0..100;
- contributions come from valid nodes/events;
- behavior choice contributes as configured;
- flavor event reward cannot duplicate on reload;
- Sapience unavailable below 100;
- Sapience available at 100 only if core neural prerequisites are complete;
- no direct generic resource payment completes Sapience;
- optional AP route cannot soft-lock reaching 100.

---

# 9. Civilization transition tests

On Sapience:

- biological active resources leave main civilization selectors;
- Population initializes around configured small-group value (~5);
- F/M/K starting package applied exactly once;
- no conversion from obsolete Information stock;
- no farming biological stock to inflate starting Population;
- early jobs/buildings available.

---

# 10. Population/jobs tests

Keep existing invariants:

- assignment sum <= Population;
- negative assignments impossible;
- unassigned allowed;
- phase transition remap loses no Population;
- unavailable old jobs produce nothing;
- temporary Food deficit stops/slows growth according to rules without instant hard fail.

Retune golden values after new population model is frozen.

---

# 11. Power/Modern tests

Validate:

- Power is not required for City unlock;
- Power becomes active through Industry/electrification path;
- Industry reachable without old mandatory city specialization if config says optional;
- Modern state/goal exists before Atomic;
- communications/global/research conditions map correctly;
- Error 17 triggers in Modern phase;
- Atomic requires Scientific Method + Atomic Theory + reactor/lab project concept.

---

# 12. Goal tests

All G001–G024:

- unique ID;
- valid prerequisites;
- valid completion conditions;
- target time telemetry only;
- completion emits/rewards exactly once;
- archived goal never re-awards;
- optional side goals do not block core.

Specific corrected checks:

```text
G001 Stable RNA
G002 Self Replication
G003 DNA
G004 Membrane
G005 Cell
G013 Cognition-based Sapience
G022 Modern Civilization
G023 Atomic Age
```

No early Goal copy/config may reference Information/Chemical Gradient/Catalytic Fold/Energy Pocket.

---

# 13. Event tests

Validate:

- first biological branch uses Absorption/Symbiosis/Shell;
- body adaptations can combine according to AP rules;
- Behavior strategy separate from first trait;
- Danger/Other flavor events do not hard-block Sapience alone;
- Traces Before Us persistent flags;
- Energy Crisis distinct from optional preatomic specialization;
- Error 17 persistent-open behavior;
- Again anomaly;
- crisis event ordering.

---

# 14. Crisis tests

Keep accepted cases:

- normal crisis flow;
- fast Stability collapse with dramatic clamp;
- high-Stability path cannot prevent first Ash;
- offline crisis freeze;
- all Last Protocol variants converge to `ENDING_ASH` with correct subtype/flags;
- Archive reward/Chronicle applied once.

Old exact 435/480 sec values remain regression starting points unless new balance changes them explicitly.

---

# 15. Save/migration tests

Keep:

- serialization;
- primary/pending/backup recovery;
- schema migration;
- reset retry/idempotency;
- corrupted-save recovery.

Add reconciliation ruleset cases:

- old `timeline1-v1` save is not silently interpreted as v2;
- explicit restart/migration path behaves as specified;
- meta/settings preservation verified if restarting pre-release run;
- resource/node semantic aliases are deterministic where used;
- no guessed conversion `energy→rna` or `information→dna` based on amounts.

---

# 16. Headless simulation profiles

For 0–10 maintain:

- competent;
- optimized;
- slower/non-optimal;
- M04 optional.

For 10–40 add variation by:

- primary trait;
- AP spending;
- optional metabolism adaptation;
- behavior strategy;
- Cognition contribution pattern.

For civilization keep representative job-allocation profiles.

---

# 17. Timing acceptance — initial reconciliation targets

0–10:

```text
first action <20 sec
passive RNA <60 sec
Self Replication ~2–3 min
DNA ~4–6 min
Cell ~9–11 min
```

0–40:

```text
Multicellularity ~24–28 min
Nervous System ~31–35 min
Sapience ~38–40 min
```

Late anchors:

```text
City ~78–80
Industry ~93–95
Modern ~102–104
Atomic ~107–108
Ash ~116–118
Reset ~120
```

These are simulation targets, not hard timers.

---

# 18. Browser smoke

After early rework browser smoke must verify:

- no obsolete E/I labels/cards in reconciled run;
- Goal CTA routes correctly;
- resource reveal order correct;
- save/recovery UI still works;
- dev tools hidden in production;
- touch/mouse primary actions work.

---

# 19. Gate before Iteration 4

Required:

- config tests pass;
- domain tests pass;
- save/migration tests pass;
- UI smoke passes;
- 0–10 headless profiles acceptable;
- manual 0–10 playtest completed;
- user approves corrected playable.

Only then corrected Iteration 4 may begin.