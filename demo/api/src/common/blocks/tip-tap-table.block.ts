import { createTableBlock } from "@comet/cms-api";

import { TipTapRichTextBlock } from "./tip-tap-rich-text.block";

export const TipTapTableBlock = createTableBlock({ richText: TipTapRichTextBlock }, "TipTapTable");
