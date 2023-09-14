import {
    BlockData,
    BlockDataInterface,
    BlockInput,
    ChildBlock,
    ChildBlockInput,
    createBlock,
    createListBlock,
    ExtractBlockData,
    ExtractBlockInput,
    inputToData,
} from "@comet/blocks-api";

import { HeadlineBlock } from "./headline.block";

export const TwoListsList = createListBlock({ block: HeadlineBlock }, "TwoListsList");

class TwoListsBlockData extends BlockData {
    @ChildBlock(TwoListsList)
    list1: ExtractBlockData<typeof TwoListsList>;

    @ChildBlock(TwoListsList)
    list2: ExtractBlockData<typeof TwoListsList>;
}

class TwoListsBlockInput extends BlockInput {
    @ChildBlockInput(TwoListsList)
    list1: ExtractBlockInput<typeof TwoListsList>;

    @ChildBlockInput(TwoListsList)
    list2: ExtractBlockInput<typeof TwoListsList>;

    transformToBlockData(): BlockDataInterface {
        return inputToData(TwoListsBlockData, this);
    }
}

export const TwoListsBlock = createBlock(TwoListsBlockData, TwoListsBlockInput, "TwoLists");
