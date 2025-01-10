import { BlockData, BlockField, BlockInput, createBlock, createListBlock, inputToData } from "@comet/blocks-api";
import { IsOptional, IsString } from "class-validator";

class SelectOptionBlockData extends BlockData {
    @BlockField()
    text: string;

    @BlockField()
    fieldName: string;
}

class SelectOptionBlockInput extends BlockInput {
    @IsString()
    @IsOptional()
    @BlockField({ nullable: true })
    text?: string;

    @IsString()
    @IsOptional()
    @BlockField({ nullable: true })
    fieldName?: string;

    transformToBlockData(): SelectOptionBlockData {
        // TODO: Combine this with `BaseFieldBlockInput` -> `getBlockDataWithUpdatedFieldName` and make sure `fieldName` is always unique
        if (!this.fieldName) {
            const slugifiedText = this.text ? this.text.toLowerCase().replace(/[^a-z0-9]/g, "-") : "";
            this.fieldName = slugifiedText;
        }

        return inputToData(SelectOptionBlockData, this);
    }
}

const SelectOptionBlock = createBlock(SelectOptionBlockData, SelectOptionBlockInput, "SelectOption");

export const SelectOptionsBlock = createListBlock({ block: SelectOptionBlock }, "SelectOptionList");
