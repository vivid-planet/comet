import { describe, expect, it } from "vitest";

import type { SnapshotMigration } from "./action-logs.decorator";
import { applySnapshotMigrations, getCurrentSnapshotVersion } from "./apply-snapshot-migrations";

const renameStatusValue: SnapshotMigration = {
    toVersion: 1,
    migrate: (snapshot) => ({ ...snapshot, status: snapshot.status === "Active" ? "active" : snapshot.status }),
};

const removeLegacyField: SnapshotMigration = {
    toVersion: 2,
    migrate: ({ legacy: _legacy, ...rest }) => rest,
};

describe("applySnapshotMigrations", () => {
    it("returns the snapshot unchanged when there are no migrations", () => {
        const snapshot = { status: "Active" };

        expect(applySnapshotMigrations({ snapshot, migrations: [] })).toEqual({ status: "Active" });
    });

    it("applies all migrations for a snapshot without a version (created before migrations existed)", () => {
        const snapshot = { status: "Active", legacy: "remove me" };

        expect(applySnapshotMigrations({ snapshot, migrations: [renameStatusValue, removeLegacyField] })).toEqual({ status: "active" });
    });

    it("only applies migrations with a toVersion above the stored version", () => {
        const snapshot = { status: "active", legacy: "remove me" };

        expect(applySnapshotMigrations({ snapshot, snapshotVersion: 1, migrations: [renameStatusValue, removeLegacyField] })).toEqual({
            status: "active",
        });
    });

    it("applies no migrations when the snapshot is already at the latest version", () => {
        const snapshot = { status: "active" };

        expect(applySnapshotMigrations({ snapshot, snapshotVersion: 2, migrations: [renameStatusValue, removeLegacyField] })).toEqual({
            status: "active",
        });
    });

    it("applies migrations in ascending toVersion order regardless of array order", () => {
        const appendA: SnapshotMigration = { toVersion: 1, migrate: (snapshot) => ({ ...snapshot, order: `${snapshot.order ?? ""}A` }) };
        const appendB: SnapshotMigration = { toVersion: 2, migrate: (snapshot) => ({ ...snapshot, order: `${snapshot.order ?? ""}B` }) };

        expect(applySnapshotMigrations({ snapshot: {}, migrations: [appendB, appendA] })).toEqual({ order: "AB" });
    });

    it("throws when migration versions are not gapless starting at 1", () => {
        const gapMigration: SnapshotMigration = { toVersion: 3, migrate: (snapshot) => snapshot };

        expect(() => applySnapshotMigrations({ snapshot: {}, migrations: [renameStatusValue, gapMigration] })).toThrow();
    });
});

describe("getCurrentSnapshotVersion", () => {
    it("returns 0 when there are no migrations", () => {
        expect(getCurrentSnapshotVersion([])).toBe(0);
    });

    it("returns the highest version", () => {
        expect(getCurrentSnapshotVersion([renameStatusValue, removeLegacyField])).toBe(2);
    });
});
