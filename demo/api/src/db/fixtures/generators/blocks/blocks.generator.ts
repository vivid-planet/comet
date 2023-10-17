import { BlocksBlockFixturesGeneratorMap, ExtractBlockInput, ExtractBlockInputFactoryProps } from "@comet/blocks-api";
import { File } from "@comet/cms-api";
import { Config } from "@src/config/config";
import { PageContentBlock } from "@src/pages/blocks/page-content.block";
import faker from "faker";

import { generateImageBlock } from "./image.generator";
import { generateRichtextBlock } from "./richtext.generator";
import { generateSpaceBlock } from "./space.generator";
import { generateTextImageBlock } from "./text-image.generator";

export const generateBlocksBlock = (
    imageFiles: File[],
    config: Config,
    blockCfg: Partial<BlocksBlockFixturesGeneratorMap<typeof PageContentBlock>> = {
        space: generateSpaceBlock,
        richtext: generateRichtextBlock,
        image: () => generateImageBlock(imageFiles),
        textImage: () => generateTextImageBlock(imageFiles, config),
    },
): ExtractBlockInput<typeof PageContentBlock> => {
    const blocks: ExtractBlockInputFactoryProps<typeof PageContentBlock>["blocks"] = [];
    for (let i = 0; i < faker.datatype.number(20); i++) {
        const [type, generator] = faker.random.arrayElement(Object.entries(blockCfg));
        if (generator) {
            blocks.push({
                key: String(i),
                visible: faker.datatype.boolean(),
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                type: type as any,
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                props: generator() as any,
            });
        }
    }
    return PageContentBlock.blockInputFactory({ blocks: blocks });
};
