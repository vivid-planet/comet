import { BlockCategory } from "../types";
import { createListBlock } from "./createListBlock";

describe("createListBlock", () => {
    const TestListItemBlock = {
        category: BlockCategory.TextAndContent,
        name: "title",
        displayName: "Title",
        AdminComponent: () => null,
        defaultValues: () => ({}),
        createPreviewState: () => ({}),
        input2State: () => ({}),
        isValid: () => true,
        output2State: () => Promise.resolve({}),
        previewContent: () => [],
        state2Output: () => ({}),
        replaceDependenciesInOutput: () => ({}),
        resolveDependencyPath: () => "",
    };

    it("should use category from factory options", () => {
        const block = createListBlock({
            name: "testListBlock",
            displayName: "Test List Block",
            itemName: "item",
            itemsName: "items",
            category: BlockCategory.Layout,
            minVisibleBlocks: 1,
            maxVisibleBlocks: 3,
            createDefaultListEntry: true,
            block: TestListItemBlock,
        });
        expect(block.category).toBe(BlockCategory.Layout);
    });

    it("should fallback to item's category when none is provided", () => {
        const block = createListBlock({
            name: "testListBlock",
            displayName: "Test List Block",
            itemName: "item",
            itemsName: "items",
            minVisibleBlocks: 1,
            maxVisibleBlocks: 3,
            createDefaultListEntry: true,
            block: TestListItemBlock,
        });
        expect(block.category).toBe(BlockCategory.TextAndContent);
    });

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
