import type { Meta, StoryObj } from "@storybook/react-vite";

import { Button } from "./Button";

const meta: Meta<typeof Button> = {
    component: Button,
    title: "Components/Button",
    argTypes: {
        variant: {
            control: "select",
            options: ["contained", "outlined", "text"],
        },
        children: {
            control: "text",
        },
    },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Contained: Story = {
    args: {
        variant: "contained",
        children: "Click me",
    },
};

export const Outlined: Story = {
    args: {
        variant: "outlined",
        children: "Click me",
    },
};

export const Text: Story = {
    args: {
        variant: "text",
        children: "Click me",
    },
};

export const AsLink: Story = {
    args: {
        as: "a",
        variant: "contained",
        children: "I am a link",
        href: "#",
    },
};
