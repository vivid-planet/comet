import { BlockCategory, createCompositeBlock, createCompositeBlockSelectField } from "@comet/cms-admin";
import type { MailSpacerBlockData } from "@src/blocks.generated";
import { FormattedMessage } from "react-intl";

export const MailSpacerBlock = createCompositeBlock({
    name: "MailSpacer",
    displayName: <FormattedMessage id="welcomeEmail.spacer.displayName" defaultMessage="Spacer" />,
    category: BlockCategory.Layout,
    blocks: {
        spacing: {
            block: createCompositeBlockSelectField<MailSpacerBlockData["spacing"]>({
                label: <FormattedMessage id="welcomeEmail.spacer.spacing" defaultMessage="Spacing" />,
                defaultValue: "medium",
                required: true,
                options: [
                    { value: "small", label: <FormattedMessage id="welcomeEmail.spacer.spacing.small" defaultMessage="Small" /> },
                    { value: "medium", label: <FormattedMessage id="welcomeEmail.spacer.spacing.medium" defaultMessage="Medium" /> },
                    { value: "large", label: <FormattedMessage id="welcomeEmail.spacer.spacing.large" defaultMessage="Large" /> },
                ],
            }),
        },
    },
});
