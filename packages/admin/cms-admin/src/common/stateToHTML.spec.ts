import { convertFromRaw, DraftInlineStyleType, EditorState } from "draft-js";
import { v4 } from "uuid";

import stateToHTML from "./stateToHTML";

describe("stateToHTML", () => {
    it("should insert pseudo-tags for multiple sequential inline styles", () => {
        const rawContent = {
            entityMap: {},
            blocks: [
                {
                    key: v4(),
                    text: "Let's test bold and italic.",
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
                },
            ],
        };

        const content = convertFromRaw(rawContent);
        const mockState = { editorState: EditorState.createWithContent(content) };

        expect(stateToHTML(mockState.editorState.getCurrentContent())).toEqual('Let\'s test <i class="1">bold</i> and <i class="2">italic</i>.');
    });

    it("should insert pseudo-tags in correct order for nested inline styles", () => {
        const rawContent = {
            entityMap: {},
            blocks: [
                {
                    key: v4(),
                    text: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit.",
                    type: "unstyled",
                    depth: 0,
                    inlineStyleRanges: [
                        {
                            offset: 0,
                            length: 11,
                            style: "BOLD" as DraftInlineStyleType,
                        },
                        {
                            offset: 28,
                            length: 29,
                            style: "BOLD" as DraftInlineStyleType,
                        },
                        {
                            offset: 12,
                            length: 15,
                            style: "ITALIC" as DraftInlineStyleType,
                        },
                        {
                            offset: 28,
                            length: 28,
                            style: "ITALIC" as DraftInlineStyleType,
                        },
                    ],
                    entityRanges: [],
                    data: {},
                },
                {
                    key: "3bflg",
                    text: "Aenean commodo ligula eget dolor.",
                    type: "unstyled",
                    depth: 0,
                    inlineStyleRanges: [],
                    entityRanges: [],
                    data: {},
                },
            ],
        };

        const content = convertFromRaw(rawContent);
        const mockState = { editorState: EditorState.createWithContent(content) };

        expect(stateToHTML(mockState.editorState.getCurrentContent())).toEqual(
            '<i class="1">Lorem ipsum</i> <i class="2">dolor sit amet,</i> <i class="4"><i class="3">consectetuer adipiscing elit</i></i><i class="3">.</i>\nAenean commodo ligula eget dolor.',
        );
    });
});
