import { BlockField, createBlock, inputToData } from "@comet/blocks-api";
import { IsUndefinable } from "@comet/cms-api";
import { IsString } from "class-validator";

import { BaseFieldBlockData, BaseFieldBlockInput } from "./base-field.block";

class TextInputBlockData extends BaseFieldBlockData {
    @BlockField({ nullable: true })
    placeholder?: string;
}

class TextInputBlockInput extends BaseFieldBlockInput {
    @IsString()
    @IsUndefinable()
    @BlockField({ nullable: true })
    placeholder?: string;

    transformToBlockData(): TextInputBlockData {
        return inputToData(TextInputBlockData, this);
    }
}

export const TextInputBlock = createBlock(TextInputBlockData, TextInputBlockInput, {
    name: "TextInput",
});
