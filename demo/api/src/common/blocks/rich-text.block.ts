<<<<<<< HEAD
import { createRichTextBlock } from "@comet/cms-api";

import { LinkBlock } from "./linkBlock/link.block";
=======
import { createRichTextBlock } from "@comet/blocks-api";
import { LinkBlock } from "@src/common/blocks/link.block";
>>>>>>> main

export const RichTextBlock = createRichTextBlock({ link: LinkBlock });
