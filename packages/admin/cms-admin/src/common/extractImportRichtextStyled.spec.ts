import { DraftInlineStyleType } from "draft-js";

import { extractRichtextStyles } from "./extractImportRichtextStyles";

describe("extractRichtextStyles", () => {
    it("should insert pseudo tags at inline style position", () => {
        const block = {
            key: "5jda2",
            text: "Another Headline in RTE",
            type: "header-three",
            depth: 0,
            inlineStyleRanges: [{ offset: 8, length: 8, style: "BOLD" as DraftInlineStyleType }],
            entityRanges: [],
            data: {},
        };

        expect(extractRichtextStyles(block)).toEqual("Another <i>Headline</i> in RTE");
    });
});
