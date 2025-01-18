import { BlockField, createBlock, inputToData } from "@comet/blocks-api";
import { IsUndefinable } from "@comet/cms-api";
import { IsEnum, IsString } from "class-validator";

import { BaseFieldBlockData, BaseFieldBlockInput } from "./base-field.block";

const inputTypes = ["text", "email", "phone", "number"];

type InputType = (typeof inputTypes)[number];

class TextInputBlockData extends BaseFieldBlockData {
    @BlockField({ type: "enum", enum: inputTypes })
    inputType: InputType;

    @BlockField({ nullable: true })
    placeholder?: string;

    @BlockField({ nullable: true })
    unit?: string;
}

class TextInputBlockInput extends BaseFieldBlockInput {
    @IsEnum(inputTypes)
    @BlockField({ type: "enum", enum: inputTypes })
    inputType: InputType;

    @IsString()
    @IsUndefinable()
    @BlockField({ nullable: true })
    placeholder?: string;

    @IsString()
    @IsUndefinable()
    @BlockField({ nullable: true })
    unit?: string;

    transformToBlockData(): TextInputBlockData {
        return inputToData(TextInputBlockData, this);
    }
}

export const TextInputBlock = createBlock(TextInputBlockData, TextInputBlockInput, {
    name: "TextInput",
});
