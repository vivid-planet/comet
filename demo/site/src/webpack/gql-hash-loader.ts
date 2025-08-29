import { createHash } from "crypto";
import * as fs from "fs";

// Path to store the mapping of hashes to queries
const HASH_MAP_PATH = ".next/persisted-queries.json";

// Load or initialize the hash map
function loadHashMap(): Record<string, string> {
    if (fs.existsSync(HASH_MAP_PATH)) {
        return JSON.parse(fs.readFileSync(HASH_MAP_PATH, "utf-8"));
    }
    return {};
}

function saveHashMap(hashMap: Record<string, string>) {
    fs.writeFileSync(HASH_MAP_PATH, JSON.stringify(hashMap, null, 2));
}

function hashQuery(query: string): string {
    return createHash("sha256").update(query).digest("hex");
}

// This regex matches gql`...` template literals, including multiline queries
const gqlTagRegex = /gql`([\s\S]*?)`/gm;

const gqlHashLoader = function (this: any, source: string) {
    const hashMap = loadHashMap();
    const replacements: { start: number; end: number; replacement: string }[] = [];
    let match;
    while ((match = gqlTagRegex.exec(source)) !== null) {
        const query = match[1];
        const hash = hashQuery(query);
        hashMap[hash] = query;
        if (query.match(/^\s*fragment\s+(\w+)\s+on\s+\w+/m)) {
            // fragment
            replacements.push({
                start: match.index,
                end: match.index + match[0].length,
                replacement: `{ fragment: true }`,
            });
        } else {
            // query or mutation
            replacements.push({
                start: match.index,
                end: match.index + match[0].length,
                replacement: `{ hash: "${hash}" }`,
            });
        }
    }
    let modifiedSource = source;
    for (let i = replacements.length - 1; i >= 0; i--) {
        const { start, end, replacement } = replacements[i];
        modifiedSource = modifiedSource.slice(0, start) + replacement + modifiedSource.slice(end);
    }
    saveHashMap(hashMap);
    return modifiedSource;
};

export default gqlHashLoader;
