import { getResponsiveOverrides } from "../../theme/responsiveValue.js";
import type { ButtonVariantStyles, Theme, ThemeBreakpoints } from "../../theme/themeTypes.js";
import { css } from "../../utils/css.js";

const buttonCssProperties: ReadonlyArray<[keyof ButtonVariantStyles, string]> = [
    ["color", "color"],
    ["backgroundColor", "background-color"],
    ["backgroundImage", "background-image"],
    ["border", "border"],
    ["borderRadius", "border-radius"],
    ["fontFamily", "font-family"],
    ["fontSize", "font-size"],
    ["fontWeight", "font-weight"],
    ["lineHeight", "line-height"],
    ["padding", "padding"],
];

interface GenerateResponsiveButtonCssOptions {
    /** Selector for variant style overrides, given a variant name. */
    styleSelector: (variantName: string) => string;
}

/** Generates responsive CSS media queries for button variant overrides. */
export function generateResponsiveButtonCss(theme: Theme, options: GenerateResponsiveButtonCssOptions): string {
    const { variants } = theme.button;
    if (!variants) {
        return css``;
    }

    const cssChunks: string[] = [];

    for (const [variantName, variantStyles] of Object.entries(variants)) {
        if (!variantStyles) {
            continue;
        }

        const overrides = new Map<keyof ThemeBreakpoints, string[]>();

        for (const [themeKey, cssProperty] of buttonCssProperties) {
            const value = variantStyles[themeKey];
            if (value === undefined) {
                continue;
            }

            for (const { breakpointKey, value: breakpointValue } of getResponsiveOverrides(value)) {
                const declarations = overrides.get(breakpointKey) ?? [];
                declarations.push(`${cssProperty}: ${String(breakpointValue)} !important`);
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
