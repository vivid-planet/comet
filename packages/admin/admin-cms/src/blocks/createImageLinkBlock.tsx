import { BlockInterface, createCompositeBlock } from "@comet/admin-blocks";
import * as React from "react";
import { FormattedMessage } from "react-intl";

import { PixelImageBlock } from "./PixelImageBlock";

interface CreateImageLinkBlockOptions {
    link: BlockInterface;
    image?: BlockInterface;
}

export function createImageLinkBlock({ link: LinkBlock, image = PixelImageBlock }: CreateImageLinkBlockOptions): BlockInterface {
    return createCompositeBlock({
        name: "ImageLink",
        displayName: <FormattedMessage id="comet.blocks.imageLink" defaultMessage="Image/Link" />,
        blocks: {
            link: {
                block: LinkBlock,
                title: <FormattedMessage id="comet.blocks.imageLink.link" defaultMessage="Link" />,
                paper: true,
            },
            image: {
                block: image,
                title: <FormattedMessage id="comet.blocks.imageLink.image" defaultMessage="Image" />,
                paper: true,
            },
        },
    });
}
