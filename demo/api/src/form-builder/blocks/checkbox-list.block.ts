import { BlockDataInterface, ChildBlock, ChildBlockInput, createBlock, ExtractBlockInput, inputToData } from "@comet/blocks-api";

import { BaseFieldBlockData, BaseFieldBlockInput } from "./base-field.block";
import { CheckboxItemsBlock } from "./checkbox-items.block";

class CheckboxListBlockData extends BaseFieldBlockData {
    @ChildBlock(CheckboxItemsBlock)
    items: BlockDataInterface;
}

class CheckboxListBlockInput extends BaseFieldBlockInput {
    @ChildBlockInput(CheckboxItemsBlock)
    items: ExtractBlockInput<typeof CheckboxItemsBlock>;

    transformToBlockData(): CheckboxListBlockData {
        return inputToData(CheckboxListBlockData, super.getBlockDataWithUpdatedFieldName(this));
    }
}

export const CheckboxListBlock = createBlock(CheckboxListBlockData, CheckboxListBlockInput, {
    name: "CheckboxList",
});
