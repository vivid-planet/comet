import { DraftInlineStyleType } from "draft-js";
import { v4 } from "uuid";

import { updateBlockContent } from "./translateAndTransformToState";

describe("updateBlockContent", () => {
    it("should remove pseudo-tags for multiple sequential inline styles", () => {
        // original text: Let\'s test <inline id="1">bold</inline> and <inline id="2">italic</inline>.
        const block = {
            key: v4(),
            text: 'Let\'s test <inline id="1">bold</inline> and <inline id="2">italic</inline>',
            type: "unstyled",
            depth: 0,
            inlineStyleRanges: [
                {
                    offset: 11,
                    length: 4,
                    style: "BOLD" as DraftInlineStyleType,
                },
                {
                    offset: 20,
                    length: 6,
                    style: "ITALIC" as DraftInlineStyleType,
                },
            ],
            entityRanges: [],
            data: {},
        };

        expect(updateBlockContent(block)).toEqual({
            ...block,
            text: "Let's test bold and italic",
        });
    });

    it("should update multiple inline styles correctly", () => {
        // original text: "<inline id=\"1\">Another</inline> Text in RTE for <inline id=\"2\">testing </inline><inline id=\"3\"><inline id=\"2\">overlapping</inline></inline><inline id=\"3\"> inline style</inline> ranges for styles <inline id=\"4\">bold</inline> and <inline id=\"5\">italic</inline>."
        const block = {
            key: "5jda2",
            text: '<inline id="1">Another nice</inline> Text in RTE for <inline id="2">testing </inline><inline id="3"><inline id="2">some overlapping</inline></inline><inline id="3"> custom inline style</inline> ranges for styles <inline id="4">bold</inline> and <inline id="5">italic</inline>.',
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
                    offset: 75,
                    length: 4,
                    style: "BOLD" as DraftInlineStyleType,
                },
                {
                    offset: 32,
                    length: 24,
                    style: "ITALIC" as DraftInlineStyleType,
                },
                {
                    offset: 84,
                    length: 6,
                    style: "ITALIC" as DraftInlineStyleType,
                },
            ],
            entityRanges: [],
            data: {},
        };

        const expectedInlineStyles = [
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
                offset: 92,
                length: 4,
                style: "BOLD" as DraftInlineStyleType,
            },
            {
                offset: 37,
                length: 36,
                style: "ITALIC" as DraftInlineStyleType,
            },
            {
                offset: 101,
                length: 6,
                style: "ITALIC" as DraftInlineStyleType,
            },
        ];

        const state = updateBlockContent(block);
        state.inlineStyleRanges.sort((a, b) => a.offset - b.offset);

        expect(state).toEqual({
            ...block,
            text: "Another nice Text in RTE for testing some overlapping custom inline style ranges for styles bold and italic.",
            inlineStyleRanges: expectedInlineStyles.sort((a, b) => a.offset - b.offset),
            entityRanges: [],
        });
    });

    it("should update inline styles correctly when swapping positions", () => {
        // original text: "Testing <inline id=\"1\">bold</inline> and <inline id=\"2\">italic</inline> styles with swapping positions."
        const block = {
            key: "5jda2",
            text: 'Testing <inline id="2">italic</inline> and <inline id="1">bold</inline> styles with swapping positions.',
            type: "header-three",
            depth: 0,
            inlineStyleRanges: [
                {
                    offset: 8,
                    length: 4,
                    style: "BOLD" as DraftInlineStyleType,
                },
                {
                    offset: 17,
                    length: 6,
                    style: "ITALIC" as DraftInlineStyleType,
                },
            ],
            entityRanges: [],
            data: {},
        };

        const expectedInlineStyles = [
            {
                offset: 8,
                length: 6,
                style: "ITALIC" as DraftInlineStyleType,
            },
            {
                offset: 19,
                length: 4,
                style: "BOLD" as DraftInlineStyleType,
            },
        ];

        const state = updateBlockContent(block);
        state.inlineStyleRanges.sort((a, b) => a.offset - b.offset);

        expect(state).toEqual({
            ...block,
            text: "Testing italic and bold styles with swapping positions.",
            inlineStyleRanges: expectedInlineStyles.sort((a, b) => a.offset - b.offset),
            entityRanges: [],
        });
    });

    it("should remove inline style when closing tag is missing", () => {
        // original text: "Testing <inline id=\"1\">bold</inline>, <inline id=\"2\">italic</inline> and <inline id=\"3\">strikethrough</inline>."
        const block = {
            key: "5jda2",
            text: 'Testing <inline id="1">bold</inline>, <inline id="2">italic and <inline id="3">strikethrough</inline>.',
            type: "header-three",
            depth: 0,
            inlineStyleRanges: [
                {
                    offset: 8,
                    length: 4,
                    style: "BOLD" as DraftInlineStyleType,
                },
                {
                    offset: 14,
                    length: 6,
                    style: "ITALIC" as DraftInlineStyleType,
                },
                {
                    offset: 25,
                    length: 13,
                    style: "STRIKETHROUGH" as DraftInlineStyleType,
                },
            ],
            entityRanges: [],
            data: {},
        };

        const expectedInlineStyles = [
            {
                offset: 8,
                length: 4,
                style: "BOLD" as DraftInlineStyleType,
            },
            {
                offset: 25,
                length: 13,
                style: "STRIKETHROUGH" as DraftInlineStyleType,
            },
        ];

        const state = updateBlockContent(block);
        state.inlineStyleRanges.sort((a, b) => a.offset - b.offset);

        expect(state).toEqual({
            ...block,
            text: "Testing bold, italic and strikethrough.",
            inlineStyleRanges: expectedInlineStyles.sort((a, b) => a.offset - b.offset),
            entityRanges: [],
        });
    });

    it("should remove inline style when opening tag is missing", () => {
        // original text: "Testing <inline id=\"1\">bold</inline>, <inline id=\"2\">italic</inline> and <inline id=\"3\">strikethrough</inline>."
        const block = {
            key: "5jda2",
            text: 'Testing <inline id="1">bold</inline>, italic</inline> and <inline id="3">strikethrough</inline>.',
            type: "header-three",
            depth: 0,
            inlineStyleRanges: [
                {
                    offset: 8,
                    length: 4,
                    style: "BOLD" as DraftInlineStyleType,
                },
                {
                    offset: 14,
                    length: 6,
                    style: "ITALIC" as DraftInlineStyleType,
                },
                {
                    offset: 25,
                    length: 13,
                    style: "STRIKETHROUGH" as DraftInlineStyleType,
                },
            ],
            entityRanges: [],
            data: {},
        };

        const expectedInlineStyles = [
            {
                offset: 8,
                length: 4,
                style: "BOLD" as DraftInlineStyleType,
            },
            {
                offset: 25,
                length: 13,
                style: "STRIKETHROUGH" as DraftInlineStyleType,
            },
        ];

        const state = updateBlockContent(block);
        state.inlineStyleRanges.sort((a, b) => a.offset - b.offset);

        expect(state).toEqual({
            ...block,
            text: "Testing bold, italic and strikethrough.",
            inlineStyleRanges: expectedInlineStyles.sort((a, b) => a.offset - b.offset),
            entityRanges: [],
        });
    });

    it("should remove inline style when multiple tags are missing", () => {
        // original text: "Testing <inline id=\"1\">bold</inline>, <inline id=\"2\">italic</inline> and <inline id=\"3\">strikethrough</inline>."
        const block = {
            key: "5jda2",
            text: 'Testing <inline id="1">bold, <inline id="2">italic and <inline id="3">strikethrough.',
            type: "header-three",
            depth: 0,
            inlineStyleRanges: [
                {
                    offset: 8,
                    length: 4,
                    style: "BOLD" as DraftInlineStyleType,
                },
                {
                    offset: 14,
                    length: 6,
                    style: "ITALIC" as DraftInlineStyleType,
                },
                {
                    offset: 25,
                    length: 13,
                    style: "STRIKETHROUGH" as DraftInlineStyleType,
                },
            ],
            entityRanges: [],
            data: {},
        };

        expect(updateBlockContent(block)).toEqual({
            ...block,
            text: "Testing bold, italic and strikethrough.",
            inlineStyleRanges: [],
            entityRanges: [],
        });
    });

    it("should remove inline style when multiple closing tags are missing", () => {
        // original text: "Testing <inline id=\"1\">bold</inline>, <inline id=\"2\">italic</inline> and <inline id=\"3\">strikethrough</inline>."
        const block = {
            key: "5jda2",
            text: 'Testing <inline id="1">bold, <inline id="2">italic and <inline id="3">strikethrough.',
            type: "header-three",
            depth: 0,
            inlineStyleRanges: [
                {
                    offset: 8,
                    length: 4,
                    style: "BOLD" as DraftInlineStyleType,
                },
                {
                    offset: 14,
                    length: 6,
                    style: "ITALIC" as DraftInlineStyleType,
                },
                {
                    offset: 25,
                    length: 13,
                    style: "STRIKETHROUGH" as DraftInlineStyleType,
                },
            ],
            entityRanges: [],
            data: {},
        };

        expect(updateBlockContent(block)).toEqual({
            ...block,
            text: "Testing bold, italic and strikethrough.",
            inlineStyleRanges: [],
            entityRanges: [],
        });
    });

    it("should remove inline style when multiple opening tags are missing", () => {
        // original text: "Testing <inline id=\"1\">bold</inline>, <inline id=\"2\">italic</inline> and <inline id=\"3\">strikethrough</inline>."
        const block = {
            key: "5jda2",
            text: "Testing bold</inline>, italic</inline> and strikethrough</inline>.",
            type: "header-three",
            depth: 0,
            inlineStyleRanges: [
                {
                    offset: 8,
                    length: 4,
                    style: "BOLD" as DraftInlineStyleType,
                },
                {
                    offset: 14,
                    length: 6,
                    style: "ITALIC" as DraftInlineStyleType,
                },
                {
                    offset: 25,
                    length: 13,
                    style: "STRIKETHROUGH" as DraftInlineStyleType,
                },
            ],
            entityRanges: [],
            data: {},
        };

        expect(updateBlockContent(block)).toEqual({
            ...block,
            text: "Testing bold, italic and strikethrough.",
            inlineStyleRanges: [],
            entityRanges: [],
        });
    });

    it("should update multiple instyle and entity ranges", () => {
        // original text: "Now <inline id=\"1\">some </inline><entity id=\"1\"><inline id=\"1\">links</inline></entity><inline id=\"1\"> are added</inline>, pointing <inline id=\"2\">somewhere </inline><entity id=\"2\"><inline id=\"2\">ex</inline>ternal</entity> and <entity id=\"3\">internal</entity> also including some styling tags."
        const block = {
            key: "5jda2",
            text: 'Now <inline id="1">some </inline><entity id="1"><inline id="1">new links</inline></entity><inline id="1"> are added</inline>, pointing <inline id="2">somewhere </inline><entity id="2"><inline id="2">ex</inline>ternal</entity> and <entity id="3">internal</entity> also including some styling tags.',
            type: "header-three",
            depth: 0,
            inlineStyleRanges: [
                {
                    offset: 4,
                    length: 20,
                    style: "BOLD" as DraftInlineStyleType,
                },
                {
                    offset: 35,
                    length: 12,
                    style: "ITALIC" as DraftInlineStyleType,
                },
            ],
            entityRanges: [
                {
                    offset: 9,
                    length: 5,
                    key: 0,
                },
                {
                    offset: 45,
                    length: 8,
                    key: 1,
                },
                {
                    offset: 58,
                    length: 8,
                    key: 2,
                },
            ],
            data: {},
        };

        expect(updateBlockContent(block)).toEqual({
            ...block,
            text: "Now some new links are added, pointing somewhere external and internal also including some styling tags.",
            inlineStyleRanges: [
                {
                    offset: 4,
                    length: 24,
                    style: "BOLD",
                },
                {
                    offset: 39,
                    length: 12,
                    style: "ITALIC",
                },
            ],
            entityRanges: [
                {
                    offset: 9,
                    length: 9,
                    key: 0,
                },
                {
                    offset: 49,
                    length: 8,
                    key: 1,
                },
                {
                    offset: 62,
                    length: 8,
                    key: 2,
                },
            ],
        });
    });

    it("should remove entity range when opening tag is missing", () => {
        // original text: "Testing <inline id=\"1\">bold </inline><entity id=\"1\"><inline id=\"1\">links</inline></entity>, <inline id=\"2\">italic </inline><entity id=\"2\"><inline id=\"2\">links</inline></entity> and <inline id=\"3\">strikethrough</inline>."
        const block = {
            key: "5jda2",
            text: 'Testing <inline id="1">bold </inline><inline id="1">links</inline></entity>, <inline id="2">italic </inline><entity id="2"><inline id="2">links</inline></entity> and <inline id="3">strikethrough</inline>.',
            type: "header-three",
            depth: 0,
            inlineStyleRanges: [
                {
                    offset: 8,
                    length: 10,
                    style: "BOLD" as DraftInlineStyleType,
                },
                {
                    offset: 20,
                    length: 12,
                    style: "ITALIC" as DraftInlineStyleType,
                },
                {
                    offset: 37,
                    length: 13,
                    style: "STRIKETHROUGH" as DraftInlineStyleType,
                },
            ],
            entityRanges: [
                {
                    offset: 13,
                    length: 5,
                    key: 0,
                },
                {
                    offset: 27,
                    length: 5,
                    key: 1,
                },
            ],
            data: {},
        };

        expect(updateBlockContent(block)).toEqual({
            ...block,
            text: "Testing bold links, italic links and strikethrough.",
            entityRanges: [
                {
                    offset: 27,
                    length: 5,
                    key: 1,
                },
            ],
        });
    });

    it("should handle changed link position", () => {
        // original text: "Das ist <entity id="1">ein Link</entity>"
        const block = {
            key: "5jda2",
            text: '<entity id="1">ein Link</entity> Das ist',
            type: "header-three",
            depth: 0,
            inlineStyleRanges: [],
            entityRanges: [
                {
                    offset: 8,
                    length: 8,
                    key: 0,
                },
            ],
            data: {},
        };

        expect(updateBlockContent(block)).toEqual({
            ...block,
            text: "ein Link Das ist",
            entityRanges: [
                {
                    offset: 0,
                    length: 8,
                    key: 0,
                },
            ],
        });
    });

    it("should keep links and styles when only text has changed", () => {
        // original text: "Das ist <entity id="1">ein Link</entity>"
        const block = {
            key: "5jda2",
            text: 'Das ist <entity id="1">ein Test</entity>',
            type: "header-three",
            depth: 0,
            inlineStyleRanges: [],
            entityRanges: [
                {
                    offset: 8,
                    length: 8,
                    key: 0,
                },
            ],
            data: {},
        };

        const test = updateBlockContent(block);

        expect(test).toEqual({
            ...block,
            text: "Das ist ein Test",
        });
    });
});
