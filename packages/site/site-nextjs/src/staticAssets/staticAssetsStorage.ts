import type { S3ClientConfig } from "@aws-sdk/client-s3";
import type { Readable } from "stream";

export type StaticAsset = {
    body: Readable;
    contentType?: string;
    cacheControl?: string;
};

export interface StaticAssetsStorage {
    /**
     * @returns `undefined` if the storage doesn't have the file
     */
    getFile(key: string): Promise<StaticAsset | undefined>;
}

export type StaticAssetsStorageConfig =
    | { driver: "s3"; s3: S3ClientConfig & { bucket: string } }
    | { driver: "azure"; azure: { accountName: string; accountKey: string; container: string } };

/**
 * Creates the storage holding the static assets of every deployed build.
 * The storage's SDK (`@aws-sdk/client-s3` or `@azure/storage-blob`) is loaded on the first request, so only the one in use needs to be installed.
 */
export function createStaticAssetsStorage(config: StaticAssetsStorageConfig): StaticAssetsStorage {
    let storage: Promise<StaticAssetsStorage> | undefined;

    return {
        async getFile(key) {
            storage ??= loadStorage(config);
            return (await storage).getFile(key);
        },
    };
}

async function loadStorage(config: StaticAssetsStorageConfig): Promise<StaticAssetsStorage> {
    if (config.driver === "s3") {
        const { createS3StaticAssetsStorage } = await import("./s3StaticAssetsStorage");
        return createS3StaticAssetsStorage(config.s3);
    } else if (config.driver === "azure") {
        const { createAzureStaticAssetsStorage } = await import("./azureStaticAssetsStorage");
        return createAzureStaticAssetsStorage(config.azure);
    } else {
        throw new Error(`Unsupported static assets storage driver: ${(config as { driver: string }).driver}. Supported drivers are: s3, azure`);
    }
}
