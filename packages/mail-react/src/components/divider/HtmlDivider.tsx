import clsx from "clsx";
import type { CSSProperties, ReactNode } from "react";

import { registerStyles } from "../../styles/registerStyles.js";
import { getDefaultOrUndefined } from "../../theme/responsiveValue.js";
import { useTheme } from "../../theme/ThemeProvider.js";
import type { DividerVariantStyles, Theme } from "../../theme/themeTypes.js";
import type { DividerProps } from "./common.js";
import { generateResponsiveDividerCss } from "./dividerStyles.js";

// U+200B keeps the cell from collapsing in clients that drop empty <td>s,
// without contributing visible width.
const zeroWidthSpace = String.fromCharCode(0x200b);

export type HtmlDividerProps = DividerProps;

/**
 * Themed divider for use inside MJML ending tags or outside of the MJML context.
 */
export function HtmlDivider({
    variant: variantProp,
    height: heightProp,
    backgroundColor: backgroundColorProp,
    backgroundImage: backgroundImageProp,
    className,
    style,
}: HtmlDividerProps): ReactNode {
    const theme = useTheme();

    const { defaultVariant, variants, ...baseStyles } = theme.divider;
    const activeVariant = variantProp ?? defaultVariant;
    const variantStyles = activeVariant ? variants?.[activeVariant] : undefined;

    const mergedStyles: DividerVariantStyles = variantStyles ? { ...baseStyles, ...variantStyles } : baseStyles;

    const height = heightProp ?? getDefaultOrUndefined(mergedStyles.height);
    const backgroundColor = backgroundColorProp ?? getDefaultOrUndefined(mergedStyles.backgroundColor);
    const backgroundImage = backgroundImageProp ?? getDefaultOrUndefined(mergedStyles.backgroundImage);

    const dividerStyle: CSSProperties = {
        height,
        lineHeight: height === undefined ? undefined : `${height}px`,
        fontSize: 0,
        backgroundColor,
        backgroundImage,
        ...{ msoLineHeightRule: "exactly" },
        ...style,
    };

    return (
        <table
            role="presentation"
            cellPadding={0}
            cellSpacing={0}
            border={0}
            width="100%"
            className={clsx("htmlDivider", activeVariant && `htmlDivider--${activeVariant}`, className)}
        >
            <tbody>
                <tr>
                    <td {...{ bgcolor: backgroundColor }} height={height} style={dividerStyle}>
                        {zeroWidthSpace}
                    </td>
                </tr>
            </tbody>
        </table>
    );
}

export function generateHtmlDividerStyles(theme: Theme): string {
    return generateResponsiveDividerCss(theme, {
        styleSelector: (variantName) => `.htmlDivider--${variantName} td`,
    });
}

registerStyles(generateHtmlDividerStyles);
