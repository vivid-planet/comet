/* eslint-disable no-console */
import { execFileSync } from "child_process";
import * as fs from "fs";
import * as yaml from "js-yaml";
import * as os from "os";
import * as path from "path";

export interface InstallOptions {
    dryRun: boolean;
}

export interface AgentInstallSource {
    label: string;
    directory: string;
    /** `folders` treats each subdirectory as one item; `files` treats each *.md file as one item */
    discover: "folders" | "files";
    /** If true, create symlinks; if false, copy */
    symlink: boolean;
    /** If true, exclude items with `metadata.internal: true` in their frontmatter */
    filterInternal?: boolean;
    /**
     * Tracks names already installed from higher-priority sources so the same name isn't installed twice.
     * Pass the same Set across sources that share a namespace (e.g. local + external skills).
     */
    installed: Set<string>;
    /** Label shown in the "No X found" and "Installing N X" log lines */
    itemLabelSingular: string;
    itemLabelPlural: string;
}

export function parseRepoUrl(rawUrl: string): { repoUrl: string; ref: string | undefined } {
    const hashIndex = rawUrl.lastIndexOf("#");
    if (hashIndex === -1) {
        return { repoUrl: rawUrl, ref: undefined };
    }
    return { repoUrl: rawUrl.slice(0, hashIndex), ref: rawUrl.slice(hashIndex + 1) || undefined };
}

export function cloneRepo(rawUrl: string, sparsePatterns: string[]): string {
    const { repoUrl, ref } = parseRepoUrl(rawUrl);
    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "comet-agent-install-"));

    execFileSync("git", ["init", tmpDir], { stdio: "pipe" });
    execFileSync("git", ["-C", tmpDir, "remote", "add", "origin", "--", repoUrl], { stdio: "pipe" });
    execFileSync("git", ["-C", tmpDir, "config", "core.sparseCheckout", "true"], { stdio: "pipe" });
    fs.writeFileSync(path.join(tmpDir, ".git", "info", "sparse-checkout"), sparsePatterns.map((p) => `${p}\n`).join(""));

    const fetchRef = ref ?? "HEAD";
    try {
        console.log(`Fetching ${repoUrl} ref "${fetchRef}" (sparse: ${sparsePatterns.join(", ")})...`);
        execFileSync("git", ["-C", tmpDir, "fetch", "--depth", "1", "origin", fetchRef], { stdio: "pipe" });
        execFileSync("git", ["-C", tmpDir, "checkout", "FETCH_HEAD"], { stdio: "pipe" });
    } catch {
        console.log(`Shallow fetch failed for ref "${fetchRef}"; falling back to full fetch...`);
        execFileSync("git", ["-C", tmpDir, "fetch", "origin", fetchRef], { stdio: "pipe" });
        execFileSync("git", ["-C", tmpDir, "checkout", "FETCH_HEAD"], { stdio: "pipe" });
    }

    return tmpDir;
}

export function pathExists(p: string): boolean {
    try {
        fs.lstatSync(p);
        return true;
    } catch {
        return false;
    }
}

interface MarkdownFrontmatter {
    metadata?: {
        internal?: boolean;
    };
}

export function readFrontmatter(mdPath: string): MarkdownFrontmatter | undefined {
    let content: string;
    try {
        content = fs.readFileSync(mdPath, "utf-8");
    } catch {
        return undefined;
    }
    const match = content.match(/^---\n([\s\S]*?)\n---/);
    if (!match) {
        return undefined;
    }
    try {
        return (yaml.load(match[1]) as MarkdownFrontmatter | undefined) ?? undefined;
    } catch {
        return undefined;
    }
}

export function isInternalMarkdown(mdPath: string): boolean {
    return readFrontmatter(mdPath)?.metadata?.internal === true;
}

function listFolders(directory: string, filterInternal: boolean): string[] {
    return fs
        .readdirSync(directory)
        .filter((entry) => fs.statSync(path.join(directory, entry)).isDirectory())
        .filter((folder) => !filterInternal || !isInternalMarkdown(path.join(directory, folder, "SKILL.md")))
        .sort();
}

function listMarkdownFiles(directory: string, filterInternal: boolean): string[] {
    return fs
        .readdirSync(directory)
        .filter((entry) => entry.endsWith(".md") && fs.statSync(path.join(directory, entry)).isFile())
        .filter((file) => !filterInternal || !isInternalMarkdown(path.join(directory, file)))
        .sort();
}

function symlinkOrCopy(src: string, dest: string, symlink: boolean): "symlinked" | "copied" {
    if (symlink) {
        try {
            fs.symlinkSync(src, dest);
            return "symlinked";
        } catch (err) {
            if ((err as NodeJS.ErrnoException).code !== "EPERM") {
                throw err;
            }
            // Windows without symlink privilege — fall back to copy
        }
    }
    fs.cpSync(src, dest, { recursive: true });
    return "copied";
}

export function installItems(sources: AgentInstallSource[], targetDirs: string[], { dryRun }: InstallOptions): number {
    let totalInstalled = 0;

    for (const source of sources) {
        const { label, directory, discover, symlink, filterInternal, installed, itemLabelSingular, itemLabelPlural } = source;
        if (!fs.existsSync(directory)) {
            console.log(`No ${itemLabelPlural} found in ${label}`);
            continue;
        }
        const items =
            discover === "folders" ? listFolders(directory, filterInternal ?? false) : listMarkdownFiles(directory, filterInternal ?? false);
        if (items.length === 0) {
            console.log(`No ${itemLabelPlural} found in ${label}`);
            continue;
        }
        console.log(`Installing ${items.length} ${items.length === 1 ? itemLabelSingular : itemLabelPlural} from ${label}...`);
        for (const item of items) {
            if (installed.has(item)) {
                console.warn(`  CONFLICT: "${item}" from ${label} skipped (already installed from a higher-priority source)`);
                continue;
            }
            const srcPath = path.resolve(path.join(directory, item));
            for (const targetDir of targetDirs) {
                const destPath = path.join(targetDir, item);
                if (dryRun) {
                    console.log(`  [dry-run] Would ${symlink ? "symlink" : "copy"}: ${srcPath} -> ${destPath}`);
                } else {
                    if (pathExists(destPath)) {
                        fs.rmSync(destPath, { recursive: true, force: true });
                    }
                    const action = symlinkOrCopy(srcPath, destPath, symlink);
                    console.log(`  ${action === "symlinked" ? "Symlinked" : "Copied"}: ${item}`);
                }
            }
            installed.add(item);
            totalInstalled++;
        }
    }

    return totalInstalled;
}

interface AgentInstallConfig {
    repos?: string[];
}

export function loadRepoConfig(configPath: string): AgentInstallConfig {
    const resolved = path.resolve(configPath);
    if (!fs.existsSync(resolved)) {
        throw new Error(`Config file not found: ${resolved}`);
    }
    const raw = fs.readFileSync(resolved, "utf-8");
    return JSON.parse(raw) as AgentInstallConfig;
}
