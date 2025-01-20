import { createListBlock } from "@comet/blocks-admin";
import { TeaserItemBlock } from "@src/documents/pages/blocks/TeaserItemBlock";
import { FormattedMessage } from "react-intl";

export const TeaserBlock = createListBlock({
    name: "Teaser",
    displayName: <FormattedMessage id="teaserBlock.displayName" defaultMessage="Teaser" />,
    block: TeaserItemBlock,
    itemName: <FormattedMessage id="teaserItemsBlock.itemName" defaultMessage="item" />,
    itemsName: <FormattedMessage id="teaserItemsBlock.itemsName" defaultMessage="items" />,
});
