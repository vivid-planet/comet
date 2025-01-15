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

class CheckboxItemBlockData extends BlockData {
    @ChildBlock(RichTextBlock)
    label: BlockDataInterface;

    @BlockField()
    fieldName: string;

    @BlockField()
    mandatory: boolean;

    @ChildBlock(RichTextBlock)
    helperText: BlockDataInterface;
}

class CheckboxItemBlockInput extends BlockInput {
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

    transformToBlockData(): CheckboxItemBlockData {
        return inputToData(CheckboxItemBlockData, this);
    }
}

const CheckboxItemBlock = createBlock(CheckboxItemBlockData, CheckboxItemBlockInput, "CheckboxItem");

export const CheckboxItemsBlock = createListBlock({ block: CheckboxItemBlock }, "CheckboxItems");
