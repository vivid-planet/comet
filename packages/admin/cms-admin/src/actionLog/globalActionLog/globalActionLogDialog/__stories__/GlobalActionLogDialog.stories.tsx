import type { Meta, StoryObj } from "@storybook/react-vite";

import { GlobalActionLogDialog } from "../GlobalActionLogDialog";

type StoryArgs = {
    entityName: string;
    entityId: string;
    open: boolean;
    onClose: () => void;
};

type Story = StoryObj<StoryArgs>;

const meta: Meta<StoryArgs> = {
    component: GlobalActionLogDialog,
    tags: ["!autodocs"],
    title: "actionLog/globalActionLog/globalActionLogDialog/GlobalActionLogDialog",
    args: {
        entityName: "News",
        entityId: "550e8400-e29b-41d4-a716-446655440003",
        open: true,
        onClose: () => undefined,
    },
};
export default meta;

export const Default: Story = {};
