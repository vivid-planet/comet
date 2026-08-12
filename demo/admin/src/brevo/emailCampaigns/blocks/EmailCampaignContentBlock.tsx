import { NewsletterImageBlock } from "@comet/brevo-admin";
import { createBlocksBlock } from "@comet/cms-admin";
import { EmailCampaignRichTextBlock } from "@src/brevo/emailCampaigns/blocks/EmailCampaignRichTextBlock";
import { MailDividerBlock } from "@src/mail/blocks/MailDividerBlock";

import { EmailCampaignSalutationBlock } from "./EmailCampaignSalutationBlock";

export const EmailCampaignContentBlock = createBlocksBlock({
    name: "EmailCampaignContent",
    supportedBlocks: {
        divider: MailDividerBlock,
        text: EmailCampaignRichTextBlock,
        salutation: EmailCampaignSalutationBlock,
        image: NewsletterImageBlock,
    },
});
