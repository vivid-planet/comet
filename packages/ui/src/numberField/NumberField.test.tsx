import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { createRef } from "react";
import { describe, expect, it } from "vitest";

import { NumberField } from "./NumberField";

describe("NumberField", () => {
    it("renders the styling contracts of FormField and NumberField with the default owner state", () => {
        const { container } = render(<NumberField label="Quantity" />);

        const root = container.firstElementChild;
        const input = screen.getByRole("textbox", { name: "Quantity" });
        expect(root).toHaveClass("dextinityFormField", "dextinityNumberField");
        expect(root).not.toHaveAttribute("data-required");
        expect(root).not.toHaveAttribute("data-disabled");
        expect(root).not.toHaveAttribute("data-readonly");
        expect(input).toHaveClass("dextinityNumberField__input");
        expect(input.closest(".dextinityNumberField__group")).toHaveAttribute("role", "group");
        expect(container.querySelector(".dextinityNumberField__decrement")).toBeInTheDocument();
        expect(container.querySelector(".dextinityNumberField__increment")).toBeInTheDocument();
        expect(screen.getByText("Quantity")).toHaveClass("dextinityFormField__label");
    });

    it("hides the step buttons from assistive technology and keeps Base UI's English texts out", () => {
        const { container } = render(<NumberField label="Quantity" />);

        const decrement = container.querySelector(".dextinityNumberField__decrement");
        const increment = container.querySelector(".dextinityNumberField__increment");
        expect(decrement).toHaveAttribute("aria-hidden", "true");
        expect(decrement).toHaveAttribute("tabindex", "-1");
        expect(decrement).not.toHaveAttribute("aria-label");
        expect(increment).toHaveAttribute("aria-hidden", "true");
        expect(increment).not.toHaveAttribute("aria-label");
        expect(screen.getByRole("textbox", { name: "Quantity" })).not.toHaveAttribute("aria-roledescription");
    });

    it("names the step buttons with their labels and exposes them to assistive technology", () => {
        render(<NumberField label="Guests" decrementLabel="Decrease guests" incrementLabel="Increase guests" />);

        expect(screen.getByRole("button", { name: "Decrease guests" })).not.toHaveAttribute("aria-hidden");
        expect(screen.getByRole("button", { name: "Increase guests" })).not.toHaveAttribute("aria-hidden");
    });

    it("describes the input with the description and the error, and marks it invalid", async () => {
        render(<NumberField label="Guests" description="Between 1 and 12 guests." error="Enter at most 12 guests." />);

        const input = screen.getByRole("textbox", { name: "Guests" });
        expect(input).toHaveAttribute("aria-invalid", "true");
        expect(input.closest(".dextinityNumberField__group")).toHaveAttribute("data-invalid");
        await waitFor(() => expect(input).toHaveAccessibleDescription("Between 1 and 12 guests. Enter at most 12 guests."));
    });

    it("reflects required, disabled and readOnly on the root and the input", () => {
        const { container } = render(<NumberField label="Quantity" required disabled readOnly />);

        const root = container.firstElementChild;
        const input = screen.getByRole("textbox", { name: "Quantity" });
        expect(root).toHaveAttribute("data-required");
        expect(root).toHaveAttribute("data-disabled");
        expect(root).toHaveAttribute("data-readonly");
        expect(input).toBeRequired();
        expect(input).toBeDisabled();
        expect(input).toHaveAttribute("readonly");
        expect(container.querySelector(".dextinityFormField__requiredIndicator")).toHaveAttribute("aria-hidden", "true");
    });

    it("formats the value and submits the plain number under its name", () => {
        const { container } = render(
            <NumberField label="Price" name="price" defaultValue={1234.5} locale="en-US" format={{ minimumFractionDigits: 2 }} />,
        );

        expect(screen.getByRole("textbox", { name: "Price" })).toHaveValue("1,234.50");
        expect(container.querySelector('input[name="price"]')).toHaveValue(1234.5);
    });

    it("passes the other props and the ref to the input and adds the consumer's class and style to the root", async () => {
        const ref = createRef<HTMLInputElement>();
        const { container } = render(
            <>
                <NumberField
                    label="Quantity"
                    description="Between 1 and 12."
                    className="consumer"
                    style={{ maxWidth: "12rem" }}
                    placeholder="0"
                    aria-describedby="hint"
                    autoFocus
                    ref={ref}
                />
                <p id="hint">Ask the venue for larger groups.</p>
            </>,
        );

        const root = container.firstElementChild;
        const input = screen.getByRole("textbox", { name: "Quantity" });
        expect(root).toHaveClass("dextinityFormField", "dextinityNumberField", "consumer");
        expect(root).toHaveStyle({ maxWidth: "12rem" });
        expect(input).not.toHaveClass("consumer");
        expect(input).toHaveAttribute("placeholder", "0");
        expect(input).toHaveFocus();
        expect(ref.current).toBe(input);
        await waitFor(() => expect(input).toHaveAccessibleDescription("Ask the venue for larger groups. Between 1 and 12."));
    });

    it("passes the number settings to Base UI's root, and the id to the input", () => {
        render(<NumberField label="Quantity" id="quantity" defaultValue={2} largeStep={5} />);

        const input = screen.getByRole("textbox", { name: "Quantity" });
        expect(input).toHaveAttribute("id", "quantity");
        fireEvent.keyDown(input, { key: "ArrowUp", shiftKey: true });
        expect(input).toHaveValue("7");
    });

    it("merges slot props into the parts, resolving a function with the owner state", () => {
        const { container } = render(
            <NumberField
                label="Quantity"
                readOnly
                slotProps={{
                    group: { className: "consumerGroup" },
                    input: (ownerState) => ({ className: "consumerInput", title: ownerState.readonly ? "readonly" : "editable" }),
                    increment: { className: "consumerIncrement", children: <span data-testid="customIcon" /> },
                    label: (ownerState) => ({ className: "consumerLabel", title: ownerState.readonly ? "readonly" : "editable" }),
                }}
            />,
        );

        const input = screen.getByRole("textbox", { name: "Quantity" });
        const label = container.querySelector(".dextinityFormField__label");
        expect(input).toHaveClass("dextinityNumberField__input", "consumerInput");
        expect(input).toHaveAttribute("title", "readonly");
        expect(container.querySelector(".dextinityNumberField__group")).toHaveClass("consumerGroup");
        expect(container.querySelector(".dextinityNumberField__increment")).toHaveClass("consumerIncrement");
        expect(screen.getByTestId("customIcon")).toBeInTheDocument();
        expect(label).toHaveClass("consumerLabel");
        expect(label).toHaveAttribute("title", "readonly");
    });

    it("keeps a role description the consumer passes to the input", () => {
        const { rerender } = render(<NumberField label="Quantity" aria-roledescription="Zahlenfeld" />);
        expect(screen.getByRole("textbox", { name: "Quantity" })).toHaveAttribute("aria-roledescription", "Zahlenfeld");

        rerender(<NumberField label="Quantity" slotProps={{ input: { "aria-roledescription": "Zahlenfeld" } }} />);
        expect(screen.getByRole("textbox", { name: "Quantity" })).toHaveAttribute("aria-roledescription", "Zahlenfeld");
    });
});
