import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

import { client } from "../../client";
import { deletePageTreeNodeMutation } from "./deletePageTreeNode.gql";

export function registerDeletePageTreeNode(server: McpServer): void {
    server.registerTool(
        "delete_page_tree_node",
        {
            description: `Permanently delete a page tree node and its attached document.
WARNING: This is irreversible. The node must be archived first (visibility = "Archived") before it can be deleted.`,
            inputSchema: {
                id: z.string().describe("The page tree node ID  to delete"),
            },
        },
        async ({ id }) => {
            const data = await client.request(deletePageTreeNodeMutation, { id });
            return { content: [{ type: "text" as const, text: JSON.stringify(data.deletePageTreeNode, null, 2) }] };
        },
    );
}
