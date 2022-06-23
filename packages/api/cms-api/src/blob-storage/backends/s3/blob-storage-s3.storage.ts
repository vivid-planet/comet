import * as AWS from "@aws-sdk/client-s3";
import { SdkError } from "@aws-sdk/types";
import { createReadStream } from "fs";
import { Readable } from "stream";

import { BlobStorageBackendInterface, CreateFileOptions, StorageMetaData } from "../blob-storage-backend.interface";
import { BlobStorageS3Config } from "./blob-storage-s3.config";

export class BlobStorageS3Storage implements BlobStorageBackendInterface {
    private readonly client: AWS.S3Client;

    constructor(config: BlobStorageS3Config["s3"]) {
        this.client = new AWS.S3({
            credentials: {
                accessKeyId: config.accessKeyId,
                secretAccessKey: config.secretAccessKey,
            },
            endpoint: config.endpoint,
            region: config.region,
        });
    }

    async folderExists(folderName: string): Promise<boolean> {
        try {
            await this.client.send(
                new AWS.HeadBucketCommand({
                    Bucket: folderName,
                }),
            );
        } catch (error) {
            if ((error as SdkError)?.$response?.statusCode === 404) {
                return false;
            }
            throw error;
        }

        return true;
    }

    async createFolder(folderName: string): Promise<void> {
        await this.client.send(
            new AWS.CreateBucketCommand({
                Bucket: folderName,
            }),
        );
    }

    async removeFolder(folderName: string): Promise<void> {
        await this.client.send(
            new AWS.DeleteBucketCommand({
                Bucket: folderName,
            }),
        );
    }

    async fileExists(folderName: string, fileName: string): Promise<boolean> {
        try {
            await this.client.send(
                new AWS.HeadObjectCommand({
                    Bucket: folderName,
                    Key: fileName,
                }),
            );
        } catch (error) {
            if ((error as SdkError)?.$response?.statusCode === 404) {
                return false;
            }
            throw error;
        }

        return true;
    }

    async createFile(
        folderName: string,
        fileName: string,
        data: NodeJS.ReadableStream | Buffer | string,
        { headers, size }: CreateFileOptions,
    ): Promise<void> {
        const metadata = {
            headers: JSON.stringify(headers),
        };

        const input: AWS.PutObjectCommandInput = {
            Bucket: folderName,
            Key: fileName,
            ContentType: headers["content-type"],
            ContentLength: size,
            Metadata: metadata,
        };

        if (typeof data === "string") {
            input.Body = createReadStream(data);
        } else if (Buffer.isBuffer(data)) {
            input.Body = data;
        } else {
            input.Body = Readable.from(data);
        }
        await this.client.send(new AWS.PutObjectCommand(input));
    }

    async getFile(folderName: string, fileName: string): Promise<NodeJS.ReadableStream> {
        const response = await this.client.send(
            new AWS.GetObjectCommand({
                Bucket: folderName,
                Key: fileName,
            }),
        );

        // Blob is not supported and used in node
        return Readable.from(response.Body as Readable | NodeJS.ReadableStream);
    }

    async getPartialFile(folderName: string, fileName: string, offset: number, length: number): Promise<NodeJS.ReadableStream> {
        const response = await this.client.send(
            new AWS.GetObjectCommand({
                Bucket: folderName,
                Key: fileName,
                Range: `bytes=${offset}-${offset + length - 1}`,
            }),
        );

        // Blob is not supported and used in node
        return Readable.from(response.Body as Readable | NodeJS.ReadableStream);
    }

    async removeFile(folderName: string, fileName: string): Promise<void> {
        await this.client.send(
            new AWS.DeleteObjectCommand({
                Bucket: folderName,
                Key: fileName,
            }),
        );
    }

    async getFileMetaData(folderName: string, fileName: string): Promise<StorageMetaData> {
        const response = await this.client.send(
            new AWS.HeadObjectCommand({
                Bucket: folderName,
                Key: fileName,
            }),
        );

        return {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            size: response.ContentLength!,
            etag: response.ETag,
            lastModified: response.LastModified,
            headers: response.Metadata?.headers ? JSON.parse(response.Metadata.headers) : {},
        };
    }

    getBackendFilePathPrefix(): string {
        return "s3:///";
    }
}
