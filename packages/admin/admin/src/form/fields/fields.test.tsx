import userEvent from "@testing-library/user-event";
import { Form } from "react-final-form";
import { cleanup, render, screen, waitFor } from "test-utils";
import { afterEach, describe, expect, it, vi } from "vitest";

import { Field } from "../Field";
import { FinalFormInput } from "../FinalFormInput";
import { CheckboxField } from "./CheckboxField";
import { CheckboxListField } from "./CheckboxListField";
import { NumberField } from "./NumberField";
import { RadioGroupField } from "./RadioGroupField";
import { SelectField } from "./SelectField";
import { SwitchField } from "./SwitchField";
import { TextAreaField } from "./TextAreaField";
import { TextField } from "./TextField";

function renderForm(fields: React.ReactNode, initialValues: Record<string, unknown> = {}) {
    const onSubmit = vi.fn();
    const rendered = render(
        <Form onSubmit={(values) => onSubmit(values)} initialValues={initialValues}>
            {({ handleSubmit, values }) => (
                <form onSubmit={handleSubmit}>
                    {fields}
                    <output data-testid="values">{JSON.stringify(values)}</output>
                </form>
            )}
        </Form>,
    );
    const values = () => JSON.parse(screen.getByTestId("values").textContent || "{}");
    return { ...rendered, onSubmit, values };
}

describe("Form fields built on @dextinity/ui", () => {
    afterEach(cleanup);

    it("names a text field's input with its label and updates the form value", async () => {
        const { values } = renderForm(<TextField name="title" label="Title" helperText="Shown in the browser tab" />);

        const input = screen.getByRole("textbox", { name: "Title" });
        await userEvent.type(input, "Hello");

        expect(values()).toEqual({ title: "Hello" });
        expect(input).toHaveAccessibleDescription("Shown in the browser tab");
    });

    it("shows the required error after the field was touched and marks the input invalid", async () => {
        renderForm(<TextField name="title" label="Title" required />);

        const input = screen.getByRole("textbox", { name: "Title" });
        expect(screen.queryByText("Required")).not.toBeInTheDocument();

        await userEvent.click(input);
        await userEvent.tab();

        expect(await screen.findByText("Required")).toBeInTheDocument();
        await waitFor(() => expect(input).toHaveAttribute("aria-invalid", "true"));
        expect(input).toBeRequired();
    });

    it("clears an optional text field with the clear button", async () => {
        const { values } = renderForm(<TextField name="title" label="Title" />, { title: "Hello" });

        await userEvent.click(screen.getByRole("button", { name: "Clear" }));

        expect(values()).toEqual({});
        expect(screen.getByRole("textbox", { name: "Title" })).toHaveValue("");
    });

    it("uses the type set in inputProps", () => {
        renderForm(<Field name="price" label="Price" component={FinalFormInput} inputProps={{ type: "number" }} />);

        expect(screen.getByRole("spinbutton", { name: "Price" })).toHaveAttribute("type", "number");
    });

    it("renders a textarea for a text area field", () => {
        renderForm(<TextAreaField name="description" label="Description" />);

        expect(screen.getByRole("textbox", { name: "Description" }).tagName).toBe("TEXTAREA");
    });

    it("formats a number field's value on blur and stores it as a number", async () => {
        const { values } = renderForm(<NumberField name="price" label="Price" decimals={2} />);

        const input = screen.getByRole("textbox", { name: "Price" });
        await userEvent.type(input, "1234.5");
        await userEvent.tab();

        expect(values()).toEqual({ price: 1234.5 });
        expect(input).toHaveValue("1,234.50");
    });

    it("selects an option of a select field", async () => {
        const { values } = renderForm(
            <SelectField
                name="flavor"
                label="Flavor"
                options={[
                    { value: "chocolate", label: "Chocolate" },
                    { value: "vanilla", label: "Vanilla" },
                ]}
            />,
        );

        await userEvent.click(screen.getByRole("combobox", { name: "Flavor" }));
        await userEvent.click(await screen.findByRole("option", { name: "Vanilla" }));

        await waitFor(() => expect(values()).toEqual({ flavor: "vanilla" }));
        expect(screen.getByRole("combobox", { name: "Flavor" })).toHaveTextContent("Vanilla");
    });

    it("doesn't show a select field's required error while its list is open", async () => {
        renderForm(
            <SelectField
                name="flavor"
                label="Flavor"
                required
                options={[
                    { value: "chocolate", label: "Chocolate" },
                    { value: "vanilla", label: "Vanilla" },
                ]}
            />,
        );

        await userEvent.click(screen.getByRole("combobox", { name: "Flavor" }));
        await screen.findByRole("option", { name: "Vanilla" });
        expect(screen.queryByText("Required")).not.toBeInTheDocument();

        await userEvent.keyboard("{Escape}");
        await userEvent.tab();
        expect(await screen.findByText("Required")).toBeInTheDocument();
    });

    it("keeps the type of numeric option values", async () => {
        const { values } = renderForm(
            <SelectField
                name="amount"
                label="Amount"
                options={[
                    { value: 1, label: "One" },
                    { value: 2, label: "Two" },
                ]}
            />,
            { amount: 1 },
        );

        expect(screen.getByRole("combobox", { name: "Amount" })).toHaveTextContent("One");
        await userEvent.click(screen.getByRole("combobox", { name: "Amount" }));
        await userEvent.click(await screen.findByRole("option", { name: "Two" }));

        await waitFor(() => expect(values()).toEqual({ amount: 2 }));
    });

    it("toggles a checkbox field and a switch field", async () => {
        const { values } = renderForm(
            <>
                <CheckboxField name="accepted" label="Accept the terms" />
                <SwitchField name="active" label={(checked) => (checked ? "Active" : "Inactive")} />
            </>,
        );

        await userEvent.click(screen.getByRole("checkbox", { name: "Accept the terms" }));
        await userEvent.click(screen.getByRole("switch", { name: "Inactive" }));

        expect(values()).toEqual({ accepted: true, active: true });
        expect(screen.getByRole("switch", { name: "Active" })).toBeChecked();
    });

    it("selects an option of a radio group field, named by the field's label", async () => {
        const { values } = renderForm(
            <RadioGroupField
                name="size"
                label="Size"
                options={[
                    { value: "s", label: "Small" },
                    { value: "l", label: "Large" },
                ]}
            />,
        );

        expect(screen.getByRole("radiogroup", { name: "Size" })).toBeInTheDocument();
        await userEvent.click(screen.getByRole("radio", { name: "Large" }));

        expect(values()).toEqual({ size: "l" });
    });

    it("collects the checked options of a checkbox list field and unsets the value when none is checked", async () => {
        const { values } = renderForm(
            <CheckboxListField
                name="toppings"
                label="Toppings"
                options={[
                    { value: "nuts", label: "Nuts" },
                    { value: "sprinkles", label: "Sprinkles" },
                ]}
            />,
        );

        await userEvent.click(screen.getByRole("checkbox", { name: "Nuts" }));
        await userEvent.click(screen.getByRole("checkbox", { name: "Sprinkles" }));
        expect(values()).toEqual({ toppings: ["nuts", "sprinkles"] });

        await userEvent.click(screen.getByRole("checkbox", { name: "Nuts" }));
        await userEvent.click(screen.getByRole("checkbox", { name: "Sprinkles" }));
        expect(values()).toEqual({});
    });

    it("doesn't touch a checkbox list field while the focus moves between its options", async () => {
        renderForm(
            <>
                <CheckboxListField
                    name="toppings"
                    label="Toppings"
                    required
                    options={[
                        { value: "nuts", label: "Nuts" },
                        { value: "sprinkles", label: "Sprinkles" },
                    ]}
                />
                <TextField name="note" label="Note" />
            </>,
        );

        await userEvent.click(screen.getByRole("checkbox", { name: "Nuts" }));
        await userEvent.click(screen.getByRole("checkbox", { name: "Nuts" }));
        await userEvent.tab();
        expect(screen.getByRole("checkbox", { name: "Sprinkles" })).toHaveFocus();
        expect(screen.queryByText("Required")).not.toBeInTheDocument();

        await userEvent.tab();
        expect(await screen.findByText("Required")).toBeInTheDocument();
    });

    it("disables the control of a disabled field", () => {
        renderForm(<TextField name="title" label="Title" disabled />);

        expect(screen.getByRole("textbox", { name: "Title" })).toBeDisabled();
    });
});
