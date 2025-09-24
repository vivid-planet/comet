import { breakpoints } from "@src/styles/breakpoints";

type BreakpointWidths = { default: string | number } & Partial<Record<keyof typeof breakpoints, string | number>>;

export function createImageSizes(breakpointWidths: BreakpointWidths) {
    const sizes: string[] = [];
    const breakpointEntries = Object.entries(breakpoints).sort((a, b) => b[1] - a[1]); // breakpoint values have to be sorted in descending order when using min-width in the sizes property
    const defaultSize = breakpointWidths.default;

    breakpointEntries.forEach(([breakpointKey, breakpointValue]) => {
        const size = breakpointWidths[breakpointKey];
        if (size !== undefined) {
            sizes.push(`(min-width: ${breakpointValue}px) ${typeof size === "string" ? size : `${size}px`}`);
        }
    });

    sizes.push(`${typeof defaultSize === "string" ? defaultSize : `${defaultSize}px`}`);

    return sizes.join(", ");
}
