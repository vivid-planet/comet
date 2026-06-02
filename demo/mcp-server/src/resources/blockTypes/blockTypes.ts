import { readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const BLOCK_TYPES_PATH = resolve(__dirname, "../blocks.generated.ts");

export function registerBlockTypesResource(server: McpServer): void {
    server.registerResource(
        "block-types",
        "comet://block-types",
        {
            description:
                "Lightweight TypeScript interfaces describing the shape of all CMS content blocks. PREFER this over block-meta — it is much smaller (~450 lines vs ~3000 lines) and provides the exact same structural information needed to construct valid save_page inputs. Fields named 'draftContent' of type 'unknown' contain Draft.js editor format (from the draft-js library).",
        },
        async () => {
            const content = await readFile(BLOCK_TYPES_PATH, "utf-8");
            return { contents: [{ uri: "comet://block-types", text: content, mimeType: "text/plain" }] };
        },
    );
}
