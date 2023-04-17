import { DraftInlineStyleType } from "draft-js";

import { extractRichtextStyles, importRichtextStyles } from "./extractImportRichtextStyles";

describe("extractRichtextStyles", () => {
    it("should insert only one pseudo tags for multiple inline styles with same offset and length", () => {
        const block = {
            key: "5jda2",
            text: "Another Headline in RTE",
            type: "header-three",
            depth: 0,
            inlineStyleRanges: [
                { offset: 8, length: 8, style: "BOLD" as DraftInlineStyleType },
                { offset: 8, length: 8, style: "ITALIC" as DraftInlineStyleType },
            ],
            entityRanges: [],
            data: {},
        };

        expect(extractRichtextStyles(block)).toEqual("Another <i>Headline</i> in RTE");
    });

    it("should insert pseudo tags for both entity ranges and inline styles ", () => {
        const block = {
            key: "5jda2",
            text: "Another Headline in RTE",
            type: "header-three",
            depth: 0,
            inlineStyleRanges: [
                {
                    offset: 12,
                    length: 11,
                    style: "BOLD" as DraftInlineStyleType,
                },
            ],
            entityRanges: [
                {
                    offset: 8,
                    length: 8,
                    key: 0,
                },
            ],
            data: {},
        };

        expect(extractRichtextStyles(block)).toEqual("Another <e>Head<i>line</e> in RTE</i>");
    });

    it("should insert pseudo tags in correct order for an entity range and inline style with same range", () => {
        const block = {
            key: "5jda2",
            text: "Entity and Inline Style with same Ranges",
            type: "header-three",
            depth: 0,
            inlineStyleRanges: [{ offset: 0, length: 40, style: "BOLD" as DraftInlineStyleType }],
            entityRanges: [{ offset: 0, length: 40, key: 0 }],
            data: {},
        };

        expect(extractRichtextStyles(block)).toEqual("<i><e>Entity and Inline Style with same Ranges</e></i>");
    });

    it("should insert pseudo tags in correctly for overlapping inline styles", () => {
        const block = {
            key: "5jda2",
            text: "Inline Styles with overlapping Ranges",
            type: "header-three",
            depth: 0,
            inlineStyleRanges: [
                { offset: 0, length: 37, style: "BOLD" as DraftInlineStyleType },
                { offset: 7, length: 23, style: "ITALIC" as DraftInlineStyleType },
            ],
            entityRanges: [],
            data: {},
        };

        expect(extractRichtextStyles(block)).toEqual("<i>Inline <i>Styles with overlapping</i> Ranges</i>");
    });
});

describe("importRichtextStyles", () => {
    it("should remove pseudo tags for both entity ranges and inline styles and update positions", () => {
        const block = {
            key: "5jda2",
            text: "Another <e>Head<i>line Translation</e> in RTE</i>",
            type: "header-three",
            depth: 0,
            inlineStyleRanges: [
                {
                    offset: 12,
                    length: 11,
                    style: "BOLD" as DraftInlineStyleType,
                },
            ],
            entityRanges: [
                {
                    offset: 8,
                    length: 8,
                    key: 0,
                },
            ],
            data: {},
        };

        expect(importRichtextStyles(block)).toEqual({
            ...block,
            text: "Another Headline Translation in RTE",
            inlineStyleRanges: [{ offset: 12, length: 23, style: "BOLD" as DraftInlineStyleType }],
            entityRanges: [
                {
                    offset: 8,
                    length: 20,
                    key: 0,
                },
            ],
        });
    });
});
