import { describe, expect, it } from "vitest";

import type { Block } from "../../block";
import { buildStrippedTipTapDoc, convertDraftJsToTipTap, type DraftJsContent } from "./convertDraftJsToTipTap";

const defaultSupports = [
    "bold",
    "italic",
    "strike",
    "sub",
    "sup",
    "heading",
    "ordered-list",
    "unordered-list",
    "non-breaking-space",
    "soft-hyphen",
] as const;

// Minimal Block stub used only for truthiness checks inside the converter
const dummyLinkBlock = { name: "Link" } as unknown as Block;

type DraftBlock = DraftJsContent["blocks"][number];

function makeBlock(overrides: Partial<DraftBlock> = {}): DraftBlock {
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

describe("convertDraftJsToTipTap", () => {
    describe("empty input", () => {
        it("returns minimal doc for undefined input", () => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const result = convertDraftJsToTipTap(undefined as any);
            expect(result).toEqual({ type: "doc", content: [{ type: "paragraph" }] });
        });

        it("returns minimal doc for empty blocks array", () => {
            const result = convertDraftJsToTipTap({ blocks: [], entityMap: {} });
            expect(result).toEqual({ type: "doc", content: [{ type: "paragraph" }] });
        });
    });

    describe("block-type mapping", () => {
        it("maps unstyled to paragraph", () => {
            const result = convertDraftJsToTipTap(
                { blocks: [makeBlock({ type: "unstyled", text: "Hello" })], entityMap: {} },
                { supports: [...defaultSupports] },
            );
            expect(result).toEqual({
                type: "doc",
                content: [{ type: "paragraph", content: [{ type: "text", text: "Hello" }] }],
            });
        });

        it.each([
            ["header-one", 1],
            ["header-two", 2],
            ["header-three", 3],
            ["header-four", 4],
            ["header-five", 5],
            ["header-six", 6],
        ])("maps %s to heading level %d", (type, level) => {
            const result = convertDraftJsToTipTap(
                { blocks: [makeBlock({ type, text: "Title" })], entityMap: {} },
                { supports: [...defaultSupports] },
            );
            expect(result.content).toEqual([{ type: "heading", attrs: { level }, content: [{ type: "text", text: "Title" }] }]);
        });

        it("falls back to paragraph when heading not supported", () => {
            const result = convertDraftJsToTipTap({ blocks: [makeBlock({ type: "header-one", text: "Title" })], entityMap: {} }, { supports: [] });
            expect(result.content).toEqual([{ type: "paragraph", content: [{ type: "text", text: "Title" }] }]);
        });

        it("maps blockquote to paragraph", () => {
            const result = convertDraftJsToTipTap(
                { blocks: [makeBlock({ type: "blockquote", text: "Quote" })], entityMap: {} },
                { supports: [...defaultSupports] },
            );
            expect(result.content).toEqual([{ type: "paragraph", content: [{ type: "text", text: "Quote" }] }]);
        });

        it("maps unknown block type to paragraph", () => {
            const result = convertDraftJsToTipTap(
                { blocks: [makeBlock({ type: "atomic", text: "x" })], entityMap: {} },
                { supports: [...defaultSupports] },
            );
            expect(result.content).toEqual([{ type: "paragraph", content: [{ type: "text", text: "x" }] }]);
        });

        it("emits empty paragraph for empty text", () => {
            const result = convertDraftJsToTipTap(
                { blocks: [makeBlock({ type: "unstyled", text: "" })], entityMap: {} },
                { supports: [...defaultSupports] },
            );
            expect(result.content).toEqual([{ type: "paragraph" }]);
        });

        it("maps a block type from blockStyleMap to a paragraph with blockStyle attr", () => {
            const result = convertDraftJsToTipTap(
                { blocks: [makeBlock({ type: "paragraph-small", text: "tiny" })], entityMap: {} },
                { supports: [...defaultSupports], blockStyleMap: { "paragraph-small": "small" } },
            );
            expect(result.content).toEqual([{ type: "paragraph", attrs: { blockStyle: "small" }, content: [{ type: "text", text: "tiny" }] }]);
        });

        it("blockStyleMap takes precedence over header mapping", () => {
            const result = convertDraftJsToTipTap(
                { blocks: [makeBlock({ type: "header-one", text: "Title" })], entityMap: {} },
                { supports: [...defaultSupports], blockStyleMap: { "header-one": "huge" } },
            );
            expect(result.content).toEqual([{ type: "paragraph", attrs: { blockStyle: "huge" }, content: [{ type: "text", text: "Title" }] }]);
        });
    });

    describe("list grouping", () => {
        it("groups consecutive unordered-list-items into a single bulletList", () => {
            const result = convertDraftJsToTipTap(
                {
                    blocks: [makeBlock({ type: "unordered-list-item", text: "a" }), makeBlock({ type: "unordered-list-item", text: "b" })],
                    entityMap: {},
                },
                { supports: [...defaultSupports] },
            );
            expect(result.content).toEqual([
                {
                    type: "bulletList",
                    content: [
                        { type: "listItem", content: [{ type: "paragraph", content: [{ type: "text", text: "a" }] }] },
                        { type: "listItem", content: [{ type: "paragraph", content: [{ type: "text", text: "b" }] }] },
                    ],
                },
            ]);
        });

        it("groups consecutive ordered-list-items into a single orderedList", () => {
            const result = convertDraftJsToTipTap(
                {
                    blocks: [makeBlock({ type: "ordered-list-item", text: "1" }), makeBlock({ type: "ordered-list-item", text: "2" })],
                    entityMap: {},
                },
                { supports: [...defaultSupports] },
            );
            expect(result.content?.[0].type).toBe("orderedList");
            expect(result.content?.[0].content).toHaveLength(2);
        });

        it("splits alternating ordered and unordered into separate lists", () => {
            const result = convertDraftJsToTipTap(
                {
                    blocks: [makeBlock({ type: "ordered-list-item", text: "1" }), makeBlock({ type: "unordered-list-item", text: "a" })],
                    entityMap: {},
                },
                { supports: [...defaultSupports] },
            );
            expect(result.content).toHaveLength(2);
            expect(result.content?.[0].type).toBe("orderedList");
            expect(result.content?.[1].type).toBe("bulletList");
        });

        it("closes list when followed by an unstyled block", () => {
            const result = convertDraftJsToTipTap(
                {
                    blocks: [makeBlock({ type: "unordered-list-item", text: "a" }), makeBlock({ type: "unstyled", text: "after" })],
                    entityMap: {},
                },
                { supports: [...defaultSupports] },
            );
            expect(result.content).toHaveLength(2);
            expect(result.content?.[0].type).toBe("bulletList");
            expect(result.content?.[1].type).toBe("paragraph");
        });

        it("falls back to paragraph when list type not supported", () => {
            const result = convertDraftJsToTipTap(
                { blocks: [makeBlock({ type: "unordered-list-item", text: "a" })], entityMap: {} },
                { supports: [] },
            );
            expect(result.content).toEqual([{ type: "paragraph", content: [{ type: "text", text: "a" }] }]);
        });

        it("ignores depth and stays flat", () => {
            const result = convertDraftJsToTipTap(
                {
                    blocks: [
                        makeBlock({ type: "unordered-list-item", text: "a", depth: 0 }),
                        makeBlock({ type: "unordered-list-item", text: "b", depth: 2 }),
                    ],
                    entityMap: {},
                },
                { supports: [...defaultSupports] },
            );
            const list = result.content?.[0];
            expect(list?.content).toHaveLength(2);
            expect(list?.content?.[1].content?.[0].content).toEqual([{ type: "text", text: "b" }]);
        });
    });

    describe("inline style ranges", () => {
        it("maps a full-text BOLD range to a single marked text node", () => {
            const result = convertDraftJsToTipTap(
                {
                    blocks: [makeBlock({ type: "unstyled", text: "bold", inlineStyleRanges: [{ style: "BOLD", offset: 0, length: 4 }] })],
                    entityMap: {},
                },
                { supports: [...defaultSupports] },
            );
            expect(result.content?.[0].content).toEqual([{ type: "text", text: "bold", marks: [{ type: "bold" }] }]);
        });

        it("splits substring BOLD into three text nodes", () => {
            const result = convertDraftJsToTipTap(
                {
                    blocks: [makeBlock({ type: "unstyled", text: "abcdef", inlineStyleRanges: [{ style: "BOLD", offset: 2, length: 2 }] })],
                    entityMap: {},
                },
                { supports: [...defaultSupports] },
            );
            expect(result.content?.[0].content).toEqual([
                { type: "text", text: "ab" },
                { type: "text", text: "cd", marks: [{ type: "bold" }] },
                { type: "text", text: "ef" },
            ]);
        });

        it("handles overlapping BOLD and ITALIC", () => {
            const result = convertDraftJsToTipTap(
                {
                    blocks: [
                        makeBlock({
                            type: "unstyled",
                            text: "0123456789",
                            inlineStyleRanges: [
                                { style: "BOLD", offset: 0, length: 6 },
                                { style: "ITALIC", offset: 3, length: 5 },
                            ],
                        }),
                    ],
                    entityMap: {},
                },
                { supports: [...defaultSupports] },
            );
            const segments = result.content?.[0].content;
            expect(segments).toEqual([
                { type: "text", text: "012", marks: [{ type: "bold" }] },
                { type: "text", text: "345", marks: [{ type: "bold" }, { type: "italic" }] },
                { type: "text", text: "67", marks: [{ type: "italic" }] },
                { type: "text", text: "89" },
            ]);
        });

        it("maps STRIKETHROUGH to strike", () => {
            const result = convertDraftJsToTipTap(
                {
                    blocks: [makeBlock({ type: "unstyled", text: "x", inlineStyleRanges: [{ style: "STRIKETHROUGH", offset: 0, length: 1 }] })],
                    entityMap: {},
                },
                { supports: [...defaultSupports] },
            );
            expect(result.content?.[0].content?.[0].marks).toEqual([{ type: "strike" }]);
        });

        it("maps SUP and SUB to superscript and subscript", () => {
            const result = convertDraftJsToTipTap(
                {
                    blocks: [
                        makeBlock({
                            type: "unstyled",
                            text: "xy",
                            inlineStyleRanges: [
                                { style: "SUP", offset: 0, length: 1 },
                                { style: "SUB", offset: 1, length: 1 },
                            ],
                        }),
                    ],
                    entityMap: {},
                },
                { supports: [...defaultSupports] },
            );
            const segments = result.content?.[0].content;
            expect(segments?.[0].marks).toEqual([{ type: "superscript" }]);
            expect(segments?.[1].marks).toEqual([{ type: "subscript" }]);
        });

        it("drops UNDERLINE silently", () => {
            const result = convertDraftJsToTipTap(
                {
                    blocks: [makeBlock({ type: "unstyled", text: "x", inlineStyleRanges: [{ style: "UNDERLINE", offset: 0, length: 1 }] })],
                    entityMap: {},
                },
                { supports: [...defaultSupports] },
            );
            expect(result.content?.[0].content).toEqual([{ type: "text", text: "x" }]);
        });

        it("drops unknown inline styles silently", () => {
            const result = convertDraftJsToTipTap(
                {
                    blocks: [makeBlock({ type: "unstyled", text: "x", inlineStyleRanges: [{ style: "WAT", offset: 0, length: 1 }] })],
                    entityMap: {},
                },
                { supports: [...defaultSupports] },
            );
            expect(result.content?.[0].content).toEqual([{ type: "text", text: "x" }]);
        });

        it("drops BOLD when not in supports", () => {
            const result = convertDraftJsToTipTap(
                {
                    blocks: [makeBlock({ type: "unstyled", text: "x", inlineStyleRanges: [{ style: "BOLD", offset: 0, length: 1 }] })],
                    entityMap: {},
                },
                { supports: ["italic"] },
            );
            expect(result.content?.[0].content).toEqual([{ type: "text", text: "x" }]);
        });

        it("clamps ranges that exceed text length", () => {
            expect(() =>
                convertDraftJsToTipTap(
                    {
                        blocks: [
                            makeBlock({
                                type: "unstyled",
                                text: "abc",
                                inlineStyleRanges: [{ style: "BOLD", offset: 1, length: 99 }],
                            }),
                        ],
                        entityMap: {},
                    },
                    { supports: [...defaultSupports] },
                ),
            ).not.toThrow();
        });
    });

    describe("non-breaking space and soft-hyphen splitting", () => {
        it("splits a U+00A0 character into a nonBreakingSpace atom node", () => {
            const result = convertDraftJsToTipTap(
                { blocks: [makeBlock({ type: "unstyled", text: "a b" })], entityMap: {} },
                { supports: [...defaultSupports] },
            );
            expect(result.content?.[0].content).toEqual([{ type: "text", text: "a" }, { type: "nonBreakingSpace" }, { type: "text", text: "b" }]);
        });

        it("splits a U+00AD character into a softHyphen atom node", () => {
            const result = convertDraftJsToTipTap(
                { blocks: [makeBlock({ type: "unstyled", text: "long­word" })], entityMap: {} },
                { supports: [...defaultSupports] },
            );
            expect(result.content?.[0].content).toEqual([{ type: "text", text: "long" }, { type: "softHyphen" }, { type: "text", text: "word" }]);
        });

        it("preserves marks on text fragments adjacent to atom characters", () => {
            const result = convertDraftJsToTipTap(
                {
                    blocks: [
                        makeBlock({
                            type: "unstyled",
                            text: "a b",
                            inlineStyleRanges: [{ style: "BOLD", offset: 0, length: 3 }],
                        }),
                    ],
                    entityMap: {},
                },
                { supports: [...defaultSupports] },
            );
            expect(result.content?.[0].content).toEqual([
                { type: "text", text: "a", marks: [{ type: "bold" }] },
                { type: "nonBreakingSpace" },
                { type: "text", text: "b", marks: [{ type: "bold" }] },
            ]);
        });

        it("handles consecutive and mixed atom characters", () => {
            const result = convertDraftJsToTipTap(
                { blocks: [makeBlock({ type: "unstyled", text: "a ­b" })], entityMap: {} },
                { supports: [...defaultSupports] },
            );
            expect(result.content?.[0].content).toEqual([
                { type: "text", text: "a" },
                { type: "nonBreakingSpace" },
                { type: "softHyphen" },
                { type: "text", text: "b" },
            ]);
        });

        it("keeps atom characters as plain text when feature is not in supports", () => {
            const result = convertDraftJsToTipTap(
                { blocks: [makeBlock({ type: "unstyled", text: "a b­c" })], entityMap: {} },
                { supports: ["bold"] },
            );
            expect(result.content?.[0].content).toEqual([{ type: "text", text: "a b­c" }]);
        });

        it("splits only the supported atom character when one of the two is disabled", () => {
            const result = convertDraftJsToTipTap(
                { blocks: [makeBlock({ type: "unstyled", text: "a b­c" })], entityMap: {} },
                { supports: ["non-breaking-space"] },
            );
            expect(result.content?.[0].content).toEqual([{ type: "text", text: "a" }, { type: "nonBreakingSpace" }, { type: "text", text: "b­c" }]);
        });
    });

    describe("link entities", () => {
        it("emits a link mark for a LINK entity when link block is provided", () => {
            const result = convertDraftJsToTipTap(
                {
                    blocks: [
                        makeBlock({
                            type: "unstyled",
                            text: "click",
                            entityRanges: [{ key: 0, offset: 0, length: 5 }],
                        }),
                    ],
                    entityMap: { "0": { type: "LINK", mutability: "MUTABLE", data: { href: "https://example.com" } } },
                },
                { supports: [...defaultSupports], link: dummyLinkBlock },
            );
            expect(result.content?.[0].content).toEqual([
                { type: "text", text: "click", marks: [{ type: "link", attrs: { data: { href: "https://example.com" } } }] },
            ]);
        });

        it("does not emit link mark when no link block is provided", () => {
            const result = convertDraftJsToTipTap(
                {
                    blocks: [
                        makeBlock({
                            type: "unstyled",
                            text: "click",
                            entityRanges: [{ key: 0, offset: 0, length: 5 }],
                        }),
                    ],
                    entityMap: { "0": { type: "LINK", mutability: "MUTABLE", data: { href: "https://example.com" } } },
                },
                { supports: [...defaultSupports] },
            );
            expect(result.content?.[0].content).toEqual([{ type: "text", text: "click" }]);
        });

        it("handles multiple link entities in one block", () => {
            const result = convertDraftJsToTipTap(
                {
                    blocks: [
                        makeBlock({
                            type: "unstyled",
                            text: "a b c",
                            entityRanges: [
                                { key: 0, offset: 0, length: 1 },
                                { key: 1, offset: 4, length: 1 },
                            ],
                        }),
                    ],
                    entityMap: {
                        "0": { type: "LINK", mutability: "MUTABLE", data: { href: "https://a.com" } },
                        "1": { type: "LINK", mutability: "MUTABLE", data: { href: "https://c.com" } },
                    },
                },
                { supports: [...defaultSupports], link: dummyLinkBlock },
            );
            const segments = result.content?.[0].content;
            expect(segments?.[0].marks).toEqual([{ type: "link", attrs: { data: { href: "https://a.com" } } }]);
            expect(segments?.[segments.length - 1].marks).toEqual([{ type: "link", attrs: { data: { href: "https://c.com" } } }]);
        });

        it("combines link mark with bold mark on overlapping range", () => {
            const result = convertDraftJsToTipTap(
                {
                    blocks: [
                        makeBlock({
                            type: "unstyled",
                            text: "bold-link",
                            inlineStyleRanges: [{ style: "BOLD", offset: 0, length: 9 }],
                            entityRanges: [{ key: 0, offset: 0, length: 9 }],
                        }),
                    ],
                    entityMap: { "0": { type: "LINK", mutability: "MUTABLE", data: { href: "https://x.com" } } },
                },
                { supports: [...defaultSupports], link: dummyLinkBlock },
            );
            const marks = result.content?.[0].content?.[0].marks;
            expect(marks).toEqual([{ type: "bold" }, { type: "link", attrs: { data: { href: "https://x.com" } } }]);
        });

        it("ignores non-LINK entities", () => {
            const result = convertDraftJsToTipTap(
                {
                    blocks: [
                        makeBlock({
                            type: "unstyled",
                            text: "x",
                            entityRanges: [{ key: 0, offset: 0, length: 1 }],
                        }),
                    ],
                    entityMap: { "0": { type: "IMAGE", mutability: "IMMUTABLE", data: {} } },
                },
                { supports: [...defaultSupports], link: dummyLinkBlock },
            );
            expect(result.content?.[0].content).toEqual([{ type: "text", text: "x" }]);
        });

        it("handles a missing entityMap key without crashing", () => {
            const result = convertDraftJsToTipTap(
                {
                    blocks: [
                        makeBlock({
                            type: "unstyled",
                            text: "x",
                            entityRanges: [{ key: 5, offset: 0, length: 1 }],
                        }),
                    ],
                    entityMap: {},
                },
                { supports: [...defaultSupports], link: dummyLinkBlock },
            );
            expect(result.content?.[0].content).toEqual([{ type: "text", text: "x" }]);
        });
    });
});

describe("buildStrippedTipTapDoc", () => {
    it("returns minimal doc for empty input", () => {
        expect(buildStrippedTipTapDoc({ blocks: [], entityMap: {} })).toEqual({
            type: "doc",
            content: [{ type: "paragraph" }],
        });
    });

    it("emits one paragraph per block with plain text only", () => {
        const result = buildStrippedTipTapDoc({
            blocks: [
                makeBlock({
                    type: "header-one",
                    text: "Hi",
                    inlineStyleRanges: [{ style: "BOLD", offset: 0, length: 2 }],
                }),
                makeBlock({ type: "unordered-list-item", text: "item" }),
            ],
            entityMap: {},
        });
        expect(result).toEqual({
            type: "doc",
            content: [
                { type: "paragraph", content: [{ type: "text", text: "Hi" }] },
                { type: "paragraph", content: [{ type: "text", text: "item" }] },
            ],
        });
    });

    it("emits empty paragraphs for empty text blocks", () => {
        const result = buildStrippedTipTapDoc({
            blocks: [makeBlock({ type: "unstyled", text: "" })],
            entityMap: {},
        });
        expect(result.content).toEqual([{ type: "paragraph" }]);
    });
});
