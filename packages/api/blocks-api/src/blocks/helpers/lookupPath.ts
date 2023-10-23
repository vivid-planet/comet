import { isAbsolute, normalize } from "path";
import { fileURLToPath } from "url";

// based on mikro-orm code

/**
 * Resolves and normalizes a series of path parts relative to each preceeding part.
 * If any part is a `file:` URL, it is converted to a local path. If any part is an
 * absolute path, it replaces preceeding paths (similar to `path.resolve` in NodeJS).
 * Trailing directory separators are removed, and all directory separators are converted
 * to POSIX-style separators (`/`).
 */
function normalizePath(...parts: string[]): string {
    let start = 0;
    for (let i = 0; i < parts.length; i++) {
        const part = parts[i];
        if (isAbsolute(part)) {
            start = i;
        } else if (part.startsWith("file:")) {
            start = i;
            parts[i] = fileURLToPath(part);
        }
    }
    if (start > 0) {
        parts = parts.slice(start);
    }

    let path = parts.join("/").replace(/\\/g, "/").replace(/\/$/, "");
    path = normalize(path).replace(/\\/g, "/");

    return path.match(/^[/.]|[a-zA-Z]:/) || path.startsWith("!") ? path : `./${path}`;
}
/**
 * Uses some dark magic to get source path to caller where decorator is used.
 * Analyses stack trace of error created inside the function call.
 */
export function lookupPath(): string | undefined {
    // use some dark magic to get source path to caller
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const stack = new Error().stack!.split("\n");

    let line = stack.findIndex((line) => line.includes("createBlock") || line.includes("createRichTextBlock"));

    if (line === -1) {
        return undefined;
    }

    //skip factories from blocks-api
    while (normalizePath(stack[line]).includes("blocks-api/src/") && stack[line].includes("at create")) {
        line++;
    }

    if (normalizePath(stack[line]).includes("node_modules/tslib/tslib")) {
        line++;
    }

    try {
        const re = stack[line].match(/\(.+\)/i) ? /\((.*):\d+:\d+\)/ : /at\s*(.*):\d+:\d+$/;
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        return normalizePath(stack[line].match(re)![1]);
    } catch {
        return undefined;
    }
}
