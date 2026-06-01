import { readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const BLOCK_META_PATH = resolve(__dirname, "../block-meta.json");

export function registerBlockMetaResource(server: McpServer): void {
    server.registerResource(
        "block-meta",
        "comet://block-meta",
        {
            description:
                "Full block schema metadata — field definitions, types, enums, and nesting for all CMS content blocks (~3000 lines). IMPORTANT: Prefer the lightweight 'block-types' resource (comet://block-types) instead — it provides the same structural information in ~450 lines of TypeScript interfaces, which is sufficient to construct valid save_page inputs. Only use this resource if you need detailed field-level metadata (e.g. kinds, nullability) beyond what block-types provides. Fields named 'draftContent' with kind 'Json' contain Draft.js editor format (from the draft-js library).",
        },
        async () => {
            const content = await readFile(BLOCK_META_PATH, "utf-8");
            return { contents: [{ uri: "comet://block-meta", text: content, mimeType: "application/json" }] };
        },
    );
}
