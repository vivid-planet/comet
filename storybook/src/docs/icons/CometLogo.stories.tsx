import { CometDigitalExperienceLogo } from "@comet/admin-icons";
import type { Meta, StoryObj } from "@storybook/react-webpack5";

type Story = StoryObj;

const config: Meta = {
    title: "@comet/admin-icons/Comet Logo",
};

export default config;
export const Default: Story = {
    render: () => {
        return <CometDigitalExperienceLogo sx={{ width: "100%", height: "50px" }} />;
    },
};
