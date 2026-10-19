import { describe, expect, it } from "vitest";

import { BlockData, type BlockDataInterface, BlockInput, blockInputToData, createBlock } from "./block";
import { getBlocksMeta } from "./blocks-meta";
import { ExternalLinkBlock } from "./externalLink/external-link.block";
import { createLinkBlock } from "./factories/createLinkBlock";
import { createTipTapRichTextBlock } from "./tipTap/createTipTapRichTextBlock";

class MetaTestBlockData extends BlockData {}

class MetaTestBlockInput extends BlockInput {
    transformToBlockData(): BlockDataInterface {
        return blockInputToData(MetaTestBlockData, this);
    }
}

describe("getBlocksMeta", () => {
    it("should include the description of a block", () => {
        createBlock(MetaTestBlockData, MetaTestBlockInput, {
            name: "BlocksMetaDescriptionTest",
            description: "A block that exists to be described.",
        });

        const meta = getBlocksMeta().find((block) => block.name === "BlocksMetaDescriptionTest");

        expect(meta?.description).toBe("A block that exists to be described.");
    });

    it("should describe the content a TipTap rich text block accepts", () => {
        const LinkBlock = createLinkBlock({ supportedBlocks: { external: ExternalLinkBlock } }, "BlocksMetaTipTapLink");
        createTipTapRichTextBlock(
            {
                underline: true,
                sub: false,
                textBlocks: [
                    { name: "paragraph", tag: "p", styles: [{ name: "small" }, { name: "large" }], defaultStyle: "large" },
                    { name: "heading-2", tag: "h2" },
                ],
                orderedList: false,
                unorderedList: { styles: [{ name: "compact" }] },
                link: LinkBlock,
                inlineStyles: [{ name: "highlight", appliesTo: ["paragraph"] }, { name: "muted" }],
                placeholders: [{ name: "firstName" }],
                childBlocks: { externalLink: { block: ExternalLinkBlock, display: "inline" } },
                maxTextBlocks: 5,
            },
            "BlocksMetaTipTapTest",
        );

        const meta = getBlocksMeta().find((block) => block.name === "BlocksMetaTipTapTest");

        expect(meta?.inputFields).toEqual([
            {
                name: "tipTapContent",
                kind: "TipTapRichTextBlock",
                nullable: false,
                childBlocks: { externalLink: "ExternalLink" },
                linkBlock: "BlocksMetaTipTapLink",
                contentConfig: {
                    bold: true,
                    italic: true,
                    underline: true,
                    strike: true,
                    sub: false,
                    sup: true,
                    nonBreakingSpace: true,
                    softHyphen: true,
                    textBlocks: [
                        { name: "paragraph", tag: "p", styles: ["small", "large"], defaultStyle: "large" },
                        { name: "heading-2", tag: "h2", styles: [], defaultStyle: null },
                    ],
                    defaultTextBlock: "paragraph",
                    orderedList: false,
                    unorderedList: { styles: ["compact"], defaultStyle: null },
                    inlineStyles: [
                        { name: "highlight", appliesTo: ["paragraph"] },
                        { name: "muted", appliesTo: null },
                    ],
                    placeholders: ["firstName"],
                    childBlockDisplays: { externalLink: "inline" },
                    maxTextBlocks: 5,
                    listLevelMax: null,
                },
            },
        ]);
        expect(meta?.fields).toEqual(meta?.inputFields);
    });
});
