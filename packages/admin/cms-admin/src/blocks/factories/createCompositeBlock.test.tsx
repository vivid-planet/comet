import { describe, expect, it } from "vitest";

import { createCompositeBlock } from "./createCompositeBlock";

describe("createCompositeBlock", () => {
    it("should override block's values", () => {
        const nameOverride = "override name";
        const block = createCompositeBlock(
            {
                name: "testCompositeBlock",
                displayName: "Test List Block",
                blocks: {},
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
