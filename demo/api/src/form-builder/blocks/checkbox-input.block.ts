// TODO: Move to comet

import { BlockDataInterface, ChildBlock, ChildBlockInput, createBlock, ExtractBlockInput, inputToData } from "@comet/blocks-api";
import { RichTextBlock } from "@src/common/blocks/rich-text.block";

import { BaseFieldBlockData, BaseFieldBlockInput } from "./base-field.block";

class CheckboxInputBlockData extends BaseFieldBlockData {
    @ChildBlock(RichTextBlock)
    text: BlockDataInterface;

    validateSubmittedInput() {
        return true;
    }
}

class CheckboxInputBlockInput extends BaseFieldBlockInput {
    @ChildBlockInput(RichTextBlock)
    text: ExtractBlockInput<typeof RichTextBlock>;

    transformToBlockData(): CheckboxInputBlockData {
        return inputToData(CheckboxInputBlockData, this);
    }
}

export const CheckboxInputBlock = createBlock(CheckboxInputBlockData, CheckboxInputBlockInput, {
    name: "CheckboxInput",
});
