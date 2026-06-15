import type { Meta, StoryObj } from "@storybook/react-vite";

import { ActionLogDialog } from "../ActionLogDialog";

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
    tags: ["!autodocs"],
    title: "actionLog/actionLog/actionLogDialog/ActionLogDialog",
    args: {
        id: "550e8400-e29b-41d4-a716-446655440000",
        rootField: "manufacturer",
        name: "My Page",
        open: true,
        onClose: () => undefined,
    },
};

export default meta;

export const Default: Story = {};
