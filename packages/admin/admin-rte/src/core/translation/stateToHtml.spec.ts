import { convertFromRaw, EditorState, RawDraftContentState } from "draft-js";

import { IRteOptions } from "../Rte";
import { stateToHtml } from "./stateToHtml";

describe("stateToHtml", () => {
    const options = {
        supports: [
            "bold",
            "italic",
            "sub",
            "sup",
            "header-one",
            "header-two",
            "header-three",
            "header-four",
            "header-five",
            "header-six",
            "strikethrough",
            "ordered-list",
            "unordered-list",
            "history",
            "link",
            "links-remove",
            "non-breaking-space",
            "soft-hyphen",
        ],
        listLevelMax: 4,
        customToolbarButtons: [],
        draftJsProps: { spellCheck: true },
        standardBlockType: "unstyled",
        blocktypeMap: {
            unstyled: {
                label: {
                    type: {},
                    key: null,
                    ref: null,
                    props: { id: "comet.rte.controls.blockType.default", defaultMessage: "Default" },
                    _owner: null,
                    _store: {},
                },
                renderConfig: { element: { propTypes: {}, options: { name: "CometAdminRteBlockElement" } }, aliasedElements: ["p"] },
            },
            "header-one": {
                supportedBy: "header-one",
                label: {
                    type: {},
                    key: null,
                    ref: null,
                    props: { id: "comet.rte.controls.blockType.heading", defaultMessage: "Heading {level}", values: { level: 1 } },
                    _owner: null,
                    _store: {},
                },
                group: "dropdown",
                renderConfig: { aliasedElements: ["h1"] },
            },
            "header-two": {
                supportedBy: "header-two",
                label: {
                    type: {},
                    key: null,
                    ref: null,
                    props: { id: "comet.rte.controls.blockType.heading", defaultMessage: "Heading {level}", values: { level: 2 } },
                    _owner: null,
                    _store: {},
                },
                group: "dropdown",
                renderConfig: { aliasedElements: ["h2"] },
            },
            "header-three": {
                supportedBy: "header-three",
                label: {
                    type: {},
                    key: null,
                    ref: null,
                    props: { id: "comet.rte.controls.blockType.heading", defaultMessage: "Heading {level}", values: { level: 3 } },
                    _owner: null,
                    _store: {},
                },
                group: "dropdown",
                renderConfig: { aliasedElements: ["h3"] },
            },
            "header-four": {
                supportedBy: "header-four",
                label: {
                    type: {},
                    key: null,
                    ref: null,
                    props: { id: "comet.rte.controls.blockType.heading", defaultMessage: "Heading {level}", values: { level: 4 } },
                    _owner: null,
                    _store: {},
                },
                group: "dropdown",
                renderConfig: { aliasedElements: ["h4"] },
            },
            "header-five": {
                supportedBy: "header-five",
                label: {
                    type: {},
                    key: null,
                    ref: null,
                    props: { id: "comet.rte.controls.blockType.heading", defaultMessage: "Heading {level}", values: { level: 5 } },
                    _owner: null,
                    _store: {},
                },
                group: "dropdown",
                renderConfig: { aliasedElements: ["h5"] },
            },
            "header-six": {
                supportedBy: "header-six",
                label: {
                    type: {},
                    key: null,
                    ref: null,
                    props: { id: "comet.rte.controls.blockType.heading", defaultMessage: "Heading {level}", values: { level: 6 } },
                    _owner: null,
                    _store: {},
                },
                group: "dropdown",
                renderConfig: { aliasedElements: ["h6"] },
            },
            blockquote: {
                supportedBy: "blockquote",
                label: {
                    type: {},
                    key: null,
                    ref: null,
                    props: { id: "comet.rte.controls.blockType.blockquote", defaultMessage: "Blockquote" },
                    _owner: null,
                    _store: {},
                },
                renderConfig: { aliasedElements: ["blockquote"] },
            },
            "unordered-list-item": {
                supportedBy: "unordered-list",
                group: "button",
                label: {
                    type: {},
                    key: null,
                    ref: null,
                    props: { id: "comet.rte.controls.blockType.unorderedList", defaultMessage: "Bulletpoints" },
                    _owner: null,
                    _store: {},
                },
                renderConfig: {
                    wrapper: {
                        type: { propTypes: {}, options: { name: "CometAdminRteBlockElement" } },
                        key: null,
                        ref: null,
                        props: { type: "unordered-list", component: "ul" },
                        _owner: null,
                        _store: {},
                    },
                    element: "li",
                },
            },
            "ordered-list-item": {
                supportedBy: "ordered-list",
                group: "button",
                label: {
                    type: {},
                    key: null,
                    ref: null,
                    props: { id: "comet.rte.controls.blockType.orderedList", defaultMessage: "Numbering" },
                    _owner: null,
                    _store: {},
                },
                renderConfig: {
                    wrapper: {
                        type: { propTypes: {}, options: { name: "CometAdminRteBlockElement" } },
                        key: null,
                        ref: null,
                        props: { type: "ordered-list", component: "ol" },
                        _owner: null,
                        _store: {},
                    },
                    element: "li",
                },
            },
        },
        customInlineStyles: { HIGHLIGHT: { label: "Highlight!", icon: { type: {}, compare: null }, style: { backgroundColor: "yellow" } } },
    } as unknown as IRteOptions;

    it("should convert the rte editor state with styling into html while keeping the format via tags - formats part 1", () => {
        const blocks = [
            { key: "52cmg", text: "Normal Text", type: "unstyled", depth: 0, inlineStyleRanges: [], entityRanges: [], data: {} },
            {
                key: "8psic",
                text: "Bold Text",
                type: "unstyled",
                depth: 0,
                inlineStyleRanges: [{ offset: 0, length: 9, style: "BOLD" }],
                entityRanges: [],
                data: {},
            },
            {
                key: "4m6ou",
                text: "Italic Text",
                type: "unstyled",
                depth: 0,
                inlineStyleRanges: [{ offset: 0, length: 11, style: "ITALIC" }],
                entityRanges: [],
                data: {},
            },
            {
                key: "fask6",
                text: "Bold Italic Text",
                type: "unstyled",
                depth: 0,
                inlineStyleRanges: [
                    { offset: 0, length: 16, style: "ITALIC" },
                    { offset: 0, length: 16, style: "BOLD" },
                ],
                entityRanges: [],
                data: {},
            },
            {
                key: "fm23u",
                text: "Strikethrough Text",
                type: "unstyled",
                depth: 0,
                inlineStyleRanges: [{ offset: 0, length: 18, style: "STRIKETHROUGH" }],
                entityRanges: [],
                data: {},
            },
            {
                key: "9q8m5",
                text: "A Subscript Text",
                type: "unstyled",
                depth: 0,
                inlineStyleRanges: [{ offset: 2, length: 14, style: "SUB" }],
                entityRanges: [],
                data: {},
            },
            {
                key: "t3nk",
                text: "B Superscript Text",
                type: "unstyled",
                depth: 0,
                inlineStyleRanges: [{ offset: 2, length: 16, style: "SUP" }],
                entityRanges: [],
                data: {},
            },
            { key: "e6k04", text: "Headline 1", type: "header-one", depth: 0, inlineStyleRanges: [], entityRanges: [], data: {} },
            { key: "ect4f", text: "Headline 2", type: "header-two", depth: 0, inlineStyleRanges: [], entityRanges: [], data: {} },
            { key: "e038j", text: "Headline 3", type: "header-three", depth: 0, inlineStyleRanges: [], entityRanges: [], data: {} },
            { key: "4bha8", text: "Headline 4", type: "header-four", depth: 0, inlineStyleRanges: [], entityRanges: [], data: {} },
            { key: "aje6k", text: "Headline 5", type: "header-five", depth: 0, inlineStyleRanges: [], entityRanges: [], data: {} },
            { key: "7u6on", text: "Headline 6", type: "header-six", depth: 0, inlineStyleRanges: [], entityRanges: [], data: {} },
        ];

        const rawContent = {
            entityMap: {},
            blocks,
        } as RawDraftContentState;

        const content = convertFromRaw(rawContent);
        const editorState = EditorState.createWithContent(content);

        const { html } = stateToHtml({
            editorState,
            options,
        });

        const expectedHtml = `<p>Normal Text</p>\n<p><strong>Bold Text</strong></p>\n<p><em>Italic Text</em></p>\n<p><em><strong>Bold Italic Text</strong></em></p>\n<p><del>Strikethrough Text</del></p>\n<p>A <sub>Subscript Text</sub></p>\n<p>B <sup>Superscript Text</sup></p>\n<h1>Headline 1</h1>\n<h2>Headline 2</h2>\n<h3>Headline 3</h3>\n<h4>Headline 4</h4>\n<h5>Headline 5</h5>\n<h6>Headline 6</h6>`;

        expect(html).toEqual(expectedHtml);
    });

    it("should convert the rte editor state with formating into html while keeping the format via tags - formats part 2 (unordered list)", () => {
        const blocks = [
            { key: "a9t3", text: "Unordered List", type: "unordered-list-item", depth: 0, inlineStyleRanges: [], entityRanges: [], data: {} },
            {
                key: "f4o2c",
                text: "123456",
                type: "unordered-list-item",
                depth: 1,
                inlineStyleRanges: [{ offset: 3, length: 3, style: "SUB" }],
                entityRanges: [],
                data: {},
            },
            {
                key: "7v61p",
                text: "234",
                type: "unordered-list-item",
                depth: 2,
                inlineStyleRanges: [{ offset: 0, length: 3, style: "ITALIC" }],
                entityRanges: [],
                data: {},
            },
            {
                key: "1duir",
                text: "345",
                type: "unordered-list-item",
                depth: 2,
                inlineStyleRanges: [{ offset: 0, length: 3, style: "BOLD" }],
                entityRanges: [],
                data: {},
            },
        ];

        const rawContent = {
            entityMap: {},
            blocks,
        } as RawDraftContentState;

        const content = convertFromRaw(rawContent);
        const editorState = EditorState.createWithContent(content);

        const { html } = stateToHtml({
            editorState,
            options,
        });

        const expectedHtml = `<ul>\n  <li>Unordered List\n    <ul>\n      <li>123<sub>456</sub>\n        <ul>\n          <li><em>234</em></li>\n          <li><strong>345</strong></li>\n        </ul>\n      </li>\n    </ul>\n  </li>\n</ul>`;

        expect(html).toEqual(expectedHtml);
    });

    it("should convert the rte editor state with formating into html while keeping the format via tags - formats part 3 (ordered list)", () => {
        const blocks = [
            { key: "1iahs", text: "List", type: "ordered-list-item", depth: 0, inlineStyleRanges: [], entityRanges: [], data: {} },
            {
                key: "aqjhb",
                text: "123456",
                type: "ordered-list-item",
                depth: 1,
                inlineStyleRanges: [{ offset: 3, length: 3, style: "SUP" }],
                entityRanges: [],
                data: {},
            },
            {
                key: "c4js6",
                text: "234",
                type: "ordered-list-item",
                depth: 2,
                inlineStyleRanges: [{ offset: 0, length: 3, style: "ITALIC" }],
                entityRanges: [],
                data: {},
            },
            {
                key: "3qjfc",
                text: "345",
                type: "ordered-list-item",
                depth: 2,
                inlineStyleRanges: [{ offset: 0, length: 3, style: "BOLD" }],
                entityRanges: [],
                data: {},
            },
        ];

        const rawContent = {
            entityMap: {},
            blocks,
        } as RawDraftContentState;

        const content = convertFromRaw(rawContent);
        const editorState = EditorState.createWithContent(content);

        const { html } = stateToHtml({
            editorState,
            options,
        });

        const expectedHtml = `<ol>\n  <li>List\n    <ol>\n      <li>123<sup>456</sup>\n        <ol>\n          <li><em>234</em></li>\n          <li><strong>345</strong></li>\n        </ol>\n      </li>\n    </ol>\n  </li>\n</ol>`;

        expect(html).toEqual(expectedHtml);
    });

    it("should convert the rte editor state with formating into html while keeping the format via tags - formats part 4 (links)", () => {
        const entityMap = {
            "0": {
                type: "LINK",
                mutability: "MUTABLE",
                data: {
                    activeType: "external",
                    attachedBlocks: [{ type: "external", props: { targetUrl: "https://www.vivid-planet.com/", openInNewWindow: false } }],
                },
            },
            "1": {
                type: "LINK",
                mutability: "MUTABLE",
                data: {
                    activeType: "internal",
                    attachedBlocks: [
                        {
                            type: "internal",
                            props: {
                                targetPage: {
                                    id: "5aab378c-7a8f-4442-aa33-4aff950d0233",
                                    name: "RTE Save",
                                    path: "/rte-save",
                                    documentType: "Page",
                                },
                            },
                        },
                    ],
                },
            },
            "2": {
                type: "LINK",
                mutability: "MUTABLE",
                data: { activeType: "news", attachedBlocks: [{ type: "news", props: { id: "3d90dd58-f880-4fd8-a4b8-9ff690655a5b" } }] },
            },
        };

        const blocks = [
            {
                key: "b40ve",
                text: "External Link",
                type: "unstyled",
                depth: 0,
                inlineStyleRanges: [],
                entityRanges: [{ offset: 0, length: 13, key: 0 }],
                data: {},
            },
            {
                key: "67hve",
                text: "Internal Link",
                type: "unstyled",
                depth: 0,
                inlineStyleRanges: [],
                entityRanges: [{ offset: 0, length: 13, key: 1 }],
                data: {},
            },
            {
                key: "8mn26",
                text: "Internal News Link",
                type: "unstyled",
                depth: 0,
                inlineStyleRanges: [],
                entityRanges: [{ offset: 0, length: 18, key: 2 }],
                data: {},
            },
        ];
        const rawContent = {
            entityMap,
            blocks,
        } as RawDraftContentState;

        const content = convertFromRaw(rawContent);
        const editorState = EditorState.createWithContent(content);

        const { html, entities } = stateToHtml({
            editorState,
            options,
        });

        const expectedHtml = `<p><a id="0">External Link</a></p>\n<p><a id="1">Internal Link</a></p>\n<p><a id="2">Internal News Link</a></p>`;

        expect(html).toEqual(expectedHtml);

        const expectedLinkDataList = [
            {
                id: "0",
                data: {
                    activeType: "external",
                    attachedBlocks: [{ type: "external", props: { targetUrl: "https://www.vivid-planet.com/", openInNewWindow: false } }],
                },
            },
            {
                id: "1",
                data: {
                    activeType: "internal",
                    attachedBlocks: [
                        {
                            type: "internal",
                            props: {
                                targetPage: { id: "5aab378c-7a8f-4442-aa33-4aff950d0233", name: "RTE Save", path: "/rte-save", documentType: "Page" },
                            },
                        },
                    ],
                },
            },
            { id: "2", data: { activeType: "news", attachedBlocks: [{ type: "news", props: { id: "3d90dd58-f880-4fd8-a4b8-9ff690655a5b" } }] } },
        ];

        expect(entities).toEqual(expectedLinkDataList);
    });

    it("should convert the rte editor state with formating into html while keeping the format via tags - formats part 5 (custom styles)", () => {
        const blocks = [
            {
                key: "7l333",
                text: "A rte text with custom styling",
                type: "unstyled",
                depth: 0,
                inlineStyleRanges: [{ offset: 0, length: 30, style: "HIGHLIGHT" }],
                entityRanges: [],
                data: {},
            },
        ];

        const rawContent = {
            entityMap: {},
            blocks,
        } as RawDraftContentState;

        const content = convertFromRaw(rawContent);
        const editorState = EditorState.createWithContent(content);

        const { html } = stateToHtml({
            editorState,
            options,
        });

        const expectedHtml = `<p><span class="HIGHLIGHT">A rte text with custom styling</span></p>`;

        expect(html).toEqual(expectedHtml);
    });
});
