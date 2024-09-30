import { sep } from "path";

export function createHashedPath(contentHash: string) {
    return [contentHash.substr(0, 2), contentHash.substr(2, 2), contentHash].join(sep);
}
