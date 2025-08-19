import type { Meta, StoryFn } from "@storybook/react-vite";

import { sampleSuccessMock } from "./__mocks__/Sample.success.mock";
import { SamplesGrid } from "./generated/Sample";

type Story = StoryFn<typeof SamplesGrid>;
const config: Meta<typeof SamplesGrid> = {
    component: SamplesGrid,
    title: "Sample Story",

    parameters: {
        msw: {
            handlers: [sampleSuccessMock],
        },
    },
};
export default config;

export const SampleGridStory: Story = {
    parameters: {
        msw: {
            handlers: [sampleSuccessMock],
        },
        adminGeneratorConfig: "./Sample.cometGen.ts",
    },
};
