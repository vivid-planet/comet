import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Menu } from "./Menu";
import { MenuItem } from "./MenuItem";
import { MenuSeparator } from "./MenuSeparator";

describe("MenuSeparator", () => {
    it("renders the styling contract as a separator, adding the consumer's class", async () => {
        render(
            <Menu defaultOpen trigger={<button type="button">Actions</button>}>
                <MenuItem>Duplicate</MenuItem>
                <MenuSeparator className="consumer" />
                <MenuItem tone="danger">Delete</MenuItem>
            </Menu>,
        );

        const separator = await screen.findByRole("separator");
        expect(separator).toHaveClass("dextinityMenuSeparator", "consumer");
        expect(separator).toHaveAttribute("aria-orientation", "horizontal");
    });
});
