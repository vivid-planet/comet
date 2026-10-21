import type { Decorator } from "@storybook/react-vite";
import { clsx } from "clsx";
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

/**
 * Chromatic modes that capture a story once per theme, in the light color scheme, for the theme overview.
 * Chromatic adds a story's modes to the project's, so this reuses the light one's name and turns off the dark one.
 */
export const themeModes = {
    ...Object.fromEntries(themeOptions.map((theme) => [`${theme.value} light`, { theme: theme.value, colorScheme: "light" }])),
    "dextinity dark": { disable: true },
};

/**
 * Applies the theme and color scheme picked in the toolbar. Like an application, it sets them on `<html>`, so
 * popups rendered outside the story follow them too. The story's own wrapper carries them as well, for the
 * docs page, which renders every story on a themed canvas. A story with the `fullscreen` layout gets no padding,
 * so a page fills the canvas.
 */
export const themeDecorator: Decorator = (Story, { globals, parameters }) => (
    <ThemedCanvas theme={String(globals.theme)} colorScheme={String(globals.colorScheme)} isFullscreen={parameters.layout === "fullscreen"}>
        <Story />
    </ThemedCanvas>
);

interface ThemedCanvasProps extends PropsWithChildren {
    theme: string;
    colorScheme: string;
    isFullscreen: boolean;
}

function ThemedCanvas({ theme, colorScheme, isFullscreen, children }: ThemedCanvasProps) {
    useLayoutEffect(() => {
        document.documentElement.dataset.dextinityTheme = theme;
        document.documentElement.dataset.dextinityColorScheme = colorScheme;
    }, [theme, colorScheme]);

    return (
        <div
            className={clsx(styles.canvas, isFullscreen && styles.fullscreen)}
            data-dextinity-theme={theme}
            data-dextinity-color-scheme={colorScheme}
        >
            {children}
        </div>
    );
}
