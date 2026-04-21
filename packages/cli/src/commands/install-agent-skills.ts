/* eslint-disable no-console */
import { Command } from "commander";
import * as fs from "fs";
import * as path from "path";

import { type AgentInstallSource, cloneRepo, installItems, type InstallOptions, isInternalMarkdown, loadRepoConfig } from "./agent-install-utils";

export { type InstallOptions };

export interface SkillSource {
    label: string;
    directory: string;
    /** If true, create symlinks; if false, copy files (used for tmp clone dirs) */
    symlink: boolean;
    /** If true, skills with metadata.internal: true in their SKILL.md are excluded */
    filterInternal?: boolean;
}

export function isInternalSkill(skillFolderPath: string): boolean {
    return isInternalMarkdown(path.join(skillFolderPath, "SKILL.md"));
}

export function installSkills(sources: SkillSource[], targetDirs: string[], options: InstallOptions): void {
    const installed = new Set<string>();
    const agentSources: AgentInstallSource[] = sources.map((s) => ({
        label: s.label,
        directory: s.directory,
        discover: "folders",
        symlink: s.symlink,
        filterInternal: s.filterInternal,
        installed,
        itemLabelSingular: "skill",
        itemLabelPlural: "skills",
    }));
    const total = installItems(agentSources, targetDirs, options);
    console.log(`\nTotal skills installed: ${total}`);
}

export const installAgentSkillsCommand = new Command("install-agent-skills")
    .description("[DEPRECATED: use install-agent-features] Install agent skills from local directories and optional external git repos")
    .option("--config <path>", "Path to a JSON config file specifying repos to install skills from", "agent-skills.json")
    .option("--dry-run", "Show which symlinks/copies would be created without making changes", false)
    .action(async (options: { config: string; dryRun: boolean }) => {
        console.warn("install-agent-skills is deprecated; use install-agent-features instead.");

        const { config: configPath, dryRun } = options;

        const resolvedConfig = path.resolve(configPath);
        const repos = fs.existsSync(resolvedConfig) ? (loadRepoConfig(configPath).repos ?? []) : [];
        console.log(`=== Installing agent skills${dryRun ? " (dry run)" : ""} ===`);

        const cwd = process.cwd();
        const targetDirs = [path.join(cwd, ".agents", "skills"), path.join(cwd, ".claude", "skills")];

        for (const dir of targetDirs) {
            fs.mkdirSync(dir, { recursive: true });
        }

        const sources: SkillSource[] = [{ label: "local skills/", directory: path.join(cwd, "skills"), symlink: true }];

        const tempDirs: string[] = [];
        try {
            for (const rawUrl of repos) {
                const cloneDir = cloneRepo(rawUrl, ["skills/"]);
                tempDirs.push(cloneDir);
                sources.push({
                    label: `external ${rawUrl}`,
                    directory: path.join(cloneDir, "skills"),
                    symlink: false,
                    filterInternal: true,
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
