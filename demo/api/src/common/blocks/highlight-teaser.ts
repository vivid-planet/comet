import {
    BlockData,
    BlockDataInterface,
    BlockField,
    BlockInput,
    ChildBlock,
    ChildBlockInput,
    createBlock,
    ExtractBlockInput,
    inputToData,
} from "@comet/blocks-api";
import { DamImageBlock } from "@comet/cms-api";
import { IsString } from "class-validator";

import { RichTextBlock } from "./rich-text.block";

class HighlightTeaserBlockData extends BlockData {
    @BlockField()
    title: string;

    @ChildBlock(RichTextBlock)
    description: BlockDataInterface;

    @ChildBlock(DamImageBlock)
    image: BlockDataInterface;
}

class HighlightTeaserBlockInput extends BlockInput {
    @IsString()
    @BlockField()
    title: string;

    @ChildBlockInput(RichTextBlock)
    description: ExtractBlockInput<typeof RichTextBlock>;

    @ChildBlockInput(DamImageBlock)
    image: ExtractBlockInput<typeof DamImageBlock>;

    transformToBlockData(): HighlightTeaserBlockData {
        return inputToData(HighlightTeaserBlockData, this);
    }
}

export const HighlightTeaserBlock = createBlock(HighlightTeaserBlockData, HighlightTeaserBlockInput, "HighlightTeaser");
