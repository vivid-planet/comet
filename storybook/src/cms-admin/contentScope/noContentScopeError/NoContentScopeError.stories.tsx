import { NoContentScopeError } from "@comet/cms-admin";
import type { Meta, StoryObj } from "@storybook/react-webpack5";

import { CurrentUserProviderDecorator } from "../../../../.storybook/decorators/CurrentUserProvider.decorator";
import { apolloStoryDecorator } from "../../../apollo-story.decorator";

type Story = StoryObj<typeof NoContentScopeError>;

const config: Meta<typeof NoContentScopeError> = {
    component: NoContentScopeError,
    title: "@comet/cms-admin/contentScope/noContentScopeError/NoContentScopeError",
    decorators: [CurrentUserProviderDecorator, apolloStoryDecorator("/graphql")],
};

export default config;
export const NoContentScopeErrorStory: Story = {};
NoContentScopeErrorStory.storyName = "NoContentScopeError";
