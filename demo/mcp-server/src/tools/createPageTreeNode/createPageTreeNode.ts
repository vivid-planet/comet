import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

import { client } from "../../client";
import { scopeSchema } from "../../schemas";
import { createPageTreeNodeMutation } from "./createPageTreeNode.gql";

export function registerCreatePageTreeNode(server: McpServer): void {
    server.registerTool(
        "create_page_tree_node",
        {
            description: `Create a new page tree node.

Parameters:
- name: Display name of the page
- slug: URL slug (must be unique within parent)
- documentType: "Page" or "Link"
- parentId: Parent node ID (omit for root level)
- pos: Position among siblings (optional)
- category: e.g. "mainNavigation" (default)
- hideInMenu: Whether to hide in navigation menus

The node is created with visibility "Unpublished" by default. Use update_page_tree_node_visibility to publish it.

IMPORTANT: The attached document (Page or Link) is NOT created automatically by this mutation.
To create the document, call save_page with a new UUID as pageId and pass this node's id as attachedPageTreeNodeId.
The response will show document: null — this is expected.`,
            inputSchema: {
                name: z.string().describe("Display name of the page"),
                slug: z.string().describe("URL-safe slug"),
                documentType: z.enum(["Page", "Link"]).default("Page").describe('"Page" or "Link"'),
                scope: scopeSchema,
                parentId: z.string().optional().describe("Parent node ID for nesting"),
                pos: z.number().optional().describe("Position among siblings"),
                category: z.string().default("mainNavigation").describe("Node category"),
                hideInMenu: z.boolean().optional().describe("Hide this node in navigation menus"),
            },
        },
        async ({ name, slug, documentType, scope, parentId, pos, category, hideInMenu }) => {
            const input: Record<string, unknown> = {
                name,
                slug,
                attachedDocument: { type: documentType },
                ...(parentId !== undefined && { parentId }),
                ...(pos !== undefined && { pos }),
                ...(hideInMenu !== undefined && { hideInMenu }),
            };

            const data = await client.request(createPageTreeNodeMutation, { input, scope, category });
            return { content: [{ type: "text" as const, text: JSON.stringify(data.createPageTreeNode, null, 2) }] };
        },
    );
}
