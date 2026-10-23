import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Navigation } from "./Navigation";
import { NavigationItem } from "./NavigationItem";

describe("Navigation", () => {
    it("renders the styling contract around a list, named by its label", () => {
        render(
            <Navigation label="Main">
                <NavigationItem href="/dashboard">Dashboard</NavigationItem>
            </Navigation>,
        );

        const navigation = screen.getByRole("navigation", { name: "Main" });
        expect(navigation).toHaveClass("dextinityNavigation");
        expect(screen.getByRole("list")).toHaveClass("dextinityNavigation__list");
        expect(screen.getByRole("listitem")).toHaveClass("dextinityNavigationItem");
    });

    it("adds the consumer's class and style to the root, and passes the other props to the <nav>", () => {
        render(<Navigation label="Main" className="consumer" style={{ maxWidth: "20rem" }} id="main-navigation" />);

        const navigation = screen.getByRole("navigation", { name: "Main" });
        expect(navigation).toHaveClass("dextinityNavigation", "consumer");
        expect(navigation).toHaveStyle({ maxWidth: "20rem" });
        expect(navigation).toHaveAttribute("id", "main-navigation");
        expect(screen.getByRole("list")).not.toHaveClass("consumer");
    });

    it("merges slot props, resolving a function with the owner state", () => {
        render(
            <Navigation
                label="Main"
                slotProps={{ list: (ownerState) => ({ className: "consumerList", title: String(Object.keys(ownerState).length) }) }}
            />,
        );

        const list = screen.getByRole("list");
        expect(list).toHaveClass("dextinityNavigation__list", "consumerList");
        expect(list).toHaveAttribute("title", "0");
    });
});
