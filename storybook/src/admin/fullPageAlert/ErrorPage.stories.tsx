import { FullPageAlert } from "@comet/admin";
import type { Meta, StoryObj } from "@storybook/react-webpack5";

type Story = StoryObj<typeof FullPageAlert>;

const config: Meta<typeof FullPageAlert> = {
    component: FullPageAlert,
    title: "@comet/admin/Full Page Alert",
};

export default config;
export const FullPageAlertStory: Story = {};
FullPageAlertStory.storyName = "FullPageAlert";
