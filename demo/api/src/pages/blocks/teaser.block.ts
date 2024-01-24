import {
    BlockData,
    BlockDataInterface,
    BlockInput,
    ChildBlock,
    ChildBlockInput,
    createBlock,
    ExtractBlockData,
    ExtractBlockInput,
    inputToData,
} from "@comet/blocks-api";
import { DamImageBlock } from "@comet/cms-api";
import { LinkListBlock } from "@src/common/blocks/link-list.block";

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

    transformToBlockData(): BlockDataInterface {
        return inputToData(TeaserBlockData, this);
    }
}

const TeaserBlock = createBlock(TeaserBlockData, TeaserBlockInput, "Teaser");

export { TeaserBlock };
