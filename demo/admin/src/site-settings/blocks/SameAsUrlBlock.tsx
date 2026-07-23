import { createCompositeBlock, createCompositeBlockTextField } from "@comet/cms-admin";
import { FormattedMessage } from "react-intl";

const validateUrl = (value?: string) =>
    value && !URL.canParse(value) ? <FormattedMessage id="siteSettings.blocks.invalidUrl" defaultMessage="Invalid URL" /> : undefined;

export const SameAsUrlBlock = createCompositeBlock({
    name: "SameAsUrl",
    displayName: <FormattedMessage id="siteSettings.blocks.sameAsUrl.displayName" defaultMessage="URL" />,
    blocks: {
        url: {
            block: createCompositeBlockTextField({
                label: <FormattedMessage id="siteSettings.blocks.sameAsUrl.url" defaultMessage="URL" />,
                validate: validateUrl,
            }),
            hiddenInSubroute: true,
        },
    },
});
