import clsx from "clsx";
import type { ComponentProps, ReactNode } from "react";

import type { PixelImageBlockData } from "../../blocks.generated.js";
import { registerStyles } from "../../styles/registerStyles.js";
import { css } from "../../utils/css.js";
import { usePixelImageData } from "./usePixelImageData.js";

export type HtmlPixelImageBlockProps = Omit<ComponentProps<"img">, "src" | "width" | "height"> & {
    /** The block data to render. */
    data: PixelImageBlockData;
    /** Width at which the image is rendered, in the default/desktop breakpoint. */
    width: number;
    /**
     * Largest possible width the image can be rendered at across breakpoints.
     * Defaults to `theme.sizes.bodyWidth`. Use this when the image can stretch
     * wider on a narrower breakpoint than its desktop render width.
     */
    largestPossibleRenderWidth?: number;
    /**
     * Aspect ratio for the rendered image.
     * @example "16x9"
     */
    aspectRatio?: number | string;
};

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
    const imageData = usePixelImageData({ data, defaultRenderWidth: width, largestPossibleRenderWidth, aspectRatio });

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
