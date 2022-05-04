import { BlockInterface, createOneOfBlock } from "@comet/admin-blocks";
import { ExternalLinkBlock, InternalLinkBlock } from "@comet/admin-cms";
import * as React from "react";
import { FormattedMessage } from "react-intl";

export const LinkBlock: BlockInterface = createOneOfBlock({
    supportedBlocks: { internal: InternalLinkBlock, external: ExternalLinkBlock },
    name: "Link",
    displayName: <FormattedMessage id="comet.blocks.link" defaultMessage="Link" />,
    allowEmpty: false,
});
