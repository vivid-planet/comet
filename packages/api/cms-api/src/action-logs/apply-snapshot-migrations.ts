import type { ActionLogSnapshot, SnapshotMigration } from "./action-logs.decorator";

/**
 * Applies the migrations needed to bring a snapshot from the schema it was stored with up to the current schema.
 *
 * `snapshotVersion` is the number of migrations that were already reflected when the snapshot was stored, so it
 * defines where to continue. Snapshots stored before snapshot migrations existed have no version (`undefined`) and
 * run through all migrations.
 */
export function applySnapshotMigrations({
    snapshot,
    snapshotVersion,
    migrations,
}: {
    snapshot: ActionLogSnapshot;
    snapshotVersion?: number;
    migrations: SnapshotMigration[];
}): ActionLogSnapshot {
    const fromVersion = snapshotVersion ?? 0;
    return migrations.slice(fromVersion).reduce((migratedSnapshot, migrate) => migrate(migratedSnapshot), snapshot);
}
