import { BlockField, createBlock, inputToData } from "@comet/blocks-api";
import { IsOptional, IsString } from "class-validator";

import { BaseFieldBlockData, BaseFieldBlockInput } from "./base-field.block";

class TextAreaBlockData extends BaseFieldBlockData {
    @BlockField({ nullable: true })
    placeholder?: string;
}

class TextAreaBlockInput extends BaseFieldBlockInput {
    @IsString()
    @IsOptional()
    @BlockField({ nullable: true })
    placeholder?: string;

    transformToBlockData(): TextAreaBlockData {
        return inputToData(TextAreaBlockData, super.getBlockDataWithUpdatedFieldName(this));
    }
}

export const TextAreaBlock = createBlock(TextAreaBlockData, TextAreaBlockInput, {
    name: "TextArea",
});