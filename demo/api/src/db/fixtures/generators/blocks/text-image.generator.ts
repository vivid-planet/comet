import { type ExtractBlockInputFactoryProps, type FileInterface, ImagePosition } from "@comet/cms-api";
import { faker } from "@faker-js/faker";
import { type TextImageBlock } from "@src/common/blocks/text-image.block";
import { type Config } from "@src/config/config";

import { generateImageBlock } from "./image.generator";
import { generateRichtextBlock } from "./richtext.generator";

export const generateTextImageBlock = (
    imageFiles: FileInterface[] | FileInterface,
    config: Config,
): ExtractBlockInputFactoryProps<typeof TextImageBlock> => {
    return {
        text: generateRichtextBlock(),
        image: generateImageBlock(imageFiles),
        imagePosition: faker.helpers.arrayElement([ImagePosition.Left, ImagePosition.Right]),
        imageAspectRatio: faker.helpers.arrayElement(config.dam.allowedImageAspectRatios),
    };
};
