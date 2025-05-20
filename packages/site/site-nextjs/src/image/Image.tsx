// eslint-disable-next-line no-restricted-imports
import NextImage, { type ImageLoaderProps, type ImageProps as NextImageProps } from "next/image";

// Fallback to 1 / 1 aspect ratio for invalid value format
export function parseAspectRatio(value: string | number): number {
    let width, height;
    if (typeof value === "string") {
        [width, height] = value.split(/[x/:]/).map((v) => {
            let ret: number | undefined = parseFloat(v);
            if (isNaN(ret)) ret = undefined;
            return ret;
        });
        if (width && !height) {
            height = 1;
        }
    } else {
        width = value;
        height = 1;
    }
    if (!width || !height) throw Error(`An error occurred while parsing the aspect ratio: ${value}`);

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

export function generateImageUrl({ src, width }: Pick<ImageLoaderProps, "src" | "width">, aspectRatio: number): string {
    return src.replace("$resizeWidth", String(width)).replace("$resizeHeight", String(Math.ceil(width / aspectRatio)));
}

type Props = Omit<NextImageProps, "loader"> & { aspectRatio: string };

export function Image({ aspectRatio, ...nextImageProps }: Props) {
    const usedAspectRatio = parseAspectRatio(aspectRatio);

    return <NextImage loader={(loaderProps) => generateImageUrl(loaderProps, usedAspectRatio)} {...nextImageProps} />;
}
