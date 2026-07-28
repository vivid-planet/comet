import type { Connection, EntityManager } from "@mikro-orm/postgresql";
import { describe, expect, it, vi } from "vitest";

import type { EntityInfoService } from "../entity-info/entity-info.service";
import { DependenciesService } from "./dependencies.service";
import type { DiscoverService } from "./discover.service";

// The `block_index_dependencies` materialized view must join the `EntityInfo` view exactly twice
// (once for the root entity, once for the target entity) over the union of all root blocks — never
// per root block. `EntityInfo` is a UNION over every entity including a recursive DAM folder-path
// CTE, so joining it per root block scales its (very expensive) evaluation with the number of root
// blocks. That regression shipped in https://github.com/vivid-planet/comet/pull/4999, went unnoticed
// for six months, and OOM-killed database servers in production before being fixed in
// https://github.com/vivid-planet/comet/pull/6043. These tests fail the moment the number of
// `EntityInfo` references starts scaling with the number of root blocks again.
const EXPECTED_ENTITY_INFO_REFERENCES = 2;

interface RootBlockStub {
    metadata: { tableName: string; name: string; primaryKeys: string[] };
    column: string;
    graphqlObjectType: string;
}

interface TargetEntityStub {
    entityName: string;
    metadata: { tableName: string; primaryKeys: string[] };
    graphqlObjectType: string;
}

function createRootBlocks(count: number): RootBlockStub[] {
    return Array.from({ length: count }, (_, index) => ({
        metadata: { tableName: `RootTable${index}`, name: `RootEntity${index}`, primaryKeys: ["id"] },
        column: "content",
        graphqlObjectType: `RootEntity${index}`,
    }));
}

const targetEntities: TargetEntityStub[] = [
    { entityName: "Page", metadata: { tableName: "Page", primaryKeys: ["id"] }, graphqlObjectType: "Page" },
    { entityName: "News", metadata: { tableName: "News", primaryKeys: ["id"] }, graphqlObjectType: "News" },
];

function createService(rootBlocks: RootBlockStub[]): {
    service: DependenciesService;
    executedStatements: string[];
} {
    const executedStatements: string[] = [];

    const connection = {
        execute: vi.fn((sql: string) => {
            executedStatements.push(sql);
            return Promise.resolve([]);
        }),
    } as unknown as Connection;

    const entityManager = {
        getConnection: () => connection,
    } as unknown as EntityManager;

    const discoverService = {
        discoverRootBlocks: () => rootBlocks,
        discoverTargetEntities: () => targetEntities,
    } as unknown as DiscoverService;

    const entityInfoService = {} as unknown as EntityInfoService;

    const service = new DependenciesService(discoverService, entityInfoService, entityManager);

    return { service, executedStatements };
}

function findStatement(statements: string[], marker: string): string {
    const statement = statements.find((sql) => sql.includes(marker));
    if (!statement) {
        throw new Error(`No executed statement contained "${marker}"`);
    }
    return statement;
}

function countOccurrences(haystack: string, needle: string | RegExp): number {
    const regExp = typeof needle === "string" ? new RegExp(needle.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "g") : needle;
    return (haystack.match(regExp) ?? []).length;
}

describe("DependenciesService", () => {
    describe("createDependenciesView", () => {
        it.each([1, 5, 25])("references the EntityInfo view exactly twice for %i root blocks", async (rootBlockCount) => {
            const { service, executedStatements } = createService(createRootBlocks(rootBlockCount));

            await service["createDependenciesView"]();

            const createStatement = findStatement(executedStatements, "CREATE MATERIALIZED VIEW block_index_dependencies");
            expect(countOccurrences(createStatement, '"EntityInfo"')).toBe(EXPECTED_ENTITY_INFO_REFERENCES);
        });

        it.each([
            [1, 0],
            [5, 4],
            [25, 24],
        ])("joins the root blocks with one UNION ALL per additional root block (%i root blocks)", async (rootBlockCount, expectedUnions) => {
            const { service, executedStatements } = createService(createRootBlocks(rootBlockCount));

            await service["createDependenciesView"]();

            const createStatement = findStatement(executedStatements, "CREATE MATERIALIZED VIEW block_index_dependencies");
            expect(countOccurrences(createStatement, "UNION ALL")).toBe(expectedUnions);
        });

        it("does not create the view when there are no root blocks", async () => {
            const { service, executedStatements } = createService([]);

            await service["createDependenciesView"]();

            expect(executedStatements.some((sql) => sql.includes("CREATE MATERIALIZED VIEW"))).toBe(false);
        });

        it("generates stable SQL for a fixed set of root blocks", async () => {
            const { service, executedStatements } = createService(createRootBlocks(2));

            await service["createDependenciesView"]();

            const createStatement = findStatement(executedStatements, "CREATE MATERIALIZED VIEW block_index_dependencies");
            expect(createStatement).toMatchSnapshot();
        });
    });

    describe("createBlockIndexView", () => {
        it.each([
            [1, 0],
            [5, 4],
            [25, 24],
        ])("joins the root blocks with one UNION ALL per additional root block (%i root blocks)", async (rootBlockCount, expectedUnions) => {
            const { service, executedStatements } = createService(createRootBlocks(rootBlockCount));

            await service["createBlockIndexView"]();

            const createStatement = findStatement(executedStatements, "CREATE VIEW block_index");
            expect(countOccurrences(createStatement, "UNION ALL")).toBe(expectedUnions);
        });

        it("does not create the view when there are no root blocks", async () => {
            const { service, executedStatements } = createService([]);

            await service["createBlockIndexView"]();

            expect(executedStatements.some((sql) => sql.includes("CREATE VIEW block_index"))).toBe(false);
        });

        it("generates stable SQL for a fixed set of root blocks", async () => {
            const { service, executedStatements } = createService(createRootBlocks(2));

            await service["createBlockIndexView"]();

            const createStatement = findStatement(executedStatements, "CREATE VIEW block_index");
            expect(createStatement).toMatchSnapshot();
        });
    });
});
