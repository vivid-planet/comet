import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

import { client } from "../../client";
import { updatePageTreeNodeVisibilityMutation } from "./updatePageTreeNodeVisibility.gql";

export function registerUpdatePageTreeNodeVisibility(server: McpServer): void {
    server.registerTool(
        "update_page_tree_node_visibility",
        {
            description: `Publish, unpublish, or archive a page tree node.

Visibility values:
- "Published" — page is publicly visible
- "Unpublished" — page exists but is not publicly accessible
- "Archived" — soft-deleted, content cannot be updated

Note: Archived pages cannot have their content updated via savePage.`,
            inputSchema: {
                id: z.string().describe("The page tree node ID"),
                visibility: z.enum(["Published", "Unpublished", "Archived"]).describe("The new visibility state"),
            },
        },
        async ({ id, visibility }) => {
            const data = await client.request(updatePageTreeNodeVisibilityMutation, { id, input: { visibility } });
            return { content: [{ type: "text" as const, text: JSON.stringify(data.updatePageTreeNodeVisibility, null, 2) }] };
        },
    );
}
