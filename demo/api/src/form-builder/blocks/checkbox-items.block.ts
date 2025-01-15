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
        // TODO: Combine this with `BaseFieldBlockInput` -> `getBlockDataWithUpdatedFieldName` and make sure `fieldName` is always unique
        if (!this.fieldName) {
            const firstLineOfText = this.label.draftContent.blocks.length ? this.label.draftContent.blocks[0].text : "";
            const slugifiedText = firstLineOfText ? firstLineOfText.toLowerCase().replace(/[^a-z0-9]/g, "-") : "";
            const cleanSlugifiedText = slugifiedText.replace(/^-+|-+$/g, "");
            this.fieldName = cleanSlugifiedText;
        }

        return inputToData(CheckboxItemBlockData, this);
    }
}

const CheckboxItemBlock = createBlock(CheckboxItemBlockData, CheckboxItemBlockInput, "CheckboxItem");

export const CheckboxItemsBlock = createListBlock({ block: CheckboxItemBlock }, "CheckboxItems");
