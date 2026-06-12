import type { Meta, StoryObj } from "@storybook/react-vite";

import { ActionLogsShowVersionDialog } from "../ActionLogsShowVersionDialog";

type StoryArgs = {
    actionLogId: string | null;
    open: boolean;
    onClose: () => void;
};

type Story = StoryObj<StoryArgs>;

const meta: Meta<StoryArgs> = {
    component: ActionLogsShowVersionDialog,
    tags: ["!autodocs"],
    title: "Action log/Action logs/Show version dialog",
    args: {
        open: true,
        onClose: () => undefined,
    },
};
export default meta;

export const WithDiff: Story = {
    args: { actionLogId: "log3" },
};

export const Created: Story = {
    args: { actionLogId: "log1" },
};

export const Deleted: Story = {
    args: { actionLogId: "log4" },
};
