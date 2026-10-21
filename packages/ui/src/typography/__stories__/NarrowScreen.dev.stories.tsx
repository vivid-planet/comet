import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect } from "storybook/test";

import { Button } from "../../button/Button";
import { Typography } from "../Typography";
import styles from "./NarrowScreen.dev.stories.module.css";

const meta = {
    title: "Components/Typography/Dev/Narrow screen",
    tags: ["!autodocs", "!manifest"],
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * Long words and long button labels stay within a 320px screen (WCAG 1.4.10), here without its 16px gutters.
 */
export const LongWords: Story = {
    render: () => (
        <div className={styles.narrowScreen} data-testid="narrow-screen" lang="de">
            <Typography variant="display">Datenschutzerklärung</Typography>
            <Typography variant="heading1">Nutzungsbedingungen</Typography>
            <Button>Bestellung zahlungspflichtig abschließen</Button>
        </div>
    ),
    play: async ({ canvas }) => {
        const narrowScreen = canvas.getByTestId("narrow-screen");

        await expect(narrowScreen.scrollWidth).toBeLessThanOrEqual(narrowScreen.clientWidth);
    },
};
