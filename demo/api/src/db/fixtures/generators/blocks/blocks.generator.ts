import {
    BlocksBlockFixturesGeneratorMap,
    ExtractBlockInput,
    ExtractBlockInputFactoryProps,
    generateRichtextBlock,
    generateSpaceBlock,
    generateYoutubeVideoBlock,
} from "@comet/blocks-api";
import { File, generateDamImageBlock } from "@comet/cms-api";
import { ConfigType } from "@nestjs/config";
import { configNS } from "@src/config/config.namespace";
import { generateTextImageBlock } from "@src/db/fixtures/generators/blocks/text-image.generator";
import { PageContentBlock } from "@src/pages/blocks/page-content.block";
import faker from "faker";

export const generateBlocksBlock = (
    imageFiles: File[],
    config: ConfigType<typeof configNS>,
    blockCfg: Partial<BlocksBlockFixturesGeneratorMap<typeof PageContentBlock>> = {
        space: generateSpaceBlock,
        richtext: generateRichtextBlock,
        image: () => generateDamImageBlock(imageFiles),
        textImage: () => generateTextImageBlock(imageFiles, config),
        youTubeVideo: () => generateYoutubeVideoBlock(["FG4KsatjFeI&t", "F_oOtaxb0L8", "Sklc_fQBmcs", "Xoz31I1FuiY", "bMknfKXIFA8"]),
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
