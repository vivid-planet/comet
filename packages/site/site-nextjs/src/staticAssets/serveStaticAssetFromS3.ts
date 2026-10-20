import { GetObjectCommand, NoSuchKey, type S3Client } from "@aws-sdk/client-s3";
import { existsSync } from "fs";
import type { ServerResponse } from "http";
import { posix } from "path";
import type { Readable } from "stream";
import { pipeline } from "stream/promises";

type ServeStaticAssetFromS3Options = {
    pathname: string | null | undefined;
    res: ServerResponse;
    s3Client: S3Client;
    bucket?: string;
    keyPrefix?: string;
};

/**
 * Serves a `/_next/static` file that's missing in this build from the S3 bucket, which holds the static assets of every deployed build.
 * During a rolling deployment, a request for a static asset of another build can reach this instance.
 *
 * @returns `true` if the file was served, `false` if Next.js should handle the request
 */
export async function serveStaticAssetFromS3({ pathname, res, s3Client, bucket, keyPrefix = "" }: ServeStaticAssetFromS3Options): Promise<boolean> {
    const filePath = decodePathname(pathname);
    if (!bucket || !filePath?.startsWith("/_next/static/") || filePath.includes("..") || existsSync(`.next${filePath.slice("/_next".length)}`)) {
        return false;
    }

    const key = posix.join(keyPrefix, filePath.slice(1));
    const staticAsset = await s3Client.send(new GetObjectCommand({ Bucket: bucket, Key: key })).catch((error: unknown) => {
        if (!(error instanceof NoSuchKey)) {
            console.error(`Failed to load static asset ${key} from S3`, error);
        }
        return undefined;
    });
    if (!staticAsset) {
        return false;
    }

    if (staticAsset.ContentType) {
        res.setHeader("Content-Type", staticAsset.ContentType);
    }
    if (staticAsset.CacheControl) {
        res.setHeader("Cache-Control", staticAsset.CacheControl);
    }
    await pipeline(staticAsset.Body as Readable, res);
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
