import { createBreakpoint } from "./createBreakpoint.js";
import type { Theme } from "./themeTypes.js";

export const defaultTheme: Theme = {
    sizes: {
        bodyWidth: 600,
        contentIndentation: { default: 32, mobile: 16 },
    },
    breakpoints: {
        default: createBreakpoint(600),
        mobile: createBreakpoint(420),
    },
    text: {
        fontFamily: "Arial, sans-serif",
        fontSize: "16px",
        lineHeight: "20px",
        bottomSpacing: 16,
    },
};
