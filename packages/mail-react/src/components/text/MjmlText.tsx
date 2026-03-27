import { type IMjmlTextProps, MjmlText as BaseMjmlText } from "@faire/mjml-react";
import clsx from "clsx";
import type { ReactNode } from "react";

import { registerStyles } from "../../styles/registerStyles.js";
import { getDefaultOrUndefined, getResponsiveOverrides, type ResponsiveValue } from "../../theme/responsiveValue.js";
import { useTheme } from "../../theme/ThemeProvider.js";
import type { TextVariantStyles, Theme, ThemeBreakpoints, VariantName } from "../../theme/themeTypes.js";
import { css } from "../../utils/css.js";

export type MjmlTextProps = IMjmlTextProps & {
    /**
     * The component's variant to apply, as defined in the theme.
     *
     * Custom variants should be defined in the theme, through module augmentation.
     *
     * ```ts
     * declare module "@comet/mail-react" {
     *     interface TextVariants { heading: true; body: true }
     * }
     * ```
     *
     * ```ts
     * const theme = createTheme({
     *     text: {
     *         variants: {
     *             heading: { fontSize: "24px" },
     *             body: { fontSize: "16px" },
     *         },
     *     },
     * });
     */
    variant?: VariantName;
    /** When true, applies spacing below the text. */
    bottomSpacing?: boolean;
};

/**
 * Text component that can be styled using the theme, optionally, using a variant.
 */
export function MjmlText({ variant: variantProp, bottomSpacing, className, ...restProps }: MjmlTextProps): ReactNode {
    const theme = useTheme();

    const { defaultVariant, variants, ...baseStyles } = theme.text;
    const activeVariant = variantProp ?? defaultVariant;
    const variantStyles = activeVariant ? variants?.[activeVariant] : undefined;

    const mergedStyles: TextVariantStyles = variantStyles ? { ...baseStyles, ...variantStyles } : baseStyles;

    const fontWeightDefault = getDefaultOrUndefined(mergedStyles.fontWeight);

    const resolvedClassName = clsx("mjmlText", activeVariant && `mjmlText--${activeVariant}`, bottomSpacing && "mjmlText--bottomSpacing", className);

    return (
        <BaseMjmlText
            fontFamily={getDefaultOrUndefined(mergedStyles.fontFamily)}
            fontSize={getDefaultOrUndefined(mergedStyles.fontSize)}
            fontWeight={fontWeightDefault !== undefined ? String(fontWeightDefault) : undefined}
            fontStyle={getDefaultOrUndefined(mergedStyles.fontStyle)}
            lineHeight={getDefaultOrUndefined(mergedStyles.lineHeight)}
            letterSpacing={getDefaultOrUndefined(mergedStyles.letterSpacing)}
            textDecoration={getDefaultOrUndefined(mergedStyles.textDecoration)}
            textTransform={getDefaultOrUndefined(mergedStyles.textTransform)}
            color={getDefaultOrUndefined(mergedStyles.color)}
            paddingBottom={bottomSpacing ? getDefaultOrUndefined(mergedStyles.bottomSpacing) : undefined}
            className={resolvedClassName}
            {...restProps}
        />
    );
}

function collectOverride<T>(
    overrides: Map<keyof ThemeBreakpoints, string[]>,
    value: ResponsiveValue<T> | undefined,
    cssProperty: string,
    formatValue: (v: T) => string,
): void {
    if (value === undefined) return;

    for (const { breakpointKey, value: breakpointValue } of getResponsiveOverrides(value)) {
        const declarations = overrides.get(breakpointKey) ?? [];
        declarations.push(`${cssProperty}: ${formatValue(breakpointValue)} !important`);
        overrides.set(breakpointKey, declarations);
    }
}

export function generateTextStyles(theme: Theme): string {
    const { variants } = theme.text;
    if (!variants) return css``;

    const cssChunks: string[] = [];

    for (const [variantName, variantStyles] of Object.entries(variants)) {
        if (!variantStyles) continue;

        const styleOverrides = new Map<keyof ThemeBreakpoints, string[]>();
        const spacingOverrides = new Map<keyof ThemeBreakpoints, string[]>();

        collectOverride(styleOverrides, variantStyles.fontFamily, "font-family", String);
        collectOverride(styleOverrides, variantStyles.fontSize, "font-size", String);
        collectOverride(styleOverrides, variantStyles.fontWeight, "font-weight", String);
        collectOverride(styleOverrides, variantStyles.fontStyle, "font-style", String);
        collectOverride(styleOverrides, variantStyles.lineHeight, "line-height", String);
        collectOverride(styleOverrides, variantStyles.letterSpacing, "letter-spacing", String);
        collectOverride(styleOverrides, variantStyles.textDecoration, "text-decoration", String);
        collectOverride(styleOverrides, variantStyles.textTransform, "text-transform", String);
        collectOverride(styleOverrides, variantStyles.color, "color", String);
        collectOverride(spacingOverrides, variantStyles.bottomSpacing, "padding-bottom", (v) => `${v}px`);

        for (const [breakpointKey, declarations] of styleOverrides) {
            const breakpoint = theme.breakpoints[breakpointKey];
            if (!breakpoint) continue;

            cssChunks.push(css`
                ${breakpoint.belowMediaQuery} {
                    .mjmlText--${variantName} > div {
                        ${declarations.join(";\n")}
                    }
                }
            `);
        }

        for (const [breakpointKey, declarations] of spacingOverrides) {
            const breakpoint = theme.breakpoints[breakpointKey];
            if (!breakpoint) continue;

            cssChunks.push(css`
                ${breakpoint.belowMediaQuery} {
                    .mjmlText--bottomSpacing.mjmlText--${variantName} {
                        ${declarations.join(";\n")}
                    }
                }
            `);
        }
    }

    return cssChunks.join("\n");
}

registerStyles(generateTextStyles);
