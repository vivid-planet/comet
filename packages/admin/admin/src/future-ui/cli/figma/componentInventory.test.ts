import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it, vi } from "vitest";

import { discoverComponentInventory } from "./componentInventory";
import type { FigmaFileClient } from "./figmaClient";

const fixturesDirectory = join(dirname(fileURLToPath(import.meta.url)), "__fixtures__");

function readFixture(name: string): unknown {
    return JSON.parse(readFileSync(join(fixturesDirectory, name), "utf8"));
}

function createClient(): FigmaFileClient {
    return { getFile: vi.fn(async () => readFixture("file.json")) };
}

describe("discoverComponentInventory", () => {
    async function discoverNames(): Promise<string[]> {
        const { components } = await discoverComponentInventory(createClient());
        return components.map((component) => component.name);
    }

    it("lists each component and set marked ready-for-dev or completed, with its version, id, type, and status", async () => {
        const { version, components } = await discoverComponentInventory(createClient());

        expect(version).toBe("2379321262469213295");
        expect(components).toEqual([
            { name: "Button", nodeId: "128:39", type: "COMPONENT_SET", devStatus: "READY_FOR_DEV" },
            { name: "Dialog Header", nodeId: "258:881", type: "COMPONENT", devStatus: "COMPLETED" },
            { name: "Chip", nodeId: "600:5", type: "COMPONENT_SET", devStatus: "READY_FOR_DEV" },
        ]);
    });

    it("skips a component set that carries no dev status", async () => {
        expect(await discoverNames()).not.toContain("Snackbar");
    });

    it("skips a non-public component whose name starts with an underscore", async () => {
        expect(await discoverNames()).not.toContain("_Internal Base");
    });

    it("does not list a matched set's variants as components of their own", async () => {
        expect(await discoverNames()).not.toContain("variant=primary");
    });
});
