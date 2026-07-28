import type { Connection, EntityManager, Knex } from "@mikro-orm/postgresql";
import { Logger } from "@nestjs/common";
import { describe, expect, it, vi } from "vitest";

import type { EntityInfoService } from "../entity-info/entity-info.service";
import type { DependenciesConfig } from "./dependencies.constants";
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

function createService(
    rootBlocks: RootBlockStub[],
    config?: DependenciesConfig,
): {
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

    const service = new DependenciesService(discoverService, entityInfoService, entityManager, config);

    return { service, executedStatements };
}

interface RecordedRawCall {
    sql: string;
    bindings?: readonly unknown[];
}

function createTransactionStub({ failOnRefresh = false }: { failOnRefresh?: boolean } = {}): {
    trx: Knex.Transaction;
    rawCalls: RecordedRawCall[];
} {
    const rawCalls: RecordedRawCall[] = [];

    const trx = {
        raw: vi.fn((sql: string, bindings?: readonly unknown[]) => {
            rawCalls.push({ sql, bindings });
            if (failOnRefresh && sql.includes("REFRESH MATERIALIZED VIEW")) {
                return Promise.reject(new Error("canceling statement due to statement timeout"));
            }
            return Promise.resolve({ rows: [] });
        }),
    } as unknown as Knex.Transaction;

    return { trx, rawCalls };
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

    describe("refreshBlockIndexDependenciesView", () => {
        async function runRefresh(config: DependenciesConfig | undefined, options: { concurrently?: boolean; failOnRefresh?: boolean } = {}) {
            const { service } = createService([], config);
            const { trx, rawCalls } = createTransactionStub({ failOnRefresh: options.failOnRefresh });
            const run = service["refreshBlockIndexDependenciesView"](trx, { concurrently: options.concurrently ?? false, refreshId: "refresh-id" });
            return { run, rawCalls };
        }

        it("applies configured work_mem and statement_timeout transaction-locally before the refresh", async () => {
            const { run, rawCalls } = await runRefresh({ blockIndexRefresh: { workMem: "64MB", statementTimeout: 30000 } });
            await run;

            expect(rawCalls).toHaveLength(3);
            expect(rawCalls[0].sql).toContain("set_config('work_mem'");
            expect(rawCalls[0].bindings).toEqual(["64MB"]);
            expect(rawCalls[1].sql).toContain("set_config('statement_timeout'");
            expect(rawCalls[1].bindings).toEqual(["30000"]);
            expect(rawCalls[2].sql).toContain("REFRESH MATERIALIZED VIEW");
        });

        it("does not emit any SET when no limits are configured", async () => {
            const { run, rawCalls } = await runRefresh(undefined);
            await run;

            expect(rawCalls).toHaveLength(1);
            expect(rawCalls[0].sql).toContain("REFRESH MATERIALIZED VIEW");
            expect(rawCalls.some((call) => call.sql.includes("set_config"))).toBe(false);
        });

        it("treats statement_timeout of 0 as disabled and does not emit it", async () => {
            const { run, rawCalls } = await runRefresh({ blockIndexRefresh: { workMem: "64MB", statementTimeout: 0 } });
            await run;

            expect(rawCalls).toHaveLength(2);
            expect(rawCalls[0].sql).toContain("set_config('work_mem'");
            expect(rawCalls.some((call) => call.sql.includes("statement_timeout"))).toBe(false);
        });

        it("refreshes CONCURRENTLY only when requested", async () => {
            const { run: concurrentRun, rawCalls: concurrentCalls } = await runRefresh(undefined, { concurrently: true });
            await concurrentRun;
            expect(concurrentCalls[0].sql).toContain("CONCURRENTLY");

            const { run: blockingRun, rawCalls: blockingCalls } = await runRefresh(undefined, { concurrently: false });
            await blockingRun;
            expect(blockingCalls[0].sql).not.toContain("CONCURRENTLY");
        });

        it("logs the refresh id and applied limits and rethrows when the refresh fails", async () => {
            const loggerError = vi.spyOn(Logger.prototype, "error").mockImplementation(() => undefined);
            try {
                const { run } = await runRefresh({ blockIndexRefresh: { workMem: "64MB", statementTimeout: 30000 } }, { failOnRefresh: true });
                await expect(run).rejects.toThrow("canceling statement due to statement timeout");

                expect(loggerError).toHaveBeenCalledTimes(1);
                const message = loggerError.mock.calls[0][0];
                expect(message).toContain("refresh-id");
                expect(message).toContain("work_mem=64MB");
                expect(message).toContain("statement_timeout=30000ms");
            } finally {
                loggerError.mockRestore();
            }
        });
    });
});
