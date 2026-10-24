import { createSeoBlock } from "@dextinity/serverless-blocks/server";
import { PixelImageBlock } from "@dextinity/serverless-dam/server";

export const SeoBlock = createSeoBlock({ image: PixelImageBlock });
