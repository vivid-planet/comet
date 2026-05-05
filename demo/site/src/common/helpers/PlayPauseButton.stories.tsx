import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";

import { PlayPauseButton } from "./PlayPauseButton";

const meta: Meta<typeof PlayPauseButton> = {
    component: PlayPauseButton,
    title: "Helpers/PlayPauseButton",
    argTypes: {
        isPlaying: { control: "boolean" },
    },
};

export default meta;
type Story = StoryObj<typeof PlayPauseButton>;

export const Playing: Story = {
    args: {
        isPlaying: true,
        onClick: () => {},
    },
};

export const Paused: Story = {
    args: {
        isPlaying: false,
        onClick: () => {},
    },
};

export const Interactive: Story = {
    args: {
        isPlaying: false,
        onClick: () => {},
    },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        const button = canvas.getByRole("button");

        await expect(button).toHaveAccessibleName("Play");
    },
};
