import type { PixelImageBlockData } from "../../blocks.generated.js";

export type PixelImageBlockBaseProps = {
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
    /**
     * Request the image in its original format instead of a modern format like WebP.
     * Originals that aren't JPEG, PNG or GIF are delivered as JPEG.
     *
     * By default, the API delivers a modern format when the `Accept` header of the image request allows it.
     * In emails, an image proxy often makes that request, not the email client that displays the image.
     */
    disableModernImageFormats?: boolean;
};
