import { render, screen } from "@testing-library/react";
import { useRef } from "react";
import { describe, expect, it } from "vitest";

import { ThemeSwitch } from "./ThemeSwitch";
import { usePopupTheme } from "./usePopupTheme";

function TriggerWithPopup({ isOpen }: { isOpen: boolean }) {
    const triggerRef = useRef<HTMLButtonElement>(null);
    const popupTheme = usePopupTheme(triggerRef, isOpen);

    return (
        <>
            <button ref={triggerRef} type="button">
                Trigger
            </button>
            {isOpen && <div data-testid="popup" {...popupTheme} />}
        </>
    );
}

describe("usePopupTheme", () => {
    it("gives an open popup the theme of the theme switch around its trigger", () => {
        render(
            <ThemeSwitch theme="sunset" colorScheme="dark">
                <TriggerWithPopup isOpen />
            </ThemeSwitch>,
        );

        expect(screen.getByTestId("popup")).toHaveAttribute("data-dextinity-theme", "sunset");
        expect(screen.getByTestId("popup")).toHaveAttribute("data-dextinity-color-scheme", "dark");
    });

    it("leaves a popup without theme attributes when nothing around the trigger names a theme", () => {
        render(<TriggerWithPopup isOpen />);

        expect(screen.getByTestId("popup")).not.toHaveAttribute("data-dextinity-theme");
    });
});
