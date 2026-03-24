import { createRichTextBlock } from "@comet/cms-api";

import { LinkBlock } from "./link.block";
import { PlaceholderBlock } from "./placeholder.block";

export const RichTextBlock = createRichTextBlock({ link: LinkBlock, entities: { PLACEHOLDER: PlaceholderBlock } });
