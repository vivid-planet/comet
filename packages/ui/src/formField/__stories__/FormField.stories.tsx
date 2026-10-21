import { Field } from "@base-ui/react/field";
import { Input } from "@base-ui/react/input";
import type { Decorator, Meta, StoryObj } from "@storybook/react-vite";
import { expect, waitFor } from "storybook/test";

import { FormField } from "../FormField";
import styles from "./FormField.stories.module.css";

const controlOptions = {
    Input: <Input className={styles.control} />,
    NativeSelect: (
        <Field.Control render={<select className={styles.control} />} defaultValue="at">
            <option value="at">Austria</option>
            <option value="de">Germany</option>
            <option value="ch">Switzerland</option>
        </Field.Control>
    ),
};

const narrow: Decorator = (Story) => (
    <div className={styles.frame}>
        <Story />
    </div>
);

const meta = {
    component: FormField,
    title: "Components/FormField",
    decorators: [narrow],
    args: {
        label: "Company name",
        children: <Input className={styles.control} />,
    },
    argTypes: {
        label: { control: "text" },
        description: { control: "text" },
        error: { control: "text" },
        validationMode: { control: "radio", options: ["onSubmit", "onBlur", "onChange"] },
        children: { control: "select", options: Object.keys(controlOptions), mapping: controlOptions },
        className: { control: false },
        slotProps: { control: false },
        validate: { control: false },
        actionsRef: { control: false },
    },
} satisfies Meta<typeof FormField>;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * A control that has no field of its own, here Base UI's unstyled `Input` with the application's styles,
 * gets a label and a description. Clicking the label focuses the control. For text input, use `TextField`,
 * which comes styled.
 *
 * @summary A Base UI `Input` with a label and a description.
 */
export const Default: Story = {
    args: {
        description: "As shown on your invoices.",
    },
    play: async ({ canvas, userEvent }) => {
        const input = canvas.getByRole("textbox", { name: "Company name" });

        await waitFor(() => expect(input).toHaveAccessibleDescription("As shown on your invoices."));
        await userEvent.click(canvas.getByText("Company name"));
        await expect(input).toHaveFocus();
    },
};

/**
 * A native element, such as a `<select>`, connects to the field through Base UI's `Field.Control` with
 * `render`. Pass the options as its children.
 *
 * @summary A native `<select>` rendered through `Field.Control`.
 */
export const WithNativeSelect: Story = {
    args: {
        label: "Country",
        description: "Determines the tax rate.",
    },
    render: (args) => (
        <FormField {...args}>
            <Field.Control render={<select className={styles.control} />} defaultValue="at">
                <option value="at">Austria</option>
                <option value="de">Germany</option>
                <option value="ch">Switzerland</option>
            </Field.Control>
        </FormField>
    ),
    play: async ({ canvas, userEvent }) => {
        const select = canvas.getByRole("combobox", { name: "Country" });

        await waitFor(() => expect(select).toHaveAccessibleDescription("Determines the tax rate."));
        await userEvent.selectOptions(select, "Germany");
        await expect(select).toHaveValue("de");
    },
};

/**
 * An error from a form library or the server marks the field invalid and is shown below the control. Say
 * how to fix the value.
 *
 * @summary An error message passed as `error`.
 */
export const WithError: Story = {
    args: {
        error: "Enter a company name.",
    },
    play: async ({ canvas }) => {
        const input = canvas.getByRole("textbox", { name: "Company name" });

        await expect(input).toHaveAttribute("aria-invalid", "true");
        await waitFor(() => expect(input).toHaveAccessibleDescription("Enter a company name."));
    },
};

/**
 * Without `error`, the field shows the browser's message when the control fails a constraint, such as
 * `required` or `type="email"`. `validationMode` sets when Base UI checks it, here when the control loses
 * focus. The message is in the browser's language: pass `error` for your own wording.
 *
 * @summary The browser's message for a failed constraint, checked on blur.
 */
export const WithBrowserValidation: Story = {
    args: {
        label: "Email address",
        required: true,
        validationMode: "onBlur",
        children: <Input type="email" required className={styles.control} />,
    },
    play: async ({ canvas, userEvent }) => {
        const input = canvas.getByRole("textbox", { name: "Email address" });

        await userEvent.type(input, "ada");
        await userEvent.tab();
        await waitFor(() => expect(input).toHaveAttribute("aria-invalid", "true"));
        await expect(input).toHaveAccessibleDescription(/.+/);
    },
};
