import * as fs from "fs";
import * as path from "path";
import { vi } from "vitest";

/**
 * Shared fs mock for the agent-install tests.
 *
 * - `listings` maps a directory path to the names of its direct entries.
 * - Entries are assumed to be subdirectories unless the entry name ends in
 *   a file suffix (`.md`, `.json`) — matching how the production code
 *   treats skills folders vs rules files. Entries can also be forced to
 *   file-status by listing them in `files`.
 * - `existingDests` is the set of destination paths that already exist
 *   (used by pathExists / lstatSync to decide whether to remove before
 *   writing).
 * - `fileContents` provides content for fs.readFileSync on specific paths;
 *   any path not in the map throws ENOENT.
 */
export function mockFilesystem({
    listings = {},
    files = [],
    existingDests = [],
    fileContents = {},
}: {
    listings?: Record<string, string[]>;
    files?: string[];
    existingDests?: string[];
    fileContents?: Record<string, string>;
} = {}): void {
    const fileSet = new Set(files);

    const isFile = (p: string): boolean => {
        if (fileSet.has(p)) {
            return true;
        }
        if (p in fileContents) {
            return true;
        }
        const base = path.basename(p);
        return base.endsWith(".md") || base.endsWith(".json");
    };

    vi.mocked(fs.existsSync).mockImplementation((p) => String(p) in listings);

    vi.mocked(fs.readdirSync as (p: fs.PathLike) => string[]).mockImplementation((p) => listings[String(p)] ?? []);

    vi.mocked(fs.statSync).mockImplementation((p) => {
        const s = String(p);
        const fileLike = isFile(s);
        return {
            isDirectory: () => !fileLike,
            isFile: () => fileLike,
        } as fs.Stats;
    });

    vi.mocked(fs.lstatSync).mockImplementation((p) => {
        if (existingDests.includes(String(p))) {
            return {} as fs.Stats;
        }
        throw Object.assign(new Error("ENOENT"), { code: "ENOENT" });
    });

    vi.mocked(fs.readFileSync as (p: fs.PathLike | number, options: BufferEncoding) => string).mockImplementation((p) => {
        const content = fileContents[String(p)];
        if (content !== undefined) {
            return content;
        }
        throw Object.assign(new Error("ENOENT"), { code: "ENOENT" });
    });
}
