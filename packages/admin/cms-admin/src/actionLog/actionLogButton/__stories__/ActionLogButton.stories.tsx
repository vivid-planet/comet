import type { Meta, StoryObj } from "@storybook/react-vite";

import { ActionLogButton } from "../ActionLogButton";

type ActionLogButtonStoryArgs = {
    id: string;
    rootField: string;
    name?: string;
};

type Story = StoryObj<ActionLogButtonStoryArgs>;

const meta: Meta<ActionLogButtonStoryArgs> = {
    component: ActionLogButton,
    tags: ["!autodocs"],
    title: "actionLog/actionLogButton/ActionLogButton",
    args: {
        id: "550e8400-e29b-41d4-a716-446655440000",
        rootField: "manufacturer",
        name: "My Page",
    },
};

export default meta;

export const Default: Story = {};

export const CustomLabel: Story = {
    render: (args) => <ActionLogButton {...args}>Show history</ActionLogButton>,
};
