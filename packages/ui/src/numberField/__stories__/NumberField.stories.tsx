import type { Decorator, Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { expect, fn, waitFor } from "storybook/test";

import { NumberField } from "../NumberField";
import styles from "./NumberField.stories.module.css";

const narrow: Decorator = (Story) => (
    <div className={styles.frame}>
        <Story />
    </div>
);

const meta = {
    component: NumberField,
    title: "Components/NumberField",
    // The docs page is NumberField.mdx.
    tags: ["!autodocs"],
    decorators: [narrow],
    args: {
        label: "Quantity",
        onValueChange: fn(),
    },
    argTypes: {
        label: { control: "text" },
        description: { control: "text" },
        error: { control: "text" },
        value: { control: "number" },
        defaultValue: { control: "number" },
        step: { control: "number" },
        placeholder: { control: "text" },
        decrementLabel: { control: "text" },
        incrementLabel: { control: "text" },
        format: { control: "object" },
        className: { control: false },
        style: { control: false },
        slotProps: { control: false },
    },
} satisfies Meta<typeof NumberField>;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * A number input named by its visible label. The user types the number, or steps it with ArrowUp and
 * ArrowDown or the buttons inside the border.
 */
export const Default: Story = {
    play: async ({ args, canvas, canvasElement, userEvent }) => {
        const input = canvas.getByRole("textbox", { name: "Quantity" });

        await userEvent.click(canvas.getByText("Quantity"));
        await expect(input).toHaveFocus();
        await userEvent.type(input, "4");
        await expect(args.onValueChange).toHaveBeenLastCalledWith(4, expect.anything());

        await userEvent.keyboard("{ArrowUp}");
        await expect(input).toHaveValue("5");
        await userEvent.keyboard("{ArrowDown}{ArrowDown}");
        await expect(input).toHaveValue("3");

        const increment = canvasElement.querySelector(".dextinityNumberField__increment");
        if (!(increment instanceof HTMLElement)) {
            throw new Error("The increment button is missing.");
        }
        await userEvent.click(increment);
        await expect(input).toHaveValue("4");
        await expect(args.onValueChange).toHaveBeenLastCalledWith(4, expect.anything());
    },
};

/**
 * `min` and `max` keep the value in range: stepping stops at the limits, which disables the button that
 * would leave the range, and Home and End jump to them. `step` sets the amount the arrow keys and buttons
 * change the value by. Say the range in the description, so users know it before they type.
 */
export const MinMaxAndStep: Story = {
    args: {
        label: "Discount in percent",
        description: "Between 0 and 50, in steps of 5.",
        min: 0,
        max: 50,
        step: 5,
        defaultValue: 10,
    },
    play: async ({ canvas, canvasElement, userEvent }) => {
        const input = canvas.getByRole("textbox", { name: "Discount in percent" });
        const increment = canvasElement.querySelector(".dextinityNumberField__increment");

        await userEvent.click(input);
        await userEvent.keyboard("{ArrowUp}");
        await expect(input).toHaveValue("15");
        await userEvent.keyboard("{End}");
        await expect(input).toHaveValue("50");
        await expect(increment).toBeDisabled();
        await userEvent.keyboard("{Home}");
        await expect(input).toHaveValue("0");

        await userEvent.clear(input);
        await userEvent.type(input, "80");
        await userEvent.tab();
        await expect(input).toHaveValue("50");
    },
};

/**
 * `format` shows the value as a currency, a percentage or with a fixed number of decimals, in the user's
 * locale or in `locale`. The user can still type plain digits, and `onValueChange` and a submitted form get
 * the plain number.
 */
export const Formatted: Story = {
    args: {
        label: "Price",
        locale: "de-DE",
        format: { style: "currency", currency: "EUR" },
        step: 0.5,
        defaultValue: 1249.5,
    },
    play: async ({ args, canvas, userEvent }) => {
        const input = canvas.getByRole("textbox", { name: "Price" });

        await expect(input).toHaveValue("1.249,50 €");
        await userEvent.click(input);
        await userEvent.keyboard("{ArrowUp}");
        await expect(input).toHaveValue("1.250,00 €");
        await expect(args.onValueChange).toHaveBeenLastCalledWith(1250, expect.anything());
    },
};

/**
 * Pass `value` and update it in `onValueChange` when the value lives in your application, for example in a
 * form library. `onValueChange` receives `null` once the user empties the input.
 */
export const Controlled: Story = {
    render: function ControlledNumberField(args) {
        const [value, setValue] = useState<number | null>(2);

        return <NumberField {...args} value={value} onValueChange={setValue} />;
    },
    play: async ({ canvas, userEvent }) => {
        const input = canvas.getByRole("textbox", { name: "Quantity" });

        await userEvent.click(input);
        await userEvent.keyboard("{ArrowUp}");
        await expect(input).toHaveValue("3");
        await userEvent.clear(input);
        await userEvent.tab();
        await expect(input).toHaveValue("");
    },
};

/**
 * An error from a form library or the server marks the field invalid. Say what's wrong and how to fix it,
 * rather than only "Invalid value".
 */
export const WithError: Story = {
    args: {
        label: "Number of guests",
        defaultValue: 14,
        error: "Enter at most 12 guests.",
    },
    play: async ({ canvas }) => {
        const input = canvas.getByRole("textbox", { name: "Number of guests" });

        await expect(input).toHaveAttribute("aria-invalid", "true");
        await waitFor(() => expect(input).toHaveAccessibleDescription("Enter at most 12 guests."));
    },
};

/**
 * A required field shows an asterisk after the label and requires a value natively. Screen readers announce
 * the field as required instead of reading the asterisk.
 */
export const Required: Story = {
    args: {
        label: "Number of guests",
        required: true,
    },
    play: async ({ canvas }) => {
        await expect(canvas.getByRole("textbox", { name: "Number of guests" })).toBeRequired();
    },
};

/**
 * Name the buttons with `decrementLabel` and `incrementLabel`, in the user's language, so that screen reader
 * users on touch devices, who can't press the arrow keys, can use them too. Tab still skips the buttons:
 * keyboard users step with the arrow keys.
 */
export const WithButtonLabels: Story = {
    args: {
        label: "Number of guests",
        decrementLabel: "Decrease number of guests",
        incrementLabel: "Increase number of guests",
        min: 1,
        defaultValue: 2,
    },
    play: async ({ args, canvas, userEvent }) => {
        const input = canvas.getByRole("textbox", { name: "Number of guests" });

        await userEvent.click(canvas.getByRole("button", { name: "Decrease number of guests" }));
        await expect(input).toHaveValue("1");
        await expect(canvas.getByRole("button", { name: "Decrease number of guests" })).toBeDisabled();
        await userEvent.click(canvas.getByRole("button", { name: "Increase number of guests" }));
        await expect(input).toHaveValue("2");
        await expect(args.onValueChange).toHaveBeenCalledTimes(2);
        await expect(input).toHaveFocus();

        await userEvent.tab();
        await expect(canvas.getByRole("button", { name: "Decrease number of guests" })).not.toHaveFocus();
        await expect(canvas.getByRole("button", { name: "Increase number of guests" })).not.toHaveFocus();
    },
};

/**
 * A read-only field shows a value the user can't change, without the buttons. It still receives focus, so
 * the value can be selected and copied.
 */
export const ReadOnly: Story = {
    args: {
        label: "Items in stock",
        defaultValue: 128,
        readOnly: true,
    },
    play: async ({ args, canvas, userEvent }) => {
        const input = canvas.getByRole("textbox", { name: "Items in stock" });

        await userEvent.click(input);
        await expect(input).toHaveFocus();
        await userEvent.keyboard("{ArrowUp}");
        await expect(input).toHaveValue("128");
        await expect(args.onValueChange).not.toHaveBeenCalled();
    },
};

/**
 * A disabled field ignores input and is skipped by Tab. Its description stays readable: use it to say why the
 * value can't be changed.
 */
export const Disabled: Story = {
    args: {
        label: "Number of guests",
        defaultValue: 4,
        description: "The booking is confirmed and can't be changed.",
        disabled: true,
    },
    play: async ({ args, canvas, canvasElement, userEvent }) => {
        const input = canvas.getByRole("textbox", { name: "Number of guests" });

        await expect(input).toBeDisabled();
        await expect(canvasElement.querySelector(".dextinityNumberField__increment")).toBeDisabled();
        await userEvent.tab();
        await expect(input).not.toHaveFocus();
        await expect(args.onValueChange).not.toHaveBeenCalled();
    },
};

/**
 * `className` styles the field's outer element, `slotProps` its inner parts, here the input, whose value is
 * aligned to the end so that amounts in a column of fields line up. Both are added to the component's own
 * classes. See "Foundations/Customization" for all ways to adjust a component.
 */
export const CustomizedThroughSlotProps: Story = {
    args: {
        label: "Unit price",
        locale: "en-US",
        format: { style: "currency", currency: "EUR" },
        step: 0.1,
        defaultValue: 24.9,
        className: styles.priceField,
        slotProps: {
            input: { className: styles.priceInput },
        },
    },
};
