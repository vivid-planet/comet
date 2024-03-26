import { Breakpoint, ThemeBreakpoints } from "@src/theme";
import { css } from "styled-components";

type SpacingValueOptions =
    | "none"
    | "d150"
    | "d200"
    | "d250"
    | "d300"
    | "d350"
    | "d400"
    | "d450"
    | "d500"
    | "d550"
    | "d600"
    | "d650"
    | "d800"
    | "d900"
    | "d1200"
    | "d1600"
    | "s100"
    | "s150"
    | "s200"
    | "s250"
    | "s300"
    | "s350"
    | "s400"
    | "s450"
    | "s500"
    | "s550"
    | "s600"
    | "s800"
    | "s900"
    | "s1000";

interface Breakpoints extends ThemeBreakpoints {
    b0: Breakpoint;
}

type SpacingValuesForBreakpoints = {
    [key in keyof Breakpoints]: number;
};

type SpacingValues = {
    [key in SpacingValueOptions]: SpacingValuesForBreakpoints | number;
};

const spacingValues: SpacingValues = {
    none: {
        b0: 0,
        b560: 0,
        b960: 0,
        b1280: 0,
        b1600: 0,
        b1920: 0,
    },
    //dynamic
    d150: {
        b0: 6,
        b560: 6,
        b960: 8,
        b1280: 10,
        b1600: 10,
        b1920: 10,
    },
    d200: {
        b0: 12,
        b560: 12,
        b960: 16,
        b1280: 20,
        b1600: 20,
        b1920: 20,
    },
    d250: {
        b0: 16,
        b560: 16,
        b960: 20,
        b1280: 24,
        b1600: 24,
        b1920: 24,
    },
    d300: {
        b0: 18,
        b560: 18,
        b960: 24,
        b1280: 30,
        b1600: 30,
        b1920: 30,
    },
    d350: {
        b0: 24,
        b560: 24,
        b960: 30,
        b1280: 40,
        b1600: 40,
        b1920: 40,
    },
    d400: {
        b0: 36,
        b560: 36,
        b960: 40,
        b1280: 50,
        b1600: 50,
        b1920: 50,
    },
    d450: {
        b0: 44,
        b560: 44,
        b960: 50,
        b1280: 60,
        b1600: 60,
        b1920: 60,
    },
    d500: {
        b0: 50,
        b560: 50,
        b960: 64,
        b1280: 80,
        b1600: 80,
        b1920: 80,
    },
    d550: {
        b0: 60,
        b560: 60,
        b960: 80,
        b1280: 100,
        b1600: 100,
        b1920: 100,
    },
    d600: {
        b0: 80,
        b560: 80,
        b960: 100,
        b1280: 120,
        b1600: 120,
        b1920: 120,
    },
    d650: {
        b0: 100,
        b560: 100,
        b960: 120,
        b1280: 120,
        b1600: 130,
        b1920: 130,
    },
    d800: {
        b0: 72,
        b560: 72,
        b960: 80,
        b1280: 100,
        b1600: 100,
        b1920: 100,
    },
    d900: {
        b0: 88,
        b560: 88,
        b960: 100,
        b1280: 120,
        b1600: 120,
        b1920: 120,
    },
    d1200: {
        b0: 160,
        b560: 160,
        b960: 200,
        b1280: 240,
        b1600: 240,
        b1920: 240,
    },
    d1600: {
        b0: 232,
        b560: 232,
        b960: 280,
        b1280: 340,
        b1600: 340,
        b1920: 340,
    },
    //static
    s100: 6,
    s150: 12,
    s200: 14,
    s250: 20,
    s300: 24,
    s350: 30,
    s400: 40,
    s450: 44,
    s500: 50,
    s550: 60,
    s600: 72,
    s800: 80,
    s900: 100,
    s1000: 120,
};

export const getResponsiveSpacing = (property: string, value: SpacingValueOptions, negativeValue?: boolean) => {
    //): ReturnType<ThemedCssFunction<DefaultTheme>> => {
    const spacingValueForBreakpoint: SpacingValuesForBreakpoints | number = spacingValues[value];

    if (typeof spacingValueForBreakpoint === "number") {
        return css`
            ${property}: ${spacingValueForBreakpoint}px;
        `;
    }

    return Object.keys(spacingValueForBreakpoint).map((breakpointKey) => {
        const spacingValue: number = negativeValue ? -spacingValueForBreakpoint[breakpointKey] : spacingValueForBreakpoint[breakpointKey];

        if (breakpointKey === "b0") {
            return css`
                ${property}: ${spacingValue}px;
            `;
        }

        return css`
            @media (min-width: ${({ theme }) => theme.breakpoints[breakpointKey].value}px) {
                ${property}: ${spacingValue}px;
            }
        `;
    });
};
