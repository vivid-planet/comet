import type { Decorator, Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { expect, fn } from "storybook/test";

import { FormField } from "../../formField/FormField";
import { Icon } from "../../icon/Icon";
import { IconButton } from "../../iconButton/IconButton";
import { Input } from "../Input";
import styles from "./Input.stories.module.css";

const narrow: Decorator = (Story) => (
    <div className={styles.frame}>
        <Story />
    </div>
);

const meta = {
    component: Input,
    title: "Components/Input",
    // The docs page is Input.mdx.
    tags: ["!autodocs"],
    decorators: [narrow],
    args: {
        "aria-label": "Search products",
        onValueChange: fn(),
    },
    argTypes: {
        startAdornment: { control: false },
        endAdornment: { control: false },
        className: { control: false },
        slotProps: { control: false },
    },
} satisfies Meta<typeof Input>;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * An input on its own, named by `aria-label` because it has no visible label.
 */
export const Default: Story = {
    play: async ({ args, canvas, userEvent }) => {
        const input = canvas.getByRole("textbox", { name: "Search products" });

        await userEvent.type(input, "Chair");
        await expect(input).toHaveValue("Chair");
        await expect(args.onValueChange).toHaveBeenLastCalledWith("Chair", expect.anything());
    },
};

/**
 * Inside a `FormField`, the field's label names the input and its error marks the input invalid.
 */
export const InFormField: Story = {
    args: { "aria-label": undefined },
    render: (args) => (
        <FormField label="Price" description="Including VAT." error="Enter a price above 0.">
            <Input {...args} startAdornment="€" defaultValue="0" />
        </FormField>
    ),
    play: async ({ canvas }) => {
        await expect(canvas.getByRole("textbox", { name: "Price" })).toHaveAttribute("aria-invalid", "true");
    },
};

/**
 * Adornments put an icon before the text and an action, such as clearing the value, after it.
 */
export const WithAdornments: Story = {
    render: function Render(args) {
        const [value, setValue] = useState("Chair");

        return (
            <Input
                {...args}
                value={value}
                onValueChange={setValue}
                startAdornment={<Icon name="search" />}
                endAdornment={
                    value !== "" && (
                        <IconButton label="Clear" size="small" onClick={() => setValue("")}>
                            <Icon name="close" />
                        </IconButton>
                    )
                }
            />
        );
    },
    play: async ({ canvas, userEvent }) => {
        await userEvent.click(canvas.getByRole("button", { name: "Clear" }));
        await expect(canvas.getByRole("textbox", { name: "Search products" })).toHaveValue("");
    },
};

/**
 * `multiline` renders a textarea for text of several lines.
 */
export const Multiline: Story = {
    args: { "aria-label": "Notes", multiline: true, rows: 4 },
};

/**
 * A disabled input can't be focused or changed.
 */
export const Disabled: Story = {
    args: { disabled: true, defaultValue: "Chair" },
};

/**
 * `className` styles the box, `slotProps.input` the text.
 */
export const CustomizedThroughSlotProps: Story = {
    args: {
        "aria-label": "Promo code",
        className: styles.promoCodeBox,
        slotProps: { input: { className: styles.promoCodeInput } },
    },
};
