import { getResponsiveOverrides } from "../../theme/responsiveValue.js";
import type { DividerVariantStyles, Theme, ThemeBreakpoints } from "../../theme/themeTypes.js";
import { css } from "../../utils/css.js";

type ColorPropertyKey = Exclude<keyof DividerVariantStyles, "height">;

const colorCssProperties: ReadonlyArray<[ColorPropertyKey, string]> = [
    ["backgroundColor", "background-color"],
    ["backgroundImage", "background-image"],
];

interface GenerateResponsiveDividerCssOptions {
    /** Selector for divider style overrides, given a variant name. */
    styleSelector: (variantName: string) => string;
}

/** Generates responsive CSS media queries for divider variant overrides. */
export function generateResponsiveDividerCss(theme: Theme, options: GenerateResponsiveDividerCssOptions): string {
    const { variants } = theme.divider;
    if (!variants) {
        return css``;
    }

    const cssChunks: string[] = [];

    for (const [variantName, variantStyles] of Object.entries(variants)) {
        if (!variantStyles) {
            continue;
        }

        const overrides = new Map<keyof ThemeBreakpoints, string[]>();

        const heightValue = variantStyles.height;
        if (heightValue !== undefined) {
            for (const { breakpointKey, value: breakpointValue } of getResponsiveOverrides(heightValue)) {
                const declarations = overrides.get(breakpointKey) ?? [];
                // line-height matches height so Outlook honors the declared cell height.
                declarations.push(`height: ${breakpointValue}px !important`);
                declarations.push(`line-height: ${breakpointValue}px !important`);
                overrides.set(breakpointKey, declarations);
            }
        }

        for (const [themeKey, cssProperty] of colorCssProperties) {
            const value = variantStyles[themeKey];
            if (value === undefined) {
                continue;
            }

            for (const { breakpointKey, value: breakpointValue } of getResponsiveOverrides(value)) {
                const declarations = overrides.get(breakpointKey) ?? [];
                declarations.push(`${cssProperty}: ${breakpointValue} !important`);
                overrides.set(breakpointKey, declarations);
            }
        }

        for (const [breakpointKey, declarations] of overrides) {
            const breakpoint = theme.breakpoints[breakpointKey];
            if (!breakpoint) {
                continue;
            }

            cssChunks.push(css`
                ${breakpoint.belowMediaQuery} {
                    ${options.styleSelector(variantName)} {
                        ${declarations.join(";\n")}
                    }
                }
            `);
        }
    }

    return cssChunks.join("\n");
}
