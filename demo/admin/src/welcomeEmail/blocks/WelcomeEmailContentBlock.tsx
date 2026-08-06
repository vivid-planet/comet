import { createBlocksBlock } from "@comet/cms-admin";

import { MailButtonBlock } from "./MailButtonBlock";
import { MailDividerBlock } from "./MailDividerBlock";
import { MailImageBlock } from "./MailImageBlock";
import { MailRichTextBlock } from "./MailRichTextBlock";
import { MailSpacerBlock } from "./MailSpacerBlock";

export const WelcomeEmailContentBlock = createBlocksBlock({
    name: "WelcomeEmailContent",
    supportedBlocks: {
        richText: MailRichTextBlock,
        image: MailImageBlock,
        button: MailButtonBlock,
        divider: MailDividerBlock,
        spacer: MailSpacerBlock,
    },
});
