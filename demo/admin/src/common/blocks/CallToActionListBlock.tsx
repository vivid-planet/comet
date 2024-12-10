import { createListBlock } from "@comet/blocks-admin";
import { FormattedMessage } from "react-intl";

import { CallToActionBlock } from "./CallToActionBlock";

export const CallToActionListBlock = createListBlock({
    name: "CallToActionList",
    displayName: <FormattedMessage id="callToActionListBlock.displayName" defaultMessage="Call To Action List" />,
    block: CallToActionBlock,
    itemName: <FormattedMessage id="callToActionListBlock.itemName" defaultMessage="action" />,
    itemsName: <FormattedMessage id="callToActionListBlock.itemsName" defaultMessage="actions" />,
});
