import type { ExtendTheme } from "@pigment-css/react/theme";

interface Breakpoint {
    mediaQuery: string;
    value: number;
}

type ThemeBreakpoints = {
    b560: Breakpoint;
    b960: Breakpoint;
    b1280: Breakpoint;
    b1600: Breakpoint;
    b1920: Breakpoint;
};

declare module "@pigment-css/react/theme" {
    interface ThemeTokens {
        colors: {
            primary: string;
            textPrimary: string;
            lightGray: string;
            white: string;
            black: string;
            lightBackground: string;
            linkBlue: string;
            darkBlue: string;
            darkBlueSec: string;
            purple: string;
            n050: string;
            n100: string;
            n200: string;
            n300: string;
            n400: string;
            n500: string;
            n600: string;
            n700: string;
            n800: string;
            n900: string;
        };
        fonts: {
            primary: string;
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
