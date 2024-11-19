<<<<<<< HEAD
import { ColumnsBlockFactory, createBlocksBlock, DamImageBlock, SpaceBlock } from "@comet/cms-api";
=======
import { ColumnsBlockFactory, createBlocksBlock, SpaceBlock } from "@comet/blocks-api";
import { DamImageBlock } from "@comet/cms-api";
import { LinkListBlock } from "@src/common/blocks/link-list.block";
>>>>>>> main
import { RichTextBlock } from "@src/common/blocks/rich-text.block";

import { HeadlineBlock } from "./headline.block";

const ColumnsContentBlock = createBlocksBlock(
    {
        supportedBlocks: {
            space: SpaceBlock,
            richtext: RichTextBlock,
            headline: HeadlineBlock,
            image: DamImageBlock,
            linkList: LinkListBlock,
        },
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
