import { createBlocksBlock } from "@dextinity/cms-admin";
import { MailDividerBlock } from "@src/mail/blocks/MailDividerBlock";
import { MailRichTextBlock } from "@src/mail/blocks/MailRichTextBlock";

export const WelcomeEmailContentBlock = createBlocksBlock({
    name: "WelcomeEmailContent",
    supportedBlocks: {
        text: MailRichTextBlock,
        divider: MailDividerBlock,
    },
});
