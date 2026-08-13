<<<<<<< HEAD
import { NewsletterImageBlock } from "@dextinity/brevo-api";
import { createBlocksBlock } from "@dextinity/cms-api";
=======
import { NewsletterImageBlock } from "@comet/brevo-api";
import { createBlocksBlock } from "@comet/cms-api";
import { MailDividerBlock } from "@src/mail/blocks/mail-divider.block";
import { MailRichTextBlock } from "@src/mail/blocks/mail-rich-text.block";
>>>>>>> main

import { EmailCampaignSalutationBlock } from "./email-campaign-salutation.block";

export const EmailCampaignContentBlock = createBlocksBlock(
    {
        supportedBlocks: {
            text: MailRichTextBlock,
            divider: MailDividerBlock,
            salutation: EmailCampaignSalutationBlock,
            image: NewsletterImageBlock,
        },
    },
    {
        name: "EmailCampaignContent",
    },
);
