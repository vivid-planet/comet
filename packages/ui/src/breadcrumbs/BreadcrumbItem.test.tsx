import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { BreadcrumbItem, type BreadcrumbItemProps } from "./BreadcrumbItem";
import { Breadcrumbs } from "./Breadcrumbs";

function renderItem(props: Partial<BreadcrumbItemProps> = {}) {
    return render(
        <Breadcrumbs label="Breadcrumb">
            <BreadcrumbItem href="/products" {...props}>
                Products
            </BreadcrumbItem>
        </Breadcrumbs>,
    );
}

describe("BreadcrumbItem", () => {
    it("renders the styling contract of a link with the default owner state", () => {
        renderItem();

        const root = screen.getByRole("listitem");
        const link = screen.getByRole("link", { name: "Products" });
        expect(root).toHaveClass("dextinityBreadcrumbItem");
        expect(root).not.toHaveAttribute("data-current");
        expect(link).toHaveClass("dextinityBreadcrumbItem__link");
        expect(link).toHaveAttribute("href", "/products");
        expect(link).not.toHaveAttribute("aria-current");
    });

    it("renders the separator as the chevron-right icon, hidden from assistive technology", () => {
        renderItem();

        const separator = screen.getByRole("listitem").querySelector(".dextinityBreadcrumbItem__separator");
        expect(separator).toHaveAttribute("aria-hidden", "true");
        expect(separator?.querySelector(".dextinityIcon")).toHaveAttribute("data-icon", "chevron-right");
        expect(screen.getByRole("listitem").textContent).toBe("Products");
    });

    it("renders the current page as plain text, ignoring `href` and `render`", () => {
        renderItem({ current: true, render: <a href="/router/products" /> });

        const root = screen.getByRole("listitem");
        const currentPage = screen.getByText("Products");
        expect(root).toHaveAttribute("data-current");
        expect(screen.queryByRole("link")).not.toBeInTheDocument();
        expect(currentPage).toHaveClass("dextinityBreadcrumbItem__link");
        expect(currentPage).toHaveAttribute("aria-current", "page");
        expect(currentPage).not.toHaveAttribute("href");
    });

    it("renders a level without `href` or `render` as plain text that isn't the current page", () => {
        renderItem({ href: undefined });

        const level = screen.getByText("Products");
        expect(screen.queryByRole("link")).not.toBeInTheDocument();
        expect(level).toHaveClass("dextinityBreadcrumbItem__link");
        expect(level).not.toHaveAttribute("aria-current");
        expect(screen.getByRole("listitem")).not.toHaveAttribute("data-current");
    });

    it("replaces the link through `render`, keeping its contract", () => {
        renderItem({ href: undefined, render: <a href="/router/products" data-router="" /> });

        const link = screen.getByRole("link", { name: "Products" });
        expect(link).toHaveAttribute("href", "/router/products");
        expect(link).toHaveAttribute("data-router");
        expect(link).toHaveClass("dextinityBreadcrumbItem__link");
    });

    it("adds the consumer's class and style to the root, and passes the other props to the link", () => {
        renderItem({ className: "consumer", style: { maxWidth: "10rem" }, target: "_blank" });

        const root = screen.getByRole("listitem");
        const link = screen.getByRole("link", { name: "Products" });
        expect(root).toHaveClass("dextinityBreadcrumbItem", "consumer");
        expect(root).toHaveStyle({ maxWidth: "10rem" });
        expect(link).not.toHaveClass("consumer");
        expect(link).toHaveAttribute("target", "_blank");
    });

    it("merges slot props, resolving a function with the owner state", () => {
        renderItem({
            current: true,
            slotProps: {
                separator: { className: "consumerSeparator" },
                link: (ownerState) => ({ className: "consumerLink", title: String(ownerState.current) }),
            },
        });

        const currentPage = screen.getByText("Products");
        expect(screen.getByRole("listitem").querySelector(".dextinityBreadcrumbItem__separator")).toHaveClass("consumerSeparator");
        expect(currentPage).toHaveClass("dextinityBreadcrumbItem__link", "consumerLink");
        expect(currentPage).toHaveAttribute("title", "true");
    });
});
