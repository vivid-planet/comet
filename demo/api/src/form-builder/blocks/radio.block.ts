import { BlockDataInterface, ChildBlock, ChildBlockInput, createBlock, ExtractBlockInput, inputToData } from "@comet/blocks-api";

import { BaseFieldBlockData, BaseFieldBlockInput } from "./base-field.block";
import { RadioItemsBlock } from "./radio-items.block";

class RadioBlockData extends BaseFieldBlockData {
    @ChildBlock(RadioItemsBlock)
    items: BlockDataInterface;
}

class RadioBlockInput extends BaseFieldBlockInput {
    @ChildBlockInput(RadioItemsBlock)
    items: ExtractBlockInput<typeof RadioItemsBlock>;

    transformToBlockData(): RadioBlockData {
        return inputToData(RadioBlockData, this);
    }
}

export const RadioBlock = createBlock(RadioBlockData, RadioBlockInput, {
    name: "Radio",
});
