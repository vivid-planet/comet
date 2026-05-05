import type { Meta, StoryObj } from "@storybook/react-webpack5";
import { expect, userEvent, within } from "storybook/test";

import { Button } from "./Button";

const meta: Meta<typeof Button> = {
    title: "Components/Button",
    component: Button,
    argTypes: {
        variant: { control: "select", options: ["contained", "outlined", "text"] },
    },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Contained: Story = {
    args: { variant: "contained", children: "Click me" },
};

export const Outlined: Story = {
    args: { variant: "outlined", children: "Click me" },
};

export const Text: Story = {
    args: { variant: "text", children: "Click me" },
};

export const Disabled: Story = {
    args: { variant: "contained", children: "Disabled", disabled: true },
};

export const AsLink: Story = {
    args: { as: "a", variant: "contained", children: "Link Button", href: "#" },
};

export const ClickTest: Story = {
    args: { variant: "contained", children: "Click me" },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        const button = canvas.getByRole("button");
        await userEvent.click(button);
        await expect(button).toBeVisible();
    },
};
