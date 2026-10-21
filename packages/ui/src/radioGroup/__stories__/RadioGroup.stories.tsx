import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn } from "storybook/test";

import { Radio } from "../Radio";
import { RadioGroup } from "../RadioGroup";

const meta = {
    component: RadioGroup,
    subcomponents: { Radio },
    title: "Components/RadioGroup",
    args: {
        label: "Shipping method",
        onValueChange: fn(),
    },
    argTypes: {
        label: { control: "text" },
        description: { control: "text" },
        error: { control: "text" },
        orientation: { control: "radio", options: ["vertical", "horizontal"] },
        // The options are JSX in the render functions, so that the documentation snippets show them as code.
        children: { control: false },
        className: { control: false },
        slotProps: { control: false },
        inputRef: { control: false },
    },
    render: (args) => (
        <RadioGroup {...args}>
            <Radio value="standard">Standard</Radio>
            <Radio value="express">Express</Radio>
            <Radio value="pickup">Pickup in store</Radio>
        </RadioGroup>
    ),
} satisfies Meta<typeof RadioGroup>;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * A choice of one option from a short list, named by `label`. Clicking an option or its label selects it.
 * Tab moves focus into the group, and the arrow keys move focus and selection to the next or previous option.
 *
 * @summary A radio group with three options.
 */
export const Default: Story = {
    play: async ({ args, canvas, userEvent }) => {
        const standard = canvas.getByRole("radio", { name: "Standard" });
        const express = canvas.getByRole("radio", { name: "Express" });
        const pickup = canvas.getByRole("radio", { name: "Pickup in store" });

        await userEvent.click(canvas.getByText("Standard"));
        await expect(standard).toBeChecked();
        await expect(args.onValueChange).toHaveBeenLastCalledWith("standard", expect.anything());

        await userEvent.keyboard("{ArrowDown}");
        await expect(express).toHaveFocus();
        await expect(express).toBeChecked();
        await expect(standard).not.toBeChecked();

        await userEvent.keyboard("{ArrowDown}");
        await expect(pickup).toHaveFocus();
        await expect(pickup).toBeChecked();

        await userEvent.keyboard("{ArrowUp}");
        await expect(express).toHaveFocus();
        await expect(express).toBeChecked();
        await expect(args.onValueChange).toHaveBeenLastCalledWith("express", expect.anything());

        await userEvent.click(pickup);
        await expect(pickup).toBeChecked();
    },
};

/**
 * `description` explains the choice, for example what it costs or affects. Assistive technology reads it with
 * the group and with each option.
 *
 * @summary A radio group with help text below the options.
 */
export const WithDescription: Story = {
    args: {
        description: "Express orders placed before 2 pm arrive the next working day.",
    },
    play: async ({ canvas }) => {
        await expect(canvas.getByRole("radiogroup", { name: "Shipping method" })).toHaveAccessibleDescription(
            "Express orders placed before 2 pm arrive the next working day.",
        );
    },
};

/**
 * Set `error` when validation fails, for example in your form library or on the server, and clear it once
 * the value is valid. Say how to fix the error, not only that there is one. A `description` stays visible
 * above the error.
 *
 * @summary A radio group with an error message, marked as invalid.
 */
export const WithError: Story = {
    args: {
        required: true,
        error: "Select a shipping method.",
    },
    play: async ({ canvas }) => {
        const group = canvas.getByRole("radiogroup", { name: "Shipping method" });

        await expect(group).toHaveAttribute("aria-invalid", "true");
        await expect(group).toHaveAccessibleDescription("Select a shipping method.");
        await expect(canvas.getByRole("radio", { name: "Standard" })).toHaveAttribute("aria-invalid", "true");
    },
};

/**
 * Lay out a few short options in a row, such as "Yes" and "No". The options wrap onto further lines when
 * space runs out; prefer the vertical layout for longer labels.
 *
 * @summary A radio group with its options in a row.
 */
export const Horizontal: Story = {
    args: {
        label: "Gift wrapping",
        orientation: "horizontal",
        defaultValue: "no",
    },
    render: (args) => (
        <RadioGroup {...args}>
            <Radio value="yes">Yes</Radio>
            <Radio value="no">No</Radio>
        </RadioGroup>
    ),
    play: async ({ args, canvas, userEvent }) => {
        const yes = canvas.getByRole("radio", { name: "Yes" });

        await userEvent.tab();
        await expect(canvas.getByRole("radio", { name: "No" })).toHaveFocus();

        await userEvent.keyboard("{ArrowLeft}");
        await expect(yes).toHaveFocus();
        await expect(yes).toBeChecked();
        await expect(args.onValueChange).toHaveBeenLastCalledWith("yes", expect.anything());
    },
};

/**
 * Disable an option that doesn't apply right now, and say why in its label or the description. The arrow
 * keys skip it.
 *
 * @summary A radio group in which one option is disabled.
 */
export const WithDisabledOption: Story = {
    args: {
        description: "Pickup is available again from Monday.",
    },
    render: (args) => (
        <RadioGroup {...args}>
            <Radio value="standard">Standard</Radio>
            <Radio value="pickup" disabled>
                Pickup in store
            </Radio>
            <Radio value="express">Express</Radio>
        </RadioGroup>
    ),
    play: async ({ args, canvas, userEvent }) => {
        const pickup = canvas.getByRole("radio", { name: "Pickup in store" });

        await userEvent.click(canvas.getByText("Pickup in store"));
        await expect(pickup).not.toBeChecked();
        await expect(args.onValueChange).not.toHaveBeenCalled();

        await userEvent.click(canvas.getByRole("radio", { name: "Standard" }));
        await userEvent.keyboard("{ArrowDown}");
        await expect(canvas.getByRole("radio", { name: "Express" })).toHaveFocus();
        await expect(pickup).not.toBeChecked();
    },
};

/**
 * A disabled group ignores clicks and the arrow keys, and keeps its value. Prefer explaining why the choice
 * isn't available over only disabling it.
 *
 * @summary A disabled radio group, which ignores interaction.
 */
export const Disabled: Story = {
    args: {
        disabled: true,
        defaultValue: "standard",
    },
    play: async ({ args, canvas, userEvent }) => {
        await userEvent.click(canvas.getByText("Express"));
        await userEvent.click(canvas.getByRole("radio", { name: "Pickup in store" }));
        await userEvent.tab();
        await userEvent.keyboard("{ArrowDown}");
        await expect(canvas.getByRole("radio", { name: "Standard" })).toBeChecked();
        await expect(args.onValueChange).not.toHaveBeenCalled();
    },
};
