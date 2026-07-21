import { createTableBlock } from "@comet/cms-admin";

import { TipTapRichTextBlock } from "./TipTapRichTextBlock";

export const TipTapTableBlock = createTableBlock({ richText: TipTapRichTextBlock, name: "TipTapTable" });
