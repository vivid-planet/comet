import { act, render, screen, waitFor } from "@testing-library/react";
import { useRef } from "react";
import { describe, expect, it } from "vitest";

import { ThemeSwitch } from "./ThemeSwitch";
import { usePopupTheme } from "./usePopupTheme";

function TriggerWithPopup({ isOpen, hasTrigger = true }: { isOpen: boolean; hasTrigger?: boolean }) {
    const triggerRef = useRef<HTMLButtonElement>(null);
    const popupTheme = usePopupTheme(triggerRef, isOpen);

    return (
        <>
            {hasTrigger && (
                <button ref={triggerRef} type="button">
                    Trigger
                </button>
            )}
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

    it("follows a change of the theme around the trigger while the popup is open", async () => {
        const { rerender } = render(
            <ThemeSwitch theme="sunset" colorScheme="dark">
                <TriggerWithPopup isOpen />
            </ThemeSwitch>,
        );

        rerender(
            <ThemeSwitch theme="acme" colorScheme="light">
                <TriggerWithPopup isOpen />
            </ThemeSwitch>,
        );

        await waitFor(() => expect(screen.getByTestId("popup")).toHaveAttribute("data-dextinity-color-scheme", "light"));
        expect(screen.getByTestId("popup")).toHaveAttribute("data-dextinity-theme", "acme");
    });

    it("removes the theme attributes when the theme around the trigger disappears while the popup is open", async () => {
        render(
            <ThemeSwitch theme="sunset" colorScheme="dark" data-testid="theme-switch">
                <TriggerWithPopup isOpen />
            </ThemeSwitch>,
        );

        screen.getByTestId("theme-switch").removeAttribute("data-dextinity-theme");

        await waitFor(() => expect(screen.getByTestId("popup")).not.toHaveAttribute("data-dextinity-theme"));
        expect(screen.getByTestId("popup")).not.toHaveAttribute("data-dextinity-color-scheme");
    });

    it("keeps the theme of a trigger that left the page while the popup is open", async () => {
        const { rerender } = render(
            <ThemeSwitch theme="sunset" colorScheme="dark">
                <TriggerWithPopup isOpen />
            </ThemeSwitch>,
        );

        rerender(
            <ThemeSwitch theme="sunset" colorScheme="dark">
                <TriggerWithPopup isOpen hasTrigger={false} />
            </ThemeSwitch>,
        );
        document.documentElement.setAttribute("data-dextinity-theme", "acme");
        await act(() => Promise.resolve());
        document.documentElement.removeAttribute("data-dextinity-theme");

        expect(screen.getByTestId("popup")).toHaveAttribute("data-dextinity-theme", "sunset");
        expect(screen.getByTestId("popup")).toHaveAttribute("data-dextinity-color-scheme", "dark");
    });

    it("leaves a popup without theme attributes when nothing around the trigger names a theme", () => {
        render(<TriggerWithPopup isOpen />);

        expect(screen.getByTestId("popup")).not.toHaveAttribute("data-dextinity-theme");
    });
});
