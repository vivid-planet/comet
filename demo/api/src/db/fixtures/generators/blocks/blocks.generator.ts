import { type BlocksBlockFixturesGeneratorMap, type ExtractBlockInput, type ExtractBlockInputFactoryProps, type FileInterface } from "@comet/cms-api";
import { faker } from "@faker-js/faker";
import { type Config } from "@src/config/config";
import { generateImageBlock } from "@src/db/fixtures/generators/blocks/image.generator";
import { PageContentBlock } from "@src/documents/pages/blocks/page-content.block";

import { generateRichtextBlock } from "./richtext.generator";
import { generateSpaceBlock } from "./space.generator";
import { generateTextImageBlock } from "./text-image.generator";

export const generateBlocksBlock = (
    imageFiles: FileInterface[],
    config: Config,
    blockCfg: Partial<BlocksBlockFixturesGeneratorMap<typeof PageContentBlock>> = {
        space: generateSpaceBlock,
        richtext: generateRichtextBlock,
        image: () => generateImageBlock(imageFiles),
        textImage: () => generateTextImageBlock(imageFiles, config),
    },
): ExtractBlockInput<typeof PageContentBlock> => {
    const blocks: ExtractBlockInputFactoryProps<typeof PageContentBlock>["blocks"] = [];
    for (let i = 0; i < faker.number.int(20); i++) {
        const [type, generator] = faker.helpers.arrayElement(Object.entries(blockCfg));
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
