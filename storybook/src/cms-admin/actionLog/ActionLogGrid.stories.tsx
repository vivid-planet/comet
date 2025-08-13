import { ActionLogGrid } from "@comet/cms-admin";
/*import {
    createActionLogGridErrorMock,
    createActionLogGridMock,
} from "@src/actionLog/actionLogGrid/useActionLogQuery/__mock__/useActionLogQuery.mock";*/
import type { Meta, StoryObj } from "@storybook/react-webpack5";
import { v4 as uuid } from "uuid";

import { apolloStoryDecorator } from "../../apollo-story.decorator";
import { storyRouterDecorator } from "../../story-router.decorator";

type Story = StoryObj<typeof ActionLogGrid>;
const meta: Meta<typeof ActionLogGrid> = {
    args: {
        id: uuid(),
    },
    component: ActionLogGrid,
    decorators: [storyRouterDecorator(), apolloStoryDecorator("/graphql")],
    tags: ["!autodocs"],
    title: "@comet/cms-admin/Action log/Action log grid/Action log grid",
};
export default meta;

export const StandardActionLogGrid: Story = {
    /*parameters: {
        msw: {
            handlers: [createActionLogGridMock()],
        },
    },*/
};
/*
export const LongLoading: Story = {
    parameters: {
        msw: {
            handlers: [createActionLogGridMock(5000)],
        },
    },
};

export const Error: Story = {
    parameters: {
        msw: {
            handlers: [createActionLogGridErrorMock()],
        },
    },
};
*/
