import { BlocksBlock, type SupportedBlocks } from "@comet/mail-react";
import type { EmailCampaignContentBlockData } from "@src/blocks.generated";
import { EmailCampaignSalutationBlock } from "@src/brevo/blocks/EmailCampaignSalutationBlock";
import { NewsletterImageBlock } from "@src/brevo/blocks/NewsletterImageBlock";
import type { EmailCampaignConfig } from "@src/brevo/util/getEmailCampaignConfig";
import { MailDividerBlock } from "@src/mail/blocks/MailDividerBlock";
import { MailRichTextBlock } from "@src/mail/blocks/MailRichTextBlock";

function getSupportedBlocks(config: EmailCampaignConfig): SupportedBlocks {
    return {
        divider: (data) => <MailDividerBlock />,
        text: (data) => <MailRichTextBlock data={data} />,
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
