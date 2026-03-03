/* eslint-disable no-console */
import { execSync } from "child_process";
import { Command } from "commander";
import * as fs from "fs";
import * as os from "os";
import * as path from "path";

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
        execSync(`git -C "${cloneDir}" sparse-checkout set skills`, { stdio: "pipe" });
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
    .action((repos: string[]) => {
        const cwd = process.cwd();
        const claudeSkillsDir = path.join(cwd, ".claude", "skills");
        const agentsSkillsDir = path.join(cwd, ".agents", "skills");
        const skillsJsonPath = path.join(cwd, ".agents", "skills.json");

        fs.mkdirSync(claudeSkillsDir, { recursive: true });
        fs.mkdirSync(agentsSkillsDir, { recursive: true });

        // 1. Link local project-skills/
        const localSkillsDir = path.join(cwd, "project-skills");
        const localSkills = findSkills(localSkillsDir);
        for (const skill of localSkills) {
            createSymlink(`../../project-skills/${skill}`, path.join(claudeSkillsDir, skill));
        }
        console.log(`Linked ${localSkills.length} local skill(s) from project-skills/.`);

        // 2. Load existing skills.json
        let skillsJson: SkillsJson = { installedSkills: [] };
        if (fs.existsSync(skillsJsonPath)) {
            try {
                skillsJson = JSON.parse(fs.readFileSync(skillsJsonPath, "utf-8")) as SkillsJson;
            } catch {
                skillsJson = { installedSkills: [] };
            }
        }

        // 3. Install remote repos
        for (const repoArg of repos) {
            const { url, ref } = parseRepoArg(repoArg);
            console.log(`Installing skills from ${url}${ref ? `#${ref}` : ""}...`);

            const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "comet-skills-"));
            const cloneDir = path.join(tmpDir, "repo");

            try {
                cloneSkillsFolder(url, ref, cloneDir);

                const remoteSkillsDir = path.join(cloneDir, "skills");
                const skills = findSkills(remoteSkillsDir);

                for (const skill of skills) {
                    const dest = path.join(agentsSkillsDir, skill);
                    if (fs.existsSync(dest)) {
                        fs.rmSync(dest, { recursive: true, force: true });
                    }
                    fs.cpSync(path.join(remoteSkillsDir, skill), dest, { recursive: true });
                    createSymlink(`../../.agents/skills/${skill}`, path.join(claudeSkillsDir, skill));
                }

                // Upsert entry in skills.json
                const existingIndex = skillsJson.installedSkills.findIndex((e) => e.url === url);
                const entry: SkillsJsonEntry = { url, ref, skills };
                if (existingIndex === -1) {
                    skillsJson.installedSkills.push(entry);
                } else {
                    skillsJson.installedSkills[existingIndex] = entry;
                }

                console.log(`Installed ${skills.length} skill(s) from ${url}: ${skills.join(", ") || "(none)"}`);
            } finally {
                fs.rmSync(tmpDir, { recursive: true, force: true });
            }
        }

        // 4. Save skills.json
        if (repos.length > 0) {
            fs.writeFileSync(skillsJsonPath, `${JSON.stringify(skillsJson, null, 2)}\n`, "utf-8");
        }

        console.log("=== install-skills complete ===");
    });
