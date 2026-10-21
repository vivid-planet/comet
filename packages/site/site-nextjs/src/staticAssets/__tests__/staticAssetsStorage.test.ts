// @vitest-environment node
import { text } from "stream/consumers";
import { describe, expect, it } from "vitest";

import { createStaticAssetsStorage } from "../staticAssetsStorage";

describe("createStaticAssetsStorage", () => {
    it("stores and returns a file with its content type and cache header", async () => {
        const storage = await createStaticAssetsStorage({ scheme: "memory", options: {} });

        await storage.putFile("site/_next/static/chunks/main.js", {
            body: Buffer.from("main"),
            contentType: "text/javascript; charset=utf-8",
            cacheControl: "public, max-age=31536000, immutable",
        });
        const staticAsset = await storage.getFile("site/_next/static/chunks/main.js");

        if (!staticAsset) {
            throw new Error("Expected the stored file");
        }
        expect(staticAsset.contentType).toBe("text/javascript; charset=utf-8");
        expect(staticAsset.cacheControl).toBe("public, max-age=31536000, immutable");
        expect(await text(staticAsset.body)).toBe("main");
    });

    it("returns undefined for a missing file", async () => {
        const storage = await createStaticAssetsStorage({ scheme: "memory", options: {} });

        expect(await storage.getFile("site/_next/static/chunks/missing.js")).toBeUndefined();
    });

    it("checks whether a file exists", async () => {
        const storage = await createStaticAssetsStorage({ scheme: "memory", options: {} });
        await storage.putFile("site/_next/static-uploads/build-1", { body: Buffer.from("build-1") });

        expect(await storage.hasFile("site/_next/static-uploads/build-1")).toBe(true);
        expect(await storage.hasFile("site/_next/static-uploads/build-2")).toBe(false);
    });
});
