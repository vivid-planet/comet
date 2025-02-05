import { type ExtractBlockInputFactoryProps } from "@comet/cms-api";
import { type RichTextBlock } from "@src/common/blocks/rich-text.block";

export const generateRichtextBlock = (): ExtractBlockInputFactoryProps<typeof RichTextBlock> => {
    return {
        draftContent: {
            blocks: [
                {
                    key: "5jda2",
                    text: "Another Headline in RTE",
                    type: "header-three",
                    depth: 0,
                    inlineStyleRanges: [],
                    entityRanges: [],
                    data: {},
                },
                {
                    key: "bifh7",
                    text: "1",
                    type: "unordered-list-item",
                    depth: 0,
                    inlineStyleRanges: [],
                    entityRanges: [],
                    data: {},
                },
                {
                    key: "er118",
                    text: "2",
                    type: "unordered-list-item",
                    depth: 1,
                    inlineStyleRanges: [],
                    entityRanges: [],
                    data: {},
                },
                {
                    key: "5e7g4",
                    text: "three",
                    type: "unordered-list-item",
                    depth: 0,
                    inlineStyleRanges: [],
                    entityRanges: [],
                    data: {},
                },
                {
                    key: "bb4fe",
                    text: "Test soft-hyphen: pneu\u00admonoultra\u00admicroscopicsilico\u00advolcanoconiosis",
                    type: "header-one",
                    depth: 0,
                    inlineStyleRanges: [
                        {
                            offset: 18,
                            length: 44,
                            style: "ITALIC",
                        },
                        {
                            offset: 65,
                            length: 1,
                            style: "ITALIC",
                        },
                    ],
                    entityRanges: [],
                    data: {},
                },
                {
                    key: "4oobv",
                    text: "Ein paar emojis: 😀🌍️",
                    type: "unstyled",
                    depth: 0,
                    inlineStyleRanges: [],
                    entityRanges: [],
                    data: {},
                },
                {
                    key: "37lco",
                    text: "",
                    type: "unstyled",
                    depth: 0,
                    inlineStyleRanges: [],
                    entityRanges: [],
                    data: {},
                },
                {
                    key: "a5q4f",
                    text: "Custom Headline...",
                    type: "header-custom-green",
                    depth: 0,
                    inlineStyleRanges: [],
                    entityRanges: [],
                    data: {},
                },
                {
                    key: "af1q4",
                    text: "Foo bar...",
                    type: "unstyled",
                    depth: 0,
                    inlineStyleRanges: [],
                    entityRanges: [],
                    data: {},
                },
            ],
            entityMap: {},
        },
    };
};
