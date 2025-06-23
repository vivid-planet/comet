import { NotFound } from "@comet/cms-admin";
import type { Meta, StoryObj } from "@storybook/react";

type Story = StoryObj<typeof NotFound>;

const config: Meta<typeof NotFound> = {
    component: NotFound,
    title: "@comet/cms-admin/common/notFound/Not Found",
};

export default config;

/**
 * The `NotFound` component is used to display a not found page.
 */
export const NotFoundStory: Story = {};
NotFoundStory.storyName = "NotFound";
