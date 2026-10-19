import { readdir } from "fs/promises";
import { join, posix, relative, sep } from "path";

import { createStaticAssetsStorage, type StaticAssetsStorageConfig } from "./storage";

const uploadConcurrency = 10;

export async function uploadStaticAssets({
    sourceDirectory,
    prefix,
    storage: storageConfig,
}: {
    sourceDirectory: string;
    prefix: string;
    storage: StaticAssetsStorageConfig;
}): Promise<string[]> {
    const entries = await readdir(sourceDirectory, { recursive: true, withFileTypes: true });
    const relativePaths = entries
        .filter((entry) => entry.isFile())
        .map((entry) => relative(sourceDirectory, join(entry.parentPath, entry.name)))
        .sort();

    if (relativePaths.length === 0) {
        throw new Error(`No files found in ${sourceDirectory}`);
    }

    const storage = await createStaticAssetsStorage(storageConfig);
    const normalizedPrefix = prefix.replace(/^\/+|\/+$/g, "");

    const pendingPaths = [...relativePaths];
    await Promise.all(
        Array.from({ length: Math.min(uploadConcurrency, pendingPaths.length) }, async () => {
            for (let relativePath = pendingPaths.shift(); relativePath !== undefined; relativePath = pendingPaths.shift()) {
                const key = posix.join(normalizedPrefix, relativePath.split(sep).join(posix.sep));
                await storage.uploadFile(key, join(sourceDirectory, relativePath));
            }
        }),
    );

    return relativePaths;
}
