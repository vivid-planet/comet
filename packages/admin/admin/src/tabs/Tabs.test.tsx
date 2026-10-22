import { cleanup, fireEvent, render, screen } from "test-utils";
import { afterEach, describe, expect, it } from "vitest";

import { Tab, Tabs } from "./Tabs";

describe("Tabs", () => {
    afterEach(() => {
        cleanup();
    });

    it("shows the content of the selected tab, skipping tabs that aren't rendered", () => {
        const showHiddenTab = false;
        render(
            <Tabs label="Product">
                {showHiddenTab && <Tab label="Hidden">Hidden content</Tab>}
                <Tab label="General">General content</Tab>
                <Tab label="Pricing">Pricing content</Tab>
            </Tabs>,
        );

        expect(screen.getByRole("tablist", { name: "Product" })).toBeInTheDocument();
        expect(screen.getByText("General content")).toBeInTheDocument();
        expect(screen.queryByText("Pricing content")).not.toBeInTheDocument();

        fireEvent.click(screen.getByRole("tab", { name: "Pricing" }));

        expect(screen.getByRole("tab", { name: "Pricing" })).toHaveAttribute("aria-selected", "true");
        expect(screen.getByText("Pricing content")).toBeInTheDocument();
        expect(screen.queryByText("General content")).not.toBeInTheDocument();
    });

    it("keeps the content of a tab with forceRender mounted while another tab is selected", () => {
        render(
            <Tabs>
                <Tab label="General" forceRender>
                    General content
                </Tab>
                <Tab label="Pricing">Pricing content</Tab>
            </Tabs>,
        );

        fireEvent.click(screen.getByRole("tab", { name: "Pricing" }));

        expect(screen.getByText("General content")).not.toBeVisible();
        expect(screen.getByText("Pricing content")).toBeVisible();
    });
});
