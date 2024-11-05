import * as AWS from "@aws-sdk/client-s3";
import { SdkError } from "@aws-sdk/types";
import { createReadStream } from "fs";
import { Readable } from "stream";

import { BlobStorageBackendInterface, CreateFileOptions, StorageMetaData } from "../blob-storage-backend.interface";
import { BlobStorageS3Config } from "./blob-storage-s3.config";

export class BlobStorageS3Storage implements BlobStorageBackendInterface {
    private readonly client: AWS.S3Client;
    private readonly config: BlobStorageS3Config["s3"];

    constructor(config: BlobStorageS3Config["s3"]) {
        this.client = new AWS.S3({
            requestHandler: config.requestHandler,
            credentials: {
                accessKeyId: config.accessKeyId,
                secretAccessKey: config.secretAccessKey,
            },
            endpoint: config.endpoint,
            region: config.region,
        });
        this.config = config;
    }

    async folderExists(folderName: string): Promise<boolean> {
        try {
            await this.client.send(
                new AWS.HeadBucketCommand({
                    Bucket: this.config.bucket ? this.config.bucket : folderName,
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
                Bucket: this.config.bucket ? this.config.bucket : folderName,
            }),
        );
    }

    async removeFolder(folderName: string): Promise<void> {
        await this.client.send(
            new AWS.DeleteBucketCommand({
                Bucket: this.config.bucket ? this.config.bucket : folderName,
            }),
        );
    }

    async fileExists(folderName: string, fileName: string): Promise<boolean> {
        try {
            await this.client.send(new AWS.HeadObjectCommand(this.getCommandInput(folderName, fileName)));
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
            ...this.getCommandInput(folderName, fileName),
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
        const response = await this.client.send(new AWS.GetObjectCommand(this.getCommandInput(folderName, fileName)));

        // Blob is not supported and used in node
        return Readable.from(response.Body as Readable | NodeJS.ReadableStream);
    }

    async getPartialFile(folderName: string, fileName: string, offset: number, length: number): Promise<NodeJS.ReadableStream> {
        const input: AWS.GetObjectCommandInput = {
            ...this.getCommandInput(folderName, fileName),
            Range: `bytes=${offset}-${offset + length - 1}`,
        };

        const response = await this.client.send(new AWS.GetObjectCommand(input));

        // Blob is not supported and used in node
        return Readable.from(response.Body as Readable | NodeJS.ReadableStream);
    }

    async removeFile(folderName: string, fileName: string): Promise<void> {
        await this.client.send(new AWS.DeleteObjectCommand(this.getCommandInput(folderName, fileName)));
    }

    async getFileMetaData(folderName: string, fileName: string): Promise<StorageMetaData> {
        const response = await this.client.send(new AWS.HeadObjectCommand(this.getCommandInput(folderName, fileName)));

        return {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            size: response.ContentLength!,
            etag: response.ETag,
            lastModified: response.LastModified,
            headers: response.Metadata?.headers ? JSON.parse(response.Metadata.headers) : {},
        };
    }

    getCommandInput(folderName: string, fileName: string): AWS.GetObjectCommandInput | AWS.HeadObjectCommandInput | AWS.DeleteObjectCommandInput {
        if (this.config.bucket) {
            return {
                Bucket: this.config.bucket,
                Key: `${folderName}/${fileName}`,
            };
        }

        return {
            Bucket: folderName,
            Key: fileName,
        };
    }

    getBackendFilePathPrefix(): string {
        return "s3://";
    }
}
