import { createListBlock } from "@comet/blocks-admin";
import { FormattedMessage } from "react-intl";

import { AccordionItemBlock } from "./AccordionItemBlock";

export const AccordionBlock = createListBlock({
    name: "Accordion",
    displayName: <FormattedMessage id="accordionBlock.displayName" defaultMessage="Accordion" />,
    block: AccordionItemBlock,
    itemName: <FormattedMessage id="accordionBlock.itemName" defaultMessage="accordion item" />,
    itemsName: <FormattedMessage id="accordionBlock.itemsName" defaultMessage="accordion items" />,
});
