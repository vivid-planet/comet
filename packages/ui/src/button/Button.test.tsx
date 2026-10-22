import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Button } from "./Button";

describe("Button", () => {
    it("renders the styling contract with the default owner state", () => {
        render(<Button>Save</Button>);

        const button = screen.getByRole("button", { name: "Save" });
        expect(button).toHaveClass("dextinityButton");
        expect(button).toHaveAttribute("data-variant", "primary");
        expect(button).toHaveAttribute("data-size", "medium");
        expect(button).toHaveAttribute("data-tone", "default");
        expect(button).not.toHaveAttribute("data-disabled");
        expect(button).toHaveAttribute("type", "button");
    });

    it("reflects the owner state in data attributes", () => {
        render(
            <Button variant="ghost" size="small" tone="danger" disabled>
                Save
            </Button>,
        );

        const button = screen.getByRole("button", { name: "Save" });
        expect(button).toHaveAttribute("data-variant", "ghost");
        expect(button).toHaveAttribute("data-size", "small");
        expect(button).toHaveAttribute("data-tone", "danger");
        expect(button).toHaveAttribute("data-disabled");
    });

    it("adds the consumer's class to the contract class", () => {
        render(<Button className="consumer">Save</Button>);

        expect(screen.getByRole("button", { name: "Save" })).toHaveClass("dextinityButton", "consumer");
    });

    it("renders the icon slots with their contract classes, hidden from assistive technology", () => {
        render(
            <Button startIcon={<svg data-testid="start" />} endIcon={<svg data-testid="end" />}>
                Next
            </Button>,
        );

        const startIcon = screen.getByTestId("start").parentElement;
        const endIcon = screen.getByTestId("end").parentElement;
        expect(startIcon).toHaveClass("dextinityButton__startIcon");
        expect(startIcon).toHaveAttribute("aria-hidden", "true");
        expect(endIcon).toHaveClass("dextinityButton__endIcon");
        expect(screen.getByRole("button")).toHaveAccessibleName("Next");
    });

    it("renders no icon slot for content that renders nothing", () => {
        const { container } = render(
            <Button startIcon={false} endIcon="">
                Save
            </Button>,
        );

        expect(container.querySelector(".dextinityButton__startIcon")).not.toBeInTheDocument();
        expect(container.querySelector(".dextinityButton__endIcon")).not.toBeInTheDocument();
    });

    it("merges slot props, resolving a function with the owner state", () => {
        render(
            <Button
                variant="secondary"
                startIcon={<svg data-testid="start" />}
                slotProps={{ startIcon: (ownerState) => ({ className: "consumer", title: ownerState.variant }) }}
            >
                Save
            </Button>,
        );

        const startIcon = screen.getByTestId("start").parentElement;
        expect(startIcon).toHaveClass("dextinityButton__startIcon", "consumer");
        expect(startIcon).toHaveAttribute("title", "secondary");
    });
});
