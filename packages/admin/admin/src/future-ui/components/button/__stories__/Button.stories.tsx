import type { Meta, StoryObj } from "@storybook/react-vite";

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
};

export const Secondary: Story = {
    args: {
        children: "Button",
        variant: "secondary",
    },
};
