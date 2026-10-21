import { existsSync } from "fs";
import type { ServerResponse } from "http";
import { posix } from "path";
import { pipeline } from "stream/promises";

import type { StaticAssetsStorage } from "./staticAssetsStorage";

type ServeStaticAssetOptions = {
    pathname: string | null | undefined;
    res: ServerResponse;
    /**
     * Without a storage, all requests are left to Next.js, e.g., in local development
     */
    storage?: StaticAssetsStorage;
    keyPrefix?: string;
};

/**
 * Serves a `/_next/static` file that's missing in this build from the storage, which holds the static assets of every deployed build.
 * During a rolling deployment, a request for a static asset of another build can reach this instance.
 *
 * @returns `true` if the file was served, `false` if Next.js should handle the request
 */
export async function serveStaticAsset({ pathname, res, storage, keyPrefix = "" }: ServeStaticAssetOptions): Promise<boolean> {
    const filePath = decodePathname(pathname);
    if (!storage || !filePath?.startsWith("/_next/static/") || filePath.includes("..") || existsSync(`.next${filePath.slice("/_next".length)}`)) {
        return false;
    }

    const key = posix.join(keyPrefix, filePath.slice(1));
    const staticAsset = await storage.getFile(key).catch((error: unknown) => {
        console.error(`Failed to load static asset ${key} from the storage`, error);
        return undefined;
    });
    if (!staticAsset) {
        return false;
    }

    if (staticAsset.contentType) {
        res.setHeader("Content-Type", staticAsset.contentType);
    }
    if (staticAsset.cacheControl) {
        res.setHeader("Cache-Control", staticAsset.cacheControl);
    }
    await pipeline(staticAsset.body, res);
    return true;
}

// Next.js requests chunks of dynamic routes with escaped brackets, e.g. /_next/static/chunks/app/%5Blanguage%5D/page.js
function decodePathname(pathname: string | null | undefined): string | undefined {
    try {
        return pathname ? decodeURIComponent(pathname) : undefined;
    } catch {
        return undefined;
    }
}
