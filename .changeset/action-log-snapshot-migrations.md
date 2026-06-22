---
"@comet/cms-api": minor
---

Add `snapshotMigrations` option to the `@ActionLogs()` decorator

Snapshots stored in `ActionLog` are frozen copies of an entity at a point in time. When an entity's schema changes (e.g. a renamed property or a changed enum value), older snapshots no longer match the current schema. `snapshotMigrations` lets you declare versioned migrations that bring such snapshots up to the current schema. Migrations are applied lazily when a snapshot is read — the stored snapshots are not modified.

Each migration declares the version it produces via `toVersion`, and each `ActionLog` stores the version its snapshot was created at. On read, only migrations with a `toVersion` above the stored version run, in ascending order. This means a migration only ever receives a snapshot at exactly version `toVersion - 1`, so it does not need to handle other versions, and snapshots already at the current version are never touched. Snapshots created before this feature existed have no version and run through all migrations.

**Example**

```ts
const migrateStatusToCamelCase: SnapshotMigration = {
    toVersion: 1,
    migrate: (snapshot) => ({
        ...snapshot,
        status: snapshot.status === "Active" ? "active" : snapshot.status,
    }),
};

@Entity()
@ActionLogs({ snapshotMigrations: [migrateStatusToCamelCase] })
export class News extends BaseEntity {
    // ...
}
```

Add a new migration with the next `toVersion` whenever the entity's schema changes in a way that affects the snapshot. Versions must start at 1 and be ascending, unique and gapless. Existing migrations must never be changed or removed, as that would alter the meaning of stored versions.
