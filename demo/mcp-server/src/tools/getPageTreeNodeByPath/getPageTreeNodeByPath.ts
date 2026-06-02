import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

import { client } from "../../client";
import { scopeSchema } from "../../schemas";
import { getPageTreeNodeByPathQuery } from "./getPageTreeNodeByPath.gql";

export function registerGetPageTreeNodeByPath(server: McpServer): void {
    server.registerTool(
        "get_page_tree_node_by_path",
        {
            description: `Look up a page tree node by its URL path (e.g. "/about" or "/products/widget").
Returns the full node including children and attached document ID.`,
            inputSchema: {
                path: z.string().describe('The URL path, e.g. "/about"'),
                scope: scopeSchema,
            },
        },
        async ({ path, scope }) => {
            const data = await client.request(getPageTreeNodeByPathQuery, { path, scope });
            return { content: [{ type: "text" as const, text: JSON.stringify(data.pageTreeNodeByPath, null, 2) }] };
        },
    );
}
