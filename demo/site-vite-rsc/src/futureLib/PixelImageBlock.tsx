"use client";
import {
    calculateInheritAspectRatio,
    getMaxDimensionsFromArea,
    type ImageDimensions,
    parseAspectRatio,
    PreviewSkeleton,
    type PropsWithData,
    withPreview,
} from "@comet/site-react";
import { appConfig } from "@src/app.config";
import { type PixelImageBlockData } from "@src/blocks.generated";
import type { ComponentProps } from "react";

import styles from "./PixelImageBlock.module.scss";

interface PixelImageBlockProps extends PropsWithData<PixelImageBlockData>, Omit<ComponentProps<"img">, "src" | "width" | "height" | "alt"> {
    aspectRatio: string | number | "inherit";
    /**
     * Do not set an `alt` attribute. The alt text is set in the DAM.
     */
    alt?: never;
    fill?: boolean;
}

export const PixelImageBlock = withPreview(
    ({ aspectRatio, data: { damFile, cropArea, urlTemplate }, fill, ...nextImageProps }: PixelImageBlockProps) => {
        if (!damFile || !damFile.image) return <PreviewSkeleton type="media" hasContent={false} aspectRatio={aspectRatio} fill={fill} />;

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

        //const blurDataUrl = createDominantImageDataUrl(dimensions.width, dimensions.height, damFile.image.dominantColor);

        const srcSet = [...appConfig.images.deviceSizes, ...appConfig.images.imageSizes]
            .filter((size) => size <= dimensions.width)
            .sort((a, b) => a - b)
            .map((size) => {
                const url = urlTemplate.replace("$resizeWidth", String(size)).replace("$resizeHeight", String(Math.ceil(size / usedAspectRatio)));
                return `${url} ${size}w`;
            });

        const image = (
            <img
                src={srcSet[srcSet.length - 1].split(" ")[0]}
                srcSet={srcSet.join(", ")}
                //fill
                //style={{ objectFit: "cover" }}
                //placeholder="blur"
                //blurDataURL={blurDataUrl}
                alt={damFile.altText ?? ""}
                title={damFile.title ?? ""}
                {...nextImageProps}
            />
        );

        // default behavior when fill is set to true: do not wrap in container -> an own container must be used
        if (fill) {
            return image;
        }

        return (
            <div className={styles.imageContainer} style={{ "--aspect-ratio": usedAspectRatio }}>
                {image}
            </div>
        );
    },
    { label: "PixelImage" },
);

/*
// to be used as placeholderImage
function createDominantImageDataUrl(w: number, h: number, dominantColor = "#ffffff"): string {
    const toBase64 = (str: string) => (typeof window === "undefined" ? Buffer.from(str).toString("base64") : window.btoa(str));

    const svg = `
<svg width="${w}" height="${h}" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
    <rect width="${w}" height="${h}" fill="${dominantColor}" />
</svg>`;

    return `data:image/svg+xml;base64,${toBase64(svg)}`;
}
*/
