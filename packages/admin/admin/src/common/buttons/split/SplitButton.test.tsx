import { cleanup, fireEvent, render, screen } from "test-utils";
import { afterEach, describe, expect, it, vi } from "vitest";

import { Button } from "../Button";
import { SplitButton } from "./SplitButton";

describe("SplitButton", () => {
    afterEach(() => {
        cleanup();
    });

    it("disables the active button and the button that opens the other options", () => {
        render(
            <SplitButton disabled>
                <Button>Save</Button>
                <Button>Save and go back</Button>
            </SplitButton>,
        );

        expect(screen.getByRole("button", { name: "Save" })).toBeDisabled();
        expect(screen.getByRole("button", { name: "Show options" })).toBeDisabled();
    });

    it("selects another option from the menu and clicks it", () => {
        const handleSaveAndGoBack = vi.fn();
        render(
            <SplitButton>
                <Button onClick={() => {}}>Save</Button>
                <Button onClick={handleSaveAndGoBack}>Save and go back</Button>
            </SplitButton>,
        );

        const toggle = screen.getByRole("button", { name: "Show options" });
        expect(toggle).toHaveAttribute("aria-expanded", "false");
        fireEvent.click(toggle);
        expect(toggle).toHaveAttribute("aria-expanded", "true");

        fireEvent.click(screen.getByRole("menuitem", { name: "Save and go back" }));

        expect(handleSaveAndGoBack).toHaveBeenCalledOnce();
        expect(screen.getByRole("button", { name: "Save and go back" })).toBeInTheDocument();
        expect(screen.queryByRole("button", { name: "Save" })).not.toBeInTheDocument();
    });
});
