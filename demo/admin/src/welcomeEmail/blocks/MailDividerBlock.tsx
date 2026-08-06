import { BlockCategory, createCompositeBlock } from "@comet/cms-admin";
import { FormattedMessage } from "react-intl";

export const MailDividerBlock = createCompositeBlock({
    name: "MailDivider",
    displayName: <FormattedMessage id="welcomeEmail.divider.displayName" defaultMessage="Divider" />,
    category: BlockCategory.Layout,
    blocks: {},
});
