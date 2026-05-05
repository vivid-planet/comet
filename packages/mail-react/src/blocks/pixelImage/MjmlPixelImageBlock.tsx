import { type IMjmlImageProps, MjmlImage } from "@faire/mjml-react";
import clsx from "clsx";
import type { ReactNode } from "react";

import type { PixelImageBlockData } from "../../blocks.generated.js";
import { registerStyles } from "../../styles/registerStyles.js";
import { css } from "../../utils/css.js";
import { usePixelImageData } from "./usePixelImageData.js";

export type MjmlPixelImageBlockProps = Omit<IMjmlImageProps, "src" | "width" | "height"> & {
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
 * Renders a pixel-image from the DAM as `MjmlImage`. Must be placed within an
 * `MjmlColumn`. For raw HTML context, use `HtmlPixelImageBlock`.
 */
export function MjmlPixelImageBlock({
    data,
    width,
    largestPossibleRenderWidth,
    aspectRatio,
    className,
    ...imageProps
}: MjmlPixelImageBlockProps): ReactNode {
    const imageData = usePixelImageData({ data, defaultRenderWidth: width, largestPossibleRenderWidth, aspectRatio });

    if (!imageData) {
        return null;
    }

    return (
        <MjmlImage
            src={imageData.imageUrl}
            width={imageData.defaultRenderWidth}
            height={imageData.desktopImageHeight}
            alt={imageData.alt}
            title={imageData.title}
            className={clsx("mjmlPixelImageBlock", className)}
            {...imageProps}
        />
    );
}

registerStyles(
    (theme) => css`
        ${theme.breakpoints.default.belowMediaQuery} {
            .mjmlPixelImageBlock img {
                height: auto !important;
            }
        }
    `,
);
