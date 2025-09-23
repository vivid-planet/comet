import { ActionLogShowVersion } from "@comet/cms-admin";
import type { Meta, StoryObj } from "@storybook/react-webpack5";
import { v4 as uuid } from "uuid";

import { apolloStoryDecorator } from "../../../apollo-story.decorator";
import { storyRouterDecorator } from "../../../story-router.decorator";

type Story = StoryObj<typeof ActionLogShowVersion>;
const meta: Meta<typeof ActionLogShowVersion> = {
    args: {
        id: uuid(),
        versionId: "1",
    },
    decorators: [storyRouterDecorator(), apolloStoryDecorator("/graphql")],
    component: ActionLogShowVersion,
    tags: ["!autodocs"],
    title: "@comet/cms-admin/Action log/Action log show/Action log show version",
};
export default meta;

export const StandardActionLogCompare: Story = {
    args: {
        name: "Some Object's name",
        id: "1",
        versionId: "log1",
    },
};

export const InvalidVersion: Story = {
    args: {
        id: "1",
        versionId: "random-version-id",
    },
};
