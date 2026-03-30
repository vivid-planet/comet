import clsx from "clsx";
import type { CSSProperties, ReactNode, TdHTMLAttributes } from "react";

import { registerStyles } from "../../styles/registerStyles.js";
import { getDefaultOrUndefined } from "../../theme/responsiveValue.js";
import { useTheme } from "../../theme/ThemeProvider.js";
import type { TextVariantStyles, Theme, VariantName } from "../../theme/themeTypes.js";
import { generateResponsiveTextCss, textStyleCssProperties } from "./textStyles.js";

export type HtmlTextProps = TdHTMLAttributes<HTMLTableCellElement> & {
    /**
     * The text variant to apply from the theme.
     *
     * Custom variants should be defined in the theme through module augmentation of `TextVariants`.
     */
    variant?: VariantName;
    /** When true, applies the theme's `bottomSpacing` as `paddingBottom`. */
    bottomSpacing?: boolean;
};

/**
 * Themed text component for use inside MJML ending tags (e.g., `MjmlRaw`) and custom HTML table layouts.
 *
 * Renders a `<td>` element with inline styles derived from the text theme.
 */
export function HtmlText({ variant: variantProp, bottomSpacing, className, style, children, ...restProps }: HtmlTextProps): ReactNode {
    const theme = useTheme();

    const { defaultVariant, variants, ...baseStyles } = theme.text;
    const activeVariant = variantProp ?? defaultVariant;
    const variantStyles = activeVariant ? variants?.[activeVariant] : undefined;

    const mergedStyles: TextVariantStyles = variantStyles ? { ...baseStyles, ...variantStyles } : baseStyles;

    const inlineStyles: CSSProperties & Record<string, string> = {};

    for (const [themeKey, cssProperty] of textStyleCssProperties) {
        const value = getDefaultOrUndefined(mergedStyles[themeKey]);
        if (value !== undefined) {
            inlineStyles[cssProperty] = String(value);
        }
    }

    if (bottomSpacing) {
        const spacingValue = getDefaultOrUndefined(mergedStyles.bottomSpacing);
        if (spacingValue !== undefined) {
            inlineStyles["padding-bottom"] = String(spacingValue);
        }
    }

    if (inlineStyles["line-height"] !== undefined) {
        inlineStyles["mso-line-height-rule"] = "exactly";
    }

    const resolvedClassName = clsx("htmlText", activeVariant && `htmlText--${activeVariant}`, bottomSpacing && "htmlText--bottomSpacing", className);

    return (
        <td className={resolvedClassName} style={{ ...inlineStyles, ...style }} {...restProps}>
            {children}
        </td>
    );
}

export function generateHtmlTextStyles(theme: Theme): string {
    return generateResponsiveTextCss(theme, {
        styleSelector: (variantName) => `.htmlText--${variantName}`,
        spacingSelector: (variantName) => `.htmlText--bottomSpacing.htmlText--${variantName}`,
    });
}

registerStyles(generateHtmlTextStyles);
