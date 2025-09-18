import { InternalLinkBlock } from "../../page-tree/blocks/internal-link.block.js";
import { ExternalLinkBlock } from "../ExternalLinkBlock.js";
import { createLinkBlock } from "./createLinkBlock.js";

describe("createLinkBlock", () => {
    it("should have a title", () => {
        const LinkBlock = createLinkBlock({
            supportedBlocks: {
                internal: InternalLinkBlock,
                external: ExternalLinkBlock,
            },
        });

        expect(
            LinkBlock.blockInputFactory({
                attachedBlocks: [],
                activeType: "internal",
                title: "Test",
            })
                .transformToBlockData()
                .transformToSave().title,
        ).toBe("Test");
    });
});
