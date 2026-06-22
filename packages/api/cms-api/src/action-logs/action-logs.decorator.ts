export const ACTION_LOGS_METADATA_KEY = "actionLogs";

export type ActionLogSnapshot = Record<string, unknown>;

/**
 * A single migration that brings a snapshot from version `toVersion - 1` up to `toVersion`.
 *
 * Snapshots stored in `ActionLog` are frozen copies of an entity at a point in time. When the entity's schema changes
 * (e.g. a renamed property or a changed enum value), older snapshots no longer match the current schema. A migration
 * is applied lazily when a snapshot is read and only when the snapshot's stored version is below its `toVersion`, so a
 * migration only ever receives a snapshot at exactly version `toVersion - 1` — it does not need to handle other versions.
 * The stored snapshots are never modified.
 */
export interface SnapshotMigration {
    /** Version this migration produces. Versions start at 1 and must be ascending, unique and gapless across an entity. */
    toVersion: number;
    migrate: (snapshot: ActionLogSnapshot) => ActionLogSnapshot;
}

export interface ActionLogsOptions {
    /**
     * Migrations that bring a snapshot up to the current schema.
     *
     * Add a new migration with the next `toVersion` whenever the entity's schema changes in a way that affects the
     * snapshot. Existing migrations must never be changed or removed, as that would alter the meaning of stored versions.
     */
    snapshotMigrations?: SnapshotMigration[];
}

export interface ActionLogMetadata {
    snapshotMigrations: SnapshotMigration[];
}

export function ActionLogs({ snapshotMigrations = [] }: ActionLogsOptions = {}): ClassDecorator {
    return (entity) => {
        Reflect.defineMetadata(ACTION_LOGS_METADATA_KEY, { snapshotMigrations } satisfies ActionLogMetadata, entity.prototype);
    };
}
