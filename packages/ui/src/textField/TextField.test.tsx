import { render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { TextField } from "./TextField";

describe("TextField", () => {
    it("renders the styling contracts of FormField and TextField with the default owner state", () => {
        const { container } = render(<TextField label="Full name" />);

        const root = container.firstElementChild;
        const input = screen.getByLabelText("Full name");
        expect(root).toHaveClass("dextinityFormField", "dextinityTextField");
        expect(root).not.toHaveAttribute("data-required");
        expect(root).not.toHaveAttribute("data-disabled");
        expect(input).toHaveClass("dextinityTextField__input");
        expect(input).toHaveAttribute("type", "text");
        expect(screen.getByText("Full name")).toHaveClass("dextinityFormField__label");
    });

    it("describes the input with the description and the error, and marks it invalid", async () => {
        render(<TextField label="Email address" description="We send the invoice to it." error="Enter an email address like name@example.com." />);

        const input = screen.getByRole("textbox", { name: "Email address" });
        expect(input).toHaveAttribute("aria-invalid", "true");
        await waitFor(() => expect(input).toHaveAccessibleDescription("We send the invoice to it. Enter an email address like name@example.com."));
    });

    it("requires the input and shows a required indicator hidden from assistive technology", () => {
        const { container } = render(<TextField label="Email address" required />);

        const indicator = container.querySelector(".dextinityFormField__requiredIndicator");
        expect(container.firstElementChild).toHaveAttribute("data-required");
        expect(indicator).toHaveAttribute("aria-hidden", "true");
        expect(screen.getByRole("textbox", { name: "Email address" })).toBeRequired();
    });

    it("disables the input and dims the label", () => {
        const { container } = render(<TextField label="Email address" disabled />);

        expect(container.firstElementChild).toHaveAttribute("data-disabled");
        expect(screen.getByText("Email address")).toHaveAttribute("data-disabled");
        expect(screen.getByRole("textbox", { name: "Email address" })).toBeDisabled();
    });

    it("passes the other props to the input and adds the consumer's class to the root", () => {
        const { container } = render(
            <TextField label="Email address" className="consumer" name="email" type="email" autoComplete="email" placeholder="name@example.com" />,
        );

        const input = screen.getByRole("textbox", { name: "Email address" });
        expect(container.firstElementChild).toHaveClass("dextinityFormField", "dextinityTextField", "consumer");
        expect(input).not.toHaveClass("consumer");
        expect(input).toHaveAttribute("name", "email");
        expect(input).toHaveAttribute("type", "email");
        expect(input).toHaveAttribute("autocomplete", "email");
        expect(input).toHaveAttribute("placeholder", "name@example.com");
    });

    it("merges slot props into the input and the field's parts, resolving a function with the owner state", () => {
        render(
            <TextField
                label="Promo code"
                required
                slotProps={{
                    input: (ownerState) => ({ className: "consumerInput", title: ownerState.required ? "required" : "optional" }),
                    label: { className: "consumerLabel" },
                }}
            />,
        );

        const input = screen.getByRole("textbox", { name: "Promo code" });
        expect(input).toHaveClass("dextinityTextField__input", "consumerInput");
        expect(input).toHaveAttribute("title", "required");
        expect(input.ownerDocument.querySelector(".dextinityFormField__label")).toHaveClass("consumerLabel");
    });
});
