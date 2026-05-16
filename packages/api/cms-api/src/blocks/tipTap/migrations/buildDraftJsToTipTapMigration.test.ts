import { validate } from "class-validator";

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
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
            } as any);
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
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
            } as any);
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
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const data = block.blockDataFactory(input as any);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            expect((data as any).tipTapContent).toEqual(input.tipTapContent);
        });

        it("preserves TipTap-shaped data when no $$version is present", () => {
            const tipTapContent = {
                type: "doc",
                content: [{ type: "paragraph", content: [{ type: "text", text: "pre-existing" }] }],
            };
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const data = block.blockDataFactory({ tipTapContent } as any);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            expect((data as any).tipTapContent).toEqual(tipTapContent);
        });
    });

    describe("validation after migration", () => {
        const block = createTipTapRichTextBlock({ migrateFromDraftJs: true }, "MigratedRichTextValidate");

        it("produces TipTap content that passes input validation", async () => {
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
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
            } as any);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const input = block.blockInputFactory({ tipTapContent: (data as any).tipTapContent });
            const errors = await validate(input);
            expect(errors).toHaveLength(0);
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
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
            } as any);

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const tipTapContent = (data as any).tipTapContent;
            const input = block.blockInputFactory({ tipTapContent });
            const errors = await validate(input);
            expect(errors).toHaveLength(0);

            expect(data.childBlocksInfo()).toHaveLength(1);
            expect(data.childBlocksInfo()[0].name).toBe("MigratedRichTextLink");
        });
    });

    describe("without link block configured", () => {
        const block = createTipTapRichTextBlock({ migrateFromDraftJs: true }, "MigratedRichTextNoLink");

        it("strips link entities and still validates", async () => {
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
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
            } as any);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const tipTapContent = (data as any).tipTapContent;
            const input = block.blockInputFactory({ tipTapContent });
            const errors = await validate(input);
            expect(errors).toHaveLength(0);

            const segments = tipTapContent.content[0].content;
            expect(segments[0].marks).toBeUndefined();
        });
    });

    describe("maxBlocks fallback", () => {
        const block = createTipTapRichTextBlock({ maxBlocks: 2, migrateFromDraftJs: true }, "MigratedRichTextMaxBlocks");

        it("falls back to a valid doc when conversion exceeds maxBlocks", async () => {
            const data = block.blockDataFactory({
                draftContent: {
                    blocks: [
                        draftBlock({ type: "unstyled", text: "one" }),
                        draftBlock({ type: "unstyled", text: "two" }),
                        draftBlock({ type: "unstyled", text: "three" }),
                    ],
                    entityMap: {},
                },
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
            } as any);

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const tipTapContent = (data as any).tipTapContent;
            const input = block.blockInputFactory({ tipTapContent });
            const errors = await validate(input);
            expect(errors).toHaveLength(0);
            expect(tipTapContent.content?.length ?? 0).toBeLessThanOrEqual(2);
        });
    });

    describe("headings", () => {
        const block = createTipTapRichTextBlock({ migrateFromDraftJs: true }, "MigratedRichTextHeading");

        it("preserves a header-one as a TipTap heading level 1", () => {
            const data = block.blockDataFactory({
                draftContent: {
                    blocks: [draftBlock({ type: "header-one", text: "Title" })],
                    entityMap: {},
                },
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
            } as any);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const tipTapContent = (data as any).tipTapContent;
            expect(tipTapContent).toEqual({
                type: "doc",
                content: [
                    {
                        type: "heading",
                        attrs: { level: 1 },
                        content: [{ type: "text", text: "Title" }],
                    },
                ],
            });
        });
    });

    describe("blockStyleMap", () => {
        const block = createTipTapRichTextBlock(
            {
                blockStyles: [{ name: "small", appliesTo: ["paragraph"] }],
                migrateFromDraftJs: { blockStyleMap: { "paragraph-small": "small" } },
            },
            "MigratedRichTextBlockStyleMap",
        );

        it("maps a custom DraftJS block type to a TipTap paragraph with blockStyle", async () => {
            const data = block.blockDataFactory({
                draftContent: {
                    blocks: [draftBlock({ type: "paragraph-small", text: "tiny" })],
                    entityMap: {},
                },
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
            } as any);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const tipTapContent = (data as any).tipTapContent;
            expect(tipTapContent).toEqual({
                type: "doc",
                content: [
                    {
                        type: "paragraph",
                        attrs: { blockStyle: "small" },
                        content: [{ type: "text", text: "tiny" }],
                    },
                ],
            });

            const input = block.blockInputFactory({ tipTapContent });
            const errors = await validate(input);
            expect(errors).toHaveLength(0);
        });
    });

    describe("non-breaking space and soft-hyphen", () => {
        const block = createTipTapRichTextBlock({ migrateFromDraftJs: true }, "MigratedRichTextNbspShy");

        it("converts U+00A0 and U+00AD characters into atom nodes and validates", async () => {
            const data = block.blockDataFactory({
                draftContent: {
                    blocks: [draftBlock({ type: "unstyled", text: "key value soft­hyphen" })],
                    entityMap: {},
                },
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
            } as any);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const tipTapContent = (data as any).tipTapContent;
            expect(tipTapContent.content[0].content).toEqual([
                { type: "text", text: "key" },
                { type: "nonBreakingSpace" },
                { type: "text", text: "value soft" },
                { type: "softHyphen" },
                { type: "text", text: "hyphen" },
            ]);

            const input = block.blockInputFactory({ tipTapContent });
            const errors = await validate(input);
            expect(errors).toHaveLength(0);
        });
    });

    describe("subscript and superscript", () => {
        const block = createTipTapRichTextBlock({ migrateFromDraftJs: true }, "MigratedRichTextSubSup");

        it("maps DraftJS SUP/SUB inline styles to TipTap marks and validates", async () => {
            const data = block.blockDataFactory({
                draftContent: {
                    blocks: [
                        draftBlock({
                            type: "unstyled",
                            text: "H2O E=mc2",
                            inlineStyleRanges: [
                                { style: "SUB", offset: 1, length: 1 },
                                { style: "SUP", offset: 8, length: 1 },
                            ],
                        }),
                    ],
                    entityMap: {},
                },
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
            } as any);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const tipTapContent = (data as any).tipTapContent;
            expect(tipTapContent.content[0].content).toEqual([
                { type: "text", text: "H" },
                { type: "text", text: "2", marks: [{ type: "subscript" }] },
                { type: "text", text: "O E=mc" },
                { type: "text", text: "2", marks: [{ type: "superscript" }] },
            ]);

            const input = block.blockInputFactory({ tipTapContent });
            const errors = await validate(input);
            expect(errors).toHaveLength(0);
        });
    });

    describe("supports filtering during migration", () => {
        const block = createTipTapRichTextBlock({ supports: ["bold"], migrateFromDraftJs: true }, "MigratedRichTextSupportsBold");

        it("drops marks not in supports and still validates", async () => {
            const data = block.blockDataFactory({
                draftContent: {
                    blocks: [
                        draftBlock({
                            type: "unstyled",
                            text: "mixed",
                            inlineStyleRanges: [
                                { style: "BOLD", offset: 0, length: 2 },
                                { style: "ITALIC", offset: 2, length: 3 },
                            ],
                        }),
                    ],
                    entityMap: {},
                },
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
            } as any);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const tipTapContent = (data as any).tipTapContent;
            const input = block.blockInputFactory({ tipTapContent });
            const errors = await validate(input);
            expect(errors).toHaveLength(0);
            const segments = tipTapContent.content[0].content;
            expect(segments[0].marks).toEqual([{ type: "bold" }]);
            expect(segments[1].marks).toBeUndefined();
        });

        it("falls back to paragraph for headings when heading not supported", async () => {
            const data = block.blockDataFactory({
                draftContent: {
                    blocks: [draftBlock({ type: "header-one", text: "Title" })],
                    entityMap: {},
                },
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
            } as any);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const tipTapContent = (data as any).tipTapContent;
            const input = block.blockInputFactory({ tipTapContent });
            const errors = await validate(input);
            expect(errors).toHaveLength(0);
            expect(tipTapContent.content[0].type).toBe("paragraph");
        });
    });
});
