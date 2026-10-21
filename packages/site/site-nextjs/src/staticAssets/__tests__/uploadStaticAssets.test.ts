// @vitest-environment node
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "fs";
import { tmpdir } from "os";
import { join } from "path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

import type { StaticAssetsStorage } from "../staticAssetsStorage";
import { uploadStaticAssets } from "../uploadStaticAssets";

describe("uploadStaticAssets", () => {
    const cwd = process.cwd();
    let projectDir: string;
    let files: Map<string, { body: Buffer; contentType?: string; cacheControl?: string }>;
    let storage: StaticAssetsStorage;

    beforeEach(() => {
        projectDir = mkdtempSync(join(tmpdir(), "upload-static-assets-"));
        mkdirSync(join(projectDir, ".next/static/chunks/app/[language]"), { recursive: true });
        mkdirSync(join(projectDir, ".next/static/media"), { recursive: true });
        writeFileSync(join(projectDir, ".next/BUILD_ID"), "build-1\n");
        writeFileSync(join(projectDir, ".next/static/chunks/main.js"), "main");
        writeFileSync(join(projectDir, ".next/static/chunks/app/[language]/page.js"), "page");
        writeFileSync(join(projectDir, ".next/static/media/font.woff2"), "font");
        process.chdir(projectDir);

        files = new Map();
        storage = {
            getFile: async () => undefined,
            hasFile: async (key) => files.has(key),
            putFile: async (key, file) => {
                files.set(key, file);
            },
        };
    });

    afterEach(() => {
        process.chdir(cwd);
        rmSync(projectDir, { recursive: true, force: true });
    });

    it("uploads every file of .next/static with its content type and an immutable cache header", async () => {
        await uploadStaticAssets({ storage, keyPrefix: "site" });

        expect(files.get("site/_next/static/chunks/main.js")).toMatchObject({
            contentType: "text/javascript",
            cacheControl: "public, max-age=31536000, immutable",
        });
        expect(files.get("site/_next/static/chunks/app/[language]/page.js")?.body.toString()).toBe("page");
        expect(files.get("site/_next/static/media/font.woff2")?.contentType).toBe("font/woff2");
    });

    it("marks the build as uploaded", async () => {
        await uploadStaticAssets({ storage, keyPrefix: "site" });

        expect(files.has("site/_next/static-uploads/build-1")).toBe(true);
    });

    it("skips the upload when the build is already uploaded", async () => {
        files.set("site/_next/static-uploads/build-1", { body: Buffer.from("build-1") });

        await uploadStaticAssets({ storage, keyPrefix: "site" });

        expect([...files.keys()]).toEqual(["site/_next/static-uploads/build-1"]);
    });

    it("does nothing without a storage", async () => {
        await expect(uploadStaticAssets({ storage: undefined })).resolves.toBeUndefined();
    });
});
