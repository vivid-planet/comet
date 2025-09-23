import { ActionLogCompare } from "@comet/cms-admin";
import type { Meta, StoryObj } from "@storybook/react-webpack5";

import { apolloStoryDecorator } from "../../../apollo-story.decorator";
import { storyRouterDecorator } from "../../../story-router.decorator";

type Story = StoryObj<typeof ActionLogCompare>;
const meta: Meta<typeof ActionLogCompare> = {
    decorators: [storyRouterDecorator(), apolloStoryDecorator("/graphql")],
    component: ActionLogCompare,
    tags: ["!autodocs"],
    title: "@comet/cms-admin/Action log/Action log compare/Action log compare",
};
export default meta;

export const Default: Story = {
    args: {
        id: "1",
        versionId: "log1",
        versionId2: "log2",
    },
};

export const WrongVersionId: Story = {
    args: {
        id: "1",
        versionId: "random-version-id-1",
        versionId2: "log2",
    },
};
