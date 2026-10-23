import { GLOBALS_UPDATED, SET_GLOBALS } from "storybook/internal/core-events";
import type { Globals } from "storybook/internal/csf";
import { addons } from "storybook/preview-api";

/**
 * Keeps `<html>` in the theme and color scheme picked in the toolbar. The theme decorator does the same for
 * stories, but a docs page without stories, such as a component's design tokens page, runs no decorator.
 */
export function applyToolbarThemeToDocument() {
    const channel = addons.getChannel();
    const applyGlobals = ({ globals }: { globals: Globals }) => {
        document.documentElement.dataset.dextinityTheme = String(globals.theme);
        document.documentElement.dataset.dextinityColorScheme = String(globals.colorScheme);
    };

    channel.on(SET_GLOBALS, applyGlobals);
    channel.on(GLOBALS_UPDATED, applyGlobals);
}
