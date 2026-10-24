import { createListBlock } from "@dextinity/cms-admin";
import { FormattedMessage } from "react-intl";

import { KeyFactsItemBlock } from "./KeyFactsItemBlock";

export const KeyFactsBlock = createListBlock({
    name: "KeyFacts",
    displayName: <FormattedMessage id="keyFactsItemsBlock.displayName" defaultMessage="Key facts" />,
    block: KeyFactsItemBlock,
    itemName: <FormattedMessage id="keyFactsItemsBlock.itemName" defaultMessage="item" />,
    itemsName: <FormattedMessage id="keyFactsItemsBlock.itemsName" defaultMessage="items" />,
});
