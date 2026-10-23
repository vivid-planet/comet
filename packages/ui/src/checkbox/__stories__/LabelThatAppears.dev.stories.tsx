import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { expect } from "storybook/test";

import { Switch } from "../../switch/Switch";
import { Checkbox } from "../Checkbox";

const meta = {
    title: "Components/Checkbox/Dev/Label that appears",
    tags: ["!autodocs", "!manifest"],
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

function ControlsWithLabelThatAppears() {
    const [isChecked, setIsChecked] = useState(false);
    const [isSwitchLabelShown, setIsSwitchLabelShown] = useState(false);

    return (
        <>
            <Checkbox aria-label="Select all orders" checked={isChecked} onCheckedChange={setIsChecked}>
                {isChecked && "All orders selected"}
            </Checkbox>
            <Switch aria-label="Notifications" onCheckedChange={() => setIsSwitchLabelShown(true)}>
                {isSwitchLabelShown && "Notifications are on"}
            </Switch>
        </>
    );
}

/**
 * A label that appears or disappears while the control has focus doesn't move the focus or reset the control.
 */
export const LabelThatAppears: Story = {
    render: () => <ControlsWithLabelThatAppears />,
    play: async ({ canvas, userEvent }) => {
        const checkbox = canvas.getByRole("checkbox");
        checkbox.focus();
        await userEvent.keyboard(" ");
        await expect(canvas.getByRole("checkbox")).toHaveFocus();
        await expect(canvas.getByRole("checkbox")).toHaveAttribute("aria-checked", "true");

        canvas.getByRole("switch").focus();
        await userEvent.keyboard(" ");
        await expect(canvas.getByRole("switch")).toHaveFocus();
        await expect(canvas.getByRole("switch")).toHaveAttribute("aria-checked", "true");
    },
};
