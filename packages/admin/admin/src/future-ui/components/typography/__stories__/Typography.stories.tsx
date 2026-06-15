import type { Meta, StoryObj } from "@storybook/react-vite";

import { Typography } from "../Typography";

const meta: Meta<typeof Typography> = {
    component: Typography,
    title: "Future UI/Typography",
};

export default meta;

type Story = StoryObj<typeof Typography>;

export const Default: Story = {
    args: {
        children: "The quick brown fox jumps over the lazy dog",
    },
};
