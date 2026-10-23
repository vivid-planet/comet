import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, screen, waitFor, within } from "storybook/test";

import { themeOptions } from "#storybook/themeDecorator";

import { Button } from "../../button/Button";
import { Chip } from "../../chip/Chip";
import { Icon } from "../../icon/Icon";
import { IconButton } from "../../iconButton/IconButton";
import { Select } from "../../select/Select";
import { Switch } from "../../switch/Switch";
import { TextField } from "../../textField/TextField";
import { Tooltip } from "../../tooltip/Tooltip";
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

const statusOptions = [
    { value: "published", label: "Published" },
    { value: "draft", label: "Draft" },
    { value: "archived", label: "Archived" },
];

function LevelSample({ title }: { title: string }) {
    return (
        <div className={styles.level}>
            <div className={styles.title}>
                <Typography variant="heading4" render={<h2 />}>
                    {title}
                </Typography>
                <Chip tone="primary">Primary</Chip>
                <Chip tone="success">Success</Chip>
                <Chip tone="danger">Danger</Chip>
            </div>
            <div className={styles.controls}>
                <TextField label="Name" defaultValue="Linen shirt" />
                <Select label="Status" options={statusOptions} defaultValue="published" />
            </div>
            <div className={styles.actions}>
                <Button startIcon={<Icon name="check" />}>Save</Button>
                <Button variant="secondary">Preview</Button>
                <Tooltip content="Settings">
                    <IconButton label="Settings" variant="ghost">
                        <Icon name="settings" />
                    </IconButton>
                </Tooltip>
                <Switch defaultChecked>Show in the shop</Switch>
            </div>
        </div>
    );
}

const colorSchemes = ["light", "dark"] as const;

const meta = {
    component: ThemeSwitch,
    title: "Foundations/ThemeSwitch",
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
 * The same content in every theme, in its light and its dark color scheme side by side, each in its own theme
 * switch.
 */
export const EveryTheme: Story = {
    render: (args) => (
        <div className={styles.comparison}>
            {themeOptions.flatMap((option) =>
                colorSchemes.map((colorScheme) => (
                    <ThemeSwitch key={`${option.value}-${colorScheme}`} {...args} theme={option.value} colorScheme={colorScheme}>
                        <NewsletterSettings title={`${option.title.replace(/ \(.*\)$/, "")}, ${colorScheme}`} />
                    </ThemeSwitch>
                )),
            )}
        </div>
    ),
    play: async ({ canvas }) => {
        await expect(canvas.getAllByRole("heading", { name: /, light$/ })).toHaveLength(themeOptions.length);
        await expect(canvas.getAllByRole("heading", { name: /, dark$/ })).toHaveLength(themeOptions.length);
    },
};

/**
 * Theme switches nest as deep as needed: each one starts its theme anew, so the innermost decides, and popups
 * such as a select's option list follow the theme switch around their trigger. Every level shows its theme in
 * its components, its colors and its icons.
 */
export const Nested: Story = {
    render: (args) => (
        <ThemeSwitch {...args} theme="dextinity" colorScheme="light">
            <LevelSample title="Dextinity, light" />
            <ThemeSwitch theme="sunset" colorScheme="dark" className={styles.nestedPanel}>
                <LevelSample title="Sunset, dark" />
                <ThemeSwitch theme="acme" colorScheme="light" className={styles.nestedPanel}>
                    <LevelSample title="Acme, light" />
                    <ThemeSwitch theme="volt" colorScheme="dark" className={styles.nestedPanel}>
                        <LevelSample title="Volt, dark" />
                        <ThemeSwitch theme="tropic" colorScheme="light" className={styles.nestedPanel}>
                            <LevelSample title="Tropic, light" />
                            <ThemeSwitch theme="nova" colorScheme="dark" className={styles.nestedPanel}>
                                <LevelSample title="Nova, dark" />
                                <ThemeSwitch theme="primo" colorScheme="light" className={styles.nestedPanel}>
                                    <LevelSample title="Primo, light" />
                                </ThemeSwitch>
                            </ThemeSwitch>
                        </ThemeSwitch>
                    </ThemeSwitch>
                </ThemeSwitch>
            </ThemeSwitch>
        </ThemeSwitch>
    ),
    play: async ({ canvas, userEvent }) => {
        const levels = [
            { title: "Dextinity, light", theme: "dextinity", colorScheme: "light" },
            { title: "Sunset, dark", theme: "sunset", colorScheme: "dark" },
            { title: "Acme, light", theme: "acme", colorScheme: "light" },
            { title: "Volt, dark", theme: "volt", colorScheme: "dark" },
            { title: "Tropic, light", theme: "tropic", colorScheme: "light" },
            { title: "Nova, dark", theme: "nova", colorScheme: "dark" },
            { title: "Primo, light", theme: "primo", colorScheme: "light" },
        ];
        const themeSwitchAround = (title: string) => canvas.getByRole("heading", { name: title }).closest(".dextinityThemeSwitch") as HTMLElement;
        const primaryColors = new Set<string>();

        for (const level of levels) {
            const themeSwitch = themeSwitchAround(level.title);
            await expect(themeSwitch).toHaveAttribute("data-dextinity-theme", level.theme);
            await expect(themeSwitch).toHaveAttribute("data-dextinity-color-scheme", level.colorScheme);
            primaryColors.add(getComputedStyle(themeSwitch).getPropertyValue("--dextinity-color-primary").trim());
        }
        await expect(primaryColors.size).toBe(levels.length);

        const innermost = levels[levels.length - 1];
        await userEvent.click(within(themeSwitchAround(innermost.title)).getByRole("combobox", { name: "Status" }));
        const optionList = await screen.findByRole("listbox");
        const themedPopup = optionList.closest("[data-dextinity-theme]");
        await expect(themedPopup).toHaveAttribute("data-dextinity-theme", innermost.theme);
        await expect(themedPopup).toHaveAttribute("data-dextinity-color-scheme", innermost.colorScheme);

        await userEvent.keyboard("{Escape}");
        await waitFor(() => expect(screen.queryByRole("listbox")).not.toBeInTheDocument());
    },
};
