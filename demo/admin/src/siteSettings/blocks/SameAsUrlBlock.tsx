import { createCompositeBlock, createCompositeBlockTextField, validateUrl } from "@dextinity/cms-admin";
import { FormattedMessage } from "react-intl";

export const SameAsUrlBlock = createCompositeBlock(
    {
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
    },
    (block) => {
        block.previewContent = (state) => (state.url ? [{ type: "text", content: state.url }] : []);
        return block;
    },
);
