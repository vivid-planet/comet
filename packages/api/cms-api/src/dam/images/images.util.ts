import sharp from "sharp";

import { type DamFileImage } from "../files/entities/file-image.entity";
import { type ImageCropArea } from "./entities/image-crop-area.entity";

/**
 * Calculate a DAM image's aspect ratio based on a specified crop area.
 * The crop area can be specified by an image's usage (e.g., in a PixelImageBlock) or in the DAM.
 *
 * @param image the DAM image
 * @param cropArea the crop area
 * @returns the calculated aspect ratio
 */
export function calculateInheritAspectRatio(image: DamFileImage, cropArea: ImageCropArea): number {
    if (cropArea.focalPoint === "SMART") {
        return image.width / image.height;
    } else {
        if (cropArea.width === undefined || cropArea.height === undefined) {
            throw new Error("Missing crop dimensions");
        }

        return (cropArea.width * image.width) / 100 / ((cropArea.height * image.height) / 100);
    }
}

/**
 * Returns the single most common color in the image.
 *
 * @param imagePath - image file path or buffer
 */
export async function getDominantColor(imagePath: string | Buffer): Promise<string> {
    const width = 100;
    const height = 100;

    const { data, info } = await sharp(imagePath).resize(width, height, { fit: "inside" }).removeAlpha().raw().toBuffer({ resolveWithObject: true });

    const channels = info.channels;
    const histogram = new Map<string, number>();

    for (let i = 0; i < data.length; i += channels) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];

        const key = `${r},${g},${b}`;
        histogram.set(key, (histogram.get(key) || 0) + 1);
    }

    let bestKey: string | null = null;
    let bestCount = -1;

    for (const [key, count] of histogram.entries()) {
        if (count > bestCount) {
            bestCount = count;
            bestKey = key;
        }
    }

    if (!bestKey) {
        throw new Error("Could not determine dominant color");
    }

    const [r, g, b] = bestKey.split(",").map(Number);
    return rgbToHex(r, g, b);
}

function rgbToHex(r: number, g: number, b: number): string {
    return `#${[r, g, b].map((v) => v.toString(16).padStart(2, "0")).join("")}`;
}
