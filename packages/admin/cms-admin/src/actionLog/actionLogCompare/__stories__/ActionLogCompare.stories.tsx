import type { Meta, StoryObj } from "@storybook/react-vite";
import { MemoryRouter } from "react-router";

import { ActionLogCompare } from "../ActionLogCompare";

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

type Story = StoryObj<typeof ActionLogCompare>;
const meta: Meta<typeof ActionLogCompare> = {
    component: ActionLogCompare,
    decorators: [
        (Story) => (
            <MemoryRouter>
                <Story />
            </MemoryRouter>
        ),
    ],
    tags: ["!autodocs"],
    title: "actionLog/actionLogCompare/ActionLogCompare",
    args: {
        onClickShowVersionHistory: () => undefined,
    },
};
export default meta;

export const Standard: Story = {
    args: {
        beforeVersion: mockVersion1,
        afterVersion: mockVersion2,
        id: "550e8400-e29b-41d4-a716-446655440000",
        loading: false,
        name: "My Page",
    },
};

export const Loading: Story = {
    args: {
        beforeVersion: undefined,
        afterVersion: undefined,
        id: "550e8400-e29b-41d4-a716-446655440000",
        loading: true,
    },
};

export const NotFound: Story = {
    args: {
        beforeVersion: undefined,
        afterVersion: undefined,
        id: "550e8400-e29b-41d4-a716-446655440000",
        loading: false,
    },
};

export const Error: Story = {
    args: {
        beforeVersion: undefined,
        afterVersion: undefined,
        error: true,
        id: "550e8400-e29b-41d4-a716-446655440000",
        loading: false,
    },
};
