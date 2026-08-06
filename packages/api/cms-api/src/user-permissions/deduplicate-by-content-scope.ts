import type { ContentScope } from "./interfaces/content-scope.interface";

// Replaces lodash's deep-equal uniqWith, which compares every candidate against every kept element (O(n^2)) and is too
// slow for large scope lists. Content scopes are flat objects of primitive values, so their sorted entries form a stable
// string key that stands in for deep equality, allowing deduplication in a single O(n) pass.
// Like uniqWith, the first occurrence of each scope is kept and the input order is preserved.
export function deduplicateByContentScope<T>(items: T[], getScope: (item: T) => ContentScope): T[] {
    const seen = new Map<string, T>();
    for (const item of items) {
        const key = JSON.stringify(Object.entries(getScope(item)).sort(([a], [b]) => a.localeCompare(b)));
        if (!seen.has(key)) {
            seen.set(key, item);
        }
    }
    return [...seen.values()];
}
