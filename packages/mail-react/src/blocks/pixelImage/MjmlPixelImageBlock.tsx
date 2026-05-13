import { type IMjmlImageProps, MjmlImage } from "@faire/mjml-react";
import clsx from "clsx";
import type { ReactNode } from "react";

import { registerStyles } from "../../styles/registerStyles.js";
import { css } from "../../utils/css.js";
import type { PixelImageBlockBaseProps } from "./common.js";
import { usePixelImageBlockData } from "./usePixelImageBlockData.js";

export type MjmlPixelImageBlockProps = Omit<IMjmlImageProps, "src" | "width" | "height"> & PixelImageBlockBaseProps;

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
    const imageData = usePixelImageBlockData({ data, defaultRenderWidth: width, largestPossibleRenderWidth, aspectRatio });

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
