import { cleanup, render, screen } from "test-utils";
import { afterEach, describe, expect, it } from "vitest";

import { Tooltip } from "./Tooltip";

describe("Tooltip", () => {
    afterEach(() => {
        cleanup();
    });

    it("adds className to the child and makes it focusable, so keyboard users can open the tooltip", () => {
        render(
            <Tooltip title="Info" className="consumer">
                <span>Icon</span>
            </Tooltip>,
        );

        const child = screen.getByText("Icon");
        expect(child).toHaveClass("consumer");
        expect(child).toHaveAttribute("tabindex", "0");
    });

    it("shows the title and the description, on the side and with the alignment of the placement", async () => {
        render(
            <Tooltip open title="Notification" description="Details" placement="right-start">
                <button type="button">Trigger</button>
            </Tooltip>,
        );

        expect(await screen.findByText("Notification")).toBeInTheDocument();
        expect(screen.getByText("Details")).toBeInTheDocument();
        const positioner = document.querySelector(".dextinityTooltip__positioner");
        expect(positioner).toHaveAttribute("data-side", "inline-end");
        expect(positioner).toHaveAttribute("data-align", "start");
    });

    it("throws for custom content together with a title", () => {
        expect(() =>
            render(
                <Tooltip title="Title" customContent={<div>Custom</div>}>
                    <span>Icon</span>
                </Tooltip>,
            ),
        ).toThrow();
    });
});
