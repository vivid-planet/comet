import { execSync } from "child_process";
import fs from "fs";
import { afterEach, describe, expect, it, vi } from "vitest";

import { injectSiteConfigsCommand } from "./site-configs";

vi.mock("child_process", () => ({
    execSync: vi.fn(),
}));

const mockedExecSync = vi.mocked(execSync);

afterEach(() => {
    vi.clearAllMocks();
    vi.restoreAllMocks();
});

const run = (...args: string[]) => {
    injectSiteConfigsCommand.exitOverride();
    // Reset options from previous runs since Commander mutates the singleton
    injectSiteConfigsCommand.setOptionValue("base64", undefined);
    return injectSiteConfigsCommand.parseAsync(["node", "inject-site-configs", ...args]);
};

describe("injectSiteConfigsCommand", () => {
    describe("op:// reference resolution", () => {
        it("should resolve op:// references in site config values", async () => {
            vi.spyOn(fs, "readFileSync").mockReturnValue(Buffer.from("'{{ site://configs/private/prod }}'"));
            const writeSpy = vi.spyOn(fs, "writeFileSync").mockImplementation(() => {});
            mockedExecSync.mockImplementation((cmd: string) => {
                if (cmd === "op --version") return Buffer.from("2.0.0");
                if (cmd === 'op read "op://vault/item/password"') return "resolved-secret\n";
                return "";
            });

            await run("-i", "template.yaml", "-o", "output.yaml", "-f", "src/commands/__fixtures__/site-configs-with-op.ts");

            const written = writeSpy.mock.calls[0][1] as string;
            expect(written).toContain("resolved-secret");
            expect(written).not.toContain("op://");
            expect(written).not.toContain("{{");
        });

        it("should resolve op:// references before base64 encoding", async () => {
            vi.spyOn(fs, "readFileSync").mockReturnValue(Buffer.from("'{{ site://configs/private/prod }}'"));
            const writeSpy = vi.spyOn(fs, "writeFileSync").mockImplementation(() => {});
            mockedExecSync.mockImplementation((cmd: string) => {
                if (cmd === "op --version") return Buffer.from("2.0.0");
                if (cmd === 'op read "op://vault/item/password"') return "resolved-secret\n";
                return "";
            });

            await run("-i", "template.yaml", "-o", "output.yaml", "--base64", "-f", "src/commands/__fixtures__/site-configs-with-op.ts");

            const written = writeSpy.mock.calls[0][1] as string;
            const decoded = Buffer.from(written, "base64").toString();
            expect(decoded).toContain("resolved-secret");
            expect(decoded).not.toContain("op://");
        });

        it("should warn and keep references when op CLI is not installed", async () => {
            const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
            vi.spyOn(fs, "readFileSync").mockReturnValue(Buffer.from("'{{ site://configs/private/prod }}'"));
            const writeSpy = vi.spyOn(fs, "writeFileSync").mockImplementation(() => {});
            mockedExecSync.mockImplementation(() => {
                throw new Error("command not found: op");
            });

            await run("-i", "template.yaml", "-o", "output.yaml", "-f", "src/commands/__fixtures__/site-configs-with-op.ts");

            const written = writeSpy.mock.calls[0][1] as string;
            expect(written).toContain("op://vault/item/password");
            expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining("1Password CLI (op) is not installed"));
        });

        it("should resolve multiple op:// references in one file", async () => {
            vi.spyOn(fs, "readFileSync").mockReturnValue(Buffer.from("'{{ site://configs/private/prod }}'"));
            const writeSpy = vi.spyOn(fs, "writeFileSync").mockImplementation(() => {});
            mockedExecSync.mockImplementation((cmd: string) => {
                if (cmd === "op --version") return Buffer.from("2.0.0");
                if (cmd === 'op read "op://vault/item/api-key"') return "resolved-api-key\n";
                if (cmd === 'op read "op://vault/item/api-secret"') return "resolved-api-secret\n";
                if (cmd === 'op read "op://vault/database/password"') return "resolved-db-password\n";
                return "";
            });

            await run("-i", "template.yaml", "-o", "output.yaml", "-f", "src/commands/__fixtures__/site-configs-with-multiple-op.ts");

            const written = writeSpy.mock.calls[0][1] as string;
            expect(written).toContain("resolved-api-key");
            expect(written).toContain("resolved-api-secret");
            expect(written).toContain("resolved-db-password");
            expect(written).not.toContain("op://");
            expect(written).not.toContain("{{");
        });

        it("should not call op CLI when no op:// references are present", async () => {
            vi.spyOn(fs, "readFileSync").mockReturnValue(Buffer.from("'{{ site://configs/private/prod }}'"));
            const writeSpy = vi.spyOn(fs, "writeFileSync").mockImplementation(() => {});

            await run("-i", "template.yaml", "-o", "output.yaml", "-f", "src/commands/__fixtures__/site-configs-plain.ts");

            const written = writeSpy.mock.calls[0][1] as string;
            expect(written).toContain("plain-value");
            expect(mockedExecSync).not.toHaveBeenCalled();
        });
    });
});
