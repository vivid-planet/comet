import { BlockCategory, createCompositeBlock, createCompositeBlockSelectField, createListBlock } from "@dextinity/cms-admin";
import { FormattedMessage } from "react-intl";

import { mediaAspectRatioOptions } from "../../util/mediaAspectRatios";
import { MediaGalleryItemBlock } from "./MediaGalleryItemBlock";

const MediaGalleryListBlock = createListBlock({
    name: "MediaGalleryList",
    block: MediaGalleryItemBlock,
    itemName: <FormattedMessage id="mediaGalleryBlock.mediaGalleryList.itemName" defaultMessage="item" />,
    itemsName: <FormattedMessage id="mediaGalleryBlock.mediaGalleryList.itemsName" defaultMessage="items" />,
});

export const MediaGalleryBlock = createCompositeBlock(
    {
        name: "MediaGallery",
        displayName: <FormattedMessage id="mediaGalleryBlock.mediaGallery.displayName" defaultMessage="Media Gallery" />,
        blocks: {
            items: {
                block: MediaGalleryListBlock,
                title: <FormattedMessage id="mediaGalleryBlock.mediaGallery.list" defaultMessage="Media Gallery List" />,
            },
            aspectRatio: {
                block: createCompositeBlockSelectField({
                    label: <FormattedMessage id="mediaGalleryBlock.mediaGallery.aspectRatio" defaultMessage="Aspect Ratio" />,
                    defaultValue: "16x9",
                    options: mediaAspectRatioOptions,
                    required: true,
                }),
                hiddenInSubroute: true,
            },
        },
    },
    (block) => {
        block.category = BlockCategory.Media;
        return block;
    },
);
