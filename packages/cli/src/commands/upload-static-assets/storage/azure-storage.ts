import { BlobServiceClient, type ContainerClient, StorageSharedKeyCredential } from "@azure/storage-blob";

import { getContentType } from "./content-type";
import type { StaticAssetsStorage } from "./storage";

export class AzureStaticAssetsStorage implements StaticAssetsStorage {
    private readonly containerClient: ContainerClient;

    constructor(config: { accountName: string; accountKey: string; container: string }) {
        const credential = new StorageSharedKeyCredential(config.accountName, config.accountKey);
        const serviceClient = new BlobServiceClient(`https://${config.accountName}.blob.core.windows.net`, credential);
        this.containerClient = serviceClient.getContainerClient(config.container);
    }

    async uploadFile(key: string, filePath: string): Promise<void> {
        await this.containerClient.getBlockBlobClient(key).uploadFile(filePath, { blobHTTPHeaders: { blobContentType: getContentType(key) } });
    }
}
