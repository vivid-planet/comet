import { CheckboxGroup } from "@base-ui/react/checkbox-group";
import { Field } from "@base-ui/react/field";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect } from "storybook/test";

import { Switch } from "../../switch/Switch";
import { Checkbox } from "../Checkbox";

const meta = {
    component: Checkbox,
    title: "Components/Checkbox/Dev/Disabled by context",
    tags: ["!autodocs", "!manifest"],
} satisfies Meta<typeof Checkbox>;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * A checkbox or switch that an enclosing Base UI component disables looks the same as one disabled through
 * its own `disabled` prop.
 */
export const DisabledByContext: Story = {
    render: () => (
        <>
            <Checkbox value="own" disabled>
                Disabled by its own prop
            </Checkbox>
            <CheckboxGroup defaultValue={[]} disabled aria-label="Toppings">
                <Checkbox value="cheese">Disabled by its group</Checkbox>
            </CheckboxGroup>
            <Field.Root disabled>
                <Switch>Disabled by its field</Switch>
            </Field.Root>
        </>
    ),
    play: async ({ canvas }) => {
        const opacityOf = (name: string, role: "checkbox" | "switch") => {
            const root = canvas.getByRole(role, { name }).parentElement;
            return root ? getComputedStyle(root).opacity : undefined;
        };

        const ownDisabledOpacity = opacityOf("Disabled by its own prop", "checkbox");
        await expect(ownDisabledOpacity).not.toBe("1");
        await expect(opacityOf("Disabled by its group", "checkbox")).toBe(ownDisabledOpacity);
        await expect(opacityOf("Disabled by its field", "switch")).toBe(ownDisabledOpacity);
    },
};
