/* eslint-disable no-console */
import * as fs from "fs";
import * as path from "path";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { mockFilesystem } from "./__test__/mock-filesystem";
import { type InstallOptions, installSkills, isInternalSkill, type SkillSource } from "./install-agent-skills";

vi.mock("fs");

const defaultOptions: InstallOptions = { dryRun: false };
const targetDirs = [".agents/skills", ".claude/skills"];

beforeEach(() => {
    vi.mocked(fs.symlinkSync).mockImplementation(() => undefined);
    vi.mocked(fs.cpSync).mockImplementation(() => undefined);
    vi.mocked(fs.rmSync).mockImplementation(() => undefined);
    vi.spyOn(console, "log").mockImplementation(() => undefined);
    vi.spyOn(console, "warn").mockImplementation(() => undefined);
});

afterEach(() => {
    vi.clearAllMocks();
    vi.restoreAllMocks();
});

describe("installSkills – symlink vs copy", () => {
    it("symlinks skill folders into target folder if symlink: true", () => {
        mockFilesystem({ listings: { "/local/skills": ["my-skill"] } });

        const sources: SkillSource[] = [{ label: "local skills/", directory: "/local/skills", symlink: true }];
        installSkills(sources, targetDirs, defaultOptions);

        expect(fs.symlinkSync).toHaveBeenCalledTimes(2);
        expect(fs.symlinkSync).toHaveBeenCalledWith(path.resolve("/local/skills/my-skill"), ".agents/skills/my-skill");
        expect(fs.symlinkSync).toHaveBeenCalledWith(path.resolve("/local/skills/my-skill"), ".claude/skills/my-skill");
        expect(fs.cpSync).not.toHaveBeenCalled();
    });

    it("copies skill folders into target folder if symlink: false", () => {
        mockFilesystem({ listings: { "/remote/skills": ["remote-skill"] } });

        const sources: SkillSource[] = [{ label: "external repo", directory: "/remote/skills", symlink: false }];
        installSkills(sources, targetDirs, defaultOptions);

        expect(fs.cpSync).toHaveBeenCalledTimes(2);
        expect(fs.cpSync).toHaveBeenCalledWith(path.resolve("/remote/skills/remote-skill"), ".agents/skills/remote-skill", { recursive: true });
        expect(fs.symlinkSync).not.toHaveBeenCalled();
    });

    it("ignores files in the source directory, only installs subdirectories", () => {
        mockFilesystem({ listings: { "/local/skills": ["real-skill", "not-a-skill.md"] } });

        const sources: SkillSource[] = [{ label: "local skills/", directory: "/local/skills", symlink: true }];
        installSkills(sources, targetDirs, defaultOptions);

        expect(fs.symlinkSync).toHaveBeenCalledTimes(2);
        expect(fs.symlinkSync).toHaveBeenCalledWith(path.resolve("/local/skills/real-skill"), expect.any(String));
        expect(fs.symlinkSync).not.toHaveBeenCalledWith(path.resolve("/local/skills/not-a-skill.md"), expect.any(String));
    });
});

describe("installSkills – missing source directory", () => {
    it("logs 'No skills found' and does nothing when source directory does not exist", () => {
        mockFilesystem({});

        const sources: SkillSource[] = [{ label: "local skills/", directory: "/local/skills", symlink: true }];
        installSkills(sources, targetDirs, defaultOptions);

        expect(fs.symlinkSync).not.toHaveBeenCalled();
        expect(fs.cpSync).not.toHaveBeenCalled();
        expect(console.log).toHaveBeenCalledWith(expect.stringContaining("No skills found"));
    });

    it("logs 'No skills found' and does nothing when source directory is empty", () => {
        mockFilesystem({ listings: { "/local/skills": [] } });

        const sources: SkillSource[] = [{ label: "local skills/", directory: "/local/skills", symlink: true }];
        installSkills(sources, targetDirs, defaultOptions);

        expect(fs.symlinkSync).not.toHaveBeenCalled();
        expect(fs.cpSync).not.toHaveBeenCalled();
        expect(console.log).toHaveBeenCalledWith(expect.stringContaining("No skills found"));
    });
});

describe("installSkills – dry-run mode", () => {
    it("does not write any files or symlinks", () => {
        mockFilesystem({ listings: { "/local/skills": ["my-skill"] } });

        const sources: SkillSource[] = [{ label: "local skills/", directory: "/local/skills", symlink: true }];
        installSkills(sources, targetDirs, { dryRun: true });

        expect(fs.symlinkSync).not.toHaveBeenCalled();
        expect(fs.cpSync).not.toHaveBeenCalled();
        expect(fs.rmSync).not.toHaveBeenCalled();
    });

    it("logs what would be symlinked", () => {
        mockFilesystem({ listings: { "/local/skills": ["my-skill"] } });

        const sources: SkillSource[] = [{ label: "local skills/", directory: "/local/skills", symlink: true }];
        installSkills(sources, targetDirs, { dryRun: true });

        expect(console.log).toHaveBeenCalledWith(expect.stringContaining(`[dry-run] Would symlink: ${path.resolve("/local/skills/my-skill")}`));
    });

    it("logs what would be copied for external sources", () => {
        mockFilesystem({ listings: { "/remote/skills": ["remote-skill"] } });

        const sources: SkillSource[] = [{ label: "external repo", directory: "/remote/skills", symlink: false }];
        installSkills(sources, targetDirs, { dryRun: true });

        expect(console.log).toHaveBeenCalledWith(expect.stringContaining(`[dry-run] Would copy: ${path.resolve("/remote/skills/remote-skill")}`));
    });
});

describe("installSkills – overwrites existing destinations", () => {
    it("removes existing destination before writing", () => {
        mockFilesystem({ listings: { "/local/skills": ["my-skill"] }, existingDests: [".agents/skills/my-skill", ".claude/skills/my-skill"] });

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
            listings: {
                "/local/skills": ["shared-skill"],
                "/remote/skills": ["shared-skill"],
            },
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
            listings: {
                "/remote1/skills": ["shared-skill"],
                "/remote2/skills": ["shared-skill"],
            },
        });

        const sources: SkillSource[] = [
            { label: "external repo1", directory: "/remote1/skills", symlink: false },
            { label: "external repo2", directory: "/remote2/skills", symlink: false },
        ];
        installSkills(sources, targetDirs, defaultOptions);

        expect(fs.cpSync).toHaveBeenCalledTimes(2);
        expect(fs.cpSync).toHaveBeenCalledWith(path.resolve("/remote1/skills/shared-skill"), expect.any(String), { recursive: true });
        expect(fs.cpSync).not.toHaveBeenCalledWith(path.resolve("/remote2/skills/shared-skill"), expect.any(String), expect.any(Object));
        expect(console.warn).toHaveBeenCalledWith(expect.stringContaining('CONFLICT: "shared-skill"'));
        expect(console.warn).toHaveBeenCalledWith(expect.stringContaining("external repo2"));
    });
});

describe("isInternalSkill", () => {
    it("returns true when metadata.internal is true", () => {
        mockFilesystem({ fileContents: { "/skills/my-skill/SKILL.md": "---\nmetadata:\n  internal: true\n---\n# My Skill" } });
        expect(isInternalSkill("/skills/my-skill")).toBe(true);
    });

    it("returns false when metadata.internal is false", () => {
        mockFilesystem({ fileContents: { "/skills/my-skill/SKILL.md": "---\nmetadata:\n  internal: false\n---\n# My Skill" } });
        expect(isInternalSkill("/skills/my-skill")).toBe(false);
    });

    it("returns false when frontmatter has no metadata field", () => {
        mockFilesystem({ fileContents: { "/skills/my-skill/SKILL.md": "---\ntitle: My Skill\n---\n# My Skill" } });
        expect(isInternalSkill("/skills/my-skill")).toBe(false);
    });

    it("returns false when SKILL.md has no frontmatter", () => {
        mockFilesystem({ fileContents: { "/skills/my-skill/SKILL.md": "# My Skill\nJust plain markdown, no frontmatter." } });
        expect(isInternalSkill("/skills/my-skill")).toBe(false);
    });

    it("returns false when SKILL.md does not exist", () => {
        mockFilesystem({});
        expect(isInternalSkill("/skills/my-skill")).toBe(false);
    });

    it("returns false when SKILL.md frontmatter contains malformed YAML", () => {
        mockFilesystem({ fileContents: { "/skills/my-skill/SKILL.md": "---\n: invalid: yaml: [\n---\n# My Skill" } });
        expect(isInternalSkill("/skills/my-skill")).toBe(false);
    });
});

describe("installSkills – filterInternal", () => {
    it("excludes internal skills when filterInternal: true, installs only non-internal skills", () => {
        mockFilesystem({
            listings: { "/remote/skills": ["public-skill", "internal-skill"] },
            fileContents: { "/remote/skills/internal-skill/SKILL.md": "---\nmetadata:\n  internal: true\n---\n# Internal Skill" },
        });

        const sources: SkillSource[] = [{ label: "external repo (skills/)", directory: "/remote/skills", symlink: false, filterInternal: true }];
        installSkills(sources, targetDirs, defaultOptions);

        expect(fs.cpSync).toHaveBeenCalledTimes(2);
        expect(fs.cpSync).toHaveBeenCalledWith(path.resolve("/remote/skills/public-skill"), expect.any(String), { recursive: true });
        expect(fs.cpSync).not.toHaveBeenCalledWith(path.resolve("/remote/skills/internal-skill"), expect.any(String), expect.any(Object));
    });

    it("installs all skills including internal ones when filterInternal is omitted", () => {
        mockFilesystem({
            listings: { "/local/skills": ["public-skill", "internal-skill"] },
            fileContents: { "/local/skills/internal-skill/SKILL.md": "---\nmetadata:\n  internal: true\n---\n# Internal Skill" },
        });

        const sources: SkillSource[] = [{ label: "local skills/", directory: "/local/skills", symlink: true }];
        installSkills(sources, targetDirs, defaultOptions);

        expect(fs.symlinkSync).toHaveBeenCalledTimes(4);
        expect(fs.symlinkSync).toHaveBeenCalledWith(path.resolve("/local/skills/public-skill"), expect.any(String));
        expect(fs.symlinkSync).toHaveBeenCalledWith(path.resolve("/local/skills/internal-skill"), expect.any(String));
    });

    it("logs 'No skills found' when filterInternal: true and all skills are internal", () => {
        mockFilesystem({
            listings: { "/remote/skills": ["internal-skill"] },
            fileContents: { "/remote/skills/internal-skill/SKILL.md": "---\nmetadata:\n  internal: true\n---\n# Internal Skill" },
        });

        const sources: SkillSource[] = [{ label: "external repo (skills/)", directory: "/remote/skills", symlink: false, filterInternal: true }];
        installSkills(sources, targetDirs, defaultOptions);

        expect(fs.cpSync).not.toHaveBeenCalled();
        expect(console.log).toHaveBeenCalledWith(expect.stringContaining("No skills found"));
    });

    it("excludes internal skills from dry-run output when filterInternal: true", () => {
        mockFilesystem({
            listings: { "/remote/skills": ["public-skill", "internal-skill"] },
            fileContents: { "/remote/skills/internal-skill/SKILL.md": "---\nmetadata:\n  internal: true\n---\n# Internal Skill" },
        });

        const sources: SkillSource[] = [{ label: "external repo (skills/)", directory: "/remote/skills", symlink: false, filterInternal: true }];
        installSkills(sources, targetDirs, { dryRun: true });

        expect(console.log).toHaveBeenCalledWith(expect.stringContaining("public-skill"));
        expect(console.log).not.toHaveBeenCalledWith(expect.stringContaining("internal-skill"));
    });
});
