// TODO: Move to comet

import {
    BlockData,
    BlockDataInterface,
    BlockField,
    BlockInput,
    ChildBlock,
    ChildBlockInput,
    createBlock,
    createListBlock,
    ExtractBlockData,
    ExtractBlockInput,
    inputToData,
} from "@comet/blocks-api";
import { RichTextBlock } from "@src/common/blocks/rich-text.block";
import { IsString } from "class-validator";

import { BaseFieldBlockData, BaseFieldBlockInput } from "./base-field.block";

class RadioInputItemBlockData extends BlockData {
    @BlockField()
    name: string;

    @ChildBlock(RichTextBlock)
    text: ExtractBlockData<typeof RichTextBlock>;
}

class RadioInputItemBlockInput extends BlockInput {
    @IsString()
    @BlockField()
    name: string;

    @ChildBlockInput(RichTextBlock)
    text: ExtractBlockInput<typeof RichTextBlock>;

    transformToBlockData(): BlockDataInterface {
        return inputToData(RadioInputItemBlockData, this);
    }
}

const RadioInputItemBlock = createBlock(RadioInputItemBlockData, RadioInputItemBlockInput, "RadioInputItem");
const RadioInputItemListBlock = createListBlock({ block: RadioInputItemBlock }, "RadioInputItemList");

class RadioInputListBlockData extends BaseFieldBlockData {
    @ChildBlock(RadioInputItemListBlock)
    items: ExtractBlockData<typeof RadioInputItemListBlock>;

    validateSubmittedInput() {
        return true;
    }
}

class RadioInputListBlockInput extends BaseFieldBlockInput {
    @ChildBlockInput(RadioInputItemListBlock)
    items: ExtractBlockInput<typeof RadioInputItemListBlock>;

    transformToBlockData(): RadioInputListBlockData {
        return inputToData(RadioInputListBlockData, this);
    }
}

export const RadioInputListBlock = createBlock(RadioInputListBlockData, RadioInputListBlockInput, {
    name: "RadioInputList",
});
