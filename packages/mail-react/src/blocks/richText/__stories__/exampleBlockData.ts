import type { RichTextBlockData } from "../common.js";

export const exampleBlockData: RichTextBlockData = {
    draftContent: {
        blocks: [
            {
                key: "dkq9u",
                text: "Heading One",
                type: "header-one",
                depth: 0,
                inlineStyleRanges: [],
                entityRanges: [],
                data: {},
            },
            {
                key: "ajl7h",
                text: "Default paragraph: Inventore eum velit fuga qui quae voluptatibus similique odio. Libero molestias non et dignissimos numquam est. Sint amet voluptate non.",
                type: "paragraph-standard",
                depth: 0,
                inlineStyleRanges: [],
                entityRanges: [],
                data: {},
            },
            {
                key: "4hl5r",
                text: "Default paragraph with an external link and an internal link within it.",
                type: "paragraph-standard",
                depth: 0,
                inlineStyleRanges: [],
                entityRanges: [
                    { offset: 26, length: 13, key: 0 },
                    { offset: 47, length: 13, key: 1 },
                ],
                data: {},
            },
            {
                key: "a968k",
                text: "This paragraph has bold text, italic text and both at once. \nAnd this has strike through, after a line break.",
                type: "paragraph-standard",
                depth: 0,
                inlineStyleRanges: [
                    { offset: 19, length: 9, style: "BOLD" },
                    { offset: 46, length: 12, style: "BOLD" },
                    { offset: 30, length: 11, style: "ITALIC" },
                    { offset: 46, length: 12, style: "ITALIC" },
                    { offset: 75, length: 14, style: "STRIKETHROUGH" },
                ],
                entityRanges: [],
                data: {},
            },
            {
                key: "h2lst",
                text: "Heading Two above a list",
                type: "header-two",
                depth: 0,
                inlineStyleRanges: [],
                entityRanges: [],
                data: {},
            },
            {
                key: "ul1",
                text: "Unordered list item one",
                type: "unordered-list-item",
                depth: 0,
                inlineStyleRanges: [],
                entityRanges: [],
                data: {},
            },
            {
                key: "ul2",
                text: "Unordered list item two",
                type: "unordered-list-item",
                depth: 0,
                inlineStyleRanges: [],
                entityRanges: [],
                data: {},
            },
            {
                key: "ol1",
                text: "Ordered list item one",
                type: "ordered-list-item",
                depth: 0,
                inlineStyleRanges: [],
                entityRanges: [],
                data: {},
            },
            {
                key: "ol2",
                text: "Ordered list item two",
                type: "ordered-list-item",
                depth: 0,
                inlineStyleRanges: [],
                entityRanges: [],
                data: {},
            },
            {
                key: "fu9f1",
                text: "",
                type: "paragraph-standard",
                depth: 0,
                inlineStyleRanges: [],
                entityRanges: [],
                data: {},
            },
        ],
        entityMap: {
            "0": {
                type: "LINK",
                mutability: "MUTABLE",
                data: {
                    attachedBlocks: [],
                    block: {
                        type: "external",
                        props: {
                            targetUrl: "https://example.com",
                            openInNewWindow: false,
                        },
                    },
                    activeType: "external",
                },
            },
            "1": {
                type: "LINK",
                mutability: "MUTABLE",
                data: {
                    attachedBlocks: [],
                    block: {
                        type: "internal",
                        props: {
                            targetPage: {
                                id: "home",
                                name: "Home",
                                path: "/",
                                documentType: "Page",
                            },
                        },
                    },
                    activeType: "internal",
                },
            },
        },
    },
};

export const headlinesOnlyBlockData: RichTextBlockData = {
    draftContent: {
        blocks: [
            {
                key: "hl1",
                text: "Main headline",
                type: "header-one",
                depth: 0,
                inlineStyleRanges: [],
                entityRanges: [],
                data: {},
            },
            {
                key: "hl2",
                text: "Secondary headline",
                type: "header-two",
                depth: 0,
                inlineStyleRanges: [],
                entityRanges: [],
                data: {},
            },
        ],
        entityMap: {},
    },
};
