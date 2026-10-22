import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Menu } from "./Menu";
import { MenuGroup } from "./MenuGroup";
import { MenuItem } from "./MenuItem";

describe("MenuGroup", () => {
    it("renders the styling contract, named by its label", async () => {
        render(
            <Menu defaultOpen trigger={<button type="button">Export</button>}>
                <MenuGroup label="Export as" className="consumer" slotProps={{ label: { className: "consumerLabel" } }}>
                    <MenuItem>PDF</MenuItem>
                    <MenuItem>CSV</MenuItem>
                </MenuGroup>
            </Menu>,
        );

        const group = await screen.findByRole("group", { name: "Export as" });
        const label = screen.getByText("Export as");
        expect(group).toHaveClass("dextinityMenuGroup", "consumer");
        expect(label).toHaveClass("dextinityMenuGroup__label", "consumerLabel");
        expect(screen.getAllByRole("menuitem")).toHaveLength(2);
    });
});
