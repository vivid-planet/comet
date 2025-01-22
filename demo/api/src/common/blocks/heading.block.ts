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

export enum HeadingTag {
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
    heading: BlockDataInterface;

    @BlockField({ type: "enum", enum: HeadingTag })
    htmlTag: HeadingTag;
}

class HeadingBlockInput extends BlockInput {
    @ChildBlockInput(RichTextBlock)
    eyebrow: ExtractBlockInput<typeof RichTextBlock>;

    @ChildBlockInput(RichTextBlock)
    heading: ExtractBlockInput<typeof RichTextBlock>;

    @IsEnum(HeadingTag)
    @BlockField({ type: "enum", enum: HeadingTag })
    htmlTag: HeadingTag;

    transformToBlockData(): HeadingBlockData {
        return inputToData(HeadingBlockData, this);
    }
}

export const HeadingBlock = createBlock(HeadingBlockData, HeadingBlockInput, "Heading");
