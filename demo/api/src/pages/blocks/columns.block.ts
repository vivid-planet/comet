import { ColumnsBlockFactory, createBlocksBlock, SpaceBlock } from "@comet/blocks-api";
import { DamImageBlock } from "@comet/cms-api";
import { RichTextBlock } from "@src/common/blocks/rich-text.block";

import { HeadlineBlock } from "./headline.block";

export const supportedBlocks = {
    space: SpaceBlock,
    richtext: RichTextBlock,
    headline: HeadlineBlock,
    image: DamImageBlock,
};

export const ColumnsContentBlock = createBlocksBlock(
    {
        supportedBlocks,
    },
    "ColumnsContent",
);

const ColumnsBlock = ColumnsBlockFactory.create(
    {
        contentBlock: ColumnsContentBlock,
        layouts: [{ name: "one-column" }, { name: "two-columns" }, { name: "two-columns-12-6" }],
    },
    "Columns",
);

export { ColumnsBlock };
