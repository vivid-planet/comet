import { createRichTextBlock } from "@comet/cms-api";

import { LinkBlock } from "./linkBlock/link.block";

export const RichTextBlock = createRichTextBlock({ link: LinkBlock });
