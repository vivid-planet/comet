import { DiffHeader } from "@comet/admin";
import type { Meta, StoryObj } from "@storybook/react-webpack5";

type Story = StoryObj<typeof DiffHeader>;
const meta: Meta<typeof DiffHeader> = {
    component: DiffHeader,
    title: "@comet/admin/Action log/Components/Diff header/Diff header",
};
export default meta;

export const StandardDiffHeader: Story = {
    args: {
        createdAt: "2023-10-01T12:00:00Z",
        userId: "system-user",
        version: 1,
    },
};
