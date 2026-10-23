import type { Decorator, Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { expect, fn, screen, waitFor } from "storybook/test";

import { Button } from "../../button/Button";
import { ThemeSwitch } from "../../themeSwitch/ThemeSwitch";
import { Select } from "../Select";
import styles from "./Select.stories.module.css";

const narrow: Decorator = (Story) => (
    <div className={styles.frame}>
        <Story />
    </div>
);

const meta = {
    component: Select,
    title: "Components/Select",
    // The docs page is Select.mdx.
    tags: ["!autodocs"],
    decorators: [narrow],
    args: {
        label: "Country",
        options: [
            { value: "at", label: "Austria" },
            { value: "de", label: "Germany" },
            { value: "it", label: "Italy" },
            { value: "li", label: "Liechtenstein" },
            { value: "ch", label: "Switzerland" },
        ],
        onValueChange: fn(),
    },
    argTypes: {
        label: { control: "text" },
        description: { control: "text" },
        error: { control: "text" },
        placeholder: { control: "text" },
        value: { control: "text" },
        defaultValue: { control: "text" },
        className: { control: false },
        style: { control: false },
        slotProps: { control: false },
        inputRef: { control: false },
    },
} satisfies Meta<typeof Select>;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * A choice of one option from a short list, named by its visible label. Clicking the trigger opens the list,
 * and clicking an option selects it and closes the list. Clicking the label focuses the trigger.
 */
export const Default: Story = {
    play: async ({ args, canvas, userEvent }) => {
        const trigger = canvas.getByRole("combobox", { name: "Country" });

        await userEvent.click(canvas.getByText("Country"));
        await expect(trigger).toHaveFocus();
        await expect(screen.queryByRole("listbox")).not.toBeInTheDocument();

        await userEvent.click(trigger);
        const listbox = await screen.findByRole("listbox");
        await waitFor(() => expect(listbox).toBeVisible());

        await userEvent.click(screen.getByRole("option", { name: "Germany" }));
        await expect(args.onValueChange).toHaveBeenLastCalledWith("de", expect.anything());
        await expect(trigger).toHaveTextContent("Germany");
        await waitFor(() => expect(screen.queryByRole("listbox")).not.toBeInTheDocument());
    },
};

/**
 * The placeholder prompts for a choice while nothing is selected. With the keyboard, Enter, Space or an arrow
 * key opens the list, the arrow keys move through the options, Enter selects one and Escape closes the list
 * without a change. Typing the first letters of an option highlights it in the open list, and selects it while
 * the list is closed.
 */
export const WithPlaceholder: Story = {
    args: {
        placeholder: "Choose a country",
    },
    play: async ({ args, canvas, userEvent }) => {
        const trigger = canvas.getByRole("combobox", { name: "Country" });
        await expect(trigger).toHaveTextContent("Choose a country");

        await userEvent.tab();
        await expect(trigger).toHaveFocus();
        await userEvent.keyboard("{ArrowDown}");
        await screen.findByRole("listbox");
        await waitFor(() => expect(screen.getByRole("option", { name: "Austria" })).toHaveFocus());
        await userEvent.keyboard("{ArrowDown}{Enter}");
        await expect(args.onValueChange).toHaveBeenLastCalledWith("de", expect.anything());
        await expect(trigger).toHaveTextContent("Germany");
        await waitFor(() => expect(trigger).toHaveFocus());

        await userEvent.keyboard("{Enter}");
        await screen.findByRole("listbox");
        await userEvent.keyboard("{Escape}");
        await waitFor(() => expect(screen.queryByRole("listbox")).not.toBeInTheDocument());
        await expect(trigger).toHaveTextContent("Germany");
        await expect(args.onValueChange).toHaveBeenCalledOnce();

        await userEvent.keyboard("s");
        await expect(args.onValueChange).toHaveBeenLastCalledWith("ch", expect.anything());
        await expect(trigger).toHaveTextContent("Switzerland");
    },
};

/**
 * The description explains the choice, for example what it affects. Screen readers announce it with the
 * label when the trigger receives focus.
 */
export const WithDescription: Story = {
    args: {
        description: "We only ship to these countries.",
        placeholder: "Choose a country",
    },
    play: async ({ canvas }) => {
        const trigger = canvas.getByRole("combobox", { name: "Country" });

        await waitFor(() => expect(trigger).toHaveAccessibleDescription("We only ship to these countries."));
    },
};

/**
 * An error from a form library or the server marks the field invalid. Say how to fix the value.
 */
export const WithError: Story = {
    args: {
        placeholder: "Choose a country",
        error: "Choose the country you live in.",
    },
    play: async ({ canvas }) => {
        const trigger = canvas.getByRole("combobox", { name: "Country" });

        await expect(trigger).toHaveAttribute("aria-invalid", "true");
        await waitFor(() => expect(trigger).toHaveAccessibleDescription("Choose the country you live in."));
    },
};

/**
 * A required select shows an asterisk after the label. Screen readers announce it as required instead of
 * reading the asterisk, and a form can't be submitted before an option is selected.
 */
export const Required: Story = {
    args: {
        placeholder: "Choose a country",
        required: true,
    },
    play: async ({ canvas }) => {
        await expect(canvas.getByRole("combobox", { name: "Country" })).toHaveAttribute("aria-required", "true");
    },
};

/**
 * Pass `value` and update it in `onValueChange` when the value lives in your application, for example in a
 * form library. `null` means that no option is selected.
 */
export const Controlled: Story = {
    render: function ControlledSelect(args) {
        const [value, setValue] = useState<string | null>("ch");

        return <Select {...args} value={value} onValueChange={setValue} />;
    },
    play: async ({ canvas, userEvent }) => {
        const trigger = canvas.getByRole("combobox", { name: "Country" });
        await expect(trigger).toHaveTextContent("Switzerland");

        await userEvent.click(trigger);
        const listbox = await screen.findByRole("listbox");
        await waitFor(() => expect(listbox).toBeVisible());
        await userEvent.click(screen.getByRole("option", { name: "Austria" }));
        await expect(trigger).toHaveTextContent("Austria");
    },
};

/**
 * An option that doesn't apply right now is disabled: it stays in the list, but can't be selected. Leave out
 * an option that never applies instead.
 */
export const WithDisabledOption: Story = {
    args: {
        label: "Delivery",
        options: [
            { value: "standard", label: "Standard, 3–5 working days" },
            { value: "express", label: "Express, next working day" },
            { value: "pickup", label: "Pickup in store (closed for renovation)", disabled: true },
        ],
        defaultValue: "standard",
    },
    play: async ({ args, canvas, userEvent }) => {
        const trigger = canvas.getByRole("combobox", { name: "Delivery" });

        await userEvent.click(trigger);
        const pickup = await screen.findByRole("option", { name: "Pickup in store (closed for renovation)" });
        await expect(pickup).toHaveAttribute("aria-disabled", "true");
        await userEvent.click(pickup);
        await expect(args.onValueChange).not.toHaveBeenCalled();
        await userEvent.keyboard("{Escape}");
        await waitFor(() => expect(screen.queryByRole("listbox")).not.toBeInTheDocument());
        await expect(trigger).toHaveTextContent("Standard, 3–5 working days");
    },
};

/**
 * A disabled select can't be opened and is skipped by Tab. Its description stays readable: use it to say why
 * the value can't be changed.
 */
export const Disabled: Story = {
    args: {
        defaultValue: "at",
        description: "The country can't be changed after the first order.",
        disabled: true,
    },
    play: async ({ args, canvas, userEvent }) => {
        const trigger = canvas.getByRole("combobox", { name: "Country" });

        await expect(trigger).toHaveAttribute("data-disabled");
        await userEvent.click(trigger);
        await expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
        await userEvent.tab();
        await expect(trigger).not.toHaveFocus();
        await expect(args.onValueChange).not.toHaveBeenCalled();
    },
};

/**
 * With `name`, the selected option's value is submitted with the form, like a native `<select>`.
 */
export const InAForm: Story = {
    args: {
        name: "country",
        defaultValue: "it",
    },
    render: function SelectInAForm(args) {
        const [submittedCountry, setSubmittedCountry] = useState<string>();

        return (
            <form
                className={styles.form}
                onSubmit={(event) => {
                    event.preventDefault();
                    setSubmittedCountry(String(new FormData(event.currentTarget).get("country")));
                }}
            >
                <Select {...args} />
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
 * The list renders at the end of the page, outside the `ThemeSwitch` around the select, and still takes its
 * theme and color scheme, so it looks like the trigger.
 */
export const InsideAThemeSwitch: Story = {
    render: (args) => (
        <ThemeSwitch theme="dextinity" colorScheme="dark" className={styles.themeSwitch}>
            <Select {...args} />
        </ThemeSwitch>
    ),
    play: async ({ canvas, userEvent }) => {
        await userEvent.click(canvas.getByRole("combobox", { name: "Country" }));
        const positioner = (await screen.findByRole("listbox")).closest(".dextinitySelect__positioner");

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
 * `className` styles the field's outer element, `slotProps` its inner parts, here the trigger and each
 * option. Both are added to the component's own classes. See "Foundations/Customization" for all ways to
 * adjust a component.
 */
export const CustomizedThroughSlotProps: Story = {
    args: {
        label: "Sort by",
        options: [
            { value: "newest", label: "Newest first" },
            { value: "oldest", label: "Oldest first" },
            { value: "name", label: "Name" },
        ],
        defaultValue: "newest",
        className: styles.sortField,
        slotProps: {
            trigger: { className: styles.sortTrigger },
            option: { className: styles.sortOption },
        },
    },
};
