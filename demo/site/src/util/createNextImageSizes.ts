type Breakpoints = {
    sm: number;
    md: number;
    lg: number;
    xl: number;
};

const breakpointMapping: Record<keyof Breakpoints, number> = {
    sm: 600,
    md: 900,
    lg: 1200,
    xl: 1600,
};

export function createNextImageSizes(breakpointWidths: Partial<Record<keyof Breakpoints, string | number>>, defaultWidth: string | number = "100vw") {
    const sizes: string[] = [];
    const breakpoints: (keyof Breakpoints)[] = ["sm", "md", "lg", "xl"];

    breakpoints.forEach((breakpoint) => {
        const width = breakpointWidths[breakpoint];
        const maxWidth = breakpointMapping[breakpoint];

        if (width !== undefined) {
            sizes.push(`(max-width: ${maxWidth}px) ${typeof width === "string" ? width : `${width}px`}`);
        }
    });

    sizes.push(typeof defaultWidth === "string" ? defaultWidth : `${defaultWidth}px`);

    return sizes.join(", ");
}
