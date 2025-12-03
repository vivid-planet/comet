import { createBlockSkeleton } from "../helpers/createBlockSkeleton";
import { BlockCategory } from "../types";
import { createBlocksBlock } from "./createBlocksBlock";

describe("createBlocksBlock", () => {
    const TestBlock = {
        ...createBlockSkeleton(),
        category: BlockCategory.TextAndContent,
        name: "title",
        displayName: "Title",
        defaultValues: () => ({}),
    };

    const TestBlock2 = TestBlock;

    it("should override block's values", () => {
        const nameOverride = "override name";
        const block = createBlocksBlock(
            {
                name: "testBlocksBlock",
                displayName: "Test List Block",
                supportedBlocks: { TestBlock, TestBlock2 },
            },
            (block) => {
                block.name = nameOverride;
                return block;
            },
        );
        expect(block.name).toBe(nameOverride);
    });
});
