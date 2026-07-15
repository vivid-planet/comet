import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const directoryOfThisFile = dirname(fileURLToPath(import.meta.url));

export function managerEntries(existing: string[] = []) {
    return [...existing, resolve(directoryOfThisFile, "manager.js")];
}

export function previewAnnotations(input: string[] = []) {
    return [...input, resolve(directoryOfThisFile, "preview.js")];
}
