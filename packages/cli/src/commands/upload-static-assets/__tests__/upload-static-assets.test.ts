import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { mockClient } from "aws-sdk-client-mock";
import fs from "fs";
import os from "os";
import { join } from "path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { uploadStaticAssets } from "../upload-static-assets";

describe("uploadStaticAssets", () => {
    let sourceDirectory: string;
    let targetDirectory: string;

    beforeEach(() => {
        sourceDirectory = fs.mkdtempSync(join(os.tmpdir(), "next-static-"));
        targetDirectory = fs.mkdtempSync(join(os.tmpdir(), "next-static-storage-"));

        fs.mkdirSync(join(sourceDirectory, "chunks/app"), { recursive: true });
        fs.writeFileSync(join(sourceDirectory, "chunks/app/page-abc.js"), "page");
        fs.writeFileSync(join(sourceDirectory, "chunks/main-def.js"), "main");
        fs.mkdirSync(join(sourceDirectory, "css"));
        fs.writeFileSync(join(sourceDirectory, "css/styles-ghi.css"), "styles");
    });

    afterEach(() => {
        fs.rmSync(sourceDirectory, { recursive: true, force: true });
        fs.rmSync(targetDirectory, { recursive: true, force: true });
    });

    it("copies all files below the prefix with the file driver", async () => {
        const uploadedFiles = await uploadStaticAssets({
            sourceDirectory,
            prefix: "/prod/_next/static/",
            storage: { driver: "file", file: { directory: targetDirectory } },
        });

        expect(uploadedFiles).toEqual(["chunks/app/page-abc.js", "chunks/main-def.js", "css/styles-ghi.css"]);
        expect(fs.readFileSync(join(targetDirectory, "prod/_next/static/chunks/app/page-abc.js"), "utf-8")).toBe("page");
        expect(fs.readFileSync(join(targetDirectory, "prod/_next/static/css/styles-ghi.css"), "utf-8")).toBe("styles");
    });

    it("keeps files of earlier uploads", async () => {
        fs.mkdirSync(join(targetDirectory, "prod/_next/static/chunks"), { recursive: true });
        fs.writeFileSync(join(targetDirectory, "prod/_next/static/chunks/previous-build.js"), "previous");

        await uploadStaticAssets({
            sourceDirectory,
            prefix: "prod/_next/static",
            storage: { driver: "file", file: { directory: targetDirectory } },
        });

        expect(fs.existsSync(join(targetDirectory, "prod/_next/static/chunks/previous-build.js"))).toBe(true);
    });

    it("puts every file into the bucket with the s3 driver", async () => {
        const s3Mock = mockClient(S3Client);
        s3Mock.on(PutObjectCommand).resolves({});

        await uploadStaticAssets({
            sourceDirectory,
            prefix: "prod/_next/static",
            storage: { driver: "s3", s3: { bucket: "static-assets", region: "eu-central-1" } },
        });

        const inputs = s3Mock.commandCalls(PutObjectCommand).map((call) => call.args[0].input);
        expect(inputs.map(({ Bucket, Key }) => ({ Bucket, Key }))).toEqual(
            expect.arrayContaining([
                { Bucket: "static-assets", Key: "prod/_next/static/chunks/app/page-abc.js" },
                { Bucket: "static-assets", Key: "prod/_next/static/chunks/main-def.js" },
                { Bucket: "static-assets", Key: "prod/_next/static/css/styles-ghi.css" },
            ]),
        );
        expect(inputs).toHaveLength(3);

        s3Mock.restore();
    });

    it("fails when a file can't be uploaded", async () => {
        const s3Mock = mockClient(S3Client);
        s3Mock.on(PutObjectCommand).rejects(new Error("Access Denied"));

        await expect(
            uploadStaticAssets({
                sourceDirectory,
                prefix: "prod/_next/static",
                storage: { driver: "s3", s3: { bucket: "static-assets", region: "eu-central-1" } },
            }),
        ).rejects.toThrow("Access Denied");

        s3Mock.restore();
    });

    it("fails when the source directory is empty", async () => {
        const emptyDirectory = fs.mkdtempSync(join(os.tmpdir(), "next-static-empty-"));

        await expect(
            uploadStaticAssets({
                sourceDirectory: emptyDirectory,
                prefix: "prod",
                storage: { driver: "file", file: { directory: targetDirectory } },
            }),
        ).rejects.toThrow("No files found");

        fs.rmSync(emptyDirectory, { recursive: true, force: true });
    });
});
