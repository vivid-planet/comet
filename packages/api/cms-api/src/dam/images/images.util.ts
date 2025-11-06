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
