import { mediaType } from "@hapi/accept";

import { FocalPoint } from "../common/enums/focal-point.enum";

interface ImageDimensions {
    width: number;
    height: number;
}

interface ImageCoordinates {
    x: number;
    y: number;
}

export interface ImageDimensionsAndCoordinates extends ImageDimensions, ImageCoordinates {}

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

function getFocalPoint(area: ImageDimensionsAndCoordinates, focalPointPosition: FocalPoint): { x: number; y: number } {
    let x: number, y: number;
    if (focalPointPosition === FocalPoint.NORTHWEST) {
        x = area.width / 3;
        y = area.height / 3;
    } else if (focalPointPosition === FocalPoint.NORTHEAST) {
        x = area.width - area.width / 3;
        y = area.height / 3;
    } else if (focalPointPosition === FocalPoint.SOUTHWEST) {
        x = area.width / 3;
        y = area.height - area.height / 3;
    } else if (focalPointPosition === FocalPoint.SOUTHEAST) {
        x = area.width - area.width / 3;
        y = area.height - area.height / 3;
    } else {
        x = area.width / 2;
        y = area.height / 2;
    }

    return {
        x,
        y,
    };
}

export function getCenteredPosition(crop: ImageDimensions, area: ImageDimensionsAndCoordinates, focalPointPosition: FocalPoint): ImageCoordinates {
    const focalPoint = getFocalPoint(area, focalPointPosition);

    let x = Math.max(focalPoint.x - crop.width / 2, 0);
    if (x + crop.width > area.width) x -= x + crop.width - area.width;
    if (x < 0) x = 0; // Can happen because width is rounded and x not

    let y = Math.max(focalPoint.y - crop.height / 2, 0);
    if (y + crop.height > area.height) y -= y + crop.height - area.height;
    if (y < 0) y = 0; // Can happen because height is rounded and y not

    return { x: x + area.x, y: y + area.y };
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

export function getSupportedMimeType(options: string[], accept = ""): string {
    const mimeType = mediaType(accept, options);
    return accept.includes(mimeType) ? mimeType : "";
}
