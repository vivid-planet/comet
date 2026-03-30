import { createBreakpoint } from "./createBreakpoint.js";
import type { Theme } from "./themeTypes.js";

export const defaultTheme: Theme = {
    sizes: {
        bodyWidth: 600,
    },
    breakpoints: {
        default: createBreakpoint(600),
        mobile: createBreakpoint(420),
    },
};
