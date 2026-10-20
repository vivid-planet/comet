// @vitest-environment node
import { GetObjectCommand, type GetObjectCommandOutput, NoSuchKey, S3Client } from "@aws-sdk/client-s3";
import { mockClient } from "aws-sdk-client-mock";
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "fs";
import { createServer, type Server, type ServerResponse } from "http";
import type { AddressInfo } from "net";
import { tmpdir } from "os";
import { join } from "path";
import { Readable } from "stream";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { serveStaticAssetFromS3 } from "../serveStaticAssetFromS3";

describe("serveStaticAssetFromS3", () => {
    const s3Mock = mockClient(S3Client);
    const cwd = process.cwd();
    let projectDir: string;
    let server: Server;
    let baseUrl: string;

    beforeEach(async () => {
        projectDir = mkdtempSync(join(tmpdir(), "serve-static-asset-from-s3-"));
        mkdirSync(join(projectDir, ".next/static/chunks"), { recursive: true });
        writeFileSync(join(projectDir, ".next/static/chunks/local.js"), "local");
        process.chdir(projectDir);

        server = createServer(async (req, res) => {
            const served = await serveStaticAssetFromS3(req.url, res, {
                s3Client: new S3Client({ region: "eu-central-1" }),
                bucket: "static-assets",
                keyPrefix: "site",
            });
            if (!served) {
                res.statusCode = 404;
                res.end("handled by Next.js");
            }
        });
        await new Promise<void>((resolve) => server.listen(0, resolve));
        baseUrl = `http://localhost:${(server.address() as AddressInfo).port}`;
    });

    afterEach(() => {
        server.close();
        process.chdir(cwd);
        rmSync(projectDir, { recursive: true });
        s3Mock.reset();
    });

    it("serves a static asset missing in this build from the bucket", async () => {
        s3Mock.on(GetObjectCommand, { Bucket: "static-assets", Key: "site/_next/static/chunks/old.js" }).resolves({
            Body: Readable.from(["old"]) as unknown as GetObjectCommandOutput["Body"],
            ContentType: "text/javascript; charset=utf-8",
            CacheControl: "public, max-age=31536000, immutable",
        });

        const response = await fetch(`${baseUrl}/_next/static/chunks/old.js`);

        expect(response.status).toBe(200);
        expect(response.headers.get("content-type")).toBe("text/javascript; charset=utf-8");
        expect(response.headers.get("cache-control")).toBe("public, max-age=31536000, immutable");
        expect(await response.text()).toBe("old");
    });

    it("leaves a static asset of this build to Next.js", async () => {
        const response = await fetch(`${baseUrl}/_next/static/chunks/local.js`);

        expect(await response.text()).toBe("handled by Next.js");
        expect(s3Mock.commandCalls(GetObjectCommand)).toHaveLength(0);
    });

    it("leaves a static asset missing in the bucket to Next.js", async () => {
        s3Mock.on(GetObjectCommand).rejects(new NoSuchKey({ message: "NoSuchKey", $metadata: {} }));

        const response = await fetch(`${baseUrl}/_next/static/chunks/missing.js`);

        expect(await response.text()).toBe("handled by Next.js");
    });

    it("leaves all requests to Next.js without a bucket", async () => {
        const served = await serveStaticAssetFromS3("/_next/static/chunks/old.js", {} as ServerResponse, {
            s3Client: new S3Client({ region: "eu-central-1" }),
        });

        expect(served).toBe(false);
        expect(s3Mock.commandCalls(GetObjectCommand)).toHaveLength(0);
    });

    it("leaves paths leaving the static assets to Next.js", async () => {
        const served = await serveStaticAssetFromS3("/_next/static/../../package.json", {} as ServerResponse, {
            s3Client: new S3Client({ region: "eu-central-1" }),
            bucket: "static-assets",
        });

        expect(served).toBe(false);
        expect(s3Mock.commandCalls(GetObjectCommand)).toHaveLength(0);
    });

    it("leaves other paths to Next.js", async () => {
        const response = await fetch(`${baseUrl}/en/page`);

        expect(await response.text()).toBe("handled by Next.js");
        expect(s3Mock.commandCalls(GetObjectCommand)).toHaveLength(0);
    });
});
