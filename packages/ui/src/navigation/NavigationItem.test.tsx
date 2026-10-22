import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Navigation } from "./Navigation";
import { NavigationGroup } from "./NavigationGroup";
import { NavigationItem, type NavigationItemProps } from "./NavigationItem";

function renderItem(props: Partial<NavigationItemProps> = {}) {
    return render(
        <Navigation label="Main">
            <NavigationItem href="/products" {...props}>
                Products
            </NavigationItem>
        </Navigation>,
    );
}

describe("NavigationItem", () => {
    it("renders the styling contract with the default owner state", () => {
        renderItem();

        const link = screen.getByRole("link", { name: "Products" });
        const root = screen.getByRole("listitem");
        expect(root).toHaveClass("dextinityNavigationItem");
        expect(root).toHaveAttribute("data-level", "1");
        expect(root).not.toHaveAttribute("data-active");
        expect(link).toHaveClass("dextinityNavigationItem__link");
        expect(link).toHaveAttribute("href", "/products");
        expect(link).not.toHaveAttribute("aria-current");
    });

    it("marks the active item as the current page", () => {
        renderItem({ active: true });

        expect(screen.getByRole("listitem")).toHaveAttribute("data-active");
        expect(screen.getByRole("link", { name: "Products" })).toHaveAttribute("aria-current", "page");
    });

    it("renders the icon slot with its contract class, hidden from assistive technology", () => {
        renderItem({ icon: <svg data-testid="icon" /> });

        const icon = screen.getByTestId("icon").parentElement;
        expect(icon).toHaveClass("dextinityNavigationItem__icon");
        expect(icon).toHaveAttribute("aria-hidden", "true");
        expect(screen.getByRole("link")).toHaveAccessibleName("Products");
    });

    it("renders no icon slot for content that renders nothing", () => {
        const { container } = renderItem({ icon: false });

        expect(container.querySelector(".dextinityNavigationItem__icon")).not.toBeInTheDocument();
    });

    it("adds the consumer's class and style to the root, and passes the other props to the link", () => {
        renderItem({ className: "consumer", style: { marginBlockEnd: "1rem" }, target: "_blank" });

        const root = screen.getByRole("listitem");
        const link = screen.getByRole("link", { name: "Products" });
        expect(root).toHaveClass("dextinityNavigationItem", "consumer");
        expect(root).toHaveStyle({ marginBlockEnd: "1rem" });
        expect(link).not.toHaveClass("consumer");
        expect(link).toHaveAttribute("target", "_blank");
    });

    it("replaces the link through `render`, keeping its contract", () => {
        renderItem({ href: undefined, render: <a href="/router/products" data-router="" />, active: true });

        const link = screen.getByRole("link", { name: "Products" });
        expect(link).toHaveAttribute("href", "/router/products");
        expect(link).toHaveAttribute("data-router");
        expect(link).toHaveClass("dextinityNavigationItem__link");
        expect(link).toHaveAttribute("aria-current", "page");
    });

    it("takes its level from the enclosing groups", () => {
        render(
            <Navigation label="Main">
                <NavigationGroup label="Catalog" defaultOpen>
                    <NavigationItem href="/products">Products</NavigationItem>
                    <NavigationGroup label="Attributes" defaultOpen>
                        <NavigationItem href="/colors">Colors</NavigationItem>
                    </NavigationGroup>
                </NavigationGroup>
            </Navigation>,
        );

        expect(screen.getByRole("link", { name: "Products" }).closest(".dextinityNavigationItem")).toHaveAttribute("data-level", "2");
        expect(screen.getByRole("link", { name: "Colors" }).closest(".dextinityNavigationItem")).toHaveAttribute("data-level", "3");
    });

    it("merges slot props, resolving a function with the owner state", () => {
        renderItem({
            active: true,
            icon: <svg data-testid="icon" />,
            slotProps: {
                link: (ownerState) => ({ className: "consumerLink", title: `${ownerState.active} ${ownerState.level}` }),
                icon: { className: "consumerIcon" },
            },
        });

        const link = screen.getByRole("link", { name: "Products" });
        expect(link).toHaveClass("dextinityNavigationItem__link", "consumerLink");
        expect(link).toHaveAttribute("title", "true 1");
        expect(screen.getByTestId("icon").parentElement).toHaveClass("dextinityNavigationItem__icon", "consumerIcon");
    });
});
