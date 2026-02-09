import { createListBlock } from "@comet/cms-admin";
import { CallToActionBlock } from "@src/common/blocks/CallToActionBlock";
import { FormattedMessage } from "react-intl";

export const NavigationCallToActionButtonListContentBlock = createListBlock({
    name: "NavigationCallToActionButtonListContent",
    displayName: (
        <FormattedMessage
            id="navigationCallToActionButtonLists.blocks.navigationCallToActionButtonListContent"
            defaultMessage="Navigation Button List Content"
        />
    ),
    block: CallToActionBlock,
    itemName: <FormattedMessage id="navigationCallToActionButtonListContentBlock.itemName" defaultMessage="Button" />,
    itemsName: <FormattedMessage id="navigationCallToActionButtonListContentBlock.itemsName" defaultMessage="Buttons" />,
});
