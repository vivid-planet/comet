import { BlockCategory, createCompositeBlock, createCompositeBlockSelectField } from "@comet/blocks-admin";
import { StandaloneMediaBlockData } from "@src/blocks.generated";
import { MediaBlock } from "@src/common/blocks/MediaBlock";
import { mediaAspectRatioOptions } from "@src/util/mediaAspectRatios";
import { FormattedMessage } from "react-intl";

export const StandaloneMediaBlock = createCompositeBlock(
    {
        name: "Media",
        displayName: <FormattedMessage id="standaloneMedia.displayName" defaultMessage="Media" />,
        blocks: {
            media: {
                block: MediaBlock,
            },
            aspectRatio: {
                block: createCompositeBlockSelectField<StandaloneMediaBlockData["aspectRatio"]>({
                    defaultValue: "16x9",
                    options: mediaAspectRatioOptions,
                    fieldProps: { label: <FormattedMessage id="standaloneMedia.aspectRatio" defaultMessage="Aspect Ratio" />, fullWidth: true },
                }),
            },
        },
    },
    (block) => {
        block.category = BlockCategory.Media;
        return block;
    },
);
