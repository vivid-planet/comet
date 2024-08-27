import { createContext, PropsWithChildren, useContext } from "react";

export type ColorTheme = "Default" | "GreyN1" | "GreyN2" | "GreyN3" | "DarkBlue";

const ColorThemeContext = createContext<ColorTheme>("Default");

export function ColorThemeProvider({ children, colorTheme }: PropsWithChildren<{ colorTheme: ColorTheme }>) {
    return <ColorThemeContext.Provider value={colorTheme}>{children}</ColorThemeContext.Provider>;
}

export function useColorTheme(): ColorTheme {
    return useContext(ColorThemeContext);
}
