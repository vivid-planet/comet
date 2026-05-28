import type { Meta, StoryObj } from "@storybook/react-vite";
import { MemoryRouter } from "react-router";

import { ActionLogShowVersion } from "../ActionLogShowVersion";

const mockActionLog = {
    __typename: "ActionLog" as const,
    id: "log1",
    version: 1,
    snapshot: { title: "My Page", slug: "my-page", createdAt: "2023-10-01T12:00:00Z" },
    createdAt: "2023-10-01T12:00:00Z",
    userId: "1",
    user: { __typename: "ActionLogUser" as const, id: "1", name: "Max Mustermann" },
    entityName: "TestEntity",
};

type Story = StoryObj<typeof ActionLogShowVersion>;
const meta: Meta<typeof ActionLogShowVersion> = {
    component: ActionLogShowVersion,
    decorators: [
        (Story) => (
            <MemoryRouter>
                <Story />
            </MemoryRouter>
        ),
    ],
    tags: ["!autodocs"],
    title: "Action log/Action log show version",
    args: {
        onClickShowVersionHistory: () => undefined,
    },
};
export default meta;

export const Standard: Story = {
    args: {
        actionLog: mockActionLog,
        id: "550e8400-e29b-41d4-a716-446655440000",
        loading: false,
        name: "My Page",
    },
};

export const Loading: Story = {
    args: {
        actionLog: undefined,
        id: "550e8400-e29b-41d4-a716-446655440000",
        loading: true,
    },
};

export const NotFound: Story = {
    args: {
        actionLog: undefined,
        id: "550e8400-e29b-41d4-a716-446655440000",
        loading: false,
    },
};

export const Error: Story = {
    args: {
        actionLog: undefined,
        error: true,
        id: "550e8400-e29b-41d4-a716-446655440000",
        loading: false,
    },
};
