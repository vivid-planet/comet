// @vitest-environment node
import { describe, expect, it } from "vitest";

import { createStaticAssetsStorage, type StaticAssetsStorageConfig } from "../staticAssetsStorage";

describe("createStaticAssetsStorage", () => {
    it("creates the storage of the driver", async () => {
        const storage = await createStaticAssetsStorage({ driver: "s3", s3: { bucket: "static-assets", region: "eu-central-1" } });

        expect(storage.getFile).toBeTypeOf("function");
    });

    it("fails for an unsupported driver", async () => {
        await expect(createStaticAssetsStorage({ driver: "gcs" } as unknown as StaticAssetsStorageConfig)).rejects.toThrow(
            "Unsupported static assets storage driver: gcs",
        );
    });
});
