import { describe, expect, it } from "vitest";

import type { SnapshotMigration } from "./action-logs.decorator";
import { applySnapshotMigrations } from "./apply-snapshot-migrations";

const renameStatusValue: SnapshotMigration = (snapshot) => ({
    ...snapshot,
    status: snapshot.status === "Active" ? "active" : snapshot.status,
});

const removeLegacyField: SnapshotMigration = ({ legacy: _legacy, ...rest }) => rest;

describe("applySnapshotMigrations", () => {
    it("returns the snapshot unchanged when there are no migrations", () => {
        const snapshot = { status: "Active" };

        expect(applySnapshotMigrations({ snapshot, migrations: [] })).toEqual({ status: "Active" });
    });

    it("applies all migrations for a snapshot without a version (created before migrations existed)", () => {
        const snapshot = { status: "Active", legacy: "remove me" };

        expect(applySnapshotMigrations({ snapshot, migrations: [renameStatusValue, removeLegacyField] })).toEqual({ status: "active" });
    });

    it("skips migrations that were already reflected in the stored version", () => {
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

    it("applies migrations in order", () => {
        const appendA: SnapshotMigration = (snapshot) => ({ ...snapshot, order: `${snapshot.order ?? ""}A` });
        const appendB: SnapshotMigration = (snapshot) => ({ ...snapshot, order: `${snapshot.order ?? ""}B` });

        expect(applySnapshotMigrations({ snapshot: {}, migrations: [appendA, appendB] })).toEqual({ order: "AB" });
    });
});
