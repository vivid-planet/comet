import { useDataGridRemote, usePersistentColumnState } from "@comet/admin";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { MemoryRouter } from "react-router";

import { ActionLogGrid } from "../ActionLogGrid";

const mockActionLogs = {
    totalCount: 3,
    nodes: [
        {
            id: "log3",
            user: { id: "1", name: "Max Mustermann" },
            entityName: "TestEntity",
            version: 3,
            createdAt: "2023-10-03T12:00:00Z",
        },
        {
            id: "log2",
            user: { id: "2", name: "Jane Doe" },
            entityName: "TestEntity",
            version: 2,
            createdAt: "2023-10-02T12:00:00Z",
        },
        {
            id: "log1",
            user: { id: "deleted-user-id", name: null },
            entityName: "TestEntity",
            version: 1,
            createdAt: "2023-10-01T12:00:00Z",
        },
    ],
};

type Story = StoryObj<typeof ActionLogGrid>;
const meta: Meta<typeof ActionLogGrid> = {
    component: ActionLogGrid,
    decorators: [
        (Story) => (
            <MemoryRouter>
                <Story />
            </MemoryRouter>
        ),
    ],
    tags: ["!autodocs"],
    title: "Action log/Action log grid",
};
export default meta;

const StandardStory = (args: React.ComponentProps<typeof ActionLogGrid>) => {
    const dataGridProps = {
        ...useDataGridRemote({ initialSort: [{ field: "version", sort: "desc" }] }),
        ...usePersistentColumnState("ActionLogGrid"),
    };
    return <ActionLogGrid {...args} {...dataGridProps} />;
};

export const Standard: Story = {
    render: (args) => <StandardStory {...args} />,
    args: {
        actionLogs: mockActionLogs,
        id: "550e8400-e29b-41d4-a716-446655440000",
        loading: false,
        onShowVersionClick: () => undefined,
        onCompareVersionsClick: () => undefined,
    },
};
