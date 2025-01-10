import type { ExtendTheme } from "@pigment-css/react/theme";

interface Breakpoint {
    mediaQuery: string;
    value: number;
}

type ThemeBreakpoints = {
    xs: Breakpoint;
    sm: Breakpoint;
    md: Breakpoint;
    lg: Breakpoint;
};

declare module "@pigment-css/react/theme" {
    interface ThemeTokens {
        palette: {
            primary: {
                light: string;
                main: string;
                dark: string;
                contrastText: string;
            };
            text: {
                primary: string;
                secondary: string;
                inverted: string;
            };
            gray: {
                50: string;
                100: string;
                200: string;
                300: string;
                400: string;
                500: string;
                600: string;
                700: string;
                800: string;
                900: string;
            };
            error: {
                main: string;
                light: string;
                dark: string;
                contrastText: string;
            };
            warning: {
                main: string;
                light: string;
                dark: string;
                contrastText: string;
            };
            info: {
                main: string;
                light: string;
                dark: string;
                contrastText: string;
            };
            success: {
                main: string;
                light: string;
                dark: string;
                contrastText: string;
            };
        };
        fontFamily: string;
        spacing: {
            D100: string;
            D200: string;
            D300: string;
            D400: string;
            S100: string;
            S200: string;
            S300: string;
            S400: string;
            S500: string;
            S600: string;
        };
        breakpoints: ThemeBreakpoints;
        easings: {
            easeOutCubic: string;
            easeInOutSine: string;
            easeInOutQuad: string;
            easeInCubic: string;
        };
    }

    interface ThemeArgs {
        theme: ExtendTheme<{
            tokens: ThemeTokens;
        }>;
    }
}
