import {
    BlockData,
    BlockDataInterface,
    BlockInput,
    ChildBlock,
    ChildBlockInput,
    createBlock,
    createListBlock,
    ExtractBlockData,
    inputToData,
} from "@comet/blocks-api";
import { ValidateNested } from "class-validator";

import { HeadlineBlock } from "./headline.block";

const TwoListsList = createListBlock({ block: HeadlineBlock }, "TwoListsList");

class TwoListsBlockData extends BlockData {
    @ChildBlock(TwoListsList)
    list1: ExtractBlockData<typeof TwoListsList>;

    @ChildBlock(TwoListsList)
    list2: ExtractBlockData<typeof TwoListsList>;
}

class TwoListsBlockInput extends BlockInput {
    @ChildBlockInput(TwoListsList)
    @ValidateNested()
    list1: ExtractBlockData<typeof TwoListsList>;

    @ChildBlockInput(TwoListsList)
    @ValidateNested()
    list2: ExtractBlockData<typeof TwoListsList>;

    transformToBlockData(): BlockDataInterface {
        return inputToData(TwoListsBlockData, this);
    }
}

export const TwoListsBlock = createBlock(TwoListsBlockData, TwoListsBlockInput, "TwoLists");
