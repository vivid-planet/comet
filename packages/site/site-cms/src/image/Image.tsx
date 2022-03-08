import NextImage, { ImageLoaderProps, ImageProps as NextImageProps } from "next/image";
import * as React from "react";

// Fallback to 1 / 1 aspect ratio for invalid value format
export function generateAspectRatio(value: string): number {
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
        width: Math.ceil(width),
        height: Math.ceil(height),
    };
}

export function generateImageUrl({ src, width }: ImageLoaderProps, aspectRatio: number): string {
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
    const generatedAspectRatio = generateAspectRatio(aspectRatio);
    const loader = React.useCallback((loaderProps: ImageLoaderProps) => generateImageUrl(loaderProps, generatedAspectRatio), [generatedAspectRatio]);

    return <NextImage loader={loader} {...nextImageProps} />;
}
