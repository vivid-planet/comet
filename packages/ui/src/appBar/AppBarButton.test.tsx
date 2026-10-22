import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { AppBarButton } from "./AppBarButton";

describe("AppBarButton", () => {
    it("renders the styling contract with the default owner state", () => {
        render(<AppBarButton>Preview</AppBarButton>);

        const button = screen.getByRole("button", { name: "Preview" });
        expect(button).toHaveClass("dextinityAppBarButton");
        expect(button).not.toHaveAttribute("data-disabled");
        expect(button).toHaveAttribute("type", "button");
    });

    it("reflects the disabled owner state", () => {
        render(<AppBarButton disabled>Preview</AppBarButton>);

        const button = screen.getByRole("button", { name: "Preview" });
        expect(button).toHaveAttribute("data-disabled");
        expect(button).toBeDisabled();
    });

    it("adds the consumer's class and style to the button", () => {
        render(
            <AppBarButton className="consumer" style={{ maxWidth: "12rem" }}>
                Preview
            </AppBarButton>,
        );

        const button = screen.getByRole("button", { name: "Preview" });
        expect(button).toHaveClass("dextinityAppBarButton", "consumer");
        expect(button).toHaveStyle({ maxWidth: "12rem" });
    });

    it("renders the icon slots with their contract classes, hidden from assistive technology", () => {
        render(
            <AppBarButton startIcon={<svg data-testid="start" />} endIcon={<svg data-testid="end" />}>
                Jane Doe
            </AppBarButton>,
        );

        const startIcon = screen.getByTestId("start").parentElement;
        const endIcon = screen.getByTestId("end").parentElement;
        expect(startIcon).toHaveClass("dextinityAppBarButton__startIcon");
        expect(startIcon).toHaveAttribute("aria-hidden", "true");
        expect(endIcon).toHaveClass("dextinityAppBarButton__endIcon");
        expect(endIcon).toHaveAttribute("aria-hidden", "true");
        expect(screen.getByRole("button")).toHaveAccessibleName("Jane Doe");
    });

    it("renders no icon slot for content that renders nothing", () => {
        const { container } = render(
            <AppBarButton startIcon={false} endIcon="">
                Preview
            </AppBarButton>,
        );

        expect(container.querySelector(".dextinityAppBarButton__startIcon")).not.toBeInTheDocument();
        expect(container.querySelector(".dextinityAppBarButton__endIcon")).not.toBeInTheDocument();
    });

    it("merges slot props, resolving a function with the owner state", () => {
        render(
            <AppBarButton
                disabled
                endIcon={<svg data-testid="end" />}
                slotProps={{ endIcon: (ownerState) => ({ className: "consumer", title: ownerState.disabled ? "disabled" : "enabled" }) }}
            >
                Preview
            </AppBarButton>,
        );

        const endIcon = screen.getByTestId("end").parentElement;
        expect(endIcon).toHaveClass("dextinityAppBarButton__endIcon", "consumer");
        expect(endIcon).toHaveAttribute("title", "disabled");
    });
});
