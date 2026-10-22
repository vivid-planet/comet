import type { Decorator, Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { expect, fn, screen, waitFor } from "storybook/test";

import { Button } from "../../button/Button";
import { ThemeSwitch } from "../../themeSwitch/ThemeSwitch";
import { Autocomplete } from "../Autocomplete";
import styles from "./Autocomplete.stories.module.css";

const narrow: Decorator = (Story) => (
    <div className={styles.frame}>
        <Story />
    </div>
);

const meta = {
    component: Autocomplete,
    title: "Components/Autocomplete",
    // The docs page is Autocomplete.mdx.
    tags: ["!autodocs"],
    decorators: [narrow],
    args: {
        label: "Country",
        options: [
            { value: "al", label: "Albania" },
            { value: "ad", label: "Andorra" },
            { value: "at", label: "Austria" },
            { value: "be", label: "Belgium" },
            { value: "ba", label: "Bosnia and Herzegovina" },
            { value: "bg", label: "Bulgaria" },
            { value: "hr", label: "Croatia" },
            { value: "cz", label: "Czechia" },
            { value: "dk", label: "Denmark" },
            { value: "ee", label: "Estonia" },
            { value: "fi", label: "Finland" },
            { value: "fr", label: "France" },
            { value: "de", label: "Germany" },
            { value: "gr", label: "Greece" },
            { value: "hu", label: "Hungary" },
            { value: "is", label: "Iceland" },
            { value: "ie", label: "Ireland" },
            { value: "it", label: "Italy" },
            { value: "lv", label: "Latvia" },
            { value: "li", label: "Liechtenstein" },
            { value: "lt", label: "Lithuania" },
            { value: "lu", label: "Luxembourg" },
            { value: "nl", label: "Netherlands" },
            { value: "no", label: "Norway" },
            { value: "pl", label: "Poland" },
            { value: "pt", label: "Portugal" },
            { value: "si", label: "Slovenia" },
            { value: "es", label: "Spain" },
            { value: "se", label: "Sweden" },
            { value: "ch", label: "Switzerland" },
        ],
        onValueChange: fn(),
    },
    argTypes: {
        label: { control: "text" },
        description: { control: "text" },
        error: { control: "text" },
        placeholder: { control: "text" },
        emptyMessage: { control: "text" },
        clearLabel: { control: "text" },
        value: { control: "text" },
        defaultValue: { control: "text" },
        className: { control: false },
        style: { control: false },
        slotProps: { control: false },
        inputRef: { control: false },
    },
} satisfies Meta<typeof Autocomplete>;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * A choice of one option from a long list. Typing filters the options by their label; the arrow keys move
 * through the matches, and Enter selects one. The input then shows the selected option's label. While nothing
 * matches, the list is hidden and the input is marked collapsed.
 */
export const Default: Story = {
    play: async ({ args, canvas, userEvent }) => {
        const input = canvas.getByRole("combobox", { name: "Country" });

        await userEvent.click(canvas.getByText("Country"));
        await expect(input).toHaveFocus();
        await userEvent.type(input, "ger");
        await screen.findByRole("listbox");
        await waitFor(() => expect(screen.getAllByRole("option").map((option) => option.textContent)).toEqual(["Germany"]));

        await userEvent.keyboard("{ArrowDown}{Enter}");
        await expect(args.onValueChange).toHaveBeenLastCalledWith("de", expect.anything());
        await expect(input).toHaveValue("Germany");
        await waitFor(() => expect(screen.queryByRole("listbox")).not.toBeInTheDocument());

        await userEvent.clear(input);
        await userEvent.type(input, "Atlantis");
        await waitFor(() => expect(input).toHaveAttribute("aria-expanded", "false"));
        await expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
        await expect(input).toHaveValue("Atlantis");
    },
};

/**
 * `emptyMessage` tells the user when nothing matches what they typed. Screen readers announce it. Without
 * it, the list is hidden while nothing matches.
 */
export const WithEmptyMessage: Story = {
    args: {
        placeholder: "Start typing a country",
        emptyMessage: "No country matches. Check the spelling.",
    },
    play: async ({ canvas, userEvent }) => {
        await userEvent.type(canvas.getByRole("combobox", { name: "Country" }), "Atlantis");

        await expect(await screen.findByText("No country matches. Check the spelling.")).toBeVisible();
        await expect(screen.queryByRole("option")).not.toBeInTheDocument();
    },
};

/**
 * With `clearLabel`, a button clears the value while an option is selected. The label names the button for
 * assistive technology, so say what it clears.
 */
export const Clearable: Story = {
    args: {
        defaultValue: "at",
        clearLabel: "Clear country",
    },
    play: async ({ args, canvas, userEvent }) => {
        const input = canvas.getByRole("combobox", { name: "Country" });
        await expect(input).toHaveValue("Austria");

        await userEvent.click(canvas.getByRole("button", { name: "Clear country" }));
        await expect(args.onValueChange).toHaveBeenLastCalledWith(null, expect.anything());
        await expect(input).toHaveValue("");
        await waitFor(() => expect(canvas.queryByRole("button", { name: "Clear country" })).not.toBeInTheDocument());
    },
};

/**
 * The description explains the choice, for example what it affects. Screen readers announce it with the
 * label when the input receives focus.
 */
export const WithDescription: Story = {
    args: {
        description: "We use it to calculate taxes and shipping costs.",
        placeholder: "Start typing a country",
    },
    play: async ({ canvas }) => {
        const input = canvas.getByRole("combobox", { name: "Country" });

        await waitFor(() => expect(input).toHaveAccessibleDescription("We use it to calculate taxes and shipping costs."));
    },
};

/**
 * An error from a form library or the server marks the field invalid. Say how to fix the value.
 */
export const WithError: Story = {
    args: {
        error: "Choose the country you live in from the list.",
    },
    play: async ({ canvas }) => {
        const input = canvas.getByRole("combobox", { name: "Country" });

        await expect(input).toHaveAttribute("aria-invalid", "true");
        await waitFor(() => expect(input).toHaveAccessibleDescription("Choose the country you live in from the list."));
    },
};

/**
 * A required autocomplete shows an asterisk after the label. Screen readers announce it as required instead of
 * reading the asterisk, and a form can't be submitted before an option is selected.
 */
export const Required: Story = {
    args: {
        required: true,
    },
    play: async ({ canvas }) => {
        await expect(canvas.getByRole("combobox", { name: "Country" })).toBeRequired();
    },
};

/**
 * Pass `value` and update it in `onValueChange` when the value lives in your application, for example in a
 * form library. `null` means that no option is selected.
 */
export const Controlled: Story = {
    render: function ControlledAutocomplete(args) {
        const [value, setValue] = useState<string | null>("ch");

        return <Autocomplete {...args} value={value} onValueChange={setValue} />;
    },
    play: async ({ canvas, userEvent }) => {
        const input = canvas.getByRole("combobox", { name: "Country" });
        await expect(input).toHaveValue("Switzerland");

        await userEvent.clear(input);
        await userEvent.type(input, "swe");
        await userEvent.click(await screen.findByRole("option", { name: "Sweden" }));
        await expect(input).toHaveValue("Sweden");
    },
};

/**
 * An option that doesn't apply right now is disabled: it stays in the list, but can't be selected. Leave out
 * an option that never applies instead.
 */
export const WithDisabledOption: Story = {
    args: {
        label: "Assignee",
        options: [
            { value: "ada", label: "Ada Lovelace" },
            { value: "alan", label: "Alan Turing" },
            { value: "grace", label: "Grace Hopper (on leave)", disabled: true },
            { value: "katherine", label: "Katherine Johnson" },
        ],
    },
    play: async ({ args, canvas, userEvent }) => {
        await userEvent.click(canvas.getByRole("combobox", { name: "Assignee" }));
        const grace = await screen.findByRole("option", { name: "Grace Hopper (on leave)" });

        await expect(grace).toHaveAttribute("aria-disabled", "true");
        await userEvent.click(grace);
        await expect(args.onValueChange).not.toHaveBeenCalled();
    },
};

/**
 * A disabled autocomplete ignores input and is skipped by Tab. Its description stays readable: use it to say
 * why the value can't be changed.
 */
export const Disabled: Story = {
    args: {
        defaultValue: "at",
        description: "The country can't be changed after the first order.",
        clearLabel: "Clear country",
        disabled: true,
    },
    play: async ({ args, canvas, userEvent }) => {
        const input = canvas.getByRole("combobox", { name: "Country" });

        await expect(input).toBeDisabled();
        await expect(canvas.queryByRole("button", { name: "Clear country" })).not.toBeInTheDocument();
        await userEvent.click(input);
        await expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
        await expect(args.onValueChange).not.toHaveBeenCalled();
    },
};

/**
 * With `name`, the selected option's value, not its label, is submitted with the form.
 */
export const InAForm: Story = {
    args: {
        name: "country",
        defaultValue: "it",
    },
    render: function AutocompleteInAForm(args) {
        const [submittedCountry, setSubmittedCountry] = useState<string>();

        return (
            <form
                className={styles.form}
                onSubmit={(event) => {
                    event.preventDefault();
                    setSubmittedCountry(String(new FormData(event.currentTarget).get("country")));
                }}
            >
                <Autocomplete {...args} />
                <Button type="submit">Submit</Button>
                {submittedCountry && <output className={styles.output}>Submitted: {submittedCountry}</output>}
            </form>
        );
    },
    play: async ({ canvas, userEvent }) => {
        await userEvent.click(canvas.getByRole("button", { name: "Submit" }));
        await expect(await canvas.findByText("Submitted: it")).toBeVisible();
    },
};

/**
 * The list renders at the end of the page, outside the `ThemeSwitch` around the autocomplete, and still takes
 * its theme and color scheme, so it looks like the input.
 */
export const InsideAThemeSwitch: Story = {
    args: {
        placeholder: "Start typing a country",
    },
    render: (args) => (
        <ThemeSwitch theme="dextinity" colorScheme="dark" className={styles.themeSwitch}>
            <Autocomplete {...args} />
        </ThemeSwitch>
    ),
    play: async ({ canvas, userEvent }) => {
        await userEvent.type(canvas.getByRole("combobox", { name: "Country" }), "ger");
        const positioner = (await screen.findByRole("listbox")).closest(".dextinityAutocomplete__positioner");

        await expect(positioner).toHaveAttribute("data-dextinity-theme", "dextinity");
        await expect(positioner).toHaveAttribute("data-dextinity-color-scheme", "dark");
        await expect(
            getComputedStyle(positioner as Element)
                .getPropertyValue("--dextinity-color-surface")
                .trim(),
        ).toBe("#141517");
    },
};

/**
 * `className` styles the field's outer element, `slotProps` its inner parts, here the box around the input
 * and each option. Both are added to the component's own classes. See "Foundations/Customization" for all
 * ways to adjust a component.
 */
export const CustomizedThroughSlotProps: Story = {
    args: {
        label: "Language",
        options: [
            { value: "de", label: "Deutsch" },
            { value: "en", label: "English" },
            { value: "fr", label: "Français" },
            { value: "it", label: "Italiano" },
        ],
        defaultValue: "en",
        className: styles.languageField,
        slotProps: {
            control: { className: styles.languageControl },
            option: { className: styles.languageOption },
        },
    },
};
