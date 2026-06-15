import { graphql, HttpResponse } from "msw";

const mockNodes = [
    {
        __typename: "ActionLog",
        id: "log4",
        userId: "Alice",
        entityName: "Page",
        entityId: "550e8400-e29b-41d4-a716-446655440004",
        version: 1,
        snapshot: null,
        previousVersion: {
            __typename: "ActionLog",
            snapshot: { title: "Imprint", slug: "imprint" },
        },
        scope: [{ domain: "main", language: "en" }],
        createdAt: "2026-05-28T09:00:00Z",
    },
    {
        __typename: "ActionLog",
        id: "log3",
        userId: "Bob",
        entityName: "News",
        entityId: "550e8400-e29b-41d4-a716-446655440003",
        version: 3,
        snapshot: { title: "Release 9.0", slug: "release-9-0" },
        previousVersion: {
            __typename: "ActionLog",
            snapshot: { title: "Release 9.0 (draft)", slug: "release-9-0" },
        },
        scope: [{ domain: "main", language: "en" }],
        createdAt: "2026-05-27T15:30:00Z",
    },
    {
        __typename: "ActionLog",
        id: "log2",
        userId: "Bob",
        entityName: "News",
        entityId: "550e8400-e29b-41d4-a716-446655440003",
        version: 2,
        snapshot: { title: "Release 9.0 (draft)", slug: "release-9-0" },
        previousVersion: {
            __typename: "ActionLog",
            snapshot: { title: "Release", slug: "release" },
        },
        scope: [{ domain: "main", language: "en" }],
        createdAt: "2026-05-27T14:00:00Z",
    },
    {
        __typename: "ActionLog",
        id: "log1",
        userId: "Bob",
        entityName: "News",
        entityId: "550e8400-e29b-41d4-a716-446655440003",
        version: 1,
        snapshot: { title: "Release", slug: "release" },
        previousVersion: null,
        scope: [{ domain: "main", language: "en" }],
        createdAt: "2026-05-27T13:00:00Z",
    },
];

const versionById: Record<string, (typeof mockNodes)[number]> = Object.fromEntries(mockNodes.map((node) => [node.id, node]));

export const globalActionLogHandlers = [
    graphql.query("GlobalActionLogGrid", () =>
        HttpResponse.json({
            data: {
                actionLogs: { __typename: "PaginatedActionLogs", nodes: mockNodes, totalCount: mockNodes.length },
            },
        }),
    ),
    graphql.query("GlobalActionLogShowVersion", ({ variables }) =>
        HttpResponse.json({
            data: { actionLog: versionById[variables.id as string] ?? null },
        }),
    ),
    graphql.query("GlobalActionLogDialogGrid", () =>
        HttpResponse.json({
            data: {
                actionLogs: { __typename: "PaginatedActionLogs", nodes: mockNodes.slice(1), totalCount: mockNodes.length - 1 },
            },
        }),
    ),
    graphql.query("GlobalActionLogDialogShowVersion", ({ variables }) =>
        HttpResponse.json({
            data: { actionLog: versionById[variables.id as string] ?? null },
        }),
    ),
    graphql.query("GlobalActionLogDialogCompare", ({ variables }) =>
        HttpResponse.json({
            data: {
                beforeVersion: versionById[variables.beforeId as string] ?? null,
                afterVersion: versionById[variables.afterId as string] ?? null,
            },
        }),
    ),
];
