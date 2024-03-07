import { createListBlock } from "@comet/blocks-admin";
import { userGroupAdditionalItemFields } from "@src/userGroups/userGroupAdditionalItemFields";
import { UserGroupChip } from "@src/userGroups/UserGroupChip";
import { UserGroupContextMenuItem } from "@src/userGroups/UserGroupContextMenuItem";
import * as React from "react";
import { FormattedMessage } from "react-intl";

import { TextLinkBlock } from "./TextLinkBlock";

export const LinkListBlock = createListBlock({
    name: "LinkList",
    block: TextLinkBlock,
    displayName: <FormattedMessage id="blocks.linkList.displayName" defaultMessage="Link list" />,
    itemName: <FormattedMessage id="blocks.linkList.itemName" defaultMessage="link" />,
    itemsName: <FormattedMessage id="blocks.linkList.itemsName" defaultMessage="links" />,
    additionalItemFields: {
        ...userGroupAdditionalItemFields,
    },
    maxVisibleBlocks: 2,
    AdditionalItemContextMenuItems: ({ item, onChange, onMenuClose }) => {
        return <UserGroupContextMenuItem item={item} onChange={onChange} onMenuClose={onMenuClose} />;
    },
    AdditionalItemContent: ({ item }) => {
        return <UserGroupChip item={item} />;
    },
});
