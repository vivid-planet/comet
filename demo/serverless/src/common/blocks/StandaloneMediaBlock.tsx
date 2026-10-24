import { BlockCategory, createCompositeBlock, createCompositeBlockSelectField } from "@dextinity/cms-admin";
import { FormattedMessage } from "react-intl";

import { mediaAspectRatioOptions } from "../../util/mediaAspectRatios";
import { MediaBlock } from "./MediaBlock";

export const StandaloneMediaBlock = createCompositeBlock(
    {
        name: "Media",
        displayName: MediaBlock.displayName,
        blocks: {
            media: {
                block: MediaBlock,
            },
            aspectRatio: {
                block: createCompositeBlockSelectField({
                    label: <FormattedMessage id="standaloneMedia.aspectRatio" defaultMessage="Aspect Ratio" />,
                    defaultValue: "16x9",
                    options: mediaAspectRatioOptions,
                    required: true,
                }),
            },
        },
    },
    (block) => {
        block.category = BlockCategory.Media;
        return block;
    },
);
