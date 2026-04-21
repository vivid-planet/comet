import { validate } from "class-validator";

import { ExternalLinkBlock } from "../ExternalLinkBlock";
import { createLinkBlock } from "../factories/createLinkBlock";
import { createTipTapRichTextBlock } from "./createTipTapRichTextBlock";

describe("createTipTapRichTextBlock validation", () => {
    describe("default schema (all supports)", () => {
        const block = createTipTapRichTextBlock({}, "TestDefault");

        it("should accept a valid empty document", async () => {
            const input = block.blockInputFactory({
                tipTapContent: { type: "doc", content: [{ type: "paragraph" }] },
            });
            const errors = await validate(input);
            expect(errors).toHaveLength(0);
        });

        it("should accept a paragraph with text", async () => {
            const input = block.blockInputFactory({
                tipTapContent: {
                    type: "doc",
                    content: [{ type: "paragraph", content: [{ type: "text", text: "Hello world" }] }],
                },
            });
            const errors = await validate(input);
            expect(errors).toHaveLength(0);
        });

        it("should accept bold text", async () => {
            const input = block.blockInputFactory({
                tipTapContent: {
                    type: "doc",
                    content: [
                        {
                            type: "paragraph",
                            content: [{ type: "text", marks: [{ type: "bold" }], text: "Bold text" }],
                        },
                    ],
                },
            });
            const errors = await validate(input);
            expect(errors).toHaveLength(0);
        });

        it("should accept italic and strike marks", async () => {
            const input = block.blockInputFactory({
                tipTapContent: {
                    type: "doc",
                    content: [
                        {
                            type: "paragraph",
                            content: [{ type: "text", marks: [{ type: "italic" }, { type: "strike" }], text: "Styled" }],
                        },
                    ],
                },
            });
            const errors = await validate(input);
            expect(errors).toHaveLength(0);
        });

        it("should accept headings", async () => {
            const input = block.blockInputFactory({
                tipTapContent: {
                    type: "doc",
                    content: [
                        { type: "heading", attrs: { level: 1 }, content: [{ type: "text", text: "Title" }] },
                        { type: "heading", attrs: { level: 3 }, content: [{ type: "text", text: "Subtitle" }] },
                    ],
                },
            });
            const errors = await validate(input);
            expect(errors).toHaveLength(0);
        });

        it("should accept ordered and bullet lists", async () => {
            const input = block.blockInputFactory({
                tipTapContent: {
                    type: "doc",
                    content: [
                        {
                            type: "orderedList",
                            content: [{ type: "listItem", content: [{ type: "paragraph", content: [{ type: "text", text: "One" }] }] }],
                        },
                        {
                            type: "bulletList",
                            content: [{ type: "listItem", content: [{ type: "paragraph", content: [{ type: "text", text: "Bullet" }] }] }],
                        },
                    ],
                },
            });
            const errors = await validate(input);
            expect(errors).toHaveLength(0);
        });

        it("should accept superscript and subscript marks", async () => {
            const input = block.blockInputFactory({
                tipTapContent: {
                    type: "doc",
                    content: [
                        {
                            type: "paragraph",
                            content: [
                                { type: "text", marks: [{ type: "superscript" }], text: "sup" },
                                { type: "text", marks: [{ type: "subscript" }], text: "sub" },
                            ],
                        },
                    ],
                },
            });
            const errors = await validate(input);
            expect(errors).toHaveLength(0);
        });

        it("should accept nonBreakingSpace and softHyphen nodes", async () => {
            const input = block.blockInputFactory({
                tipTapContent: {
                    type: "doc",
                    content: [
                        {
                            type: "paragraph",
                            content: [
                                { type: "text", text: "before" },
                                { type: "nonBreakingSpace" },
                                { type: "text", text: "after" },
                                { type: "softHyphen" },
                            ],
                        },
                    ],
                },
            });
            const errors = await validate(input);
            expect(errors).toHaveLength(0);
        });

        it("should reject an unknown node type", async () => {
            const input = block.blockInputFactory({
                tipTapContent: {
                    type: "doc",
                    content: [{ type: "unknownBlock", content: [{ type: "text", text: "test" }] }],
                },
            });
            const errors = await validate(input);
            expect(errors).toHaveLength(1);
            expect(errors[0].property).toBe("tipTapContent");
        });

        it("should reject an unknown mark type", async () => {
            const input = block.blockInputFactory({
                tipTapContent: {
                    type: "doc",
                    content: [
                        {
                            type: "paragraph",
                            content: [{ type: "text", marks: [{ type: "highlight" }], text: "test" }],
                        },
                    ],
                },
            });
            const errors = await validate(input);
            expect(errors).toHaveLength(1);
        });

        it("should reject a blockquote (disabled in config)", async () => {
            const input = block.blockInputFactory({
                tipTapContent: {
                    type: "doc",
                    content: [
                        {
                            type: "blockquote",
                            content: [{ type: "paragraph", content: [{ type: "text", text: "quoted" }] }],
                        },
                    ],
                },
            });
            const errors = await validate(input);
            expect(errors).toHaveLength(1);
        });

        it("should reject a codeBlock (disabled in config)", async () => {
            const input = block.blockInputFactory({
                tipTapContent: {
                    type: "doc",
                    content: [{ type: "codeBlock", content: [{ type: "text", text: "code" }] }],
                },
            });
            const errors = await validate(input);
            expect(errors).toHaveLength(1);
        });

        it("should reject null content", async () => {
            const input = block.blockInputFactory({ tipTapContent: null });
            const errors = await validate(input);
            expect(errors).toHaveLength(1);
        });

        it("should reject a string instead of object", async () => {
            const input = block.blockInputFactory({ tipTapContent: "not an object" });
            const errors = await validate(input);
            expect(errors).toHaveLength(1);
        });

        it("should reject an empty object", async () => {
            const input = block.blockInputFactory({ tipTapContent: {} });
            const errors = await validate(input);
            expect(errors).toHaveLength(1);
        });
    });

    describe("bold-only schema", () => {
        const block = createTipTapRichTextBlock({ supports: ["bold"] }, "TestBoldOnly");

        it("should accept bold text", async () => {
            const input = block.blockInputFactory({
                tipTapContent: {
                    type: "doc",
                    content: [
                        {
                            type: "paragraph",
                            content: [{ type: "text", marks: [{ type: "bold" }], text: "Bold" }],
                        },
                    ],
                },
            });
            const errors = await validate(input);
            expect(errors).toHaveLength(0);
        });

        it("should reject italic (not in supports)", async () => {
            const input = block.blockInputFactory({
                tipTapContent: {
                    type: "doc",
                    content: [
                        {
                            type: "paragraph",
                            content: [{ type: "text", marks: [{ type: "italic" }], text: "Italic" }],
                        },
                    ],
                },
            });
            const errors = await validate(input);
            expect(errors).toHaveLength(1);
        });

        it("should reject headings (not in supports)", async () => {
            const input = block.blockInputFactory({
                tipTapContent: {
                    type: "doc",
                    content: [{ type: "heading", attrs: { level: 1 }, content: [{ type: "text", text: "Title" }] }],
                },
            });
            const errors = await validate(input);
            expect(errors).toHaveLength(1);
        });

        it("should reject ordered lists (not in supports)", async () => {
            const input = block.blockInputFactory({
                tipTapContent: {
                    type: "doc",
                    content: [
                        {
                            type: "orderedList",
                            content: [{ type: "listItem", content: [{ type: "paragraph", content: [{ type: "text", text: "One" }] }] }],
                        },
                    ],
                },
            });
            const errors = await validate(input);
            expect(errors).toHaveLength(1);
        });

        it("should reject nonBreakingSpace (not in supports)", async () => {
            const input = block.blockInputFactory({
                tipTapContent: {
                    type: "doc",
                    content: [{ type: "paragraph", content: [{ type: "nonBreakingSpace" }] }],
                },
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

        it("should accept a paragraph with blockStyle attribute", async () => {
            const input = block.blockInputFactory({
                tipTapContent: {
                    type: "doc",
                    content: [
                        {
                            type: "paragraph",
                            attrs: { blockStyle: "intro" },
                            content: [{ type: "text", text: "Intro text" }],
                        },
                    ],
                },
            });
            const errors = await validate(input);
            expect(errors).toHaveLength(0);
        });

        it("should accept a heading with blockStyle attribute", async () => {
            const input = block.blockInputFactory({
                tipTapContent: {
                    type: "doc",
                    content: [
                        {
                            type: "heading",
                            attrs: { level: 1, blockStyle: "highlight" },
                            content: [{ type: "text", text: "Highlighted heading" }],
                        },
                    ],
                },
            });
            const errors = await validate(input);
            expect(errors).toHaveLength(0);
        });

        it("should accept a paragraph with null blockStyle", async () => {
            const input = block.blockInputFactory({
                tipTapContent: {
                    type: "doc",
                    content: [
                        {
                            type: "paragraph",
                            attrs: { blockStyle: null },
                            content: [{ type: "text", text: "Default" }],
                        },
                    ],
                },
            });
            const errors = await validate(input);
            expect(errors).toHaveLength(0);
        });
    });

    describe("minimal schema (no supports)", () => {
        const block = createTipTapRichTextBlock({ supports: [] }, "TestMinimal");

        it("should accept a plain paragraph", async () => {
            const input = block.blockInputFactory({
                tipTapContent: {
                    type: "doc",
                    content: [{ type: "paragraph", content: [{ type: "text", text: "Plain text" }] }],
                },
            });
            const errors = await validate(input);
            expect(errors).toHaveLength(0);
        });

        it("should reject bold (not in supports)", async () => {
            const input = block.blockInputFactory({
                tipTapContent: {
                    type: "doc",
                    content: [
                        {
                            type: "paragraph",
                            content: [{ type: "text", marks: [{ type: "bold" }], text: "Bold" }],
                        },
                    ],
                },
            });
            const errors = await validate(input);
            expect(errors).toHaveLength(1);
        });

        it("should reject strike (not in supports)", async () => {
            const input = block.blockInputFactory({
                tipTapContent: {
                    type: "doc",
                    content: [
                        {
                            type: "paragraph",
                            content: [{ type: "text", marks: [{ type: "strike" }], text: "Struck" }],
                        },
                    ],
                },
            });
            const errors = await validate(input);
            expect(errors).toHaveLength(1);
        });
    });

    describe("schema with link block", () => {
        const LinkBlock = createLinkBlock({ supportedBlocks: { external: ExternalLinkBlock } }, "TestLink");
        const block = createTipTapRichTextBlock({ link: LinkBlock }, "TestWithLink");

        it("should accept text with a valid link mark", async () => {
            const input = block.blockInputFactory({
                tipTapContent: {
                    type: "doc",
                    content: [
                        {
                            type: "paragraph",
                            content: [
                                {
                                    type: "text",
                                    marks: [
                                        {
                                            type: "link",
                                            attrs: {
                                                data: {
                                                    attachedBlocks: [
                                                        {
                                                            type: "external",
                                                            props: { targetUrl: "https://example.com", openInNewWindow: false },
                                                        },
                                                    ],
                                                    activeType: "external",
                                                },
                                            },
                                        },
                                    ],
                                    text: "click here",
                                },
                            ],
                        },
                    ],
                },
            });
            const errors = await validate(input);
            expect(errors).toHaveLength(0);
        });

        it("should accept content without any link marks", async () => {
            const input = block.blockInputFactory({
                tipTapContent: {
                    type: "doc",
                    content: [{ type: "paragraph", content: [{ type: "text", text: "No links" }] }],
                },
            });
            const errors = await validate(input);
            expect(errors).toHaveLength(0);
        });

        it("should return childBlocksInfo for link marks", () => {
            const blockData = block.blockDataFactory({
                tipTapContent: {
                    type: "doc",
                    content: [
                        {
                            type: "paragraph",
                            content: [
                                {
                                    type: "text",
                                    marks: [
                                        {
                                            type: "link",
                                            attrs: {
                                                data: {
                                                    attachedBlocks: [
                                                        {
                                                            type: "external",
                                                            props: { targetUrl: "https://example.com", openInNewWindow: false },
                                                        },
                                                    ],
                                                    activeType: "external",
                                                },
                                            },
                                        },
                                    ],
                                    text: "first link",
                                },
                                { type: "text", text: " and " },
                                {
                                    type: "text",
                                    marks: [
                                        {
                                            type: "link",
                                            attrs: {
                                                data: {
                                                    attachedBlocks: [
                                                        {
                                                            type: "external",
                                                            props: { targetUrl: "https://other.com", openInNewWindow: true },
                                                        },
                                                    ],
                                                    activeType: "external",
                                                },
                                            },
                                        },
                                    ],
                                    text: "second link",
                                },
                            ],
                        },
                    ],
                },
            });

            const childBlocks = blockData.childBlocksInfo();
            expect(childBlocks).toHaveLength(2);

            expect(childBlocks[0].visible).toBe(true);
            expect(childBlocks[0].name).toBe("TestLink");
            expect(childBlocks[0].relJsonPath).toEqual(["tipTapContent", "content", "0", "content", "0", "marks", "0", "attrs", "data"]);

            expect(childBlocks[1].visible).toBe(true);
            expect(childBlocks[1].name).toBe("TestLink");
            expect(childBlocks[1].relJsonPath).toEqual(["tipTapContent", "content", "0", "content", "2", "marks", "0", "attrs", "data"]);
        });

        it("should return empty childBlocksInfo when no link marks", () => {
            const blockData = block.blockDataFactory({
                tipTapContent: {
                    type: "doc",
                    content: [{ type: "paragraph", content: [{ type: "text", text: "No links" }] }],
                },
            });

            expect(blockData.childBlocksInfo()).toHaveLength(0);
        });

        it("should reject link mark with invalid link data", async () => {
            const input = block.blockInputFactory({
                tipTapContent: {
                    type: "doc",
                    content: [
                        {
                            type: "paragraph",
                            content: [
                                {
                                    type: "text",
                                    marks: [
                                        {
                                            type: "link",
                                            attrs: {
                                                data: {
                                                    attachedBlocks: [{ type: "invalid", props: {} }],
                                                    activeType: "invalid",
                                                },
                                            },
                                        },
                                    ],
                                    text: "bad link",
                                },
                            ],
                        },
                    ],
                },
            });
            const errors = await validate(input);
            expect(errors).toHaveLength(1);
        });
    });

    describe("maxBlocks constraint", () => {
        const block = createTipTapRichTextBlock({ maxBlocks: 2 }, "TestMaxBlocks");

        it("should accept content within the maxBlocks limit", async () => {
            const input = block.blockInputFactory({
                tipTapContent: {
                    type: "doc",
                    content: [
                        { type: "paragraph", content: [{ type: "text", text: "First" }] },
                        { type: "paragraph", content: [{ type: "text", text: "Second" }] },
                    ],
                },
            });
            const errors = await validate(input);
            expect(errors).toHaveLength(0);
        });

        it("should accept content with fewer blocks than the limit", async () => {
            const input = block.blockInputFactory({
                tipTapContent: {
                    type: "doc",
                    content: [{ type: "paragraph", content: [{ type: "text", text: "Only one" }] }],
                },
            });
            const errors = await validate(input);
            expect(errors).toHaveLength(0);
        });

        it("should reject content exceeding the maxBlocks limit", async () => {
            const input = block.blockInputFactory({
                tipTapContent: {
                    type: "doc",
                    content: [
                        { type: "paragraph", content: [{ type: "text", text: "First" }] },
                        { type: "paragraph", content: [{ type: "text", text: "Second" }] },
                        { type: "paragraph", content: [{ type: "text", text: "Third" }] },
                    ],
                },
            });
            const errors = await validate(input);
            expect(errors).toHaveLength(1);
            expect(errors[0].property).toBe("tipTapContent");
        });

        it("should accept an empty document (1 empty paragraph) with maxBlocks: 1", async () => {
            const singleBlock = createTipTapRichTextBlock({ maxBlocks: 1 }, "TestMaxBlocksSingle");
            const input = singleBlock.blockInputFactory({
                tipTapContent: { type: "doc", content: [{ type: "paragraph" }] },
            });
            const errors = await validate(input);
            expect(errors).toHaveLength(0);
        });

        it("should reject two blocks when maxBlocks is 1", async () => {
            const singleBlock = createTipTapRichTextBlock({ maxBlocks: 1 }, "TestMaxBlocksSingle2");
            const input = singleBlock.blockInputFactory({
                tipTapContent: {
                    type: "doc",
                    content: [
                        { type: "paragraph", content: [{ type: "text", text: "First" }] },
                        { type: "paragraph", content: [{ type: "text", text: "Second" }] },
                    ],
                },
            });
            const errors = await validate(input);
            expect(errors).toHaveLength(1);
        });
    });
});
