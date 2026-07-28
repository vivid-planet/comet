import { CometDigitalExperienceLogo } from "@dextinity/admin-icons";
import type { Meta, StoryObj } from "@storybook/react-vite";

type Story = StoryObj;

const config: Meta = {
    title: "@dextinity/admin-icons/Comet Logo",
};

export default config;
export const Default: Story = {
    render: () => {
        return <CometDigitalExperienceLogo sx={{ width: "100%", height: "50px" }} />;
    },
};
