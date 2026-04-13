import { type EntityManager } from "@mikro-orm/postgresql";
import { DamFile } from "@src/dam/entities/dam-file.entity";
import { tool } from "ai";
import { z } from "zod";

import { type AiChatTools } from "./tool.interface";

export function createDamTools(em: EntityManager): AiChatTools {
    return {
        list_dam_files: tool({
            description: "List files in the Digital Asset Manager (DAM). Returns metadata including ID, name, mimetype, size, and image dimensions.",
            inputSchema: z.object({
                folderId: z.string().optional().describe("Filter by folder UUID. Omit for all folders."),
                searchText: z.string().optional().describe("Search files by name (case-insensitive)."),
                mimetypes: z.array(z.string()).optional().describe("Filter by MIME types (e.g. ['image/jpeg', 'image/png'])."),
                limit: z.number().optional().describe("Maximum results to return. Default: 50."),
                offset: z.number().optional().describe("Pagination offset. Default: 0."),
            }),
            execute: async (input) => {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const where: Record<string, any> = { archived: false };
                if (input.folderId) where.folder = { id: input.folderId };
                if (input.mimetypes && input.mimetypes.length > 0) where.mimetype = { $in: input.mimetypes };
                if (input.searchText) where.name = { $ilike: `%${input.searchText}%` };

                const limit = input.limit ?? 50;
                const offset = input.offset ?? 0;

                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const [files, total] = await em.findAndCount(DamFile as any, where, {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    populate: ["image"] as any,
                    limit,
                    offset,
                });

                return JSON.stringify({
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    items: (files as any[]).map((f) => ({
                        id: f.id,
                        name: f.name,
                        mimetype: f.mimetype,
                        size: f.size,
                        title: f.title ?? null,
                        altText: f.altText ?? null,
                        folderId: f.folder?.id ?? null,
                        image: f.image ? { width: f.image.width, height: f.image.height } : null,
                        createdAt: f.createdAt,
                    })),
                    total,
                });
            },
        }),
        get_dam_file: tool({
            description: "Get detailed metadata of a single DAM file by its UUID.",
            inputSchema: z.object({
                id: z.string().describe("The DAM file UUID."),
            }),
            execute: async (input) => {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const file = await em.findOne(DamFile as any, { id: input.id }, { populate: ["image", "folder"] as any });
                if (!file) return JSON.stringify({ error: "File not found." });
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const f = file as any;
                return JSON.stringify({
                    id: f.id,
                    name: f.name,
                    mimetype: f.mimetype,
                    size: f.size,
                    title: f.title ?? null,
                    altText: f.altText ?? null,
                    archived: f.archived,
                    folderId: f.folder?.id ?? null,
                    image: f.image ? { width: f.image.width, height: f.image.height, dominantColor: f.image.dominantColor ?? null } : null,
                    createdAt: f.createdAt,
                    updatedAt: f.updatedAt,
                });
            },
        }),
    };
}
