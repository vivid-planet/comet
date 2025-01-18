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
import { IsEnum, IsOptional, IsString } from "class-validator";

import { BaseFieldBlockData, BaseFieldBlockInput } from "./base-field.block";

class OptionBlockData extends BlockData {
    @BlockField()
    text: string;

    @BlockField()
    fieldName: string;
}

class OptionBlockInput extends BlockInput {
    @IsString()
    @IsOptional()
    @BlockField({ nullable: true })
    text?: string;

    @IsString()
    @IsOptional()
    @BlockField({ nullable: true })
    fieldName?: string;

    transformToBlockData(): OptionBlockData {
        return inputToData(OptionBlockData, this);
    }
}

const OptionBlock = createBlock(OptionBlockData, OptionBlockInput, "SelectOption");
const OptionsBlock = createListBlock({ block: OptionBlock }, "SelectOptions");

const selectTypes = ["singleSelect", "multiSelect"];
type SelectType = (typeof selectTypes)[number];

class SelectBlockData extends BaseFieldBlockData {
    @BlockField({ type: "enum", enum: selectTypes })
    selectType: SelectType;

    @BlockField({ nullable: true })
    placeholder?: string;

    @ChildBlock(OptionsBlock)
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

    @ChildBlockInput(OptionsBlock)
    options: ExtractBlockInput<typeof OptionsBlock>;

    transformToBlockData(): SelectBlockData {
        return inputToData(SelectBlockData, this);
    }
}

export const SelectBlock = createBlock(SelectBlockData, SelectBlockInput, "Select");
