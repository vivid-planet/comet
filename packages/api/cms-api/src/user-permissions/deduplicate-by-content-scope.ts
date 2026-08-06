import type { ContentScope } from "./interfaces/content-scope.interface";

// Content scopes are flat objects of primitive values, so their sorted entries form a stable string key.
// Deduplicating by that key runs in a single pass and keeps the first occurrence of each scope.
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
