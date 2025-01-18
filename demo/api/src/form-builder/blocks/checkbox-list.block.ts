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
import { IsBoolean, IsOptional, IsString } from "class-validator";

import { BaseFieldBlockData, BaseFieldBlockInput } from "./base-field.block";

class ItemBlockData extends BlockData {
    @ChildBlock(RichTextBlock)
    label: BlockDataInterface;

    @BlockField()
    fieldName: string;

    @BlockField()
    mandatory: boolean;

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

    @IsBoolean()
    @BlockField()
    mandatory: boolean;

    @ChildBlockInput(RichTextBlock)
    helperText?: ExtractBlockInput<typeof RichTextBlock>;

    transformToBlockData(): ItemBlockData {
        return inputToData(ItemBlockData, this);
    }
}

const ItemBlock = createBlock(ItemBlockData, ItemBlockInput, "CheckboxItem");
const ItemsBlock = createListBlock({ block: ItemBlock }, "CheckboxItems");

class CheckboxListBlockData extends BaseFieldBlockData {
    @ChildBlock(ItemsBlock)
    items: BlockDataInterface;
}

class CheckboxListBlockInput extends BaseFieldBlockInput {
    @ChildBlockInput(ItemsBlock)
    items: ExtractBlockInput<typeof ItemsBlock>;

    transformToBlockData(): CheckboxListBlockData {
        return inputToData(CheckboxListBlockData, this);
    }
}

export const CheckboxListBlock = createBlock(CheckboxListBlockData, CheckboxListBlockInput, "CheckboxList");
