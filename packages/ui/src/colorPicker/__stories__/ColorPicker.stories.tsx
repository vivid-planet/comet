import type { Decorator, Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { expect, fireEvent, fn, waitFor } from "storybook/test";

import { ColorPicker } from "../ColorPicker";
import styles from "./ColorPicker.stories.module.css";

const narrow: Decorator = (Story) => (
    <div className={styles.frame}>
        <Story />
    </div>
);

const meta = {
    component: ColorPicker,
    title: "Components/ColorPicker",
    // The docs page is ColorPicker.mdx.
    tags: ["!autodocs"],
    decorators: [narrow],
    args: {
        label: "Brand color",
        onValueChange: fn(),
    },
    argTypes: {
        label: { control: "text" },
        description: { control: "text" },
        error: { control: "text" },
        value: { control: "color" },
        defaultValue: { control: "color" },
        pickerLabel: { control: "text" },
        clearLabel: { control: "text" },
        presets: { control: "object" },
        className: { control: false },
        style: { control: false },
        slotProps: { control: false },
    },
} satisfies Meta<typeof ColorPicker>;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * A hex input named by its visible label, with a swatch that shows the color and opens the browser's color
 * picker. The typed value is completed to a lowercase `#rrggbb` when the input loses focus.
 */
export const Default: Story = {
    play: async ({ args, canvas, canvasElement, userEvent }) => {
        const input = canvas.getByRole("textbox", { name: "Brand color" });
        const swatch = canvasElement.querySelector(".dextinityColorPicker__swatch");

        await userEvent.click(canvas.getByText("Brand color"));
        await expect(input).toHaveFocus();
        await userEvent.type(input, "F60");
        await expect(args.onValueChange).not.toHaveBeenCalled();
        await userEvent.tab();
        await expect(input).toHaveValue("#ff6600");
        await expect(args.onValueChange).toHaveBeenCalledOnce();
        await expect(args.onValueChange).toHaveBeenCalledWith("#ff6600");
        await expect(swatch).toHaveStyle({ backgroundColor: "rgb(255, 102, 0)" });
        await expect(swatch).not.toHaveAttribute("data-empty");
    },
};

/**
 * Presets offer the colors that fit the design, such as the brand's colors, as buttons below the input. Each
 * preset's `label` names its button for assistive technology. The button of the current color is pressed.
 */
export const WithPresets: Story = {
    args: {
        defaultValue: "#403af2",
        presets: [
            { value: "#403af2", label: "Brand blue" },
            { value: "#14b8a6", label: "Teal" },
            { value: "#f59e0b", label: "Amber" },
            { value: "#e11d48", label: "Rose" },
            { value: "#1f2937", label: "Charcoal" },
            { value: "#ffffff", label: "White" },
        ],
    },
    play: async ({ args, canvas, userEvent }) => {
        const input = canvas.getByRole("textbox", { name: "Brand color" });
        const brandBlue = canvas.getByRole("button", { name: "Brand blue" });
        const teal = canvas.getByRole("button", { name: "Teal" });

        await expect(canvas.getByRole("group", { name: "Brand color" })).toContainElement(teal);
        await expect(brandBlue).toHaveAttribute("aria-pressed", "true");
        await userEvent.click(teal);
        await expect(teal).toHaveAttribute("aria-pressed", "true");
        await expect(brandBlue).toHaveAttribute("aria-pressed", "false");
        await expect(input).toHaveValue("#14b8a6");
        await expect(args.onValueChange).toHaveBeenCalledOnce();
        await expect(args.onValueChange).toHaveBeenCalledWith("#14b8a6");

        await userEvent.clear(input);
        await userEvent.type(input, "#FFF{Enter}");
        await expect(canvas.getByRole("button", { name: "White" })).toHaveAttribute("aria-pressed", "true");
    },
};

/**
 * `clearLabel` adds a button that empties an optional field, so `onValueChange` receives `null`. Focus moves
 * to the input, as the button disappears with the value.
 */
export const Clearable: Story = {
    args: {
        label: "Background color",
        description: "Leave it empty for a transparent background.",
        defaultValue: "#f59e0b",
        clearLabel: "Clear background color",
    },
    play: async ({ args, canvas, canvasElement, userEvent }) => {
        const input = canvas.getByRole("textbox", { name: "Background color" });

        await userEvent.click(canvas.getByRole("button", { name: "Clear background color" }));
        await expect(input).toHaveValue("");
        await expect(input).toHaveFocus();
        await expect(args.onValueChange).toHaveBeenCalledOnce();
        await expect(args.onValueChange).toHaveBeenCalledWith(null);
        await expect(canvas.queryByRole("button", { name: "Clear background color" })).not.toBeInTheDocument();
        await expect(canvasElement.querySelector(".dextinityColorPicker__swatch")).toHaveAttribute("data-empty");
    },
};

/**
 * `pickerLabel` names the swatch, so keyboard users reach it with Tab and can open the browser's color
 * picker with Enter or Space. Without it, the swatch is only for pointer users, and keyboard users type the
 * hex value.
 */
export const WithPickerLabel: Story = {
    args: {
        pickerLabel: "Pick brand color",
        defaultValue: "#403af2",
    },
    play: async ({ args, canvas, userEvent }) => {
        const picker = canvas.getByLabelText("Pick brand color");

        await userEvent.tab();
        await expect(picker).toHaveFocus();
        await userEvent.tab();
        await expect(canvas.getByRole("textbox", { name: "Brand color" })).toHaveFocus();

        fireEvent.input(picker, { target: { value: "#14b8a6" } });
        await expect(canvas.getByRole("textbox", { name: "Brand color" })).toHaveValue("#14b8a6");
        await expect(args.onValueChange).toHaveBeenCalledOnce();
        await expect(args.onValueChange).toHaveBeenCalledWith("#14b8a6");
    },
};

/**
 * Text that isn't a hex color stays in the input, so the user can correct it, and doesn't change the value.
 * The field shows it as invalid once Base UI validates the input, when the user presses Enter in it or on
 * submit in a Base UI `Form`, with the browser's message. Pass `error` for a message in the user's language.
 */
export const InvalidInput: Story = {
    args: {
        defaultValue: "#403af2",
    },
    play: async ({ args, canvas, canvasElement, userEvent }) => {
        const input = canvas.getByRole("textbox", { name: "Brand color" });

        await userEvent.clear(input);
        await userEvent.type(input, "#40{Enter}");
        await userEvent.tab();
        await expect(input).toHaveValue("#40");
        await expect(args.onValueChange).not.toHaveBeenCalled();
        await expect(canvasElement.querySelector(".dextinityColorPicker__swatch")).toHaveStyle({ backgroundColor: "rgb(64, 58, 242)" });
        await expect(input).toHaveAttribute("aria-invalid", "true");

        await userEvent.type(input, "3{Enter}");
        await expect(input).toHaveValue("#440033");
        await expect(input).not.toHaveAttribute("aria-invalid");
        await expect(args.onValueChange).toHaveBeenCalledOnce();
        await expect(args.onValueChange).toHaveBeenCalledWith("#440033");
    },
};

/**
 * An error from a form library or the server marks the field invalid. Say what's wrong and how to fix it,
 * rather than only "Invalid value".
 */
export const WithError: Story = {
    args: {
        defaultValue: "#40",
        error: "Enter a hex color like #403af2.",
    },
    play: async ({ canvas }) => {
        const input = canvas.getByRole("textbox", { name: "Brand color" });

        await expect(input).toHaveAttribute("aria-invalid", "true");
        await waitFor(() => expect(input).toHaveAccessibleDescription("Enter a hex color like #403af2."));
    },
};

/**
 * Pass `value` and update it in `onValueChange` when the value lives in your application, for example in a
 * form library.
 */
export const Controlled: Story = {
    render: function ControlledColorPicker(args) {
        const [value, setValue] = useState<string | null>("#e11d48");

        return <ColorPicker {...args} value={value} onValueChange={setValue} />;
    },
    play: async ({ canvas, userEvent }) => {
        const input = canvas.getByRole("textbox", { name: "Brand color" });

        await userEvent.clear(input);
        await userEvent.type(input, "#1F2937{Enter}");
        await expect(input).toHaveValue("#1f2937");
    },
};

/**
 * A required field shows an asterisk after the label and requires a color natively. Screen readers announce
 * the field as required instead of reading the asterisk. It has no clear button.
 */
export const Required: Story = {
    args: {
        required: true,
        clearLabel: "Clear brand color",
        defaultValue: "#403af2",
    },
    play: async ({ canvas }) => {
        await expect(canvas.getByRole("textbox", { name: "Brand color" })).toBeRequired();
        await expect(canvas.queryByRole("button", { name: "Clear brand color" })).not.toBeInTheDocument();
    },
};

/**
 * A read-only field shows a color the user can't change. The swatch doesn't open the color picker, and the
 * presets and the clear button aren't shown. The input still receives focus, so the value can be selected and
 * copied.
 */
export const ReadOnly: Story = {
    args: {
        defaultValue: "#403af2",
        readOnly: true,
        clearLabel: "Clear brand color",
        presets: [
            { value: "#403af2", label: "Brand blue" },
            { value: "#14b8a6", label: "Teal" },
        ],
    },
    play: async ({ args, canvas, canvasElement, userEvent }) => {
        const input = canvas.getByRole("textbox", { name: "Brand color" });

        await userEvent.click(input);
        await expect(input).toHaveFocus();
        await userEvent.keyboard("{Backspace}1{Enter}");
        await userEvent.tab();
        await expect(input).toHaveValue("#403af2");
        await expect(args.onValueChange).not.toHaveBeenCalled();
        await expect(canvas.queryByRole("button")).not.toBeInTheDocument();
        await expect(canvasElement.querySelector(".dextinityColorPicker__picker")).not.toBeInTheDocument();
    },
};

/**
 * A disabled field ignores input, and Tab skips its input and presets. Its description stays readable: use it
 * to say why the color can't be changed.
 */
export const Disabled: Story = {
    args: {
        defaultValue: "#403af2",
        description: "The brand color is set by your organization.",
        disabled: true,
        presets: [
            { value: "#403af2", label: "Brand blue" },
            { value: "#14b8a6", label: "Teal" },
        ],
    },
    play: async ({ args, canvas, userEvent }) => {
        await expect(canvas.getByRole("textbox", { name: "Brand color" })).toBeDisabled();
        await userEvent.click(canvas.getByRole("button", { name: "Teal" }));
        await expect(args.onValueChange).not.toHaveBeenCalled();
        await userEvent.tab();
        await expect(document.body).toHaveFocus();
    },
};

/**
 * `className` styles the field's outer element, `slotProps` its inner parts, here the swatch and the preset
 * buttons, which become round. Both are added to the component's own classes. See "Foundations/Customization"
 * for all ways to adjust a component.
 */
export const CustomizedThroughSlotProps: Story = {
    args: {
        label: "Accent color",
        defaultValue: "#14b8a6",
        presets: [
            { value: "#403af2", label: "Brand blue" },
            { value: "#14b8a6", label: "Teal" },
            { value: "#f59e0b", label: "Amber" },
            { value: "#e11d48", label: "Rose" },
        ],
        className: styles.accentColorField,
        slotProps: {
            swatch: { className: styles.roundSwatch },
            preset: { className: styles.roundPreset },
        },
    },
};
