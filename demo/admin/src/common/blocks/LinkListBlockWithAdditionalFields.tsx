import { createListBlock } from "@comet/blocks-admin";
import { TextLinkBlock } from "@src/common/blocks/TextLinkBlock";
import { userGroupAdditionalItemFields } from "@src/userGroups/userGroupAdditionalItemFields";
import { UserGroupChip } from "@src/userGroups/UserGroupChip";
import { UserGroupContextMenuItem } from "@src/userGroups/UserGroupContextMenuItem";
import { FormattedMessage } from "react-intl";

export const LinkListBlockWithAdditionalFields = createListBlock({
    name: "LinkListWithAdditionalFields",
    block: TextLinkBlock,
    displayName: <FormattedMessage id="blocks.linkList.displayName" defaultMessage="Link list" />,
    itemName: <FormattedMessage id="blocks.linkList.itemName" defaultMessage="link" />,
    itemsName: <FormattedMessage id="blocks.linkList.itemsName" defaultMessage="links" />,
    additionalItemFields: {
        ...userGroupAdditionalItemFields,
    },
    AdditionalItemContextMenuItems: ({ item, onChange, onMenuClose }) => {
        return <UserGroupContextMenuItem item={item} onChange={onChange} onMenuClose={onMenuClose} />;
    },
    AdditionalItemContent: ({ item }) => {
        return <UserGroupChip item={item} />;
    },
});
