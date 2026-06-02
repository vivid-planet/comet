import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

import { client } from "../../client";
import { updatePageTreeNodeMutation } from "./updatePageTreeNode.gql";

export function registerUpdatePageTreeNode(server: McpServer): void {
    server.registerTool(
        "update_page_tree_node",
        {
            description: `Update a page tree node's name, slug, and/or hideInMenu flag.
Set createAutomaticRedirectsOnSlugChange to false to skip redirect creation when changing the slug.`,
            inputSchema: {
                id: z.string().describe("The page tree node ID"),
                name: z.string().describe("New display name"),
                slug: z.string().describe("New URL slug"),
                hideInMenu: z.boolean().optional().describe("Hide in navigation menus"),
                createAutomaticRedirectsOnSlugChange: z.boolean().default(true).describe("Auto-create redirects on slug change"),
            },
        },
        async ({ id, name, slug, hideInMenu, createAutomaticRedirectsOnSlugChange }) => {
            const input: Record<string, unknown> = {
                name,
                slug,
                createAutomaticRedirectsOnSlugChange,
                ...(hideInMenu !== undefined && { hideInMenu }),
            };

            const data = await client.request(updatePageTreeNodeMutation, { id, input });
            return { content: [{ type: "text" as const, text: JSON.stringify(data.updatePageTreeNode, null, 2) }] };
        },
    );
}
