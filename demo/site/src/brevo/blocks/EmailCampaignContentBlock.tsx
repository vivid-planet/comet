import { BlocksBlock, type SupportedBlocks } from "@comet/mail-react";
import type { EmailCampaignContentBlockData } from "@src/blocks.generated";
import { EmailCampaignSalutationBlock } from "@src/brevo/blocks/EmailCampaignSalutationBlock";
import { NewsletterImageBlock } from "@src/brevo/blocks/NewsletterImageBlock";
import { MailDividerBlock } from "@src/mail/blocks/MailDividerBlock";
import { MailRichTextBlock } from "@src/mail/blocks/MailRichTextBlock";

const supportedBlocks: SupportedBlocks = {
    divider: () => <MailDividerBlock />,
    text: (data) => <MailRichTextBlock data={data} />,
    salutation: (data) => <EmailCampaignSalutationBlock data={data} />,
    image: (data) => <NewsletterImageBlock data={data} />,
};

interface Props {
    content: EmailCampaignContentBlockData;
}

export const EmailCampaignContentBlock = ({ content }: Props) => {
    return <BlocksBlock data={content} supportedBlocks={supportedBlocks} />;
};
