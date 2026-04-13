import { createTipTapRichTextBlock } from "@comet/cms-api";

import { LinkBlock } from "./link.block";

export const TipTapRichTextBlock = createTipTapRichTextBlock({ link: LinkBlock });
