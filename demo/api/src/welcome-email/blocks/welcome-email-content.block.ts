import { createBlocksBlock } from "@dextinity/cms-api";
import { MailDividerBlock } from "@src/mail/blocks/mail-divider.block";
import { MailRichTextBlock } from "@src/mail/blocks/mail-rich-text.block";

export const WelcomeEmailContentBlock = createBlocksBlock(
    {
        supportedBlocks: {
            text: MailRichTextBlock,
            divider: MailDividerBlock,
        },
    },
    {
        name: "WelcomeEmailContent",
    },
);
