import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { BreadcrumbItem } from "./BreadcrumbItem";
import { Breadcrumbs } from "./Breadcrumbs";

describe("Breadcrumbs", () => {
    it("renders the styling contract around an ordered list, named by its label", () => {
        render(
            <Breadcrumbs label="Breadcrumb">
                <BreadcrumbItem href="/products">Products</BreadcrumbItem>
                <BreadcrumbItem current>Running shoe</BreadcrumbItem>
            </Breadcrumbs>,
        );

        const navigation = screen.getByRole("navigation", { name: "Breadcrumb" });
        const list = screen.getByRole("list");
        expect(navigation).toHaveClass("dextinityBreadcrumbs");
        expect(list.tagName).toBe("OL");
        expect(list).toHaveClass("dextinityBreadcrumbs__list");
        expect(screen.getAllByRole("listitem")).toHaveLength(2);
    });

    it("adds the consumer's class and style to the root, and passes the other props to the <nav>", () => {
        render(<Breadcrumbs label="Breadcrumb" className="consumer" style={{ marginBlockEnd: "1rem" }} id="breadcrumbs" />);

        const navigation = screen.getByRole("navigation", { name: "Breadcrumb" });
        expect(navigation).toHaveClass("dextinityBreadcrumbs", "consumer");
        expect(navigation).toHaveStyle({ marginBlockEnd: "1rem" });
        expect(navigation).toHaveAttribute("id", "breadcrumbs");
        expect(screen.getByRole("list")).not.toHaveClass("consumer");
    });

    it("merges slot props, resolving a function with the owner state", () => {
        render(
            <Breadcrumbs
                label="Breadcrumb"
                slotProps={{ list: (ownerState) => ({ className: "consumerList", title: String(Object.keys(ownerState).length) }) }}
            />,
        );

        const list = screen.getByRole("list");
        expect(list).toHaveClass("dextinityBreadcrumbs__list", "consumerList");
        expect(list).toHaveAttribute("title", "0");
    });
});
