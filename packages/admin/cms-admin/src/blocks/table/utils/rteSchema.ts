import { z } from "zod";

export const rteSchema = z.object({
    draftContent: z.unknown(),
});
