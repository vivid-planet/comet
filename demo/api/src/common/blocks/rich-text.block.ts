import { createRichTextBlock } from "@comet/blocks-api";

import { LinkBlock } from "./linkBlock/link.block";

export const RichTextBlock = createRichTextBlock({ link: LinkBlock });
