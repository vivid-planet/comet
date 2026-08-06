import { createBlocksBlock } from "@comet/cms-api";

import { MailButtonBlock } from "./mail-button.block";
import { MailDividerBlock } from "./mail-divider.block";
import { MailImageBlock } from "./mail-image.block";
import { MailRichTextBlock } from "./mail-rich-text.block";
import { MailSpacerBlock } from "./mail-spacer.block";

export const WelcomeEmailContentBlock = createBlocksBlock(
    {
        supportedBlocks: {
            richText: MailRichTextBlock,
            image: MailImageBlock,
            button: MailButtonBlock,
            divider: MailDividerBlock,
            spacer: MailSpacerBlock,
        },
    },
    {
        name: "WelcomeEmailContent",
    },
);
