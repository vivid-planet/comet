import { createBlock, createOptionalBlock } from "@dextinity/serverless-blocks/server";
import { DamImageBlock } from "@dextinity/serverless-dam/server";
import { z } from "zod";

import { RichTextBlock } from "../../../common/blocks/rich-text.block";

export const FullWidthImageBlock = createBlock(
    "FullWidthImage",
    z.strictObject({ image: DamImageBlock.schema, content: createOptionalBlock(RichTextBlock).schema }),
);
