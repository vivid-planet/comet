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
