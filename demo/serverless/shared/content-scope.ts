import { z } from "zod";

/** The scope of the demo's content, used by all modules */
export const ContentScope = z.object({
    domain: z.string(),
});

export type ContentScope = z.infer<typeof ContentScope>;
