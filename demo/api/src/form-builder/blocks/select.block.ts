import { BlockDataInterface, BlockField, ChildBlock, ChildBlockInput, createBlock, ExtractBlockInput, inputToData } from "@comet/blocks-api";
import { IsEnum, IsOptional, IsString } from "class-validator";

import { BaseFieldBlockData, BaseFieldBlockInput } from "./base-field.block";
import { SelectOptionsBlock } from "./select-options.block";

const selectTypes = ["singleSelect", "multiSelect"];

type SelectType = (typeof selectTypes)[number];

class SelectBlockData extends BaseFieldBlockData {
    @BlockField({ type: "enum", enum: selectTypes })
    selectType: SelectType;

    @BlockField({ nullable: true })
    placeholder?: string;

    @ChildBlock(SelectOptionsBlock)
    options: BlockDataInterface;
}

class SelectBlockInput extends BaseFieldBlockInput {
    @IsEnum(selectTypes)
    @BlockField({ type: "enum", enum: selectTypes })
    selectType: SelectType;

    @IsString()
    @IsOptional()
    @BlockField({ nullable: true })
    placeholder?: string;

    @ChildBlockInput(SelectOptionsBlock)
    options: ExtractBlockInput<typeof SelectOptionsBlock>;

    transformToBlockData(): SelectBlockData {
        return inputToData(SelectBlockData, super.getBlockDataWithUpdatedFieldName(this));
    }
}

export const SelectBlock = createBlock(SelectBlockData, SelectBlockInput, {
    name: "Select",
});
