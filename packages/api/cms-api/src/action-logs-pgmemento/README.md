# Action Log via pgMemento (prototype)

A prototype that replaces the **node-side** action-log implementation
(`packages/api/cms-api/src/action-logs`) with [pgMemento](https://github.com/pgMemento/pgMemento),
a trigger-based audit trail that lives inside PostgreSQL.

This module is **additive** — the existing implementation is untouched. The public API of the
module mirrors `ActionLogsModule` so switching is a one-line import change (see _Enabling_ below).

## Why

The current implementation builds the audit trail in Node: a MikroORM `onFlush` subscriber
(`action-logs.subscriber.ts`) inspects every change set of every `@ActionLogs()` entity, serializes
a full snapshot, resolves the user and scope, computes the next version with a sub-query, and writes
an `ActionLog` row in the same flush.

Drawbacks of doing this in Node:

- **Only ORM writes are captured.** Raw SQL, `qb.update()`, console jobs bypassing the subscriber,
  `ON CONFLICT` upserts, cascade deletes etc. produce no log entry.
- A full snapshot is stored **per version**, even when one field changed.
- Versioning uses a `MAX(version)+1` sub-query per change (race-prone under concurrency).
- Audit logic is coupled to the application flush path.

pgMemento moves logging into database triggers, so **every** committed change is captured
regardless of who issues it, and only deltas are stored.

## Architecture

```
                 old (node-side)                         new (pgMemento)
   ┌──────────────────────────────────┐    ┌────────────────────────────────────────┐
   │ onFlush subscriber                │    │ afterTransactionStart subscriber         │
   │  • build snapshot                 │    │  • set_config('pgmemento.session_info',  │
   │  • resolve user + scope           │    │      '{"client_user":"<id>"}', true)     │
   │  • compute version                │    │  …that's the only write-side node code   │
   │  • INSERT ActionLog               │    └────────────────────────────────────────┘
   └──────────────────────────────────┘                      │
                 │                                            ▼ (DB triggers, in-transaction)
                 ▼                              pgmemento.transaction_log / table_event_log / row_log
            ActionLog table                                  │
                 │                                            ▼
   resolvers query ActionLog table          read model reconstructs ActionLog shape from row_log
                 └──────────────────────────────────┬────────────────────────────────┘
                                                     ▼
                              identical GraphQL `ActionLog` type → Admin UI unchanged
```

The node side keeps **only** the responsibility the database cannot fulfil: telling the DB which
application user is acting. Everything else (what changed, when, in which transaction) is recorded by
pgMemento.

### Files

| File                                        | Responsibility                                                                           |
| ------------------------------------------- | ---------------------------------------------------------------------------------------- |
| `pgmemento-session.subscriber.ts`           | Write path. Sets `pgmemento.session_info.client_user` per transaction.                   |
| `pgmemento-setup.service.ts`                | Enables auditing (`create_table_audit` + baseline) for `@ActionLogs()` entities at boot. |
| `pgmemento-action-logs.service.ts`          | Read model. Reconstructs the `ActionLog` history from pgMemento's log tables.            |
| `pgmemento-action-logs.resolver.ts`         | `ActionLog` field resolvers (`type`, `user`, `previousVersion`).                         |
| `pgmemento-action-logs.resolver.factory.ts` | `actionLogs` / `actionLog` resolve fields per audited entity.                            |
| `pgmemento.constants.ts`                    | `op_id` mapping, schema/column names, type derivation.                                   |
| `mapped-action-log.ts`                      | In-memory shape mirroring the `ActionLog` entity.                                        |
| `pgmemento-sql/`                            | Where to install the upstream pgMemento schema (see its README).                         |

### Field mapping

The read model presents the **same** GraphQL `ActionLog` type. Mapping from pgMemento:

| `ActionLog` field | Source in pgMemento                                                                                 |
| ----------------- | --------------------------------------------------------------------------------------------------- |
| `id`              | `row_log.id`                                                                                        |
| `entityId`        | the entity's primary-key column, read from `row_log.new_data`/`old_data`                            |
| `entityName`      | the audited entity class (table → entity)                                                           |
| `version`         | 1-based rank of the row's events ordered by transaction time                                        |
| `type`            | `table_event_log.op_id` → `INSERT(3)=Created`, `UPDATE(4)=Updated`, `DELETE(7)/TRUNCATE(8)=Deleted` |
| `userId`          | `transaction_log.session_info ->> 'client_user'`                                                    |
| `createdAt`       | `transaction_log.txid_time`                                                                         |
| `snapshot`        | folded `new_data` deltas (full row on INSERT + subsequent UPDATE deltas); `null` on delete          |
| `scope`           | derived from the reconstructed snapshot (see _Known limitations_)                                   |
| `previousVersion` | the directly preceding reconstructed entry                                                          |

Because `op_id` distinguishes insert/update/delete directly, `type` no longer relies on the
"snapshot is null" heuristic of the old implementation.

## Enabling

1. **Install the pgMemento schema** once into the database — see [`pgmemento-sql/README.md`](./pgmemento-sql/README.md).
2. **Swap the module** wherever the old one is wired:

    ```ts
    // app.module.ts
    - ActionLogsModule.forRoot(),
    + PgMementoActionLogsModule.forRoot(),

    // feature module (e.g. products.module.ts)
    - ActionLogsModule.forFeature([Product, Manufacturer]),
    + PgMementoActionLogsModule.forFeature([Product, Manufacturer]),
    ```

3. Start the API. `PgMementoSetupService` enables auditing for every `@ActionLogs()` entity on boot
   (idempotent; skips with a warning if the pgMemento schema is missing).

No Admin-side or GraphQL-schema changes are required — the `ActionLog` type is identical.

## Known limitations (prototype scope)

- **Scope** is derived on read from the snapshot (jsonb `scope` column or embeddable `scope_*`
  columns). Relation-derived scopes (`@ScopedEntity`) are **not** reconstructed yet; production use
  would need the scope persisted into `session_info`/`row_log` at write time, or computed against the
  live entity. Scope-based authorization filtering of the log list is therefore not wired in.
- **Snapshot field names** follow database columns. Simple scalar columns are mapped back to entity
  property names; embeddables (e.g. `scope_*`) and other composite columns are left as column names,
  so a snapshot diff may differ slightly from the old format.
- **Performance**: the read model loads an entity's full history and paginates/sorts in memory.
  Fine for a prototype; a production version should paginate in SQL and use a DataLoader for
  `user` / `previousVersion`.
- The old `ActionLog` table and its migration are left in place; a real migration would also
  backfill/retire it.
- Verified by type-check + lint and against the pgMemento `master` schema shape. Not yet run
  end-to-end against a live database (requires the pgMemento install step above).

```

```
