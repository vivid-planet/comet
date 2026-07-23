import { createCompositeBlock } from "@comet/cms-admin";
import { FormattedMessage } from "react-intl";

import { OrganizationBlock } from "./OrganizationBlock";

export const SiteSettingsContentBlock = createCompositeBlock({
    name: "SiteSettingsContent",
    displayName: null,
    blocks: {
        organization: {
            block: OrganizationBlock,
            title: <FormattedMessage id="siteSettings.blocks.organization" defaultMessage="Organization" />,
        },
    },
});
