import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Tab } from "./Tab";
import { TabList } from "./TabList";
import { TabPanel, type TabPanelProps } from "./TabPanel";
import { Tabs } from "./Tabs";

function ProductTabs(pricingPanelProps: Partial<TabPanelProps>) {
    return (
        <Tabs defaultValue="overview">
            <TabList label="Product">
                <Tab value="overview">Overview</Tab>
                <Tab value="pricing">Pricing</Tab>
            </TabList>
            <TabPanel value="overview" className="consumer" style={{ maxWidth: "40rem" }}>
                Name and description
            </TabPanel>
            <TabPanel value="pricing" {...pricingPanelProps}>
                Prices and discounts
            </TabPanel>
        </Tabs>
    );
}

describe("TabPanel", () => {
    it("renders the styling contract on the element with the tabpanel role, named by its tab", () => {
        render(<ProductTabs />);

        const panel = screen.getByRole("tabpanel", { name: "Overview" });
        expect(panel).toHaveClass("dextinityTabPanel");
        expect(panel).toHaveAttribute("data-orientation", "horizontal");
        expect(panel).toHaveTextContent("Name and description");
    });

    it("adds the consumer's class and style to the panel", () => {
        render(<ProductTabs />);

        const panel = screen.getByRole("tabpanel", { name: "Overview" });
        expect(panel).toHaveClass("dextinityTabPanel", "consumer");
        expect(panel).toHaveStyle({ maxWidth: "40rem" });
    });

    it("doesn't render a hidden panel", () => {
        render(<ProductTabs />);

        expect(screen.queryByText("Prices and discounts")).not.toBeInTheDocument();
    });

    it("keeps a hidden panel with keepMounted, marked as hidden", () => {
        render(<ProductTabs keepMounted />);

        const panel = screen.getByText("Prices and discounts");
        expect(panel).toHaveClass("dextinityTabPanel");
        expect(panel).toHaveAttribute("hidden");
        expect(panel).toHaveAttribute("data-hidden");
    });
});
