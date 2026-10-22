import { render, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import { describe, expect, it } from "vitest";

import { Menu } from "./Menu";
import { MenuItem } from "./MenuItem";

function renderInOpenMenu(item: ReactNode) {
    return render(
        <Menu defaultOpen trigger={<button type="button">Actions</button>}>
            {item}
        </Menu>,
    );
}

describe("MenuItem", () => {
    it("renders the styling contract with the default owner state", async () => {
        renderInOpenMenu(<MenuItem>Duplicate</MenuItem>);

        const item = await screen.findByRole("menuitem", { name: "Duplicate" });
        expect(item).toHaveClass("dextinityMenuItem");
        expect(item).toHaveAttribute("data-tone", "default");
        expect(item).not.toHaveAttribute("data-disabled");
        expect(item.querySelector(".dextinityMenuItem__icon")).not.toBeInTheDocument();
    });

    it("reflects the owner state in data attributes", async () => {
        renderInOpenMenu(
            <MenuItem tone="danger" disabled>
                Delete
            </MenuItem>,
        );

        const item = await screen.findByRole("menuitem", { name: "Delete" });
        expect(item).toHaveAttribute("data-tone", "danger");
        expect(item).toHaveAttribute("data-disabled");
        expect(item).toHaveAttribute("aria-disabled", "true");
    });

    it("renders the icon part, hidden from assistive technology", async () => {
        renderInOpenMenu(<MenuItem icon={<svg data-testid="icon" />}>Duplicate</MenuItem>);

        const icon = (await screen.findByTestId("icon")).parentElement;
        expect(icon).toHaveClass("dextinityMenuItem__icon");
        expect(icon).toHaveAttribute("aria-hidden", "true");
        expect(screen.getByRole("menuitem")).toHaveAccessibleName("Duplicate");
    });

    it("renders no icon part for content that renders nothing", async () => {
        renderInOpenMenu(<MenuItem icon={false}>Duplicate</MenuItem>);

        expect((await screen.findByRole("menuitem")).querySelector(".dextinityMenuItem__icon")).not.toBeInTheDocument();
    });

    it("adds the consumer's class and style, and merges slot props with the owner state", async () => {
        renderInOpenMenu(
            <MenuItem
                className="consumer"
                style={{ fontWeight: 600 }}
                tone="danger"
                icon={<svg data-testid="icon" />}
                slotProps={{ icon: (ownerState) => ({ className: "consumerIcon", title: ownerState.tone }) }}
            >
                Delete
            </MenuItem>,
        );

        const item = await screen.findByRole("menuitem", { name: "Delete" });
        const icon = screen.getByTestId("icon").parentElement;
        expect(item).toHaveClass("dextinityMenuItem", "consumer");
        expect(item).toHaveStyle({ fontWeight: "600" });
        expect(icon).toHaveClass("dextinityMenuItem__icon", "consumerIcon");
        expect(icon).toHaveAttribute("title", "danger");
    });
});
