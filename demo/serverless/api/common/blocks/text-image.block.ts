import { createTextImageBlock } from "@dextinity/serverless-blocks/server";
import { DamImageBlock } from "@dextinity/serverless-dam/server";

import { imageAspectRatios } from "../../../shared/blocks";
import { RichTextBlock } from "./rich-text.block";

export const TextImageBlock = createTextImageBlock({ text: RichTextBlock, image: DamImageBlock, imageAspectRatios });
