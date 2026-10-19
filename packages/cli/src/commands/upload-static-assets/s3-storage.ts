import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { readFile } from "fs/promises";

import type { StaticAssetsStorage } from "./storage";

export class S3StaticAssetsStorage implements StaticAssetsStorage {
    private readonly client: S3Client;

    constructor(private readonly config: { bucket: string; region: string; endpoint?: string; accessKeyId?: string; secretAccessKey?: string }) {
        const { region, endpoint, accessKeyId, secretAccessKey } = config;
        this.client = new S3Client({
            region,
            endpoint,
            // Without explicit credentials the SDK's default provider chain applies, e.g. IAM roles
            credentials: accessKeyId && secretAccessKey ? { accessKeyId, secretAccessKey } : undefined,
        });
    }

    async uploadFile(key: string, filePath: string): Promise<void> {
        await this.client.send(new PutObjectCommand({ Bucket: this.config.bucket, Key: key, Body: await readFile(filePath) }));
    }
}
