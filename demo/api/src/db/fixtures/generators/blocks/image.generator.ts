import { ExtractBlockInputFactoryProps } from "@comet/api-blocks";
import { File, FocalPoint, ImageCropAreaInput } from "@comet/api-cms";
import { ImageBlock } from "@src/pages/blocks/ImageBlock";
import faker from "faker";

export const generateImageBlock = (imageFiles: File[] | File, cropArea?: ImageCropAreaInput): ExtractBlockInputFactoryProps<typeof ImageBlock> => {
    const imageFile = Array.isArray(imageFiles) ? faker.random.arrayElement(imageFiles) : imageFiles;
    const type = imageFile.mimetype == "image/svg+xml" ? "svgImage" : "pixelImage";
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const props: any = {
        damFileId: imageFile.id,
    };
    if (type == "pixelImage") {
        props.cropArea = cropArea ?? calculateDefaultCropInput(imageFile);
    }
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

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const calculateDefaultCropInput = ({ image }: File): ImageCropAreaInput => {
    const focalPoint = faker.random.arrayElement([
        FocalPoint.SMART,
        FocalPoint.CENTER,
        FocalPoint.NORTHEAST,
        FocalPoint.NORTHWEST,
        FocalPoint.SOUTHEAST,
        FocalPoint.SOUTHWEST,
    ]);

    return {
        focalPoint,
        x: focalPoint !== FocalPoint.SMART ? 0 : undefined,
        y: focalPoint !== FocalPoint.SMART ? 0 : undefined,
        height: focalPoint !== FocalPoint.SMART ? faker.datatype.number({ min: 20, max: 100 }) : undefined,
        width: focalPoint !== FocalPoint.SMART ? faker.datatype.number({ min: 20, max: 100 }) : undefined,
    };
};
