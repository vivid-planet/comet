import type { Meta, StoryObj } from "@storybook/react-vite";

import { ActionLogsDialog } from "../ActionLogsDialog";

type StoryArgs = {
    entityName: string;
    entityId: string;
    open: boolean;
    onClose: () => void;
};

type Story = StoryObj<StoryArgs>;

const meta: Meta<StoryArgs> = {
    component: ActionLogsDialog,
    tags: ["!autodocs"],
    title: "Action log/Action logs/Entity dialog",
    args: {
        entityName: "News",
        entityId: "550e8400-e29b-41d4-a716-446655440003",
        open: true,
        onClose: () => undefined,
    },
};
export default meta;

export const Default: Story = {};
