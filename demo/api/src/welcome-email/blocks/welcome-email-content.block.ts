import { createBlocksBlock } from "@comet/cms-api";

import { MailButtonBlock } from "./mail-button.block";
import { MailDividerBlock } from "./mail-divider.block";
import { MailImageBlock } from "./mail-image.block";
import { MailRichTextBlock } from "./mail-rich-text.block";
import { MailSpacerBlock } from "./mail-spacer.block";
import { MailTipTapRichTextBlock } from "./mail-tip-tap-rich-text.block";

export const WelcomeEmailContentBlock = createBlocksBlock(
    {
        supportedBlocks: {
            richText: MailRichTextBlock,
            tipTapRichText: MailTipTapRichTextBlock,
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
