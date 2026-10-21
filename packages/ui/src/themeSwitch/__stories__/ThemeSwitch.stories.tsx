import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect } from "storybook/test";

import { themeOptions } from "#storybook/themeDecorator";

import { Button } from "../../button/Button";
import { Chip } from "../../chip/Chip";
import { Switch } from "../../switch/Switch";
import { TextField } from "../../textField/TextField";
import { Typography } from "../../typography/Typography";
import { ThemeSwitch } from "../ThemeSwitch";
import styles from "./ThemeSwitch.stories.module.css";

function NewsletterSettings({ title }: { title: string }) {
    return (
        <div className={styles.sample}>
            <div className={styles.title}>
                <Typography variant="heading4" render={<h2 />}>
                    {title}
                </Typography>
                <Chip tone="success">Active</Chip>
            </div>
            <TextField label="Sender name" defaultValue="Summer shop" />
            <Switch defaultChecked>Send a weekly digest</Switch>
            <div className={styles.actions}>
                <Button>Save</Button>
                <Button variant="secondary">Cancel</Button>
            </div>
        </div>
    );
}

const meta = {
    component: ThemeSwitch,
    title: "Components/ThemeSwitch",
    // The docs page is ThemeSwitch.mdx.
    tags: ["!autodocs"],
    args: {
        theme: "dextinity",
        colorScheme: "dark",
        className: styles.panel,
    },
    argTypes: {
        theme: { control: "select", options: themeOptions.map((option) => option.value) },
        colorScheme: { control: "radio", options: ["light", "dark"] },
        className: { control: false },
        style: { control: false },
        children: { control: false },
    },
    render: (args) => (
        <ThemeSwitch {...args}>
            <NewsletterSettings title="Newsletter" />
        </ThemeSwitch>
    ),
} satisfies Meta<typeof ThemeSwitch>;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * A part of the page in the dark color scheme of the Dextinity theme, whatever the theme and color scheme of
 * the page around it. Every component inside follows, and the theme switch paints the theme's background.
 */
export const Default: Story = {
    play: async ({ canvas }) => {
        const themeSwitch = canvas.getByRole("heading", { name: "Newsletter" }).closest(".dextinityThemeSwitch");
        await expect(themeSwitch).toHaveAttribute("data-dextinity-color-scheme", "dark");
        await expect(
            getComputedStyle(themeSwitch as Element)
                .getPropertyValue("--dextinity-color-background")
                .trim(),
        ).toBe("#08090a");
    },
};

/**
 * The same content in every theme, each in its own theme switch.
 */
export const EveryTheme: Story = {
    render: (args) => (
        <div className={styles.comparison}>
            {themeOptions.map((option) => (
                <ThemeSwitch key={option.value} {...args} theme={option.value}>
                    <NewsletterSettings title={option.title} />
                </ThemeSwitch>
            ))}
        </div>
    ),
};

/**
 * Theme switches nest: each one starts its theme anew, so the innermost decides. Here a Sunset section holds a
 * dark Dextinity panel, which holds an Acme card.
 */
export const Nested: Story = {
    render: (args) => (
        <ThemeSwitch {...args} theme="sunset" colorScheme="light">
            <NewsletterSettings title="Sunset, light" />
            <ThemeSwitch theme="dextinity" colorScheme="dark" className={styles.nestedPanel}>
                <NewsletterSettings title="Dextinity, dark" />
                <ThemeSwitch theme="acme" colorScheme="light" className={styles.nestedPanel}>
                    <NewsletterSettings title="Acme, light" />
                </ThemeSwitch>
            </ThemeSwitch>
        </ThemeSwitch>
    ),
    play: async ({ canvas }) => {
        const primaryColorAround = (title: string) => {
            const themeSwitch = canvas.getByRole("heading", { name: title }).closest(".dextinityThemeSwitch");
            return getComputedStyle(themeSwitch as Element)
                .getPropertyValue("--dextinity-color-primary")
                .trim();
        };

        await expect(primaryColorAround("Sunset, light")).toBe("#7c3aed");
        await expect(primaryColorAround("Dextinity, dark")).toBe("#8d89f7");
        await expect(primaryColorAround("Acme, light")).toBe("#b4451f");
    },
};
