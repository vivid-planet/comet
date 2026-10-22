import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Tab } from "./Tab";
import { TabList } from "./TabList";
import { TabPanel } from "./TabPanel";
import { Tabs, type TabsProps } from "./Tabs";

function ProductTabs(props: Partial<TabsProps>) {
    return (
        <Tabs defaultValue="overview" {...props}>
            <TabList label="Product">
                <Tab value="overview">Overview</Tab>
                <Tab value="pricing">Pricing</Tab>
            </TabList>
            <TabPanel value="overview">Name and description</TabPanel>
            <TabPanel value="pricing">Prices and discounts</TabPanel>
        </Tabs>
    );
}

describe("Tabs", () => {
    it("renders the styling contract with the default owner state", () => {
        render(<ProductTabs />);

        const root = screen.getByRole("tablist").parentElement;
        expect(root).toHaveClass("dextinityTabs");
        expect(root).toHaveAttribute("data-orientation", "horizontal");
    });

    it("reflects the orientation on the root and its parts", () => {
        render(<ProductTabs orientation="vertical" />);

        const tabList = screen.getByRole("tablist", { name: "Product" });
        expect(tabList.parentElement).toHaveAttribute("data-orientation", "vertical");
        expect(tabList).toHaveAttribute("data-orientation", "vertical");
        expect(tabList).toHaveAttribute("aria-orientation", "vertical");
        expect(screen.getByRole("tab", { name: "Overview" })).toHaveAttribute("data-orientation", "vertical");
        expect(screen.getByRole("tabpanel", { name: "Overview" })).toHaveAttribute("data-orientation", "vertical");
    });

    it("shows the panel of the tab selected through the other props", () => {
        render(<ProductTabs defaultValue="pricing" />);

        expect(screen.getByRole("tab", { name: "Pricing" })).toHaveAttribute("aria-selected", "true");
        expect(screen.getByRole("tabpanel", { name: "Pricing" })).toHaveTextContent("Prices and discounts");
        expect(screen.queryByText("Name and description")).not.toBeInTheDocument();
    });

    it("adds the consumer's class and style to the root", () => {
        render(<ProductTabs className="consumer" style={{ maxWidth: "40rem" }} />);

        const root = screen.getByRole("tablist").parentElement;
        expect(root).toHaveClass("dextinityTabs", "consumer");
        expect(root).toHaveStyle({ maxWidth: "40rem" });
    });
});
