import { DraftInlineStyleType } from "draft-js";

import { extractRichtextStyles, importRichtextStyles } from "./extractImportRichtextStyles";

describe("extractRichtextStyles", () => {
    it("should insert pseudo tags in correct order for multiple inline styles with same offset and length", () => {
        const block = {
            key: "5jda2",
            text: "Another Headline in RTE",
            type: "header-three",
            depth: 0,
            inlineStyleRanges: [
                {
                    offset: 8,
                    length: 8,
                    style: "BOLD" as DraftInlineStyleType,
                },
                {
                    offset: 8,
                    length: 8,
                    style: "ITALIC" as DraftInlineStyleType,
                },
            ],
            entityRanges: [],
            data: {},
        };

        expect(extractRichtextStyles(block)).toEqual("Another <i1><i2>Headline</i2></i1> in RTE");
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

        expect(extractRichtextStyles(block)).toEqual("Another <e1>Head<i1>line</e1> in RTE</i1>");
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

        expect(extractRichtextStyles(block)).toEqual("<i1><e1>Entity and Inline Style with same Ranges</e1></i1>");
    });

    it("should insert pseudo tags correctly for overlapping inline styles", () => {
        const block = {
            key: "5jda2",
            text: "Inline Styles with overlapping Ranges",
            type: "header-three",
            depth: 0,
            inlineStyleRanges: [
                {
                    offset: 0,
                    length: 25,
                    style: "BOLD" as DraftInlineStyleType,
                },
                {
                    offset: 19,
                    length: 18,
                    style: "ITALIC" as DraftInlineStyleType,
                },
            ],
            entityRanges: [],
            data: {},
        };

        expect(extractRichtextStyles(block)).toEqual("<i1>Inline Styles with <i2>overla</i1>pping Ranges</i2>");
    });

    it("should insert pseudo tags correctly for inline styles with higher indices", () => {
        const block = {
            key: "5jda2",
            text: "Another Text in RTE testing overlapping instyle ranges for bold and italic. Multiple Styles lead to double-digit indices.",
            type: "header-three",
            depth: 0,
            inlineStyleRanges: [
                {
                    offset: 0,
                    length: 7,
                    style: "BOLD" as DraftInlineStyleType,
                },
                {
                    offset: 20,
                    length: 19,
                    style: "BOLD" as DraftInlineStyleType,
                },
                {
                    offset: 59,
                    length: 4,
                    style: "BOLD" as DraftInlineStyleType,
                },
                {
                    offset: 100,
                    length: 6,
                    style: "BOLD" as DraftInlineStyleType,
                },
                {
                    offset: 8,
                    length: 4,
                    style: "ITALIC" as DraftInlineStyleType,
                },
                {
                    offset: 28,
                    length: 26,
                    style: "ITALIC" as DraftInlineStyleType,
                },
                {
                    offset: 68,
                    length: 6,
                    style: "ITALIC" as DraftInlineStyleType,
                },
                {
                    offset: 113,
                    length: 7,
                    style: "ITALIC" as DraftInlineStyleType,
                },
                {
                    offset: 76,
                    length: 8,
                    style: "SUP" as DraftInlineStyleType,
                },
                {
                    offset: 85,
                    length: 6,
                    style: "STRIKETHROUGH" as DraftInlineStyleType,
                },
                {
                    offset: 107,
                    length: 5,
                    style: "SUB" as DraftInlineStyleType,
                },
            ],
            entityRanges: [],
            data: {},
        };

        expect(extractRichtextStyles(block)).toEqual(
            "<i1>Another</i1> <i5>Text</i5> in RTE <i2>testing <i6>overlapping</i2> instyle ranges</i6> for <i3>bold</i3> and <i7>italic</i7>. <i9>Multiple</i9> <i10>Styles</i10> lead to <i4>double</i4>-<i11>digit</i11> <i8>indices</i8>.",
        );
    });
});

describe("importRichtextStyles", () => {
    it("should remove pseudo tags for both entity ranges and inline styles and update positions", () => {
        // original text: "Another <e1>Head<i1>line Translation</e1> in RTE</i1>"
        const block = {
            key: "5jda2",
            text: "Another <e1>Head<i1>line Translation added</e1> in RTE</i1>",
            type: "header-three",
            depth: 0,
            inlineStyleRanges: [
                {
                    offset: 12,
                    length: 23,
                    style: "BOLD" as DraftInlineStyleType,
                },
            ],
            entityRanges: [
                {
                    offset: 8,
                    length: 20,
                    key: 0,
                },
            ],
            data: {},
        };

        expect(importRichtextStyles(block)).toEqual({
            ...block,
            text: "Another Headline Translation added in RTE",
            inlineStyleRanges: [{ offset: 12, length: 29, style: "BOLD" as DraftInlineStyleType }],
            entityRanges: [
                {
                    offset: 8,
                    length: 26,
                    key: 0,
                },
            ],
        });
    });

    it("should update inline styles correctly also for inline styles also for multiple styles", () => {
        // original text: "<i1>Another</i1> Text in RTE for <i2>testing <i4>overlapping</i2> instyle</i4> ranges for styles <i3>bold</i3> and <i5>italic</i5>.""
        const block = {
            key: "5jda2",
            text: "<i1>Another nice</i1> Text in RTE for <i2>testing <i4>some overlapping</i2> instyle</i4> ranges for styles <i3>bold</i3> and <i5>italic</i5>.",
            type: "header-three",
            depth: 0,
            inlineStyleRanges: [
                {
                    offset: 0,
                    length: 7,
                    style: "BOLD" as DraftInlineStyleType,
                },
                {
                    offset: 24,
                    length: 19,
                    style: "BOLD" as DraftInlineStyleType,
                },
                {
                    offset: 70,
                    length: 4,
                    style: "BOLD" as DraftInlineStyleType,
                },
                {
                    offset: 32,
                    length: 19,
                    style: "ITALIC" as DraftInlineStyleType,
                },
                {
                    offset: 79,
                    length: 6,
                    style: "ITALIC" as DraftInlineStyleType,
                },
            ],
            entityRanges: [],
            data: {},
        };

        expect(importRichtextStyles(block)).toEqual({
            ...block,
            text: "Another nice Text in RTE for testing some overlapping instyle ranges for styles bold and italic.",
            inlineStyleRanges: [
                {
                    offset: 0,
                    length: 12,
                    style: "BOLD" as DraftInlineStyleType,
                },
                {
                    offset: 29,
                    length: 24,
                    style: "BOLD" as DraftInlineStyleType,
                },
                {
                    offset: 80,
                    length: 4,
                    style: "BOLD" as DraftInlineStyleType,
                },
                {
                    offset: 37,
                    length: 24,
                    style: "ITALIC" as DraftInlineStyleType,
                },
                {
                    offset: 89,
                    length: 6,
                    style: "ITALIC" as DraftInlineStyleType,
                },
            ],
            entityRanges: [],
        });
    });
});
