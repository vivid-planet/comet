import { createCompositeBlock, createListBlock } from "@comet/blocks-admin";

import { HeadlineBlock } from "../../common/blocks/HeadlineBlock";

const TwoListsListBlock = createListBlock({
    name: "TwoListsList",
    block: HeadlineBlock,
});

export const TwoListsBlock = createCompositeBlock({
    name: "TwoLists",
    displayName: "Two Lists",
    blocks: {
        list1: {
            block: TwoListsListBlock,
            title: "List 1",
        },
        list2: {
            block: TwoListsListBlock,
            title: "List 2",
        },
    },
});
