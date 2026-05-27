import { graphql, HttpResponse } from "msw";

const mockGridNodes = [
    { id: "log3", userId: "Max Mustermann", entityName: "TestEntity", version: 3, createdAt: "2023-10-03T12:00:00Z" },
    { id: "log2", userId: "user2", entityName: "TestEntity", version: 2, createdAt: "2023-10-02T12:00:00Z" },
    { id: "log1", userId: "system-user", entityName: "TestEntity", version: 1, createdAt: "2023-10-01T12:00:00Z" },
];

const mockVersionById: Record<string, { id: string; version: number; userId: string; entityName: string; snapshot: object; createdAt: string }> = {
    log1: {
        id: "log1",
        version: 1,
        userId: "system-user",
        entityName: "TestEntity",
        snapshot: { title: "My Page", slug: "my-page", createdAt: "2023-10-01T12:00:00Z" },
        createdAt: "2023-10-01T12:00:00Z",
    },
    log2: {
        id: "log2",
        version: 2,
        userId: "user2",
        entityName: "TestEntity",
        snapshot: { title: "My Page (updated)", slug: "my-page", createdAt: "2023-10-01T12:00:00Z" },
        createdAt: "2023-10-02T12:00:00Z",
    },
    log3: {
        id: "log3",
        version: 3,
        userId: "Max Mustermann",
        entityName: "TestEntity",
        snapshot: { title: "My Page (v3)", slug: "my-page", createdAt: "2023-10-03T12:00:00Z" },
        createdAt: "2023-10-03T12:00:00Z",
    },
};

export const actionLogDialogHandlers = [
    graphql.query("ActionLogDialogGrid", () =>
        HttpResponse.json({
            data: { entity: { actionLogs: { nodes: mockGridNodes, totalCount: mockGridNodes.length } } },
        }),
    ),
    graphql.query("ActionLogDialogShowVersion", ({ variables }) =>
        HttpResponse.json({
            data: { entity: { actionLog: mockVersionById[variables.versionId] ?? null } },
        }),
    ),
    graphql.query("ActionLogDialogCompare", ({ variables }) =>
        HttpResponse.json({
            data: {
                entity: {
                    beforeVersion: mockVersionById[variables.beforeVersionId] ?? null,
                    afterVersion: mockVersionById[variables.afterVersionId] ?? null,
                },
            },
        }),
    ),
];
