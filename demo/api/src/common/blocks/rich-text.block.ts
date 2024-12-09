import { createRichTextBlock } from "@comet/blocks-api";
import { LinkBlock } from "@src/common/blocks/link.block";

export const RichTextBlock = createRichTextBlock({ link: LinkBlock });
