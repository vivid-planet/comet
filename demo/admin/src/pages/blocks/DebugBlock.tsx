import { createCompositeBlock } from "@comet/blocks-admin";
import { PixelImageBlock } from "@comet/cms-admin";
import { RichTextBlock } from "@src/common/blocks/RichTextBlock";
import * as React from "react";
import { FormattedMessage } from "react-intl";

export const DebugBlock = createCompositeBlock({
    name: "Debug",
    displayName: "Debug",
    groups: {
        image: {
            blocks: {
                image: {
                    block: PixelImageBlock,
                    hiddenInSubroute: true,
                },
            },
            title: <FormattedMessage id="blocks.image" defaultMessage="Image" />,
            paper: true,
            hiddenInSubroute: true,
        },
        icon: {
            blocks: {
                icon: {
                    block: PixelImageBlock,
                    hiddenInSubroute: true,
                },
            },
            title: <FormattedMessage id="blocks.icon" defaultMessage="Icon" />,
            paper: true,
            hiddenInSubroute: true,
        },
        text: {
            blocks: {
                text: {
                    block: RichTextBlock,
                    hiddenInSubroute: true,
                },
            },
            title: <FormattedMessage id="blocks.headline" defaultMessage="Headline" />,
            paper: true,
        },
    },
});
