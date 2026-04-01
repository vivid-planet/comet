import { execSync } from "child_process";
import fs from "fs";
import { afterEach, describe, expect, it, vi } from "vitest";

import { resolveOpReferences } from "./site-configs";

vi.mock("child_process", () => ({
    execSync: vi.fn(),
}));

vi.mock("fs", async () => {
    const actual = await vi.importActual<typeof import("fs")>("fs");
    return { ...actual, default: { ...actual, writeFileSync: vi.fn(), unlinkSync: vi.fn() } };
});

const mockedExecSync = vi.mocked(execSync);

afterEach(() => {
    vi.clearAllMocks();
    vi.restoreAllMocks();
});

describe("resolveOpReferences", () => {
    it("should resolve op:// references", () => {
        mockedExecSync.mockImplementation((cmd: string) => {
            if (cmd === "op --version") return Buffer.from("2.0.0");
            if (typeof cmd === "string" && cmd.startsWith("op inject -i")) return '{"key":"resolved-secret"}';
            return "";
        });

        const result = resolveOpReferences('{"key":"{{ op://vault/item/password }}"}');

        expect(result).toBe('{"key":"resolved-secret"}');
        expect(fs.writeFileSync).toHaveBeenCalledTimes(1);
        expect(fs.unlinkSync).toHaveBeenCalledTimes(1);
    });

    it("should throw an error when op CLI is not installed", () => {
        mockedExecSync.mockImplementation(() => {
            throw new Error("command not found: op");
        });

        expect(() => resolveOpReferences('{"key":"{{ op://vault/item/password }}"}')).toThrow(
            "inject-site-configs: Config contains 1Password references (op://) but the 1Password CLI (op) is not installed",
        );
    });

    it("should throw an error when op inject fails", () => {
        mockedExecSync.mockImplementation((cmd: string) => {
            if (cmd === "op --version") return Buffer.from("2.0.0");
            if (typeof cmd === "string" && cmd.startsWith("op inject -i")) {
                throw new Error("Item not found");
            }
            return "";
        });

        expect(() => resolveOpReferences('{"key":"{{ op://vault/item/password }}"}')).toThrow(
            "inject-site-configs: Failed to resolve 1Password references",
        );
        expect(fs.unlinkSync).toHaveBeenCalledTimes(1);
    });

    it("should resolve multiple op:// references", () => {
        mockedExecSync.mockImplementation((cmd: string) => {
            if (cmd === "op --version") return Buffer.from("2.0.0");
            if (typeof cmd === "string" && cmd.startsWith("op inject -i"))
                return '{"apiKey":"resolved-api-key","apiSecret":"resolved-api-secret","dbPassword":"resolved-db-password"}';
            return "";
        });

        const result = resolveOpReferences(
            '{"apiKey":"{{ op://vault/item/api-key }}","apiSecret":"{{ op://vault/item/api-secret }}","dbPassword":"{{ op://vault/database/password }}"}',
        );

        expect(result).toBe('{"apiKey":"resolved-api-key","apiSecret":"resolved-api-secret","dbPassword":"resolved-db-password"}');
    });

    it("should not call op CLI when no op:// references are present", () => {
        const result = resolveOpReferences('{"key":"plain-value"}');

        expect(result).toBe('{"key":"plain-value"}');
        expect(mockedExecSync).not.toHaveBeenCalled();
    });
});
