import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createRef } from "react";
import { describe, expect, it, vi } from "vitest";

import { Dialog } from "../dialog/Dialog";
import { IconButton } from "../iconButton/IconButton";
import { ThemeSwitch } from "../themeSwitch/ThemeSwitch";
import { Tooltip } from "./Tooltip";

describe("Tooltip", () => {
    it("renders the styling contract around the content", async () => {
        render(
            <Tooltip defaultOpen content="Edit product">
                <IconButton label="Edit product">
                    <svg />
                </IconButton>
            </Tooltip>,
        );

        const popup = await screen.findByText("Edit product");
        expect(popup).toHaveClass("dextinityTooltip");
        expect(popup.parentElement).toHaveClass("dextinityTooltip__positioner");
        expect(popup.querySelector(".dextinityTooltip__arrow")).not.toBeInTheDocument();
    });

    it("keeps the trigger's own accessible name and classes", () => {
        render(
            <Tooltip content="Edit product">
                <IconButton label="Edit product">
                    <svg />
                </IconButton>
            </Tooltip>,
        );

        const trigger = screen.getByRole("button", { name: "Edit product" });
        expect(trigger).toHaveClass("dextinityButton", "dextinityIconButton");
        expect(screen.queryByText("Edit product")).not.toBeInTheDocument();
    });

    it("renders the arrow with showArrow", async () => {
        render(
            <Tooltip defaultOpen showArrow content="Edit product">
                <IconButton label="Edit product">
                    <svg />
                </IconButton>
            </Tooltip>,
        );

        const popup = await screen.findByText("Edit product");
        expect(popup.querySelector(".dextinityTooltip__arrow")).toHaveAttribute("aria-hidden", "true");
    });

    it("adds the consumer's class and style to the popup", async () => {
        render(
            <Tooltip defaultOpen content="Edit product" className="consumer" style={{ maxWidth: "10rem" }}>
                <IconButton label="Edit product">
                    <svg />
                </IconButton>
            </Tooltip>,
        );

        const popup = await screen.findByText("Edit product");
        expect(popup).toHaveClass("dextinityTooltip", "consumer");
        expect(popup).toHaveStyle({ maxWidth: "10rem" });
    });

    it("passes the props it doesn't handle and its ref to the trigger, merged with the trigger's own", async () => {
        const ref = createRef<HTMLElement>();
        const handleTooltipClick = vi.fn();
        const handleButtonClick = vi.fn();
        render(
            <Tooltip content="Edit product" id="edit-button" aria-haspopup="dialog" onClick={handleTooltipClick} ref={ref}>
                <IconButton label="Edit product" onClick={handleButtonClick}>
                    <svg />
                </IconButton>
            </Tooltip>,
        );

        const trigger = screen.getByRole("button", { name: "Edit product" });
        expect(trigger).toHaveAttribute("id", "edit-button");
        expect(trigger).toHaveAttribute("aria-haspopup", "dialog");
        expect(ref.current).toBe(trigger);

        await userEvent.click(trigger);
        expect(handleTooltipClick).toHaveBeenCalledOnce();
        expect(handleButtonClick).toHaveBeenCalledOnce();
    });

    it("works as the trigger of a dialog", async () => {
        render(
            <Dialog
                title="Delete product?"
                trigger={
                    <Tooltip content="Delete product">
                        <IconButton label="Delete product">
                            <svg />
                        </IconButton>
                    </Tooltip>
                }
            />,
        );

        const trigger = screen.getByRole("button", { name: "Delete product" });
        expect(trigger).toHaveAttribute("aria-haspopup", "dialog");

        await userEvent.click(trigger);
        expect(await screen.findByRole("dialog", { name: "Delete product?" })).toBeInTheDocument();
    });

    it("merges slot props, resolving a function with the owner state", async () => {
        render(
            <Tooltip
                defaultOpen
                showArrow
                side="bottom"
                content="Edit product"
                slotProps={{
                    popup: (ownerState) => ({ className: "consumerPopup", id: "edit-tooltip", title: ownerState.side }),
                    positioner: (ownerState) => ({ className: "consumerPositioner", title: ownerState.side }),
                    arrow: (ownerState) => ({ className: "consumerArrow", title: ownerState.side }),
                }}
            >
                <IconButton label="Edit product">
                    <svg />
                </IconButton>
            </Tooltip>,
        );

        const popup = await screen.findByText("Edit product");
        const arrow = popup.querySelector(".dextinityTooltip__arrow");
        expect(popup).toHaveClass("dextinityTooltip", "consumerPopup");
        expect(popup).toHaveAttribute("id", "edit-tooltip");
        expect(popup).toHaveAttribute("title", "bottom");
        expect(popup.parentElement).toHaveClass("dextinityTooltip__positioner", "consumerPositioner");
        expect(popup.parentElement).toHaveAttribute("title", "bottom");
        expect(arrow).toHaveClass("consumerArrow");
        expect(arrow).toHaveAttribute("title", "bottom");
    });

    it("gives the positioner the theme of the theme switch around the trigger", async () => {
        render(
            <ThemeSwitch theme="sunset" colorScheme="dark">
                <Tooltip defaultOpen content="Edit product">
                    <IconButton label="Edit product">
                        <svg />
                    </IconButton>
                </Tooltip>
            </ThemeSwitch>,
        );

        const positioner = (await screen.findByText("Edit product")).parentElement;
        expect(positioner).toHaveAttribute("data-dextinity-theme", "sunset");
        expect(positioner).toHaveAttribute("data-dextinity-color-scheme", "dark");
    });
});
