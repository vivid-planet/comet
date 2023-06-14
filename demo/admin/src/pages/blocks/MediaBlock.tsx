import { BlockCategory, createOneOfBlock } from "@comet/blocks-admin";
import { DamImageBlock, DamVideoBlock } from "@comet/cms-admin";
import * as React from "react";
import { FormattedMessage } from "react-intl";

export const MediaBlock = createOneOfBlock({
    name: "Media",
    displayName: <FormattedMessage id="pages.blocks.media" defaultMessage="Media" />,
    category: BlockCategory.Media,
    supportedBlocks: { image: DamImageBlock, video: DamVideoBlock },
    allowEmpty: true,
});
