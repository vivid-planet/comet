import type { Meta, StoryObj } from "@storybook/react-webpack5";

import { DateTime } from "../DateTime";

const config: Meta<typeof DateTime> = {
    component: DateTime,
    title: "dashboard/DateTime",
};

export default config;

export const Default: StoryObj<typeof DateTime> = {
    render: () => <DateTime />,
};
