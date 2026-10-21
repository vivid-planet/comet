import type { Decorator } from "@storybook/react-vite";
import { type PropsWithChildren, useLayoutEffect } from "react";

import styles from "./themeDecorator.module.css";

export const themeOptions = [
    { value: "dextinity", title: "Dextinity" },
    { value: "sunset", title: "Sunset (Dextinity variation)" },
    { value: "acme", title: "Acme (fictive brand)" },
];

export const colorSchemeOptions = [
    { value: "light", title: "Light" },
    { value: "dark", title: "Dark" },
];

/** Chromatic modes for the published theme, which every story is captured in. */
export const dextinityThemeModes = {
    "dextinity light": { theme: "dextinity", colorScheme: "light" },
    "dextinity dark": { theme: "dextinity", colorScheme: "dark" },
};

/** Chromatic modes that capture a story once per theme, for stories that show the color schemes side by side. */
export const themeModes = Object.fromEntries(themeOptions.map((theme) => [theme.value, { theme: theme.value, colorScheme: "light" }]));

/**
 * Applies the theme and color scheme picked in the toolbar. Like an application, it sets them on `<html>`, so
 * popups rendered outside the story follow them too. The story's own wrapper carries them as well, for the
 * docs page, which renders every story on a themed canvas.
 */
export const themeDecorator: Decorator = (Story, { globals }) => (
    <ThemedCanvas theme={String(globals.theme)} colorScheme={String(globals.colorScheme)}>
        <Story />
    </ThemedCanvas>
);

function ThemedCanvas({ theme, colorScheme, children }: PropsWithChildren<{ theme: string; colorScheme: string }>) {
    useLayoutEffect(() => {
        document.documentElement.dataset.dextinityTheme = theme;
        document.documentElement.dataset.dextinityColorScheme = colorScheme;
    }, [theme, colorScheme]);

    return (
        <div className={styles.canvas} data-dextinity-theme={theme} data-dextinity-color-scheme={colorScheme}>
            {children}
        </div>
    );
}
