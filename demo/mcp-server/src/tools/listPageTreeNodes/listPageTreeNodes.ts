import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

import { client } from "../../client";
import { scopeSchema } from "../../schemas";
import { listPageTreeNodesQuery } from "./listPageTreeNodes.gql";

export function registerListPageTreeNodes(server: McpServer): void {
    server.registerTool(
        "list_page_tree_nodes",
        {
            description: `List all page tree nodes in a scope.
Returns an array of nodes with id, name, slug, path, visibility, documentType, parentId, and category.
Optional: filter by category (e.g. "mainNavigation") or documentType (e.g. "Page", "Link").

IMPORTANT: This query only returns Published nodes. Newly created (Unpublished) or Archived nodes will not appear in the results.`,
            inputSchema: {
                scope: scopeSchema,
                category: z.string().optional().describe('Filter by category, e.g. "mainNavigation"'),
                documentType: z.string().optional().describe('Filter by document type, e.g. "Page" or "Link"'),
            },
        },
        async ({ scope, category, documentType }) => {
            const data = await client.request(listPageTreeNodesQuery, { scope, category, documentType });
            return { content: [{ type: "text" as const, text: JSON.stringify(data.paginatedPageTreeNodes, null, 2) }] };
        },
    );
}
