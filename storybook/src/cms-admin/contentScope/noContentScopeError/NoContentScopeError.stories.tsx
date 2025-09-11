import { NoContentScopeFallback } from "@comet/cms-admin";
import type { Meta, StoryObj } from "@storybook/react-webpack5";

import { CurrentUserProviderDecorator } from "../../../../.storybook/decorators/CurrentUserProvider.decorator";
import { apolloStoryDecorator } from "../../../apollo-story.decorator";

type Story = StoryObj<typeof NoContentScopeFallback>;

const config: Meta<typeof NoContentScopeFallback> = {
    component: NoContentScopeFallback,
    title: "@comet/cms-admin/contentScope/noContentScopeFallback/NoContentScopeFallback",
    decorators: [CurrentUserProviderDecorator, apolloStoryDecorator("/graphql")],
};

export default config;
export const Default: Story = {};
