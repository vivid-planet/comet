import { Field } from "@base-ui/react/field";
import { Input } from "@base-ui/react/input";
import { render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { FormField } from "./FormField";

describe("FormField", () => {
    it("renders the styling contract around a control named by the label", () => {
        const { container } = render(
            <FormField label="Company name">
                <Input />
            </FormField>,
        );

        const control = screen.getByRole("textbox", { name: "Company name" });
        const root = container.firstElementChild;
        expect(root).toHaveClass("dextinityFormField");
        expect(root).not.toHaveAttribute("data-required");
        expect(root).not.toHaveAttribute("data-disabled");
        expect(screen.getByText("Company name")).toHaveClass("dextinityFormField__label");
        expect(screen.getByText("Company name")).toHaveAttribute("for", control.id);
        expect(container.querySelector(".dextinityFormField__description")).not.toBeInTheDocument();
        expect(container.querySelector(".dextinityFormField__error")).not.toBeInTheDocument();
    });

    it("describes the control with the description and the error", async () => {
        render(
            <FormField label="Company name" description="As shown on your invoices." error="Enter a company name.">
                <Input />
            </FormField>,
        );

        const control = screen.getByRole("textbox", { name: "Company name" });
        expect(screen.getByText("As shown on your invoices.")).toHaveClass("dextinityFormField__description");
        expect(screen.getByText("Enter a company name.")).toHaveClass("dextinityFormField__error");
        await waitFor(() => expect(control).toHaveAccessibleDescription("As shown on your invoices. Enter a company name."));
    });

    it("marks the field invalid while it has an error", () => {
        const { container } = render(
            <FormField label="Company name" error="Enter a company name.">
                <Input />
            </FormField>,
        );

        expect(container.firstElementChild).toHaveAttribute("data-invalid");
        expect(screen.getByRole("textbox", { name: "Company name" })).toHaveAttribute("aria-invalid", "true");
    });

    it("treats an error that renders nothing as no error", () => {
        const { container } = render(
            <FormField label="Company name" error={false}>
                <Input />
            </FormField>,
        );

        expect(container.firstElementChild).not.toHaveAttribute("data-invalid");
        expect(screen.getByRole("textbox", { name: "Company name" })).not.toHaveAttribute("aria-invalid");
        expect(container.querySelector(".dextinityFormField__error")).not.toBeInTheDocument();
    });

    it("shows a required indicator that is left out of the control's name", () => {
        const { container } = render(
            <FormField label="Company name" required>
                <Input required />
            </FormField>,
        );

        const indicator = container.querySelector(".dextinityFormField__requiredIndicator");
        expect(container.firstElementChild).toHaveAttribute("data-required");
        expect(indicator).toHaveAttribute("aria-hidden", "true");
        expect(indicator?.parentElement).toHaveClass("dextinityFormField__label");
        expect(screen.getByRole("textbox", { name: "Company name" })).toBeRequired();
    });

    it("disables the control and reflects it on the root and the label", () => {
        const { container } = render(
            <FormField label="Company name" description="Set by your administrator." disabled>
                <Input />
            </FormField>,
        );

        expect(container.firstElementChild).toHaveAttribute("data-disabled");
        expect(screen.getByText("Company name")).toHaveAttribute("data-disabled");
        expect(screen.getByRole("textbox", { name: "Company name" })).toBeDisabled();
    });

    it("passes the other props to the root and adds the consumer's class to it", () => {
        const { container } = render(
            <FormField label="Company name" name="company" className="consumer">
                <Input />
            </FormField>,
        );

        expect(container.firstElementChild).toHaveClass("dextinityFormField", "consumer");
        expect(screen.getByRole("textbox", { name: "Company name" })).toHaveAttribute("name", "company");
    });

    it("labels a native element rendered through Field.Control", () => {
        render(
            <FormField label="Country">
                <Field.Control render={<select />} defaultValue="at">
                    <option value="at">Austria</option>
                    <option value="de">Germany</option>
                </Field.Control>
            </FormField>,
        );

        expect(screen.getByRole("combobox", { name: "Country" })).toHaveValue("at");
    });

    it("merges slot props, resolving a function with the owner state", () => {
        const { container } = render(
            <FormField
                label="Company name"
                description="As shown on your invoices."
                error="Enter a company name."
                required
                slotProps={{
                    label: { className: "consumerLabel" },
                    requiredIndicator: (ownerState) => ({ className: "consumerIndicator", title: ownerState.required ? "required" : "optional" }),
                    description: { className: "consumerDescription" },
                    error: { className: "consumerError" },
                }}
            >
                <Input required />
            </FormField>,
        );

        const indicator = container.querySelector(".dextinityFormField__requiredIndicator");
        expect(container.querySelector(".dextinityFormField__label")).toHaveClass("consumerLabel");
        expect(indicator).toHaveClass("consumerIndicator");
        expect(indicator).toHaveAttribute("title", "required");
        expect(screen.getByText("As shown on your invoices.")).toHaveClass("dextinityFormField__description", "consumerDescription");
        expect(screen.getByText("Enter a company name.")).toHaveClass("dextinityFormField__error", "consumerError");
    });
    it("reflects the orientation on the root and wraps the control and messages in the content part", () => {
        const { container } = render(
            <FormField label="Company name" orientation="horizontal" description="As shown on your invoices.">
                <Input />
            </FormField>,
        );

        const content = container.querySelector(".dextinityFormField__content");
        expect(container.firstElementChild).toHaveAttribute("data-orientation", "horizontal");
        expect(content).toContainElement(screen.getByRole("textbox", { name: "Company name" }));
        expect(content).toContainElement(screen.getByText("As shown on your invoices."));
    });

    it("leaves out the label part without a label, unless the field is horizontal", () => {
        const { container, rerender } = render(
            <FormField>
                <Input aria-label="Company name" />
            </FormField>,
        );

        expect(container.firstElementChild).toHaveAttribute("data-orientation", "vertical");
        expect(container.querySelector(".dextinityFormField__label")).not.toBeInTheDocument();

        rerender(
            <FormField orientation="horizontal">
                <Input aria-label="Company name" />
            </FormField>,
        );

        expect(container.querySelector(".dextinityFormField__label")).toBeInTheDocument();
    });

    it("shows a warning without marking the field invalid, and replaces it with an error", async () => {
        const { container, rerender } = render(
            <FormField label="Slug" warning="Another page uses this slug.">
                <Input />
            </FormField>,
        );

        const control = screen.getByRole("textbox", { name: "Slug" });
        expect(screen.getByText("Another page uses this slug.")).toHaveClass("dextinityFormField__warning");
        expect(container.firstElementChild).not.toHaveAttribute("data-invalid");
        await waitFor(() => expect(control).toHaveAccessibleDescription("Another page uses this slug."));

        rerender(
            <FormField label="Slug" warning="Another page uses this slug." error="Enter a slug.">
                <Input />
            </FormField>,
        );

        expect(screen.queryByText("Another page uses this slug.")).not.toBeInTheDocument();
        expect(screen.getByText("Enter a slug.")).toHaveClass("dextinityFormField__error");
    });
});
