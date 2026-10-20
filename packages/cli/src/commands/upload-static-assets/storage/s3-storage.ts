import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { readFile } from "fs/promises";

import type { StaticAssetsStorage } from "./storage";

export class S3StaticAssetsStorage implements StaticAssetsStorage {
    private readonly client: S3Client;

    constructor(
        private readonly config: {
            region: string;
            endpoint?: string;
            bucket: string;
            credentials?: { accessKeyId: string; secretAccessKey: string };
        },
    ) {
        const { region, endpoint, credentials } = config;
        // Without explicit credentials the SDK's default provider chain applies, e.g. IAM roles
        this.client = new S3Client({ region, endpoint, credentials });
    }

    async uploadFile(key: string, filePath: string): Promise<void> {
        await this.client.send(new PutObjectCommand({ Bucket: this.config.bucket, Key: key, Body: await readFile(filePath) }));
    }
}
