import { BlockCategory, createCompositeBlock, createCompositeBlockSelectField } from "@comet/blocks-admin";
import { CallToActionBlockData } from "@src/blocks.generated";
import { FormattedMessage } from "react-intl";

import { TextLinkBlock } from "./TextLinkBlock";

export const CallToActionBlock = createCompositeBlock(
    {
        name: "CallToAction",
        displayName: <FormattedMessage id="callToActionBlock.displayName" defaultMessage="Call To Action" />,
        blocks: {
            textLink: {
                block: TextLinkBlock,
                title: <FormattedMessage id="callToActionBlock.link.displayName" defaultMessage="Link" />,
            },
            variant: {
                block: createCompositeBlockSelectField<CallToActionBlockData["variant"]>({
                    defaultValue: "Contained",
                    options: [
                        { value: "Contained", label: <FormattedMessage id="callToActionBlock.variant.contained" defaultMessage="Contained" /> },
                        { value: "Outlined", label: <FormattedMessage id="callToActionBlock.variant.outlined" defaultMessage="Outlined" /> },
                        { value: "Text", label: <FormattedMessage id="callToActionBlock.variant.text" defaultMessage="Text" /> },
                    ],
                    label: <FormattedMessage id="callToActionBlock.variant" defaultMessage="Variant" />,
                    fullWidth: true,
                }),
            },
        },
    },
    (block) => {
        block.category = BlockCategory.Navigation;
        return block;
    },
);
