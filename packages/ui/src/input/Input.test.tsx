import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { FormField } from "../formField/FormField";
import { Input } from "./Input";

describe("Input", () => {
    it("renders the styling contract with the default owner state", () => {
        const { container } = render(<Input aria-label="Search" />);

        const root = container.firstElementChild;
        const input = screen.getByRole("textbox", { name: "Search" });
        expect(root).toHaveClass("dextinityInput");
        expect(root).not.toHaveAttribute("data-disabled");
        expect(root).not.toHaveAttribute("data-multiline");
        expect(input).toHaveClass("dextinityInput__input");
        expect(input.tagName).toBe("INPUT");
        expect(container.querySelector(".dextinityInput__startAdornment")).not.toBeInTheDocument();
        expect(container.querySelector(".dextinityInput__endAdornment")).not.toBeInTheDocument();
    });

    it("renders the adornments around the input", () => {
        render(<Input aria-label="Price" startAdornment="€" endAdornment="per month" />);

        expect(screen.getByText("€")).toHaveClass("dextinityInput__startAdornment");
        expect(screen.getByText("per month")).toHaveClass("dextinityInput__endAdornment");
    });

    it("renders a textarea with the given rows while multiline", () => {
        const { container } = render(<Input aria-label="Notes" multiline rows={5} />);

        const textarea = screen.getByRole("textbox", { name: "Notes" });
        expect(container.firstElementChild).toHaveAttribute("data-multiline");
        expect(textarea.tagName).toBe("TEXTAREA");
        expect(textarea).toHaveAttribute("rows", "5");
    });

    it("disables the input and reflects it on the root", () => {
        const { container } = render(<Input aria-label="Search" disabled />);

        expect(container.firstElementChild).toHaveAttribute("data-disabled");
        expect(screen.getByRole("textbox", { name: "Search" })).toBeDisabled();
    });

    it("is named and marked invalid by an enclosing form field", () => {
        render(
            <FormField label="Price" error="Enter a price.">
                <Input />
            </FormField>,
        );

        expect(screen.getByRole("textbox", { name: "Price" })).toHaveAttribute("aria-invalid", "true");
    });

    it("passes the other props to the input, adds the consumer's class to the root and merges slot props", () => {
        const { container } = render(
            <Input
                aria-label="Search"
                className="consumer"
                name="query"
                placeholder="Products"
                startAdornment="🔍"
                slotProps={{
                    input: { className: "consumerInput" },
                    startAdornment: (ownerState) => ({ title: ownerState.multiline ? "multi" : "single" }),
                }}
            />,
        );

        const input = screen.getByRole("textbox", { name: "Search" });
        expect(container.firstElementChild).toHaveClass("dextinityInput", "consumer");
        expect(input).toHaveClass("dextinityInput__input", "consumerInput");
        expect(input).toHaveAttribute("name", "query");
        expect(input).toHaveAttribute("placeholder", "Products");
        expect(screen.getByText("🔍")).toHaveAttribute("title", "single");
    });
});
