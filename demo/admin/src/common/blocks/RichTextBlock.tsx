import { createRichTextBlock } from "@comet/admin-cms";

import { LinkBlock } from "./LinkBlock";

export const RichTextBlock = createRichTextBlock({ link: LinkBlock });
