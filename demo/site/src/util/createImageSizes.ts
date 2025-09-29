import { type Theme, theme } from "@src/theme";

type BreakpointWidths = { default: string | number } & Partial<Record<keyof Theme["breakpoints"], string | number>>;

export function createImageSizes(breakpointWidths: BreakpointWidths) {
    const sizes: string[] = [];
    const breakpoints = Object.entries(theme.breakpoints).sort((a, b) => b[1].value - a[1].value); // breakpoint values have to be sorted in descending order when using min-width in the sizes property
    const defaultSize = breakpointWidths.default;

    breakpoints.forEach(([breakpointKey, breakpointValue]) => {
        const size = breakpointWidths[breakpointKey as keyof BreakpointWidths];
        const minWidth = breakpointValue.value;

        if (size !== undefined) {
            sizes.push(`(min-width: ${minWidth}px) ${typeof size === "string" ? size : `${size}px`}`);
        }
    });

    sizes.push(`${typeof defaultSize === "string" ? defaultSize : `${defaultSize}px`}`);

    return sizes.join(", ");
}
