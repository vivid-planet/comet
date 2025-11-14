import { createHash } from "crypto";
import * as fs from "fs";
import type { LoaderContext } from "webpack";

interface GqlHashLoaderOptions {
    persistedQueriesPath?: string;
}

// Load or initialize the hash map
function loadHashMap(path: string): Record<string, string> {
    if (fs.existsSync(path)) {
        return JSON.parse(fs.readFileSync(path, "utf-8"));
    }
    return {};
}

function saveHashMap(path: string, hashMap: Record<string, string>) {
    fs.writeFileSync(path, JSON.stringify(hashMap, null, 2));
}

function hashQuery(query: string): string {
    return createHash("sha256").update(query).digest("hex");
}

// This regex matches gql`...` template literals, including multiline queries
const gqlTagRegex = /gql`([\s\S]*?)`/gm;

const webpackPersistedQueriesLoader = function (this: LoaderContext<GqlHashLoaderOptions>, source: string) {
    const options = this.getOptions() || {};
    const persistedQueriesPath = options.persistedQueriesPath || ".persisted-queries.json";

    const hashMap = loadHashMap(persistedQueriesPath);
    const replacements: { start: number; end: number; replacement: string }[] = [];
    let match;
    while ((match = gqlTagRegex.exec(source)) !== null) {
        const query = (match as RegExpExecArray)[1];
        const hash = hashQuery(query);
        hashMap[hash] = query;
        const fragmentVariables = Array.from(query.matchAll(/\${.*?}/g) ?? [])
            .map((m) => m[0])
            .join(" ");
        if (query.match(/^\s*fragment\s+(\w+)\s+on\s+\w+/)) {
            // fragment
            replacements.push({
                start: match.index,
                end: match.index + match[0].length,
                replacement: `{ fragment: true, fragmentVariables: \`${fragmentVariables}\` }`,
            });
        } else {
            // query or mutation
            replacements.push({
                start: match.index,
                end: match.index + match[0].length,
                replacement: `{ hash: "${hash}", fragmentVariables: \`${fragmentVariables}\` }`,
            });
        }
    }
    let modifiedSource = source;
    for (let i = replacements.length - 1; i >= 0; i--) {
        const { start, end, replacement } = replacements[i];
        modifiedSource = modifiedSource.slice(0, start) + replacement + modifiedSource.slice(end);
    }
    saveHashMap(persistedQueriesPath, hashMap);
    return modifiedSource;
};

export default webpackPersistedQueriesLoader;
