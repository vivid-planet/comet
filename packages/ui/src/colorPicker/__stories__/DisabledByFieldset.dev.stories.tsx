import { Fieldset } from "@base-ui/react/fieldset";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect } from "storybook/test";

import { ColorPicker } from "../ColorPicker";

const meta = {
    component: ColorPicker,
    title: "Components/ColorPicker/Dev/Disabled by a fieldset",
    tags: ["!autodocs", "!manifest"],
} satisfies Meta<typeof ColorPicker>;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * A color picker that an enclosing Base UI `Fieldset` disables looks the same as one disabled through its own
 * `disabled` prop: it is dimmed and has no clear button.
 */
export const DisabledByFieldset: Story = {
    args: {
        label: "Brand color",
        defaultValue: "#403af2",
        clearLabel: "Clear brand color",
        presets: [{ value: "#14b8a6", label: "Teal" }],
    },
    render: (args) => (
        <Fieldset.Root disabled>
            <Fieldset.Legend>Branding</Fieldset.Legend>
            <ColorPicker {...args} />
        </Fieldset.Root>
    ),
    play: async ({ canvas, canvasElement }) => {
        const group = canvasElement.querySelector(".dextinityColorPicker__group");
        if (!(group instanceof HTMLElement)) {
            throw new Error("The group is missing.");
        }
        const groupStyle = getComputedStyle(group);

        await expect(canvas.getByRole("textbox", { name: "Brand color" })).toBeDisabled();
        await expect(canvas.getByRole("button", { name: "Teal" })).toBeDisabled();
        await expect(canvas.queryByRole("button", { name: "Clear brand color" })).not.toBeInTheDocument();
        // Compared as numbers: a production build writes the token's 0.4 as .4.
        await expect(Number(groupStyle.opacity)).toBe(Number(groupStyle.getPropertyValue("--dextinity-opacity-disabled")));
    },
};
