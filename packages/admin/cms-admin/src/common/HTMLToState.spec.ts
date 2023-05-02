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

        expect(HTMLToState(block)).toEqual({
            ...block,
            text: "Another nice Text in RTE for testing some overlapping custom inline style ranges for styles bold and italic.",
            inlineStyleRanges: expectedInlineStyles.sort((a, b) => a.offset - b.offset),
            entityRanges: [],
        });
    });
});
