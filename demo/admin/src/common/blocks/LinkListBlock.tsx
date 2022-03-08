import { createListBlock } from "@comet/admin-blocks";
import * as React from "react";
import { FormattedMessage } from "react-intl";

import { TextLinkBlock } from "./TextLinkBlock";

export const LinkListBlock = createListBlock({
    name: "LinkList",
    block: TextLinkBlock,
    displayName: <FormattedMessage id="cometDemo.blocks.linkList.displayName" defaultMessage="Link list" />,
    itemName: <FormattedMessage id="cometDemo.blocks.linkList.itemName" defaultMessage="link" />,
    itemsName: <FormattedMessage id="cometDemo.blocks.linkList.itemsName" defaultMessage="links" />,
});
