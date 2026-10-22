import { render, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import { describe, expect, it } from "vitest";

import { Menu } from "./Menu";
import { MenuLinkItem } from "./MenuLinkItem";

function renderInOpenMenu(item: ReactNode) {
    return render(
        <Menu defaultOpen trigger={<button type="button">Account</button>}>
            {item}
        </Menu>,
    );
}

describe("MenuLinkItem", () => {
    it("renders a link with the styling contract and the default owner state", async () => {
        renderInOpenMenu(<MenuLinkItem href="/profile">Profile</MenuLinkItem>);

        const item = await screen.findByRole("menuitem", { name: "Profile" });
        expect(item.tagName).toBe("A");
        expect(item).toHaveAttribute("href", "/profile");
        expect(item).toHaveClass("dextinityMenuLinkItem");
        expect(item).toHaveAttribute("data-tone", "default");
    });

    it("renders a router's link through `render`, keeping the contract", async () => {
        renderInOpenMenu(<MenuLinkItem render={<a href="/settings" data-router-link="" />}>Settings</MenuLinkItem>);

        const item = await screen.findByRole("menuitem", { name: "Settings" });
        expect(item).toHaveAttribute("data-router-link");
        expect(item).toHaveAttribute("href", "/settings");
        expect(item).toHaveClass("dextinityMenuLinkItem");
    });

    it("renders the icon part, hidden from assistive technology, and merges slot props with the owner state", async () => {
        renderInOpenMenu(
            <MenuLinkItem
                href="/account/delete"
                tone="danger"
                className="consumer"
                icon={<svg data-testid="icon" />}
                slotProps={{ icon: (ownerState) => ({ className: "consumerIcon", title: ownerState.tone }) }}
            >
                Delete account
            </MenuLinkItem>,
        );

        const item = await screen.findByRole("menuitem", { name: "Delete account" });
        const icon = screen.getByTestId("icon").parentElement;
        expect(item).toHaveClass("dextinityMenuLinkItem", "consumer");
        expect(item).toHaveAttribute("data-tone", "danger");
        expect(icon).toHaveClass("dextinityMenuLinkItem__icon", "consumerIcon");
        expect(icon).toHaveAttribute("aria-hidden", "true");
        expect(icon).toHaveAttribute("title", "danger");
    });
});
