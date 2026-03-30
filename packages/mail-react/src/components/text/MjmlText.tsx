import { type IMjmlTextProps, MjmlText as BaseMjmlText } from "@faire/mjml-react";
import clsx from "clsx";
import type { ReactNode } from "react";

import { registerStyles } from "../../styles/registerStyles.js";
import { getDefaultOrUndefined } from "../../theme/responsiveValue.js";
import { useOptionalTheme } from "../../theme/ThemeProvider.js";
import { type TextVariantStyles, type Theme, type VariantName } from "../../theme/themeTypes.js";
import { generateResponsiveTextCss } from "./textStyles.js";

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
 * Text component that can be styled using the theme, optionally using a variant.
 *
 * Works without a `ThemeProvider` as a plain pass-through to the base MJML text component.
 * The `variant` and `bottomSpacing` props require a `ThemeProvider` (or `MjmlMailRoot`).
 */
export function MjmlText({ variant: variantProp, bottomSpacing, className, ...restProps }: MjmlTextProps): ReactNode {
    const theme = useOptionalTheme();

    const themedProps = getThemedProps(theme, variantProp, bottomSpacing);

    const resolvedClassName = clsx(
        "mjmlText",
        themedProps.activeVariant && `mjmlText--${themedProps.activeVariant}`,
        bottomSpacing && "mjmlText--bottomSpacing",
        className,
    );

    return <BaseMjmlText {...themedProps.baseProps} className={resolvedClassName} {...restProps} />;
}

function getThemedProps(
    theme: Theme | null,
    variantProp: VariantName | undefined,
    bottomSpacing: boolean | undefined,
): { activeVariant: VariantName | undefined; baseProps: Partial<IMjmlTextProps> } {
    if (theme === null) {
        if (variantProp !== undefined) {
            throw new Error("The `variant` prop requires being wrapped in a ThemeProvider or MjmlMailRoot.");
        }
        if (bottomSpacing) {
            throw new Error("The `bottomSpacing` prop requires being wrapped in a ThemeProvider or MjmlMailRoot.");
        }
        return { activeVariant: undefined, baseProps: {} };
    }

    const { defaultVariant, variants, ...baseStyles } = theme.text;
    const activeVariant = variantProp ?? defaultVariant;
    const variantStyles = activeVariant ? variants?.[activeVariant] : undefined;

    const mergedStyles: TextVariantStyles = variantStyles ? { ...baseStyles, ...variantStyles } : baseStyles;

    const fontWeightDefault = getDefaultOrUndefined(mergedStyles.fontWeight);

    return {
        activeVariant,
        baseProps: {
            fontFamily: getDefaultOrUndefined(mergedStyles.fontFamily),
            fontSize: getDefaultOrUndefined(mergedStyles.fontSize),
            fontWeight: fontWeightDefault !== undefined ? String(fontWeightDefault) : undefined,
            fontStyle: getDefaultOrUndefined(mergedStyles.fontStyle),
            lineHeight: getDefaultOrUndefined(mergedStyles.lineHeight),
            letterSpacing: getDefaultOrUndefined(mergedStyles.letterSpacing),
            textDecoration: getDefaultOrUndefined(mergedStyles.textDecoration),
            textTransform: getDefaultOrUndefined(mergedStyles.textTransform),
            color: getDefaultOrUndefined(mergedStyles.color),
            paddingBottom: bottomSpacing ? getDefaultOrUndefined(mergedStyles.bottomSpacing) : undefined,
        },
    };
}

export function generateTextStyles(theme: Theme): string {
    return generateResponsiveTextCss(theme, {
        styleSelector: (variantName) => `.mjmlText--${variantName} > div`,
        spacingSelector: (variantName) => `.mjmlText--bottomSpacing.mjmlText--${variantName}`,
    });
}

registerStyles(generateTextStyles);
