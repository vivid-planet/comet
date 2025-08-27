import {
    BlockCategory,
    createCompositeBlock,
    createCompositeBlockSelectField,
    createCompositeBlockTextField,
    createRichTextBlock,
} from "@comet/cms-admin";
import { type TeaserItemBlockData } from "@src/blocks.generated";
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
                    label: <FormattedMessage id="teaserItemBlock.title" defaultMessage="Title" />,
                }),
            },
            htmlTag: {
                block: createCompositeBlockSelectField<TeaserItemBlockData["htmlTag"]>({
                    label: <FormattedMessage id="teaserItemBlock.htmlTag" defaultMessage="HTML tag" />,
                    defaultValue: "h3",
                    options: [
                        { value: "h1", label: <FormattedMessage id="teaserItemBlock.headline1" defaultMessage="Headline 1" /> },
                        { value: "h2", label: <FormattedMessage id="teaserItemBlock.headline2" defaultMessage="Headline 2" /> },
                        { value: "h3", label: <FormattedMessage id="teaserItemBlock.headline3" defaultMessage="Headline 3" /> },
                        { value: "h4", label: <FormattedMessage id="teaserItemBlock.headline4" defaultMessage="Headline 4" /> },
                        { value: "h5", label: <FormattedMessage id="teaserItemBlock.headline5" defaultMessage="Headline 5" /> },
                        { value: "h6", label: <FormattedMessage id="teaserItemBlock.headline6" defaultMessage="Headline 6" /> },
                    ],
                    required: true,
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
