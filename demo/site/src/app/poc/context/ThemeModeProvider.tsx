"use client";

import { createContext, type ReactNode, useContext } from "react";

type ThemeMode = "default" | "inverted";

const ThemeModeContext = createContext<ThemeMode>("default");

type ThemeModeProviderProps = {
    mode?: ThemeMode;
    children: ReactNode;
};

export const ThemeModeProvider = ({ mode = "default", children }: ThemeModeProviderProps) => {
    return <ThemeModeContext.Provider value={mode}>{children}</ThemeModeContext.Provider>;
};

export const useThemeMode = () => useContext(ThemeModeContext);
