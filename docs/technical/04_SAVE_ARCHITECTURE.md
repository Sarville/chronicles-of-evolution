# Хроники Эволюции — Save Architecture

**Документ:** DS-03 / 04_SAVE_ARCHITECTURE  
**Версия:** 1.0  
**Статус:** accepted

---

# 1. Цель

Save v1 должен быть:

- versioned;
- recoverable;
- compatible with future migrations;
- independent from old Evolve save namespace;
- safe for first ending/reset transaction;
- testable through in-memory storage;
- ready for future cloud storage without rewriting domain.

---

# 2. Decision: separate save namespace

Legacy:

```text
localStorage['evolved']
```

New:

```text
chronicles_evolution
chronicles_evolution.backup
chronicles_evolution.pending
```

DS-03 decision:

- new game never silently overwrites `evolved`;
- reset never removes `evolved`;
- old original Evolve progress is not automatically converted to Timeline #1;
- if no new save exists, create new Chronicles state;
- optional dev/import migration can be built later without becoming a product promise.

Reason: domain semantics, resources, progression, ending/meta model differ too strongly for a trustworthy automatic semantic migration.

---

# 3. Save envelope

Uncompressed logical form:

```json
{
  "format": "chronicles-evolution-save",
  "schemaVersion": 1,
  "saveRevision": 42,
  "gameVersion": "1.4.10",
  "rulesetVersion": "timeline1-v1",
  "createdAt": "2026-09-15T18:00:00.000Z",
  "updatedAt": "2026-09-15T19:31:12.000Z",

  "run": {},
  "meta": {},
  "settings": {},

  "transactions": {
    "pendingReset": null
  }
}
```

`gameVersion` informational/build compatibility.  
`schemaVersion` controls structure migration.  
`rulesetVersion` pins gameplay definitions used by active run.  
`saveRevision` increments every committed save.

---

# 4. Serialization

Pipeline:

```text
GameState
→ normalize
→ validate
→ JSON.stringify
→ codec.encode (LZString initially)
→ StoragePort
```

Load:

```text
StoragePort
→ codec.decode
→ JSON.parse
→ validate envelope
→ migrate schema
→ validate state
→ post-load normalization
→ domain
```

All parse/decode/storage operations use error handling.

No `JSON.parse(decompress(...))` without `try/catch`.

---

# 5. Why separate schema and ruleset versions

`schemaVersion` answers:

> Как устроен JSON?

`rulesetVersion` answers:

> По каким игровым правилам этот run был начат?

Example:

```text
schemaVersion: 2
rulesetVersion: timeline1-v1
```

A later code release can migrate schema while keeping an active run on the same pinned balance.

This prevents silent change of prices/rates midway through a run when config changes.

---

# 6. Ruleset policy

Release 1 must always ship all rulesets needed by supported active saves.

If ruleset is unavailable:

- dev: hard fail with diagnostic;
- production: attempt explicit ruleset migration;
- if no migration exists: offer backup/export/restart path, never guess values.

Ruleset migration is a design/balance decision, not structural schema migration.

---

# 7. Autosave

Recommended triggers:

- periodic dirty autosave, target 5–10 sec;
- visibility/page lifecycle change;
- after major irreversible choice;
- after milestone/ending;
- before reset commit;
- after meta purchase.

Do not stringify/write every 250 ms tick.

Domain marks save dirty after persisted mutation.

Autosave failure:

- does not stop gameplay immediately;
- records visible dev/error state;
- retries with bounded backoff;
- before destructive reset, failure becomes blocking.

---

# 8. Safe normal write

Because localStorage has no transaction/rename, use write-ahead pattern.

```text
1. build candidate envelope revision N+1
2. validate candidate
3. write candidate -> `.pending`
4. read `.pending`
5. decode/parse/validate and verify revision/hash-like metadata
6. copy current primary -> `.backup`
7. write candidate -> primary
8. read primary and verify revision
9. remove `.pending`
```

If any step before 7 fails, primary remains old valid save.

If step 7/8 fails, backup and/or pending remain recovery candidates.

No claim of true atomic localStorage transaction is made.

---

# 9. Recovery order

On startup:

1. try primary;
2. if invalid, try `.pending` only if it is fully valid and revision is newer;
3. otherwise try `.backup`;
4. otherwise check export/manual recovery;
5. otherwise start new game only with explicit user-facing recovery decision in production.

Debug log includes failure class, not sensitive save dump.

---

# 10. Backup rotation

Release 1 minimum:

```text
1 primary
1 backup
1 pending
```

Do not create unbounded localStorage history.

Chronicle is historical gameplay data inside meta state, not save backup.

---

# 11. Migration pipeline

Structure:

```js
const migrations = {
  1: migrate1to2,
  2: migrate2to3,
}
```

Load:

```text
while schemaVersion < CURRENT_SCHEMA:
  apply exact next migration
  increment schemaVersion
validate
```

Rules:

- migration pure whenever possible;
- never call UI;
- deterministic;
- idempotence tested at repository level;
- no balance choice hidden in structural migration;
- backup original payload before first migration write.

---

# 12. New-field policy

For backward-compatible optional additions:

```text
missing -> schema default
```

For gameplay-significant addition:

- migration required;
- or ruleset-specific default explicitly documented.

Do not infer branch/choice from best current economy.

---

# 13. Entity ID changes

Stable IDs should not change.

If unavoidable:

```js
aliases = {
  OLD_ID: 'NEW_ID'
}
```

Migration updates:

- completed node;
- branch selection;
- building/job maps;
- event refs;
- Chronicle only if semantic identity is truly same.

Historical Chronicle names/records may keep original version metadata.

Never reuse an old ID for a different entity.

---

# 14. Legacy Evolve saves

DS-03 recommendation:

```text
No automatic production migration of arbitrary Evolve progress.
```

Reasons:

- old and new progression graphs do not map 1:1;
- new run/meta split did not exist;
- “Пепел”/Archive reset semantics are new;
- fake conversion risks giving invalid gameplay state.

Allowed:

- preserve old key;
- provide developer inspection tool;
- optionally import non-gameplay preferences such as language after explicit mapping;
- later build one-off opt-in migration if product requirement appears.

---

# 15. Export/import

New export contains the new envelope, not legacy `global`.

Format marker required:

```text
chronicles-evolution-save
```

Import:

1. decode/parse;
2. validate format;
3. migrate;
4. validate ruleset;
5. write using safe write path;
6. reload/reinitialize domain.

Invalid import never overwrites primary.

Export is generated from last committed/candidate valid state.

---

# 16. Save state vs derived state

Persist:

- current run stocks/counts/selections;
- goal/event states needed to resume;
- flags/path scores;
- active timed modifiers/processes;
- crisis;
- Chronicle/meta/settings.

Do not persist:

- calculated production rates;
- calculated prices;
- affordability;
- World Tension;
- localized strings;
- selector caches;
- DOM/Vue state;
- modifier breakdown;
- visual animation position.

---

# 17. First reset as idempotent transaction

First ending/reset is the highest-risk save operation.

Canonical transaction ID:

```text
timeline_<timelineId>_ending_<endingId>
```

Example:

```text
timeline_001_ending_ENDING_ASH
```

---

# 18. Reset prepare phase

While old run still exists:

1. lock destructive run commands;
2. build immutable Timeline Summary;
3. calculate AF from summary/state;
4. calculate persistent flags/endings/discovery;
5. create `resetTransaction` object;
6. validate all IDs and reward values.

Example:

```json
{
  "id": "timeline_001_ending_ENDING_ASH",
  "status": "prepared",
  "sourceRunId": "run_001",
  "summary": {},
  "reward": {
    "archiveFragments": 17
  },
  "preparedAt": "..."
}
```

No AF is yet considered committed.

---

# 19. Reset commit candidate

Build an entire next envelope in memory:

```text
old meta
+ Chronicle summary
+ persistent flags
+ AF reward
+ transaction id in appliedTransactions
+ new blank run for Timeline #2
```

The old run is not deleted from primary until the full candidate is validated and safely committed.

This satisfies DS-02 intent more safely than multiple independent writes.

---

# 20. Reset commit

```text
1. candidate contains updated meta + new run
2. write candidate to pending
3. read/verify pending
4. backup old primary
5. write candidate to primary
6. read/verify primary
7. only now report reset_saved
8. clear pending
```

If commit fails:

- old primary run remains recoverable;
- player receives retry;
- AF is not considered awarded in authoritative primary.

---

# 21. Idempotency

`meta.appliedTransactions` contains completed reset transaction IDs.

On retry:

```text
if transaction ID already applied:
  do not add AF again
  do not append Chronicle duplicate
  ensure target next-run state exists
```

Chronicle record key:

```text
timelineId + ending transaction ID
```

Duplicate append is rejected.

---

# 22. Timeline #2 creation

`createNewRun(meta, timelineId)` is pure and deterministic given:

- selected Archive nodes;
- ruleset;
- seed.

It does not clone Timeline #1 resources/buildings/jobs/tech.

Allowed carry-over only comes from explicit meta mapping.

DS-04 will extend exact effects.

---

# 23. Corrupt save behavior

Classes:

```text
DECODE_ERROR
JSON_ERROR
FORMAT_ERROR
SCHEMA_ERROR
MIGRATION_ERROR
RULESET_MISSING
STATE_INVARIANT_ERROR
STORAGE_WRITE_ERROR
STORAGE_QUOTA_ERROR
VERIFY_ERROR
```

Production response:

- attempt recovery;
- never clear all keys automatically;
- expose export/restore/restart options later in UX;
- retain diagnostics safe for analytics.

---

# 24. Multi-tab

Current legacy code only warns.

DS-03 minimum recommendation for new save:

- every save has `saveRevision`;
- tabs listen to `storage`;
- if external revision > local revision, local tab enters `stale_writer` state;
- stale tab must not autosave over newer revision until reload/explicit takeover.

Full leader election not required for vertical slice.

---

# 25. Platform/cloud future

`SaveRepository` has API independent of localStorage:

```text
load()
save(envelope)
export()
import()
```

DS-10 can wrap/compose cloud storage without domain changes.

Conflict resolution policy is DS-10; not invent now.

---

# 26. Save telemetry hooks

Later analytics should receive only metadata:

```text
save_success
save_failed
save_recovered
save_migrated
save_stale_writer_detected
reset_transaction_prepared
reset_transaction_committed
reset_transaction_failed
```

Never send full save body.

---

# 27. Tests required

- new game save/load deep-equivalent on persisted state;
- derived state recomputes identically;
- bad primary recovers backup;
- bad pending does not replace primary;
- newer valid pending recovers after interrupted commit;
- migration N→N+1;
- migration chain;
- unknown ruleset blocks safely;
- stale writer refuses overwrite;
- reset commit success;
- reset write failure preserves old run;
- same reset retry does not duplicate AF;
- same reset retry does not duplicate Chronicle;
- Timeline #2 contains no run-only resources/buildings/jobs;
- legacy `evolved` key remains unchanged.

---

# 28. Acceptance criteria

Save Architecture is accepted if:

- new save has versioned envelope;
- old `evolved` remains untouched;
- load failures are caught;
- normal saves use recoverable pending/backup flow;
- schema migration pipeline exists;
- ruleset version is pinned;
- reset is idempotent;
- failure cannot silently destroy current run;
- storage is behind port;
- tests can run against in-memory storage.