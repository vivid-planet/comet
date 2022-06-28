import { createRichTextBlock } from "@comet/cms-admin";

import { LinkBlock } from "./LinkBlock";

export const RichTextBlock = createRichTextBlock({ link: LinkBlock });
