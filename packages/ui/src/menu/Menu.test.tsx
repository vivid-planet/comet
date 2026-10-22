import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { ThemeSwitch } from "../themeSwitch/ThemeSwitch";
import { Menu } from "./Menu";
import { MenuItem } from "./MenuItem";

describe("Menu", () => {
    it("renders the styling contract on the popup, in a portal, named by the trigger", async () => {
        const { container } = render(
            <Menu defaultOpen trigger={<button type="button">Actions</button>}>
                <MenuItem>Duplicate</MenuItem>
            </Menu>,
        );

        const popup = await screen.findByRole("menu", { name: "Actions" });
        expect(popup).toHaveClass("dextinityMenu");
        expect(popup.parentElement).toHaveClass("dextinityMenu__positioner");
        expect(container).not.toContainElement(popup);
        expect(screen.getByRole("button", { name: "Actions" })).toHaveAttribute("aria-haspopup", "menu");
    });

    it("opens on the requested side and alignment", async () => {
        render(
            <Menu defaultOpen side="top" align="end" trigger={<button type="button">Actions</button>}>
                <MenuItem>Duplicate</MenuItem>
            </Menu>,
        );

        const positioner = (await screen.findByRole("menu")).parentElement;
        expect(positioner).toHaveAttribute("data-side", "top");
        expect(positioner).toHaveAttribute("data-align", "end");
    });

    it("adds the consumer's class, style and other props to the popup", async () => {
        render(
            <Menu
                defaultOpen
                className="consumer"
                style={{ maxWidth: "20rem" }}
                aria-label="Product actions"
                trigger={<button type="button">Actions</button>}
            >
                <MenuItem>Duplicate</MenuItem>
            </Menu>,
        );

        const popup = await screen.findByRole("menu", { name: "Product actions" });
        expect(popup).toHaveClass("dextinityMenu", "consumer");
        expect(popup).toHaveStyle({ maxWidth: "20rem" });
        expect(screen.getByRole("button", { name: "Actions" })).not.toHaveClass("consumer");
    });

    it("merges slot props, resolving a function with the owner state", async () => {
        render(
            <Menu
                defaultOpen
                align="end"
                slotProps={{ positioner: (ownerState) => ({ className: "consumerPositioner", title: ownerState.align }) }}
                trigger={<button type="button">Actions</button>}
            >
                <MenuItem>Duplicate</MenuItem>
            </Menu>,
        );

        const positioner = (await screen.findByRole("menu")).parentElement;
        expect(positioner).toHaveClass("dextinityMenu__positioner", "consumerPositioner");
        expect(positioner).toHaveAttribute("title", "end");
    });

    it("renders nothing but the trigger while closed", () => {
        render(
            <Menu trigger={<button type="button">Actions</button>}>
                <MenuItem>Duplicate</MenuItem>
            </Menu>,
        );

        expect(screen.getByRole("button", { name: "Actions" })).toHaveAttribute("aria-expanded", "false");
        expect(screen.queryByRole("menu")).not.toBeInTheDocument();
    });

    it("disables the trigger", () => {
        render(
            <Menu disabled trigger={<button type="button">Actions</button>}>
                <MenuItem>Duplicate</MenuItem>
            </Menu>,
        );

        expect(screen.getByRole("button", { name: "Actions" })).toHaveAttribute("data-disabled");
    });

    it("gives the positioner the theme of the theme switch around the trigger", async () => {
        render(
            <ThemeSwitch theme="sunset" colorScheme="dark">
                <Menu defaultOpen trigger={<button type="button">Actions</button>}>
                    <MenuItem>Duplicate</MenuItem>
                </Menu>
            </ThemeSwitch>,
        );

        const positioner = (await screen.findByRole("menu")).parentElement;
        expect(positioner).toHaveAttribute("data-dextinity-theme", "sunset");
        expect(positioner).toHaveAttribute("data-dextinity-color-scheme", "dark");
    });
});
