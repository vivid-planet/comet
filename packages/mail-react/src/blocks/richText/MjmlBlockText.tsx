import clsx from "clsx";
import type { ReactNode } from "react";

import { MjmlText } from "../../components/text/MjmlText.js";
import type { BlockTextProps } from "./common.js";

/**
 * Renders a single draft block as `MjmlText`. Pass to
 * `createRichTextBlockRenderer` as `blockTextComponent` for MJML context; the
 * resulting block must be placed within an `MjmlColumn`.
 */
export function MjmlBlockText({ bottomSpacing, variant, className, fontWeight, children, ...styleProps }: BlockTextProps): ReactNode {
    return (
        <MjmlText
            variant={variant}
            bottomSpacing={bottomSpacing}
            className={clsx("richTextBlock__text", className)}
            // Spread conditionally: MjmlText spreads explicit props after the theme-resolved variant
            // props, so an explicit `fontWeight={undefined}` would erase the variant's value.
            {...(fontWeight !== undefined && { fontWeight: String(fontWeight) })}
            {...styleProps}
        >
            {children}
        </MjmlText>
    );
}
