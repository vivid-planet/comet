import { createBreakpoint } from "./createBreakpoint.js";
import { defaultTheme } from "./defaultTheme.js";
import type { Theme, ThemeBreakpoints, ThemeSizes, ThemeText } from "./themeTypes.js";

type CreateThemeOverrides = {
    sizes?: Partial<ThemeSizes>;
    breakpoints?: Partial<ThemeBreakpoints>;
    text?: Partial<ThemeText>;
};

/**
 * Creates a complete theme by merging optional overrides onto the default
 * theme values.
 *
 * Breakpoint overrides must be `ThemeBreakpoint` objects constructed via
 * `createBreakpoint`. Arbitrary breakpoint keys from `ThemeBreakpoints`
 * module augmentation are supported and flow through to the result.
 *
 * `breakpoints.default` is always auto-derived from `sizes.bodyWidth` unless
 * explicitly overridden.
 */
export function createTheme(overrides?: CreateThemeOverrides): Theme {
    const resolvedSizes: ThemeSizes = { ...defaultTheme.sizes, ...overrides?.sizes };

    return {
        sizes: resolvedSizes,
        breakpoints: {
            ...defaultTheme.breakpoints,
            default: createBreakpoint(resolvedSizes.bodyWidth),
            ...overrides?.breakpoints,
        },
        text: { ...defaultTheme.text, ...overrides?.text },
    };
}
