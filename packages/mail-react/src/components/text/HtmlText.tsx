import clsx from "clsx";
import { type ComponentPropsWithoutRef, type CSSProperties, type JSX, type ReactNode, type TdHTMLAttributes } from "react";

import { registerStyles } from "../../styles/registerStyles.js";
import { getDefaultOrUndefined } from "../../theme/responsiveValue.js";
import { useTheme } from "../../theme/ThemeProvider.js";
import type { TextVariantStyles, Theme, VariantName } from "../../theme/themeTypes.js";
import { generateResponsiveTextCss } from "./textStyles.js";

interface HtmlTextOwnProps {
    /**
     * The component's variant to apply, as defined in the theme.
     *
     * Custom variants should be defined in the theme through module augmentation:
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
}

interface HtmlTextImplementationProps extends HtmlTextOwnProps {
    component?: keyof JSX.IntrinsicElements;
    className?: string;
    style?: CSSProperties;
    children?: ReactNode;
    [key: string]: unknown;
}

export type HtmlTextProps<C extends keyof JSX.IntrinsicElements = "td"> = HtmlTextOwnProps & {
    /**
     * The HTML element to render instead of the default `<td>`.
     *
     * @example
     * ```tsx
     * <HtmlText component="div">Rendered as a div</HtmlText>
     * <HtmlText component="a" href="/link">Rendered as an anchor</HtmlText>
     * ```
     */
    component?: C;
} & Omit<ComponentPropsWithoutRef<C>, keyof HtmlTextOwnProps | "component">;

/**
 * Themed text component for use inside MJML ending tags or outside of the MJML context.
 */
export function HtmlText<C extends keyof JSX.IntrinsicElements>(
    props: HtmlTextOwnProps & { component: C } & Omit<ComponentPropsWithoutRef<C>, keyof HtmlTextOwnProps | "component">,
): ReactNode;
export function HtmlText(props: HtmlTextOwnProps & Omit<TdHTMLAttributes<HTMLTableCellElement>, keyof HtmlTextOwnProps>): ReactNode;
export function HtmlText({
    component: Component = "td",
    variant: variantProp,
    bottomSpacing,
    className,
    style,
    children,
    ...restProps
}: HtmlTextImplementationProps): ReactNode {
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
        <Component
            {...restProps}
            className={clsx("htmlText", activeVariant && `htmlText--${activeVariant}`, bottomSpacing && "htmlText--bottomSpacing", className)}
            style={{ ...themeStyle, ...style }}
        >
            {children}
        </Component>
    );
}

function generateHtmlTextStyles(theme: Theme): string {
    return generateResponsiveTextCss(theme, {
        styleSelector: (variantName) => `.htmlText--${variantName}`,
        spacingSelector: (variantName) => `.htmlText--bottomSpacing.htmlText--${variantName}`,
    });
}

registerStyles(generateHtmlTextStyles);
