import { z } from "zod";

export const scopeSchema = z
    .object({
        domain: z.string().default("main"),
        language: z.string().default("en"),
    })
    .default({ domain: "main", language: "en" });

export const damScopeSchema = z
    .object({
        domain: z.string().default("main"),
    })
    .default({ domain: "main" });
