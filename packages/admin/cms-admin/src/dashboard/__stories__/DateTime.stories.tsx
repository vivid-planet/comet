import type { Meta, StoryObj } from "@storybook/react-webpack5";

import { DateTime } from "../DateTime";

const config: Meta<typeof DateTime> = {
    component: DateTime,
    title: "dashboard/DateTime",
};

export default config;

type Story = StoryObj<typeof config>;

export const Default: Story = {};
