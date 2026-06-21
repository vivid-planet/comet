import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";

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
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        await expect(canvas.getByText("The quick brown fox jumps over the lazy dog")).toHaveClass("cometTypography");
    },
};
