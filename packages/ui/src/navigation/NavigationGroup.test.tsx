import { render, screen } from "@testing-library/react";
import { createRef, StrictMode } from "react";
import { describe, expect, it } from "vitest";

import { Navigation } from "./Navigation";
import { NavigationGroup, type NavigationGroupProps } from "./NavigationGroup";
import { NavigationItem } from "./NavigationItem";

function renderGroup(props: Partial<NavigationGroupProps> = {}) {
    return render(
        <Navigation label="Main">
            <NavigationGroup label="Catalog" {...props}>
                <NavigationItem href="/products">Products</NavigationItem>
                <NavigationItem href="/categories">Categories</NavigationItem>
            </NavigationGroup>
        </Navigation>,
    );
}

describe("NavigationGroup", () => {
    it("renders the styling contract of a closed group with the default owner state", () => {
        const { container } = renderGroup();

        const trigger = screen.getByRole("button", { name: "Catalog" });
        const root = trigger.closest("li");
        const panel = container.querySelector(".dextinityNavigationGroup__panel");
        expect(root).toHaveClass("dextinityNavigationGroup");
        expect(root).toHaveAttribute("data-level", "1");
        expect(root).toHaveAttribute("data-closed");
        expect(trigger).toHaveClass("dextinityNavigationGroup__trigger");
        expect(trigger).toHaveAttribute("aria-expanded", "false");
        const indicator = trigger.querySelector(".dextinityNavigationGroup__indicator");
        expect(indicator).toHaveAttribute("aria-hidden", "true");
        expect(indicator?.querySelector(".dextinityIcon")).toHaveAttribute("data-icon", "chevron-down");
        expect(panel?.tagName).toBe("UL");
        expect(panel).toHaveAttribute("hidden", "until-found");
        expect(panel?.querySelectorAll(".dextinityNavigationItem")).toHaveLength(2);
    });

    it("renders the styling contract of an open group", () => {
        const { container } = renderGroup({ defaultOpen: true });

        const trigger = screen.getByRole("button", { name: "Catalog" });
        expect(trigger.closest("li")).toHaveAttribute("data-open");
        expect(trigger).toHaveAttribute("aria-expanded", "true");
        expect(trigger).toHaveAttribute("data-panel-open");
        expect(container.querySelector(".dextinityNavigationGroup__panel")).not.toHaveAttribute("hidden");
    });

    // The stories don't render in StrictMode, which runs the effects a second time while the page loads.
    it.each([
        ["", false],
        [" in StrictMode", true],
    ])("opens around the active item without a transition while it mounts%s", (_, isStrict) => {
        const navigation = (
            <Navigation label="Main">
                <NavigationGroup label="Catalog">
                    <NavigationItem href="/products" active>
                        Products
                    </NavigationItem>
                </NavigationGroup>
            </Navigation>
        );
        const { container } = render(isStrict ? <StrictMode>{navigation}</StrictMode> : navigation);

        expect(screen.getByRole("button", { name: "Catalog" })).toHaveAttribute("aria-expanded", "true");
        expect(container.querySelector<HTMLElement>(".dextinityNavigationGroup__panel")?.style.transitionDuration).toBe("0s");
    });

    it("nests a group one level deeper", () => {
        render(
            <Navigation label="Main">
                <NavigationGroup label="Catalog" defaultOpen>
                    <NavigationGroup label="Attributes" />
                </NavigationGroup>
            </Navigation>,
        );

        expect(screen.getByRole("button", { name: "Attributes" }).closest("li")).toHaveAttribute("data-level", "2");
    });

    it("adds the consumer's class and style to the root, and passes the other props, including `ref`, to it", () => {
        const ref = createRef<HTMLLIElement>();
        renderGroup({ className: "consumer", style: { marginBlockStart: "1rem" }, id: "catalog", ref });

        const root = screen.getByRole("button", { name: "Catalog" }).closest("li");
        expect(root).toHaveClass("dextinityNavigationGroup", "consumer");
        expect(root).toHaveStyle({ marginBlockStart: "1rem" });
        expect(root).toHaveAttribute("id", "catalog");
        expect(ref.current).toBe(root);
    });

    it("renders the icon slot hidden from assistive technology, and none for content that renders nothing", () => {
        const { rerender } = renderGroup({ icon: <svg data-testid="icon" /> });

        const icon = screen.getByTestId("icon").parentElement;
        expect(icon).toHaveClass("dextinityNavigationGroup__icon");
        expect(icon).toHaveAttribute("aria-hidden", "true");
        expect(screen.getByRole("button")).toHaveAccessibleName("Catalog");

        rerender(
            <Navigation label="Main">
                <NavigationGroup label="Catalog" icon="" />
            </Navigation>,
        );
        expect(document.querySelector(".dextinityNavigationGroup__icon")).not.toBeInTheDocument();
    });

    it("merges slot props, resolving a function with the owner state", () => {
        const { container } = renderGroup({
            icon: <svg data-testid="icon" />,
            slotProps: {
                trigger: (ownerState) => ({ className: "consumerTrigger", title: String(ownerState.level) }),
                icon: { className: "consumerIcon" },
                indicator: { className: "consumerIndicator" },
                panel: { className: "consumerPanel" },
            },
        });

        const trigger = screen.getByRole("button", { name: "Catalog" });
        expect(trigger).toHaveClass("dextinityNavigationGroup__trigger", "consumerTrigger");
        expect(trigger).toHaveAttribute("title", "1");
        expect(screen.getByTestId("icon").parentElement).toHaveClass("dextinityNavigationGroup__icon", "consumerIcon");
        expect(trigger.querySelector(".dextinityNavigationGroup__indicator")).toHaveClass("consumerIndicator");
        expect(container.querySelector(".dextinityNavigationGroup__panel")).toHaveClass("consumerPanel");
    });
});
