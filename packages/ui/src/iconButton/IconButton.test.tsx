import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { IconButton } from "./IconButton";

describe("IconButton", () => {
    it("renders the styling contracts of Button and IconButton with the default owner state", () => {
        render(
            <IconButton label="Edit product">
                <svg />
            </IconButton>,
        );

        const button = screen.getByRole("button", { name: "Edit product" });
        expect(button).toHaveClass("dextinityButton", "dextinityIconButton");
        expect(button).toHaveAttribute("data-variant", "ghost");
        expect(button).toHaveAttribute("data-size", "medium");
        expect(button).not.toHaveAttribute("data-disabled");
    });

    it("names the button with the label", () => {
        render(
            <IconButton label="Delete product">
                <svg />
            </IconButton>,
        );

        expect(screen.getByRole("button")).toHaveAttribute("aria-label", "Delete product");
    });

    it("reflects the owner state in data attributes", () => {
        render(
            <IconButton label="Edit product" variant="secondary" size="small" disabled>
                <svg />
            </IconButton>,
        );

        const button = screen.getByRole("button", { name: "Edit product" });
        expect(button).toHaveAttribute("data-variant", "secondary");
        expect(button).toHaveAttribute("data-size", "small");
        expect(button).toHaveAttribute("data-disabled");
    });

    it("adds the consumer's class to the contract classes", () => {
        render(
            <IconButton label="Edit product" className="consumer">
                <svg />
            </IconButton>,
        );

        expect(screen.getByRole("button", { name: "Edit product" })).toHaveClass("dextinityButton", "dextinityIconButton", "consumer");
    });

    it("renders the icon slot with its contract class, hidden from assistive technology", () => {
        render(
            <IconButton label="Edit product">
                <svg data-testid="icon" />
            </IconButton>,
        );

        const icon = screen.getByTestId("icon").parentElement;
        expect(icon).toHaveClass("dextinityIconButton__icon");
        expect(icon).toHaveAttribute("aria-hidden", "true");
    });

    it("merges slot props, resolving a function with the owner state", () => {
        render(
            <IconButton label="Edit product" size="large" slotProps={{ icon: (ownerState) => ({ className: "consumer", title: ownerState.size }) }}>
                <svg data-testid="icon" />
            </IconButton>,
        );

        const icon = screen.getByTestId("icon").parentElement;
        expect(icon).toHaveClass("dextinityIconButton__icon", "consumer");
        expect(icon).toHaveAttribute("title", "large");
    });
});
