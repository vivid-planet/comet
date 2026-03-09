/* eslint-disable no-console */
import { execFileSync } from "child_process";
import { Command } from "commander";
import * as fs from "fs";
import * as os from "os";
import * as path from "path";

export interface SkillSource {
    label: string;
    directory: string;
    /** If true, create symlinks; if false, copy files (used for tmp clone dirs) */
    symlink: boolean;
}

export interface InstallOptions {
    dryRun: boolean;
}

function parseRepoUrl(rawUrl: string): { repoUrl: string; ref: string | undefined } {
    const hashIndex = rawUrl.lastIndexOf("#");
    if (hashIndex === -1) {
        return { repoUrl: rawUrl, ref: undefined };
    }
    return { repoUrl: rawUrl.slice(0, hashIndex), ref: rawUrl.slice(hashIndex + 1) || undefined };
}

function cloneRepo(rawUrl: string): string {
    const { repoUrl, ref } = parseRepoUrl(rawUrl);
    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "comet-agent-skills-"));

    // Use sparse checkout to fetch only the package-skills/ folder
    execFileSync("git", ["init", tmpDir], { stdio: "pipe" });
    execFileSync("git", ["-C", tmpDir, "remote", "add", "origin", "--", repoUrl], { stdio: "pipe" });
    execFileSync("git", ["-C", tmpDir, "config", "core.sparseCheckout", "true"], { stdio: "pipe" });
    fs.writeFileSync(path.join(tmpDir, ".git", "info", "sparse-checkout"), "package-skills/\n");

    const fetchRef = ref ?? "HEAD";
    try {
        console.log(`Fetching ${repoUrl} ref "${fetchRef}" (sparse, package-skills/ only)...`);
        execFileSync("git", ["-C", tmpDir, "fetch", "--depth", "1", "origin", fetchRef], { stdio: "pipe" });
        execFileSync("git", ["-C", tmpDir, "checkout", "FETCH_HEAD"], { stdio: "pipe" });
    } catch {
        console.log(`Shallow fetch failed for ref "${fetchRef}"; falling back to full fetch...`);
        execFileSync("git", ["-C", tmpDir, "fetch", "origin", fetchRef], { stdio: "pipe" });
        execFileSync("git", ["-C", tmpDir, "checkout", "FETCH_HEAD"], { stdio: "pipe" });
    }

    return tmpDir;
}

function pathExists(p: string): boolean {
    try {
        fs.lstatSync(p);
        return true;
    } catch {
        return false;
    }
}

function listSkillFolders(directory: string): string[] {
    if (!fs.existsSync(directory)) return [];
    return fs
        .readdirSync(directory)
        .filter((f) => fs.statSync(path.join(directory, f)).isDirectory())
        .sort();
}

export function installSkills(sources: SkillSource[], targetDirs: string[], { dryRun }: InstallOptions): void {
    const installed = new Set<string>();

    for (const { label, directory, symlink } of sources) {
        const folders = listSkillFolders(directory);
        if (folders.length === 0) {
            console.log(`No skills found in ${label}`);
            continue;
        }
        console.log(`Installing ${folders.length} skill(s) from ${label}...`);
        for (const folder of folders) {
            if (installed.has(folder)) {
                console.warn(`  CONFLICT: "${folder}" from ${label} skipped (already installed from a higher-priority source)`);
                continue;
            }
            const srcPath = path.resolve(path.join(directory, folder));
            for (const targetDir of targetDirs) {
                const destPath = path.join(targetDir, folder);
                const exists = pathExists(destPath);
                if (dryRun) {
                    console.log(`  [dry-run] Would ${symlink ? "symlink" : "copy"}: ${srcPath} -> ${destPath}`);
                } else {
                    if (exists) fs.rmSync(destPath, { recursive: true, force: true });
                    if (symlink) {
                        fs.symlinkSync(srcPath, destPath);
                    } else {
                        fs.cpSync(srcPath, destPath, { recursive: true });
                    }
                    console.log(`  ${symlink ? "Symlinked" : "Copied"}: ${folder}`);
                }
            }
            installed.add(folder);
        }
    }

    console.log(`\nTotal skills installed: ${installed.size}`);
}

interface AgentSkillsConfig {
    repos?: string[];
}

function loadConfig(configPath: string): AgentSkillsConfig {
    const resolved = path.resolve(configPath);
    if (!fs.existsSync(resolved)) {
        throw new Error(`Config file not found: ${resolved}`);
    }
    const raw = fs.readFileSync(resolved, "utf-8");
    return JSON.parse(raw) as AgentSkillsConfig;
}

export const installAgentSkillsCommand = new Command("install-agent-skills")
    .description("Install agent skills from local directories and optional external git repos")
    .option("--config <path>", "Path to a JSON config file specifying repos to install skills from", "agent-skills.json")
    .option(
        "--repo <url>",
        "SSH git repo URL to install package-skills from (e.g. git@github.com:org/repo.git#main); repeatable",
        (val: string, acc: string[]) => [...acc, val],
        [] as string[],
    )
    .option("--dry-run", "Show which symlinks/copies would be created without making changes", false)
    .action(async (options: { config: string; repo: string[]; dryRun: boolean }) => {
        const { config: configPath, repo: repoFlags, dryRun } = options;

        const configRepos: string[] = [];
        const resolvedConfig = path.resolve(configPath);
        if (fs.existsSync(resolvedConfig)) {
            const config = loadConfig(configPath);
            if (config.repos) {
                configRepos.push(...config.repos);
            }
        }

        const repos = [...configRepos, ...repoFlags];
        console.log(`=== Installing agent skills${dryRun ? " (dry run)" : ""} ===`);

        const cwd = process.cwd();
        const targetDirs = [path.join(cwd, ".agents", "skills"), path.join(cwd, ".claude", "skills")];

        // Ensure target directories exist (without clearing existing contents)
        for (const dir of targetDirs) {
            fs.mkdirSync(dir, { recursive: true });
        }

        // Priority order: project-skills > package-skills > external repos (in arg order)
        const sources: SkillSource[] = [
            { label: "local project-skills/", directory: path.join(cwd, "project-skills"), symlink: true },
            { label: "local package-skills/", directory: path.join(cwd, "package-skills"), symlink: true },
        ];

        const tempDirs: string[] = [];
        try {
            for (const rawUrl of repos) {
                const cloneDir = cloneRepo(rawUrl);
                tempDirs.push(cloneDir);
                sources.push({
                    label: `external ${rawUrl} (package-skills/)`,
                    directory: path.join(cloneDir, "package-skills"),
                    symlink: false,
                });
            }
            installSkills(sources, targetDirs, { dryRun });
        } finally {
            for (const tmpDir of tempDirs) {
                fs.rmSync(tmpDir, { recursive: true, force: true });
            }
        }

        console.log("=== Finished ===");
    });
