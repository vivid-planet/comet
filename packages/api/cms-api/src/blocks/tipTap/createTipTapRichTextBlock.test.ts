import { validate } from "class-validator";

import { ExternalLinkBlock } from "../ExternalLinkBlock";
import { createLinkBlock } from "../factories/createLinkBlock";
import { encodeLinkData } from "./comet-markdown";
import { createTipTapRichTextBlock } from "./createTipTapRichTextBlock";

describe("createTipTapRichTextBlock validation (markdown)", () => {
    describe("default schema (all supports)", () => {
        const block = createTipTapRichTextBlock({}, "TestDefault");

        it("should accept an empty string", async () => {
            const input = block.blockInputFactory({ markdown: "" });
            const errors = await validate(input);
            expect(errors).toHaveLength(0);
        });

        it("should accept a plain paragraph", async () => {
            const input = block.blockInputFactory({ markdown: "Hello world" });
            const errors = await validate(input);
            expect(errors).toHaveLength(0);
        });

        it("should accept bold text", async () => {
            const input = block.blockInputFactory({ markdown: "**Bold text**" });
            const errors = await validate(input);
            expect(errors).toHaveLength(0);
        });

        it("should accept italic and strike marks", async () => {
            const input = block.blockInputFactory({ markdown: "*italic* and ~~strike~~" });
            const errors = await validate(input);
            expect(errors).toHaveLength(0);
        });

        it("should accept headings", async () => {
            const input = block.blockInputFactory({
                markdown: "# Title\n\n### Subtitle",
            });
            const errors = await validate(input);
            expect(errors).toHaveLength(0);
        });

        it("should accept ordered and bullet lists", async () => {
            const input = block.blockInputFactory({
                markdown: "1. One\n2. Two\n\n- Bullet\n- Item",
            });
            const errors = await validate(input);
            expect(errors).toHaveLength(0);
        });

        it("should accept superscript and subscript marks", async () => {
            const input = block.blockInputFactory({
                markdown: "E=mc^2^ and H~2~O",
            });
            const errors = await validate(input);
            expect(errors).toHaveLength(0);
        });

        it("should accept non-breaking space and soft hyphen", async () => {
            const input = block.blockInputFactory({
                markdown: "before\u00A0after\u00ADhyphen",
            });
            const errors = await validate(input);
            expect(errors).toHaveLength(0);
        });

        it("should reject null content", async () => {
            const input = block.blockInputFactory({ markdown: null });
            const errors = await validate(input);
            expect(errors).toHaveLength(1);
            expect(errors[0].property).toBe("markdown");
        });

        it("should reject a number instead of string", async () => {
            const input = block.blockInputFactory({ markdown: 42 });
            const errors = await validate(input);
            expect(errors).toHaveLength(1);
        });

        it("should reject an object instead of string", async () => {
            const input = block.blockInputFactory({ markdown: { type: "doc" } });
            const errors = await validate(input);
            expect(errors).toHaveLength(1);
        });
    });

    describe("bold-only schema", () => {
        const block = createTipTapRichTextBlock({ supports: ["bold"] }, "TestBoldOnly");

        it("should accept bold text", async () => {
            const input = block.blockInputFactory({ markdown: "**Bold**" });
            const errors = await validate(input);
            expect(errors).toHaveLength(0);
        });

        it("should reject italic (not in supports)", async () => {
            const input = block.blockInputFactory({ markdown: "*Italic*" });
            const errors = await validate(input);
            expect(errors).toHaveLength(1);
        });

        it("should reject headings (not in supports)", async () => {
            const input = block.blockInputFactory({ markdown: "# Title" });
            const errors = await validate(input);
            expect(errors).toHaveLength(1);
        });

        it("should reject ordered lists (not in supports)", async () => {
            const input = block.blockInputFactory({ markdown: "1. One" });
            const errors = await validate(input);
            expect(errors).toHaveLength(1);
        });

        it("should reject non-breaking space (not in supports)", async () => {
            const input = block.blockInputFactory({ markdown: "word\u00A0word" });
            const errors = await validate(input);
            expect(errors).toHaveLength(1);
        });
    });

    describe("schema with block styles", () => {
        const block = createTipTapRichTextBlock(
            {
                supports: ["bold", "heading"],
                blockStyles: [{ name: "intro", appliesTo: ["paragraph"] }, { name: "highlight" }],
            },
            "TestBlockStyles",
        );

        it("should accept a paragraph with blockStyle", async () => {
            const input = block.blockInputFactory({ markdown: "[.intro] Intro text" });
            const errors = await validate(input);
            expect(errors).toHaveLength(0);
        });

        it("should accept a heading with blockStyle", async () => {
            const input = block.blockInputFactory({ markdown: "# [.highlight] Highlighted heading" });
            const errors = await validate(input);
            expect(errors).toHaveLength(0);
        });

        it("should accept a paragraph without blockStyle", async () => {
            const input = block.blockInputFactory({ markdown: "Default text" });
            const errors = await validate(input);
            expect(errors).toHaveLength(0);
        });

        it("should reject an unknown block style", async () => {
            const input = block.blockInputFactory({ markdown: "[.unknownStyle] Some text" });
            const errors = await validate(input);
            expect(errors).toHaveLength(1);
        });
    });

    describe("minimal schema (no supports)", () => {
        const block = createTipTapRichTextBlock({ supports: [] }, "TestMinimal");

        it("should accept a plain paragraph", async () => {
            const input = block.blockInputFactory({ markdown: "Plain text" });
            const errors = await validate(input);
            expect(errors).toHaveLength(0);
        });

        it("should reject bold (not in supports)", async () => {
            const input = block.blockInputFactory({ markdown: "**Bold**" });
            const errors = await validate(input);
            expect(errors).toHaveLength(1);
        });

        it("should reject strike (not in supports)", async () => {
            const input = block.blockInputFactory({ markdown: "~~Struck~~" });
            const errors = await validate(input);
            expect(errors).toHaveLength(1);
        });
    });

    describe("schema with link block", () => {
        const LinkBlock = createLinkBlock({ supportedBlocks: { external: ExternalLinkBlock } }, "TestLink");
        const block = createTipTapRichTextBlock({ link: LinkBlock }, "TestWithLink");

        const validLinkData = {
            attachedBlocks: [
                {
                    type: "external",
                    props: { targetUrl: "https://example.com", openInNewWindow: false },
                },
            ],
            activeType: "external",
        };

        it("should accept text with a valid link", async () => {
            const encoded = encodeLinkData(validLinkData);
            const input = block.blockInputFactory({
                markdown: `[click here](comet-link://${encoded})`,
            });
            const errors = await validate(input);
            expect(errors).toHaveLength(0);
        });

        it("should accept content without any links", async () => {
            const input = block.blockInputFactory({ markdown: "No links" });
            const errors = await validate(input);
            expect(errors).toHaveLength(0);
        });

        it("should return childBlocksInfo for links", () => {
            const encoded1 = encodeLinkData(validLinkData);
            const secondLinkData = {
                ...validLinkData,
                attachedBlocks: [
                    {
                        type: "external",
                        props: { targetUrl: "https://other.com", openInNewWindow: true },
                    },
                ],
            };
            const encoded2 = encodeLinkData(secondLinkData);

            const blockData = block.blockDataFactory({
                markdown: `[first link](comet-link://${encoded1}) and [second link](comet-link://${encoded2})`,
            });

            const childBlocks = blockData.childBlocksInfo();
            expect(childBlocks).toHaveLength(2);

            expect(childBlocks[0].visible).toBe(true);
            expect(childBlocks[0].name).toBe("TestLink");
            expect(childBlocks[0].relJsonPath).toEqual(["markdown", "links[0]"]);

            expect(childBlocks[1].visible).toBe(true);
            expect(childBlocks[1].name).toBe("TestLink");
            expect(childBlocks[1].relJsonPath).toEqual(["markdown", "links[1]"]);
        });

        it("should return empty childBlocksInfo when no links", () => {
            const blockData = block.blockDataFactory({ markdown: "No links" });
            expect(blockData.childBlocksInfo()).toHaveLength(0);
        });

        it("should reject link with invalid link data", async () => {
            const invalidLinkData = {
                attachedBlocks: [{ type: "invalid", props: {} }],
                activeType: "invalid",
            };
            const encoded = encodeLinkData(invalidLinkData);
            const input = block.blockInputFactory({
                markdown: `[bad link](comet-link://${encoded})`,
            });
            const errors = await validate(input);
            expect(errors).toHaveLength(1);
        });
    });

    describe("search text extraction", () => {
        it("should extract text with heading weights", () => {
            const block = createTipTapRichTextBlock({}, "TestSearch");
            const blockData = block.blockDataFactory({
                markdown: "# Title\n\nSome paragraph\n\n## Subtitle",
            });
            const searchText = blockData.searchText();
            expect(searchText).toEqual([{ weight: "h1", text: "Title" }, "Some paragraph", { weight: "h2", text: "Subtitle" }]);
        });

        it("should strip inline marks from search text", () => {
            const block = createTipTapRichTextBlock({}, "TestSearchStrip");
            const blockData = block.blockDataFactory({
                markdown: "**bold** and *italic*",
            });
            const searchText = blockData.searchText();
            expect(searchText).toEqual(["bold and italic"]);
        });

        it("should return empty when indexSearchText is false", () => {
            const block = createTipTapRichTextBlock({ indexSearchText: false }, "TestSearchOff");
            const blockData = block.blockDataFactory({
                markdown: "# Title\n\nParagraph",
            });
            expect(blockData.searchText()).toEqual([]);
        });
    });
});
