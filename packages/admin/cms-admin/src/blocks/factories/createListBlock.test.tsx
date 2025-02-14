import { createBlockSkeleton } from "../helpers/createBlockSkeleton";
import { BlockCategory } from "../types";
import { createListBlock } from "./createListBlock";

describe("createListBlock", () => {
    const TestListItemBlock = {
        ...createBlockSkeleton(),
        category: BlockCategory.TextAndContent,
        name: "title",
        displayName: "Title",
        defaultValues: () => ({}),
    };

    it("should override block's values", () => {
        const nameOverride = "override name";
        const block = createListBlock(
            {
                name: "testListBlock",
                displayName: "Test List Block",
                itemName: "item",
                itemsName: "items",
                minVisibleBlocks: 1,
                maxVisibleBlocks: 3,
                createDefaultListEntry: true,
                block: TestListItemBlock,
            },
            (block) => {
                block.name = nameOverride;
                return block;
            },
        );
        expect(block.name).toBe(nameOverride);
    });
});
