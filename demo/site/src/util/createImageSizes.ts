import theme, { Theme } from "@src/theme";

export function createImageSizes(
    breakpointWidths: Partial<Record<keyof Theme["breakpoints"], string | number>>,
    defaultWidth: string | number = "100vw",
) {
    const sizes: string[] = [];
    const breakpoints = Object.entries(theme.breakpoints);

    breakpoints.forEach(([breakpointKey, breakpointValue]) => {
        const width = breakpointWidths[breakpointKey];
        const maxWidth = breakpointValue.value;

        if (width !== undefined) {
            sizes.push(`(max-width: ${maxWidth}px) ${typeof width === "string" ? width : `${width}px`}`);
        }
    });

    sizes.push(typeof defaultWidth === "string" ? defaultWidth : `${defaultWidth}px`);

    return sizes.join(", ");
}
