import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

import { client } from "../../client";
import { getDamFileQuery } from "./getDamFile.gql";

export function registerGetDamFile(server: McpServer): void {
    server.registerTool(
        "get_dam_file",
        {
            description: `Get a single DAM file by ID. Returns full file metadata including image dimensions, crop area, and file URL.`,
            inputSchema: {
                id: z.string().describe("The DAM file ID (UUID)"),
            },
        },
        async ({ id }) => {
            const data = await client.request(getDamFileQuery, { id });
            return { content: [{ type: "text" as const, text: JSON.stringify(data.damFile, null, 2) }] };
        },
    );
}
