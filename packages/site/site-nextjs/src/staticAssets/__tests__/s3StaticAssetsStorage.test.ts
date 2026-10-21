// @vitest-environment node
import { GetObjectCommand, type GetObjectCommandOutput, NoSuchKey, S3Client } from "@aws-sdk/client-s3";
import { mockClient } from "aws-sdk-client-mock";
import { Readable } from "stream";
import { afterEach, describe, expect, it } from "vitest";

import { createS3StaticAssetsStorage } from "../s3StaticAssetsStorage";

describe("createS3StaticAssetsStorage", () => {
    const s3Mock = mockClient(S3Client);
    const storage = createS3StaticAssetsStorage({ bucket: "static-assets", region: "eu-central-1" });

    afterEach(() => {
        s3Mock.reset();
    });

    it("returns the file with its content type and cache header", async () => {
        s3Mock.on(GetObjectCommand, { Bucket: "static-assets", Key: "site/_next/static/chunks/old.js" }).resolves({
            Body: Readable.from(["old"]) as unknown as GetObjectCommandOutput["Body"],
            ContentType: "text/javascript; charset=utf-8",
            CacheControl: "public, max-age=31536000, immutable",
        });

        const staticAsset = await storage.getFile("site/_next/static/chunks/old.js");

        expect(staticAsset?.contentType).toBe("text/javascript; charset=utf-8");
        expect(staticAsset?.cacheControl).toBe("public, max-age=31536000, immutable");
    });

    it("returns undefined for a missing file", async () => {
        s3Mock.on(GetObjectCommand).rejects(new NoSuchKey({ message: "NoSuchKey", $metadata: {} }));

        expect(await storage.getFile("site/_next/static/chunks/missing.js")).toBeUndefined();
    });

    it("throws other errors", async () => {
        s3Mock.on(GetObjectCommand).rejects(new Error("Access Denied"));

        await expect(storage.getFile("site/_next/static/chunks/old.js")).rejects.toThrow("Access Denied");
    });
});
