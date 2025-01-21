import { BlockCategory, createCompositeBlock, createCompositeBlockTextField } from "@comet/blocks-admin";
import { createRichTextBlock } from "@comet/cms-admin";
import { LinkBlock } from "@src/common/blocks/LinkBlock";
import { MediaBlock } from "@src/common/blocks/MediaBlock";
import { TextLinkBlock } from "@src/common/blocks/TextLinkBlock";
import { FormattedMessage } from "react-intl";

const DescriptionRichTextBlock = createRichTextBlock({
    link: LinkBlock,
    rte: {
        maxBlocks: 1,
        supports: ["bold", "italic", "sub", "sup", "non-breaking-space", "soft-hyphen"],
    },
    minHeight: 0,
});

export const TeaserItemBlock = createCompositeBlock(
    {
        name: "TeaserItem",
        displayName: <FormattedMessage id="teaserItemBlock.displayName" defaultMessage="Teaser Item" />,
        blocks: {
            media: {
                block: MediaBlock,
                title: <FormattedMessage id="teaserItemBlock.media" defaultMessage="Media" />,
            },
            title: {
                block: createCompositeBlockTextField({
                    fullWidth: true,
                    label: <FormattedMessage id="teaserItemBlock.title" defaultMessage="Title" />,
                }),
            },
            description: {
                block: DescriptionRichTextBlock,
                title: <FormattedMessage id="teaserItemBlock.description" defaultMessage="Description" />,
            },
            link: {
                block: TextLinkBlock,
            },
        },
    },
    (block) => {
        block.category = BlockCategory.Teaser;
        block.previewContent = (state) => [{ type: "text", content: state.title }];
        return block;
    },
);
