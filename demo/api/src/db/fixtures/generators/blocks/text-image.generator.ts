import { ExtractBlockInputFactoryProps } from "@comet/blocks-api";
import { File, ImagePosition } from "@comet/cms-api";
import { ConfigType } from "@nestjs/config";
import { configNS } from "@src/config/config.namespace";
import { TextImageBlock } from "@src/pages/blocks/TextImageBlock";
import faker from "faker";

import { generateImageBlock } from "./image.generator";
import { generateRichtextBlock } from "./richtext.generator";

export const generateTextImageBlock = (
    imageFiles: File[] | File,
    config: ConfigType<typeof configNS>,
): ExtractBlockInputFactoryProps<typeof TextImageBlock> => {
    return {
        text: generateRichtextBlock(),
        image: generateImageBlock(imageFiles),
        imagePosition: faker.random.arrayElement([ImagePosition.Left, ImagePosition.Right]),
        imageAspectRatio: faker.random.arrayElement(config.DAM_ALLOWED_IMAGE_ASPECT_RATIOS.split(",")),
    };
};
