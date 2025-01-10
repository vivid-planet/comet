"use client";
import { styled } from "@pigment-css/react";
// eslint-disable-next-line no-restricted-imports
import NextImage, { ImageProps } from "next/image";

import { PixelImageBlockData } from "../blocks.generated";
import { calculateInheritAspectRatio, generateImageUrl, getMaxDimensionsFromArea, ImageDimensions, parseAspectRatio } from "../image/Image";
//import { PreviewSkeleton } from "../previewskeleton/PreviewSkeleton";
import { PropsWithData } from "./PropsWithData";

interface PixelImageBlockProps extends PropsWithData<PixelImageBlockData>, Omit<ImageProps, "src" | "width" | "height" | "alt"> {
    aspectRatio: string | number | "inherit";
}

export const PixelImageBlock = ({ aspectRatio, data: { damFile, cropArea, urlTemplate }, fill, ...nextImageProps }: PixelImageBlockProps) => {
    //if (!damFile || !damFile.image) return <PreviewSkeleton type="media" hasContent={false} aspectRatio={aspectRatio} />;
    if (!damFile || !damFile.image) return null;

    // If we have a crop area set, DAM setting are overwritten, so we use that
    const usedCropArea = cropArea ?? damFile.image.cropArea;

    let usedAspectRatio: number;

    if (aspectRatio === "inherit") {
        usedAspectRatio = calculateInheritAspectRatio(damFile.image, usedCropArea);
    } else {
        usedAspectRatio = parseAspectRatio(aspectRatio);
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

    const blurDataUrl = createDominantImageDataUrl(dimensions.width, dimensions.height, damFile.image.dominantColor);

    const nextImage = (
        <NextImage
            loader={(loaderProps) => generateImageUrl(loaderProps, usedAspectRatio)}
            src={urlTemplate}
            fill
            style={{ objectFit: "cover" }}
            placeholder="blur"
            blurDataURL={blurDataUrl}
            alt={damFile.altText ?? ""}
            {...nextImageProps}
        />
    );

    // default behavior when fill is set to true: do not wrap in container -> an own container must be used
    if (fill) {
        return nextImage;
    }

    return <ImageContainer $aspectRatio={usedAspectRatio}>{nextImage}</ImageContainer>;
};

//export default withPreview(PixelImageBlock, { label: "PixelImage" });

// to be used as placeholderImage
function createDominantImageDataUrl(w: number, h: number, dominantColor = "#ffffff"): string {
    const toBase64 = (str: string) => (typeof window === "undefined" ? Buffer.from(str).toString("base64") : window.btoa(str));

    const svg = `
<svg width="${w}" height="${h}" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
    <rect width="${w}" height="${h}" fill="${dominantColor}" />
</svg>`;

    return `data:image/svg+xml;base64,${toBase64(svg)}`;
}

const ImageContainer = styled.div<{ $aspectRatio: number }>({
    position: "relative",
    width: "100%",
    aspectRatio: ({ $aspectRatio }) => $aspectRatio,
});
