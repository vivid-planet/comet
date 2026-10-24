import { createSeoBlock } from "@dextinity/cms-admin";
import { PixelImageBlock } from "@dextinity/serverless-dam/client";

export const SeoBlock = createSeoBlock({ image: PixelImageBlock });
