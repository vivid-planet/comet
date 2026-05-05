import type { PixelImageBlockData } from "../../blocks.generated.js";
import { useTheme } from "../../theme/ThemeProvider.js";
import { usePixelImageConfig } from "./usePixelImageConfig.js";

interface UsePixelImageDataProps {
    data: PixelImageBlockData;
    defaultRenderWidth: number;
    largestPossibleRenderWidth?: number;
    aspectRatio?: number | string;
}

interface PixelImageData {
    imageUrl: string;
    defaultRenderWidth: number;
    desktopImageHeight: number;
    alt: string | undefined;
    title: string | undefined;
}

export function usePixelImageData({
    data: { damFile, cropArea, urlTemplate },
    defaultRenderWidth,
    largestPossibleRenderWidth: passedLargestPossibleRenderWidth,
    aspectRatio: passedAspectRatio,
}: UsePixelImageDataProps): PixelImageData | null {
    const theme = useTheme();
    const { validSizes, baseUrl } = usePixelImageConfig();
    const largestPossibleRenderWidth = passedLargestPossibleRenderWidth ?? theme.sizes.bodyWidth;

    if (!damFile?.image) {
        return null;
    }

    const usedCropArea = cropArea ?? damFile.image.cropArea;
    const aspectRatio = passedAspectRatio !== undefined ? parseAspectRatio(passedAspectRatio) : calculateAspectRatio(damFile.image, usedCropArea);

    const optimalWidth = getOptimalAllowedImageWidth(validSizes, defaultRenderWidth, largestPossibleRenderWidth);
    const resolvedImageUrl = generateImageUrl(urlTemplate, optimalWidth, aspectRatio);

    return {
        imageUrl: isAbsoluteUrl(resolvedImageUrl) ? resolvedImageUrl : `${baseUrl}${resolvedImageUrl}`,
        defaultRenderWidth,
        desktopImageHeight: Math.round(defaultRenderWidth / aspectRatio),
        alt: damFile.altText,
        title: damFile.title,
    };
}

function isAbsoluteUrl(url: string): boolean {
    return !url.startsWith("/");
}

function getOptimalAllowedImageWidth(validSizes: number[], defaultRenderWidth: number, largestPossibleRenderWidth: number): number {
    const sortedValidSizes = validSizes.sort((a, b) => a - b);

    let width: number | null = null;
    const largestPossibleWidth = sortedValidSizes[sortedValidSizes.length - 1];

    sortedValidSizes.forEach((validWidth) => {
        if (defaultRenderWidth === largestPossibleRenderWidth) {
            width = largestPossibleRenderWidth * 2;
        } else if (!width && validWidth >= defaultRenderWidth * 2) {
            width = validWidth;
        }
    });

    if (!width) {
        return largestPossibleWidth;
    }

    return width;
}

interface ImageDimensions {
    width: number;
    height: number;
}

interface CropArea {
    focalPoint: "SMART" | "CENTER" | "NORTHWEST" | "NORTHEAST" | "SOUTHWEST" | "SOUTHEAST";
    width?: number;
    height?: number;
    x?: number;
    y?: number;
}

function calculateAspectRatio(image: ImageDimensions, cropArea: CropArea): number {
    if (cropArea.focalPoint === "SMART") {
        return image.width / image.height;
    }

    if (cropArea.width === undefined || cropArea.height === undefined) {
        throw new Error("Missing crop dimensions");
    }

    return (cropArea.width * image.width) / (cropArea.height * image.height);
}

function generateImageUrl(urlTemplate: string, width: number, aspectRatio: number): string {
    return urlTemplate.replace("$resizeWidth", String(width)).replace("$resizeHeight", String(Math.ceil(width / aspectRatio)));
}

function parseAspectRatio(value: number | string): number {
    let width: number | undefined;
    let height: number | undefined;

    if (typeof value === "string") {
        [width, height] = value.split(/[x/:]/).map((part) => {
            const parsed = parseFloat(part);
            return isNaN(parsed) ? undefined : parsed;
        });
        if (width && !height) {
            height = 1;
        }
    } else {
        width = value;
        height = 1;
    }

    if (!width || !height) {
        throw new Error(`An error occurred while parsing the aspect ratio: ${value}`);
    }

    return width / height;
}
