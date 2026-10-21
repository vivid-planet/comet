import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { expect, fn } from "storybook/test";

import { Switch } from "../Switch";

const meta = {
    component: Switch,
    title: "Components/Switch",
    args: {
        onCheckedChange: fn(),
    },
    argTypes: {
        className: { control: false },
        style: { control: false },
        slotProps: { control: false },
        inputRef: { control: false },
    },
} satisfies Meta<typeof Switch>;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * A setting that takes effect immediately, labelled by its `children`. Clicking the track or the label
 * toggles the switch, and so does Space while it has focus.
 *
 * @summary A switch with a visible label.
 */
export const Default: Story = {
    args: {
        children: "Email notifications",
    },
    play: async ({ args, canvas, userEvent }) => {
        const switchControl = canvas.getByRole("switch", { name: "Email notifications" });

        await userEvent.tab();
        await expect(switchControl).toHaveFocus();
        await userEvent.keyboard(" ");
        await expect(switchControl).toHaveAttribute("aria-checked", "true");
        await expect(args.onCheckedChange).toHaveBeenCalledOnce();

        await userEvent.click(canvas.getByText("Email notifications"));
        await expect(switchControl).toHaveAttribute("aria-checked", "false");
        await expect(args.onCheckedChange).toHaveBeenCalledTimes(2);

        await userEvent.click(switchControl);
        await expect(switchControl).toHaveAttribute("aria-checked", "true");
        await expect(args.onCheckedChange).toHaveBeenCalledTimes(3);
    },
};

/**
 * Pass `checked` and update it in `onCheckedChange` when the setting lives in your application, for example
 * to save it as soon as it changes.
 *
 * @summary A switch whose state is controlled with `checked` and `onCheckedChange`.
 */
export const Controlled: Story = {
    args: {
        children: "Email notifications",
    },
    render: function ControlledSwitch(args) {
        const [checked, setChecked] = useState(false);

        return <Switch {...args} checked={checked} onCheckedChange={setChecked} />;
    },
    play: async ({ canvas, userEvent }) => {
        const switchControl = canvas.getByRole("switch", { name: "Email notifications" });

        await userEvent.click(switchControl);
        await expect(switchControl).toHaveAttribute("aria-checked", "true");

        await userEvent.click(switchControl);
        await expect(switchControl).toHaveAttribute("aria-checked", "false");
    },
};

/**
 * Where the context labels a switch visually, for example in a table row, name it with `aria-label` or
 * `aria-labelledby` instead of `children`. Name the setting, not its state: "Published", not "On".
 *
 * @summary A switch without a visible label, named with `aria-label`.
 */
export const WithoutVisibleLabel: Story = {
    args: {
        "aria-label": "Published",
    },
    play: async ({ canvas }) => {
        await expect(canvas.getByRole("switch", { name: "Published" })).toBeVisible();
    },
};

/**
 * `defaultChecked` sets the initial state of a switch whose state the component keeps itself.
 *
 * @summary A switch that is on initially.
 */
export const Checked: Story = {
    args: {
        defaultChecked: true,
        children: "Email notifications",
    },
};

/**
 * A disabled switch ignores clicks and is skipped by Tab. Prefer explaining why a setting can't be changed
 * over only disabling it.
 *
 * @summary A disabled switch, which ignores clicks.
 */
export const Disabled: Story = {
    args: {
        disabled: true,
        children: "Email notifications",
    },
    play: async ({ args, canvas, userEvent }) => {
        const switchControl = canvas.getByRole("switch", { name: "Email notifications" });

        await userEvent.click(canvas.getByText("Email notifications"));
        await userEvent.click(switchControl);
        await expect(switchControl).toHaveAttribute("aria-checked", "false");
        await expect(args.onCheckedChange).not.toHaveBeenCalled();
    },
};
