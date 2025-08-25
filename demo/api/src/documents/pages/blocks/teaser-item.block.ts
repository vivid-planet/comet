import {
    BlockData,
    BlockDataInterface,
    BlockField,
    BlockInput,
    blockInputToData,
    ChildBlock,
    ChildBlockInput,
    createBlock,
    ExtractBlockInput,
} from "@comet/cms-api";
import { MediaBlock } from "@src/common/blocks/media.block";
import { RichTextBlock } from "@src/common/blocks/rich-text.block";
import { TextLinkBlock } from "@src/common/blocks/text-link.block";
import { IsEnum, IsString } from "class-validator";

export enum HeadlineLevel {
    h1 = "h1",
    h2 = "h2",
    h3 = "h3",
    h4 = "h4",
    h5 = "h5",
    h6 = "h6",
}

class TeaserItemBlockData extends BlockData {
    @ChildBlock(MediaBlock)
    media: BlockDataInterface;

    @BlockField()
    title: string;

    @ChildBlock(RichTextBlock)
    description: BlockDataInterface;

    @ChildBlock(TextLinkBlock)
    link: BlockDataInterface;

    @BlockField({ type: "enum", enum: HeadlineLevel })
    headlineLevel: HeadlineLevel;
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

    @IsEnum(HeadlineLevel)
    @BlockField({ type: "enum", enum: HeadlineLevel })
    headlineLevel: HeadlineLevel;

    transformToBlockData(): TeaserItemBlockData {
        return blockInputToData(TeaserItemBlockData, this);
    }
}

export const TeaserItemBlock = createBlock(TeaserItemBlockData, TeaserItemBlockInput, "TeaserItem");
