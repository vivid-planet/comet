import { BlockCategory, createCompositeBlock } from "@comet/blocks-admin";
import { DamImageBlock } from "@comet/cms-admin";
import { HeadlineBlock } from "@src/common/blocks/HeadlineBlock";
import { LinkListBlock } from "@src/common/blocks/LinkListBlock";
import { ColumnsBlock } from "@src/pages/blocks/ColumnsBlock";
import { FormattedMessage } from "react-intl";

const TeaserBlock = createCompositeBlock(
    {
        name: "Teaser",
        displayName: <FormattedMessage id="blocks.teaser" defaultMessage="Teaser" />,
        blocks: {
            // Normal
            headline: {
                block: HeadlineBlock,
                title: <FormattedMessage id="blocks.teaser.headline" defaultMessage="Headline" />,
            },
            // Nested
            image: {
                block: DamImageBlock,
                title: <FormattedMessage id="blocks.teaser.image" defaultMessage="Image" />,
                nested: true,
            },
            // Subroutes
            links: {
                block: LinkListBlock,
                title: <FormattedMessage id="blocks.teaser.links" defaultMessage="Links" />,
            },
            // Nested inner subroutes
            buttons: {
                block: LinkListBlock,
                title: <FormattedMessage id="blocks.teaser.buttons" defaultMessage="Buttons" />,
                nested: true,
            },
            columns: {
                block: ColumnsBlock,
                title: <FormattedMessage id="blocks.teaser.columns" defaultMessage="Columns" />,
            },
        },
    },
    (block) => {
        block.category = BlockCategory.Teaser;
        return block;
    },
);

export { TeaserBlock };
