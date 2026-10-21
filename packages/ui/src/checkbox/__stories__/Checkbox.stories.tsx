import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { expect, fn } from "storybook/test";

import { Checkbox } from "../Checkbox";

const meta = {
    component: Checkbox,
    title: "Components/Checkbox",
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
 *
 * @summary A checkbox with a visible label.
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
 *
 * @summary A checkbox whose checked state is controlled with `checked` and `onCheckedChange`.
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
 *
 * @summary A checkbox without a visible label, named with `aria-label`.
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
 *
 * @summary An indeterminate checkbox for a partly selected group.
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
 *
 * @summary A checkbox that is checked initially.
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
 *
 * @summary A disabled checkbox, which ignores clicks.
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
