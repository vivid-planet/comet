import * as fs from "fs";
import * as path from "path";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { type InstallOptions, installSkills, type SkillSource } from "./install-agent-skills";

vi.mock("fs");

const defaultOptions: InstallOptions = { dryRun: false, force: true };
const targetDirs = [".agents/skills", ".claude/skills"];

/**
 * Sets up fs mocks so that each key in skillMap is a readable directory
 * containing the listed skill folder names. Destination paths do not exist.
 */
function mockFilesystem(skillMap: Record<string, string[]>): void {
    vi.mocked(fs.existsSync).mockImplementation((p) => String(p) in skillMap);
    vi.mocked(fs.readdirSync as (path: fs.PathLike) => string[]).mockImplementation((p) => skillMap[String(p)] ?? []);
    vi.mocked(fs.statSync).mockImplementation((p) => {
        const parentDir = path.dirname(String(p));
        const name = path.basename(String(p));
        const isDir = (skillMap[parentDir] ?? []).includes(name);
        return { isDirectory: () => isDir } as fs.Stats;
    });
    // Destinations don't exist: lstatSync throws so pathExists returns false
    vi.mocked(fs.lstatSync).mockImplementation(() => {
        throw Object.assign(new Error("ENOENT"), { code: "ENOENT" });
    });
}

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
    it("symlinks local skill folders into each target dir", () => {
        mockFilesystem({ "/local/package-skills": ["my-skill"] });

        const sources: SkillSource[] = [{ label: "local package-skills/", directory: "/local/package-skills", symlink: true }];
        installSkills(sources, targetDirs, defaultOptions);

        expect(fs.symlinkSync).toHaveBeenCalledTimes(2);
        expect(fs.symlinkSync).toHaveBeenCalledWith(path.resolve("/local/package-skills/my-skill"), ".agents/skills/my-skill");
        expect(fs.symlinkSync).toHaveBeenCalledWith(path.resolve("/local/package-skills/my-skill"), ".claude/skills/my-skill");
        expect(fs.cpSync).not.toHaveBeenCalled();
    });

    it("copies external skill folders into each target dir", () => {
        mockFilesystem({ "/remote/package-skills": ["remote-skill"] });

        const sources: SkillSource[] = [{ label: "external repo", directory: "/remote/package-skills", symlink: false }];
        installSkills(sources, targetDirs, defaultOptions);

        expect(fs.cpSync).toHaveBeenCalledTimes(2);
        expect(fs.cpSync).toHaveBeenCalledWith(path.resolve("/remote/package-skills/remote-skill"), ".agents/skills/remote-skill", {
            recursive: true,
        });
        expect(fs.symlinkSync).not.toHaveBeenCalled();
    });
});

describe("installSkills – conflict: local vs remote", () => {
    it("local skill wins: symlinks local, skips remote with a CONFLICT warning", () => {
        mockFilesystem({
            "/local/project-skills": ["shared-skill"],
            "/remote/package-skills": ["shared-skill"],
        });

        const sources: SkillSource[] = [
            { label: "local project-skills/", directory: "/local/project-skills", symlink: true },
            { label: "external repo", directory: "/remote/package-skills", symlink: false },
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
            "/remote1/package-skills": ["shared-skill"],
            "/remote2/package-skills": ["shared-skill"],
        });

        const sources: SkillSource[] = [
            { label: "external repo1", directory: "/remote1/package-skills", symlink: false },
            { label: "external repo2", directory: "/remote2/package-skills", symlink: false },
        ];
        installSkills(sources, targetDirs, defaultOptions);

        // Only 2 calls (one per target dir from remote1), not 4
        expect(fs.cpSync).toHaveBeenCalledTimes(2);
        expect(fs.cpSync).toHaveBeenCalledWith(path.resolve("/remote1/package-skills/shared-skill"), expect.any(String), { recursive: true });
        expect(fs.cpSync).not.toHaveBeenCalledWith(path.resolve("/remote2/package-skills/shared-skill"), expect.any(String), expect.any(Object));
        expect(console.warn).toHaveBeenCalledWith(expect.stringContaining('CONFLICT: "shared-skill"'));
        expect(console.warn).toHaveBeenCalledWith(expect.stringContaining("external repo2"));
    });
});
