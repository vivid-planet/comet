import { BlockCategory, createOneOfBlock } from "@comet/blocks-admin";
import { PixelImageBlock, SvgImageBlock } from "@comet/cms-admin";
import * as React from "react";
import { FormattedMessage } from "react-intl";

export const ImageBlock = createOneOfBlock({
    supportedBlocks: { pixelImage: PixelImageBlock, svgImage: SvgImageBlock },
    name: "Image",
    displayName: <FormattedMessage id="comet.blocks.image" defaultMessage="Image" />,
    category: BlockCategory.Media,
    allowEmpty: false,
    variant: "toggle",
});
