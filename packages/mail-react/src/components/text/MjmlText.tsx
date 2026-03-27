import { type IMjmlTextProps, MjmlText as BaseMjmlText } from "@faire/mjml-react";
import clsx from "clsx";
import type { ReactNode } from "react";

import { registerStyles } from "../../styles/registerStyles.js";
import { getDefaultValue, getResponsiveOverrides } from "../../theme/responsiveValue.js";
import { useTheme } from "../../theme/ThemeProvider.js";
import type { TextVariants, TextVariantStyles, ThemeText } from "../../theme/themeTypes.js";
import { css } from "../../utils/css.js";

/** Props for the themed `MjmlText` component. */
export type MjmlTextProps = IMjmlTextProps & {
    /** Text variant to apply from the theme. */
    variant?: keyof TextVariants;
    /** When true, applies the theme's `bottomSpacing` as `paddingBottom`. */
    bottomSpacing?: boolean;
};

const textStyleKeys = [
    "fontFamily",
    "fontSize",
    "fontWeight",
    "fontStyle",
    "lineHeight",
    "letterSpacing",
    "textDecoration",
    "textTransform",
    "color",
] as const;

type TextStyleKey = (typeof textStyleKeys)[number];

/** Maps a TextVariantStyles key to the corresponding CSS property name. */
function cssPropertyName(key: TextStyleKey | "bottomSpacing"): string {
    if (key === "bottomSpacing") return "padding-bottom";
    // Convert camelCase to kebab-case
    return key.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`);
}

/** Formats a value for CSS output, appending "px" to numeric bottomSpacing. */
function cssValue(key: TextStyleKey | "bottomSpacing", value: string | number): string {
    if (key === "bottomSpacing") return `${value}px`;
    return String(value);
}

/**
 * Merges base text styles with variant styles (variant wins per key).
 * Contains the unavoidable `as any` casts for dynamic key assignment —
 * safe because keys come from the `textStyleKeys` const array.
 */
function mergeTextStyles(base: ThemeText, variant: TextVariantStyles | undefined): TextVariantStyles {
    const merged: Record<string, unknown> = {};
    for (const key of textStyleKeys) {
        const val = variant?.[key] ?? base[key];
        if (val !== undefined) {
            merged[key] = val;
        }
    }
    const bottomSpacing = variant?.bottomSpacing ?? base.bottomSpacing;
    if (bottomSpacing !== undefined) {
        merged.bottomSpacing = bottomSpacing;
    }
    return merged as TextVariantStyles;
}

/** Resolves a variant name from the theme, returning the variant styles if found. */
function resolveVariant(themeText: ThemeText, variant: keyof TextVariants | undefined): { name: string; styles: TextVariantStyles } | undefined {
    const name = variant ?? (themeText.defaultVariant as string | undefined);
    if (!name || !themeText.variants) return undefined;
    const styles = (themeText.variants as Record<string, TextVariantStyles>)[name];
    return styles ? { name, styles } : undefined;
}

interface ResolvedTextStyles {
    props: Partial<Pick<IMjmlTextProps, TextStyleKey | "paddingBottom">>;
    variant: string | undefined;
    bottomSpacingActive: boolean;
}

/**
 * Resolves theme text styles into props for the base MjmlText component.
 * Exported only for testing — not part of the public API.
 */
export function resolveTextStyles(
    themeText: ThemeText,
    variant: keyof TextVariants | undefined,
    bottomSpacing: boolean | undefined,
): ResolvedTextStyles {
    const resolved = resolveVariant(themeText, variant);
    const merged = mergeTextStyles(themeText, resolved?.styles);

    // Extract default values as props
    const props: ResolvedTextStyles["props"] = {};
    for (const key of textStyleKeys) {
        const val = merged[key];
        if (val !== undefined) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (props as any)[key] = getDefaultValue(val as any);
        }
    }

    // Apply bottomSpacing as paddingBottom when the prop is true
    const bottomSpacingActive = bottomSpacing === true && merged.bottomSpacing !== undefined;
    if (bottomSpacingActive) {
        props.paddingBottom = getDefaultValue(merged.bottomSpacing);
    }

    return { props, variant: resolved?.name, bottomSpacingActive };
}

/**
 * A themed `MjmlText` component that applies typography styles from the theme.
 *
 * Supports optional `variant` for predefined text styles and `bottomSpacing`
 * for theme-controlled bottom padding. All base `MjmlText` props are forwarded.
 */
export function MjmlText({ variant, bottomSpacing, className, ...props }: MjmlTextProps): ReactNode {
    const theme = useTheme();
    const resolved = resolveTextStyles(theme.text, variant, bottomSpacing);

    const resolvedClassName = clsx(
        "mjmlText",
        resolved.variant && `mjmlText--${resolved.variant}`,
        resolved.bottomSpacingActive && "mjmlText--bottomSpacing",
        className,
    );

    return <BaseMjmlText {...resolved.props} cssClass={resolvedClassName} {...props} />;
}

registerStyles((theme) => {
    const { variants } = theme.text;
    if (!variants) return css``;

    const rules: string[] = [];

    for (const [variantName, variantStyles] of Object.entries(variants) as Array<[string, TextVariantStyles]>) {
        if (!variantStyles) continue;

        const merged = mergeTextStyles(theme.text, variantStyles);

        // Emit responsive overrides for each style key
        for (const key of textStyleKeys) {
            const val = merged[key];
            if (val === undefined) continue;
            const overrides = getResponsiveOverrides<string | number>(val);
            for (const override of overrides) {
                const breakpoint = theme.breakpoints[override.breakpointKey];
                if (!breakpoint) continue;
                const declaration = `${cssPropertyName(key)}: ${cssValue(key, override.value)} !important;`;
                rules.push(css`
                    ${breakpoint.belowMediaQuery} {
                        .mjmlText--${variantName} > div {
                            ${declaration}
                        }
                    }
                `);
            }
        }

        // Emit responsive overrides for bottomSpacing
        if (merged.bottomSpacing !== undefined) {
            const overrides = getResponsiveOverrides(merged.bottomSpacing);
            for (const override of overrides) {
                const breakpoint = theme.breakpoints[override.breakpointKey];
                if (!breakpoint) continue;
                rules.push(css`
                    ${breakpoint.belowMediaQuery} {
                        .mjmlText--bottomSpacing.mjmlText--${variantName} {
                            padding-bottom: ${override.value}px !important;
                        }
                    }
                `);
            }
        }
    }

    return rules.join("\n");
});
