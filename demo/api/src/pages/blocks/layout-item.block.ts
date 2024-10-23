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
import { RichTextBlock } from "@src/common/blocks/rich-text.block";
import { MediaBlock } from "@src/pages/blocks/media.block";
import { IsEnum } from "class-validator";

export enum LayoutItemLayout {
    layout1 = "layout1",
    layout2 = "layout2",
    layout3 = "layout3",
    layout4 = "layout4",
    layout5 = "layout5",
    layout6 = "layout6",
    layout7 = "layout7",
}

class LayoutItemBlockData extends BlockData {
    @BlockField({ type: "enum", enum: LayoutItemLayout })
    layout: LayoutItemLayout;

    @ChildBlock(MediaBlock)
    media1: BlockDataInterface;

    @ChildBlock(RichTextBlock)
    text1: BlockDataInterface;

    @ChildBlock(MediaBlock)
    media2: BlockDataInterface;

    @ChildBlock(RichTextBlock)
    text2: BlockDataInterface;
}

class LayoutItemBlockInput extends BlockInput {
    @IsEnum(LayoutItemLayout)
    @BlockField({ type: "enum", enum: LayoutItemLayout })
    layout: LayoutItemLayout;

    @ChildBlockInput(MediaBlock)
    media1: ExtractBlockInput<typeof MediaBlock>;

    @ChildBlockInput(RichTextBlock)
    text1: ExtractBlockInput<typeof RichTextBlock>;

    @ChildBlockInput(MediaBlock)
    media2: ExtractBlockInput<typeof MediaBlock>;

    @ChildBlockInput(RichTextBlock)
    text2: ExtractBlockInput<typeof RichTextBlock>;

    transformToBlockData(): LayoutItemBlockData {
        return inputToData(LayoutItemBlockData, this);
    }
}

export const LayoutItemBlock = createBlock(LayoutItemBlockData, LayoutItemBlockInput, {
    name: "LayoutItem",
});
