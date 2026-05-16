import { validate } from "class-validator";

import { ExternalLinkBlock } from "../ExternalLinkBlock";
import { createLinkBlock } from "../factories/createLinkBlock";
import { applyMigrations } from "../migrations/applyMigrations";
import { createTipTapRichTextBlock } from "./createTipTapRichTextBlock";
import {
    convertDraftJsToTipTap,
    createDraftJsToTipTapMigration,
    createFallbackContent,
    type DraftBlock,
    type DraftContentState,
    type DraftEntity,
    isDraftJsData,
} from "./draftjs-to-tiptap-migration";

function makeDraftBlock(overrides: Partial<DraftBlock> = {}): DraftBlock {
    return {
        key: "abc123",
        type: "unstyled",
        text: "",
        depth: 0,
        inlineStyleRanges: [],
        entityRanges: [],
        data: {},
        ...overrides,
    };
}

function makeDraftContent(blocks: DraftBlock[], entityMap: Record<string, DraftEntity> = {}): DraftContentState {
    return { blocks, entityMap };
}

describe("isDraftJsData", () => {
    it("should return true for valid DraftJS data", () => {
        expect(isDraftJsData({ draftContent: { blocks: [], entityMap: {} } })).toBe(true);
    });

    it("should return false for TipTap data", () => {
        expect(isDraftJsData({ tipTapContent: { type: "doc", content: [] } })).toBe(false);
    });

    it("should return false for null", () => {
        expect(isDraftJsData(null)).toBe(false);
    });

    it("should return false for undefined", () => {
        expect(isDraftJsData(undefined)).toBe(false);
    });

    it("should return false for empty object", () => {
        expect(isDraftJsData({})).toBe(false);
    });

    it("should return false when draftContent.blocks is not an array", () => {
        expect(isDraftJsData({ draftContent: { blocks: "not-array", entityMap: {} } })).toBe(false);
    });

    it("should return false when draftContent.entityMap is not an object", () => {
        expect(isDraftJsData({ draftContent: { blocks: [], entityMap: "not-object" } })).toBe(false);
    });
});

describe("convertDraftJsToTipTap", () => {
    const allSupports = ["bold", "italic", "strike", "sub", "sup", "heading", "ordered-list", "unordered-list"] as const;
    const supports = [...allSupports];

    describe("empty content", () => {
        it("should produce a valid empty document for no blocks", () => {
            const result = convertDraftJsToTipTap(makeDraftContent([]), supports, false);
            expect(result).toEqual({ type: "doc", content: [{ type: "paragraph" }] });
        });
    });

    describe("unstyled blocks (paragraphs)", () => {
        it("should convert a single unstyled block to a paragraph", () => {
            const draft = makeDraftContent([makeDraftBlock({ text: "Hello world" })]);
            const result = convertDraftJsToTipTap(draft, supports, false);
            expect(result).toEqual({
                type: "doc",
                content: [{ type: "paragraph", content: [{ type: "text", text: "Hello world" }] }],
            });
        });

        it("should convert multiple unstyled blocks to multiple paragraphs", () => {
            const draft = makeDraftContent([
                makeDraftBlock({ key: "a", text: "First" }),
                makeDraftBlock({ key: "b", text: "Second" }),
                makeDraftBlock({ key: "c", text: "Third" }),
            ]);
            const result = convertDraftJsToTipTap(draft, supports, false);
            expect(result.content).toHaveLength(3);
            expect(result.content[0].type).toBe("paragraph");
            expect(result.content[1].type).toBe("paragraph");
            expect(result.content[2].type).toBe("paragraph");
        });

        it("should handle empty text in unstyled block", () => {
            const draft = makeDraftContent([makeDraftBlock({ text: "" })]);
            const result = convertDraftJsToTipTap(draft, supports, false);
            expect(result).toEqual({
                type: "doc",
                content: [{ type: "paragraph" }],
            });
        });
    });

    describe("heading blocks", () => {
        it("should convert header-one to heading level 1", () => {
            const draft = makeDraftContent([makeDraftBlock({ type: "header-one", text: "Title" })]);
            const result = convertDraftJsToTipTap(draft, supports, false);
            expect(result.content[0]).toEqual({
                type: "heading",
                attrs: { level: 1 },
                content: [{ type: "text", text: "Title" }],
            });
        });

        it("should convert header-two to heading level 2", () => {
            const draft = makeDraftContent([makeDraftBlock({ type: "header-two", text: "Subtitle" })]);
            const result = convertDraftJsToTipTap(draft, supports, false);
            expect(result.content[0].attrs.level).toBe(2);
        });

        it("should convert header-three to heading level 3", () => {
            const draft = makeDraftContent([makeDraftBlock({ type: "header-three", text: "H3" })]);
            const result = convertDraftJsToTipTap(draft, supports, false);
            expect(result.content[0].attrs.level).toBe(3);
        });

        it("should convert header-four to heading level 4", () => {
            const draft = makeDraftContent([makeDraftBlock({ type: "header-four", text: "H4" })]);
            const result = convertDraftJsToTipTap(draft, supports, false);
            expect(result.content[0].attrs.level).toBe(4);
        });

        it("should convert header-five to heading level 5", () => {
            const draft = makeDraftContent([makeDraftBlock({ type: "header-five", text: "H5" })]);
            const result = convertDraftJsToTipTap(draft, supports, false);
            expect(result.content[0].attrs.level).toBe(5);
        });

        it("should convert header-six to heading level 6", () => {
            const draft = makeDraftContent([makeDraftBlock({ type: "header-six", text: "H6" })]);
            const result = convertDraftJsToTipTap(draft, supports, false);
            expect(result.content[0].attrs.level).toBe(6);
        });

        it("should fall back to paragraph when headings not supported", () => {
            const draft = makeDraftContent([makeDraftBlock({ type: "header-one", text: "Title" })]);
            const result = convertDraftJsToTipTap(draft, ["bold", "italic"], false);
            expect(result.content[0]).toEqual({
                type: "paragraph",
                content: [{ type: "text", text: "Title" }],
            });
        });
    });

    describe("inline styles", () => {
        it("should convert BOLD to bold mark", () => {
            const draft = makeDraftContent([
                makeDraftBlock({
                    text: "Bold text",
                    inlineStyleRanges: [{ style: "BOLD", offset: 0, length: 4 }],
                }),
            ]);
            const result = convertDraftJsToTipTap(draft, supports, false);
            const content = result.content[0].content;
            expect(content[0]).toEqual({ type: "text", text: "Bold", marks: [{ type: "bold" }] });
            expect(content[1]).toEqual({ type: "text", text: " text" });
        });

        it("should convert ITALIC to italic mark", () => {
            const draft = makeDraftContent([
                makeDraftBlock({
                    text: "Italic text",
                    inlineStyleRanges: [{ style: "ITALIC", offset: 0, length: 6 }],
                }),
            ]);
            const result = convertDraftJsToTipTap(draft, supports, false);
            expect(result.content[0].content[0].marks).toEqual([{ type: "italic" }]);
        });

        it("should convert STRIKETHROUGH to strike mark", () => {
            const draft = makeDraftContent([
                makeDraftBlock({
                    text: "Struck text",
                    inlineStyleRanges: [{ style: "STRIKETHROUGH", offset: 0, length: 6 }],
                }),
            ]);
            const result = convertDraftJsToTipTap(draft, supports, false);
            expect(result.content[0].content[0].marks).toEqual([{ type: "strike" }]);
        });

        it("should convert SUP to superscript mark", () => {
            const draft = makeDraftContent([
                makeDraftBlock({
                    text: "x2",
                    inlineStyleRanges: [{ style: "SUP", offset: 1, length: 1 }],
                }),
            ]);
            const result = convertDraftJsToTipTap(draft, supports, false);
            expect(result.content[0].content[1].marks).toEqual([{ type: "superscript" }]);
        });

        it("should convert SUB to subscript mark", () => {
            const draft = makeDraftContent([
                makeDraftBlock({
                    text: "H2O",
                    inlineStyleRanges: [{ style: "SUB", offset: 1, length: 1 }],
                }),
            ]);
            const result = convertDraftJsToTipTap(draft, supports, false);
            expect(result.content[0].content[1].marks).toEqual([{ type: "subscript" }]);
        });

        it("should handle multiple overlapping inline styles", () => {
            const draft = makeDraftContent([
                makeDraftBlock({
                    text: "Bold and italic",
                    inlineStyleRanges: [
                        { style: "BOLD", offset: 0, length: 15 },
                        { style: "ITALIC", offset: 9, length: 6 },
                    ],
                }),
            ]);
            const result = convertDraftJsToTipTap(draft, supports, false);
            const content = result.content[0].content;
            // "Bold and " is bold, "italic" is bold+italic
            expect(content[0]).toEqual({ type: "text", text: "Bold and ", marks: [{ type: "bold" }] });
            expect(content[1].marks).toEqual(expect.arrayContaining([{ type: "bold" }, { type: "italic" }]));
        });

        it("should drop unsupported inline styles", () => {
            const draft = makeDraftContent([
                makeDraftBlock({
                    text: "Bold text",
                    inlineStyleRanges: [{ style: "BOLD", offset: 0, length: 4 }],
                }),
            ]);
            // supports without bold
            const result = convertDraftJsToTipTap(draft, ["italic", "strike"], false);
            const content = result.content[0].content;
            // Bold mark should be dropped
            expect(content[0]).toEqual({ type: "text", text: "Bold text" });
        });

        it("should drop UNDERLINE style (not supported by TipTap)", () => {
            const draft = makeDraftContent([
                makeDraftBlock({
                    text: "Underlined",
                    inlineStyleRanges: [{ style: "UNDERLINE", offset: 0, length: 10 }],
                }),
            ]);
            const result = convertDraftJsToTipTap(draft, supports, false);
            expect(result.content[0].content[0]).toEqual({ type: "text", text: "Underlined" });
        });

        it("should drop CODE style (not supported by TipTap)", () => {
            const draft = makeDraftContent([
                makeDraftBlock({
                    text: "Code text",
                    inlineStyleRanges: [{ style: "CODE", offset: 0, length: 4 }],
                }),
            ]);
            const result = convertDraftJsToTipTap(draft, supports, false);
            expect(result.content[0].content[0]).toEqual({ type: "text", text: "Code text" });
        });

        it("should handle style ranges in the middle of text", () => {
            const draft = makeDraftContent([
                makeDraftBlock({
                    text: "Hello bold world",
                    inlineStyleRanges: [{ style: "BOLD", offset: 6, length: 4 }],
                }),
            ]);
            const result = convertDraftJsToTipTap(draft, supports, false);
            const content = result.content[0].content;
            expect(content).toHaveLength(3);
            expect(content[0]).toEqual({ type: "text", text: "Hello " });
            expect(content[1]).toEqual({ type: "text", text: "bold", marks: [{ type: "bold" }] });
            expect(content[2]).toEqual({ type: "text", text: " world" });
        });

        it("should merge adjacent segments with identical marks", () => {
            const draft = makeDraftContent([
                makeDraftBlock({
                    text: "ABCD",
                    inlineStyleRanges: [
                        { style: "BOLD", offset: 0, length: 2 },
                        { style: "BOLD", offset: 2, length: 2 },
                    ],
                }),
            ]);
            const result = convertDraftJsToTipTap(draft, supports, false);
            // Should merge into a single bold text node
            expect(result.content[0].content).toHaveLength(1);
            expect(result.content[0].content[0]).toEqual({ type: "text", text: "ABCD", marks: [{ type: "bold" }] });
        });
    });

    describe("entity ranges (links)", () => {
        it("should convert LINK entities to link marks", () => {
            const linkData = { type: "external", props: { targetUrl: "https://example.com", openInNewWindow: false } };
            const draft = makeDraftContent(
                [
                    makeDraftBlock({
                        text: "Click here",
                        entityRanges: [{ offset: 0, length: 10, key: 0 }],
                    }),
                ],
                { "0": { type: "LINK", mutability: "MUTABLE", data: linkData } },
            );
            const result = convertDraftJsToTipTap(draft, supports, true);
            expect(result.content[0].content[0].marks).toEqual([{ type: "link", attrs: { data: linkData } }]);
        });

        it("should handle link in the middle of text", () => {
            const linkData = { type: "external", props: { targetUrl: "https://example.com", openInNewWindow: false } };
            const draft = makeDraftContent(
                [
                    makeDraftBlock({
                        text: "See this link here",
                        entityRanges: [{ offset: 4, length: 9, key: 0 }],
                    }),
                ],
                { "0": { type: "LINK", mutability: "MUTABLE", data: linkData } },
            );
            const result = convertDraftJsToTipTap(draft, supports, true);
            const content = result.content[0].content;
            expect(content).toHaveLength(3);
            expect(content[0]).toEqual({ type: "text", text: "See " });
            expect(content[1]).toEqual({ type: "text", text: "this link", marks: [{ type: "link", attrs: { data: linkData } }] });
            expect(content[2]).toEqual({ type: "text", text: " here" });
        });

        it("should handle bold text with link", () => {
            const linkData = { type: "external", props: { targetUrl: "https://example.com", openInNewWindow: false } };
            const draft = makeDraftContent(
                [
                    makeDraftBlock({
                        text: "Click here",
                        inlineStyleRanges: [{ style: "BOLD", offset: 0, length: 10 }],
                        entityRanges: [{ offset: 0, length: 10, key: 0 }],
                    }),
                ],
                { "0": { type: "LINK", mutability: "MUTABLE", data: linkData } },
            );
            const result = convertDraftJsToTipTap(draft, supports, true);
            expect(result.content[0].content[0].marks).toEqual(
                expect.arrayContaining([{ type: "bold" }, { type: "link", attrs: { data: linkData } }]),
            );
        });

        it("should ignore link entities when hasLink is false", () => {
            const draft = makeDraftContent(
                [
                    makeDraftBlock({
                        text: "Click here",
                        entityRanges: [{ offset: 0, length: 10, key: 0 }],
                    }),
                ],
                { "0": { type: "LINK", mutability: "MUTABLE", data: {} } },
            );
            const result = convertDraftJsToTipTap(draft, supports, false);
            expect(result.content[0].content[0]).toEqual({ type: "text", text: "Click here" });
        });

        it("should handle multiple links in one block", () => {
            const linkData1 = { type: "external", props: { targetUrl: "https://one.com", openInNewWindow: false } };
            const linkData2 = { type: "external", props: { targetUrl: "https://two.com", openInNewWindow: false } };
            const draft = makeDraftContent(
                [
                    makeDraftBlock({
                        text: "Link1 and Link2",
                        entityRanges: [
                            { offset: 0, length: 5, key: 0 },
                            { offset: 10, length: 5, key: 1 },
                        ],
                    }),
                ],
                {
                    "0": { type: "LINK", mutability: "MUTABLE", data: linkData1 },
                    "1": { type: "LINK", mutability: "MUTABLE", data: linkData2 },
                },
            );
            const result = convertDraftJsToTipTap(draft, supports, true);
            const content = result.content[0].content;
            expect(content).toHaveLength(3);
            expect(content[0].marks[0].attrs.data).toEqual(linkData1);
            expect(content[2].marks[0].attrs.data).toEqual(linkData2);
        });
    });

    describe("list blocks", () => {
        it("should group consecutive unordered-list-items into a bulletList", () => {
            const draft = makeDraftContent([
                makeDraftBlock({ key: "a", type: "unordered-list-item", text: "Item 1" }),
                makeDraftBlock({ key: "b", type: "unordered-list-item", text: "Item 2" }),
            ]);
            const result = convertDraftJsToTipTap(draft, supports, false);
            expect(result.content).toHaveLength(1);
            expect(result.content[0].type).toBe("bulletList");
            expect(result.content[0].content).toHaveLength(2);
            expect(result.content[0].content[0].type).toBe("listItem");
            expect(result.content[0].content[1].type).toBe("listItem");
        });

        it("should group consecutive ordered-list-items into an orderedList", () => {
            const draft = makeDraftContent([
                makeDraftBlock({ key: "a", type: "ordered-list-item", text: "First" }),
                makeDraftBlock({ key: "b", type: "ordered-list-item", text: "Second" }),
            ]);
            const result = convertDraftJsToTipTap(draft, supports, false);
            expect(result.content).toHaveLength(1);
            expect(result.content[0].type).toBe("orderedList");
            expect(result.content[0].content).toHaveLength(2);
        });

        it("should separate different list types", () => {
            const draft = makeDraftContent([
                makeDraftBlock({ key: "a", type: "unordered-list-item", text: "Bullet" }),
                makeDraftBlock({ key: "b", type: "ordered-list-item", text: "Number" }),
            ]);
            const result = convertDraftJsToTipTap(draft, supports, false);
            expect(result.content).toHaveLength(2);
            expect(result.content[0].type).toBe("bulletList");
            expect(result.content[1].type).toBe("orderedList");
        });

        it("should handle list items between paragraphs", () => {
            const draft = makeDraftContent([
                makeDraftBlock({ key: "a", type: "unstyled", text: "Paragraph" }),
                makeDraftBlock({ key: "b", type: "unordered-list-item", text: "Item" }),
                makeDraftBlock({ key: "c", type: "unstyled", text: "Another paragraph" }),
            ]);
            const result = convertDraftJsToTipTap(draft, supports, false);
            expect(result.content).toHaveLength(3);
            expect(result.content[0].type).toBe("paragraph");
            expect(result.content[1].type).toBe("bulletList");
            expect(result.content[2].type).toBe("paragraph");
        });

        it("should fall back to paragraphs when lists not supported", () => {
            const draft = makeDraftContent([
                makeDraftBlock({ key: "a", type: "unordered-list-item", text: "Item 1" }),
                makeDraftBlock({ key: "b", type: "unordered-list-item", text: "Item 2" }),
            ]);
            const result = convertDraftJsToTipTap(draft, ["bold", "italic"], false);
            expect(result.content).toHaveLength(2);
            expect(result.content[0].type).toBe("paragraph");
            expect(result.content[1].type).toBe("paragraph");
        });

        it("should preserve inline styles in list items", () => {
            const draft = makeDraftContent([
                makeDraftBlock({
                    key: "a",
                    type: "unordered-list-item",
                    text: "Bold item",
                    inlineStyleRanges: [{ style: "BOLD", offset: 0, length: 4 }],
                }),
            ]);
            const result = convertDraftJsToTipTap(draft, supports, false);
            const listItemContent = result.content[0].content[0].content[0].content;
            expect(listItemContent[0]).toEqual({ type: "text", text: "Bold", marks: [{ type: "bold" }] });
        });
    });

    describe("mixed content", () => {
        it("should handle a complex document with headings, paragraphs, and lists", () => {
            const draft = makeDraftContent([
                makeDraftBlock({ key: "a", type: "header-one", text: "Title" }),
                makeDraftBlock({ key: "b", type: "unstyled", text: "Intro paragraph" }),
                makeDraftBlock({ key: "c", type: "unordered-list-item", text: "Item 1" }),
                makeDraftBlock({ key: "d", type: "unordered-list-item", text: "Item 2" }),
                makeDraftBlock({ key: "e", type: "unstyled", text: "Conclusion" }),
            ]);
            const result = convertDraftJsToTipTap(draft, supports, false);
            expect(result.content).toHaveLength(4);
            expect(result.content[0].type).toBe("heading");
            expect(result.content[1].type).toBe("paragraph");
            expect(result.content[2].type).toBe("bulletList");
            expect(result.content[3].type).toBe("paragraph");
        });

        it("should handle atomic blocks as paragraphs", () => {
            const draft = makeDraftContent([makeDraftBlock({ type: "atomic", text: " " })]);
            const result = convertDraftJsToTipTap(draft, supports, false);
            expect(result.content[0].type).toBe("paragraph");
        });

        it("should handle unknown block types as paragraphs", () => {
            const draft = makeDraftContent([makeDraftBlock({ type: "blockquote", text: "A quote" })]);
            const result = convertDraftJsToTipTap(draft, supports, false);
            expect(result.content[0].type).toBe("paragraph");
            expect(result.content[0].content[0].text).toBe("A quote");
        });
    });
});

describe("createFallbackContent", () => {
    it("should create paragraphs from non-empty blocks", () => {
        const draft = makeDraftContent([makeDraftBlock({ text: "Hello" }), makeDraftBlock({ text: "World" })]);
        const result = createFallbackContent(draft);
        expect(result.content).toHaveLength(2);
        expect(result.content[0]).toEqual({ type: "paragraph", content: [{ type: "text", text: "Hello" }] });
    });

    it("should skip empty/whitespace blocks", () => {
        const draft = makeDraftContent([makeDraftBlock({ text: "Hello" }), makeDraftBlock({ text: "  " }), makeDraftBlock({ text: "World" })]);
        const result = createFallbackContent(draft);
        expect(result.content).toHaveLength(2);
    });

    it("should produce at least one empty paragraph for completely empty content", () => {
        const draft = makeDraftContent([makeDraftBlock({ text: "" })]);
        const result = createFallbackContent(draft);
        expect(result).toEqual({ type: "doc", content: [{ type: "paragraph" }] });
    });

    it("should strip all formatting", () => {
        const draft = makeDraftContent([
            makeDraftBlock({
                text: "Bold text",
                inlineStyleRanges: [{ style: "BOLD", offset: 0, length: 4 }],
            }),
        ]);
        const result = createFallbackContent(draft);
        expect(result.content[0].content[0]).toEqual({ type: "text", text: "Bold text" });
    });
});

describe("createDraftJsToTipTapMigration", () => {
    describe("basic migration", () => {
        const Migration = createDraftJsToTipTapMigration();

        it("should have toVersion 1", () => {
            const migration = new Migration();
            expect(migration.toVersion).toBe(1);
        });

        it("should support DraftJS data without version", () => {
            const migration = new Migration();
            expect(migration.supports({ draftContent: { blocks: [], entityMap: {} } })).toBe(true);
        });

        it("should support DraftJS data with version 0", () => {
            const migration = new Migration();
            expect(migration.supports({ draftContent: { blocks: [], entityMap: {} }, $$version: 0 })).toBe(true);
        });

        it("should not support non-DraftJS data", () => {
            const migration = new Migration();
            expect(migration.supports({ tipTapContent: { type: "doc" } } as never)).toBe(false);
        });

        it("should not support data with version > 0", () => {
            const migration = new Migration();
            expect(migration.supports({ draftContent: { blocks: [], entityMap: {} }, $$version: 1 })).toBe(false);
        });

        it("should migrate empty DraftJS content to empty TipTap doc", () => {
            const migration = new Migration();
            const result = migration.apply({ draftContent: { blocks: [], entityMap: {} } });
            expect(result.tipTapContent).toEqual({ type: "doc", content: [{ type: "paragraph" }] });
            expect(result.$$version).toBe(1);
        });

        it("should migrate a simple paragraph", () => {
            const migration = new Migration();
            const result = migration.apply({
                draftContent: makeDraftContent([makeDraftBlock({ text: "Hello" })]),
            });
            expect(result.tipTapContent).toEqual({
                type: "doc",
                content: [{ type: "paragraph", content: [{ type: "text", text: "Hello" }] }],
            });
        });

        it("should migrate headings", () => {
            const migration = new Migration();
            const result = migration.apply({
                draftContent: makeDraftContent([makeDraftBlock({ type: "header-two", text: "My Heading" })]),
            });
            expect(result.tipTapContent.content[0]).toEqual({
                type: "heading",
                attrs: { level: 2 },
                content: [{ type: "text", text: "My Heading" }],
            });
        });

        it("should migrate inline styles", () => {
            const migration = new Migration();
            const result = migration.apply({
                draftContent: makeDraftContent([
                    makeDraftBlock({
                        text: "Bold and italic",
                        inlineStyleRanges: [
                            { style: "BOLD", offset: 0, length: 4 },
                            { style: "ITALIC", offset: 9, length: 6 },
                        ],
                    }),
                ]),
            });
            const content = result.tipTapContent.content[0].content;
            expect(content[0].marks).toEqual([{ type: "bold" }]);
            expect(content[2].marks).toEqual([{ type: "italic" }]);
        });

        it("should migrate lists", () => {
            const migration = new Migration();
            const result = migration.apply({
                draftContent: makeDraftContent([
                    makeDraftBlock({ key: "a", type: "unordered-list-item", text: "Item 1" }),
                    makeDraftBlock({ key: "b", type: "unordered-list-item", text: "Item 2" }),
                ]),
            });
            expect(result.tipTapContent.content[0].type).toBe("bulletList");
            expect(result.tipTapContent.content[0].content).toHaveLength(2);
        });
    });

    describe("with limited supports", () => {
        it("should respect supported features", () => {
            const Migration = createDraftJsToTipTapMigration({ supports: ["bold", "italic"] });
            const migration = new Migration();
            const result = migration.apply({
                draftContent: makeDraftContent([
                    makeDraftBlock({
                        text: "Bold and strike",
                        inlineStyleRanges: [
                            { style: "BOLD", offset: 0, length: 4 },
                            { style: "STRIKETHROUGH", offset: 9, length: 6 },
                        ],
                    }),
                ]),
            });
            const content = result.tipTapContent.content[0].content;
            // Bold should be preserved
            expect(content[0].marks).toEqual([{ type: "bold" }]);
            // Strike should be dropped
            const lastNode = content[content.length - 1];
            expect(lastNode.marks).toBeUndefined();
        });
    });

    describe("with link block", () => {
        const LinkBlock = createLinkBlock({ supportedBlocks: { external: ExternalLinkBlock } }, "MigrationTestLink");

        it("should migrate link entities", () => {
            const Migration = createDraftJsToTipTapMigration({ link: LinkBlock });
            const migration = new Migration();
            const linkData = { type: "external", props: { targetUrl: "https://example.com", openInNewWindow: false } };
            const result = migration.apply({
                draftContent: makeDraftContent(
                    [
                        makeDraftBlock({
                            text: "Click here",
                            entityRanges: [{ offset: 0, length: 10, key: 0 }],
                        }),
                    ],
                    { "0": { type: "LINK", mutability: "MUTABLE", data: linkData } },
                ),
            });
            expect(result.tipTapContent.content[0].content[0].marks[0]).toEqual({
                type: "link",
                attrs: { data: linkData },
            });
        });
    });

    describe("validation and fallback", () => {
        it("should produce valid TipTap content that passes validation", async () => {
            const block = createTipTapRichTextBlock({}, "MigrationValidation1");
            const Migration = createDraftJsToTipTapMigration();
            const migration = new Migration();

            const result = migration.apply({
                draftContent: makeDraftContent([
                    makeDraftBlock({ type: "header-one", text: "Title" }),
                    makeDraftBlock({ text: "Some paragraph text" }),
                    makeDraftBlock({
                        text: "Bold text here",
                        inlineStyleRanges: [{ style: "BOLD", offset: 0, length: 4 }],
                    }),
                ]),
            });

            const input = block.blockInputFactory(result);
            const errors = await validate(input);
            expect(errors).toHaveLength(0);
        });

        it("should produce valid content for lists", async () => {
            const block = createTipTapRichTextBlock({}, "MigrationValidation2");
            const Migration = createDraftJsToTipTapMigration();
            const migration = new Migration();

            const result = migration.apply({
                draftContent: makeDraftContent([
                    makeDraftBlock({ key: "a", type: "ordered-list-item", text: "First" }),
                    makeDraftBlock({ key: "b", type: "ordered-list-item", text: "Second" }),
                ]),
            });

            const input = block.blockInputFactory(result);
            const errors = await validate(input);
            expect(errors).toHaveLength(0);
        });

        it("should produce valid content for headings", async () => {
            const block = createTipTapRichTextBlock({}, "MigrationValidation3");
            const Migration = createDraftJsToTipTapMigration();
            const migration = new Migration();

            const result = migration.apply({
                draftContent: makeDraftContent([
                    makeDraftBlock({ type: "header-one", text: "H1" }),
                    makeDraftBlock({ type: "header-two", text: "H2" }),
                    makeDraftBlock({ type: "header-three", text: "H3" }),
                ]),
            });

            const input = block.blockInputFactory(result);
            const errors = await validate(input);
            expect(errors).toHaveLength(0);
        });

        it("should produce valid content for all inline marks", async () => {
            const block = createTipTapRichTextBlock({}, "MigrationValidation4");
            const Migration = createDraftJsToTipTapMigration();
            const migration = new Migration();

            const result = migration.apply({
                draftContent: makeDraftContent([
                    makeDraftBlock({
                        text: "ABCDE",
                        inlineStyleRanges: [
                            { style: "BOLD", offset: 0, length: 1 },
                            { style: "ITALIC", offset: 1, length: 1 },
                            { style: "STRIKETHROUGH", offset: 2, length: 1 },
                            { style: "SUP", offset: 3, length: 1 },
                            { style: "SUB", offset: 4, length: 1 },
                        ],
                    }),
                ]),
            });

            const input = block.blockInputFactory(result);
            const errors = await validate(input);
            expect(errors).toHaveLength(0);
        });

        it("should produce valid content for empty draft content", async () => {
            const block = createTipTapRichTextBlock({}, "MigrationValidation5");
            const Migration = createDraftJsToTipTapMigration();
            const migration = new Migration();

            const result = migration.apply({
                draftContent: makeDraftContent([]),
            });

            const input = block.blockInputFactory(result);
            const errors = await validate(input);
            expect(errors).toHaveLength(0);
        });

        it("should produce valid content for mixed content", async () => {
            const block = createTipTapRichTextBlock({}, "MigrationValidation6");
            const Migration = createDraftJsToTipTapMigration();
            const migration = new Migration();

            const result = migration.apply({
                draftContent: makeDraftContent([
                    makeDraftBlock({ key: "a", type: "header-one", text: "Title" }),
                    makeDraftBlock({ key: "b", text: "Paragraph" }),
                    makeDraftBlock({ key: "c", type: "unordered-list-item", text: "Bullet 1" }),
                    makeDraftBlock({ key: "d", type: "unordered-list-item", text: "Bullet 2" }),
                    makeDraftBlock({ key: "e", type: "ordered-list-item", text: "Number 1" }),
                    makeDraftBlock({ key: "f", text: "End" }),
                ]),
            });

            const input = block.blockInputFactory(result);
            const errors = await validate(input);
            expect(errors).toHaveLength(0);
        });

        it("should produce valid content with link block", async () => {
            const LinkBlock = createLinkBlock({ supportedBlocks: { external: ExternalLinkBlock } }, "MigrationValidation7Link");
            const block = createTipTapRichTextBlock({ link: LinkBlock }, "MigrationValidation7");
            const Migration = createDraftJsToTipTapMigration({ link: LinkBlock });
            const migration = new Migration();

            // DraftJS stores link entities using the full link block format (attachedBlocks, activeType)
            const linkData = {
                attachedBlocks: [{ type: "external", props: { targetUrl: "https://example.com", openInNewWindow: false } }],
                activeType: "external",
            };
            const result = migration.apply({
                draftContent: makeDraftContent(
                    [
                        makeDraftBlock({
                            text: "Click here for more",
                            entityRanges: [{ offset: 0, length: 10, key: 0 }],
                        }),
                    ],
                    { "0": { type: "LINK", mutability: "MUTABLE", data: linkData } },
                ),
            });

            const input = block.blockInputFactory(result);
            const errors = await validate(input);
            expect(errors).toHaveLength(0);
        });

        it("should fall back to plain text if full conversion fails validation", () => {
            // Create a migration with only paragraph support (no heading, no bold, etc.)
            const Migration = createDraftJsToTipTapMigration({ supports: [] });
            const migration = new Migration();

            const result = migration.apply({
                draftContent: makeDraftContent([
                    makeDraftBlock({ type: "header-one", text: "Title" }),
                    makeDraftBlock({
                        text: "Some bold text",
                        inlineStyleRanges: [{ style: "BOLD", offset: 5, length: 4 }],
                    }),
                ]),
            });

            // Should still produce valid content (stripped down)
            expect(result.tipTapContent.type).toBe("doc");
            expect(result.tipTapContent.content.length).toBeGreaterThan(0);
        });
    });

    describe("integration with applyMigrations", () => {
        it("should work with the applyMigrations function", () => {
            const Migration = createDraftJsToTipTapMigration();
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const rawData: any = { draftContent: makeDraftContent([makeDraftBlock({ text: "Hello" })]) };
            const result = applyMigrations(rawData, [Migration], "TestBlock");
            expect(result.tipTapContent).toBeDefined();
            expect(result.$$version).toBe(1);
        });

        it("should skip migration for already-migrated data", () => {
            const Migration = createDraftJsToTipTapMigration();
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const rawData: any = {
                tipTapContent: { type: "doc", content: [{ type: "paragraph" }] },
                $$version: 1,
            };
            const result = applyMigrations(rawData, [Migration], "TestBlock");
            // Should not have been modified
            expect(result.tipTapContent).toEqual({ type: "doc", content: [{ type: "paragraph" }] });
        });

        it("should work with createTipTapRichTextBlock migrate option", () => {
            const Migration = createDraftJsToTipTapMigration();
            const block = createTipTapRichTextBlock({}, { name: "MigratedBlock", migrate: { migrations: [Migration], version: 1 } });

            const draftData = { draftContent: makeDraftContent([makeDraftBlock({ text: "Migrated text" })]) };
            const blockData = block.blockDataFactory(draftData);
            expect(blockData).toBeDefined();
        });
    });

    describe("edge cases", () => {
        it("should handle blocks with only whitespace text", () => {
            const Migration = createDraftJsToTipTapMigration();
            const migration = new Migration();
            const result = migration.apply({
                draftContent: makeDraftContent([makeDraftBlock({ text: "   " })]),
            });
            expect(result.tipTapContent.content[0].type).toBe("paragraph");
        });

        it("should handle blocks with special characters", () => {
            const Migration = createDraftJsToTipTapMigration();
            const migration = new Migration();
            const result = migration.apply({
                draftContent: makeDraftContent([makeDraftBlock({ text: 'Hello "world" <test> & more' })]),
            });
            expect(result.tipTapContent.content[0].content[0].text).toBe('Hello "world" <test> & more');
        });

        it("should handle blocks with unicode text", () => {
            const Migration = createDraftJsToTipTapMigration();
            const migration = new Migration();
            const result = migration.apply({
                draftContent: makeDraftContent([makeDraftBlock({ text: "Héllo Wörld 🌍 日本語" })]),
            });
            expect(result.tipTapContent.content[0].content[0].text).toBe("Héllo Wörld 🌍 日本語");
        });

        it("should handle empty entityMap references gracefully", () => {
            const Migration = createDraftJsToTipTapMigration();
            const migration = new Migration();
            const result = migration.apply({
                draftContent: makeDraftContent([
                    makeDraftBlock({
                        text: "Link text",
                        entityRanges: [{ offset: 0, length: 4, key: 99 }],
                    }),
                ]),
            });
            // Entity 99 doesn't exist, should just produce text without link
            expect(result.tipTapContent.content[0].content[0]).toEqual({ type: "text", text: "Link text" });
        });

        it("should handle style ranges that extend beyond text length", () => {
            const Migration = createDraftJsToTipTapMigration();
            const migration = new Migration();
            const result = migration.apply({
                draftContent: makeDraftContent([
                    makeDraftBlock({
                        text: "Hi",
                        inlineStyleRanges: [{ style: "BOLD", offset: 0, length: 100 }],
                    }),
                ]),
            });
            expect(result.tipTapContent.content[0].content[0]).toEqual({
                type: "text",
                text: "Hi",
                marks: [{ type: "bold" }],
            });
        });

        it("should handle a single empty block", () => {
            const Migration = createDraftJsToTipTapMigration();
            const migration = new Migration();
            const result = migration.apply({
                draftContent: makeDraftContent([makeDraftBlock({ text: "" })]),
            });
            expect(result.tipTapContent).toEqual({ type: "doc", content: [{ type: "paragraph" }] });
        });

        it("should handle many consecutive empty blocks", () => {
            const Migration = createDraftJsToTipTapMigration();
            const migration = new Migration();
            const result = migration.apply({
                draftContent: makeDraftContent([
                    makeDraftBlock({ key: "a", text: "" }),
                    makeDraftBlock({ key: "b", text: "" }),
                    makeDraftBlock({ key: "c", text: "" }),
                ]),
            });
            expect(result.tipTapContent.content).toHaveLength(3);
            for (const node of result.tipTapContent.content) {
                expect(node.type).toBe("paragraph");
            }
        });

        it("should handle deeply nested list items gracefully", () => {
            const Migration = createDraftJsToTipTapMigration();
            const migration = new Migration();
            // DraftJS supports depth for nested lists, but TipTap flat lists don't
            const result = migration.apply({
                draftContent: makeDraftContent([
                    makeDraftBlock({ key: "a", type: "unordered-list-item", text: "Level 0", depth: 0 }),
                    makeDraftBlock({ key: "b", type: "unordered-list-item", text: "Level 1", depth: 1 }),
                    makeDraftBlock({ key: "c", type: "unordered-list-item", text: "Level 2", depth: 2 }),
                ]),
            });
            // All should be flattened into one list
            expect(result.tipTapContent.content).toHaveLength(1);
            expect(result.tipTapContent.content[0].type).toBe("bulletList");
            expect(result.tipTapContent.content[0].content).toHaveLength(3);
        });
    });
});
