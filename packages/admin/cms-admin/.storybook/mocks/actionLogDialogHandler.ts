import { graphql, HttpResponse } from "msw";

const mockGridNodes = [
    { __typename: "ActionLog", id: "log3", userId: "Max Mustermann", entityName: "TestEntity", version: 3, createdAt: "2023-10-03T12:00:00Z" },
    { __typename: "ActionLog", id: "log2", userId: "user2", entityName: "TestEntity", version: 2, createdAt: "2023-10-02T12:00:00Z" },
    { __typename: "ActionLog", id: "log1", userId: "system-user", entityName: "TestEntity", version: 1, createdAt: "2023-10-01T12:00:00Z" },
];

const mockVersionById: Record<
    string,
    { __typename: "ActionLog"; id: string; version: number; userId: string; entityName: string; snapshot: object; createdAt: string }
> = {
    log1: {
        __typename: "ActionLog",
        id: "log1",
        version: 1,
        userId: "system-user",
        entityName: "TestEntity",
        snapshot: { title: "My Page", slug: "my-page", createdAt: "2023-10-01T12:00:00Z" },
        createdAt: "2023-10-01T12:00:00Z",
    },
    log2: {
        __typename: "ActionLog",
        id: "log2",
        version: 2,
        userId: "user2",
        entityName: "TestEntity",
        snapshot: { title: "My Page (updated)", slug: "my-page", createdAt: "2023-10-01T12:00:00Z" },
        createdAt: "2023-10-02T12:00:00Z",
    },
    log3: {
        __typename: "ActionLog",
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
            data: {
                entity: {
                    __typename: "Manufacturer",
                    actionLogs: { __typename: "PaginatedActionLogs", nodes: mockGridNodes, totalCount: mockGridNodes.length },
                },
            },
        }),
    ),
    graphql.query("ActionLogDialogShowVersion", ({ variables }) =>
        HttpResponse.json({
            data: {
                entity: {
                    __typename: "Manufacturer",
                    actionLog: mockVersionById[variables.versionId] ?? null,
                },
            },
        }),
    ),
    graphql.query("ActionLogDialogCompare", ({ variables }) =>
        HttpResponse.json({
            data: {
                entity: {
                    __typename: "Manufacturer",
                    beforeVersion: mockVersionById[variables.beforeVersionId] ?? null,
                    afterVersion: mockVersionById[variables.afterVersionId] ?? null,
                },
            },
        }),
    ),
];
