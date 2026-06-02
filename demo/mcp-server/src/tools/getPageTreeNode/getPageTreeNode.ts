import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

import { client } from "../../client";
import { getPageTreeNodeQuery } from "./getPageTreeNode.gql";

export function registerGetPageTreeNode(server: McpServer): void {
    server.registerTool(
        "get_page_tree_node",
        {
            description: `Get a single page tree node by ID.
Returns name, slug, path, visibility, documentType, children, parent info, and the attached document ID.

IMPORTANT: This query only returns Published nodes. Unpublished or Archived nodes will result in an error.
If you just created a node (which defaults to Unpublished), you cannot retrieve it with this tool until it is published.`,
            inputSchema: {
                id: z.string().describe("The page tree node ID (UUID)"),
            },
        },
        async ({ id }) => {
            const data = await client.request(getPageTreeNodeQuery, { id });
            return { content: [{ type: "text" as const, text: JSON.stringify(data.pageTreeNode, null, 2) }] };
        },
    );
}
