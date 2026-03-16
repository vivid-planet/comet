/* eslint-disable no-console */
import * as fs from "fs";
import * as path from "path";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { type InstallOptions, installSkills, isInternalSkill, type SkillSource } from "./install-agent-skills";

vi.mock("fs");

const defaultOptions: InstallOptions = { dryRun: false };
const targetDirs = [".agents/skills", ".claude/skills"];

/**
 * Sets up fs mocks so that each key in skillMap is a readable directory
 * containing the listed skill folder names. Destination paths do not exist
 * unless listed under a target dir key.
 */
function mockFilesystem(skillMap: Record<string, string[]>, existingDests: string[] = [], skillMdContents: Record<string, string> = {}): void {
    vi.mocked(fs.existsSync).mockImplementation((p) => String(p) in skillMap);
    vi.mocked(fs.readdirSync as (path: fs.PathLike) => string[]).mockImplementation((p) => skillMap[String(p)] ?? []);
    vi.mocked(fs.statSync).mockImplementation((p) => {
        const parentDir = path.dirname(String(p));
        const name = path.basename(String(p));
        const isDir = (skillMap[parentDir] ?? []).includes(name);
        return { isDirectory: () => isDir } as fs.Stats;
    });
    vi.mocked(fs.lstatSync).mockImplementation((p) => {
        if (existingDests.includes(String(p))) return {} as fs.Stats;
        throw Object.assign(new Error("ENOENT"), { code: "ENOENT" });
    });
    vi.mocked(fs.readFileSync as (path: fs.PathLike | number, options: BufferEncoding) => string).mockImplementation((p) => {
        const content = skillMdContents[String(p)];
        if (content !== undefined) return content;
        throw Object.assign(new Error("ENOENT"), { code: "ENOENT" });
    });
}

beforeEach(() => {
    vi.mocked(fs.symlinkSync).mockImplementation(() => undefined);
    vi.mocked(fs.cpSync).mockImplementation(() => undefined);
    vi.mocked(fs.rmSync).mockImplementation(() => undefined);
    vi.mocked(fs.readFileSync as (path: fs.PathLike | number, options: BufferEncoding) => string).mockImplementation(() => {
        throw Object.assign(new Error("ENOENT"), { code: "ENOENT" });
    });
    vi.spyOn(console, "log").mockImplementation(() => undefined);
    vi.spyOn(console, "warn").mockImplementation(() => undefined);
});

afterEach(() => {
    vi.clearAllMocks();
    vi.restoreAllMocks();
});

describe("installSkills – symlink vs copy", () => {
    it("symlinks skill folders into target folder if symlink: true", () => {
        mockFilesystem({ "/local/skills": ["my-skill"] });

        const sources: SkillSource[] = [{ label: "local skills/", directory: "/local/skills", symlink: true }];
        installSkills(sources, targetDirs, defaultOptions);

        expect(fs.symlinkSync).toHaveBeenCalledTimes(2);
        expect(fs.symlinkSync).toHaveBeenCalledWith(path.resolve("/local/skills/my-skill"), ".agents/skills/my-skill");
        expect(fs.symlinkSync).toHaveBeenCalledWith(path.resolve("/local/skills/my-skill"), ".claude/skills/my-skill");
        expect(fs.cpSync).not.toHaveBeenCalled();
    });

    it("copies skill folders into target folder if symlink: false", () => {
        mockFilesystem({ "/remote/skills": ["remote-skill"] });

        const sources: SkillSource[] = [{ label: "external repo", directory: "/remote/skills", symlink: false }];
        installSkills(sources, targetDirs, defaultOptions);

        expect(fs.cpSync).toHaveBeenCalledTimes(2);
        expect(fs.cpSync).toHaveBeenCalledWith(path.resolve("/remote/skills/remote-skill"), ".agents/skills/remote-skill", {
            recursive: true,
        });
        expect(fs.symlinkSync).not.toHaveBeenCalled();
    });

    it("ignores files in the source directory, only installs subdirectories", () => {
        mockFilesystem({ "/local/skills": ["real-skill"] });
        // statSync returns isDirectory: false for "not-a-skill.md" (not in the skillMap)
        vi.mocked(fs.readdirSync as (path: fs.PathLike) => string[]).mockImplementation(() => ["real-skill", "not-a-skill.md"]);

        const sources: SkillSource[] = [{ label: "local skills/", directory: "/local/skills", symlink: true }];
        installSkills(sources, targetDirs, defaultOptions);

        expect(fs.symlinkSync).toHaveBeenCalledTimes(2);
        expect(fs.symlinkSync).toHaveBeenCalledWith(path.resolve("/local/skills/real-skill"), expect.any(String));
        expect(fs.symlinkSync).not.toHaveBeenCalledWith(path.resolve("/local/skills/not-a-skill.md"), expect.any(String));
    });
});

describe("installSkills – missing source directory", () => {
    it("logs 'No skills found' and does nothing when source directory does not exist", () => {
        mockFilesystem({}); // existsSync returns false for all paths

        const sources: SkillSource[] = [{ label: "local skills/", directory: "/local/skills", symlink: true }];
        installSkills(sources, targetDirs, defaultOptions);

        expect(fs.symlinkSync).not.toHaveBeenCalled();
        expect(fs.cpSync).not.toHaveBeenCalled();
        expect(console.log).toHaveBeenCalledWith(expect.stringContaining("No skills found"));
    });

    it("logs 'No skills found' and does nothing when source directory is empty", () => {
        mockFilesystem({ "/local/skills": [] }); // dir exists but has no entries

        const sources: SkillSource[] = [{ label: "local skills/", directory: "/local/skills", symlink: true }];
        installSkills(sources, targetDirs, defaultOptions);

        expect(fs.symlinkSync).not.toHaveBeenCalled();
        expect(fs.cpSync).not.toHaveBeenCalled();
        expect(console.log).toHaveBeenCalledWith(expect.stringContaining("No skills found"));
    });

    it("logs 'No skills found' and does nothing when cloned external repo has no skills/ folder", () => {
        mockFilesystem({}); // cloned tmp dir exists but contains no skills/ subdirectory

        const sources: SkillSource[] = [
            { label: "external git@github.com:org/repo.git (skills/)", directory: "/tmp/cloned-repo/skills", symlink: false },
        ];
        installSkills(sources, targetDirs, defaultOptions);

        expect(fs.cpSync).not.toHaveBeenCalled();
        expect(console.log).toHaveBeenCalledWith(expect.stringContaining("No skills found"));
    });
});

describe("installSkills – dry-run mode", () => {
    it("does not write any files or symlinks", () => {
        mockFilesystem({ "/local/skills": ["my-skill"] });

        const sources: SkillSource[] = [{ label: "local skills/", directory: "/local/skills", symlink: true }];
        installSkills(sources, targetDirs, { dryRun: true });

        expect(fs.symlinkSync).not.toHaveBeenCalled();
        expect(fs.cpSync).not.toHaveBeenCalled();
        expect(fs.rmSync).not.toHaveBeenCalled();
    });

    it("logs what would be symlinked", () => {
        mockFilesystem({ "/local/skills": ["my-skill"] });

        const sources: SkillSource[] = [{ label: "local skills/", directory: "/local/skills", symlink: true }];
        installSkills(sources, targetDirs, { dryRun: true });

        expect(console.log).toHaveBeenCalledWith(expect.stringContaining(`[dry-run] Would symlink: ${path.resolve("/local/skills/my-skill")}`));
    });

    it("logs what would be copied for external sources", () => {
        mockFilesystem({ "/remote/skills": ["remote-skill"] });

        const sources: SkillSource[] = [{ label: "external repo", directory: "/remote/skills", symlink: false }];
        installSkills(sources, targetDirs, { dryRun: true });

        expect(console.log).toHaveBeenCalledWith(expect.stringContaining(`[dry-run] Would copy: ${path.resolve("/remote/skills/remote-skill")}`));
    });
});

describe("installSkills – overwrites existing destinations", () => {
    it("removes existing destination before writing", () => {
        mockFilesystem({ "/local/skills": ["my-skill"] }, [".agents/skills/my-skill", ".claude/skills/my-skill"]);

        const sources: SkillSource[] = [{ label: "local skills/", directory: "/local/skills", symlink: true }];
        installSkills(sources, targetDirs, defaultOptions);

        expect(fs.rmSync).toHaveBeenCalledWith(".agents/skills/my-skill", { recursive: true, force: true });
        expect(fs.rmSync).toHaveBeenCalledWith(".claude/skills/my-skill", { recursive: true, force: true });
        expect(fs.symlinkSync).toHaveBeenCalledTimes(2);
    });
});

describe("installSkills – conflict: local vs remote", () => {
    it("local skill wins: symlinks local, skips remote with a CONFLICT warning", () => {
        mockFilesystem({
            "/local/skills": ["shared-skill"],
            "/remote/skills": ["shared-skill"],
        });

        const sources: SkillSource[] = [
            { label: "local skills/", directory: "/local/skills", symlink: true },
            { label: "external repo", directory: "/remote/skills", symlink: false },
        ];
        installSkills(sources, targetDirs, defaultOptions);

        expect(fs.symlinkSync).toHaveBeenCalled();
        expect(fs.cpSync).not.toHaveBeenCalled();
        expect(console.warn).toHaveBeenCalledWith(expect.stringContaining('CONFLICT: "shared-skill"'));
        expect(console.warn).toHaveBeenCalledWith(expect.stringContaining("external repo"));
    });
});

describe("installSkills – conflict: remote vs remote", () => {
    it("first remote wins: copies remote1 skill, skips remote2 with a CONFLICT warning", () => {
        mockFilesystem({
            "/remote1/skills": ["shared-skill"],
            "/remote2/skills": ["shared-skill"],
        });

        const sources: SkillSource[] = [
            { label: "external repo1", directory: "/remote1/skills", symlink: false },
            { label: "external repo2", directory: "/remote2/skills", symlink: false },
        ];
        installSkills(sources, targetDirs, defaultOptions);

        // Only 2 calls (one per target dir from remote1), not 4
        expect(fs.cpSync).toHaveBeenCalledTimes(2);
        expect(fs.cpSync).toHaveBeenCalledWith(path.resolve("/remote1/skills/shared-skill"), expect.any(String), { recursive: true });
        expect(fs.cpSync).not.toHaveBeenCalledWith(path.resolve("/remote2/skills/shared-skill"), expect.any(String), expect.any(Object));
        expect(console.warn).toHaveBeenCalledWith(expect.stringContaining('CONFLICT: "shared-skill"'));
        expect(console.warn).toHaveBeenCalledWith(expect.stringContaining("external repo2"));
    });
});

describe("isInternalSkill", () => {
    it("returns true when metadata.internal is true", () => {
        mockFilesystem({}, [], { "/skills/my-skill/SKILL.md": "---\nmetadata:\n  internal: true\n---\n# My Skill" });
        expect(isInternalSkill("/skills/my-skill")).toBe(true);
    });

    it("returns false when metadata.internal is false", () => {
        mockFilesystem({}, [], { "/skills/my-skill/SKILL.md": "---\nmetadata:\n  internal: false\n---\n# My Skill" });
        expect(isInternalSkill("/skills/my-skill")).toBe(false);
    });

    it("returns false when frontmatter has no metadata field", () => {
        mockFilesystem({}, [], { "/skills/my-skill/SKILL.md": "---\ntitle: My Skill\n---\n# My Skill" });
        expect(isInternalSkill("/skills/my-skill")).toBe(false);
    });

    it("returns false when SKILL.md has no frontmatter", () => {
        mockFilesystem({}, [], { "/skills/my-skill/SKILL.md": "# My Skill\nJust plain markdown, no frontmatter." });
        expect(isInternalSkill("/skills/my-skill")).toBe(false);
    });

    it("returns false when SKILL.md does not exist", () => {
        mockFilesystem({}, [], {});
        expect(isInternalSkill("/skills/my-skill")).toBe(false);
    });

    it("returns false when SKILL.md frontmatter contains malformed YAML", () => {
        mockFilesystem({}, [], { "/skills/my-skill/SKILL.md": "---\n: invalid: yaml: [\n---\n# My Skill" });
        expect(isInternalSkill("/skills/my-skill")).toBe(false);
    });
});

describe("installSkills – filterInternal", () => {
    it("excludes internal skills when filterInternal: true, installs only non-internal skills", () => {
        mockFilesystem({ "/remote/skills": ["public-skill", "internal-skill"] }, [], {
            "/remote/skills/internal-skill/SKILL.md": "---\nmetadata:\n  internal: true\n---\n# Internal Skill",
        });

        const sources: SkillSource[] = [{ label: "external repo (skills/)", directory: "/remote/skills", symlink: false, filterInternal: true }];
        installSkills(sources, targetDirs, defaultOptions);

        expect(fs.cpSync).toHaveBeenCalledTimes(2);
        expect(fs.cpSync).toHaveBeenCalledWith(path.resolve("/remote/skills/public-skill"), expect.any(String), { recursive: true });
        expect(fs.cpSync).not.toHaveBeenCalledWith(path.resolve("/remote/skills/internal-skill"), expect.any(String), expect.any(Object));
    });

    it("installs all skills including internal ones when filterInternal is omitted", () => {
        mockFilesystem({ "/local/skills": ["public-skill", "internal-skill"] }, [], {
            "/local/skills/internal-skill/SKILL.md": "---\nmetadata:\n  internal: true\n---\n# Internal Skill",
        });

        const sources: SkillSource[] = [{ label: "local skills/", directory: "/local/skills", symlink: true }];
        installSkills(sources, targetDirs, defaultOptions);

        expect(fs.symlinkSync).toHaveBeenCalledTimes(4);
        expect(fs.symlinkSync).toHaveBeenCalledWith(path.resolve("/local/skills/public-skill"), expect.any(String));
        expect(fs.symlinkSync).toHaveBeenCalledWith(path.resolve("/local/skills/internal-skill"), expect.any(String));
    });

    it("logs 'No skills found' when filterInternal: true and all skills are internal", () => {
        mockFilesystem({ "/remote/skills": ["internal-skill"] }, [], {
            "/remote/skills/internal-skill/SKILL.md": "---\nmetadata:\n  internal: true\n---\n# Internal Skill",
        });

        const sources: SkillSource[] = [{ label: "external repo (skills/)", directory: "/remote/skills", symlink: false, filterInternal: true }];
        installSkills(sources, targetDirs, defaultOptions);

        expect(fs.cpSync).not.toHaveBeenCalled();
        expect(console.log).toHaveBeenCalledWith(expect.stringContaining("No skills found"));
    });

    it("excludes internal skills from dry-run output when filterInternal: true", () => {
        mockFilesystem({ "/remote/skills": ["public-skill", "internal-skill"] }, [], {
            "/remote/skills/internal-skill/SKILL.md": "---\nmetadata:\n  internal: true\n---\n# Internal Skill",
        });

        const sources: SkillSource[] = [{ label: "external repo (skills/)", directory: "/remote/skills", symlink: false, filterInternal: true }];
        installSkills(sources, targetDirs, { dryRun: true });

        expect(console.log).toHaveBeenCalledWith(expect.stringContaining("public-skill"));
        expect(console.log).not.toHaveBeenCalledWith(expect.stringContaining("internal-skill"));
    });
});
