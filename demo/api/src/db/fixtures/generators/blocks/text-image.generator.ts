import { ExtractBlockInputFactoryProps, generateRichtextBlock } from "@comet/blocks-api";
import { File, generateDamImageBlock, ImagePosition } from "@comet/cms-api";
import { ConfigType } from "@nestjs/config";
import { configNS } from "@src/config/config.namespace";
import { TextImageBlock } from "@src/pages/blocks/TextImageBlock";
import faker from "faker";

export const generateTextImageBlock = (
    imageFiles: File[] | File,
    config: ConfigType<typeof configNS>,
): ExtractBlockInputFactoryProps<typeof TextImageBlock> => {
    return {
        text: generateRichtextBlock(faker.datatype.number({ min: 3, max: 20 })),
        image: generateDamImageBlock(imageFiles),
        imagePosition: faker.random.arrayElement(Object.values(ImagePosition)),
        imageAspectRatio: faker.random.arrayElement(config.DAM_ALLOWED_IMAGE_ASPECT_RATIOS.split(",")),
    };
};
