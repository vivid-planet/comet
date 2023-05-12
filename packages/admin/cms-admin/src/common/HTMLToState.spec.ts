import { DraftInlineStyleType } from "draft-js";
import { v4 } from "uuid";

import { HTMLToState } from "./HTMLToState";

describe("HTMLToState", () => {
    it("should remove pseudo-tags for multiple sequential inline styles", () => {
        // original text: Let\'s test <i class="1">bold</i> and <i class="2">italic</i>.
        const block = {
            key: v4(),
            text: 'Let\'s test <i class="1">bold</i> and <i class="2">italic</i>',
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

        expect(HTMLToState(block)).toEqual({
            ...block,
            text: "Let's test bold and italic",
        });
    });

    it("should update multiple inline styles correctly", () => {
        // original text: "<i class=\"1\">Another</i> Text in RTE for <i class=\"2\">testing </i><i class=\"3\"><i class=\"2\">overlapping</i></i><i class=\"3\"> inline style</i> ranges for styles <i class=\"4\">bold</i> and <i class=\"5\">italic</i>."
        const block = {
            key: "5jda2",
            text: '<i class="1">Another nice</i> Text in RTE for <i class="2">testing </i><i class="3"><i class="2">some overlapping</i></i><i class="3"> custom inline style</i> ranges for styles <i class="4">bold</i> and <i class="5">italic</i>.',
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

        const state = HTMLToState(block);
        state.inlineStyleRanges.sort((a, b) => a.offset - b.offset);

        expect(state).toEqual({
            ...block,
            text: "Another nice Text in RTE for testing some overlapping custom inline style ranges for styles bold and italic.",
            inlineStyleRanges: expectedInlineStyles.sort((a, b) => a.offset - b.offset),
            entityRanges: [],
        });
    });

    it("should update inline styles correctly when swapping positions", () => {
        // original text: "Testing <i class=\"1\">bold</i> and <i class=\"2\">italic</i> styles with swapping positions."
        const block = {
            key: "5jda2",
            text: 'Testing <i class="2">italic</i> and <i class="1">bold</i> styles with swapping positions.',
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

        const state = HTMLToState(block);
        state.inlineStyleRanges.sort((a, b) => a.offset - b.offset);

        expect(state).toEqual({
            ...block,
            text: "Testing italic and bold styles with swapping positions.",
            inlineStyleRanges: expectedInlineStyles.sort((a, b) => a.offset - b.offset),
            entityRanges: [],
        });
    });

    it("should remove inline style when closing tag is missing", () => {
        // original text: "Testing <i class=\"1\">bold</i>, <i class=\"2\">italic</i> and <i class=\"3\">strikethrough</i>."
        const block = {
            key: "5jda2",
            text: 'Testing <i class="1">bold</i>, <i class="2">italic and <i class="3">strikethrough</i>.',
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

        const state = HTMLToState(block);
        state.inlineStyleRanges.sort((a, b) => a.offset - b.offset);

        expect(state).toEqual({
            ...block,
            text: "Testing bold, italic and strikethrough.",
            inlineStyleRanges: expectedInlineStyles.sort((a, b) => a.offset - b.offset),
            entityRanges: [],
        });
    });

    it("should remove inline style when opening tag is missing", () => {
        // original text: "Testing <i class=\"1\">bold</i>, <i class=\"2\">italic</i> and <i class=\"3\">strikethrough</i>."
        const block = {
            key: "5jda2",
            text: 'Testing <i class="1">bold</i>, italic</i> and <i class="3">strikethrough</i>.',
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

        const state = HTMLToState(block);
        state.inlineStyleRanges.sort((a, b) => a.offset - b.offset);

        expect(state).toEqual({
            ...block,
            text: "Testing bold, italic and strikethrough.",
            inlineStyleRanges: expectedInlineStyles.sort((a, b) => a.offset - b.offset),
            entityRanges: [],
        });
    });

    it("should remove inline style when multiple tags are missing", () => {
        // original text: "Testing <i class=\"1\">bold</i>, <i class=\"2\">italic</i> and <i class=\"3\">strikethrough</i>."
        const block = {
            key: "5jda2",
            text: 'Testing <i class="1">bold, <i class="2">italic and <i class="3">strikethrough.',
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

        expect(HTMLToState(block)).toEqual({
            ...block,
            text: "Testing bold, italic and strikethrough.",
            inlineStyleRanges: [],
            entityRanges: [],
        });
    });

    it("should remove inline style when multiple closing tags are missing", () => {
        // original text: "Testing <i class=\"1\">bold</i>, <i class=\"2\">italic</i> and <i class=\"3\">strikethrough</i>."
        const block = {
            key: "5jda2",
            text: 'Testing <i class="1">bold, <i class="2">italic and <i class="3">strikethrough.',
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

        expect(HTMLToState(block)).toEqual({
            ...block,
            text: "Testing bold, italic and strikethrough.",
            inlineStyleRanges: [],
            entityRanges: [],
        });
    });

    it("should remove inline style when multiple opening tags are missing", () => {
        // original text: "Testing <i class=\"1\">bold</i>, <i class=\"2\">italic</i> and <i class=\"3\">strikethrough</i>."
        const block = {
            key: "5jda2",
            text: "Testing bold</i>, italic</i> and strikethrough</i>.",
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

        expect(HTMLToState(block)).toEqual({
            ...block,
            text: "Testing bold, italic and strikethrough.",
            inlineStyleRanges: [],
            entityRanges: [],
        });
    });

    it("should update multiple instyle and entity ranges", () => {
        // original text: "Now <i class=\"1\">some </i><e class=\"1\"><i class=\"1\">links</i></e><i class=\"1\"> are added</i>, pointing <i class=\"2\">somewhere </i><e class=\"2\"><i class=\"2\">ex</i>ternal</e> and <e class=\"3\">internal</e> also including some styling tags."
        const block = {
            key: "5jda2",
            text: 'Now <i class="1">some </i><e class="1"><i class="1">new links</i></e><i class="1"> are added</i>, pointing <i class="2">somewhere </i><e class="2"><i class="2">ex</i>ternal</e> and <e class="3">internal</e> also including some styling tags.',
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

        expect(HTMLToState(block)).toEqual({
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
        // original text: "Testing <i class=\"1\">bold </i><e class=\"1\"><i class=\"1\">links</i></e>, <i class=\"2\">italic </i><e class=\"2\"><i class=\"2\">links</i></e> and <i class=\"3\">strikethrough</i>."
        const block = {
            key: "5jda2",
            text: 'Testing <i class="1">bold </i><i class="1">links</i></e>, <i class="2">italic </i><e class="2"><i class="2">links</i></e> and <i class="3">strikethrough</i>.',
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

        expect(HTMLToState(block)).toEqual({
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
});
