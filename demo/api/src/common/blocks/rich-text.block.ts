import { createRichTextBlock } from "@comet/cms-api";

import { LinkBlock } from "./link.block";

export const RichTextBlock = createRichTextBlock({ link: LinkBlock });
