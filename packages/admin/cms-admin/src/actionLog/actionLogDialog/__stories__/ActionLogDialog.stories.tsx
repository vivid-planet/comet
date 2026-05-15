import { useDataGridRemote, usePersistentColumnState } from "@comet/admin";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { MemoryRouter } from "react-router";

import type { GQLActionLogGridFragmentFragment } from "../../actionLogGrid/ActionLogGrid.gql.generated";
import { ActionLogDialog, type ActionLogDialogValue } from "../ActionLogDialog";

const mockActionLogs = {
    totalCount: 3,
    nodes: [
        {
            __typename: "ActionLog" as const,
            id: "log3",
            userId: "Max Mustermann",
            entityName: "TestEntity",
            version: 3,
            createdAt: "2023-10-03T12:00:00Z",
        },
        { __typename: "ActionLog" as const, id: "log2", userId: "user2", entityName: "TestEntity", version: 2, createdAt: "2023-10-02T12:00:00Z" },
        {
            __typename: "ActionLog" as const,
            id: "log1",
            userId: "system-user",
            entityName: "TestEntity",
            version: 1,
            createdAt: "2023-10-01T12:00:00Z",
        },
    ],
};

const mockActionLog = {
    __typename: "ActionLog" as const,
    id: "log1",
    version: 1,
    snapshot: { title: "My Page", slug: "my-page", createdAt: "2023-10-01T12:00:00Z" },
    createdAt: "2023-10-01T12:00:00Z",
    userId: "system-user",
    entityName: "TestEntity",
};

const mockVersion1 = {
    __typename: "ActionLog" as const,
    id: "log1",
    version: 1,
    snapshot: { title: "My Page", slug: "my-page", createdAt: "2023-10-01T12:00:00Z" },
    createdAt: "2023-10-01T12:00:00Z",
    userId: "system-user",
    entityName: "TestEntity",
};

const mockVersion2 = {
    __typename: "ActionLog" as const,
    id: "log2",
    version: 2,
    snapshot: { title: "My Page (updated)", slug: "my-page", createdAt: "2023-10-01T12:00:00Z" },
    createdAt: "2023-10-02T12:00:00Z",
    userId: "user2",
    entityName: "TestEntity",
};

type Story = StoryObj<typeof ActionLogDialog>;
const meta: Meta<typeof ActionLogDialog> = {
    component: ActionLogDialog,
    decorators: [
        (Story) => (
            <MemoryRouter>
                <Story />
            </MemoryRouter>
        ),
    ],
    tags: ["!autodocs"],
    title: "Action log/Action log dialog",
    args: {
        id: "550e8400-e29b-41d4-a716-446655440000",
        name: "My Page",
        onClose: () => undefined,
        open: true,
    },
};
export default meta;

const mockActionLogById: Record<string, typeof mockActionLog> = {
    log1: mockActionLog,
    log2: { ...mockVersion2, snapshot: mockVersion2.snapshot },
    log3: {
        __typename: "ActionLog",
        id: "log3",
        version: 3,
        snapshot: { title: "My Page (v3)", slug: "my-page", createdAt: "2023-10-03T12:00:00Z" },
        createdAt: "2023-10-03T12:00:00Z",
        userId: "Max Mustermann",
        entityName: "TestEntity",
    },
};

type StoryValue =
    | { type: "grid"; actionLogs: { nodes: GQLActionLogGridFragmentFragment[]; totalCount: number } | undefined; error?: boolean; loading: boolean }
    | Exclude<ActionLogDialogValue, { type: "grid" }>;

const StoryWrapper = (args: Omit<React.ComponentProps<typeof ActionLogDialog>, "value"> & { initialState: StoryValue }) => {
    const { initialState, ...rest } = args;
    const [storyValue, setStoryValue] = useState<StoryValue>(initialState);
    const dataGridProps = {
        ...useDataGridRemote({ initialSort: [{ field: "version", sort: "desc" }] }),
        ...usePersistentColumnState("ActionLogDialogGrid"),
    };
    const value: ActionLogDialogValue = storyValue.type === "grid" ? { ...dataGridProps, ...storyValue } : storyValue;

    return (
        <ActionLogDialog
            {...rest}
            value={value}
            onShowVersionClick={(versionId) =>
                setStoryValue({ type: "showVersion", actionLog: mockActionLogById[versionId] ?? mockActionLog, loading: false })
            }
            onCompareVersionsClick={(versionId, versionId2) =>
                setStoryValue({
                    type: "compareVersions",
                    beforeVersion: mockActionLogById[versionId] ?? mockVersion1,
                    afterVersion: mockActionLogById[versionId2] ?? mockVersion2,
                    loading: false,
                })
            }
            onShowVersionHistoryClick={() => setStoryValue({ type: "grid", actionLogs: mockActionLogs, loading: false })}
        />
    );
};

export const Grid: Story = {
    render: (args) => <StoryWrapper {...args} initialState={{ type: "grid", actionLogs: mockActionLogs, loading: false }} />,
};

export const GridLoading: Story = {
    render: (args) => <StoryWrapper {...args} initialState={{ type: "grid", actionLogs: undefined, loading: true }} />,
};

export const GridError: Story = {
    render: (args) => <StoryWrapper {...args} initialState={{ type: "grid", actionLogs: undefined, loading: false, error: true }} />,
};

export const ShowVersion: Story = {
    render: (args) => <StoryWrapper {...args} initialState={{ type: "showVersion", actionLog: mockActionLog, loading: false }} />,
};

export const ShowVersionLoading: Story = {
    render: (args) => <StoryWrapper {...args} initialState={{ type: "showVersion", actionLog: undefined, loading: true }} />,
};

export const CompareVersions: Story = {
    render: (args) => (
        <StoryWrapper
            {...args}
            initialState={{
                type: "compareVersions",
                beforeVersion: mockVersion1,
                afterVersion: mockVersion2,
                loading: false,
            }}
        />
    ),
};

export const CompareVersionsLoading: Story = {
    render: (args) => (
        <StoryWrapper
            {...args}
            initialState={{
                type: "compareVersions",
                beforeVersion: undefined,
                afterVersion: undefined,
                loading: true,
            }}
        />
    ),
};
