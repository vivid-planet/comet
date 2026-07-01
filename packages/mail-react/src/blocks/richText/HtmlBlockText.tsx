import clsx from "clsx";
import type { ReactNode } from "react";

import { HtmlText } from "../../components/text/HtmlText.js";
import type { BlockTextProps } from "./common.js";

/**
 * Renders a single draft block as `HtmlText` (`<div>`). Pass to
 * `createRichTextBlockRenderer` as `blockTextComponent` for raw-HTML contexts
 * such as `MjmlRaw`.
 */
export function HtmlBlockText({ bottomSpacing, variant, className, children, ...styleProps }: BlockTextProps): ReactNode {
    return (
        <HtmlText element="div" variant={variant} bottomSpacing={bottomSpacing} className={clsx("richTextBlock__text", className)} style={styleProps}>
            {children}
        </HtmlText>
    );
}
