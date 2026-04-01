import { type EntityManager } from "@mikro-orm/postgresql";
import { DamFile } from "@src/dam/entities/dam-file.entity";

import { type AiChatTool } from "./tool.interface";

type Input = Record<string, unknown>;

export function createDamTools(em: EntityManager): AiChatTool[] {
    return [
        {
            definition: {
                name: "list_dam_files",
                description:
                    "List files in the Digital Asset Manager (DAM). Returns metadata including ID, name, mimetype, size, and image dimensions.",
                input_schema: {
                    type: "object",
                    properties: {
                        folderId: { type: "string", description: "Filter by folder UUID. Omit for all folders." },
                        searchText: { type: "string", description: "Search files by name (case-insensitive)." },
                        mimetypes: {
                            type: "array",
                            items: { type: "string" },
                            description: "Filter by MIME types (e.g. ['image/jpeg', 'image/png']).",
                        },
                        limit: { type: "number", description: "Maximum results to return. Default: 50." },
                        offset: { type: "number", description: "Pagination offset. Default: 0." },
                    },
                },
            },
            execute: async (input: unknown) => {
                const i = input as Input;
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const where: Record<string, any> = { archived: false };
                if (i.folderId) where.folder = { id: i.folderId };
                if (Array.isArray(i.mimetypes) && i.mimetypes.length > 0) where.mimetype = { $in: i.mimetypes };
                if (i.searchText) where.name = { $ilike: `%${i.searchText}%` };

                const limit = (i.limit as number) ?? 50;
                const offset = (i.offset as number) ?? 0;

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
        },
        {
            definition: {
                name: "get_dam_file",
                description: "Get detailed metadata of a single DAM file by its UUID.",
                input_schema: {
                    type: "object",
                    properties: {
                        id: { type: "string", description: "The DAM file UUID." },
                    },
                    required: ["id"],
                },
            },
            execute: async (input: unknown) => {
                const i = input as Input;
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const file = await em.findOne(DamFile as any, { id: i.id as string }, { populate: ["image", "folder"] as any });
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
        },
    ];
}
