import { render, screen } from "@testing-library/react";
import { renderToString } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { Tab } from "./Tab";
import { TabList, type TabListProps } from "./TabList";
import { Tabs, type TabsOrientation } from "./Tabs";

function ProductTabList({ orientation, ...props }: Partial<TabListProps> & { orientation?: TabsOrientation }) {
    return (
        <Tabs defaultValue="overview" orientation={orientation}>
            <TabList label="Product" {...props}>
                <Tab value="overview">Overview</Tab>
                <Tab value="pricing">Pricing</Tab>
            </TabList>
        </Tabs>
    );
}

describe("TabList", () => {
    it("renders the styling contract on the element with the tablist role, named by label", () => {
        render(<ProductTabList />);

        const tabList = screen.getByRole("tablist", { name: "Product" });
        expect(tabList).toHaveClass("dextinityTabList");
        expect(tabList).toHaveAttribute("data-orientation", "horizontal");
        expect(tabList.querySelector(".dextinityTabList__indicator")).toHaveAttribute("data-orientation", "horizontal");
    });

    it("renders the indicator after the tabs, hidden from assistive technology", () => {
        render(<ProductTabList />);

        const tabList = screen.getByRole("tablist", { name: "Product" });
        const indicator = tabList.querySelector(".dextinityTabList__indicator");
        expect(tabList.lastElementChild).toBe(indicator);
        expect(indicator).toHaveAttribute("role", "presentation");
    });

    it("lets a labelling element take precedence over the label", () => {
        render(
            <>
                <h2 id="product-heading">Linen shirt</h2>
                <ProductTabList aria-labelledby="product-heading" />
            </>,
        );

        expect(screen.getByRole("tablist", { name: "Linen shirt" })).toHaveAttribute("aria-label", "Product");
    });

    it("renders the indicator hidden on the server, unless it renders before hydration", () => {
        expect(renderToString(<ProductTabList />)).not.toContain("<script");
        expect(renderToString(<ProductTabList slotProps={{ indicator: { renderBeforeHydration: true } }} />)).toContain("<script");
    });

    it("adds the consumer's class and style to the root", () => {
        render(<ProductTabList className="consumer" style={{ maxWidth: "30rem" }} />);

        const tabList = screen.getByRole("tablist", { name: "Product" });
        expect(tabList).toHaveClass("dextinityTabList", "consumer");
        expect(tabList).toHaveStyle({ maxWidth: "30rem" });
    });

    it("merges slot props, resolving a function with the owner state", () => {
        render(
            <ProductTabList
                orientation="vertical"
                slotProps={{ indicator: (ownerState) => ({ className: "consumerIndicator", title: ownerState.orientation }) }}
            />,
        );

        const indicator = screen.getByRole("tablist", { name: "Product" }).querySelector(".dextinityTabList__indicator");
        expect(indicator).toHaveClass("consumerIndicator");
        expect(indicator).toHaveAttribute("title", "vertical");
    });
});
