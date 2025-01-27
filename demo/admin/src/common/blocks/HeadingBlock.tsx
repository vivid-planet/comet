import { BlockCategory, createCompositeBlock, createCompositeBlockSelectField } from "@comet/blocks-admin";
import { createRichTextBlock } from "@comet/cms-admin";
import { HeadingBlockData } from "@src/blocks.generated";
import { FormattedMessage } from "react-intl";

import { LinkBlock } from "./LinkBlock";

const EyebrowRichTextBlock = createRichTextBlock({
    link: LinkBlock,
    rte: {
        maxBlocks: 1,
        supports: ["bold", "italic", "sub", "sup", "non-breaking-space", "soft-hyphen"],
    },
    minHeight: 0,
});

const HeadingRichTextBlock = createRichTextBlock({
    link: LinkBlock,
    rte: {
        maxBlocks: 1,
        supports: [
            "header-one",
            "header-two",
            "header-three",
            "header-four",
            "header-five",
            "header-six",
            "bold",
            "italic",
            "sub",
            "sup",
            "non-breaking-space",
            "soft-hyphen",
        ],
        standardBlockType: "header-one",
        blocktypeMap: {
            "header-one": {
                label: <FormattedMessage id="headingBlock.size600" defaultMessage="Size 600" />,
            },
            "header-two": {
                label: <FormattedMessage id="headingBlock.size550" defaultMessage="Size 550" />,
            },
            "header-three": {
                label: <FormattedMessage id="headingBlock.size500" defaultMessage="Size 500" />,
            },
            "header-four": {
                label: <FormattedMessage id="headingBlock.size450" defaultMessage="Size 450" />,
            },
            "header-five": {
                label: <FormattedMessage id="headingBlock.size400" defaultMessage="Size 400" />,
            },
            "header-six": {
                label: <FormattedMessage id="headingBlock.size350" defaultMessage="Size 350" />,
            },
        },
    },
    minHeight: 0,
});

export const HeadingBlock = createCompositeBlock(
    {
        name: "Heading",
        displayName: <FormattedMessage id="headingBlock.displayName" defaultMessage="Heading" />,
        blocks: {
            eyebrow: {
                block: EyebrowRichTextBlock,
                title: <FormattedMessage id="headingBlock.eyebrow" defaultMessage="Eyebrow" />,
            },
            heading: {
                block: HeadingRichTextBlock,
                title: <FormattedMessage id="headingBlock.title" defaultMessage="Heading" />,
            },
            htmlTag: {
                block: createCompositeBlockSelectField<HeadingBlockData["htmlTag"]>({
                    defaultValue: "H2",
                    options: [
                        { value: "H1", label: <FormattedMessage id="headingBlock.heading1" defaultMessage="Heading 1" /> },
                        { value: "H2", label: <FormattedMessage id="headingBlock.heading2" defaultMessage="Heading 2" /> },
                        { value: "H3", label: <FormattedMessage id="headingBlock.heading3" defaultMessage="Heading 3" /> },
                        { value: "H4", label: <FormattedMessage id="headingBlock.heading4" defaultMessage="Heading 4" /> },
                        { value: "H5", label: <FormattedMessage id="headingBlock.heading5" defaultMessage="Heading 5" /> },
                        { value: "H6", label: <FormattedMessage id="headingBlock.heading6" defaultMessage="Heading 6" /> },
                    ],
                    label: <FormattedMessage id="headingBlock.htmlTag" defaultMessage="HTML tag" />,
                    fullWidth: true,
                }),
            },
        },
    },
    (block) => {
        block.category = BlockCategory.TextAndContent;
        return block;
    },
);
