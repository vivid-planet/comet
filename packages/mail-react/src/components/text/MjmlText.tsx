import { type IMjmlTextProps, MjmlText as BaseMjmlText } from "@faire/mjml-react";
import clsx from "clsx";
import type { ReactNode } from "react";

import { registerStyles } from "../../styles/registerStyles.js";
import { getDefaultValue, getResponsiveOverrides } from "../../theme/responsiveValue.js";
import { useTheme } from "../../theme/ThemeProvider.js";
import type { TextStyles, TextVariants, TextVariantStyles, ThemeText } from "../../theme/themeTypes.js";
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
    const activeVariant = variant ?? (themeText.defaultVariant as string | undefined);
    const variantStyles: TextVariantStyles | undefined =
        activeVariant && themeText.variants ? (themeText.variants as Record<string, TextVariantStyles>)[activeVariant] : undefined;

    // Merge base + variant (variant wins per key)
    const merged: TextVariantStyles = {};
    for (const key of textStyleKeys) {
        const baseVal = (themeText as TextStyles)[key];
        const variantVal = variantStyles?.[key];
        const val = variantVal ?? baseVal;
        if (val !== undefined) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (merged as any)[key] = val;
        }
    }
    // Handle bottomSpacing separately
    const mergedBottomSpacing = variantStyles?.bottomSpacing ?? themeText.bottomSpacing;
    if (mergedBottomSpacing !== undefined) {
        merged.bottomSpacing = mergedBottomSpacing;
    }

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

    return { props, variant: activeVariant, bottomSpacingActive };
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

        // Merge base + variant for responsive overrides
        const merged: TextVariantStyles = {};
        for (const key of textStyleKeys) {
            const baseVal = (theme.text as TextStyles)[key];
            const variantVal = variantStyles[key];
            const val = variantVal ?? baseVal;
            if (val !== undefined) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                (merged as any)[key] = val;
            }
        }
        if (variantStyles.bottomSpacing !== undefined || theme.text.bottomSpacing !== undefined) {
            merged.bottomSpacing = variantStyles.bottomSpacing ?? theme.text.bottomSpacing;
        }

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
                        .mjmlText--${variantName} {
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
