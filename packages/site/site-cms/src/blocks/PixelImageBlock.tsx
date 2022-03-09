import NextImage, { ImageLoaderProps, ImageProps } from "next/image";
import * as React from "react";

import { PixelImageBlockData } from "../blocks.generated";
import { withPreview } from "../iframebridge/withPreview";
import { generateAspectRatio, generateImageUrl, getMaxDimensionsFromArea, ImageDimensions } from "../image/Image";
import { PreviewSkeleton } from "../previewskeleton/PreviewSkeleton";
import { PropsWithData } from "./PropsWithData";

interface PixelImageBlockProps extends PropsWithData<PixelImageBlockData>, Omit<ImageProps, "src" | "width" | "height"> {
    aspectRatio?: string;
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
        const generatedAspectRatio = generateAspectRatio(aspectRatio);
        const loader = React.useCallback(
            (loaderProps: ImageLoaderProps) => generateImageUrl(loaderProps, generatedAspectRatio),
            [generatedAspectRatio],
        );
        if (!damFile || !damFile.image) return <PreviewSkeleton type="media" hasContent={false} />;

        if (layout === "fill") {
            return <NextImage loader={loader} src={urlTemplate} layout="fill" {...nextImageProps} />;
        }

        let dimensions: ImageDimensions;
        // If we have a crop area set, DAM setting are overwritten, so we use that
        if (cropArea?.height && cropArea.width) {
            dimensions = getMaxDimensionsFromArea(
                { width: (cropArea.width * damFile.image.width) / 100, height: (cropArea.height * damFile.image.height) / 100 },
                generatedAspectRatio,
            );
        }
        // check if image is cropped in DAM
        else if (damFile.image.cropArea.width && damFile.image.cropArea.height) {
            dimensions = getMaxDimensionsFromArea(
                {
                    width: (damFile.image.cropArea.width * damFile.image.width) / 100,
                    height: (damFile.image.cropArea.height * damFile.image.height) / 100,
                },
                generatedAspectRatio,
            );
        }
        // as a fallback use image dimensions
        else {
            dimensions = getMaxDimensionsFromArea({ width: damFile.image.width, height: damFile.image.height }, generatedAspectRatio);
        }

        if (disableBlurPlaceholder) {
            return (
                <NextImage
                    loader={loader}
                    src={urlTemplate}
                    width={dimensions.width}
                    height={dimensions.height}
                    layout={layout}
                    priority
                    {...nextImageProps}
                />
            );
        }

        const blurDataUrl = createDominantImageDataUrl(dimensions.width, dimensions.height, damFile.image.dominantColor);
        return (
            <NextImage
                loader={loader}
                src={urlTemplate}
                width={dimensions.width}
                height={dimensions.height}
                layout={layout}
                placeholder="blur"
                blurDataURL={blurDataUrl}
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
