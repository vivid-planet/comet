import { describe, expect, it } from "vitest";

import { createBlockSkeleton } from "../helpers/createBlockSkeleton";
import { BlockCategory } from "../types";
import { createOneOfBlock } from "./createOneOfBlock";

describe("createOneOfBlock", () => {
    const TestBlock = {
        ...createBlockSkeleton(),
        category: BlockCategory.TextAndContent,
        name: "title",
        displayName: "Title",
        defaultValues: () => ({}),
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

    it("keeps additional fields, e.g. the title of a link, when converting the output to the state", async () => {
        const block = createOneOfBlock({ name: "Link", displayName: "Link", supportedBlocks: { title: TestBlock } });
        const output = { title: "Contact us", attachedBlocks: [{ type: "title", props: {} }], activeType: "title" };

        const state = await block.output2State(output, {} as Parameters<typeof block.output2State>[1]);

        expect(block.state2Output(state)).toEqual(output);
    });
});
