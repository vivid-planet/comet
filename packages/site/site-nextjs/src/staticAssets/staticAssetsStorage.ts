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

// Not the SDK's S3ClientConfig, so the types don't require @aws-sdk/client-s3 when using another driver
export type S3StaticAssetsStorageConfig = {
    bucket: string;
    region?: string;
    endpoint?: string;
    credentials?: { accessKeyId: string; secretAccessKey: string };
};

export type StaticAssetsStorageConfig =
    { driver: "s3"; s3: S3StaticAssetsStorageConfig } | { driver: "azure"; azure: { accountName: string; accountKey: string; container: string } };

/**
 * Creates the storage holding the static assets of every deployed build.
 * Only the SDK of the chosen driver (`@aws-sdk/client-s3` or `@azure/storage-blob`) is loaded, so only that one needs to be installed.
 */
export async function createStaticAssetsStorage(config: StaticAssetsStorageConfig): Promise<StaticAssetsStorage> {
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
