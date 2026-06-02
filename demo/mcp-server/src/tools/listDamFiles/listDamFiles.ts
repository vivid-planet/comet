import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

import { client } from "../../client";
import { damScopeSchema } from "../../schemas";
import { listDamFilesQuery } from "./listDamFiles.gql";

export function registerListDamFiles(server: McpServer): void {
    server.registerTool(
        "list_dam_files",
        {
            description: `List files in the Digital Asset Management (DAM) system.
Returns an array of files with id, name, mimetype, size, fileUrl, title, altText, and image metadata.
Use the returned file IDs as damFileId when constructing PixelImage or SvgImage blocks.

Optional: filter by mimetype (e.g. "image/jpeg"), search by filename, or list files in a specific folder.`,
            inputSchema: {
                scope: damScopeSchema,
                folderId: z.string().optional().describe("Filter by folder ID"),
                filter: z
                    .object({
                        searchText: z.string().optional().describe("Search by filename"),
                        mimetypes: z.array(z.string()).optional().describe('Filter by mimetypes, e.g. ["image/jpeg", "image/png"]'),
                    })
                    .optional()
                    .describe("Filter options"),
                limit: z.number().default(50).describe("Max number of files to return"),
                offset: z.number().default(0).describe("Offset for pagination"),
                sortColumnName: z.string().optional().describe("Sort by column name"),
                sortDirection: z.enum(["ASC", "DESC"]).optional().describe("Sort direction"),
            },
        },
        async ({ scope, folderId, filter, limit, offset, sortColumnName, sortDirection }) => {
            const data = await client.request(listDamFilesQuery, {
                scope,
                folderId,
                filter,
                limit,
                offset,
                ...(sortColumnName && { sortColumnName }),
                ...(sortDirection && { sortDirection }),
            });
            return { content: [{ type: "text" as const, text: JSON.stringify(data.damFilesList, null, 2) }] };
        },
    );
}
