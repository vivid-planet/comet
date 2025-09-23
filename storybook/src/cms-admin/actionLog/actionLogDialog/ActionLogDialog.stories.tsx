import { ActionLogDialog } from "@comet/cms-admin";
import type { Meta, StoryObj } from "@storybook/react-webpack5";
import { v4 as uuid } from "uuid";

import { apolloStoryDecorator } from "../../../apollo-story.decorator";
import { storyRouterDecorator } from "../../../story-router.decorator";

type Story = StoryObj<typeof ActionLogDialog>;
const meta: Meta<typeof ActionLogDialog> = {
    decorators: [storyRouterDecorator(), apolloStoryDecorator("/graphql")],

    component: ActionLogDialog,

    title: "@comet/cms-admin/Action log/Action log dialog/Action log dialog",
};
export default meta;

export const StandardActionLogDialog: Story = {
    args: {
        entityName: "News",
        id: uuid(),
        onClose: () => {
            alert("Close not handled in story");
        },
        open: true,
    },
};
