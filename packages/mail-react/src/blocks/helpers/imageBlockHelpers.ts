export const getDamAllowedImageWidth = (validSizes: number[], minimumWidth: number, contentWidth: number): number => {
    const sortedValidSizes = validSizes.sort((a, b) => a - b);

    let width: number | null = null;
    const largestPossibleWidth = sortedValidSizes[sortedValidSizes.length - 1];

    sortedValidSizes.forEach((validWidth) => {
        if (minimumWidth === contentWidth) {
            width = contentWidth * 2;
        } else if (!width && validWidth >= minimumWidth * 2) {
            width = validWidth;
        }
    });

    if (!width) {
        return largestPossibleWidth;
    }

    return width;
};

interface ImageDimensions {
    width: number;
    height: number;
}

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

export function generateImageUrl({ src, width }: { src: string; width: number }, aspectRatio: number): string {
    return src.replace("$resizeWidth", String(width)).replace("$resizeHeight", String(Math.ceil(width / aspectRatio)));
}
