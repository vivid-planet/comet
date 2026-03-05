# Spec: Agent Skill Sharing in Comet Framework

## Context

The Comet monorepo needs a standardized mechanism to define and share "agent skills" between projects. Skills are directories (folders) following the [Agent Skills specification](https://agentskills.io/specification): each skill is a folder named after the skill containing at minimum a `SKILL.md` file. A CLI command installs them into two target directories (`.agents/skills/` and `.claude/skills/`) used by local IDE agents and cloud agents respectively.

The command must:
- Install local skills from `project-skills/` and `package-skills/` at the repo root
- Support installing additional skills from external SSH git repos (only their `package-skills/` folder), specified via `--repo` flags or a JSON config file (`--config`)
- Apply conflict resolution: local skills win over external; first external repo wins over later ones
- Report conflicts visibly
- Be idempotent (clean install on every run)
- Create symlinks (not copies) for local sources; copy files for external repos (cloned into tmp)
- Support `--dry-run` to preview symlinks without making changes
- Support `--force` to overwrite existing files or symlinks in the target directories

## Files to Create / Modify

| Action | Path |
|--------|------|
| Create | `package-skills/` (directory, with `.gitkeep`) |
| Create | `project-skills/` (directory, with `.gitkeep`) |
| Create | `packages/cli/src/commands/install-agent-skills.ts` |
| Create | `packages/cli/src/commands/install-agent-skills.test.ts` |
| Modify | `packages/cli/src/comet.ts` |
| Create | `agent-skills.json` |
| Modify | `package.json` (root) |
| Modify | `install.sh` |
| Create | `.changeset/add-install-agent-skills-command.md` |

## Implementation

### 1. Root directories

Create `package-skills/.gitkeep` and `project-skills/.gitkeep` at the repo root to track both empty directories in git.

### 2. New command: `packages/cli/src/commands/install-agent-skills.ts`

```typescript
/* eslint-disable no-console */
import { execSync } from "child_process";
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
    force: boolean;
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
    execSync(`git init ${tmpDir}`, { stdio: "pipe" });
    execSync(`git -C ${tmpDir} remote add origin -- ${repoUrl}`, { stdio: "pipe" });
    execSync(`git -C ${tmpDir} config core.sparseCheckout true`, { stdio: "pipe" });
    fs.writeFileSync(path.join(tmpDir, ".git", "info", "sparse-checkout"), "package-skills/\n");

    const fetchRef = ref ?? "HEAD";
    try {
        console.log(`Fetching ${repoUrl} ref "${fetchRef}" (sparse, package-skills/ only)...`);
        execSync(`git -C ${tmpDir} fetch --depth 1 origin ${fetchRef}`, { stdio: "pipe" });
        execSync(`git -C ${tmpDir} checkout FETCH_HEAD`, { stdio: "pipe" });
    } catch {
        console.log(`Shallow fetch failed for ref "${fetchRef}"; falling back to full fetch...`);
        execSync(`git -C ${tmpDir} fetch origin ${fetchRef}`, { stdio: "pipe" });
        execSync(`git -C ${tmpDir} checkout FETCH_HEAD`, { stdio: "pipe" });
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

export function installSkills(sources: SkillSource[], targetDirs: string[], { dryRun, force }: InstallOptions): void {
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
                if (exists && !force) {
                    console.warn(`  SKIP: "${folder}" already exists in ${targetDir} (use --force to overwrite)`);
                    continue;
                }
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
    .option("--config <path>", "Path to a JSON config file specifying repos to install skills from")
    .option(
        "--repo <url>",
        "SSH git repo URL to install package-skills from (e.g. git@github.com:org/repo.git#main); repeatable",
        (val: string, acc: string[]) => [...acc, val],
        [] as string[],
    )
    .option("--dry-run", "Show which symlinks/copies would be created without making changes", false)
    .option("--force", "Overwrite existing files or symlinks in the target directories", false)
    .action(async (options: { config?: string; repo: string[]; dryRun: boolean; force: boolean }) => {
        const { config: configPath, repo: repoFlags, dryRun, force } = options;

        const configRepos: string[] = [];
        if (configPath) {
            const config = loadConfig(configPath);
            if (config.repos) {
                configRepos.push(...config.repos);
            }
        }

        const repos = [...configRepos, ...repoFlags];
        console.log(`=== Installing agent skills${dryRun ? " (dry run)" : ""} ===`);

        const cwd = process.cwd();
        const targetDirs = [path.join(cwd, ".agents", "skills"), path.join(cwd, ".claude", "skills")];

        if (!dryRun) {
            // Clear and recreate target directories (clean install)
            for (const dir of targetDirs) {
                fs.rmSync(dir, { recursive: true, force: true });
                fs.mkdirSync(dir, { recursive: true });
            }
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
            installSkills(sources, targetDirs, { dryRun, force });
        } finally {
            for (const tmpDir of tempDirs) {
                fs.rmSync(tmpDir, { recursive: true, force: true });
            }
        }

        console.log("=== Finished ===");
    });
```

### 3. Update `packages/cli/src/comet.ts`

Add import and `addCommand` call:

```typescript
import { installAgentSkillsCommand } from "./commands/install-agent-skills";
// ...
program.addCommand(installAgentSkillsCommand);
```

### 4. Config file: `agent-skills.json`

A JSON file at the repo root listing external repos to install skills from. Repos are processed in order (first wins on conflict):

```json
{
    "repos": [
        "git@github.com:org/repo.git#branch-or-tag",
        "git@github.com:org/other-repo.git"
    ]
}
```

### 5. Root `package.json` script

Add a convenience script that runs the command with the repo-level config file:

```json
{
    "scripts": {
        "install-agent-skills": "pnpm exec comet install-agent-skills --config agent-skills.json"
    }
}
```

### 6. `install.sh` integration

After building `@comet/cli`, run the skill installation as part of setup:

```sh
pnpm run install-agent-skills
```

### 7. Changeset: `.changeset/add-install-agent-skills-command.md`

```markdown
---
"@comet/cli": minor
---

Add `install-agent-skills` command

Installs agent skill files from local `project-skills/` and `package-skills/` directories into `.agents/skills/` and `.claude/skills/`. Accepts optional external SSH git repo URLs (via `--repo` flags or a `--config` JSON file) to install skills from those repos' `package-skills/` folders. Local skills always take priority; conflicts are reported.
```

## Key Design Decisions

- **Priority order**: `project-skills` > `package-skills` > external repos — project-specific overrides framework defaults
- **Symlinks for local sources**: Local `project-skills/` and `package-skills/` skill folders are symlinked so edits are reflected immediately without re-running the command
- **Copies for external repos**: Skill folders from cloned repos are copied recursively (the tmp clone is deleted after the run, so symlinks would dangle)
- **Clean install**: Target dirs are cleared on each run for idempotency (skipped in `--dry-run` mode)
- **`--config <path>`**: Loads a JSON file with a `repos` array; repos from config are processed before `--repo` flags
- **`--repo <url>`**: Repeatable flag for ad-hoc repo overrides on top of the config file; supports `url#ref` syntax
- **`--dry-run`**: Prints what would be symlinked/copied without touching the filesystem
- **`--force`**: Removes an existing file/symlink at the destination before writing; without it, existing entries are skipped with a warning
- **Sparse checkout**: Uses `core.sparseCheckout` with `package-skills/` path to fetch only that directory from external repos
- **Shallow fetch fallback**: Tries `--depth 1` first (works for branches/tags), falls back to full fetch for commit hashes
- **Folder-based skills**: Each skill is a directory (per the [Agent Skills specification](https://agentskills.io/specification)) containing at minimum a `SKILL.md` file; the command operates on directories, not individual files
- **Exported `installSkills`**: The core install logic is exported so it can be unit-tested in isolation (vitest, with `fs` mocked)
- **`minor` bump**: New public CLI command

## Verification

1. Build: `pnpm run build` in `packages/cli/`
2. Lint: `pnpm run lint:eslint --fix` in `packages/cli/`
3. Test local install (from repo root): `node packages/cli/bin/comet.js install-agent-skills`
4. Add a test skill folder `package-skills/test-skill/` with a `SKILL.md` file and verify a symlink to the folder appears in `.agents/skills/` and `.claude/skills/`
5. Test conflict: same folder name in both `project-skills/` and `package-skills/` → should log a CONFLICT warning and only install from `project-skills/`
6. Test `--dry-run`: no files/symlinks should be created, output should list what would happen
7. Test `--force`: run twice; second run should overwrite without warnings
8. Test `--config agent-skills.json`: repos listed in the config file should be fetched (only their `package-skills/` folder)
9. Test `--repo git@github.com:org/repo.git#main`: only `package-skills/` of that repo should be fetched
