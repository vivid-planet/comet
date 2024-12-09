import {
    BlockData,
    BlockDataInterface,
    BlockInput,
    blockInputToData,
    ChildBlock,
    ChildBlockInput,
    createBlock,
    DamImageBlock,
    ExtractBlockData,
    ExtractBlockInput,
} from "@comet/cms-api";
import { LinkListBlock } from "@src/common/blocks/link-list.block";
import { ColumnsBlock } from "@src/pages/blocks/columns.block";

import { HeadlineBlock } from "./headline.block";

class TeaserBlockData extends BlockData {
    @ChildBlock(HeadlineBlock)
    headline: ExtractBlockData<typeof HeadlineBlock>;

    @ChildBlock(DamImageBlock)
    image: ExtractBlockData<typeof DamImageBlock>;

    @ChildBlock(LinkListBlock)
    links: ExtractBlockData<typeof LinkListBlock>;

    @ChildBlock(LinkListBlock)
    buttons: ExtractBlockData<typeof LinkListBlock>;

    @ChildBlock(ColumnsBlock)
    columns: ExtractBlockData<typeof ColumnsBlock>;
}

class TeaserBlockInput extends BlockInput {
    @ChildBlockInput(HeadlineBlock)
    headline: ExtractBlockInput<typeof HeadlineBlock>;

    @ChildBlockInput(DamImageBlock)
    image: ExtractBlockInput<typeof DamImageBlock>;

    @ChildBlockInput(LinkListBlock)
    links: ExtractBlockInput<typeof LinkListBlock>;

    @ChildBlockInput(LinkListBlock)
    buttons: ExtractBlockInput<typeof LinkListBlock>;

    @ChildBlockInput(ColumnsBlock)
    columns: ExtractBlockInput<typeof ColumnsBlock>;

    transformToBlockData(): BlockDataInterface {
        return blockInputToData(TeaserBlockData, this);
    }
}

const TeaserBlock = createBlock(TeaserBlockData, TeaserBlockInput, "Teaser");

export { TeaserBlock };
