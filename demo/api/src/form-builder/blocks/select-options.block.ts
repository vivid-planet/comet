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
        return inputToData(SelectOptionBlockData, this);
    }
}

const SelectOptionBlock = createBlock(SelectOptionBlockData, SelectOptionBlockInput, "SelectOption");

export const SelectOptionsBlock = createListBlock({ block: SelectOptionBlock }, "SelectOptions");
