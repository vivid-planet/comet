// eslint-disable-next-line no-restricted-imports
import NextImage, { ImageProps } from "next/image";
import * as React from "react";

import { PixelImageBlockData } from "../blocks.generated";
import { withPreview } from "../iframebridge/withPreview";
import { calculateInheritAspectRatio, generateImageUrl, getMaxDimensionsFromArea, ImageDimensions, parseAspectRatio } from "../image/Image";
import { PreviewSkeleton } from "../previewskeleton/PreviewSkeleton";
import { PropsWithData } from "./PropsWithData";

interface PixelImageBlockProps extends PropsWithData<PixelImageBlockData>, Omit<ImageProps, "src" | "width" | "height"> {
    aspectRatio?: string | "inherit";
    layout: "fill" | "fixed" | "intrinsic" | "responsive";
    // Workaround to prevent flicker on already loaded images.
    // See https://github.com/vercel/next.js/issues/27539 for more information.
    disableBlurPlaceholder?: boolean;
}

export const PixelImageBlock = withPreview(
    ({
        aspectRatio = "16x9",
        data: { damFile, cropArea, urlTemplate },
        layout,
        disableBlurPlaceholder = false,
        ...nextImageProps
    }: PixelImageBlockProps) => {
        if (!damFile || !damFile.image) return <PreviewSkeleton type="media" hasContent={false} />;

        // If we have a crop area set, DAM setting are overwritten, so we use that
        const usedCropArea = cropArea ?? damFile.image.cropArea;

        let usedAspectRatio: number;

        if (aspectRatio === "inherit") {
            usedAspectRatio = calculateInheritAspectRatio(damFile.image, usedCropArea);
        } else {
            usedAspectRatio = parseAspectRatio(aspectRatio);
        }

        if (layout === "fill") {
            return (
                <NextImage
                    loader={(loaderProps) => generateImageUrl(loaderProps, usedAspectRatio)}
                    src={urlTemplate}
                    layout="fill"
                    alt={damFile.altText}
                    {...nextImageProps}
                />
            );
        }

        let dimensions: ImageDimensions;

        // check if image is cropped
        if (usedCropArea.width && usedCropArea.height) {
            dimensions = getMaxDimensionsFromArea(
                {
                    width: (usedCropArea.width * damFile.image.width) / 100,
                    height: (usedCropArea.height * damFile.image.height) / 100,
                },
                usedAspectRatio,
            );
        }
        // as a fallback use image dimensions
        else {
            dimensions = getMaxDimensionsFromArea(
                {
                    width: damFile.image.width,
                    height: damFile.image.height,
                },
                usedAspectRatio,
            );
        }

        if (disableBlurPlaceholder) {
            return (
                <NextImage
                    loader={(loaderProps) => generateImageUrl(loaderProps, usedAspectRatio)}
                    src={urlTemplate}
                    width={dimensions.width}
                    height={dimensions.height}
                    layout={layout}
                    priority
                    alt={damFile.altText}
                    {...nextImageProps}
                />
            );
        }

        const blurDataUrl = createDominantImageDataUrl(dimensions.width, dimensions.height, damFile.image.dominantColor);
        return (
            <NextImage
                loader={(loaderProps) => generateImageUrl(loaderProps, usedAspectRatio)}
                src={urlTemplate}
                width={dimensions.width}
                height={dimensions.height}
                layout={layout}
                placeholder="blur"
                blurDataURL={blurDataUrl}
                alt={damFile.altText}
                {...nextImageProps}
            />
        );
    },
    { label: "PixelImage" },
);

// to be used as placeholderImage
function createDominantImageDataUrl(w: number, h: number, dominantColor = "#ffffff"): string {
    const toBase64 = (str: string) => (typeof window === "undefined" ? Buffer.from(str).toString("base64") : window.btoa(str));

    const svg = `
<svg width="${w}" height="${h}" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
    <rect width="${w}" height="${h}" fill="${dominantColor}" />
</svg>`;

    return `data:image/svg+xml;base64,${toBase64(svg)}`;
}
