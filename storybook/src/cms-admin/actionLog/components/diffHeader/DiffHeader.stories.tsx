import { DiffHeader } from "@comet/cms-admin";
import type { Meta, StoryObj } from "@storybook/react-vite";

type Story = StoryObj<typeof DiffHeader>;
const meta: Meta<typeof DiffHeader> = {
    component: DiffHeader,
    title: "@comet/cms-admin/Action log/Components/Diff header/Diff header",
};
export default meta;

export const StandardDiffHeader: Story = {
    args: {
        createdAt: "2023-10-01T12:00:00Z",
        userId: "system-user",
        version: 1,
    },
};
