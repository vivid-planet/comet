import { convertFromRaw, DraftInlineStyleType, EditorState } from "draft-js";
import { v4 } from "uuid";

import stateToHTML from "./stateToHTML";

describe("stateToHTML", () => {
    it("should insert pseudo tags in correct order for multiple inline styles", () => {
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
            '<i class="1">Lorem ipsum</i> <i class="2">dolor sit amet,</i> <i class="3"><i class="4">consectetuer adipiscing elit.\nAenean commodo ligula eget dolor</i></i><i class="4">.</i>',
        );
    });
});
