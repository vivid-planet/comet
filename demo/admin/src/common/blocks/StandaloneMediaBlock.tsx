import { BlockCategory, createCompositeBlock, createCompositeBlockSelectField } from "@comet/cms-admin";
import { type StandaloneMediaBlockData } from "@src/blocks.generated";
import { MediaBlock } from "@src/common/blocks/MediaBlock";
import { mediaAspectRatioOptions } from "@src/util/mediaAspectRatios";
import { defineMessage, FormattedMessage } from "react-intl";

export const StandaloneMediaBlock = createCompositeBlock(
    {
        name: "Media",
        displayName: MediaBlock.displayName,
        blocks: {
            media: {
                block: MediaBlock,
            },
            aspectRatio: {
                block: createCompositeBlockSelectField<StandaloneMediaBlockData["aspectRatio"]>({
                    label: <FormattedMessage id="standaloneMedia.aspectRatio" defaultMessage="Aspect Ratio" />,
                    defaultValue: "16x9",
                    options: mediaAspectRatioOptions,
                }),
            },
        },
        tags: [
            defineMessage({ id: "standaloneMedia.tag.image", defaultMessage: "Image" }),
            defineMessage({ id: "standaloneMedia.tag.video", defaultMessage: "Video" }),
            defineMessage({ id: "standaloneMedia.tag.youtube", defaultMessage: "Youtube" }),
            defineMessage({ id: "standaloneMedia.tag.vimeo", defaultMessage: "Vimeo" }),
        ],
    },
    (block) => {
        block.category = BlockCategory.Media;
        return block;
    },
);
