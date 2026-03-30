import clsx from "clsx";
import type { CSSProperties, ReactNode, TdHTMLAttributes } from "react";

import { registerStyles } from "../../styles/registerStyles.js";
import { getDefaultOrUndefined } from "../../theme/responsiveValue.js";
import { useTheme } from "../../theme/ThemeProvider.js";
import type { TextVariantStyles, Theme, VariantName } from "../../theme/themeTypes.js";
import { generateResponsiveTextCss } from "./textStyles.js";

export type HtmlTextProps = TdHTMLAttributes<HTMLTableCellElement> & {
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

/** Themed text component that renders a `<td>` with inline styles, for use inside MJML ending tags, or outside of the MJML context. */
export function HtmlText({ variant: variantProp, bottomSpacing, className, style, children, ...restProps }: HtmlTextProps): ReactNode {
    const theme = useTheme();

    const { defaultVariant, variants, ...baseStyles } = theme.text;
    const activeVariant = variantProp ?? defaultVariant;
    const variantStyles = activeVariant ? variants?.[activeVariant] : undefined;

    const mergedStyles: TextVariantStyles = variantStyles ? { ...baseStyles, ...variantStyles } : baseStyles;

    const themeStyle: CSSProperties = {
        fontFamily: getDefaultOrUndefined(mergedStyles.fontFamily),
        fontSize: getDefaultOrUndefined(mergedStyles.fontSize),
        fontWeight: getDefaultOrUndefined(mergedStyles.fontWeight),
        fontStyle: getDefaultOrUndefined(mergedStyles.fontStyle),
        lineHeight: getDefaultOrUndefined(mergedStyles.lineHeight),
        letterSpacing: getDefaultOrUndefined(mergedStyles.letterSpacing),
        textDecoration: getDefaultOrUndefined(mergedStyles.textDecoration),
        textTransform: getDefaultOrUndefined(mergedStyles.textTransform),
        color: getDefaultOrUndefined(mergedStyles.color),
        ...(getDefaultOrUndefined(mergedStyles.lineHeight) !== undefined && { msoLineHeightRule: "exactly" }),
        ...(bottomSpacing && { paddingBottom: getDefaultOrUndefined(mergedStyles.bottomSpacing) }),
    };

    return (
        <td
            className={clsx("htmlText", activeVariant && `htmlText--${activeVariant}`, bottomSpacing && "htmlText--bottomSpacing", className)}
            style={{ ...themeStyle, ...style }}
            {...restProps}
        >
            {children}
        </td>
    );
}

function generateHtmlTextStyles(theme: Theme): string {
    return generateResponsiveTextCss(theme, {
        styleSelector: (variantName) => `.htmlText--${variantName}`,
        spacingSelector: (variantName) => `.htmlText--bottomSpacing.htmlText--${variantName}`,
    });
}

registerStyles(generateHtmlTextStyles);
