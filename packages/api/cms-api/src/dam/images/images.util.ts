import { type DamFileImage } from "../files/entities/file-image.entity";
import { type ImageCropArea } from "./entities/image-crop-area.entity";

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
