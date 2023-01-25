import { ExtractBlockInputFactoryProps } from "@comet/blocks-api";
import faker from "faker";

import { DamImageBlock } from "../../dam/blocks/dam-image.block";
import { FocalPoint } from "../../dam/common/enums/focal-point.enum";
import { File } from "../../dam/files/entities/file.entity";
import { ImageCropAreaInput } from "../../dam/images/dto/image-crop-area.input";

export const generateDamImageBlock = (
    imageFiles: File[] | File,
    cropArea?: ImageCropAreaInput,
): ExtractBlockInputFactoryProps<typeof DamImageBlock> => {
    const imageFile = Array.isArray(imageFiles) ? faker.random.arrayElement(imageFiles) : imageFiles;
    const type = imageFile.mimetype == "image/svg+xml" ? "svgImage" : "pixelImage";

    const props = {
        damFileId: imageFile.id,
        cropArea: type === "pixelImage" ? cropArea ?? calculateDefaultCropInput() : undefined,
    };

    return {
        attachedBlocks: [
            {
                type,
                props,
            },
        ],
        activeType: type,
    };
};

const calculateDefaultCropInput = (): ImageCropAreaInput => {
    const focalPoint = faker.random.arrayElement(Object.values(FocalPoint));

    return {
        focalPoint,
        x: focalPoint !== FocalPoint.SMART ? 0 : undefined,
        y: focalPoint !== FocalPoint.SMART ? 0 : undefined,
        height: focalPoint !== FocalPoint.SMART ? faker.datatype.number({ min: 20, max: 100 }) : undefined,
        width: focalPoint !== FocalPoint.SMART ? faker.datatype.number({ min: 20, max: 100 }) : undefined,
    };
};
