import type { Meta, StoryObj } from "@storybook/react-webpack5";

import { sampleSuccessMock } from "./__mocks__/Sample.success.mock";
import { SamplesGrid } from "./generated/Sample";

type Story = StoryObj<typeof SamplesGrid>;
const config: Meta<typeof SamplesGrid> = {
    component: SamplesGrid,
    title: "Sample Story",
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
