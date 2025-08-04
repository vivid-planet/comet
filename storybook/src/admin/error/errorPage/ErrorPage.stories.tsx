import { ErrorPage } from "@comet/admin";
import type { Meta, StoryObj } from "@storybook/react-webpack5";

type Story = StoryObj<typeof ErrorPage>;

const config: Meta<typeof ErrorPage> = {
    component: ErrorPage,
    title: "@comet/admin/error/errorPage/ErrorPage",
};

export default config;
export const ErrorPageStory: Story = {};
ErrorPageStory.storyName = "ErrorPage";
