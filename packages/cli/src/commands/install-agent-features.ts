/* eslint-disable no-console */
import { Command } from "commander";
import * as fs from "fs";
import * as path from "path";

import { type AgentInstallSource, cloneRepo, installItems, type InstallOptions, loadRepoConfig } from "./agent-install-utils";

export function installFeatures(cwd: string, repos: string[], options: InstallOptions): void {
    const skillsTargetDirs = [path.join(cwd, ".agents", "skills"), path.join(cwd, ".claude", "skills")];
    const rulesTargetDirs = [
        path.join(cwd, ".agents", "rules"),
        path.join(cwd, ".claude", "rules"),
        path.join(cwd, ".cursor", "rules"),
        path.join(cwd, ".github", "instructions"),
    ];

    for (const dir of [...skillsTargetDirs, ...rulesTargetDirs]) {
        fs.mkdirSync(dir, { recursive: true });
    }

    const installedSkills = new Set<string>();
    const installedRules = new Set<string>();

    const skillSources: AgentInstallSource[] = [
        {
            label: "local skills/",
            directory: path.join(cwd, "skills"),
            discover: "folders",
            symlink: true,
            installed: installedSkills,
            itemLabelSingular: "skill",
            itemLabelPlural: "skills",
        },
    ];
    const ruleSources: AgentInstallSource[] = [
        {
            label: "local rules/",
            directory: path.join(cwd, "rules"),
            discover: "files",
            symlink: true,
            installed: installedRules,
            itemLabelSingular: "rule",
            itemLabelPlural: "rules",
        },
    ];

    const tempDirs: string[] = [];
    try {
        for (const rawUrl of repos) {
            const cloneDir = cloneRepo(rawUrl, ["skills/", "rules/"]);
            tempDirs.push(cloneDir);
            skillSources.push({
                label: `external ${rawUrl} (skills/)`,
                directory: path.join(cloneDir, "skills"),
                discover: "folders",
                symlink: false,
                filterInternal: true,
                installed: installedSkills,
                itemLabelSingular: "skill",
                itemLabelPlural: "skills",
            });
            ruleSources.push({
                label: `external ${rawUrl} (rules/)`,
                directory: path.join(cloneDir, "rules"),
                discover: "files",
                symlink: false,
                filterInternal: true,
                installed: installedRules,
                itemLabelSingular: "rule",
                itemLabelPlural: "rules",
            });
        }
        const skillCount = installItems(skillSources, skillsTargetDirs, options);
        const ruleCount = installItems(ruleSources, rulesTargetDirs, options);
        console.log(`\nTotal skills installed: ${skillCount}`);
        console.log(`Total rules installed: ${ruleCount}`);
    } finally {
        for (const tmpDir of tempDirs) {
            fs.rmSync(tmpDir, { recursive: true, force: true });
        }
    }
}

export const installAgentFeaturesCommand = new Command("install-agent-features")
    .description("Install agent features (skills and rules) from local directories and optional external git repos")
    .option("--config <path>", "Path to a JSON config file specifying repos to install features from", "agent-features.json")
    .option("--dry-run", "Show which symlinks/copies would be created without making changes", false)
    .action(async (options: { config: string; dryRun: boolean }) => {
        const { config: configPath, dryRun } = options;

        const resolvedConfig = path.resolve(configPath);
        const repos = fs.existsSync(resolvedConfig) ? (loadRepoConfig(configPath).repos ?? []) : [];
        console.log(`=== Installing agent features${dryRun ? " (dry run)" : ""} ===`);

        installFeatures(process.cwd(), repos, { dryRun });

        console.log("=== Finished ===");
    });
