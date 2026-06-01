import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

import { client } from "../../client";
import { savePageMutation } from "./savePage.gql";

export function registerSavePage(server: McpServer): void {
    server.registerTool(
        "save_page",
        {
            description: `Save page content (content blocks, SEO, stage) for an existing page document.

The pageId is the document ID from the page tree node's "document.id" field.
If the page document does not exist yet, generate a new UUID for pageId and pass attachedPageTreeNodeId to create and attach it.

IMPORTANT: Always pass attachedPageTreeNodeId (the page tree node ID) on every save call — not just the first one. The API uses it for content scope resolution and will fail without it.

Read the block-meta resource (comet://block-meta) to understand the available block types, their fields, nesting, and valid values. Use it to construct valid content, seo, and stage inputs.

Each block in a blocks-block array needs a "key" (uuid), "visible" (boolean), "type" (string), and "props" (object matching the block's fields from block-meta).

Minimal example — a page with a single heading block:
{
  "content": {
    "blocks": [{
      "key": "<generate-a-uuid>",
      "visible": true,
      "type": "heading",
      "props": {
        "heading": {
          "eyebrow": { "draftContent": { "blocks": [{ "key": "abc12", "text": "", "type": "unstyled", "depth": 0, "inlineStyleRanges": [], "entityRanges": [], "data": {} }], "entityMap": {} } },
          "headline": { "draftContent": { "blocks": [{ "key": "def34", "text": "My Page Title", "type": "unstyled", "depth": 0, "inlineStyleRanges": [], "entityRanges": [], "data": {} }], "entityMap": {} } },
          "htmlTag": "h1"
        },
        "textAlignment": "left"
      }
    }]
  },
  "seo": {
    "htmlTitle": "My Page",
    "metaDescription": "A description",
    "openGraphTitle": "",
    "openGraphDescription": "",
    "openGraphImage": { "block": null, "visible": false },
    "structuredData": "{}",
    "noIndex": false,
    "priority": "0_5",
    "changeFrequency": "weekly",
    "alternativeLinks": []
  },
  "stage": { "blocks": [] }
}`,
            inputSchema: {
                pageId: z.string().describe("The page document ID (UUID)"),
                input: z.object({
                    content: z.any().describe("PageContentBlock JSON"),
                    seo: z.any().describe("SeoBlock JSON"),
                    stage: z.any().describe("StageBlock JSON"),
                }),
                attachedPageTreeNodeId: z.string().optional().describe("Page tree node ID to attach this page to"),
            },
        },
        async ({ pageId, input, attachedPageTreeNodeId }) => {
            const data = await client.request(savePageMutation, { pageId, input, attachedPageTreeNodeId });
            return { content: [{ type: "text" as const, text: JSON.stringify(data.savePage, null, 2) }] };
        },
    );
}
