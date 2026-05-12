import { getResponsiveOverrides } from "../../theme/responsiveValue.js";
import type { TextVariantStyles, Theme, ThemeBreakpoints } from "../../theme/themeTypes.js";
import { css } from "../../utils/css.js";

type StylePropertyKey = Exclude<keyof TextVariantStyles, "bottomSpacing">;

export const textStyleCssProperties: ReadonlyArray<[StylePropertyKey, string]> = [
    ["fontFamily", "font-family"],
    ["fontSize", "font-size"],
    ["fontWeight", "font-weight"],
    ["fontStyle", "font-style"],
    ["lineHeight", "line-height"],
    ["letterSpacing", "letter-spacing"],
    ["textDecoration", "text-decoration"],
    ["textTransform", "text-transform"],
    ["color", "color"],
];

interface GenerateResponsiveTextCssOptions {
    /** Selector for text style overrides, given a variant name. */
    styleSelector: (variantName: string) => string;
    /** Selector for bottomSpacing overrides, given a variant name. */
    spacingSelector: (variantName: string) => string;
}

/** Generates responsive CSS media queries for text variant overrides. */
export function generateResponsiveTextCss(theme: Theme, options: GenerateResponsiveTextCssOptions): string {
    const { variants } = theme.text;
    if (!variants) {
        return css``;
    }

    const cssChunks: string[] = [];

    for (const [variantName, variantStyles] of Object.entries(variants)) {
        if (!variantStyles) {
            continue;
        }

        const styleOverrides = new Map<keyof ThemeBreakpoints, string[]>();
        const spacingOverrides = new Map<keyof ThemeBreakpoints, string[]>();

        for (const [themeKey, cssProperty] of textStyleCssProperties) {
            const value = variantStyles[themeKey];
            if (value === undefined) {
                continue;
            }

            for (const { breakpointKey, value: breakpointValue } of getResponsiveOverrides(value)) {
                const declarations = styleOverrides.get(breakpointKey) ?? [];
                declarations.push(`${cssProperty}: ${String(breakpointValue)} !important`);
                styleOverrides.set(breakpointKey, declarations);
            }
        }

        const bottomSpacingValue = variantStyles.bottomSpacing;
        if (bottomSpacingValue !== undefined) {
            for (const { breakpointKey, value: breakpointValue } of getResponsiveOverrides(bottomSpacingValue)) {
                const declarations = spacingOverrides.get(breakpointKey) ?? [];
                declarations.push(`padding-bottom: ${String(breakpointValue)} !important`);
                spacingOverrides.set(breakpointKey, declarations);
            }
        }

        for (const [breakpointKey, declarations] of styleOverrides) {
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

        for (const [breakpointKey, declarations] of spacingOverrides) {
            const breakpoint = theme.breakpoints[breakpointKey];
            if (!breakpoint) {
                continue;
            }

            cssChunks.push(css`
                ${breakpoint.belowMediaQuery} {
                    ${options.spacingSelector(variantName)} {
                        ${declarations.join(";\n")}
                    }
                }
            `);
        }
    }

    return cssChunks.join("\n");
}
