import { createListBlock } from "@comet/blocks-admin";
import { KeyFactsItemBlock } from "@src/documents/pages/blocks/KeyFactsItemBlock";
import { FormattedMessage } from "react-intl";

export const KeyFactsBlock = createListBlock({
    name: "KeyFacts",
    displayName: <FormattedMessage id="keyFactsItemsBlock.displayName" defaultMessage="Key facts" />,
    block: KeyFactsItemBlock,
    itemName: <FormattedMessage id="keyFactsItemsBlock.itemName" defaultMessage="item" />,
    itemsName: <FormattedMessage id="keyFactsItemsBlock.itemsName" defaultMessage="items" />,
});
