import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { ExternalLinkBlock } from "../../ExternalLinkBlock";
import { createLinkBlock } from "../../factories/createLinkBlock";
import { createTipTapRichTextBlock } from "../createTipTapRichTextBlock";
import type { DraftJsContent } from "./convertDraftJsToTipTap";

type DraftBlock = DraftJsContent["blocks"][number];

function draftBlock(overrides: Partial<DraftBlock> = {}): DraftBlock {
    return {
        key: "k",
        type: "unstyled",
        text: "",
        depth: 0,
        inlineStyleRanges: [],
        entityRanges: [],
        ...overrides,
    };
}

describe("createTipTapRichTextBlock with migrateFromDraftJs", () => {
    describe("end-to-end via blockDataFactory", () => {
        const block = createTipTapRichTextBlock({ migrateFromDraftJs: true }, "MigratedRichText");

        it("migrates DraftJS plain paragraph data and sets $$version", () => {
            const data = block.blockDataFactory({
                draftContent: {
                    blocks: [draftBlock({ type: "unstyled", text: "Hello" })],
                    entityMap: {},
                },
            });
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const tipTapContent = (data as any).tipTapContent;
            expect(tipTapContent).toEqual({
                type: "doc",
                content: [{ type: "paragraph", content: [{ type: "text", text: "Hello" }] }],
            });
        });

        it("preserves search text after migration", () => {
            const data = block.blockDataFactory({
                draftContent: {
                    blocks: [draftBlock({ type: "header-one", text: "Title" }), draftBlock({ type: "unstyled", text: "Body" })],
                    entityMap: {},
                },
            });
            const searchText = data.searchText();
            expect(searchText).toEqual([{ weight: "h1", text: "Title" }, "Body"]);
        });

        it("is a no-op for data that already has $$version: 1", () => {
            const input = {
                tipTapContent: {
                    type: "doc",
                    content: [{ type: "paragraph", content: [{ type: "text", text: "already migrated" }] }],
                },
                $$version: 1,
            };
            const data = block.blockDataFactory(input);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            expect((data as any).tipTapContent).toEqual(input.tipTapContent);
        });

        it("preserves TipTap-shaped data when no $$version is present", () => {
            const tipTapContent = {
                type: "doc",
                content: [{ type: "paragraph", content: [{ type: "text", text: "pre-existing" }] }],
            };
            const data = block.blockDataFactory({ tipTapContent });
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            expect((data as any).tipTapContent).toEqual(tipTapContent);
        });
    });

    describe("inline style migration", () => {
        const block = createTipTapRichTextBlock({ migrateFromDraftJs: true }, "MigratedRichTextValidate");

        it("migrates DraftJS inline styles to TipTap marks", () => {
            const data = block.blockDataFactory({
                draftContent: {
                    blocks: [
                        draftBlock({
                            type: "unstyled",
                            text: "bold and italic",
                            inlineStyleRanges: [
                                { style: "BOLD", offset: 0, length: 4 },
                                { style: "ITALIC", offset: 9, length: 6 },
                            ],
                        }),
                    ],
                    entityMap: {},
                },
            });
            expect(data.tipTapContent).toEqual({
                type: "doc",
                content: [
                    {
                        type: "paragraph",
                        content: [
                            { type: "text", text: "bold", marks: [{ type: "bold" }] },
                            { type: "text", text: " and " },
                            { type: "text", text: "italic", marks: [{ type: "italic" }] },
                        ],
                    },
                ],
            });
        });
    });

    describe("with link block", () => {
        const LinkBlock = createLinkBlock({ supportedBlocks: { external: ExternalLinkBlock } }, "MigratedRichTextLink");
        const block = createTipTapRichTextBlock({ link: LinkBlock, migrateFromDraftJs: true }, "MigratedRichTextWithLink");

        it("converts DraftJS LINK entity to a link mark and validates", async () => {
            const data = block.blockDataFactory({
                draftContent: {
                    blocks: [
                        draftBlock({
                            type: "unstyled",
                            text: "click here",
                            entityRanges: [{ key: 0, offset: 0, length: 10 }],
                        }),
                    ],
                    entityMap: {
                        "0": {
                            type: "LINK",
                            mutability: "MUTABLE",
                            data: {
                                attachedBlocks: [{ type: "external", props: { targetUrl: "https://example.com", openInNewWindow: false } }],
                                activeType: "external",
                            },
                        },
                    },
                },
            });

            expect(data.childBlocksInfo()).toHaveLength(1);
            expect(data.childBlocksInfo()[0].name).toBe("MigratedRichTextLink");

            const input = block.blockInputFactory({
                tipTapContent: {
                    type: "doc",
                    content: [
                        {
                            type: "paragraph",
                            content: [
                                {
                                    type: "text",
                                    text: "click here",
                                    marks: [
                                        {
                                            type: "link",
                                            attrs: {
                                                data: {
                                                    attachedBlocks: [
                                                        { type: "external", props: { targetUrl: "https://example.com", openInNewWindow: false } },
                                                    ],
                                                    activeType: "external",
                                                },
                                            },
                                        },
                                    ],
                                },
                            ],
                        },
                    ],
                },
            });
            const errors = await validate(input);
            expect(errors).toHaveLength(0);
        });
    });

    describe("without link block configured", () => {
        const block = createTipTapRichTextBlock({ migrateFromDraftJs: true }, "MigratedRichTextNoLink");

        it("strips link entities when no link block is configured", () => {
            const data = block.blockDataFactory({
                draftContent: {
                    blocks: [
                        draftBlock({
                            type: "unstyled",
                            text: "click here",
                            entityRanges: [{ key: 0, offset: 0, length: 10 }],
                        }),
                    ],
                    entityMap: {
                        "0": { type: "LINK", mutability: "MUTABLE", data: { href: "https://example.com" } },
                    },
                },
            });

            const segments = data.tipTapContent.content?.[0].content;
            expect(segments?.[0].marks).toBeUndefined();
        });
    });

    describe("maxTextBlocks fallback", () => {
        const block = createTipTapRichTextBlock({ maxTextBlocks: 2, migrateFromDraftJs: true }, "MigratedRichTextMaxBlocks");

        it("falls back to a valid doc when conversion exceeds maxTextBlocks", () => {
            const data = block.blockDataFactory({
                draftContent: {
                    blocks: [
                        draftBlock({ type: "unstyled", text: "one" }),
                        draftBlock({ type: "unstyled", text: "two" }),
                        draftBlock({ type: "unstyled", text: "three" }),
                    ],
                    entityMap: {},
                },
            });
            expect(data.tipTapContent.content?.length ?? 0).toBeLessThanOrEqual(2);
        });
    });
});
