import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

import { client } from "../../client";
import { getPageQuery } from "./getPage.gql";

export function registerGetPage(server: McpServer): void {
    server.registerTool(
        "get_page",
        {
            description: `Get a page document by ID. Returns the full page content, SEO, and stage block data as JSON.
Use the document ID from a page tree node's "document.id" field.`,
            inputSchema: {
                id: z.string().describe("The page document ID (UUID)"),
            },
        },
        async ({ id }) => {
            const data = await client.request(getPageQuery, { id });
            return { content: [{ type: "text" as const, text: JSON.stringify(data.page, null, 2) }] };
        },
    );
}
