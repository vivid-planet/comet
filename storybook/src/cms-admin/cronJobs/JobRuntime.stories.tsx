import { JobRuntime } from "@comet/cms-admin";
import type { Meta, StoryObj } from "@storybook/react";

type Story = StoryObj<typeof JobRuntime>;

const config: Meta<typeof JobRuntime> = {
    component: JobRuntime,
    title: "@comet/cms-admin/cronJobs/JobRuntime",
};

export default config;
export const StartCompletion: Story = {
    args: {
        startTime: new Date("2023-10-01T12:00:00Z"),
        completionTime: new Date("2023-12-01T14:00:00Z"),
    },
};

export const Start: Story = {
    args: {
        startTime: new Date("2023-10-01T12:00:00Z"),
    },
};
