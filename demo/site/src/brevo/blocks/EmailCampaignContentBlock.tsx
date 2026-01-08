import { NewsletterImageBlock } from "@comet/mail-react";
import { type SupportedBlocks } from "@comet/site-nextjs";
import { type EmailCampaignContentBlockData } from "@src/blocks.generated";
import { EmailCampaignDividerBlock } from "@src/brevo/blocks/EmailCampaignDividerBlock";
import { EmailCampaignRichTextBlock } from "@src/brevo/blocks/EmailCampaignRichTextBlock";
import { BlocksBlock } from "@src/brevo/temp/BlocksBlock";

import { EmailCampaignSalutationBlock } from "./EmailCampaignSalutationBlock";

const supportedBlocks: SupportedBlocks = {
    divider: (data) => <EmailCampaignDividerBlock />,
    text: (data) => <EmailCampaignRichTextBlock data={data} />,
    salutation: (data) => <EmailCampaignSalutationBlock data={data} />,
    image: (data) => <NewsletterImageBlock data={data} />,
};

interface Props {
    content: EmailCampaignContentBlockData;
}

export const EmailCampaignContentBlock = ({ content }: Props) => {
    return <BlocksBlock data={content} supportedBlocks={supportedBlocks} />;
};
