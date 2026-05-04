/* eslint-disable no-console */
import { execFileSync } from "child_process";
import { Command } from "commander";
import * as fs from "fs";
import * as yaml from "js-yaml";
import * as os from "os";
import * as path from "path";

export interface SkillSource {
    label: string;
    directory: string;
    /** If true, create symlinks; if false, copy files (used for tmp clone dirs) */
    symlink: boolean;
    /** If true, skills with metadata.internal: true in their SKILL.md are excluded */
    filterInternal?: boolean;
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

const SKILL_SOURCE_PATHS = ["skills", "agentic-plugin/skills"];

function cloneRepo(rawUrl: string): string {
    const { repoUrl, ref } = parseRepoUrl(rawUrl);
    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "comet-agent-skills-"));

    // Use sparse checkout to fetch only the skill source folders
    execFileSync("git", ["init", tmpDir], { stdio: "pipe" });
    execFileSync("git", ["-C", tmpDir, "remote", "add", "origin", "--", repoUrl], { stdio: "pipe" });
    execFileSync("git", ["-C", tmpDir, "config", "core.sparseCheckout", "true"], { stdio: "pipe" });
    fs.writeFileSync(path.join(tmpDir, ".git", "info", "sparse-checkout"), SKILL_SOURCE_PATHS.map((p) => `${p}/\n`).join(""));

    const fetchRef = ref ?? "HEAD";
    try {
        console.log(`Fetching ${repoUrl} ref "${fetchRef}" (sparse, ${SKILL_SOURCE_PATHS.map((p) => `${p}/`).join(", ")} only)...`);
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

interface SkillFrontmatter {
    metadata?: {
        internal?: boolean;
    };
}

export function isInternalSkill(skillFolderPath: string): boolean {
    const skillMdPath = path.join(skillFolderPath, "SKILL.md");
    let skillMdContent: string;
    try {
        skillMdContent = fs.readFileSync(skillMdPath, "utf-8");
    } catch {
        return false;
    }

    const frontmatterMatch = skillMdContent.match(/^---\n([\s\S]*?)\n---/);
    if (!frontmatterMatch) return false;

    try {
        const parsed = yaml.load(frontmatterMatch[1]) as SkillFrontmatter | undefined;
        return parsed?.metadata?.internal === true;
    } catch {
        return false;
    }
}

function listSkillFolders(directory: string, filterInternal = false): string[] {
    if (!fs.existsSync(directory)) return [];
    return fs
        .readdirSync(directory)
        .filter((f) => fs.statSync(path.join(directory, f)).isDirectory())
        .filter((folder) => !filterInternal || !isInternalSkill(path.join(directory, folder)))
        .sort();
}

export function installSkills(sources: SkillSource[], targetDirs: string[], { dryRun }: InstallOptions): void {
    const installed = new Set<string>();

    for (const { label, directory, symlink, filterInternal } of sources) {
        const folders = listSkillFolders(directory, filterInternal);
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
    .option("--dry-run", "Show which symlinks/copies would be created without making changes", false)
    .action(async (options: { config: string; dryRun: boolean }) => {
        const { config: configPath, dryRun } = options;

        const resolvedConfig = path.resolve(configPath);
        const repos = fs.existsSync(resolvedConfig) ? (loadConfig(configPath).repos ?? []) : [];
        console.log(`=== Installing agent skills${dryRun ? " (dry run)" : ""} ===`);

        const cwd = process.cwd();
        const targetDirs = [path.join(cwd, ".agents", "skills"), path.join(cwd, ".claude", "skills")];

        // Ensure target directories exist (without clearing existing contents)
        for (const dir of targetDirs) {
            fs.mkdirSync(dir, { recursive: true });
        }

        // Priority order: local skill folders (in declared order) > external repos (in arg order)
        const sources: SkillSource[] = SKILL_SOURCE_PATHS.map((p) => ({
            label: `local ${p}/`,
            directory: path.join(cwd, p),
            symlink: true,
        }));

        const tempDirs: string[] = [];
        try {
            for (const rawUrl of repos) {
                const cloneDir = cloneRepo(rawUrl);
                tempDirs.push(cloneDir);
                for (const p of SKILL_SOURCE_PATHS) {
                    sources.push({
                        label: `external ${rawUrl} (${p}/)`,
                        directory: path.join(cloneDir, p),
                        symlink: false,
                        filterInternal: true,
                    });
                }
            }
            installSkills(sources, targetDirs, { dryRun });
        } finally {
            for (const tmpDir of tempDirs) {
                fs.rmSync(tmpDir, { recursive: true, force: true });
            }
        }

        console.log("=== Finished ===");
    });
