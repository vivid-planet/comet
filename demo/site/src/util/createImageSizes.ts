import theme, { Theme } from "@src/theme";

export function createImageSizes(breakpointWidths: Partial<Record<keyof Theme["breakpoints"], string | number>>) {
    const sizes: string[] = [];
    const breakpoints = Object.entries(theme.breakpoints).reverse();

    breakpoints.forEach(([breakpointKey, breakpointValue]) => {
        const width = breakpointWidths[breakpointKey];
        const minWidth = breakpointValue.value;

        if (width !== undefined) {
            sizes.push(`(min-width: ${minWidth}px) ${typeof width === "string" ? width : `${width}px`}`);
        }
    });

    return sizes.join(", ");
}
