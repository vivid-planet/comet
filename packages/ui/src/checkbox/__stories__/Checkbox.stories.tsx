import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { expect, fn } from "storybook/test";

import { Checkbox } from "../Checkbox";
import styles from "./Checkbox.stories.module.css";

const meta = {
    component: Checkbox,
    title: "Components/Checkbox",
    // The docs page is Checkbox.mdx.
    tags: ["!autodocs"],
    args: {
        onCheckedChange: fn(),
    },
    argTypes: {
        className: { control: false },
        style: { control: false },
        slotProps: { control: false },
        inputRef: { control: false },
    },
} satisfies Meta<typeof Checkbox>;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * An option in a form, labelled by its `children`. Clicking the box or the label toggles the checkbox, and
 * so does Space while it has focus.
 */
export const Default: Story = {
    args: {
        children: "Subscribe to the newsletter",
    },
    play: async ({ args, canvas, userEvent }) => {
        const checkbox = canvas.getByRole("checkbox", { name: "Subscribe to the newsletter" });

        await userEvent.tab();
        await expect(checkbox).toHaveFocus();
        await userEvent.keyboard(" ");
        await expect(checkbox).toBeChecked();
        await expect(args.onCheckedChange).toHaveBeenCalledOnce();

        await userEvent.click(canvas.getByText("Subscribe to the newsletter"));
        await expect(checkbox).not.toBeChecked();
        await expect(args.onCheckedChange).toHaveBeenCalledTimes(2);

        await userEvent.click(checkbox);
        await expect(checkbox).toBeChecked();
        await expect(args.onCheckedChange).toHaveBeenCalledTimes(3);
    },
};

/**
 * Pass `checked` and update it in `onCheckedChange` when the state lives in your application, for example
 * in a form library.
 */
export const Controlled: Story = {
    args: {
        children: "Subscribe to the newsletter",
    },
    render: function ControlledCheckbox(args) {
        const [checked, setChecked] = useState(false);

        return <Checkbox {...args} checked={checked} onCheckedChange={setChecked} />;
    },
    play: async ({ canvas, userEvent }) => {
        const checkbox = canvas.getByRole("checkbox", { name: "Subscribe to the newsletter" });

        await userEvent.click(checkbox);
        await expect(checkbox).toBeChecked();

        await userEvent.click(checkbox);
        await expect(checkbox).not.toBeChecked();
    },
};

/**
 * Where the context labels a checkbox visually, for example in a table row, name it with `aria-label` or
 * `aria-labelledby` instead of `children`. Say what it selects, not only "Select".
 */
export const WithoutVisibleLabel: Story = {
    args: {
        "aria-label": "Select order 1024",
    },
    play: async ({ canvas }) => {
        await expect(canvas.getByRole("checkbox", { name: "Select order 1024" })).toBeVisible();
    },
};

/**
 * A checkbox that selects a group of options is indeterminate while only some of them are selected. Derive
 * `indeterminate` from the group's state, and select or clear the whole group when it changes.
 */
export const Indeterminate: Story = {
    args: {
        indeterminate: true,
        children: "Select all products",
    },
    play: async ({ canvas }) => {
        await expect(canvas.getByRole("checkbox", { name: "Select all products" })).toHaveAttribute("aria-checked", "mixed");
    },
};

/**
 * `defaultChecked` sets the initial state of a checkbox whose state the component keeps itself.
 */
export const Checked: Story = {
    args: {
        defaultChecked: true,
        children: "Subscribe to the newsletter",
    },
};

/**
 * A disabled checkbox ignores clicks and is skipped by Tab. Prefer explaining why an option isn't available
 * over only disabling it.
 */
export const Disabled: Story = {
    args: {
        disabled: true,
        children: "Subscribe to the newsletter",
    },
    play: async ({ args, canvas, userEvent }) => {
        const checkbox = canvas.getByRole("checkbox", { name: "Subscribe to the newsletter" });

        await userEvent.click(canvas.getByText("Subscribe to the newsletter"));
        await userEvent.click(checkbox);
        await expect(checkbox).not.toBeChecked();
        await expect(args.onCheckedChange).not.toHaveBeenCalled();
    },
};

/**
 * `className` styles the checkbox's outer element, `slotProps` its inner parts, here the box (`control`) and
 * the label. Both are added to the component's own classes. See "Foundations/Customization" for all ways to
 * adjust a component.
 */
export const CustomizedThroughSlotProps: Story = {
    args: {
        children: "I accept the terms and conditions",
        className: styles.termsCheckbox,
        slotProps: {
            control: { className: styles.roundControl },
            label: { className: styles.strongLabel },
        },
    },
};
