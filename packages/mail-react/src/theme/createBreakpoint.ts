import type { ThemeBreakpoint } from "./themeTypes.js";

export function createBreakpoint(value: number): ThemeBreakpoint {
    return {
        value,
        belowMediaQuery: `@media (max-width: ${value - 1}px)`,
    };
}
