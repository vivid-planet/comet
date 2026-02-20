import { z } from "zod";

const draftContentBlockSchema = z.object({
    key: z.string(),
    type: z.string(),
    text: z.string(),
    depth: z.number(),
    inlineStyleRanges: z.array(z.object({ style: z.string(), offset: z.number(), length: z.number() })),
    entityRanges: z.array(z.object({ key: z.number(), offset: z.number(), length: z.number() })),
    data: z.record(z.unknown()).optional(),
});

export const rteSchema = z.object({
    draftContent: z.object({
        blocks: z.array(draftContentBlockSchema),
        entityMap: z.record(z.object({ type: z.string(), mutability: z.string(), data: z.unknown() })),
    }),
});
