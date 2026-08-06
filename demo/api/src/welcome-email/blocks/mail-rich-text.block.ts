import { createRichTextBlock } from "@comet/cms-api";

import { MailLinkBlock } from "./mail-link.block";

export const MailRichTextBlock = createRichTextBlock({ link: MailLinkBlock });
