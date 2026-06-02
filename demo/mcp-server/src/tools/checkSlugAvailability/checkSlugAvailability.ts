import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

import { client } from "../../client";
import { scopeSchema } from "../../schemas";
import { checkSlugAvailabilityQuery } from "./checkSlugAvailability.gql";

export function registerCheckSlugAvailability(server: McpServer): void {
    server.registerTool(
        "check_slug_availability",
        {
            description: `Check if a slug is available under a given parent in a scope.
Returns "Available", "Taken", or "Reserved".`,
            inputSchema: {
                slug: z.string().describe("The slug to check"),
                scope: scopeSchema,
                parentId: z.string().optional().describe("Parent node ID (omit for root level)"),
            },
        },
        async ({ slug, scope, parentId }) => {
            const data = await client.request(checkSlugAvailabilityQuery, { slug, scope, parentId });
            return { content: [{ type: "text" as const, text: data.pageTreeNodeSlugAvailable }] };
        },
    );
}
