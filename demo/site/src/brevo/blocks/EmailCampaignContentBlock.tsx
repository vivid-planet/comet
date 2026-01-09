import { NewsletterImageBlock } from "@comet/mail-react";
import { type SupportedBlocks } from "@comet/site-nextjs";
import { type EmailCampaignContentBlockData } from "@src/blocks.generated";
import { EmailCampaignDividerBlock } from "@src/brevo/blocks/EmailCampaignDividerBlock";
import { EmailCampaignRichTextBlock } from "@src/brevo/blocks/EmailCampaignRichTextBlock";
import { BlocksBlock } from "@src/brevo/temp/BlocksBlock";
import { type EmailCampaignConfig } from "@src/brevo/util/getEmailCampaignConfigFromEnvVariables";

import { EmailCampaignSalutationBlock } from "./EmailCampaignSalutationBlock";

function getSupportedBlocks(config: EmailCampaignConfig): SupportedBlocks {
    return {
        divider: (data) => <EmailCampaignDividerBlock />,
        text: (data) => <EmailCampaignRichTextBlock data={data} />,
        salutation: (data) => <EmailCampaignSalutationBlock data={data} />,
        image: (data) => <NewsletterImageBlock data={data} validSizes={config.images.validSizes} baseUrl={config.images.baseUrl} />,
    };
}

interface Props {
    content: EmailCampaignContentBlockData;
    config: EmailCampaignConfig;
}

export const EmailCampaignContentBlock = ({ content, config }: Props) => {
    return <BlocksBlock data={content} supportedBlocks={getSupportedBlocks(config)} />;
};
