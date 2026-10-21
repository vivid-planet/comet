import type { Decorator, Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { expect, fn, waitFor } from "storybook/test";

import { TextField } from "../TextField";
import styles from "./TextField.stories.module.css";

const narrow: Decorator = (Story) => (
    <div className={styles.frame}>
        <Story />
    </div>
);

const meta = {
    component: TextField,
    title: "Components/TextField",
    decorators: [narrow],
    args: {
        label: "Full name",
        onValueChange: fn(),
    },
    argTypes: {
        label: { control: "text" },
        description: { control: "text" },
        error: { control: "text" },
        type: { control: "select", options: ["text", "email", "password", "search", "tel", "url"] },
        className: { control: false },
        slotProps: { control: false },
    },
} satisfies Meta<typeof TextField>;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * A text input named by its visible label. Clicking the label focuses the input.
 *
 * @summary A text input with a label.
 */
export const Default: Story = {
    play: async ({ args, canvas, userEvent }) => {
        const input = canvas.getByLabelText("Full name");

        await userEvent.click(canvas.getByText("Full name"));
        await expect(input).toHaveFocus();
        await userEvent.type(input, "Ada Lovelace");
        await expect(input).toHaveValue("Ada Lovelace");
        await expect(args.onValueChange).toHaveBeenLastCalledWith("Ada Lovelace", expect.anything());
    },
};

/**
 * Format hints and other instructions go into the description, which stays visible while the user types and
 * which screen readers announce with the label. Don't put them into the placeholder, which disappears.
 *
 * @summary A description with the expected format.
 */
export const WithDescription: Story = {
    args: {
        label: "Username",
        description: "Between 3 and 20 characters: letters, digits and hyphens.",
        autoComplete: "username",
    },
    play: async ({ canvas }) => {
        const input = canvas.getByRole("textbox", { name: "Username" });

        await waitFor(() => expect(input).toHaveAccessibleDescription("Between 3 and 20 characters: letters, digits and hyphens."));
    },
};

/**
 * An error from a form library or the server marks the field invalid. Say what's wrong and how to fix it,
 * rather than only "Invalid value".
 *
 * @summary An error message that says how to fix the value.
 */
export const WithError: Story = {
    args: {
        label: "Email address",
        type: "email",
        autoComplete: "email",
        defaultValue: "ada@example",
        error: "Enter an email address like name@example.com.",
    },
    play: async ({ canvas }) => {
        const input = canvas.getByRole("textbox", { name: "Email address" });

        await expect(input).toHaveAttribute("aria-invalid", "true");
        await waitFor(() => expect(input).toHaveAccessibleDescription("Enter an email address like name@example.com."));
    },
};

/**
 * A required field shows an asterisk after the label and requires a value natively. Screen readers announce
 * the field as required instead of reading the asterisk.
 *
 * @summary A required field, marked with an asterisk.
 */
export const Required: Story = {
    args: {
        label: "Email address",
        type: "email",
        autoComplete: "email",
        required: true,
    },
    play: async ({ canvas }) => {
        await expect(canvas.getByRole("textbox", { name: "Email address" })).toBeRequired();
    },
};

/**
 * Pass `value` and update it in `onValueChange` when the value lives in your application, for example in a
 * form library.
 *
 * @summary A text field whose value is controlled with `value` and `onValueChange`.
 */
export const Controlled: Story = {
    render: function ControlledTextField(args) {
        const [value, setValue] = useState("");

        return <TextField {...args} value={value} onValueChange={setValue} />;
    },
    play: async ({ canvas, userEvent }) => {
        const input = canvas.getByRole("textbox", { name: "Full name" });

        await userEvent.type(input, "Ada");
        await expect(input).toHaveValue("Ada");
    },
};

/**
 * A disabled field ignores input and is skipped by Tab. Its description stays readable: use it to say why the
 * value can't be changed.
 *
 * @summary A disabled field with a description that explains why.
 */
export const Disabled: Story = {
    args: {
        label: "Email address",
        type: "email",
        defaultValue: "ada@example.com",
        description: "Contact your administrator to change it.",
        disabled: true,
    },
    play: async ({ args, canvas, userEvent }) => {
        const input = canvas.getByRole("textbox", { name: "Email address" });

        await expect(input).toBeDisabled();
        await userEvent.type(input, "x");
        await expect(input).toHaveValue("ada@example.com");
        await expect(args.onValueChange).not.toHaveBeenCalled();
    },
};

/**
 * `type` picks the keyboard on touch devices and the browser's checks. Set `autoComplete` for the user's own
 * data, so browsers can fill it in.
 *
 * @summary Email, password and search fields.
 */
export const InputTypes: Story = {
    render: (args) => (
        <div className={styles.stack}>
            <TextField {...args} type="email" label="Email address" autoComplete="email" />
            <TextField {...args} type="password" label="Password" autoComplete="current-password" />
            <TextField {...args} type="search" label="Search products" />
        </div>
    ),
    play: async ({ canvas }) => {
        await expect(canvas.getByRole("textbox", { name: "Email address" })).toHaveAttribute("type", "email");
        await expect(canvas.getByLabelText("Password")).toHaveAttribute("type", "password");
        await expect(canvas.getByRole("searchbox", { name: "Search products" })).toBeVisible();
    },
};

/**
 * `className` styles the field's outer element, `slotProps` its inner parts, here the input and the label.
 * Both are added to the component's own classes. See "Foundations/Customization" for all ways to adjust a
 * component.
 *
 * @summary Adjusting a text field with `className` and `slotProps`.
 */
export const CustomizedThroughSlotProps: Story = {
    args: {
        label: "Promo code",
        className: styles.promoCodeField,
        slotProps: {
            input: { className: styles.promoCodeInput },
            label: { className: styles.promoCodeLabel },
        },
    },
};
