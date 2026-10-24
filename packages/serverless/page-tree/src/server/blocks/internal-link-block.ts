import { createBlock } from "@dextinity/serverless-blocks/server";
import { z } from "zod";

// The page isn't checked: a link to a deleted page leads nowhere, like a link without a page
export const InternalLinkBlock = createBlock(
    "InternalLink",
    z.strictObject({ targetPageId: z.uuid().optional(), targetPageAnchor: z.string().optional() }),
);
