import {
    BlockCategory,
    createCompositeBlock,
    createCompositeBlockSelectField,
    createCompositeBlockTextField,
    ExternalLinkBlock,
} from "@comet/cms-admin";
import type { MailButtonBlockData } from "@src/blocks.generated";
import { FormattedMessage } from "react-intl";

export const MailButtonBlock = createCompositeBlock({
    name: "MailButton",
    displayName: <FormattedMessage id="welcomeEmail.button.displayName" defaultMessage="Button" />,
    category: BlockCategory.Navigation,
    blocks: {
        text: {
            block: createCompositeBlockTextField({
                label: <FormattedMessage id="welcomeEmail.button.text" defaultMessage="Text" />,
            }),
        },
        link: {
            block: ExternalLinkBlock,
            title: <FormattedMessage id="welcomeEmail.button.link" defaultMessage="Link" />,
            paper: true,
        },
        variant: {
            block: createCompositeBlockSelectField<MailButtonBlockData["variant"]>({
                label: <FormattedMessage id="welcomeEmail.button.variant" defaultMessage="Variant" />,
                defaultValue: "filled",
                required: true,
                options: [
                    { value: "filled", label: <FormattedMessage id="welcomeEmail.button.variant.filled" defaultMessage="Filled" /> },
                    { value: "outlined", label: <FormattedMessage id="welcomeEmail.button.variant.outlined" defaultMessage="Outlined" /> },
                ],
            }),
        },
        align: {
            block: createCompositeBlockSelectField<MailButtonBlockData["align"]>({
                label: <FormattedMessage id="welcomeEmail.button.align" defaultMessage="Align" />,
                defaultValue: "left",
                required: true,
                options: [
                    { value: "left", label: <FormattedMessage id="welcomeEmail.button.align.left" defaultMessage="Left" /> },
                    { value: "center", label: <FormattedMessage id="welcomeEmail.button.align.center" defaultMessage="Center" /> },
                    { value: "right", label: <FormattedMessage id="welcomeEmail.button.align.right" defaultMessage="Right" /> },
                ],
            }),
        },
    },
});
