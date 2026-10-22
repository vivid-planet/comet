import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { AppBarIconButton } from "./AppBarIconButton";

describe("AppBarIconButton", () => {
    it("renders both root classes, named by its label", () => {
        render(
            <AppBarIconButton label="Notifications">
                <svg data-testid="icon" />
            </AppBarIconButton>,
        );

        const button = screen.getByRole("button", { name: "Notifications" });
        const icon = screen.getByTestId("icon").parentElement;
        expect(button).toHaveClass("dextinityAppBarButton", "dextinityAppBarIconButton");
        expect(button).toHaveAttribute("type", "button");
        expect(icon).toHaveClass("dextinityAppBarIconButton__icon");
        expect(icon).toHaveAttribute("aria-hidden", "true");
    });

    it("adds the consumer's class and reflects the disabled owner state", () => {
        render(
            <AppBarIconButton label="Notifications" disabled className="consumer">
                <svg />
            </AppBarIconButton>,
        );

        const button = screen.getByRole("button", { name: "Notifications" });
        expect(button).toHaveClass("dextinityAppBarButton", "dextinityAppBarIconButton", "consumer");
        expect(button).toHaveAttribute("data-disabled");
    });

    it("merges slot props, resolving a function with the owner state", () => {
        render(
            <AppBarIconButton
                label="Notifications"
                slotProps={{ icon: (ownerState) => ({ className: "consumerIcon", title: ownerState.disabled ? "disabled" : "enabled" }) }}
            >
                <svg data-testid="icon" />
            </AppBarIconButton>,
        );

        const icon = screen.getByTestId("icon").parentElement;
        expect(icon).toHaveClass("dextinityAppBarIconButton__icon", "consumerIcon");
        expect(icon).toHaveAttribute("title", "enabled");
    });
});
