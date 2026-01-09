import { NewsletterImageBlock } from "@comet/brevo-admin";
import { createBlocksBlock } from "@comet/cms-admin";
import { EmailCampaignRichTextBlock } from "@src/brevo/emailCampaigns/blocks/EmailCampaignRichTextBlock";

import { EmailCampaignDividerBlock } from "./EmailCampaignDividerBlock";
import { EmailCampaignSalutationBlock } from "./EmailCampaignSalutationBlock";

export const EmailCampaignContentBlock = createBlocksBlock({
    name: "EmailCampaignContent",
    supportedBlocks: {
        divider: EmailCampaignDividerBlock,
        text: EmailCampaignRichTextBlock,
        salutation: EmailCampaignSalutationBlock,
        image: NewsletterImageBlock,
    },
});
