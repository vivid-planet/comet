/* eslint-disable no-console */
import * as fs from "fs";
import * as path from "path";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { mockFilesystem } from "./__test__/mock-filesystem";
import { installFeatures } from "./install-agent-features";

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

describe("installFeatures – local only", () => {
    it("symlinks skills and rules into all configured agent directories", () => {
        mockFilesystem({
            listings: {
                "/proj/skills": ["my-skill"],
                "/proj/rules": ["my-rule.md"],
            },
        });

        installFeatures("/proj", [], { dryRun: false });

        expect(fs.mkdirSync).toHaveBeenCalledWith(path.join("/proj", ".agents", "skills"), { recursive: true });
        expect(fs.mkdirSync).toHaveBeenCalledWith(path.join("/proj", ".agents", "rules"), { recursive: true });
        expect(fs.mkdirSync).toHaveBeenCalledWith(path.join("/proj", ".claude", "skills"), { recursive: true });
        expect(fs.mkdirSync).toHaveBeenCalledWith(path.join("/proj", ".claude", "rules"), { recursive: true });
        expect(fs.mkdirSync).toHaveBeenCalledWith(path.join("/proj", ".cursor", "rules"), { recursive: true });
        expect(fs.mkdirSync).toHaveBeenCalledWith(path.join("/proj", ".github", "instructions"), { recursive: true });

        expect(fs.symlinkSync).toHaveBeenCalledWith(path.resolve("/proj/skills/my-skill"), path.join("/proj", ".agents", "skills", "my-skill"));
        expect(fs.symlinkSync).toHaveBeenCalledWith(path.resolve("/proj/skills/my-skill"), path.join("/proj", ".claude", "skills", "my-skill"));
        expect(fs.symlinkSync).toHaveBeenCalledWith(path.resolve("/proj/rules/my-rule.md"), path.join("/proj", ".agents", "rules", "my-rule.md"));
        expect(fs.symlinkSync).toHaveBeenCalledWith(path.resolve("/proj/rules/my-rule.md"), path.join("/proj", ".claude", "rules", "my-rule.md"));
        expect(fs.symlinkSync).toHaveBeenCalledWith(path.resolve("/proj/rules/my-rule.md"), path.join("/proj", ".cursor", "rules", "my-rule.md"));
        expect(fs.symlinkSync).toHaveBeenCalledWith(
            path.resolve("/proj/rules/my-rule.md"),
            path.join("/proj", ".github", "instructions", "my-rule.md"),
        );
    });

    it("allows same name across skill and rule namespaces without conflict", () => {
        mockFilesystem({
            listings: {
                "/proj/skills": ["shared"],
                "/proj/rules": ["shared.md"],
            },
        });

        installFeatures("/proj", [], { dryRun: false });

        expect(console.warn).not.toHaveBeenCalled();
        expect(fs.symlinkSync).toHaveBeenCalledWith(path.resolve("/proj/skills/shared"), expect.any(String));
        expect(fs.symlinkSync).toHaveBeenCalledWith(path.resolve("/proj/rules/shared.md"), expect.any(String));
    });

    it("writes nothing in dry-run mode", () => {
        mockFilesystem({
            listings: {
                "/proj/skills": ["my-skill"],
                "/proj/rules": ["my-rule.md"],
            },
        });

        installFeatures("/proj", [], { dryRun: true });

        expect(fs.symlinkSync).not.toHaveBeenCalled();
        expect(fs.cpSync).not.toHaveBeenCalled();
    });

    it("runs cleanly when no local skills or rules exist", () => {
        mockFilesystem({});

        installFeatures("/proj", [], { dryRun: false });

        expect(fs.symlinkSync).not.toHaveBeenCalled();
        expect(console.log).toHaveBeenCalledWith(expect.stringContaining("No skills found"));
        expect(console.log).toHaveBeenCalledWith(expect.stringContaining("No rules found"));
    });
});
