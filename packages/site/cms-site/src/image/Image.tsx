// eslint-disable-next-line no-restricted-imports
import NextImage, { ImageLoaderProps, ImageProps as NextImageProps } from "next/image";
import * as React from "react";

// Fallback to 1 / 1 aspect ratio for invalid value format
export function parseAspectRatio(value: string): number {
    const [width = 1, height = 1] = value.split("x").map((v) => {
        let ret: number | undefined = Number(v);
        if (isNaN(ret)) ret = undefined;
        return ret;
    });
    return width / height;
}

// duplicated from api/src/images/images.util.ts
export interface ImageDimensions {
    width: number;
    height: number;
}

// duplicated from api/src/images/images.util.ts
export function getMaxDimensionsFromArea(area: ImageDimensions, aspectRatio: number): ImageDimensions {
    let width: number, height: number;
    if (aspectRatio < 1) {
        width = Math.min(area.height * aspectRatio, area.width);
        height = width / aspectRatio;
    } else {
        height = Math.min(area.width / aspectRatio, area.height);
        width = height * aspectRatio;
    }

    return {
        width,
        height,
    };
}

// Duplicate of api/cms-api/src/dam/images/images.util.ts
export function calculateInheritAspectRatio(
    imageDimensions: ImageDimensions,
    cropArea: {
        focalPoint: "SMART" | "CENTER" | "NORTHWEST" | "NORTHEAST" | "SOUTHWEST" | "SOUTHEAST";
        width?: number;
        height?: number;
        x?: number;
        y?: number;
    },
): number {
    if (cropArea.focalPoint === "SMART") {
        return imageDimensions.width / imageDimensions.height;
    } else {
        if (cropArea.width === undefined || cropArea.height === undefined) {
            throw new Error("Missing crop dimensions");
        }

        return (cropArea.width * imageDimensions.width) / 100 / ((cropArea.height * imageDimensions.height) / 100);
    }
}

export function generateImageUrl({ src, width }: Pick<ImageLoaderProps, "src" | "width">, aspectRatio: number): string {
    return src.replace("$resizeWidth", String(width)).replace("$resizeHeight", String(Math.ceil(width / aspectRatio)));
}

type Props = Omit<NextImageProps, "loader"> &
    (
        | { layout?: "fixed" | "intrinsic" }
        // The sizes prop must be specified for images with layout "fill" or "responsive", as recommended in the next/image documentation
        // https://nextjs.org/docs/api-reference/next/image#sizes
        | {
              layout?: "fill" | "responsive";
              sizes: string;
          }
    ) & { aspectRatio?: string };

export function Image({ aspectRatio = "16x9", ...nextImageProps }: Props): React.ReactElement {
    const usedAspectRatio = parseAspectRatio(aspectRatio);

    return <NextImage loader={(loaderProps) => generateImageUrl(loaderProps, usedAspectRatio)} {...nextImageProps} />;
}
