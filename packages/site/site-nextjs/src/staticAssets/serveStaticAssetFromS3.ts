import { GetObjectCommand, type S3Client } from "@aws-sdk/client-s3";
import { existsSync } from "fs";
import type { ServerResponse } from "http";
import { posix } from "path";
import type { Readable } from "stream";
import { pipeline } from "stream/promises";

/**
 * Serves a `/_next/static` file that's missing in this build from the S3 bucket, which holds the static assets of every deployed build.
 * During a rolling deployment, a request for a static asset of another build can reach this instance.
 *
 * @returns `true` if the file was served, `false` if Next.js should handle the request
 */
export async function serveStaticAssetFromS3(
    pathname: string | null | undefined,
    res: ServerResponse,
    { s3Client, bucket, keyPrefix = "" }: { s3Client: S3Client; bucket?: string; keyPrefix?: string },
): Promise<boolean> {
    if (!bucket || !pathname?.startsWith("/_next/static/") || pathname.includes("..") || existsSync(`.next${pathname.slice("/_next".length)}`)) {
        return false;
    }

    const staticAsset = await s3Client
        .send(new GetObjectCommand({ Bucket: bucket, Key: posix.join(keyPrefix, pathname.slice(1)) }))
        .catch(() => undefined);
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
