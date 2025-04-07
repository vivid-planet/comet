import { BlockCategory, createCompositeBlock, createCompositeBlockSelectField } from "@comet/blocks-admin";
import { StandaloneMediaBlockData } from "@src/blocks.generated";
import { MediaBlock } from "@src/common/blocks/MediaBlock";
import { mediaAspectRatioOptions } from "@src/util/mediaAspectRatios";
import { FormattedMessage } from "react-intl";

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
                    defaultValue: "16x9",
                    options: mediaAspectRatioOptions,
                    label: <FormattedMessage id="standaloneMedia.aspectRatio" defaultMessage="Aspect Ratio" />,
                    fullWidth: true,
                }),
            },
        },
    },
    (block) => {
        block.category = BlockCategory.Media;
        return block;
    },
);
