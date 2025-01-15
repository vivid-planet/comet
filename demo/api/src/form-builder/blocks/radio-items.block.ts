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

class RadioItemBlockData extends BlockData {
    @ChildBlock(RichTextBlock)
    label: BlockDataInterface;

    @BlockField()
    fieldName: string;

    @ChildBlock(RichTextBlock)
    helperText: BlockDataInterface;
}

class RadioItemBlockInput extends BlockInput {
    @ChildBlockInput(RichTextBlock)
    label: ExtractBlockInput<typeof RichTextBlock>;

    @IsString()
    @IsOptional()
    @BlockField({ nullable: true })
    fieldName?: string;

    @ChildBlockInput(RichTextBlock)
    helperText?: ExtractBlockInput<typeof RichTextBlock>;

    transformToBlockData(): RadioItemBlockData {
        return inputToData(RadioItemBlockData, this);
    }
}

const RadioItemBlock = createBlock(RadioItemBlockData, RadioItemBlockInput, "RadioItem");

export const RadioItemsBlock = createListBlock({ block: RadioItemBlock }, "RadioItems");
