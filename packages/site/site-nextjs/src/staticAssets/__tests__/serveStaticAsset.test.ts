// @vitest-environment node
import { GetObjectCommand, type GetObjectCommandOutput, HeadObjectCommand, NoSuchKey, NotFound, S3Client } from "@aws-sdk/client-s3";
import { AwsS3StorageAdapter } from "@flystorage/aws-s3";
import { FileStorage } from "@flystorage/file-storage";
import { mockClient } from "aws-sdk-client-mock";
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "fs";
import { createServer, type Server, type ServerResponse } from "http";
import type { AddressInfo } from "net";
import { tmpdir } from "os";
import { join } from "path";
import { Readable } from "stream";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { serveStaticAsset } from "../serveStaticAsset";

describe("serveStaticAsset", () => {
    const cwd = process.cwd();
    const s3Mock = mockClient(S3Client);
    const storage = new FileStorage(new AwsS3StorageAdapter(new S3Client({ region: "eu-central-1" }), { bucket: "static-assets", prefix: "site" }));
    let projectDir: string;
    let server: Server;
    let baseUrl: string;

    beforeEach(async () => {
        projectDir = mkdtempSync(join(tmpdir(), "serve-static-asset-"));
        mkdirSync(join(projectDir, ".next/static/chunks/app/[language]"), { recursive: true });
        writeFileSync(join(projectDir, ".next/static/chunks/local.js"), "local");
        writeFileSync(join(projectDir, ".next/static/chunks/app/[language]/local.js"), "local");
        process.chdir(projectDir);

        s3Mock.on(GetObjectCommand).rejects(new NoSuchKey({ message: "NoSuchKey", $metadata: { httpStatusCode: 404 } }));
        s3Mock.on(HeadObjectCommand).rejects(new NotFound({ message: "NotFound", $metadata: { httpStatusCode: 404 } }));
        for (const key of ["site/_next/static/chunks/old.js", "site/_next/static/chunks/app/[language]/old.js"]) {
            s3Mock.on(GetObjectCommand, { Bucket: "static-assets", Key: key }).callsFake(() => ({
                Body: Readable.from(["old"]) as unknown as GetObjectCommandOutput["Body"],
            }));
            s3Mock.on(HeadObjectCommand, { Bucket: "static-assets", Key: key }).resolves({ ContentType: "text/javascript; charset=utf-8" });
        }

        server = createServer(async (req, res) => {
            if (!(await serveStaticAsset({ pathname: req.url, res, storage }))) {
                res.statusCode = 404;
                res.end("handled by Next.js");
            }
        });
        await new Promise<void>((resolve) => server.listen(0, resolve));
        baseUrl = `http://localhost:${(server.address() as AddressInfo).port}`;
    });

    afterEach(() => {
        server.close();
        s3Mock.reset();
        process.chdir(cwd);
        rmSync(projectDir, { recursive: true });
    });

    it("serves a static asset missing in this build from the storage", async () => {
        const response = await fetch(`${baseUrl}/_next/static/chunks/old.js`);

        expect(response.status).toBe(200);
        expect(response.headers.get("content-type")).toBe("text/javascript; charset=utf-8");
        expect(response.headers.get("cache-control")).toBe("public, max-age=31536000, immutable");
        expect(await response.text()).toBe("old");
    });

    it("serves a static asset with an escaped path from the storage", async () => {
        const response = await fetch(`${baseUrl}/_next/static/chunks/app/%5Blanguage%5D/old.js`);

        expect(await response.text()).toBe("old");
    });

    it("leaves a static asset of this build to Next.js", async () => {
        expect(await (await fetch(`${baseUrl}/_next/static/chunks/local.js`)).text()).toBe("handled by Next.js");
        expect(await (await fetch(`${baseUrl}/_next/static/chunks/app/%5Blanguage%5D/local.js`)).text()).toBe("handled by Next.js");
        expect(s3Mock.calls()).toHaveLength(0);
    });

    it("leaves a static asset missing in the storage to Next.js", async () => {
        const consoleError = vi.spyOn(console, "error");

        expect(await (await fetch(`${baseUrl}/_next/static/chunks/missing.js`)).text()).toBe("handled by Next.js");
        expect(consoleError).not.toHaveBeenCalled();

        consoleError.mockRestore();
    });

    it("leaves a static asset to Next.js and logs the error if the storage fails", async () => {
        s3Mock.reset();
        s3Mock.on(GetObjectCommand).rejects(new Error("Access Denied"));
        const consoleError = vi.spyOn(console, "error").mockImplementation(() => undefined);

        expect(await (await fetch(`${baseUrl}/_next/static/chunks/old.js`)).text()).toBe("handled by Next.js");
        expect(consoleError).toHaveBeenCalled();

        consoleError.mockRestore();
    });

    it("leaves other paths to Next.js", async () => {
        expect(await (await fetch(`${baseUrl}/en/page`)).text()).toBe("handled by Next.js");
        expect(s3Mock.calls()).toHaveLength(0);
    });

    it("leaves paths leaving the static assets to Next.js", async () => {
        expect(await serveStaticAsset({ pathname: "/_next/static/../../package.json", res: {} as ServerResponse, storage })).toBe(false);
        expect(s3Mock.calls()).toHaveLength(0);
    });

    it("leaves all requests to Next.js without a storage", async () => {
        expect(await serveStaticAsset({ pathname: "/_next/static/chunks/old.js", res: {} as ServerResponse })).toBe(false);
    });
});
