import type { Meta, StoryObj } from "@storybook/react-vite";

import { UserCell } from "../UserCell";

type Story = StoryObj<typeof UserCell>;
const meta: Meta<typeof UserCell> = {
    component: UserCell,
    title: "actionLog/actionLogGrid/userCell/UserCell",
};
export default meta;

export const SystemUser: Story = {
    args: {
        name: "system-user",
    },
};

export const MaxMustermann: Story = {
    args: {
        name: "Max Mustermann",
    },
};

export const OneName: Story = {
    args: {
        name: "Max",
    },
};

export const NoName: Story = {};

export const RedBackgroundColor: Story = {
    args: {
        name: "Max",
        avatarColor: "#ff0000",
    },
};

export const CustomInitials: Story = {
    args: {
        name: "Max",
        initials: "XY",
    },
};
