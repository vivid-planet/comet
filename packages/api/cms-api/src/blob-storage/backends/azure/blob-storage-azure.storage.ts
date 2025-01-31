import { type BlobHTTPHeaders, BlobServiceClient, RestError, StorageSharedKeyCredential } from "@azure/storage-blob";
import { Readable } from "stream";

import { type BlobStorageBackendInterface, type CreateFileOptions, type StorageMetaData } from "../blob-storage-backend.interface";
import { type BlobStorageAzureConfig } from "./blob-storage-azure.config";

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
        const maxNumberOfAttempts = 3;
        let currentAttempt = 1;

        while (currentAttempt <= maxNumberOfAttempts) {
            try {
                await this.client.createContainer(folderName);
                return;
            } catch (error) {
                // When a container is deleted, Azure doesn't allow to create a container with the same name for at least 30 seconds. We therefore
                // retry the creation for three times if the container is being deleted, waiting 30 seconds between each attempt.
                // See https://docs.microsoft.com/en-us/rest/api/storageservices/delete-container#remarks for more information.
                if (error instanceof RestError && error.code === "ContainerBeingDeleted") {
                    console.info(`Container is being deleted, retrying in 30s`);
                    await this.sleep(30);
                    currentAttempt++;
                    console.info(`Retrying... (Attempt ${currentAttempt} of ${maxNumberOfAttempts})`);
                    continue;
                }

                throw error;
            }
        }
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

    async getFile(folderName: string, fileName: string): Promise<Readable> {
        const response = await this.client.getContainerClient(folderName).getBlobClient(fileName).download();
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        return Readable.from(response.readableStreamBody!); // is defined in node.js but not for browsers
    }

    async getPartialFile(folderName: string, fileName: string, offset: number, length: number): Promise<Readable> {
        const response = await this.client.getContainerClient(folderName).getBlobClient(fileName).download(offset, length);
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        return Readable.from(response.readableStreamBody!); // is defined in node.js but not for browsers
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

    private async sleep(s: number): Promise<void> {
        return new Promise((resolve) => {
            setTimeout(resolve, s * 1000);
        });
    }
}
