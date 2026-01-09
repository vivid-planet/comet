import { NewsletterImageBlock } from "@comet/mail-react";
import { type SupportedBlocks } from "@comet/site-nextjs";
import { type EmailCampaignContentBlockData } from "@src/blocks.generated";
import { EmailCampaignDividerBlock } from "@src/brevo/blocks/EmailCampaignDividerBlock";
import { EmailCampaignRichTextBlock } from "@src/brevo/blocks/EmailCampaignRichTextBlock";
import { BlocksBlock } from "@src/brevo/temp/BlocksBlock";

import { EmailCampaignSalutationBlock } from "./EmailCampaignSalutationBlock";

if (process.env.DAM_ALLOWED_IMAGE_SIZES === undefined || process.env.DAM_ALLOWED_IMAGE_SIZES.trim() === "") {
    throw new Error("Environment variable DAM_ALLOWED_IMAGE_SIZES is not defined");
}

const validSizes = process.env.DAM_ALLOWED_IMAGE_SIZES.split(",").map((value) => parseInt(value));

const supportedBlocks: SupportedBlocks = {
    divider: (data) => <EmailCampaignDividerBlock />,
    text: (data) => <EmailCampaignRichTextBlock data={data} />,
    salutation: (data) => <EmailCampaignSalutationBlock data={data} />,
    image: (data) => <NewsletterImageBlock data={data} validSizes={validSizes} />,
};

interface Props {
    content: EmailCampaignContentBlockData;
}

export const EmailCampaignContentBlock = ({ content }: Props) => {
    return <BlocksBlock data={content} supportedBlocks={supportedBlocks} />;
};
