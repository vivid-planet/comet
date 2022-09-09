import { BlockInterface, createOneOfBlock, CreateOneOfBlockOptions, LinkBlockInterface } from "@comet/blocks-admin";
import * as React from "react";
import { FormattedMessage } from "react-intl";

import { ExternalLinkBlock } from "./ExternalLinkBlock";
import { InternalLinkBlock } from "./InternalLinkBlock";

interface CreateLinkBlockOptions extends Omit<CreateOneOfBlockOptions, "name" | "supportedBlocks"> {
    name?: string;
    supportedBlocks?: Record<string, BlockInterface & LinkBlockInterface>;
}

function createLinkBlock({
    name = "Link",
    displayName = <FormattedMessage id="comet.blocks.link" defaultMessage="Link" />,
    supportedBlocks = { internal: InternalLinkBlock, external: ExternalLinkBlock },
    allowEmpty = false,
    ...oneOfBlockOptions
}: CreateLinkBlockOptions): BlockInterface & LinkBlockInterface {
    return {
        ...createOneOfBlock({
            name,
            displayName,
            supportedBlocks,
            allowEmpty,
            ...oneOfBlockOptions,
        }),
        url2State: (url) => {
            for (const [type, block] of Object.entries(supportedBlocks)) {
                if (block.url2State?.(url)) {
                    return {
                        attachedBlocks: [{ type, props: block.url2State(url) }],
                        activeType: type,
                    };
                }
            }

            return false;
        },
    };
}

export { createLinkBlock };
