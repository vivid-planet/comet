import { createTextImageBlock } from "@comet/api-cms";
import { RichTextBlock } from "@src/common/blocks/rich-text.block";

import { ImageBlock } from "./ImageBlock";

export const TextImageBlock = createTextImageBlock({ text: RichTextBlock, image: ImageBlock });
