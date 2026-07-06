import { describe, expect, it } from "vitest";

import { createBlockSkeleton } from "../helpers/createBlockSkeleton";
import { BlockCategory } from "../types";
import { createOptionalBlock } from "./createOptionalBlock";

describe("createOptionalBlock", () => {
    it("should override block's values", () => {
        const nameOverride = "override name";
        const block = createOptionalBlock(
            {
                ...createBlockSkeleton(),
                name: "testBlocksBlock",
                displayName: "Test List Block",
                category: BlockCategory.Layout,
                defaultValues: () => ({}),
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
