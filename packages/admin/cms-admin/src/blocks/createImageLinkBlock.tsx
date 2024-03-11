import { BlockInterface, createCompositeBlock } from "@comet/blocks-admin";
import * as React from "react";
import { FormattedMessage } from "react-intl";

import { PixelImageBlock } from "./PixelImageBlock";

interface CreateImageLinkBlockOptions {
    link: BlockInterface;
    image?: BlockInterface;
    name?: string;
}

export function createImageLinkBlock({ link: LinkBlock, image = PixelImageBlock, name = "ImageLink" }: CreateImageLinkBlockOptions): BlockInterface {
    return createCompositeBlock({
        name,
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
