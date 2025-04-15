import { Button } from "@comet/admin";
import { ArrowRight } from "@comet/admin-icons";
import { Meta, StoryObj } from "@storybook/react";

import { stackRouteDecorator } from "../helpers/storyDecorators";
import { storyRouterDecorator } from "../story-router.decorator";
import { componentDocsDecorator, heightCommunicationDecorator } from "./utils";

type Story = StoryObj<typeof Button>;

const config: Meta<typeof Button> = {
    title: "Component Docs/ButtonTwo",
    parameters: {
        layout: "fullscreen",
    },
    decorators: [componentDocsDecorator(), heightCommunicationDecorator(), stackRouteDecorator(), storyRouterDecorator()],
    component: Button,
};

export default config;

/**
 * Renders the `Button` component with default settings.
 * Demonstrates the base appearance of the button component.
 */
export const ButtonStory: Story = {
    args: {
        children: "Button",
    },
};
ButtonStory.storyName = "Button";

/**
 * Renders the `Button` component with an icon.
 * Demonstrates the base appearance of the button component with an icon.
 */
export const ButtonWithIcon: Story = {
    args: {
        children: "Button with icon",
        startIcon: <ArrowRight />,
    },
};

/**
 * Renders the `Button` component with a secondary variant.
 * Demonstrates the base appearance of the button component with a secondary variant.
 */
export const ButtonWithSecondaryVariant: Story = {
    args: {
        children: "Secondary variant",
        variant: "secondary",
    },
};
