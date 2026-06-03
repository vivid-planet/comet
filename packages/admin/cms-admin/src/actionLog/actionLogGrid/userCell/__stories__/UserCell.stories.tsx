import type { Meta, StoryObj } from "@storybook/react-vite";

import { UserCell } from "../UserCell";

type Story = StoryObj<typeof UserCell>;
const meta: Meta<typeof UserCell> = {
    component: UserCell,
    title: "actionLog/actionLogGrid/userCell/UserCell",
};
export default meta;

export const MaxMustermann: Story = {
    args: {
        id: "abc-123",
        name: "Max Mustermann",
    },
};

export const OneName: Story = {
    args: {
        id: "abc-123",
        name: "Max",
    },
};

export const UnknownUser: Story = {
    args: {
        id: "abc-123",
    },
};
