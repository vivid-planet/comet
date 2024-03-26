"use client";
import * as React from "react";

export type ColorTheme = "Default" | "GreyN1" | "GreyN2" | "GreyN3" | "DarkBlue";

const ColorThemeContext = React.createContext<ColorTheme>("Default");

export function ColorThemeProvider({ children, colorTheme }: React.PropsWithChildren<{ colorTheme: ColorTheme }>): React.ReactElement {
    return <ColorThemeContext.Provider value={colorTheme}>{children}</ColorThemeContext.Provider>;
}

export function useColorTheme(): ColorTheme {
    return React.useContext(ColorThemeContext);
}
