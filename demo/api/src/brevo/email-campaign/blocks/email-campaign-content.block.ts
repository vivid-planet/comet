import { createBlocksBlock } from "@dextinity/cms-api";
import { MailButtonBlock } from "@src/mail/blocks/mail-button.block";
import { MailDividerBlock } from "@src/mail/blocks/mail-divider.block";
import { MailImageBlock } from "@src/mail/blocks/mail-image.block";
import { MailRichTextBlock } from "@src/mail/blocks/mail-rich-text.block";
import { MailSpacerBlock } from "@src/mail/blocks/mail-spacer.block";

import { EmailCampaignSalutationBlock } from "./email-campaign-salutation.block";

export const EmailCampaignContentBlock = createBlocksBlock(
    {
        supportedBlocks: {
            text: MailRichTextBlock,
            image: MailImageBlock,
            button: MailButtonBlock,
            divider: MailDividerBlock,
            spacer: MailSpacerBlock,
            salutation: EmailCampaignSalutationBlock,
        },
    },
    {
        name: "EmailCampaignContent",
    },
);
