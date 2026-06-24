import type { Meta, StoryObj } from "@storybook/react-vite";

import { StartBuildsDialog } from "../StartBuildsDialog";

const config: Meta<typeof StartBuildsDialog> = {
    component: StartBuildsDialog,
    title: "builds/StartBuildsDialog",
};

export default config;

type Story = StoryObj<typeof StartBuildsDialog>;

export const WithPagination: Story = {
    args: {
        open: true,
        onClose: () => undefined,
    },
};
