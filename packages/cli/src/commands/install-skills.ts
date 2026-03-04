/* eslint-disable no-console */
import { execSync } from "child_process";
import { Command } from "commander";
import * as fs from "fs";
import * as os from "os";
import * as path from "path";
import * as readline from "readline";

interface SkillsJsonEntry {
    url: string;
    ref: string | undefined;
    skills: string[];
}

interface SkillsJson {
    installedSkills: SkillsJsonEntry[];
}

function parseRepoArg(repoArg: string): { url: string; ref: string | undefined } {
    const hashIndex = repoArg.indexOf("#");
    if (hashIndex === -1) return { url: repoArg, ref: undefined };
    return { url: repoArg.slice(0, hashIndex), ref: repoArg.slice(hashIndex + 1) };
}

function cloneSkillsFolder(url: string, ref: string | undefined, cloneDir: string): void {
    try {
        execSync(`git clone --filter=blob:none --sparse --depth 1 "${url}" "${cloneDir}"`, { stdio: "pipe" });
        execSync(`git -C "${cloneDir}" sparse-checkout set package-skills`, { stdio: "pipe" });
        if (ref !== undefined) {
            execSync(`git -C "${cloneDir}" fetch --depth 1 origin "${ref}"`, { stdio: "pipe" });
            execSync(`git -C "${cloneDir}" checkout FETCH_HEAD`, { stdio: "pipe" });
        }
    } catch (e: unknown) {
        const err = e as { stderr?: Buffer };
        const stderr = err.stderr ? err.stderr.toString().trim() : String(e);
        throw new Error(
            `Failed to clone ${url}${ref ? `#${ref}` : ""}: ${stderr}\n` +
                `Hint: fetching specific commit SHAs requires uploadpack.allowReachableSHA1InWant on the server.`,
        );
    }
}

function findSkills(dir: string): string[] {
    if (!fs.existsSync(dir)) return [];
    return fs
        .readdirSync(dir, { withFileTypes: true })
        .filter((e) => e.isDirectory() && fs.existsSync(path.join(dir, e.name, "SKILL.md")))
        .map((e) => e.name);
}

function getSkillGroup(skillDir: string): string | undefined {
    const skillMdPath = path.join(skillDir, "SKILL.md");
    if (!fs.existsSync(skillMdPath)) return undefined;
    const content = fs.readFileSync(skillMdPath, "utf-8");
    const match = content.match(/^---\s*\n([\s\S]*?)\n---/);
    if (!match) return undefined;
    const groupMatch = match[1].match(/^skillGroup:\s*(.+)$/m);
    return groupMatch ? groupMatch[1].trim() : undefined;
}

async function promptForGroups(groups: string[]): Promise<string[]> {
    if (groups.length === 0) return [];
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    return new Promise((resolve) => {
        console.log("\nAvailable skill groups (default group is always installed):");
        groups.forEach((g, i) => console.log(`  ${i + 1}. ${g}`));
        rl.question("\nSelect groups to install (comma-separated numbers, or 'all'): ", (answer) => {
            rl.close();
            if (answer.trim().toLowerCase() === "all") {
                resolve(groups);
                return;
            }
            const selected = answer
                .split(",")
                .map((s) => parseInt(s.trim(), 10) - 1)
                .filter((i) => i >= 0 && i < groups.length)
                .map((i) => groups[i]);
            resolve(selected);
        });
    });
}

function createSymlink(target: string, symlinkPath: string): void {
    try {
        fs.lstatSync(symlinkPath);
        fs.rmSync(symlinkPath, { recursive: true, force: true });
    } catch {
        // not present — nothing to remove
    }
    fs.symlinkSync(target, symlinkPath);
}

export const installSkillsCommand = new Command("install-skills")
    .description("Install Claude Code skills from git repositories and link local project-skills/")
    .argument("[repos...]", "Remote git repo URLs (optionally with #<ref> suffix)")
    .option("-g, --group <name>", "install skills from this group (can be repeated)", (val, prev: string[]) => [...prev, val], [] as string[])
    .option("--default", "install only default group skills (no interactivity)")
    .action(async (repos: string[], options: { group: string[]; default: boolean }) => {
        const cwd = process.cwd();
        const claudeSkillsDir = path.join(cwd, ".claude", "skills");
        const agentsSkillsDir = path.join(cwd, ".agents", "skills");
        const skillsJsonPath = path.join(cwd, ".agents", "skills.json");

        fs.mkdirSync(claudeSkillsDir, { recursive: true });
        fs.mkdirSync(agentsSkillsDir, { recursive: true });

        // 1. Collect local skills with groups
        const localSkillsDir = path.join(cwd, "project-skills");
        const localSkillNames = findSkills(localSkillsDir);
        const localSkillEntries = localSkillNames.map((name) => ({
            name,
            group: getSkillGroup(path.join(localSkillsDir, name)),
            source: "local" as const,
        }));

        // 2. Clone remote repos upfront and collect remote skills with groups
        const remoteRepos: Array<{
            url: string;
            ref: string | undefined;
            tmpDir: string;
            cloneDir: string;
            skillEntries: Array<{ name: string; group: string | undefined }>;
        }> = [];

        // Load existing skills.json
        let skillsJson: SkillsJson = { installedSkills: [] };
        if (fs.existsSync(skillsJsonPath)) {
            try {
                skillsJson = JSON.parse(fs.readFileSync(skillsJsonPath, "utf-8")) as SkillsJson;
            } catch {
                skillsJson = { installedSkills: [] };
            }
        }

        for (const repoArg of repos) {
            const { url, ref } = parseRepoArg(repoArg);
            console.log(`Cloning skills from ${url}${ref ? `#${ref}` : ""}...`);

            const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "comet-skills-"));
            const cloneDir = path.join(tmpDir, "repo");

            cloneSkillsFolder(url, ref, cloneDir);

            const remoteSkillsDir = path.join(cloneDir, "package-skills");
            const skillNames = findSkills(remoteSkillsDir);
            const skillEntries = skillNames.map((name) => ({
                name,
                group: getSkillGroup(path.join(remoteSkillsDir, name)),
            }));

            remoteRepos.push({ url, ref, tmpDir, cloneDir, skillEntries });
        }

        // 3. Collect all unique non-default groups
        const allEntries = [...localSkillEntries.map((e) => e.group), ...remoteRepos.flatMap((r) => r.skillEntries.map((e) => e.group))];
        const allNonDefaultGroups = Array.from(new Set(allEntries.filter((g): g is string => g !== undefined)));

        // 4. Determine selected groups
        let selectedGroups: string[];
        if (options.default) {
            selectedGroups = [];
        } else if (options.group.length > 0) {
            selectedGroups = options.group;
        } else {
            selectedGroups = await promptForGroups(allNonDefaultGroups);
        }

        // 5. Install local skills (filtered)
        let linkedLocal = 0;
        for (const entry of localSkillEntries) {
            if (entry.group !== undefined && !selectedGroups.includes(entry.group)) continue;
            createSymlink(`../../project-skills/${entry.name}`, path.join(claudeSkillsDir, entry.name));
            linkedLocal++;
        }
        console.log(`Linked ${linkedLocal} local skill(s) from project-skills/.`);

        // 6. Install remote skills (filtered)
        for (const repo of remoteRepos) {
            const remoteSkillsDir = path.join(repo.cloneDir, "package-skills");
            const installedSkills: string[] = [];

            try {
                for (const entry of repo.skillEntries) {
                    if (entry.group !== undefined && !selectedGroups.includes(entry.group)) continue;

                    const dest = path.join(agentsSkillsDir, entry.name);
                    if (fs.existsSync(dest)) {
                        fs.rmSync(dest, { recursive: true, force: true });
                    }
                    fs.cpSync(path.join(remoteSkillsDir, entry.name), dest, { recursive: true });
                    createSymlink(`../../.agents/skills/${entry.name}`, path.join(claudeSkillsDir, entry.name));
                    installedSkills.push(entry.name);
                }

                // Upsert entry in skills.json
                const existingIndex = skillsJson.installedSkills.findIndex((e) => e.url === repo.url);
                const jsonEntry: SkillsJsonEntry = { url: repo.url, ref: repo.ref, skills: installedSkills };
                if (existingIndex === -1) {
                    skillsJson.installedSkills.push(jsonEntry);
                } else {
                    skillsJson.installedSkills[existingIndex] = jsonEntry;
                }

                console.log(`Installed ${installedSkills.length} skill(s) from ${repo.url}: ${installedSkills.join(", ") || "(none)"}`);
            } finally {
                fs.rmSync(repo.tmpDir, { recursive: true, force: true });
            }
        }

        // 7. Save skills.json
        if (repos.length > 0) {
            fs.writeFileSync(skillsJsonPath, `${JSON.stringify(skillsJson, null, 2)}\n`, "utf-8");
        }

        console.log("=== install-skills complete ===");
    });
