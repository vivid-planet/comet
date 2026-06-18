import type { Meta, StoryObj } from "@storybook/react-vite";

import { ActionChip } from "../ActionChip";

type Story = StoryObj<typeof ActionChip>;
const meta: Meta<typeof ActionChip> = {
    component: ActionChip,
    tags: ["!autodocs"],
    title: "actionLog/components/actionChip/ActionChip",
};
export default meta;

export const Created: Story = {
    args: { actionValue: "Created", label: "Created" },
};

export const Updated: Story = {
    args: { actionValue: "Updated", label: "Updated" },
};

export const Deleted: Story = {
    args: { actionValue: "Deleted", label: "Deleted" },
};
