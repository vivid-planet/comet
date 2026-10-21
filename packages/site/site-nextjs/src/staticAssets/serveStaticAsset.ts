import type { FileStorage, UnableToReadFile } from "@flystorage/file-storage";
import { existsSync } from "fs";
import type { ServerResponse } from "http";
import type { Readable } from "stream";
import { pipeline } from "stream/promises";

type ServeStaticAssetOptions = {
    pathname: string | null | undefined;
    res: ServerResponse;
    /**
     * A Flystorage storage holding the `.next/static` files of every deployed build under `_next/static`, e.g., with `AwsS3StorageAdapter` or `AzureStorageBlobStorageAdapter`.
     * Without a storage, all requests are left to Next.js, e.g., in local development.
     */
    storage?: FileStorage;
};

/**
 * Serves a `/_next/static` file that's missing in this build from the storage, which holds the static assets of every deployed build.
 * During a rolling deployment, a request for a static asset of another build can reach this instance.
 *
 * @returns `true` if the file was served, `false` if Next.js should handle the request
 */
export async function serveStaticAsset({ pathname, res, storage }: ServeStaticAssetOptions): Promise<boolean> {
    const filePath = decodePathname(pathname);
    if (!storage || !filePath?.startsWith("/_next/static/") || filePath.includes("..") || existsSync(`.next${filePath.slice("/_next".length)}`)) {
        return false;
    }

    const path = filePath.slice(1);
    const mimeType = storage.mimeType(path).catch(() => undefined);
    let body: Readable;
    try {
        body = await storage.read(path);
    } catch (error) {
        if (!isFileNotFoundError(error)) {
            console.error(`Failed to load static asset ${path} from the storage`, error);
        }
        return false;
    }

    const contentType = await mimeType;
    if (contentType) {
        res.setHeader("Content-Type", contentType);
    }
    // Same header as Next.js sets for its own static assets, whose names change with their content
    res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
    await pipeline(body, res);
    return true;
}

// Not checked with instanceof, because the storage may be created with Flystorage's CommonJS build, while this module would import its ES module build
function isFileNotFoundError(error: unknown): boolean {
    return (error as Partial<UnableToReadFile> | undefined)?.wasFileNotFound === true;
}

// Next.js requests chunks of dynamic routes with escaped brackets, e.g. /_next/static/chunks/app/%5Blanguage%5D/page.js
function decodePathname(pathname: string | null | undefined): string | undefined {
    try {
        return pathname ? decodeURIComponent(pathname) : undefined;
    } catch {
        return undefined;
    }
}
