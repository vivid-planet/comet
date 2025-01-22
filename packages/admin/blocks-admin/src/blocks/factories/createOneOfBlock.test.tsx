import { BlockCategory } from "../types";
import { createOneOfBlock } from "./createOneOfBlock";

describe("createOneOfBlock", () => {
    const TestBlock = {
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

    it("should override block's values", () => {
        const nameOverride = "override name";
        const block = createOneOfBlock(
            {
                name: "testBlocksBlock",
                displayName: "Test List Block",
                supportedBlocks: { TestContentBlock: TestBlock },
            },
            (block) => {
                block.name = nameOverride;
                return block;
            },
        );
        expect(block.name).toBe(nameOverride);
    });
});
