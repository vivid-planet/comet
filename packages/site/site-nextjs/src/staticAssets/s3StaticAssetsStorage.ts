import { GetObjectCommand, NoSuchKey, S3Client } from "@aws-sdk/client-s3";
import type { Readable } from "stream";

import type { S3StaticAssetsStorageConfig, StaticAssetsStorage } from "./staticAssetsStorage";

export function createS3StaticAssetsStorage({ bucket, ...clientConfig }: S3StaticAssetsStorageConfig): StaticAssetsStorage {
    const client = new S3Client(clientConfig);

    return {
        async getFile(key) {
            try {
                const object = await client.send(new GetObjectCommand({ Bucket: bucket, Key: key }));
                return { body: object.Body as Readable, contentType: object.ContentType, cacheControl: object.CacheControl };
            } catch (error) {
                if (error instanceof NoSuchKey) {
                    return undefined;
                }
                throw error;
            }
        },
    };
}
