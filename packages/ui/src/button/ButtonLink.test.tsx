import { render, screen } from "@testing-library/react";
import type { ComponentPropsWithRef } from "react";
import { describe, expect, it } from "vitest";

import { ButtonLink } from "./ButtonLink";

function RouterLink({ to, ...props }: ComponentPropsWithRef<"a"> & { to: string }) {
    return <a {...props} href={`/app${to}`} data-router-link="" />;
}

describe("ButtonLink", () => {
    it("renders a link with the button's styling contract", () => {
        render(<ButtonLink href="/products/new">Add product</ButtonLink>);

        const link = screen.getByRole("link", { name: "Add product" });
        expect(link).toHaveAttribute("href", "/products/new");
        expect(link).toHaveClass("dextinityButton", "dextinityButtonLink");
        expect(link).toHaveAttribute("data-variant", "primary");
        expect(link).toHaveAttribute("data-size", "medium");
        expect(link).toHaveAttribute("data-tone", "default");
    });

    it("reflects the owner state and adds the consumer's class", () => {
        render(
            <ButtonLink href="/products" variant="secondary" size="small" tone="danger" className="consumer">
                Products
            </ButtonLink>,
        );

        const link = screen.getByRole("link", { name: "Products" });
        expect(link).toHaveClass("dextinityButton", "dextinityButtonLink", "consumer");
        expect(link).toHaveAttribute("data-variant", "secondary");
        expect(link).toHaveAttribute("data-size", "small");
        expect(link).toHaveAttribute("data-tone", "danger");
    });

    it("renders a router's link component through render", () => {
        render(<ButtonLink render={<RouterLink to="/products/new" />}>Add product</ButtonLink>);

        const link = screen.getByRole("link", { name: "Add product" });
        expect(link).toHaveAttribute("href", "/app/products/new");
        expect(link).toHaveAttribute("data-router-link");
        expect(link).toHaveClass("dextinityButton", "dextinityButtonLink");
    });

    it("renders the icon slots with the button's part classes, hidden from assistive technology", () => {
        render(
            <ButtonLink
                href="/next"
                startIcon={<svg data-testid="start" />}
                endIcon={<svg data-testid="end" />}
                slotProps={{ endIcon: (ownerState) => ({ className: "consumer", title: ownerState.variant }) }}
            >
                Next
            </ButtonLink>,
        );

        const startIcon = screen.getByTestId("start").parentElement;
        const endIcon = screen.getByTestId("end").parentElement;
        expect(startIcon).toHaveClass("dextinityButton__startIcon");
        expect(startIcon).toHaveAttribute("aria-hidden", "true");
        expect(endIcon).toHaveClass("dextinityButton__endIcon", "consumer");
        expect(endIcon).toHaveAttribute("title", "primary");
        expect(screen.getByRole("link")).toHaveAccessibleName("Next");
    });
});
