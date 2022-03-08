import { createRichTextBlock } from "@comet/api-blocks";

import { LinkBlock } from "./linkBlock/link.block";

export const RichTextBlock = createRichTextBlock({ link: LinkBlock });
