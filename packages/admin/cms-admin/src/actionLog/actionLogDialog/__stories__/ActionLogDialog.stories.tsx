import { ApolloClient, ApolloLink, ApolloProvider, InMemoryCache, Observable } from "@apollo/client";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { MemoryRouter } from "react-router";

import { ActionLogDialog } from "../ActionLogDialog";

const rootField = "manufacturer";
const entityId = "550e8400-e29b-41d4-a716-446655440000";

const mockGridNodes = [
    {
        __typename: "ActionLog" as const,
        id: "log3",
        userId: "Max Mustermann",
        entityName: "TestEntity",
        version: 3,
        createdAt: "2023-10-03T12:00:00Z",
    },
    {
        __typename: "ActionLog" as const,
        id: "log2",
        userId: "user2",
        entityName: "TestEntity",
        version: 2,
        createdAt: "2023-10-02T12:00:00Z",
    },
    {
        __typename: "ActionLog" as const,
        id: "log1",
        userId: "system-user",
        entityName: "TestEntity",
        version: 1,
        createdAt: "2023-10-01T12:00:00Z",
    },
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

const mockLink = new ApolloLink(
    (operation) =>
        new Observable((observer) => {
            const variables = operation.variables;
            const operationName = operation.operationName;
            if (operationName === "ActionLogDialogGrid") {
                observer.next({
                    data: {
                        entity: {
                            __typename: "Manufacturer",
                            actionLogs: { __typename: "PaginatedActionLogs", nodes: mockGridNodes, totalCount: mockGridNodes.length },
                        },
                    },
                });
            } else if (operationName === "ActionLogDialogShowVersion") {
                observer.next({
                    data: {
                        entity: {
                            __typename: "Manufacturer",
                            actionLog: mockVersionById[variables.versionId as string] ?? null,
                        },
                    },
                });
            } else if (operationName === "ActionLogDialogCompare") {
                observer.next({
                    data: {
                        entity: {
                            __typename: "Manufacturer",
                            beforeVersion: mockVersionById[variables.beforeVersionId as string] ?? null,
                            afterVersion: mockVersionById[variables.afterVersionId as string] ?? null,
                        },
                    },
                });
            } else {
                observer.next({ data: null });
            }
            observer.complete();
        }),
);

const mockClient = new ApolloClient({
    link: mockLink,
    cache: new InMemoryCache(),
});

type ActionLogDialogStoryArgs = {
    id: string;
    rootField: string;
    name?: string;
    open: boolean;
    onClose: () => void;
};

type Story = StoryObj<ActionLogDialogStoryArgs>;

const meta: Meta<ActionLogDialogStoryArgs> = {
    component: ActionLogDialog,
    decorators: [
        (Story) => (
            <ApolloProvider client={mockClient}>
                <MemoryRouter>
                    <Story />
                </MemoryRouter>
            </ApolloProvider>
        ),
    ],
    tags: ["!autodocs"],
    title: "Action log/Action log dialog",
    args: {
        id: entityId,
        rootField,
        name: "My Page",
        open: true,
        onClose: () => undefined,
    },
};

export default meta;

export const Default: Story = {};
