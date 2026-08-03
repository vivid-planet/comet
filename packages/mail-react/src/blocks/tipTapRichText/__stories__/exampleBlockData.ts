import type { TipTapRichTextBlockData } from "../common.js";

export const exampleBlockData: TipTapRichTextBlockData = {
    tipTapContent: {
        type: "doc",
        content: [
            {
                type: "heading",
                attrs: { level: 1 },
                content: [{ type: "text", text: "Heading One" }],
            },
            {
                type: "paragraph",
                content: [
                    {
                        type: "text",
                        text: "Default paragraph: Inventore eum velit fuga qui quae voluptatibus similique odio. Libero molestias non et dignissimos numquam est. Sint amet voluptate non.",
                    },
                ],
            },
            {
                type: "paragraph",
                content: [
                    { type: "text", text: "Default paragraph with an external link and an internal link within it: " },
                    {
                        type: "text",
                        text: "external link",
                        marks: [
                            {
                                type: "link",
                                attrs: { data: { block: { type: "external", props: { targetUrl: "https://example.com" } } } },
                            },
                        ],
                    },
                    { type: "text", text: " and " },
                    {
                        type: "text",
                        text: "internal link",
                        marks: [
                            {
                                type: "link",
                                attrs: { data: { block: { type: "internal", props: { targetPage: { id: "home", path: "/" } } } } },
                            },
                        ],
                    },
                    { type: "text", text: "." },
                ],
            },
            {
                type: "paragraph",
                content: [
                    { type: "text", text: "This paragraph has ", marks: [] },
                    { type: "text", text: "bold text", marks: [{ type: "bold" }] },
                    { type: "text", text: ", " },
                    { type: "text", text: "italic text", marks: [{ type: "italic" }] },
                    { type: "text", text: " and " },
                    { type: "text", text: "both at once", marks: [{ type: "bold" }, { type: "italic" }] },
                    { type: "text", text: "." },
                    { type: "hardBreak" },
                    { type: "text", text: "And this has " },
                    { type: "text", text: "strike through", marks: [{ type: "strike" }] },
                    { type: "text", text: ", after a line break." },
                ],
            },
            {
                type: "heading",
                attrs: { level: 2 },
                content: [{ type: "text", text: "Heading Two above a list" }],
            },
            {
                type: "bulletList",
                content: [
                    { type: "listItem", content: [{ type: "paragraph", content: [{ type: "text", text: "Unordered list item one" }] }] },
                    { type: "listItem", content: [{ type: "paragraph", content: [{ type: "text", text: "Unordered list item two" }] }] },
                ],
            },
            {
                type: "orderedList",
                content: [
                    { type: "listItem", content: [{ type: "paragraph", content: [{ type: "text", text: "Ordered list item one" }] }] },
                    { type: "listItem", content: [{ type: "paragraph", content: [{ type: "text", text: "Ordered list item two" }] }] },
                ],
            },
            { type: "paragraph" },
        ],
    },
};

export const highlightBlockData: TipTapRichTextBlockData = {
    tipTapContent: {
        type: "doc",
        content: [
            {
                type: "paragraph",
                content: [
                    { type: "text", text: "This paragraph contains " },
                    {
                        type: "text",
                        text: "highlighted text",
                        marks: [{ type: "inlineStyle", attrs: { type: "highlight" } }],
                    },
                    { type: "text", text: " a reader should not miss." },
                ],
            },
        ],
    },
};

export const headlinesOnlyBlockData: TipTapRichTextBlockData = {
    tipTapContent: {
        type: "doc",
        content: [
            { type: "heading", attrs: { level: 1 }, content: [{ type: "text", text: "Main headline" }] },
            { type: "heading", attrs: { level: 2 }, content: [{ type: "text", text: "Secondary headline" }] },
        ],
    },
};

export const placeholderBlockData: TipTapRichTextBlockData = {
    tipTapContent: {
        type: "doc",
        content: [
            {
                type: "paragraph",
                content: [
                    { type: "text", text: "Hi " },
                    { type: "placeholder", attrs: { name: "firstName" } },
                    { type: "text", text: ", welcome aboard!" },
                ],
            },
        ],
    },
};
