import { createTableBlock } from "@comet/cms-api";

import { RichTextBlock } from "./rich-text.block";

export const TableBlock = createTableBlock({ richText: RichTextBlock });
