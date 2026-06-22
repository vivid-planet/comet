import type { ActionLogSnapshot, SnapshotMigration } from "./action-logs.decorator";

function sortByVersion(migrations: SnapshotMigration[]): SnapshotMigration[] {
    return [...migrations].sort((a, b) => a.toVersion - b.toVersion);
}

function assertMigrationsInSequence(migrations: SnapshotMigration[]): void {
    sortByVersion(migrations).forEach((migration, index) => {
        if (migration.toVersion !== index + 1) {
            throw new Error("ActionLog snapshotMigrations must have toVersion values starting at 1 that are ascending, unique and gapless.");
        }
    });
}

/**
 * Version a snapshot is created at: the highest available migration version, or 0 when there are no migrations.
 */
export function getCurrentSnapshotVersion(migrations: SnapshotMigration[]): number {
    assertMigrationsInSequence(migrations);
    return migrations.length;
}

/**
 * Applies the migrations needed to bring a snapshot from its stored version up to the current schema.
 *
 * Only migrations with a `toVersion` greater than the snapshot's stored version run, in ascending order. Snapshots
 * stored before snapshot migrations existed have no version (`undefined`, treated as 0) and run through all migrations.
 */
export function applySnapshotMigrations({
    snapshot,
    snapshotVersion = 0,
    migrations,
}: {
    snapshot: ActionLogSnapshot;
    snapshotVersion?: number;
    migrations: SnapshotMigration[];
}): ActionLogSnapshot {
    assertMigrationsInSequence(migrations);
    return sortByVersion(migrations)
        .filter((migration) => migration.toVersion > snapshotVersion)
        .reduce((migratedSnapshot, migration) => migration.migrate(migratedSnapshot), snapshot);
}
