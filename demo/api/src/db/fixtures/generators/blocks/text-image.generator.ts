import { ExtractBlockInputFactoryProps } from "@comet/blocks-api";
import { FileInterface, ImagePosition } from "@comet/cms-api";
import { TextImageBlock } from "@src/common/blocks/text-image.block";
import { Config } from "@src/config/config";
import faker from "faker";

import { generateImageBlock } from "./image.generator";
import { generateRichtextBlock } from "./richtext.generator";

export const generateTextImageBlock = (
    imageFiles: FileInterface[] | FileInterface,
    config: Config,
): ExtractBlockInputFactoryProps<typeof TextImageBlock> => {
    return {
        text: generateRichtextBlock(),
        image: generateImageBlock(imageFiles),
        imagePosition: faker.random.arrayElement([ImagePosition.Left, ImagePosition.Right]),
        imageAspectRatio: faker.random.arrayElement(config.dam.allowedImageAspectRatios),
    };
};
