import { BlockCategory, createCompositeBlock } from "@comet/cms-admin";
import { FormattedMessage } from "react-intl";

export const EmailCampaignDividerBlock = createCompositeBlock({
    name: "EmailCampaignDividerBlock",
    displayName: <FormattedMessage id="emailCampaign.dividerBlock.displayName" defaultMessage="Divider" />,
    category: BlockCategory.Layout,
    blocks: {},
});
