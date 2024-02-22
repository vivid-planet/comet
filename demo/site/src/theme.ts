export interface Breakpoint {
    mediaQuery: string;
    value: number;
}

const createBreakpoint = (value: number): Breakpoint => {
    return {
        mediaQuery: `@media (min-width: ${value}px)`,
        value: value,
    };
};

export type ThemeBreakpoints = {
    b560: Breakpoint;
    b960: Breakpoint;
    b1280: Breakpoint;
    b1600: Breakpoint;
    b1920: Breakpoint;
};

export interface Theme {
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

declare module "styled-components" {
    // eslint-disable-next-line @typescript-eslint/no-empty-interface
    export interface DefaultTheme extends Theme {}
}

const theme: Theme = {
    colors: {
        primary: "#c00d0d",
        textPrimary: "#000000",
        lightGray: "#d9d9d9",
        white: "#ffffff",
        black: "#000000",
        lightBackground: "#f2f2f2",
        linkBlue: "#29B6F6",
        darkBlue: "#0A1327",
        darkBlueSec: "#151d34",
        purple: "#3C1659",
        n050: "#f6f6f6",
        n100: "#F2F2F2",
        n200: "#CCCCCC",
        n300: "#999999",
        n400: "#676767",
        n500: "#4C4C4C",
        n600: "#404040",
        n700: "#333333",
        n800: "#24242gl" + "4",
        n900: "#141414",
    },
    fonts: {
        primary: "Arial, sans-serif",
    },
    breakpoints: {
        b560: createBreakpoint(560),
        b960: createBreakpoint(960),
        b1280: createBreakpoint(1280),
        b1600: createBreakpoint(1600),
        b1920: createBreakpoint(1920),
    },
    easings: {
        easeOutCubic: "cubic-bezier(0.33, 1, 0.68, 1)",
        easeInOutSine: "cubic-bezier(0.37, 0, 0.63, 1)",
        easeInOutQuad: "cubic-bezier(0.45, 0, 0.55, 1)",
        easeInCubic: "cubic-bezier(0.32, 0, 0.67, 0)",
    },
};

export default theme;
