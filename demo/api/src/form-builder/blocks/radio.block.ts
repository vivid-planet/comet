import {
    BlockData,
    BlockDataInterface,
    BlockField,
    BlockInput,
    ChildBlock,
    ChildBlockInput,
    createBlock,
    createListBlock,
    ExtractBlockInput,
    inputToData,
} from "@comet/blocks-api";
import { RichTextBlock } from "@src/common/blocks/rich-text.block";
import { IsOptional, IsString } from "class-validator";

import { BaseFieldBlockData, BaseFieldBlockInput } from "./base-field.block";

class ItemBlockData extends BlockData {
    @ChildBlock(RichTextBlock)
    label: BlockDataInterface;

    @BlockField()
    fieldName: string;

    @ChildBlock(RichTextBlock)
    helperText: BlockDataInterface;
}

class ItemBlockInput extends BlockInput {
    @ChildBlockInput(RichTextBlock)
    label: ExtractBlockInput<typeof RichTextBlock>;

    @IsString()
    @IsOptional()
    @BlockField({ nullable: true })
    fieldName?: string;

    @ChildBlockInput(RichTextBlock)
    helperText?: ExtractBlockInput<typeof RichTextBlock>;

    transformToBlockData(): ItemBlockData {
        return inputToData(ItemBlockData, this);
    }
}

const ItemBlock = createBlock(ItemBlockData, ItemBlockInput, "RadioItem");
const ItemsBlock = createListBlock({ block: ItemBlock }, "RadioItems");

class RadioBlockData extends BaseFieldBlockData {
    @ChildBlock(ItemsBlock)
    items: BlockDataInterface;
}

class RadioBlockInput extends BaseFieldBlockInput {
    @ChildBlockInput(ItemsBlock)
    items: ExtractBlockInput<typeof ItemsBlock>;

    transformToBlockData(): RadioBlockData {
        return inputToData(RadioBlockData, this);
    }
}

export const RadioBlock = createBlock(RadioBlockData, RadioBlockInput, "Radio");
