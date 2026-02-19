import { describe, expect, it } from "vitest";

import { createBlockSkeleton } from "../helpers/createBlockSkeleton";
import { BlockCategory } from "../types";
import { createColumnsBlock } from "./createColumnsBlock";

describe("createColumnsBlock", () => {
    const TestBlock = {
        ...createBlockSkeleton(),
        category: BlockCategory.TextAndContent,
        name: "title",
        displayName: "Title",
        defaultValues: () => ({}),
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
