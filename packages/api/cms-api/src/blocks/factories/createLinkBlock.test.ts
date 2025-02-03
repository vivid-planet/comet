import { InternalLinkBlock } from "../../page-tree/blocks/internal-link.block";
import { ExternalLinkBlock } from "../ExternalLinkBlock";
import { createLinkBlock } from "./createLinkBlock";

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
