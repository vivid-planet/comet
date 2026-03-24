import { createBreakpoint } from "./createBreakpoint.js";
import { defaultTheme } from "./defaultTheme.js";
import type { Theme, ThemeBreakpoints, ThemeSizes } from "./themeTypes.js";

type CreateThemeOverrides = {
    sizes?: Partial<ThemeSizes>;
    breakpoints?: Partial<Record<keyof ThemeBreakpoints, number>>;
};

/**
 * Creates a complete theme by merging optional overrides onto the default
 * theme values. Breakpoints are specified as plain numbers and are
 * automatically converted to `ThemeBreakpoint` objects.
 *
 * When `breakpoints.default` is not explicitly provided, it is auto-derived
 * from `sizes.bodyWidth`.
 */
export function createTheme(overrides?: CreateThemeOverrides): Theme {
    const resolvedSizes: ThemeSizes = { ...defaultTheme.sizes, ...overrides?.sizes };

    const defaultBreakpointValue = overrides?.breakpoints?.default ?? resolvedSizes.bodyWidth;
    const mobileBreakpointValue = overrides?.breakpoints?.mobile ?? defaultTheme.breakpoints.mobile.value;

    return {
        sizes: resolvedSizes,
        breakpoints: {
            default: createBreakpoint(defaultBreakpointValue),
            mobile: createBreakpoint(mobileBreakpointValue),
        },
    };
}
