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

class CheckboxInputItemBlockData extends BlockData {
    @BlockField()
    name: string;

    @ChildBlock(RichTextBlock)
    text: ExtractBlockData<typeof RichTextBlock>;
}

class CheckboxInputItemBlockInput extends BlockInput {
    @IsString()
    @BlockField()
    name: string;

    @ChildBlockInput(RichTextBlock)
    text: ExtractBlockInput<typeof RichTextBlock>;

    transformToBlockData(): BlockDataInterface {
        return inputToData(CheckboxInputItemBlockData, this);
    }
}

const CheckboxInputItemBlock = createBlock(CheckboxInputItemBlockData, CheckboxInputItemBlockInput, "CheckboxInputItem");
const CheckboxInputItemListBlock = createListBlock({ block: CheckboxInputItemBlock }, "CheckboxInputItemList");

class CheckboxInputListBlockData extends BaseFieldBlockData {
    @ChildBlock(CheckboxInputItemListBlock)
    items: ExtractBlockData<typeof CheckboxInputItemListBlock>;

    validateSubmittedInput() {
        return true;
    }
}

class CheckboxInputListBlockInput extends BaseFieldBlockInput {
    @ChildBlockInput(CheckboxInputItemListBlock)
    items: ExtractBlockInput<typeof CheckboxInputItemListBlock>;

    transformToBlockData(): CheckboxInputListBlockData {
        return inputToData(CheckboxInputListBlockData, this);
    }
}

export const CheckboxInputListBlock = createBlock(CheckboxInputListBlockData, CheckboxInputListBlockInput, {
    name: "CheckboxInputList",
});
