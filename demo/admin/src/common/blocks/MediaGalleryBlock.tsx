import { BlockCategory, createCompositeBlock, createCompositeBlockSelectField, createListBlock } from "@comet/blocks-admin";
import { MediaGalleryBlockData } from "@src/blocks.generated";
import { MediaGalleryItemBlock } from "@src/common/blocks/MediaGalleryItemBlock";
import { mediaAspectRatioOptions } from "@src/util/mediaAspectRatios";
import { FormattedMessage } from "react-intl";

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
                block: createCompositeBlockSelectField<MediaGalleryBlockData["aspectRatio"]>({
                    defaultValue: "16x9",
                    options: mediaAspectRatioOptions,
                    label: <FormattedMessage id="mediaGalleryBlock.mediaGallery.aspectRatio" defaultMessage="Aspect Ratio" />,
                    fullWidth: true,
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
