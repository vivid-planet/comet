import { BlobServiceClient, RestError, StorageSharedKeyCredential } from "@azure/storage-blob";
import { Readable } from "stream";

import type { StaticAssetsStorage } from "./staticAssetsStorage";

export function createAzureStaticAssetsStorage({
    accountName,
    accountKey,
    container,
}: {
    accountName: string;
    accountKey: string;
    container: string;
}): StaticAssetsStorage {
    const containerClient = new BlobServiceClient(
        `https://${accountName}.blob.core.windows.net`,
        new StorageSharedKeyCredential(accountName, accountKey),
    ).getContainerClient(container);

    return {
        async getFile(key) {
            try {
                const blob = await containerClient.getBlobClient(key).download();
                if (!blob.readableStreamBody) {
                    return undefined;
                }
                return { body: Readable.from(blob.readableStreamBody), contentType: blob.contentType, cacheControl: blob.cacheControl };
            } catch (error) {
                if (error instanceof RestError && error.statusCode === 404) {
                    return undefined;
                }
                throw error;
            }
        },
    };
}
