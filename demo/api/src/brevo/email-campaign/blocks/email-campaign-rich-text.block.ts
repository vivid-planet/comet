import { createRichTextBlock } from "@comet/cms-api";

import { EmailCampaignLinkBlock } from "./email-campaign-link.block";

export const EmailCampaignRichTextBlock = createRichTextBlock({ link: EmailCampaignLinkBlock });
