import { BlobHTTPHeaders, BlobServiceClient, StorageSharedKeyCredential } from "@azure/storage-blob";
import { Readable } from "stream";

import { BlobStorageBackendInterface, CreateFileOptions, StorageMetaData } from "../blob-storage-backend.interface";
import { BlobStorageAzureConfig } from "./blob-storage-azure.config";

export class BlobStorageAzureStorage implements BlobStorageBackendInterface {
    private readonly client: BlobServiceClient;

    constructor(private readonly config: BlobStorageAzureConfig["azure"]) {
        const sharedKeyCredential = new StorageSharedKeyCredential(config.accountName, config.accountKey);
        this.client = new BlobServiceClient(`https://${config.accountName}.blob.core.windows.net`, sharedKeyCredential);
    }

    async folderExists(folderName: string): Promise<boolean> {
        return this.client.getContainerClient(folderName).exists();
    }

    async createFolder(folderName: string): Promise<void> {
        await this.client.createContainer(folderName);
    }

    async removeFolder(folderName: string): Promise<void> {
        await this.client.deleteContainer(folderName);
    }

    async fileExists(folderName: string, fileName: string): Promise<boolean> {
        return this.client.getContainerClient(folderName).getBlobClient(fileName).exists();
    }

    async createFile(
        folderName: string,
        fileName: string,
        data: NodeJS.ReadableStream | Buffer | string,
        { headers }: CreateFileOptions,
    ): Promise<void> {
        const metadata = {
            headers: JSON.stringify(headers),
        };
        const blobHTTPHeaders: BlobHTTPHeaders = {
            blobContentType: headers["content-type"],
        };

        const blockBlobClient = this.client.getContainerClient(folderName).getBlockBlobClient(fileName);
        if (typeof data === "string") {
            await blockBlobClient.uploadFile(data, { metadata, blobHTTPHeaders });
        } else if (Buffer.isBuffer(data)) {
            await blockBlobClient.uploadData(data, { metadata, blobHTTPHeaders });
        } else {
            await blockBlobClient.uploadStream(new Readable().wrap(data), undefined, undefined, {
                metadata,
                blobHTTPHeaders,
            });
        }
    }

    async getFile(folderName: string, fileName: string): Promise<NodeJS.ReadableStream> {
        const response = await this.client.getContainerClient(folderName).getBlobClient(fileName).download();
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        return response.readableStreamBody!; // is defined in node.js but not for browsers
    }

    async getPartialFile(folderName: string, fileName: string, offset: number, length: number): Promise<NodeJS.ReadableStream> {
        const response = await this.client.getContainerClient(folderName).getBlobClient(fileName).download(offset, length);
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        return response.readableStreamBody!; // is defined in node.js but not for browsers
    }

    async removeFile(folderName: string, fileName: string): Promise<void> {
        await this.client.getContainerClient(folderName).deleteBlob(fileName);
    }

    async getFileMetaData(folderName: string, fileName: string): Promise<StorageMetaData> {
        const properties = await this.client.getContainerClient(folderName).getBlobClient(fileName).getProperties();

        return {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            size: properties.contentLength!, // is defined in node.js but not for browsers
            etag: properties.etag,
            lastModified: properties.lastModified,
            headers: properties.metadata?.headers ? JSON.parse(properties.metadata.headers) : {},
        };
    }

    getBackendFilePathPrefix(): string {
        return "abs://";
    }
}
