import { createBlocksBlock } from "@comet/cms-admin";

import { MailButtonBlock } from "./MailButtonBlock";
import { MailDividerBlock } from "./MailDividerBlock";
import { MailImageBlock } from "./MailImageBlock";
import { MailRichTextBlock } from "./MailRichTextBlock";
import { MailSpacerBlock } from "./MailSpacerBlock";
import { MailTipTapRichTextBlock } from "./MailTipTapRichTextBlock";

export const WelcomeEmailContentBlock = createBlocksBlock({
    name: "WelcomeEmailContent",
    supportedBlocks: {
        richText: MailRichTextBlock,
        tipTapRichText: MailTipTapRichTextBlock,
        image: MailImageBlock,
        button: MailButtonBlock,
        divider: MailDividerBlock,
        spacer: MailSpacerBlock,
    },
});
