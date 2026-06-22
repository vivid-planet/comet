import { describe, expect, it } from "vitest";

import { GROUPED_ACTION_LOGS_METADATA_KEY, GroupedActionLogs, type GroupedActionLogsMetadata } from "./grouped-action-logs.decorator";

function getGroupedRelations(target: object): GroupedActionLogsMetadata | undefined {
    return Reflect.getMetadata(GROUPED_ACTION_LOGS_METADATA_KEY, target);
}

describe("GroupedActionLogs", () => {
    it("stores the decorated relation name as metadata", () => {
        class Entity {
            @GroupedActionLogs()
            colors: unknown[] = [];
        }

        expect(getGroupedRelations(Entity.prototype)).toEqual(["colors"]);
    });

    it("collects multiple decorated relations", () => {
        class Entity {
            @GroupedActionLogs()
            colors: unknown[] = [];

            @GroupedActionLogs()
            tags: unknown[] = [];
        }

        expect(getGroupedRelations(Entity.prototype)).toEqual(["colors", "tags"]);
    });

    it("does not add metadata to entities without the decorator", () => {
        class Entity {
            colors: unknown[] = [];
        }

        expect(getGroupedRelations(Entity.prototype)).toBeUndefined();
    });
});
