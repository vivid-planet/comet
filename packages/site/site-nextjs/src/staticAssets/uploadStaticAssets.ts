import type { Dirent } from "fs";
import { readdir, readFile } from "fs/promises";
import { lookup } from "mime-types";
import type { Operator } from "opendal";
import { join, posix, relative, sep } from "path";

const uploadConcurrency = 10;

type UploadStaticAssetsOptions = {
    /**
     * The OpenDAL operator of the storage holding the static assets of every deployed build.
     * Without a storage, nothing is uploaded, e.g., in local development
     */
    storage?: Operator;
    keyPrefix?: string;
};

/**
 * Uploads the `.next/static` files of this build to the storage, so that instances of other builds can serve them with `serveStaticAsset`.
 * Call it before the server starts listening, so that no page of this build is delivered before its files are in the storage.
 *
 * Every instance calls it on startup. Once an instance has uploaded all files, it stores a marker for the build, and later instances skip the upload.
 * Instances that start at the same time may upload the same files, which is harmless because the file names contain content hashes.
 */
export async function uploadStaticAssets({ storage, keyPrefix = "" }: UploadStaticAssetsOptions): Promise<void> {
    if (!storage) {
        return;
    }

    const buildId = (await readFile(".next/BUILD_ID", "utf-8")).trim();
    // Outside of _next/static, so serveStaticAsset never serves the marker
    const markerKey = posix.join(keyPrefix, "_next/static-uploads", buildId);
    if (await storage.exists(markerKey)) {
        return;
    }

    const filePaths = (await readdir(".next/static", { recursive: true, withFileTypes: true }))
        .filter((entry: Dirent) => entry.isFile())
        .map((entry: Dirent) => relative(".next", join(entry.parentPath, entry.name)).split(sep).join("/"));

    const queue = [...filePaths];
    await Promise.all(
        Array.from({ length: uploadConcurrency }, async () => {
            for (let filePath = queue.shift(); filePath !== undefined; filePath = queue.shift()) {
                await storage.write(posix.join(keyPrefix, "_next", filePath), await readFile(join(".next", filePath)), {
                    contentType: lookup(filePath) || "application/octet-stream",
                    cacheControl: "public, max-age=31536000, immutable",
                });
            }
        }),
    );

    await storage.write(markerKey, buildId);
}
