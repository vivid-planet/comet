import { render, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import { describe, expect, it } from "vitest";

import { Tab } from "./Tab";
import { TabList } from "./TabList";
import { Tabs, type TabsOrientation } from "./Tabs";

function InTabs({ orientation, children }: { orientation?: TabsOrientation; children: ReactNode }) {
    return (
        <Tabs defaultValue="overview" orientation={orientation}>
            <TabList label="Product">
                <Tab value="overview">Overview</Tab>
                {children}
            </TabList>
        </Tabs>
    );
}

describe("Tab", () => {
    it("renders the styling contract on a button named by its label", () => {
        render(
            <InTabs>
                <Tab value="pricing">Pricing</Tab>
            </InTabs>,
        );

        const tab = screen.getByRole("tab", { name: "Pricing" });
        expect(tab.tagName).toBe("BUTTON");
        expect(tab).toHaveClass("dextinityTab");
        expect(tab).toHaveAttribute("data-orientation", "horizontal");
        expect(tab).not.toHaveAttribute("data-active");
        expect(tab).not.toHaveAttribute("data-disabled");
        expect(screen.getByRole("tab", { name: "Overview" })).toHaveAttribute("data-active");
    });

    it("reflects the disabled owner state", () => {
        render(
            <InTabs>
                <Tab value="pricing" disabled>
                    Pricing
                </Tab>
            </InTabs>,
        );

        const tab = screen.getByRole("tab", { name: "Pricing" });
        expect(tab).toHaveAttribute("data-disabled");
        expect(tab).toHaveAttribute("aria-disabled", "true");
    });

    it("renders the icon slot with its contract class, hidden from assistive technology", () => {
        render(
            <InTabs>
                <Tab value="pricing" icon={<svg data-testid="icon" />}>
                    Pricing
                </Tab>
            </InTabs>,
        );

        const icon = screen.getByTestId("icon").parentElement;
        expect(icon).toHaveClass("dextinityTab__icon");
        expect(icon).toHaveAttribute("aria-hidden", "true");
        expect(screen.getByRole("tab", { name: "Pricing" })).toContainElement(icon);
    });

    it("renders no icon slot for content that renders nothing", () => {
        const { container } = render(
            <InTabs>
                <Tab value="pricing" icon={false}>
                    Pricing
                </Tab>
                <Tab value="inventory" icon="">
                    Inventory
                </Tab>
            </InTabs>,
        );

        expect(container.querySelector(".dextinityTab__icon")).not.toBeInTheDocument();
    });

    it("adds the consumer's class and style to the tab", () => {
        render(
            <InTabs>
                <Tab value="pricing" className="consumer" style={{ minWidth: "8rem" }}>
                    Pricing
                </Tab>
            </InTabs>,
        );

        const tab = screen.getByRole("tab", { name: "Pricing" });
        expect(tab).toHaveClass("dextinityTab", "consumer");
        expect(tab).toHaveStyle({ minWidth: "8rem" });
    });

    it("renders a link through render, keeping the tab role and the contract class", () => {
        render(
            <InTabs>
                <Tab value="pricing" render={<a href="/products/42/pricing" />} nativeButton={false}>
                    Pricing
                </Tab>
            </InTabs>,
        );

        const tab = screen.getByRole("tab", { name: "Pricing" });
        expect(tab.tagName).toBe("A");
        expect(tab).toHaveAttribute("href", "/products/42/pricing");
        expect(tab).toHaveClass("dextinityTab");
    });

    it("merges slot props, resolving a function with the owner state", () => {
        render(
            <InTabs orientation="vertical">
                <Tab
                    value="pricing"
                    disabled
                    icon={<svg data-testid="icon" />}
                    slotProps={{
                        icon: (ownerState) => ({
                            className: "consumerIcon",
                            title: `${ownerState.orientation} ${ownerState.disabled ? "disabled" : "enabled"}`,
                        }),
                    }}
                >
                    Pricing
                </Tab>
            </InTabs>,
        );

        const icon = screen.getByTestId("icon").parentElement;
        expect(icon).toHaveClass("dextinityTab__icon", "consumerIcon");
        expect(icon).toHaveAttribute("title", "vertical disabled");
    });
});
