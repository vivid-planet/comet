import "./uiThemes";

import { MuiThemeProvider } from "@dextinity/admin";
import { createContext, type PropsWithChildren, useContext, useEffect, useMemo, useState } from "react";

import { createMuiThemeFromTokens } from "./createMuiThemeFromTokens";

export type UiColorScheme = "light" | "dark";

interface UiThemeSelection {
    theme: string;
    colorScheme: UiColorScheme;
}

interface UiThemeContextValue extends UiThemeSelection {
    setTheme: (theme: string) => void;
    setColorScheme: (colorScheme: UiColorScheme) => void;
}

const UiThemeContext = createContext<UiThemeContextValue | undefined>(undefined);

const storageKey = "dextinity-demo-ui-theme";
const defaultSelection: UiThemeSelection = { theme: "dextinity", colorScheme: "light" };

function readStoredSelection(): UiThemeSelection {
    try {
        const storedSelection = JSON.parse(localStorage.getItem(storageKey) ?? "null");
        return { ...defaultSelection, ...storedSelection };
    } catch {
        return defaultSelection;
    }
}

export function useUiTheme() {
    const value = useContext(UiThemeContext);
    if (value === undefined) {
        throw new Error("useUiTheme must be used inside a UiThemeProvider");
    }
    return value;
}

/**
 * Holds the @dextinity/ui theme the user picked, sets it on `<html>` and gives the MUI components a theme
 * created from its tokens.
 */
export function UiThemeProvider({ muiLocale, children }: PropsWithChildren<{ muiLocale: object[] }>) {
    const [selection, setSelection] = useState(readStoredSelection);

    const muiTheme = useMemo(() => {
        // The tokens are read from <html>, so the attributes have to be set before the MUI theme is created.
        document.documentElement.setAttribute("data-dextinity-theme", selection.theme);
        document.documentElement.setAttribute("data-dextinity-color-scheme", selection.colorScheme);
        return createMuiThemeFromTokens({ colorScheme: selection.colorScheme, muiLocale });
    }, [selection, muiLocale]);

    useEffect(() => {
        try {
            localStorage.setItem(storageKey, JSON.stringify(selection));
        } catch {
            // The selection only lasts until the next page load.
        }
    }, [selection]);

    const contextValue = useMemo<UiThemeContextValue>(
        () => ({
            ...selection,
            setTheme: (theme) => setSelection((current) => ({ ...current, theme })),
            setColorScheme: (colorScheme) => setSelection((current) => ({ ...current, colorScheme })),
        }),
        [selection],
    );

    return (
        <UiThemeContext value={contextValue}>
            <MuiThemeProvider theme={muiTheme}>{children}</MuiThemeProvider>
        </UiThemeContext>
    );
}
