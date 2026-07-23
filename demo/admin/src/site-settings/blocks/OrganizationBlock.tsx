import { createCompositeBlock, createCompositeBlockTextField, createListBlock, DamImageBlock } from "@comet/cms-admin";
import { FormattedMessage } from "react-intl";

import { SameAsUrlBlock } from "./SameAsUrlBlock";

const validateUrl = (value?: string) =>
    value && !URL.canParse(value) ? <FormattedMessage id="siteSettings.blocks.invalidUrl" defaultMessage="Invalid URL" /> : undefined;

const SameAsListBlock = createListBlock({
    name: "SameAsList",
    displayName: <FormattedMessage id="siteSettings.blocks.sameAs.displayName" defaultMessage="Same as" />,
    block: SameAsUrlBlock,
    itemName: <FormattedMessage id="siteSettings.blocks.sameAs.itemName" defaultMessage="URL" />,
    itemsName: <FormattedMessage id="siteSettings.blocks.sameAs.itemsName" defaultMessage="URLs" />,
});

export const OrganizationBlock = createCompositeBlock({
    name: "Organization",
    displayName: null,
    blocks: {
        name: {
            block: createCompositeBlockTextField({
                label: <FormattedMessage id="siteSettings.blocks.organization.name" defaultMessage="Name" />,
                required: true,
            }),
            hiddenInSubroute: true,
        },
        url: {
            block: createCompositeBlockTextField({
                label: <FormattedMessage id="siteSettings.blocks.organization.url" defaultMessage="URL" />,
                helperText: (
                    <FormattedMessage
                        id="siteSettings.blocks.organization.url.helperText"
                        defaultMessage="If empty, the site URL configured for this scope (siteConfig.url) is used."
                    />
                ),
                validate: validateUrl,
            }),
            hiddenInSubroute: true,
        },
        logo: {
            block: DamImageBlock,
            title: <FormattedMessage id="siteSettings.blocks.organization.logo" defaultMessage="Logo" />,
            hiddenInSubroute: true,
        },
        sameAs: {
            block: SameAsListBlock,
            title: <FormattedMessage id="siteSettings.blocks.organization.sameAs" defaultMessage="Same as" />,
        },
        description: {
            block: createCompositeBlockTextField({
                label: <FormattedMessage id="siteSettings.blocks.organization.description" defaultMessage="Description" />,
                multiline: true,
            }),
            hiddenInSubroute: true,
        },
    },
});
