// TODO: Move to comet

import { BlockField, createBlock, inputToData } from "@comet/blocks-api";
import { isEmail, IsEnum, IsOptional, IsString, isString, isURL } from "class-validator";

import { BaseFieldBlockData, BaseFieldBlockInput } from "./base-field.block";

enum TextInputType {
    text = "text",
    multilineText = "multilineText",
    email = "email",
    url = "url",
}

class TextInputBlockData extends BaseFieldBlockData {
    @BlockField({ type: "enum", enum: TextInputType })
    type: TextInputType;

    @BlockField({ nullable: true })
    placeholder?: string;

    validateSubmittedInput(value: string): boolean {
        if (!super.requiresValidation(value)) {
            return true;
        }
        if (!isString(value)) {
            return false;
        }
        switch (this.type) {
            case TextInputType.text: {
                return true;
            }
            case TextInputType.multilineText: {
                return true;
            }
            case TextInputType.email: {
                return isEmail(value);
            }
            case TextInputType.url: {
                return isURL(value);
            }
        }
    }
}

class TextInputBlockInput extends BaseFieldBlockInput {
    @IsEnum(TextInputType)
    @BlockField({ type: "enum", enum: TextInputType })
    type: TextInputType;

    @IsString()
    @IsOptional()
    @BlockField({ nullable: true })
    placeholder?: string;

    transformToBlockData(): TextInputBlockData {
        return inputToData(TextInputBlockData, this);
    }
}

export const TextInputBlock = createBlock(TextInputBlockData, TextInputBlockInput, {
    name: "TextInput",
});
