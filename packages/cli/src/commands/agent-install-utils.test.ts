/* eslint-disable no-console */
import * as fs from "fs";
import * as path from "path";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { mockFilesystem } from "./__test__/mock-filesystem";
import { type AgentInstallSource, installItems, type InstallOptions, isInternalMarkdown, parseRepoUrl } from "./agent-install-utils";

const defaultOptions: InstallOptions = { dryRun: false };
const targetDirs = [".agents/x", ".claude/x"];

vi.mock("fs");

beforeEach(() => {
    vi.mocked(fs.mkdirSync).mockImplementation(() => undefined);
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

function folderSource(overrides: Partial<AgentInstallSource> = {}): AgentInstallSource {
    return {
        label: "test folder source",
        directory: "/src/folders",
        discover: "folders",
        symlink: true,
        installed: new Set<string>(),
        itemLabelSingular: "item",
        itemLabelPlural: "items",
        ...overrides,
    };
}

function fileSource(overrides: Partial<AgentInstallSource> = {}): AgentInstallSource {
    return {
        label: "test file source",
        directory: "/src/files",
        discover: "files",
        symlink: true,
        installed: new Set<string>(),
        itemLabelSingular: "item",
        itemLabelPlural: "items",
        ...overrides,
    };
}

describe("parseRepoUrl", () => {
    it("returns the url as-is when no ref is present", () => {
        expect(parseRepoUrl("git@github.com:org/repo.git")).toEqual({ repoUrl: "git@github.com:org/repo.git", ref: undefined });
    });

    it("splits on the last # and returns ref", () => {
        expect(parseRepoUrl("git@github.com:org/repo.git#main")).toEqual({ repoUrl: "git@github.com:org/repo.git", ref: "main" });
    });

    it("returns ref undefined when # is trailing", () => {
        expect(parseRepoUrl("git@github.com:org/repo.git#")).toEqual({ repoUrl: "git@github.com:org/repo.git", ref: undefined });
    });
});

describe("isInternalMarkdown", () => {
    it("returns true when metadata.internal is true", () => {
        mockFilesystem({ fileContents: { "/a/SKILL.md": "---\nmetadata:\n  internal: true\n---\n" } });
        expect(isInternalMarkdown("/a/SKILL.md")).toBe(true);
    });

    it("returns false when metadata.internal is false", () => {
        mockFilesystem({ fileContents: { "/a/SKILL.md": "---\nmetadata:\n  internal: false\n---\n" } });
        expect(isInternalMarkdown("/a/SKILL.md")).toBe(false);
    });

    it("returns false when there is no frontmatter", () => {
        mockFilesystem({ fileContents: { "/a/SKILL.md": "# Plain" } });
        expect(isInternalMarkdown("/a/SKILL.md")).toBe(false);
    });

    it("returns false when file does not exist", () => {
        mockFilesystem({});
        expect(isInternalMarkdown("/a/missing.md")).toBe(false);
    });

    it("returns false on malformed yaml", () => {
        mockFilesystem({ fileContents: { "/a/SKILL.md": "---\n: bad: [\n---\n" } });
        expect(isInternalMarkdown("/a/SKILL.md")).toBe(false);
    });
});

describe("installItems – folder discovery", () => {
    it("symlinks each subdirectory when symlink is true", () => {
        mockFilesystem({ listings: { "/src/folders": ["one", "two"] } });

        installItems([folderSource()], targetDirs, defaultOptions);

        expect(fs.symlinkSync).toHaveBeenCalledTimes(4);
        expect(fs.symlinkSync).toHaveBeenCalledWith(path.resolve("/src/folders/one"), ".agents/x/one");
        expect(fs.symlinkSync).toHaveBeenCalledWith(path.resolve("/src/folders/two"), ".claude/x/two");
    });

    it("copies each subdirectory when symlink is false", () => {
        mockFilesystem({ listings: { "/src/folders": ["one"] } });

        installItems([folderSource({ symlink: false })], targetDirs, defaultOptions);

        expect(fs.cpSync).toHaveBeenCalledTimes(2);
        expect(fs.cpSync).toHaveBeenCalledWith(path.resolve("/src/folders/one"), ".agents/x/one", { recursive: true });
    });

    it("excludes internal skills when filterInternal is true", () => {
        mockFilesystem({
            listings: { "/src/folders": ["public", "internal"] },
            fileContents: { "/src/folders/internal/SKILL.md": "---\nmetadata:\n  internal: true\n---\n" },
        });

        installItems([folderSource({ symlink: false, filterInternal: true })], targetDirs, defaultOptions);

        expect(fs.cpSync).toHaveBeenCalledTimes(2);
        expect(fs.cpSync).toHaveBeenCalledWith(path.resolve("/src/folders/public"), expect.any(String), expect.any(Object));
    });
});

describe("installItems – file discovery", () => {
    it("symlinks each .md file in the directory", () => {
        mockFilesystem({ listings: { "/src/files": ["a.md", "b.md"] } });

        installItems([fileSource()], targetDirs, defaultOptions);

        expect(fs.symlinkSync).toHaveBeenCalledTimes(4);
        expect(fs.symlinkSync).toHaveBeenCalledWith(path.resolve("/src/files/a.md"), ".agents/x/a.md");
    });

    it("ignores non-.md entries", () => {
        mockFilesystem({ listings: { "/src/files": ["rule.md", "README.txt"] } });

        installItems([fileSource()], targetDirs, defaultOptions);

        expect(fs.symlinkSync).toHaveBeenCalledTimes(2);
        expect(fs.symlinkSync).toHaveBeenCalledWith(path.resolve("/src/files/rule.md"), expect.any(String));
        expect(fs.symlinkSync).not.toHaveBeenCalledWith(path.resolve("/src/files/README.txt"), expect.any(String));
    });

    it("excludes files with metadata.internal: true when filterInternal is set", () => {
        mockFilesystem({
            listings: { "/src/files": ["public.md", "internal.md"] },
            fileContents: { "/src/files/internal.md": "---\nmetadata:\n  internal: true\n---\n" },
        });

        installItems([fileSource({ symlink: false, filterInternal: true })], targetDirs, defaultOptions);

        expect(fs.cpSync).toHaveBeenCalledTimes(2);
        expect(fs.cpSync).toHaveBeenCalledWith(path.resolve("/src/files/public.md"), expect.any(String), expect.any(Object));
        expect(fs.cpSync).not.toHaveBeenCalledWith(path.resolve("/src/files/internal.md"), expect.any(String), expect.any(Object));
    });

    it("walks subdirectories and installs nested .md files preserving relative paths", () => {
        mockFilesystem({
            listings: {
                "/src/files": ["top.md", "nested"],
                "/src/files/nested": ["deep.md", "deeper"],
                "/src/files/nested/deeper": ["innermost.md"],
            },
        });

        installItems([fileSource()], targetDirs, defaultOptions);

        expect(fs.symlinkSync).toHaveBeenCalledWith(path.resolve("/src/files/top.md"), path.join(".agents/x", "top.md"));
        expect(fs.symlinkSync).toHaveBeenCalledWith(path.resolve("/src/files/nested/deep.md"), path.join(".agents/x", "nested", "deep.md"));
        expect(fs.symlinkSync).toHaveBeenCalledWith(
            path.resolve("/src/files/nested/deeper/innermost.md"),
            path.join(".agents/x", "nested", "deeper", "innermost.md"),
        );
        expect(fs.mkdirSync).toHaveBeenCalledWith(path.join(".agents/x", "nested"), { recursive: true });
        expect(fs.mkdirSync).toHaveBeenCalledWith(path.join(".agents/x", "nested", "deeper"), { recursive: true });
    });
});

describe("installItems – conflict handling", () => {
    it("shared installed Set prevents duplicate install across sources", () => {
        mockFilesystem({
            listings: {
                "/src/a": ["dup"],
                "/src/b": ["dup"],
            },
        });

        const installed = new Set<string>();
        installItems(
            [
                folderSource({ label: "a", directory: "/src/a", symlink: true, installed }),
                folderSource({ label: "b", directory: "/src/b", symlink: false, installed }),
            ],
            targetDirs,
            defaultOptions,
        );

        expect(fs.symlinkSync).toHaveBeenCalledTimes(2);
        expect(fs.cpSync).not.toHaveBeenCalled();
        expect(console.warn).toHaveBeenCalledWith(expect.stringContaining('CONFLICT: "dup"'));
    });

    it("separate installed Sets keep namespaces independent", () => {
        mockFilesystem({
            listings: {
                "/src/skills": ["shared"],
                "/src/rules": ["shared.md"],
            },
        });

        installItems([folderSource({ label: "skills", directory: "/src/skills" })], [".agents/skills", ".claude/skills"], defaultOptions);
        installItems([fileSource({ label: "rules", directory: "/src/rules" })], [".agents/rules", ".claude/rules"], defaultOptions);

        expect(fs.symlinkSync).toHaveBeenCalledWith(path.resolve("/src/skills/shared"), ".agents/skills/shared");
        expect(fs.symlinkSync).toHaveBeenCalledWith(path.resolve("/src/rules/shared.md"), ".agents/rules/shared.md");
        expect(console.warn).not.toHaveBeenCalled();
    });
});

describe("installItems – dry-run", () => {
    it("performs no writes and logs 'would' messages", () => {
        mockFilesystem({ listings: { "/src/folders": ["one"] } });

        installItems([folderSource()], targetDirs, { dryRun: true });

        expect(fs.symlinkSync).not.toHaveBeenCalled();
        expect(fs.cpSync).not.toHaveBeenCalled();
        expect(fs.rmSync).not.toHaveBeenCalled();
        expect(console.log).toHaveBeenCalledWith(expect.stringContaining("[dry-run] Would symlink"));
    });
});

describe("installItems – overwrites existing", () => {
    it("removes existing destination before writing", () => {
        mockFilesystem({
            listings: { "/src/folders": ["one"] },
            existingDests: [".agents/x/one", ".claude/x/one"],
        });

        installItems([folderSource()], targetDirs, defaultOptions);

        expect(fs.rmSync).toHaveBeenCalledWith(".agents/x/one", { recursive: true, force: true });
        expect(fs.rmSync).toHaveBeenCalledWith(".claude/x/one", { recursive: true, force: true });
    });
});

describe("installItems – missing source directory", () => {
    it("logs 'No items found' when directory does not exist", () => {
        mockFilesystem({});

        installItems([folderSource()], targetDirs, defaultOptions);

        expect(fs.symlinkSync).not.toHaveBeenCalled();
        expect(console.log).toHaveBeenCalledWith(expect.stringContaining("No items found"));
    });

    it("logs 'No items found' when directory exists but is empty", () => {
        mockFilesystem({ listings: { "/src/folders": [] } });

        installItems([folderSource()], targetDirs, defaultOptions);

        expect(fs.symlinkSync).not.toHaveBeenCalled();
        expect(console.log).toHaveBeenCalledWith(expect.stringContaining("No items found"));
    });
});

describe("installItems – EPERM symlink fallback", () => {
    it("falls back to copy when symlinkSync throws EPERM", () => {
        mockFilesystem({ listings: { "/src/folders": ["one"] } });
        vi.mocked(fs.symlinkSync).mockImplementationOnce(() => {
            throw Object.assign(new Error("permission denied"), { code: "EPERM" });
        });

        installItems([folderSource()], targetDirs, defaultOptions);

        expect(fs.cpSync).toHaveBeenCalledWith(path.resolve("/src/folders/one"), ".agents/x/one", { recursive: true });
    });
});
