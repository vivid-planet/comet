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
            text: "Let's test bold and italic.",
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

        expect(HTMLToState(block)).toEqual({
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
