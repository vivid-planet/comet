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
import { MediaBlock } from "@src/common/blocks/media.block";
import { RichTextBlock } from "@src/common/blocks/rich-text.block";
import { TextLinkBlock } from "@src/common/blocks/text-link.block";
import { IsString } from "class-validator";

class TeaserItemBlockData extends BlockData {
    @ChildBlock(MediaBlock)
    media: BlockDataInterface;

    @BlockField()
    title: string;

    @ChildBlock(RichTextBlock)
    description: BlockDataInterface;

    @ChildBlock(TextLinkBlock)
    link: BlockDataInterface;
}

class TeaserItemBlockInput extends BlockInput {
    @ChildBlockInput(MediaBlock)
    media: ExtractBlockInput<typeof MediaBlock>;

    @BlockField()
    @IsString()
    title: string;

    @ChildBlockInput(RichTextBlock)
    description: ExtractBlockInput<typeof RichTextBlock>;

    @ChildBlockInput(TextLinkBlock)
    link: ExtractBlockInput<typeof TextLinkBlock>;

    transformToBlockData(): TeaserItemBlockData {
        return inputToData(TeaserItemBlockData, this);
    }
}

export const TeaserItemBlock = createBlock(TeaserItemBlockData, TeaserItemBlockInput, "TeaserItem");
