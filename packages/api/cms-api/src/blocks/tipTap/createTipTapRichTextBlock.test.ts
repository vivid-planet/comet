import { validate } from "class-validator";

import { ExternalLinkBlock } from "../ExternalLinkBlock";
import { createLinkBlock } from "../factories/createLinkBlock";
import { createTipTapRichTextBlock } from "./createTipTapRichTextBlock";

describe("createTipTapRichTextBlock validation", () => {
    describe("default schema (all supports)", () => {
        const block = createTipTapRichTextBlock({}, "TestDefault");

        it("should accept a valid empty paragraph", async () => {
            const input = block.blockInputFactory({ tipTapContent: "<p></p>" });
            const errors = await validate(input);
            expect(errors).toHaveLength(0);
        });

        it("should accept a paragraph with text", async () => {
            const input = block.blockInputFactory({ tipTapContent: "<p>Hello world</p>" });
            const errors = await validate(input);
            expect(errors).toHaveLength(0);
        });

        it("should accept bold text", async () => {
            const input = block.blockInputFactory({ tipTapContent: "<p><strong>Bold text</strong></p>" });
            const errors = await validate(input);
            expect(errors).toHaveLength(0);
        });

        it("should accept italic and strike marks", async () => {
            const input = block.blockInputFactory({ tipTapContent: "<p><em><del>Styled</del></em></p>" });
            const errors = await validate(input);
            expect(errors).toHaveLength(0);
        });

        it("should accept headings", async () => {
            const input = block.blockInputFactory({
                tipTapContent: "<h1>Title</h1><h3>Subtitle</h3>",
            });
            const errors = await validate(input);
            expect(errors).toHaveLength(0);
        });

        it("should accept ordered and bullet lists", async () => {
            const input = block.blockInputFactory({
                tipTapContent: "<ol><li>One</li></ol><ul><li>Bullet</li></ul>",
            });
            const errors = await validate(input);
            expect(errors).toHaveLength(0);
        });

        it("should accept superscript and subscript marks", async () => {
            const input = block.blockInputFactory({
                tipTapContent: "<p><sup>sup</sup><sub>sub</sub></p>",
            });
            const errors = await validate(input);
            expect(errors).toHaveLength(0);
        });

        it("should accept non-breaking space and soft hyphen characters", async () => {
            const input = block.blockInputFactory({
                tipTapContent: "<p>before\u00a0after\u00ad</p>",
            });
            const errors = await validate(input);
            expect(errors).toHaveLength(0);
        });

        it("should reject an unknown element", async () => {
            const input = block.blockInputFactory({
                tipTapContent: "<div>test</div>",
            });
            const errors = await validate(input);
            expect(errors).toHaveLength(1);
            expect(errors[0].property).toBe("tipTapContent");
        });

        it("should reject an unsupported inline element", async () => {
            const input = block.blockInputFactory({
                tipTapContent: "<p><u>underline</u></p>",
            });
            const errors = await validate(input);
            expect(errors).toHaveLength(1);
        });

        it("should reject a blockquote (not supported)", async () => {
            const input = block.blockInputFactory({
                tipTapContent: "<blockquote><p>quoted</p></blockquote>",
            });
            const errors = await validate(input);
            expect(errors).toHaveLength(1);
        });

        it("should reject null content", async () => {
            const input = block.blockInputFactory({ tipTapContent: null });
            const errors = await validate(input);
            expect(errors).toHaveLength(1);
        });

        it("should reject a number instead of string", async () => {
            const input = block.blockInputFactory({ tipTapContent: 42 });
            const errors = await validate(input);
            expect(errors).toHaveLength(1);
        });

        it("should reject an object instead of string", async () => {
            const input = block.blockInputFactory({ tipTapContent: {} });
            const errors = await validate(input);
            expect(errors).toHaveLength(1);
        });

        it("should reject unsupported attributes", async () => {
            const input = block.blockInputFactory({
                tipTapContent: '<p style="color:red">text</p>',
            });
            const errors = await validate(input);
            expect(errors).toHaveLength(1);
        });
    });

    describe("bold-only schema", () => {
        const block = createTipTapRichTextBlock({ supports: ["bold"] }, "TestBoldOnly");

        it("should accept bold text", async () => {
            const input = block.blockInputFactory({
                tipTapContent: "<p><strong>Bold</strong></p>",
            });
            const errors = await validate(input);
            expect(errors).toHaveLength(0);
        });

        it("should reject italic (not in supports)", async () => {
            const input = block.blockInputFactory({
                tipTapContent: "<p><em>Italic</em></p>",
            });
            const errors = await validate(input);
            expect(errors).toHaveLength(1);
        });

        it("should reject headings (not in supports)", async () => {
            const input = block.blockInputFactory({
                tipTapContent: "<h1>Title</h1>",
            });
            const errors = await validate(input);
            expect(errors).toHaveLength(1);
        });

        it("should reject ordered lists (not in supports)", async () => {
            const input = block.blockInputFactory({
                tipTapContent: "<ol><li>One</li></ol>",
            });
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

        it("should accept a paragraph with blockStyle class", async () => {
            const input = block.blockInputFactory({
                tipTapContent: '<p class="intro">Intro text</p>',
            });
            const errors = await validate(input);
            expect(errors).toHaveLength(0);
        });

        it("should accept a heading with blockStyle class", async () => {
            const input = block.blockInputFactory({
                tipTapContent: '<h1 class="highlight">Highlighted heading</h1>',
            });
            const errors = await validate(input);
            expect(errors).toHaveLength(0);
        });

        it("should accept a paragraph without blockStyle class", async () => {
            const input = block.blockInputFactory({
                tipTapContent: "<p>Default</p>",
            });
            const errors = await validate(input);
            expect(errors).toHaveLength(0);
        });

        it("should reject an unknown block style", async () => {
            const input = block.blockInputFactory({
                tipTapContent: '<p class="unknownStyle">text</p>',
            });
            const errors = await validate(input);
            expect(errors).toHaveLength(1);
        });

        it("should reject a block style that does not apply to the element type", async () => {
            const input = block.blockInputFactory({
                tipTapContent: '<h1 class="intro">text</h1>',
            });
            const errors = await validate(input);
            expect(errors).toHaveLength(1);
        });
    });

    describe("minimal schema (no supports)", () => {
        const block = createTipTapRichTextBlock({ supports: [] }, "TestMinimal");

        it("should accept a plain paragraph", async () => {
            const input = block.blockInputFactory({
                tipTapContent: "<p>Plain text</p>",
            });
            const errors = await validate(input);
            expect(errors).toHaveLength(0);
        });

        it("should reject bold (not in supports)", async () => {
            const input = block.blockInputFactory({
                tipTapContent: "<p><strong>Bold</strong></p>",
            });
            const errors = await validate(input);
            expect(errors).toHaveLength(1);
        });

        it("should reject strike (not in supports)", async () => {
            const input = block.blockInputFactory({
                tipTapContent: "<p><del>Struck</del></p>",
            });
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

        const encodedValidLink = encodeURIComponent(JSON.stringify(validLinkData));

        it("should accept text with a valid link", async () => {
            const input = block.blockInputFactory({
                tipTapContent: `<p><a href="comet-link://${encodedValidLink}">click here</a></p>`,
            });
            const errors = await validate(input);
            expect(errors).toHaveLength(0);
        });

        it("should accept content without any links", async () => {
            const input = block.blockInputFactory({
                tipTapContent: "<p>No links</p>",
            });
            const errors = await validate(input);
            expect(errors).toHaveLength(0);
        });

        it("should return childBlocksInfo for links", () => {
            const secondLinkData = {
                attachedBlocks: [
                    {
                        type: "external",
                        props: { targetUrl: "https://other.com", openInNewWindow: true },
                    },
                ],
                activeType: "external",
            };
            const encodedSecond = encodeURIComponent(JSON.stringify(secondLinkData));

            const blockData = block.blockDataFactory({
                tipTapContent: `<p><a href="comet-link://${encodedValidLink}">first link</a> and <a href="comet-link://${encodedSecond}">second link</a></p>`,
            });

            const childBlocks = blockData.childBlocksInfo();
            expect(childBlocks).toHaveLength(2);

            expect(childBlocks[0].visible).toBe(true);
            expect(childBlocks[0].name).toBe("TestLink");

            expect(childBlocks[1].visible).toBe(true);
            expect(childBlocks[1].name).toBe("TestLink");
        });

        it("should return empty childBlocksInfo when no links", () => {
            const blockData = block.blockDataFactory({
                tipTapContent: "<p>No links</p>",
            });

            expect(blockData.childBlocksInfo()).toHaveLength(0);
        });

        it("should reject link with invalid link data", async () => {
            const invalidLinkData = {
                attachedBlocks: [{ type: "invalid", props: {} }],
                activeType: "invalid",
            };
            const encodedInvalid = encodeURIComponent(JSON.stringify(invalidLinkData));

            const input = block.blockInputFactory({
                tipTapContent: `<p><a href="comet-link://${encodedInvalid}">bad link</a></p>`,
            });
            const errors = await validate(input);
            expect(errors).toHaveLength(1);
        });

        it("should reject link without comet-link:// prefix", async () => {
            const input = block.blockInputFactory({
                tipTapContent: '<p><a href="https://example.com">bad link</a></p>',
            });
            const errors = await validate(input);
            expect(errors).toHaveLength(1);
        });
    });
});
