import { createHash } from "crypto";
import * as fs from "fs";
import type { PluginOption } from "vite";

interface GqlHashPluginOptions {
    persistedQueriesPath?: string;
}

function loadHashMap(path: string): Record<string, string> {
    return fs.existsSync(path) ? JSON.parse(fs.readFileSync(path, "utf-8")) : {};
}

function saveHashMap(path: string, hashMap: Record<string, string>) {
    fs.writeFileSync(path, JSON.stringify(hashMap, null, 2));
}

function hashQuery(query: string): string {
    return createHash("sha256").update(query).digest("hex");
}

const gqlTagRegex = /gql`([\s\S]*?)`/gm;

export function vitePersistedQueries(options: GqlHashPluginOptions = {}): PluginOption {
    const persistedQueriesPath = options.persistedQueriesPath ?? ".persisted-queries.json";

    // The hash map is kept in memory but written out after each transform
    let hashMap: Record<string, string> = {};

    return {
        name: "vite-plugin-persisted-gql",

        // Load existing file when dev starts or build starts
        configResolved() {
            hashMap = loadHashMap(persistedQueriesPath);
        },

        async transform(code, id, options) {
            // Skip server-side (SSR or RSC) transforms
            if (options?.ssr) return null;

            if (!id.startsWith(`${process.cwd()}/src`)) return null; // TODO configurable

            // Only process typical script files
            if (!id.match(/\.(ts|js|tsx)$/)) return null;

            gqlTagRegex.lastIndex = 0;

            const replacements: {
                start: number;
                end: number;
                replacement: string;
            }[] = [];

            let match: RegExpExecArray | null;

            while ((match = gqlTagRegex.exec(code)) !== null) {
                const query = match[1];
                const hash = hashQuery(query);

                hashMap[hash] = query;

                const fragmentVariables = [...query.matchAll(/\${.*?}/g)].map((m) => m[0]).join(" ");

                const isFragment = /^\s*fragment\s+\w+\s+on\s+\w+/.test(query);

                replacements.push({
                    start: match.index,
                    end: match.index + match[0].length,
                    replacement: isFragment
                        ? `{ fragment: true, fragmentVariables: \`${fragmentVariables}\` }`
                        : `{ hash: "${hash}", fragmentVariables: \`${fragmentVariables}\` }`,
                });
            }

            if (replacements.length === 0) return null;

            // Apply replacements from the end
            let newCode = code;
            for (let i = replacements.length - 1; i >= 0; i--) {
                const { start, end, replacement } = replacements[i];
                newCode = newCode.slice(0, start) + replacement + newCode.slice(end);
            }

            saveHashMap(persistedQueriesPath, hashMap);

            return {
                code: newCode,
                map: null,
            };
        },
    };
}
