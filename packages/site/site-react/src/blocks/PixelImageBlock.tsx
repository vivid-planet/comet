"use client";
// eslint-disable-next-line no-restricted-imports

import { type PixelImageBlockData } from "../blocks.generated";
import { withPreview } from "../iframebridge/withPreview";
import { type ImageProps, calculateInheritAspectRatio, Image, parseAspectRatio } from "../image/Image";
import { PreviewSkeleton } from "../previewskeleton/PreviewSkeleton";
import { type PropsWithData } from "./PropsWithData";

interface PixelImageBlockProps extends PropsWithData<PixelImageBlockData>, Omit<ImageProps, "src" | "width" | "height" | "alt" | "aspectRatio"> {
    aspectRatio: string | number | "inherit";
    /**
     * Do not set an `alt` attribute. The alt text is set in the DAM.
     */
    alt?: never;
}

export const PixelImageBlock = withPreview(
    ({ aspectRatio, data: { damFile, cropArea, urlTemplate }, ...imageProps }: PixelImageBlockProps) => {
        if (!damFile || !damFile.image) return <PreviewSkeleton type="media" hasContent={false} aspectRatio={aspectRatio} />;

        // If we have a crop area set, DAM setting are overwritten, so we use that
        const usedCropArea = cropArea ?? damFile.image.cropArea;

        let usedAspectRatio: number;

        if (aspectRatio === "inherit") {
            usedAspectRatio = calculateInheritAspectRatio(damFile.image, usedCropArea);
        } else {
            usedAspectRatio = parseAspectRatio(aspectRatio);
        }

        const width = cropArea?.width ?? damFile.image.cropArea.width ?? damFile.image.width;

        return (
            <Image
                src={urlTemplate}
                style={{ objectFit: "cover" }}
                aspectRatio={usedAspectRatio}
                width={width}
                alt={damFile.altText ?? ""}
                {...imageProps}
            />
        );
    },
    { label: "PixelImage" },
);
