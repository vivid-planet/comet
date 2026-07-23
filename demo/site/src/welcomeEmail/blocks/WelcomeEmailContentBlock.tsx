import { BlocksBlock, type SupportedBlocks } from "@comet/mail-react";
import type { WelcomeEmailContentBlockData } from "@src/blocks.generated";

import { MailButtonBlock } from "./MailButtonBlock";
import { MailDividerBlock } from "./MailDividerBlock";
import { MailImageBlock } from "./MailImageBlock";
import { MailRichTextBlock } from "./MailRichTextBlock";
import { MailSpacerBlock } from "./MailSpacerBlock";

const supportedBlocks: SupportedBlocks = {
    richText: (data) => <MailRichTextBlock data={data} />,
    image: (data) => <MailImageBlock data={data} />,
    button: (data) => <MailButtonBlock data={data} />,
    divider: () => <MailDividerBlock />,
    spacer: (data) => <MailSpacerBlock data={data} />,
};

export function WelcomeEmailContentBlock({ content }: { content: WelcomeEmailContentBlockData }) {
    return <BlocksBlock data={content} supportedBlocks={supportedBlocks} />;
}
