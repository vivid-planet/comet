import { BlockCategory } from "../types";
import { createColumnsBlock } from "./createColumnsBlock";

describe("createColumnsBlock", () => {
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
        const block = createColumnsBlock(
            {
                name: "testColumnsBlock",
                displayName: "Test List Block",
                contentBlock: TestBlock,
                layouts: [{ name: "test", columns: 1, label: "Test", preview: <div /> }],
            },
            (block) => {
                block.name = nameOverride;
                return block;
            },
        );
        expect(block.name).toBe(nameOverride);
    });
});
