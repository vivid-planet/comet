import clsx from "clsx";
import type { PropsWithChildren, ReactNode } from "react";

import { HtmlText } from "../../components/text/HtmlText.js";
import { MjmlText } from "../../components/text/MjmlText.js";
import type { TextStyles, VariantName } from "../../theme/themeTypes.js";

/**
 * Styling for one rendered text block, applied on top of the base theme text styles.
 *
 * Style props accept plain values only. For responsive styling, use a theme
 * variant, or set a `className` and register responsive CSS via `registerStyles`.
 */
export type BlockTextStyleProps = Omit<TextStyles, "bottomSpacing"> & {
    /**
     * The text component's variant to apply, as defined in the theme.
     *
     * @defaultValue The theme's `text.defaultVariant`, when set
     */
    variant?: VariantName;
    className?: string;
};

export type BlockTextProps = PropsWithChildren<
    BlockTextStyleProps & {
        /** Whether the theme's spacing below the text applies — set for every block except the last. */
        bottomSpacing: boolean;
    }
>;

export function createBlockTextComponents(baseClassName: string): {
    MjmlBlockText: (props: BlockTextProps) => ReactNode;
    HtmlBlockText: (props: BlockTextProps) => ReactNode;
} {
    function MjmlBlockText({ bottomSpacing, variant, className, fontWeight, children, ...styleProps }: BlockTextProps): ReactNode {
        return (
            <MjmlText
                variant={variant}
                bottomSpacing={bottomSpacing}
                className={clsx(baseClassName, className)}
                // Spread conditionally: MjmlText spreads explicit props after the theme-resolved variant
                // props, so an explicit `fontWeight={undefined}` would erase the variant's value.
                {...(fontWeight !== undefined && { fontWeight: String(fontWeight) })}
                {...styleProps}
            >
                {children}
            </MjmlText>
        );
    }

    function HtmlBlockText({ bottomSpacing, variant, className, children, ...styleProps }: BlockTextProps): ReactNode {
        return (
            <HtmlText element="div" variant={variant} bottomSpacing={bottomSpacing} className={clsx(baseClassName, className)} style={styleProps}>
                {children}
            </HtmlText>
        );
    }

    return { MjmlBlockText, HtmlBlockText };
}
