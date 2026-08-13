import { BlocksBlock, type SupportedBlocks } from "@comet/mail-react";
import type { WelcomeEmailContentBlockData } from "@src/blocks.generated";
import { MailDividerBlock } from "@src/mail/blocks/MailDividerBlock";
import { MailRichTextBlock } from "@src/mail/blocks/MailRichTextBlock";

const supportedBlocks: SupportedBlocks = {
    text: (data) => <MailRichTextBlock data={data} />,
    divider: () => <MailDividerBlock />,
};

interface Props {
    content: WelcomeEmailContentBlockData;
}

export const WelcomeEmailContentBlock = ({ content }: Props) => {
    return <BlocksBlock data={content} supportedBlocks={supportedBlocks} />;
};
