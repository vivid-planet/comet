import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";

import { Button } from "../Button";

const meta: Meta<typeof Button> = {
    component: Button,
    title: "Future UI/Button",
};

export default meta;

type Story = StoryObj<typeof Button>;

export const Primary: Story = {
    args: {
        children: "Button",
        variant: "primary",
    },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        await expect(canvas.getByRole("button")).toHaveClass("cometButton", "cometButton--variantPrimary");
    },
};

export const Secondary: Story = {
    args: {
        children: "Button",
        variant: "secondary",
    },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        await expect(canvas.getByRole("button")).toHaveClass("cometButton", "cometButton--variantSecondary");
    },
};
