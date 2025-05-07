import theme, { Theme } from "@src/theme";

type BreakpointWidths = { xs: string | number } & Partial<Record<keyof Theme["breakpoints"], string | number>>;

export function createImageSizes(breakpointWidths: BreakpointWidths) {
    const sizes: string[] = [];
    const breakpoints = Object.entries(theme.breakpoints).reverse();
    const defaultSize = breakpointWidths.xs;

    breakpoints.forEach(([breakpointKey, breakpointValue]) => {
        const size = breakpointWidths[breakpointKey];
        const minWidth = breakpointValue.value;

        if (size !== undefined) {
            sizes.push(`(min-width: ${minWidth}px) ${typeof size === "string" ? size : `${size}px`}`);
        }
    });

    sizes.push(`(min-width: 0px) ${typeof defaultSize === "string" ? defaultSize : `${defaultSize}px`}`);

    return sizes.join(", ");
}
