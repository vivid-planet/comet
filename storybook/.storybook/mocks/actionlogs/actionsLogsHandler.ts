import type { GraphQLFieldResolver } from "graphql";

import { sleep } from "../handlers";

type ActionLog = {
    createdAt: string;
    entityId: string;
    entityName: string;
    id: string;
    snapshot: Record<string, unknown>;
    userId: string;
    version: number;
};
const actionLogs: ActionLog[] = [
    {
        createdAt: "2023-10-01T12:00:00Z",
        entityId: "1",
        entityName: "TestEntity",
        id: "log1",
        userId: "system-user",
        version: 1,
        snapshot: { key: "value", createdAt: "2023-10-01T12:00:00Z" },
    },
    {
        createdAt: "2023-10-02T12:00:00Z",
        entityId: "1",
        entityName: "TestEntity",
        id: "log2",
        userId: "user2",
        version: 2,
        snapshot: { key: "value2", createdAt: "2023-10-01T12:00:00Z" },
    },
    {
        createdAt: "2023-10-03T12:00:00Z",
        entityId: "1",
        entityName: "AnotherEntity",
        id: "log3",
        userId: "Max Mustermann",
        version: 3,
        snapshot: { key: "value3", createdAt: "2023-10-01T12:00:00Z" },
    },
];

type PaginatedActionLogs = {
    nodes: ActionLog[];
    totalCount: number;
};

export const actionsLogsHandler: GraphQLFieldResolver<unknown, unknown> = async () => {
    await sleep(500);
    return {
        nodes: actionLogs.reverse(),
        totalCount: actionLogs.length,
    } as PaginatedActionLogs;
};

export const actionLogHandler: GraphQLFieldResolver<unknown, { id: string }> = async (source, { id }) => {
    await sleep(500);

    const filteredActionLogs = id ? actionLogs.filter((log) => log.id === id) : [];
    if (filteredActionLogs.length > 0) {
        return filteredActionLogs[0];
    } else {
        throw new Error(`Action log with id: ${id} not found`);
    }
};
