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

/**
 * In a row with longer text, a short label and a button keep their text on one line; the longer text wraps.
 */
export const RowsWithLongerText: Story = {
    render: () => (
        <div className={styles.rows}>
            <div className={styles.row}>
                <Typography variant="label" data-testid="label-in-row">
                    Bestellnummer
                </Typography>
                <Typography>Die Bestellnummer steht in der Bestätigung, die wir nach dem Kauf per E-Mail senden.</Typography>
            </div>
            <div className={styles.row}>
                <Typography>Benachrichtigungen informieren über neue Bestellungen, Rücksendungen und Zahlungen.</Typography>
                <Button data-testid="button-in-row">Turn on notifications</Button>
            </div>
            <Typography variant="label" data-testid="label-alone">
                Bestellnummer
            </Typography>
            <Button data-testid="button-alone">Turn on notifications</Button>
        </div>
    ),
    play: async ({ canvas }) => {
        const heightOf = (testId: string) => canvas.getByTestId(testId).getBoundingClientRect().height;

        await expect(heightOf("label-in-row")).toBe(heightOf("label-alone"));
        await expect(heightOf("button-in-row")).toBe(heightOf("button-alone"));
    },
};
