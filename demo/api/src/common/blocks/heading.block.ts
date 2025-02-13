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
import { IsEnum } from "class-validator";

import { RichTextBlock } from "./rich-text.block";

export enum HeadlineTag {
    H1 = "H1",
    H2 = "H2",
    H3 = "H3",
    H4 = "H4",
    H5 = "H5",
    H6 = "H6",
}

class HeadingBlockData extends BlockData {
    @ChildBlock(RichTextBlock)
    eyebrow: BlockDataInterface;

    @ChildBlock(RichTextBlock)
    headline: BlockDataInterface;

    @BlockField({ type: "enum", enum: HeadlineTag })
    htmlTag: HeadlineTag;
}

class HeadingBlockInput extends BlockInput {
    @ChildBlockInput(RichTextBlock)
    eyebrow: ExtractBlockInput<typeof RichTextBlock>;

    @ChildBlockInput(RichTextBlock)
    headline: ExtractBlockInput<typeof RichTextBlock>;

    @IsEnum(HeadlineTag)
    @BlockField({ type: "enum", enum: HeadlineTag })
    htmlTag: HeadlineTag;

    transformToBlockData(): HeadingBlockData {
        return inputToData(HeadingBlockData, this);
    }
}

export const HeadingBlock = createBlock(HeadingBlockData, HeadingBlockInput, "Heading");
