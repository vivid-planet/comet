import { z } from "zod";

export const DamScope = z.object({
    domain: z.string(),
});

export type DamScope = z.infer<typeof DamScope>;
