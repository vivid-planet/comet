import { BlockCategory, createCompositeBlock, createCompositeBlockSelectField, createCompositeBlockTextField } from "@comet/blocks-admin";
import { createRichTextBlock } from "@comet/cms-admin";
import { HeadlineBlockData } from "@src/blocks.generated";
import { LinkBlock } from "@src/common/blocks/LinkBlock";

const RichTextBlock = createRichTextBlock({
    link: LinkBlock,
    rte: {
        maxBlocks: 1,
        supports: ["bold", "italic", "non-breaking-space"],
        blocktypeMap: {},
    },
    minHeight: 0,
});

export const HeadlineBlock = createCompositeBlock(
    {
        name: "Headline",
        displayName: "Headline",
        blocks: {
            eyebrow: {
                block: createCompositeBlockTextField({
                    fieldProps: { label: "Eyebrow" },
                }),
            },
            headline: {
                block: RichTextBlock,
                title: "Headline",
            },
            level: {
                block: createCompositeBlockSelectField<HeadlineBlockData["level"]>({
                    defaultValue: "header-one",
                    fieldProps: { label: "Level", fullWidth: true },
                    options: [
                        { value: "header-one", label: "Header One" },
                        { value: "header-two", label: "Header Two" },
                        { value: "header-three", label: "Header Three" },
                        { value: "header-four", label: "Header Four" },
                        { value: "header-five", label: "Header Five" },
                        { value: "header-six", label: "Header Six" },
                    ],
                }),
            },
        },
    },
    (block) => ({
        ...block,
        category: BlockCategory.TextAndContent,
    }),
);
