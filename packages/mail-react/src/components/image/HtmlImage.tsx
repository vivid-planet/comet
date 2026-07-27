import clsx from "clsx";
import type { ComponentProps, ReactNode } from "react";

import { registerStyles } from "../../styles/registerStyles.js";
import { css } from "../../utils/css.js";

export type HtmlImageProps = ComponentProps<"img">;

/**
 * Renders an `<img>` tag that adapts to its container width below the default
 * breakpoint.
 *
 * Use within raw HTML context — HTML-only emails or
 * [MJML ending tags](https://documentation.mjml.io/#ending-tags) like `MjmlRaw`.
 * For MJML context, use `MjmlImage`.
 */
export function HtmlImage({ className, ...restProps }: HtmlImageProps): ReactNode {
    return <img className={clsx("htmlImage", className)} {...restProps} />;
}

registerStyles(
    (theme) => css`
        ${theme.breakpoints.default.belowMediaQuery} {
            .htmlImage {
                width: 100%;
                height: auto;
            }
        }
    `,
);
