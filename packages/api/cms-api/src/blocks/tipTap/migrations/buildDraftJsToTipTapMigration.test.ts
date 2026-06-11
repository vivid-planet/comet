import type { JSONContent } from "@tiptap/core";
import { describe, expect, it } from "vitest";

import type { BlockDataInterface } from "../../block";
import { ExternalLinkBlock } from "../../ExternalLinkBlock";
import { createLinkBlock } from "../../factories/createLinkBlock";
import { createTipTapRichTextBlock } from "../createTipTapRichTextBlock";
import type { DraftJsContent } from "./convertDraftJsToTipTap";

type DraftBlock = DraftJsContent["blocks"][number];

type TipTapBlockData = BlockDataInterface & { tipTapContent: JSONContent };

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
            }) as TipTapBlockData;
            expect(data.tipTapContent).toEqual({
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
            const data = block.blockDataFactory(input) as TipTapBlockData;
            expect(data.tipTapContent).toEqual(input.tipTapContent);
        });

        it("preserves TipTap-shaped data when no $$version is present", () => {
            const tipTapContent = {
                type: "doc",
                content: [{ type: "paragraph", content: [{ type: "text", text: "pre-existing" }] }],
            };
            const data = block.blockDataFactory({ tipTapContent }) as TipTapBlockData;
            expect(data.tipTapContent).toEqual(tipTapContent);
        });
    });

    describe("inline style marks", () => {
        const block = createTipTapRichTextBlock({ migrateFromDraftJs: true }, "MigratedRichTextInlineStyles");

        it("converts DraftJS inline styles to the matching TipTap marks", () => {
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
            }) as TipTapBlockData;
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

        it("converts DraftJS LINK entity to a link mark and a child block", () => {
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
            }) as TipTapBlockData;
            expect(data.tipTapContent).toMatchObject({
                type: "doc",
                content: [
                    {
                        type: "paragraph",
                        content: [{ type: "text", text: "click here", marks: [{ type: "link" }] }],
                    },
                ],
            });

            expect(data.childBlocksInfo()).toHaveLength(1);
            expect(data.childBlocksInfo()[0].name).toBe("MigratedRichTextLink");
        });
    });

    describe("without link block configured", () => {
        const block = createTipTapRichTextBlock({ migrateFromDraftJs: true }, "MigratedRichTextNoLink");

        it("strips link entities and keeps the plain text", () => {
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
            }) as TipTapBlockData;
            expect(data.tipTapContent).toEqual({
                type: "doc",
                content: [{ type: "paragraph", content: [{ type: "text", text: "click here" }] }],
            });
            expect(data.childBlocksInfo()).toHaveLength(0);
        });
    });

    describe("maxTextBlocks fallback", () => {
        const block = createTipTapRichTextBlock({ maxTextBlocks: 2, migrateFromDraftJs: true }, "MigratedRichTextMaxBlocks");

        it("falls back to an empty doc when conversion exceeds maxTextBlocks", () => {
            const data = block.blockDataFactory({
                draftContent: {
                    blocks: [
                        draftBlock({ type: "unstyled", text: "one" }),
                        draftBlock({ type: "unstyled", text: "two" }),
                        draftBlock({ type: "unstyled", text: "three" }),
                    ],
                    entityMap: {},
                },
            }) as TipTapBlockData;
            // Both the converted doc (3 blocks) and the stripped doc (3 blocks) exceed maxTextBlocks,
            // so the migration falls back to the empty doc.
            expect(data.tipTapContent).toEqual({ type: "doc", content: [{ type: "paragraph" }] });
        });
    });
});
