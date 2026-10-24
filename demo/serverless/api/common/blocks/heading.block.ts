import { createBlock } from "@dextinity/serverless-blocks/server";
import { z } from "zod";

import { headingTags } from "../../../shared/blocks";
import { RichTextBlock } from "./rich-text.block";

export const HeadingBlock = createBlock(
    "Heading",
    z.strictObject({ eyebrow: RichTextBlock.schema, headline: RichTextBlock.schema, htmlTag: z.enum(headingTags) }),
);
