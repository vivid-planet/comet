// @vitest-environment node
import { BlobClient, type BlobDownloadResponseParsed, RestError } from "@azure/storage-blob";
import { Readable } from "stream";
import { afterEach, describe, expect, it, vi } from "vitest";

import { createAzureStaticAssetsStorage } from "../azureStaticAssetsStorage";

describe("createAzureStaticAssetsStorage", () => {
    const storage = createAzureStaticAssetsStorage({
        accountName: "account",
        accountKey: Buffer.from("key").toString("base64"),
        container: "static-assets",
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it("returns the file with its content type and cache header", async () => {
        const download = vi.spyOn(BlobClient.prototype, "download").mockResolvedValue({
            readableStreamBody: Readable.from(["old"]),
            contentType: "text/javascript; charset=utf-8",
            cacheControl: "public, max-age=31536000, immutable",
        } as unknown as BlobDownloadResponseParsed);

        const staticAsset = await storage.getFile("site/_next/static/chunks/old.js");

        expect(staticAsset?.contentType).toBe("text/javascript; charset=utf-8");
        expect(staticAsset?.cacheControl).toBe("public, max-age=31536000, immutable");
        expect(download.mock.contexts[0]).toMatchObject({ containerName: "static-assets", name: "site/_next/static/chunks/old.js" });
    });

    it("returns undefined for a missing file", async () => {
        vi.spyOn(BlobClient.prototype, "download").mockRejectedValue(new RestError("The specified blob does not exist.", { statusCode: 404 }));

        expect(await storage.getFile("site/_next/static/chunks/missing.js")).toBeUndefined();
    });

    it("throws other errors", async () => {
        vi.spyOn(BlobClient.prototype, "download").mockRejectedValue(
            new RestError("Server failed to authenticate the request.", { statusCode: 403 }),
        );

        await expect(storage.getFile("site/_next/static/chunks/old.js")).rejects.toThrow("Server failed to authenticate the request.");
    });
});
