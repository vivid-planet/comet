import { BlockCategory } from "../types";
import { createOptionalBlock } from "./createOptionalBlock";

describe("createOptionalBlock", () => {
    it("should override block's values", () => {
        const nameOverride = "override name";
        const block = createOptionalBlock(
            {
                name: "testBlocksBlock",
                displayName: "Test List Block",
                category: BlockCategory.Layout,
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
            },
            {},
            (block) => {
                block.name = nameOverride;
                return block;
            },
        );
        expect(block.name).toBe(nameOverride);
    });
});
