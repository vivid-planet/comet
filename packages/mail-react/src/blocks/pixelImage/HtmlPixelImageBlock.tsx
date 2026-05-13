import clsx from "clsx";
import type { ComponentProps, ReactNode } from "react";

import { registerStyles } from "../../styles/registerStyles.js";
import { css } from "../../utils/css.js";
import type { PixelImageBlockBaseProps } from "./common.js";
import { usePixelImageBlockData } from "./usePixelImageBlockData.js";

export type HtmlPixelImageBlockProps = Omit<ComponentProps<"img">, "src" | "width" | "height"> & PixelImageBlockBaseProps;

/**
 * Renders a pixel-image from the DAM as a raw `<img>` tag.
 *
 * Use within raw HTML context — HTML-only emails or
 * [MJML ending tags](https://documentation.mjml.io/#ending-tags) like `MjmlRaw`.
 * For MJML context, use `MjmlPixelImageBlock`.
 */
export function HtmlPixelImageBlock({
    data,
    width,
    largestPossibleRenderWidth,
    aspectRatio,
    className,
    ...imgProps
}: HtmlPixelImageBlockProps): ReactNode {
    const imageData = usePixelImageBlockData({ data, defaultRenderWidth: width, largestPossibleRenderWidth, aspectRatio });

    if (!imageData) {
        return null;
    }

    return (
        <img
            src={imageData.imageUrl}
            width={imageData.defaultRenderWidth}
            height={imageData.desktopImageHeight}
            alt={imageData.alt}
            title={imageData.title}
            className={clsx("htmlPixelImageBlock", className)}
            {...imgProps}
        />
    );
}

registerStyles(
    (theme) => css`
        ${theme.breakpoints.default.belowMediaQuery} {
            .htmlPixelImageBlock {
                width: 100%;
                height: auto;
            }
        }
    `,
);
