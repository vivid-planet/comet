import { createListBlock } from "@comet/blocks-admin";
import { TextLinkBlock } from "@src/common/blocks/TextLinkBlock";
import { FormattedMessage } from "react-intl";

export const LinkListBlock = createListBlock({
    name: "LinkList",
    block: TextLinkBlock,
    displayName: <FormattedMessage id="blocks.linkList.displayName" defaultMessage="Link list" />,
    itemName: <FormattedMessage id="blocks.linkList.itemName" defaultMessage="link" />,
    itemsName: <FormattedMessage id="blocks.linkList.itemsName" defaultMessage="links" />,
});
